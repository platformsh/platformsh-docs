---
title: "Laravel Bridge"
sidebarTitle: "Laravel Bridge"
weight: -100
description: Connect your Laravel-based app to {{% vendor/name %}} with Laravel Bridge.
---

Connect your Laravel-based app to {{% vendor/name %}} with the `platformsh/laravel-bridge` library.

Laravel expects all configuration to come in through environment variables with specific names in a specific format.
{{% vendor/name %}} provides configuration information as environment variables in a different specific format.
This library handles mapping the {{% vendor/name %}} variables to the format Laravel expects for common values.

## Usage

Require this package using Composer.
When Composer's autoload is included, this library is activated and the environment variables set.

``` bash
composer require platformsh/laravel-bridge
```

Make sure to clear the cache on relevant {{% vendor/name %}} environments afterwards.

``` bash
php artisan optimize:clear
```

## What is mapped

* If a {{% vendor/name %}} relationship named `database` is defined,
  it is taken as an SQL database and mapped to the `DB_*` environment variables for Laravel.
* If a {{% vendor/name %}} relationship named `rediscache` is defined,
  it is mapped to the `REDIS_*` environment variables for Laravel.
  The `CACHE_DRIVER` variable is also set to `redis` to activate it automatically.
* If a {{% vendor/name %}} relationship named `redissession` is defined,
  the `SESSION_DRIVER` is set to `redis` and the `REDIS_*` variables set based on that relationship.
  NOTE: This means you _*must*_ set 2 relationships to the same Redis service and endpoint,
  as Laravel reuses the same backend connection.
* The Laravel `APP_KEY` is set based on the `PLATFORM_PROJECT_ENTROPY` variable,
  which is provided for exactly this purpose.
* The Laravel `APP_URL` variable is set based on the current route, when possible.
* The `SESSION_SECURE_COOKIE` variable is set to `true` if it's not already defined.
  A {{% vendor/name %}} environment is by default encrypted-always,
  so there's no reason to allow unencrypted cookies.
  Overwrite this by setting the {{% vendor/name %}} variable `env:SESSION_SECURE_COOKIE` to 0.
* The `MAIL_DRIVER`, `MAIL_HOST`, and `MAIL_PORT` variables are set
  to support sending email through the {{% vendor/name %}} mail gateway. 
  The `MAIL_ENCRYPTION` value is also set to `0` to disable TLS,
  as it isn't needed or supported within {{% vendor/name %}}'s network.
  Note that doing so is only supported on Laravel 6.0.4 and later.
  On earlier versions, you *must* manually modify `mail.php` and set `encryption` to `null`:

  ```php
      'encryption' => null,
  ```

## Common environment variables not set

Laravel provides reasonable defaults for many environment variables already
and this library doesn't override those.
Customize them by setting a {{% vendor/name %}} variable named `env:ENV_NAME`.
(Note the `env:` prefix.)

The variables you are most likely to want to override are:

* `env:APP_NAME`: The human-friendly name of the app.
* `env:APP_ENV`: Whether the app is in `production` or `development` mode.
* `env:APP_DEBUG`: Set `true` to enable verbose error messages.

Now that your Laravel app is connected to {{% vendor/name %}}, deploy it to see it in action.

{{< guide-buttons previous="Back" next="Schedule tasks" >}}
