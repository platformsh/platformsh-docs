---
title: "Workers, cron jobs, and task scheduling"
sidebarTitle: "Scheduling tasks"
weight: -100
description: Schedule tasks for your Laravel app.
---

Laravel offers a very convenient and flexible way of scheduling tasks. A large set of [helper functions](https://laravel.com/docs/scheduling#schedule-frequency-options) help you schedule commands and jobs.

Once the scheduled tasks are defined, they need to be effectively executed at the right time and pace.
The recommended way is a cron configuration entry running the `artisan schedule:run` command.

```yaml {location=".platform.app.yaml"}
crons:
    # Run Laravel's scheduler every 5 minutes, which is as often as crons can run on Professional plans.
    scheduler:
        spec: '*/5 * * * *'
        cmd: 'php artisan schedule:run'
```

The [minimum time between cron jobs](../../../create-apps/app-reference.md#cron-job-timing) being triggered depends on your plan. Task scheduling may then be contradicted by the cron minimum frequency. Schedules outside the specified cron frequency are ignored and the related tasks aren't triggered.

This [blog post](https://platform.sh/blog/of-cicadas-and-cron-jobs/) may help you understand the stakes and harmonize the frequencies so all your scheduled tasks can be effectively triggered.

You could also [configure a worker](../../../create-apps/workers.md) that relies on `artisan schedule:work`.
To invoke the scheduler every minute, run [the following command](https://laravel.com/docs/scheduling#running-the-scheduler-locally):

```yaml {location=".platform.app.yaml"}
workers:
   queue:
       size: S
       commands:
           start: php artisan schedule:work
```

