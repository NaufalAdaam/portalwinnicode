FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    zip unzip git curl libonig-dev libxml2-dev mariadb-client \
    && docker-php-ext-install pdo pdo_mysql mbstring xml

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8080

CMD php -S 0.0.0.0:8080 -t public
