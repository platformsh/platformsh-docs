---
title: "Debug with Laravel Telescope"
weight: -87
description: |
    Setting up Laravel Telescope for debugging Laravel
---

Laravel Telescope complements your local Laravel development environment.
With Telescope, get insight into the requests coming into your app, exceptions, log entries, database queries, queued jobs, mail, notifications, cache operations, scheduled tasks, variable dumps, and more.

To set up Laravel Telescope on your **non-production** environments,
follow these steps.

## 1. Create the APP_DEBUG variable

To add the `APP_DEBUG` & `TELESCOPE_ENABLED` variables on your project, run the following commands:

```bash {location="Terminal"}
{{< vendor/cli >}} variable:create --level environment --name env:APP_DEBUG --value false
{{< vendor/cli >}} variable:create --level environment --name env:TELESCOPE_ENABLED --value false
```

Note that the default values for your main environment are set to `false`.
To override them on other non-production environments, run the following commands:

```bash {location="Terminal"}
{{< vendor/cli >}} variable:update -e {{< variable "ENVIRONMENT" >}} --value true env:APP_DEBUG
{{< vendor/cli >}} variable:update -e {{< variable "ENVIRONMENT" >}} --value true env:TELESCOPE_ENABLED
```

## 2. Add Telescope to your project

1. Run the following Composer command:

   ```bash {location="Terminal"}
   composer require laravel/telescope && php artisan telescope:install
   ```

2. Add the `install` command to your `build` hook in your app configuration,
   so it's run on every deploy.

   ```yaml {configFile="app"}
   applications:
     myapp:
       [...]
       hooks:
         build: |
           set -eux
           composer --no-ansi --no-interaction install --no-progress --prefer-dist --optimize-autoloader --no-dev
           php artisan telescope:install
   ```

For more options and information on how to manage authentication for the dashboard,
see the [Laravel Telecope documentation](https://laravel.com/docs/master/telescope#installation).

## 3. Deploy the new release

To enable Telescope, push your changes to {{% vendor/name %}}:

```bash {location="Terminal"}
git add .
git commit -m "Enable Laravel Horizon"
{{< vendor/cli >}} push
```

You can now access the `/telescope` endpoint of your app.

![Laravel Horizon Dashboard](/images/guides/laravel/telescope-dashboard.png "0.5")

{{< note theme="tip" >}}

Telescope uses a gate defined in `TelescopeServiceProvider.php` to authorize access to the dashboard.
Check that the logic here matches your needs.

{{< /note >}}

{{< guide-buttons previous="Back" next="FAQ" nextLink="/get-started/stacks/laravel/faq.md" type="*" >}}
