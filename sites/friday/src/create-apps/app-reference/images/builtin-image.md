---
title: "Built-in Image (type)"
weight: 4
description: See all of the options for controlling your apps and how they're built and deployed on {{% vendor/name %}}.
---

## Types

The `type` defines the base container image used to run the application.
The version is the major (`X`) and sometimes minor (`X.Y`) version numbers,
depending on the service, as in the following table.
Security and other patches are taken care of for you automatically.

Available languages and their supported versions:

{{< readFile file="registry/images/tables/runtimes_supported.md" markdownify="true">}}

### Example configuration

These are used in the format `runtime:version`:

```yaml {configFile="app"}
applications:
    myapp:
        type: 'php:{{% latest "php" %}}'
```




## Workers

## Access


## Variables

## Firewall

## Build


## Dependencies

## Hooks


## Crons

The keys of the `crons` definition are the names of the cron jobs.
The names must be unique.

If an application defines both a `web` instance and `worker` instances, cron jobs run only on the `web` instance.

See how to [get cron logs](/increase-observability/logs/access-logs.md#container-logs).

The following table shows the properties for each job:

| Name               | Type                                         | Required | Description |
| ------------------ | -------------------------------------------- | -------- | ----------- |
| `spec`             | `string`                                     | Yes      | The [cron specification](https://en.wikipedia.org/wiki/Cron#Cron_expression). To prevent competition for resources that might hurt performance, use `H` in definitions to indicate an unspecified but invariant time. For example, instead of using `0 * * * *` to indicate the cron job runs at the start of every hour, you can use `H * * * *` to indicate it runs every hour, but not necessarily at the start. This prevents multiple cron jobs from trying to start at the same time. |
| `commands`         | A [cron commands dictionary](#cron-commands) | Yes      | A definition of what commands to run when starting and stopping the cron job. |
| `shutdown_timeout` | `integer`                                    | No       | When a cron is canceled, this represents the number of seconds after which a `SIGKILL` signal is sent to the process to force terminate it. The default is `10` seconds. |
| `timeout`          | `integer`                                    | No       | The maximum amount of time a cron can run before it's terminated. Defaults to the maximum allowed value of `86400` seconds (24 hours).

Note that you can [cancel pending or running crons](/environments/cancel-activity.md).

### Cron commands

| Name               | Type      | Required | Description |
| ------------------ | --------- | -------- | ----------- |
| `start`            | `string`  | Yes      | The command that's run. It's run in [Dash](https://en.wikipedia.org/wiki/Almquist_shell). |
| `stop`             | `string`  | No       | The command that's issued to give the cron command a chance to shutdown gracefully, such as to finish an active item in a list of tasks. Issued when a cron task is interrupted by a user through the CLI or Console. If not specified, a `SIGTERM` signal is sent to the process. |

```yaml {configFile="app"}
applications:
    myapp:
        source:
            root: "/"
        type: 'nodejs:{{% latest "nodejs" %}}'
        crons:
            mycommand:
                spec: 'H * * * *'
                commands:
                    start: sleep 60 && echo sleep-60-finished && date
                    stop: killall sleep
                shutdown_timeout: 18
```
In this example configuration, the [cron specification](#crons) uses the `H` syntax.

### Example cron jobs

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
        cmd: 'php artisan schedule:run'
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
        cmd: |
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
### Cron job timing

The minimum time between cron jobs being triggered is 5 minutes.

For each app container, only one cron job can run at a time.
If a new job is triggered while another is running, the new job is paused until the other completes.

To minimize conflicts, a random offset is applied to all triggers.
The offset is a random number of seconds up to 20 minutes or the cron frequency, whichever is smaller.

Crons are also paused while activities such as [backups](/environments/backup) are running.
The crons are queued to run after the other activity finishes.

To run cron jobs in a timezone other than UTC, set the [timezone property](#top-level-properties).

### Paused crons

[Preview environments](/glossary.md#preview-environment) are often used for a limited time and then abandoned.
While it's useful for environments under active development to have scheduled tasks,
unused environments don't need to run cron jobs.
To minimize unnecessary resource use,
crons on environments with no deployments are paused.

This affects all preview environments, _and_ production environment that do not yet have a domain attached to them.

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

## Runtime

The following table presents the various possible modifications to your PHP or Lisp runtime:

| Name                        | Type                                                       | Language | Description |
| --------------------------- | ---------------------------------------------------------- | -------- | ----------- |
| `extensions`                | List of `string`s OR [extensions definitions](#extensions) | PHP      | [PHP extensions](/languages/php/extensions.md) to enable. |
| `disabled_extensions`       | List of `string`s                                          | PHP      | [PHP extensions](/languages/php/extensions.md) to disable. |
| `request_terminate_timeout` | `integer`                                                  | PHP      | The timeout for serving a single request after which the PHP-FPM worker process is killed. |
| `sizing_hints`              | A [sizing hints definition](#sizing-hints)                 | PHP      | The assumptions for setting the number of workers in your PHP-FPM runtime. |
| `xdebug`                    | An Xdebug definition                                       | PHP      | The setting to turn on [Xdebug](/languages/php/xdebug.md). |
| `quicklisp`                 | Distribution definitions                                   | Lisp     | [Distributions for QuickLisp](/languages/lisp.md#quicklisp-options) to use. |

You can also set your [app's runtime timezone](/create-apps/timezone.md).

### Extensions

You can enable [PHP extensions](/languages/php/extensions.md) just with a list of extensions:

```yaml {configFile="app"}
applications:
    myapp:
        source:
            root: "/"
        type: 'php:{{% latest "php" %}}'
        runtime:
            extensions:
                - geoip
                - tidy
```
Alternatively, if you need to include configuration options, use a dictionary for that extension:

```yaml {configFile="app"}
applications:
    myapp:
        source:
            root: "/"
        type: 'php:{{% latest "php" %}}'
        runtime:
            extensions:
                - geoip
                - name: blackfire
                configuration:
                    server_id: foo
                    server_token: bar
```
In this case, the `name` property is required.

### Sizing hints

The following table shows the properties that can be set in `sizing_hints`:

| Name              | Type      | Default | Minimum | Description |
| ----------------- | --------- | ------- | ------- | ----------- |
| `request_memory`  | `integer` | 45      | 10      | The average memory consumed per request in MB. |
| `reserved_memory` | `integer` | 70      | 70      | The amount of memory reserved in MB. |

See more about [PHP-FPM workers and sizing](/languages/php/fpm.md).

## Source

The following table shows the properties that can be set in `source`:


| Name         | Type                     | Required | Description                                                                                                                     |
| ------------ | ------------------------ | -------- |---------------------------------------------------------------------------------------------------------------------------------|
| `operations` | An operations dictionary |          | Operations that can be applied to the source code. See [source operations](/create-apps/source-operations.md)                             |
| `root`       | `string`                 |          | The path where the app code lives. Defaults to the root project directory. Useful for [multi-app setups](/create-apps/multi-app/_index.md). |

## Container profile

By default, Upsun allocates a container profile to each app and service depending on the range of resources it’s expected to need.

Each container profile gives you access to a specific list of CPU and RAM combinations.
Using the Upsun CLI or Console, you can then pick a CPU and RAM combination for each of your apps and services.

- [Container profile types and resources](/manage-resources/adjust-resources#advanced-container-profiles)
- [Default container profiles](/manage-resources/adjust-resources#default-container-profiles) for runtime and service containers
- [Customize resources using the `container_profile` key](/manage-resources/adjust-resources#adjust-a-container-profile)

## Additional hosts

If you're using a private network with specific IP addresses you need to connect to,
you might want to map those addresses to hostnames to better remember and organize them.
In such cases, you can add a map of those IP addresses to whatever hostnames you like.
Then when your app tries to access the hostname, it's sent to the proper IP address.

So in the following example, if your app tries to access `api.example.com`, it's sent to `192.0.2.23`.

```yaml {configFile="app"}
applications:
    myapp:
        source:
            root: "/"
        type: 'php:{{% latest "php" %}}'
        additional_hosts:
            api.example.com: "192.0.2.23"
            web.example.com: "203.0.113.42"
```

This is equivalent to adding the mapping to the `/etc/hosts` file for the container.
