---
title: "Handling queues with Horizon"
weight: -118
description: |
    Setting up Laravel Horizon
---

[Laravel Horizon](https://laravel.com/docs/master/horizon#main-content) provides a beautiful dashboard and code-driven configuration for your Laravel powered Redis queues. Horizon allows you to easily monitor key metrics of your queue system such as job throughput, runtime, and job failures.

## Adding Laravel Horizon

First make sure you followed the step on [how to configure Redis and queues](./setup-redis.html#using-redis-for-laravel-queues).

```bash
composer require laravel/horizon && php artisan horizon:install
```

We also need to add the `install` command in our `build` hook so it's run on every deploy. 
Head to `{{< vendor/configfile "app" >}}` and update it with the following:

```yaml {configFile="app"}
applications:
    myapp:
        [...]
        hooks:
            build: |
                    set -eux
                    composer --no-ansi --no-interaction install --no-progress --prefer-dist --optimize-autoloader --no-dev
                    php artisan horizon:install
```

## Creating a worker to run Horizon

We are now going to add a separate worker to run Horizon on our project. 
Open `{{< vendor/configfile "app" >}}` and add the following:

```yaml {configFile="app"}
applications:
    [...]
        {{< variable "APP_NAME" >}}:
            [...]
            workers:
                horizon:
                    commands:
                        start: |
                            php artisan horizon
```

You can now enable it by pushing the change to `{{< vendor/name >}}`:

```bash
git add .
git commit -m "Enable Laravel Horizon"
{{< vendor/cli >}} push
```

This way, a new container will be started automatically and will spawn the Horizon process after the next deploy.

If you have restricted access to Horizon in your `HorizonServiceProvider.php`, login to your application through the web. 
Once done, head to `/horizon` and you should be able to access your Horizon dashboard.

![Laravel Horizon Dashboard](/images/guides/laravel/horizon-dashboard.png "0.5")

Horizon will handle jobs that are populated by the queue. If you need to customize how Horizon works (queues, processes, …), please refer to the official [Laravel Horizon documentation](https://laravel.com/docs/master/horizon#main-content).

{{< note title="Warning" theme="warning" >}}

Web and worker containers don't share mounts targets.
You can't share files between those containers using the filesystem.
To share data between containers, use [services](/add-services/_index.md).

{{< /note >}}

Like any other container, the resources of the Horizon container can be customized. 
Head to the **Configure resources** panel of the {{% vendor/name %}} console and change the resources as needed:

![Laravel Horizon Resources](/images/guides/laravel/horizon-resources.png "0.5")

For more information, see [Workers](/create-apps/app-reference#workers).
