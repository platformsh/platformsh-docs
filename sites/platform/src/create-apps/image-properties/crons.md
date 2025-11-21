---
title: "`crons`"
weight: 4
description: A cron dictionary that defines scheduled tasks for the app.
---

{{% description %}}

Optional in [single-runtime](/create-apps/app-reference/single-runtime-image.md#top-level-properties) and [composable](/create-apps/app-reference/composable-image.md#top-level-properties) images.

The keys of the `crons` definition are the names of the cron jobs.
The names must be unique.

If an application defines both a `web` instance and `worker` instances, cron jobs run only on the `web` instance.

See how to [get cron logs](/increase-observability/logs/access-logs.md#container-logs).

The following table shows the properties for each job:

| Name               | Type                                         | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------ | -------------------------------------------- | -------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `spec`             | `string`                                     | Yes      | The [cron specification](https://en.wikipedia.org/wiki/Cron#Cron_expression). To prevent competition for resources that might hurt performance, on **Grid** projects use `H` in definitions to indicate an unspecified but invariant time. For example, instead of using `0 * * * *` to indicate the cron job runs at the start of every hour, you can use `H * * * *` to indicate it runs every hour, but not necessarily at the start. This prevents multiple cron jobs from trying to start at the same time. **The `H` syntax is available on Grid projects only, and not on {{% names/dedicated-gen-2 %}} projects.** |
| `commands`         | A [cron commands dictionary](#cron-commands) | Yes      | A definition of what commands to run when starting and stopping the cron job.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `shutdown_timeout` | `integer`                                    | No       | When a cron is canceled, this represents the number of seconds after which a `SIGKILL` signal is sent to the process to force terminate it. The default is `10` seconds.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `timeout`          | `integer`                                    | No       | The maximum amount of time a cron can run before it's terminated. Defaults to the maximum allowed value of `86400` seconds (24 hours).

Note that you can [cancel pending or running crons](/environments/cancel-activity.md).

{{< note >}}

The use of the `cmd` key is now deprecated in favor of the `commands`key.</br>
Make sure you set your new cron jobs using the `commands` key,
and update your existing cron jobs to ensure continuity.

{{< /note >}}

### Cron commands

| Name               | Type      | Required | Description |
| ------------------ | --------- | -------- | ----------- |
| `start`            | `string`  | Yes      | The command that's run. It's run in [Dash](https://en.wikipedia.org/wiki/Almquist_shell). |
| `stop`             | `string`  | No       | The command that's issued to give the cron command a chance to shutdown gracefully, such as to finish an active item in a list of tasks. Issued when a cron task is interrupted by a user through the CLI or Console. If not specified, a `SIGTERM` signal is sent to the process. |

{{< codetabs >}}

+++
title=Single-runtime image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: 'nodejs:{{% latest "nodejs" %}}'  
    source:
      root: "/"
    crons:
      mycommand:
        spec: 'H * * * *'
        commands:
          start: sleep 60 && echo sleep-60-finished && date
          stop: killall sleep
        shutdown_timeout: 18
```
<--->

+++
title=Composable image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: "composable:{{% latest composable %}}"
    source:
      root: "/"
    stack:
      runtimes: [ 'nodejs:{{% latest "nodejs" %}}' ]
    crons:
      mycommand:
        spec: 'H * * * *'
        commands:
          start: sleep 60 && echo sleep-60-finished && date
          stop: killall sleep
        shutdown_timeout: 18
```

{{< /codetabs >}}

In this example configuration, the crons [`spec`](#crons) uses the `H` syntax.

Note that this syntax is only supported on Grid projects.
On {{% names/dedicated-gen-2 %}} projects, use the [standard cron syntax](https://en.wikipedia.org/wiki/Cron#Cron_expression).

### Single-runtime image: Example cron jobs

<!-- vale off -->
{{< codetabs >}}

+++
title=Drupal
+++

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'php:{{% latest "php" %}}'
crons:
  # Run Drupal's cron tasks every 19 minutes.
  drupal:
    spec: '*/19 * * * *'
    commands:
      start: 'cd web ; drush core-cron'
  # But also run pending queue tasks every 7 minutes.
  # Use an odd number to avoid running at the same time as the `drupal` cron.
  drush-queue:
    spec: '*/7 * * * *'
    commands:
      start: 'cd web ; drush queue-run aggregator_feeds'
{{< /snippet >}}
```

<--->

+++
title=Ruby on Rails
+++

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'ruby:{{% latest "ruby" %}}'
crons:
  # Execute a rake script every 19 minutes.
  ruby:
    spec: '*/19 * * * *'
    commands:
      start: 'bundle exec rake some:task'
{{< /snippet >}}
```

<--->

+++
title=Laravel
+++

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'php:{{% latest "php" %}}'
crons:
  # Run Laravel's scheduler every 5 minutes.
  scheduler:
    spec: '*/5 * * * *'
    commands:
      start: 'php artisan schedule:run'
{{< /snippet >}}
```

<--->

+++
title=Symfony
+++

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'php:{{% latest "php" %}}'
crons:
  # Take a backup of the environment every day at 5:00 AM.
  snapshot:
    spec: 0 5 * * *
    commands:
      start: |
        # Only run for the production environment, aka main branch
        if [ "$PLATFORM_ENVIRONMENT_TYPE" = "production" ]; then
            croncape symfony ...
        fi
{{< /snippet >}}
```

{{< /codetabs >}}
<!-- vale on -->

### Composable image: Example cron jobs

<!-- vale off -->
{{< codetabs >}}

+++
title=Drupal
+++

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: "composable:{{% latest composable %}}"
stack: 
  runtimes: [ "php@{{% latest php %}}" ]
crons:
  # Run Drupal's cron tasks every 19 minutes.
  drupal:
    spec: '*/19 * * * *'
    commands:
      start: 'cd web ; drush core-cron'
  # But also run pending queue tasks every 7 minutes.
  # Use an odd number to avoid running at the same time as the `drupal` cron.
  drush-queue:
    spec: '*/7 * * * *'
    commands:
      start: 'cd web ; drush queue-run aggregator_feeds'
{{< /snippet >}}
```

<--->

+++
title=Ruby on Rails
+++

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: "composable:{{% latest composable %}}"
stack:
  runtimes: [ "ruby@{{% latest ruby %}}" ]
crons:
  # Execute a rake script every 19 minutes.
  ruby:
    spec: '*/19 * * * *'
    commands:
      start: 'bundle exec rake some:task'
{{< /snippet >}}
```

<--->

+++
title=Laravel
+++

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: "composable:{{% latest composable %}}"
stack:
  runtimes: [ "php@{{% latest php %}}" ]
crons:
  # Run Laravel's scheduler every 5 minutes.
  scheduler:
    spec: '*/5 * * * *'
    commands:
      start: 'php artisan schedule:run'
{{< /snippet >}}
```

<--->

+++
title=Symfony
+++

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: "composable:{{% latest composable %}}"
stack:
  runtimes: [ "php@{{% latest php %}}" ]
crons:
  # Take a backup of the environment every day at 5:00 AM.
  snapshot:
    spec: 0 5 * * *
    commands:
      start: |
        # Only run for the production environment, aka main branch
        if [ "$PLATFORM_ENVIRONMENT_TYPE" = "production" ]; then
            croncape symfony ...
        fi
{{< /snippet >}}
```

{{< /codetabs >}}
<!-- vale on -->

### Conditional crons

If you want to set up customized cron schedules depending on the environment type,
define conditional crons.
To do so, use a configuration similar to the following:

{{< codetabs >}}

+++
title=Single-runtime image
+++

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: 'php:{{% latest "php" %}}'
    crons:
      update:
        spec: '0 0 * * *'
        commands:
          start: |
            if [ "$PLATFORM_ENVIRONMENT_TYPE" = production ]; then
              {{% vendor/cli %}} backup:create --yes --no-wait
              {{% vendor/cli %}} source-operation:run update --no-wait --yes
            fi
```
<--->

+++
title=Composable image
+++

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: "composable:{{% latest composable %}}"
    stack: 
      runtimes: [ "php@{{% latest php %}}" ]
    crons:
      update:
        spec: '0 0 * * *'
        commands:
          start: |
            if [ "$PLATFORM_ENVIRONMENT_TYPE" = production ]; then
              {{% vendor/cli %}} backup:create --yes --no-wait
              {{% vendor/cli %}} source-operation:run update --no-wait --yes
            fi
```

{{< /codetabs >}}

### Cron job timing

Minimum time between cron jobs being triggered:

| Plan                | Time      |
|-------------------- | --------- |
| Professional        | 5 minutes |
| Elite or Enterprise | 1 minute  |

For each app container, only one cron job can run at a time.
If a new job is triggered while another is running, the new job is paused until the other completes.

To minimize conflicts, a random offset is applied to all triggers.
The offset is a random number of seconds up to 20 minutes or the cron frequency, whichever is smaller.

Crons are also paused while activities such as [backups](/environments/backup.md) are running.
The crons are queued to run after the other activity finishes.

To run cron jobs in a timezone other than UTC, set the `timezone` property as described for the image type ([single-runtime image](/create-apps/app-reference/single-runtime-image.md#top-level-properties) or 
[composable image](/create-apps/app-reference/composable-image.md#top-level-properties)).

### Paused crons

[Preview environments](/glossary/_index.md#preview-environment) are often used for a limited time and then abandoned.
While it's useful for environments under active development to have scheduled tasks,
unused environments don't need to run cron jobs.
To minimize unnecessary resource use,
crons on environments with no deployments are paused.

This affects all environments that aren't live environments.
This means all environments on Development plans
and all preview environments on higher plans.

Such environments with deployments within 14 days have crons with the status `running`.
If there haven't been any deployments within 14 days, the status is `paused`.

You can see the status in the Console
or using the CLI by running `{{% vendor/cli %}} environment:info` and looking under `deployment_state`.

#### Restarting paused crons

If the crons on your preview environment are paused but you're still using them,
you can push changes to the environment or redeploy it.

To restart crons without changing anything:

{{< codetabs >}}

+++
title=In the Console
+++

1. In the Console, navigate to your project.
1. Open the environment where you'd like the crons to run.
1. Click `Redeploy` next to the cron status of `Paused`.

<--->

+++
title=Using the CLI
+++

Run the following command:

```bash
{{% vendor/cli %}} redeploy
```

{{< /codetabs >}}

### Composable image only: Sizing hints

The following table shows the properties that can be set in `sizing_hints`:

| Name              | Type      | Default | Minimum | Description                                    |
|-------------------|-----------|---------|---------|------------------------------------------------|
| `request_memory`  | `integer` | 45      | 10      | The average memory consumed per request in MB. |
| `reserved_memory` | `integer` | 70      | 70      | The amount of memory reserved in MB.           |

See more about [PHP-FPM workers and sizing](/languages/php/fpm.md).

