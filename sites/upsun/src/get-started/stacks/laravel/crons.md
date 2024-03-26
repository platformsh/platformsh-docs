---
title: "Cron Jobs"
weight: -105
description: |
    Understand how to configure Laravel cron jobs.
---

Cron jobs allow you to run scheduled tasks at specified times or intervals.

While you can run your own custom tasks, Laravel provides a scheduler to simplify the implementation. You can refer to the [Task Scheduling documentation](https://laravel.com/docs/master/scheduling) to see how to implement it code-wise.

Implementing a cron task in {{< vendor/name >}} is done through the `{{< vendor/configfile "app" >}}` `crons` key. 
Add the `artisan schedule:run` command to it:

```yaml {configFile="app"}
applications:
    myapp:
        [...]
        crons:
            snapshot:
                spec: * * * * *
                cmd: |
                    php artisan schedule:run >> /dev/null 2>&1
```

To run a command in a cron hook for specific environment types,
use the `PLATFORM_ENVIRONMENT_TYPE` environment variable:

```yaml {configFile="app"}
applications:
    myapp:
        [...]
        crons:
            snapshot:
                spec: 0 5 * * *
                cmd: |
                    # only run for the production environment, aka main branch
                    if [ "$PLATFORM_ENVIRONMENT_TYPE" = "production" ]; then
                        php artisan schedule:run >> /dev/null 2>&1
                    fi
```

Please note that cron tasks execution on the default {{< vendor/name >}} offering are limited to once every 5 minutes. 
Please refer to the full [crons documentation](/create-apps/app-reference.html#crons).

An alternative way that guarantees that the scheduler is run every minute is to implement `artisan schedule:work` in a worker. 
To do so, add a new worker configuration in your `{{< vendor/configfile "app" >}}`:

```yaml {configFile="app"}
applications:
    [...]
        {{< variable "APP_NAME" >}}:
            [...]
            workers:
                scheduler:
                    commands:
                        start: |
                            php artisan schedule:work
```

{{< note title="Warning" theme="warning" >}}

Web and worker containers don't share mounts targets.
You can't share files between those containers using the filesystem.
To share data between containers, use [services](/add-services/_index.md).

{{< /note >}}
