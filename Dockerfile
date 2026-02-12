# --- Stage 1: Build Frontend (Node.js) ---
FROM node:18 AS frontend
WORKDIR /app
COPY package*.json vite.config.js ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Build Backend (PHP) ---
FROM php:8.2-cli

# Install dependencies sistem & ekstensi PHP
RUN apt-get update && apt-get install -y \
    zip unzip git curl libonig-dev libxml2-dev mariadb-client \
    && docker-php-ext-install pdo pdo_mysql mbstring xml

# Copy Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy seluruh kodingan Laravel
COPY . .

# Copy hasil build React dari Stage 1 ke folder public/build
COPY --from=frontend /app/public/build public/build

# Install dependencies Laravel
RUN composer install --no-dev --optimize-autoloader

# Set permission storage
RUN chmod -R 775 storage bootstrap/cache

# Expose port (Railway butuh ini)
EXPOSE 8080

CMD sh -c "php artisan optimize:clear; php artisan migrate --force; php artisan serve --host=0.0.0.0 --port=8080"

# Command untuk menjalankan server (PENTING! Dockerfile kamu sebelumnya gak punya ini)
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8080