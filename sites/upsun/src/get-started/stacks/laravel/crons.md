---
title: "Set up cron jobs"
sidebarTitle: Cron jobs
weight: -105
description: |
    Understand how to configure Laravel cron jobs.
---

Cron jobs allow you to run scheduled tasks at specified times or intervals.

While you can run your own custom tasks, Laravel provides a scheduler to simplify the implementation.
To implement it, see the Laravel [Task Scheduling documentation](https://laravel.com/docs/master/scheduling).

## Set up a cron job

To set up a cron job, update your {{% vendor/name %}} configuration as follows:

```yaml {configFile="app"}
applications:
  myapp:
    [...]
    crons:
      snapshot:
        spec: * * * * *
        commands:
          start: |
            php artisan schedule:run >> /dev/null 2>&1
```

## Run cron jobs based on environment type

To run a command in a cron hook for specific environment types,
use the `PLATFORM_ENVIRONMENT_TYPE` environment variable:

```yaml {configFile="app"}
applications:
  myapp:
    [...]
    crons:
      snapshot:
        spec: 0 5 * * *
        commands:
          start: |
            # only run for the production environment, aka main branch
            if [ "$PLATFORM_ENVIRONMENT_TYPE" = "production" ]; then
              php artisan schedule:run >> /dev/null 2>&1
            fi
```

## Run the Laravel scheduler every minute

Cron job execution on the default {{< vendor/name >}} offering are limited to once every 5 minutes.
For more information, see the [documentation on crons](/create-apps/app-reference/single-runtime-image#crons).

However, you can add a [worker](/create-apps/app-reference/single-runtime-image#workers)
and specify a start command that [runs the scheduler every minute](https://laravel.com/docs/11.x/scheduling#running-the-scheduler-locally).
To do so, use the following configuration:

```yaml {configFile="app"}
applications:
  {{< variable "APP_NAME" >}}:
    [...]
    workers:
      scheduler:
        commands:
          start: |
            php artisan schedule:work
```

{{< note title="Warning" theme="warning" >}}

Web and worker containers don't share mount targets.
You can't share files between those containers using the filesystem.
To share data between containers, use [services](/add-services/_index.md).

{{< /note >}}

{{< guide-buttons previous="Back" next="Manage observability with Blackfire" nextLink="/get-started/stacks/laravel/blackfire.md" type="*" >}}
