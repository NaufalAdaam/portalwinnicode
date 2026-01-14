FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    curl \
    libonig-dev \
    libxml2-dev \
    mariadb-client \
    && docker-php-ext-install pdo pdo_mysql mbstring xml

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN php artisan config:clear && php artisan config:cache

EXPOSE 8080

CMD php artisan serve --host=0.0.0.0 --port=8080
