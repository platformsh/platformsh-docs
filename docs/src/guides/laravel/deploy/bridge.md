---
title: "Laravel Bridge"
sidebarTitle: "Laravel Bridge"
weight: -100
toc: false
description: |
  The Laravel Bridge connects a Laravel-based application to Platform.sh.
---

This `platformsh/laravel-bridge` bridge library connects a Laravel-based
application to Platform.sh.

Laravel prefers all configuration to come in through environment variables with
specific names in a specific format. Platform.sh provides configuration information
as environment variables in a different specific format. This library handles
mapping the Platform.sh variables to the format Laravel expects for common values.

## Usage

Require this package using Composer. When Composer's autoload is included this
library will be activated and the environment variables set.

``` bash
composer require platformsh/laravel-bridge
```

Make sure to clear the cache on relevant platform.sh environments afterwards.

``` bash
php artisan optimize:clear
```


## Mappings performed

* If a Platform.sh relationship named `database` is defined, it will be taken as an SQL database and mapped to the `DB_*` environment variables for Laravel.

* If a Platform.sh relationship named `rediscache` is defined, it will be mapped to the `REDIS_*` environment variables for Laravel.  Additionally, the `CACHE_DRIVER` variable will be set to `redis` to activate it automatically.

* If a Platform.sh relationship named `redissession` is defined, the `SESSION_DRIVER` will be set to `redis` and the `REDIS_*` variables set based on that relationship. NOTE: This means you _*must*_ set 2 relationships to the same Redis service and endpoint, as Laravel reuses the same backend connection.

* The Laravel `APP_KEY` is set based on the `PLATFORM_PROJECT_ENTROPY` variable, which is provided for exactly this purpose.

* The Laravel `APP_URL` variable is set based on the current route if possible.

* The `SESSION_SECURE_COOKIE` variable is set to true if it's not already defined.  A Platform.sh environment is by default encrypted-always, so there's no reason to allow unencrypted cookies.  This can be overridden by setting the Platform.sh variable `env:SESSION_SECURE_COOKIE` to 0.

* The `MAIL_DRIVER`, `MAIL_HOST`, and `MAIL_PORT` variables are set to support sending email through the Platform.sh mail gateway.  The `MAIL_ENCRYPTION` value is also set to `0` to disable TLS, as it is not needed or supported within Platform.sh's network.  Note, however, that doing so is only supported on Laravel 6.0.4 and later.  On earlier versions you *must* manually modify `mail.php` and set `encryption` to `null`:

```php
    'encryption' => null,
```

## Common environment variables not set

Laravel provides reasonable defaults for many environment variables already and this library does not override those.  They may, however, be customized by setting a Platform.sh variable named `env:ENV_NAME`. (Note the `env:` prefix.)  The most likely variables to override are listed below for convenience:

* `env:APP_NAME`: The human-friendly name of the application.
* `env:APP_ENV`: Whether the application is in `production` or `development` mode.
* `env:APP_DEBUG`: Set true to enable verbose error messages.