---
title: "Debug with Laravel Telescope"
weight: -87
description: |
    Setting up Laravel Telescope for debugging Laravel
---

Laravel Telescope makes a wonderful companion to your local Laravel development environment. Telescope provides insight into the requests coming into your application, exceptions, log entries, database queries, queued jobs, mail, notifications, cache operations, scheduled tasks, variable dumps, and more.

Our goal is to setup Laravel Telescope only on **non production** environments.

## Create the APP_DEBUG variable

Start by adding the `APP_DEBUG` & `TELESCOPE_ENABLED` variables on your project:

```bash
{{< vendor/cli >}} variable:create --level environment --name env:APP_DEBUG --value false
{{< vendor/cli >}} variable:create --level environment --name env:TELESCOPE_ENABLED --value false
```

Note that we are setting the default values for our main environment to `false`. We can now override them on the other environments:

```bash
{{< vendor/cli >}} variable:update -e {{< variable "ENVIRONMENT" >}} --value true env:APP_DEBUG
{{< vendor/cli >}} variable:update -e {{< variable "ENVIRONMENT" >}} --value true env:TELESCOPE_ENABLED
```

## Adding Telescope to the project

Use composer to add Laravel Telescope to your local project:

```bash
composer require laravel/telescope
php artisan telescope:install
```

We also need to add the `install` command in our `build` hook so it is run on every deploy. Head to `{{< vendor/configfile "app" >}}` and update it with the following:

```yaml
build: |
        set -eux
        composer --no-ansi --no-interaction install --no-progress --prefer-dist --optimize-autoloader --no-dev
+       php artisan telescope:install
```

Please refer to the official [Laravel Telecope documentation](https://laravel.com/docs/master/telescope#installation) for more options and managing authentication for the dashboard.

## Deploying the new release

You can now enable it by pushing the change to `{{< vendor/name >}}`:

```bash
git add .
git commit -m "Enable Laravel Horizon"
{{< vendor/cli >}} push
```

Once done, you can now access the `/telescope` endpoint of your application.

![Laravel Horizon Dashboard](/images/guides/laravel/telescope-dashboard.png "0.5")
