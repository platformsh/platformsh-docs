---
title: "Composable image (stack)"
weight: 5
description: See all of the options for composable image to built and deployed your application on {{% vendor/name %}}.
---

{{% description %}}

Configuration is all done in a `{{< vendor/configfile "app" >}}` file,
located at the root of your Git repository.

See a [comprehensive example](/create-apps/_index.md#comprehensive-example) of a configuration in a `{{< vendor/configfile "app" >}}` file.

## What is a Composable Image?

Composable image is a new way to install multiple runtimes in a Stack (group of elements), based on what is available
on [NixOS](https://search.nixos.org/).

{{% note title="TODO" %}}
TODO: What is NixOs ?
{{% /note %}}

{{% note title="TODO" %}}
TODO: Add Jerome's talk about it
https://www.youtube.com/watch?v=emOt32DVl28
{{% /note %}}

All application configuration takes place in a `{{< vendor/configfile "app" >}}` file, with each application configured
under a unique key beneath the top-level `applications` key.

For example, it is possible to deploy multiple runtimes in an application container - one PHP, one JavaScript and one
Python - for the frontend of a deployed site.

In this case, the unified `{{< vendor/configfile "app" >}}` file would look like:

```yaml {configFile="app"}
applications:
  frontend:
    stack:
      - "php@{{% latest "php" %}}":
        extensions:
          - apcu
          - sodium
          - xsl
          - pdo_sqlite
      - "nodejs@{{% latest "nodejs" %}}"
      - "python@{{% latest "python" %}}":
        extensions:
          - yq
    # Additional frontend configuration
```

The following table presents all properties available at the level just below the unique application name (`frontend` above).

The column _Set in instance?_ defines whether the given property can be overridden within a `web` or `workers` instance.
To override any part of a property, you have to provide the entire property.

| Name               | Type                                                | Required | Set in instance? | Description                                                                                                                                                                                                                                                                |
|--------------------|-----------------------------------------------------|----------|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`             | `string`                                            | Yes      | No               | A unique name for the app. Must be lowercase alphanumeric characters. Changing the name destroys data associated with the app.                                                                                                                                             |
| `stack`            | An array of [NixOs runtimes](#stack)                | Yes      | No               | The list of runtime images to use with a specific app. Format: <br>`- <runtime>@<version>`.                                                                                                                                                                                |
| `relationships`    | A dictionary of [relationships](#relationships)     |          | Yes              | Connections to other services and apps.                                                                                                                                                                                                                                    |
| `mounts`           | A dictionary of [mounts](#mounts)                   |          | Yes              | Directories that are writable even after the app is built. Allocated disk for mounts is defined with a separate resource configuration call using `{{% vendor/cli %}} resources:set`.                                                                                      |
| `web`              | A [web instance](#web)                              |          | N/A              | How the web application is served.                                                                                                                                                                                                                                         |
| `workers`          | A [worker instance](#workers)                       |          | N/A              | Alternate copies of the application to run as background processes.                                                                                                                                                                                                        |
| `timezone`         | `string`                                            |          | No               | The timezone for crons to run. Format: a [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Defaults to `UTC`, which is the timezone used for all logs no matter the value here. See also [app runtime timezones](/create-apps/timezone.md) |
| `access`           | An [access dictionary](#access)                     |          | Yes              | Access control for roles accessing app environments.                                                                                                                                                                                                                       |
| `variables`        | A [variables dictionary](#variables)                |          | Yes              | Variables to control the environment.                                                                                                                                                                                                                                      |
| `firewall`         | A [firewall dictionary](#firewall)                  |          | Yes              | Outbound firewall rules for the application.                                                                                                                                                                                                                               |
| `hooks`            | A [hooks dictionary](#hooks)                        |          | No               | What commands run at different stages in the build and deploy process.                                                                                                                                                                                                     |
| `crons`            | A [cron dictionary](#crons)                         |          | No               | Scheduled tasks for the app.                                                                                                                                                                                                                                               |
| `source`           | A [source dictionary](#source)                      |          | No               | Information on the app's source code and operations that can be run on it.                                                                                                                                                                                                 |
| `additional_hosts` | An [additional hosts dictionary](#additional-hosts) |          | Yes              | Maps of hostnames to IP addresses.                                                                                                                                                                                                                                         |

{{% note %}}
Please note that, even if available in [Application reference](/create-apps/app-reference/images/builtin-image.md) when using the built-in image
of defining images to use in your application container, the  ``type``, ``build``, ``dependencies``, and ``runtime`` keywords
are not supported if you choose to use Composable Image (`stack`).
{{% /note %}}

## Root directory

Some of the properties you can define are relative to your app's root directory.
The root defaults to the root of the repository.

```yaml {configFile="app"}
applications:
  frontend:
    type: 'nodejs:{{% latest "nodejs" %}}'
    # Default behavior of source.root
    source:
      root: "/"
```

That is, if a custom value for `source.root` is not provided in your configuration, the default behavior is equivalent
to the above.

To specify another directory, for example for a [multi-app project](/create-apps/multi-app/_index.md),
use the [`source.root` property](#source).

## Stack

The ``stack`` keyword is used for defining runtimes and other binaries (like `wkhtmltopdf`, or `imagemagick`, see list below),
as a YAML array, that you would like to install in your application container.
The version is the major (`X`) and sometimes minor (`X.Y`) version numbers,
depending on the service, as in the following table.
Security and other patches are taken care of for you automatically.

```yaml {configFile="app"}
applications:
  app:
    stack: [ "<runtime>@<version>" ]
    # OR
    stack:
      - "<runtime>@<version>"
```

Available languages and their supported versions:

| **Language**                                 | **`runtime`** | **Supported `version`**    |
|----------------------------------------------|---------------|----------------------------|
| [Elixir](/languages/elixir.html)             | `elixir`      | 1.15, 1.14                 |
| [Go](/languages/go.html)                     | `golang`      | 1.22, 1.21, 1.20           |
| [Java](/languages/java.html)                 | `java`        | 21                         |
| [Common Lisp (SBCL)](/languages/lisp.html)   | `sbcl`        | 2                          |
| [Clojure](https://clojure.org/)              | `clojure`     | 1                          |
| [JavaScript/Node.js](/languages/nodejs.html) | `nodejs`      | 21, 20, 18                 |
| [Javascript/Bun](https://bun.sh/)            | `bun`         | 1                          |
| [Perl](https://www.perl.org/)                | `perl`        | 5                          |
| [PHP](/languages/php.html)                   | `php`         | 8.3, 8.2, 8.1              |
| [Python](/languages/python.html)             | `python`      | 3.12, 3.11, 3.10, 3.9, 2.7 |

[//]: # (TODO i'm not sure of the difference between the Lisp SBCL and Lisp Clojure)
[//]: # (TODO Bun is supposed to be part of the languages or tools table?)
Available tools and their supported versions:

| **Tool**                                                             | **`runtime`** | **Supported `version`** |
|----------------------------------------------------------------------|---------------|-------------------------|
| [Graph visualization tools](https://graphviz.org/)                   | `graphviz`    | none                    |
| [GNU Compiler Collection](https://gcc.gnu.org/)                      | `gcc`         | none                    |
| [Face detector](https://www.thregr.org/~wavexx/software/facedetect/) | `facedetect`  | none                    |
| [WkHtmlToPdf](https://wkhtmltopdf.org/)                              | `wkhtmltopdf` | none                    |
| [ImageMagick](http://www.imagemagick.org/)                           | `imagemagick` | none                    |
| [Yarn](https://classic.yarnpkg.com/)                                 | `yarn`        | none                    |

[//]: # (please see exhaustive list of runtime and tools here https://lab.plat.farm/images/generic/-/blob/Nix/flake.nix?ref_type=heads#L161)

To add a tool in your `stack`, please use the format `<runtime>` for the tool, as no `version` is provided.
As an example for ``facedetect``:
```yaml {configFile="app"}
applications:
  app:
    stack: [ "php@{{% latest php %}}", "facedetect" ]
    # OR
    stack:
      - "php@{{% latest php %}}"
      - "facedetect"
```

{{% note %}}
Any packages from [NixOS](https://search.nixos.org/) can be installed within your `stack`,
even the ones from the ``unstable`` channel, like [FrankenPHP](https://search.nixos.org/packages?channel=unstable&show=frankenphp&from=0&size=50&sort=relevance&type=packages&query=frankenphp).
{{% /note %}}

{{% note title="Warning" %}}
``stack`` is only applicable for application definition, not services. For services, please continue to use the [`type` definition](/add-services.html#service-options)
{{% /note %}}


### Runtime extensions

You can define, per runtime, `extensions` that you would like to add to the corresponding runtime.
To find out which extensions could be installed with your runtime, in
the [NixOs search](https://search.nixos.org/packages?from=0&size=50&sort=relevance&type=packages&query=php#) of a
runtime, filter results using the ``Package sets`` on the left and then, choose on the listed packages.
![Screenshot of the NixOs package sets selection for PHP@8.3](/images/nixos/nixos-packages.png "0.5")

### Example configuration

These are used in the format `<runtime>@<version>`:

```yaml {configFile="app"}
applications:
  myapp:
    stack:
      - "php@{{% latest "php" %}}"
        extensions:
          - apcu
          - sodium
          - xsl
          - pdo_sqlite
```




## Workers

## Access


## Variables

## Firewall

## Build



## Hooks


## Crons

The keys of the `crons` definition are the names of the cron jobs.
The names must be unique.

If an application defines both a `web` instance and `worker` instances, cron jobs run only on the `web` instance.

See how to [get cron logs](/increase-observability/logs/access-logs.md#container-logs).

The following table shows the properties for each job:

| Name               | Type                                         | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|--------------------|----------------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `spec`             | `string`                                     | Yes      | The [cron specification](https://en.wikipedia.org/wiki/Cron#Cron_expression). To prevent competition for resources that might hurt performance, use `H` in definitions to indicate an unspecified but invariant time. For example, instead of using `0 * * * *` to indicate the cron job runs at the start of every hour, you can use `H * * * *` to indicate it runs every hour, but not necessarily at the start. This prevents multiple cron jobs from trying to start at the same time. |
| `commands`         | A [cron commands dictionary](#cron-commands) | Yes      | A definition of what commands to run when starting and stopping the cron job.                                                                                                                                                                                                                                                                                                                                                                                                               |
| `shutdown_timeout` | `integer`                                    | No       | When a cron is canceled, this represents the number of seconds after which a `SIGKILL` signal is sent to the process to force terminate it. The default is `10` seconds.                                                                                                                                                                                                                                                                                                                    |
| `timeout`          | `integer`                                    | No       | The maximum amount of time a cron can run before it's terminated. Defaults to the maximum allowed value of `86400` seconds (24 hours).

Note that you can [cancel pending or running crons](/environments/cancel-activity.md).

### Cron commands

| Name    | Type     | Required | Description                                                                                                                                                                                                                                                                        |
|---------|----------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `start` | `string` | Yes      | The command that's run. It's run in [Dash](https://en.wikipedia.org/wiki/Almquist_shell).                                                                                                                                                                                          |
| `stop`  | `string` | No       | The command that's issued to give the cron command a chance to shutdown gracefully, such as to finish an active item in a list of tasks. Issued when a cron task is interrupted by a user through the CLI or Console. If not specified, a `SIGTERM` signal is sent to the process. |

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    stack: ["nodejs@{{% latest nodejs %}}"]
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
stack: ["php@{{% latest php %}}"]
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
stack: ["ruby@{{% latest ruby %}}"]
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
stack: ["php@{{% latest php %}}"]
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
stack: ["php@{{% latest php %}}"]
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
    stack: ["php@{{% latest php %}}"]
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

## TODO REMOVE Runtime

The following table presents the various possible modifications to your PHP or Lisp runtime:

| Name                        | Type                                                       | Language | Description                                                                                |
|-----------------------------|------------------------------------------------------------|----------|--------------------------------------------------------------------------------------------|
| `extensions`                | List of `string`s OR [extensions definitions](#extensions) | PHP      | [PHP extensions](/languages/php/extensions.md) to enable.                                |
| `disabled_extensions`       | List of `string`s                                          | PHP      | [PHP extensions](/languages/php/extensions.md) to disable.                               |
| `request_terminate_timeout` | `integer`                                                  | PHP      | The timeout for serving a single request after which the PHP-FPM worker process is killed. |
| `sizing_hints`              | A [sizing hints definition](#sizing-hints)                 | PHP      | The assumptions for setting the number of workers in your PHP-FPM runtime.                 |
| `xdebug`                    | An Xdebug definition                                       | PHP      | The setting to turn on [Xdebug](/languages/php/xdebug.md).                               |
| `quicklisp`                 | Distribution definitions                                   | Lisp     | [Distributions for QuickLisp](/languages/lisp.md#quicklisp-options) to use.              |

You can also set your [app's runtime timezone](/create-apps/timezone.md).

### TODO REMOVE Extensions

{{% note title="TODO" %}}
Thread on how to configure extension
https://platformsh.slack.com/archives/C05293DK8EP/p1710924878478049
Waiting for engineers to decide if either we keep or remove this section
{{% /note %}}

You can enable [PHP extensions](/languages/php/extensions.md) just with a list of extensions:

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    stack: ["php@{{% latest php %}}"]
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
    stack: ["php@{{% latest php %}}"]
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

| Name              | Type      | Default | Minimum | Description                                    |
|-------------------|-----------|---------|---------|------------------------------------------------|
| `request_memory`  | `integer` | 45      | 10      | The average memory consumed per request in MB. |
| `reserved_memory` | `integer` | 70      | 70      | The amount of memory reserved in MB.           |

See more about [PHP-FPM workers and sizing](/languages/php/fpm.md).

{{% note title="TODO" %}}
Not sure if applicable.
{{% /note %}}

## Source

The following table shows the properties that can be set in `source`:

| Name         | Type                     | Required | Description                                                                                                                     |
|--------------|--------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------|
| `operations` | An operations dictionary |          | Operations that can be applied to the source code. See [source operations](/create-apps/source-operations.md)                             |
| `root`       | `string`                 |          | The path where the app code lives. Defaults to the root project directory. Useful for [multi-app setups](/create-apps/multi-app/_index.md). |

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
    stack: ["php@{{% latest php %}}"]
    additional_hosts:
      api.example.com: "192.0.2.23"
      web.example.com: "203.0.113.42"
```

This is equivalent to adding the mapping to the `/etc/hosts` file for the container.
