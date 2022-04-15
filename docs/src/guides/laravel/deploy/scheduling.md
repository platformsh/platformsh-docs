---
title: "Workers, Cron Jobs and Task Scheduling"
sidebarTitle: "Scheduling Tasks"
weight: -100
description: How to schedule Tasks for your Laravel application.
---

Laravel offers a very convenient and flexible way of scheduling tasks. A large set of [helpers functions](https://laravel.com/docs/scheduling#schedule-frequency-options) allows the easy scheduling of Commands and Jobs.

Once the scheduled tasks are defined, they need to be effectively executed at the right time and pace.
The recommended way is a cron configuration entry running the `artisan schedule:run` command.

```yaml {location=".platform.app.yaml"}
crons:
    # Run Laravel's scheduler every 5 minutes, which is as often as crons can run.
    scheduler:
        spec: '*/5 * * * *'
        cmd: 'php artisan schedule:run'
```

The [minimum time between cron jobs](../../../configuration/app/app-reference.html#cron-job-timing) being triggered depends on your plan. The tasks scheduling may then be contradicted by the cron minimum frequency.

This [blogpost](https://platform.sh/blog/of-cicadas-and-cron-jobs/) may help understanding the stakes and harmonazing the frequencies so all your scheduled tasks can be effectively triggered.

You could also [configure a worker](../../../configuration/app/workers) relying on the `artisan schedule:work`.
[This command](https://laravel.com/docs/scheduling#running-the-scheduler-locally) will invoke the scheduler every minute. 

```yaml {location=".platform.app.yaml"}
workers:
   queue:
       size: S
       commands:
           start: |
          php artisan schedule:work
```

