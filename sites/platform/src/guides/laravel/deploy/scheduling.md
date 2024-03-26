---
title: "Workers, cron jobs, and task scheduling"
sidebarTitle: "Scheduling tasks"
weight: -100
description: Schedule tasks for your Laravel app.
---

{{< note theme="warning" >}}
The use of workers requires a [Medium plan](/administration/pricing/_index.md#multiple-apps-in-a-single-project)
or greater.
{{< /note >}}

Laravel offers a very convenient and flexible way of scheduling tasks. A large set of [helper functions](https://laravel.com/docs/scheduling#schedule-frequency-options) help you schedule commands and jobs.

Once the scheduled tasks are defined, they need to be effectively executed at the right time and pace.
The recommended way is a cron configuration entry running the `artisan schedule:run` command schedule for every minute.
However, on {{% vendor/name %}} the [minimum time between cron jobs](/create-apps/app-reference/single-runtime-image.md#cron-job-timing)
depends on your plan. Task scheduling may then be contradicted by the cron minimum frequency. Schedules outside the
specified cron frequency are ignored and the related tasks aren't triggered.

Due to this conflict, we suggest utilizing [workers](/create-apps/workers.md) to run both the scheduler and the queue
systems (the [Laravel template](https://github.com/platformsh-templates/laravel) utilizes this method). In order to have
enough resources to support these workers as well as services (e.g. MariaDB, Redis, etc), a
**[Medium plan](/administration/pricing/_index.md#multiple-apps-in-a-single-project) _or greater_ is required**.

To use workers to handle scheduling and queues add the following to your {{< vendor/configfile "app" >}} file:

```yaml {configFile="app"}
workers:
  queue:
    size: S
    commands:
      # To minimize leakage, the queue worker will stop every hour
      # and get restarted automatically.
      start: |
        php artisan queue:work --max-time=3600
    disk: 256
  scheduler:
    size: S
    commands:
      start: php artisan schedule:work
    disk: 256
```

{{< note theme="warning" >}}
By default, [workers inherit all top level properties](/create-apps/workers.md#inheritance) from the parent application.
You may need to override certain properties in the worker configuration above depending on your application.
{{< /note >}}

{{< guide-buttons previous="Back" next="Manage observability with Blackfire" >}}

