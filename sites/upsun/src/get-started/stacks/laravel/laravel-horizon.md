---
title: "Handle queues with Horizon"
weight: -118
description: |
    Setting up Laravel Horizon
---

[Laravel Horizon](https://laravel.com/docs/master/horizon#main-content) provides an appealing dashboard and code-driven configuration
for your Laravel powered Redis queues.
Horizon allows you to monitor key metrics of your queue system,
such as job throughput, runtime, and job failures.

## 1. Add Laravel Horizon

{{% note theme="warning" %}}
This procedure assumes you have followed the steps on [how to configure Redis and queues](/get-started/stacks/laravel/setup-redis#5-use-redis-for-laravel-queues).
{{% /note %}}

1. To add Laravel Horizon, run the following command:

   ```bash {location="Terminal"}
   composer require laravel/horizon && php artisan horizon:install
   ```

2. Add the `install` command to your `build` hook in your app configuration, so it's run on every deploy.

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

## 2. Create a worker to run Horizon

To run Horizon on your project, you need to add a separate [worker](/create-apps/app-reference/single-runtime-image#workers).
To do so, use the following configuration:

```yaml {configFile="app"}
applications:
  myapp:
    [...]
    workers:
      horizon:
        commands:
          start: |
            php artisan horizon
```

To enable the worker, push your changes to {{< vendor/name >}}:

```bash {location="Terminal"}
git add .
git commit -m "Enable Laravel Horizon"
{{< vendor/cli >}} push
```

A new container is started automatically.
It will spawn the Horizon process after the next deploy.

## 3. Access your Horizon dashboard

If you have restricted access to Horizon in your `HorizonServiceProvider.php`,
log in to your app through the web.
Then, go to `/horizon` to access your Horizon dashboard.

![Laravel Horizon Dashboard](/images/guides/laravel/horizon-dashboard.png "0.5")

## 4. Optional: Customize Horizon

Horizon handles jobs that are populated by the queue.
If you need to customize how Horizon works (queues, processes, etc.),
see the official [Laravel Horizon documentation](https://laravel.com/docs/master/horizon#main-content).

{{< note title="Warning" theme="warning" >}}

Web and worker containers don't share mount targets.
You can't share files between those containers using the filesystem.
To share data between containers, use [services](/add-services/_index.md).

See more information on [workers](/create-apps/app-reference/single-runtime-image#workers).

{{< /note >}}

Note that you can customize the resources of your Horizon worker container from the {{% vendor/name %}} Console.

![Laravel Horizon Resources](/images/guides/laravel/horizon-resources.png "0.5")

For more information, see how to [configure resources](/manage-resources/adjust-resources.md).

{{< guide-buttons previous="Back" next="Set up cron jobs" nextLink="/get-started/stacks/laravel/crons.md" type="*" >}}
