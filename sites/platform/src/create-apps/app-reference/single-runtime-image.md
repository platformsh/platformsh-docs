---
title: "Single-runtime image"
weight: 2
description: See all of the options for controlling your apps and how they're built and deployed on {{% vendor/name %}}.
keywords:
  - sleepy crons
  - sleepy_crons
---

{{% description %}}

For single-app projects, the configuration is all done in a `{{< vendor/configfile "app" >}}` file,
usually located at the root of your app folder in your Git repository.
[Multi-app projects](/create-apps/multi-app/_index.md) can be set up in various ways.

See a [comprehensive example](/create-apps/_index.md#comprehensive-example) of a configuration in a `{{< vendor/configfile "app" >}}` file.

For reference, see a [log of changes to app configuration](/create-apps/upgrading.md).

## Top-level properties

The following table lists all properties available at the top level of the YAML for the app.

The column _Set in instance?_ defines whether the given property can be overridden within a `web` or `workers` instance.
To override any part of a property, you have to provide the entire property.

- **Note:** Except for the `build`, `dependencies`, and `runtime` keys, the keys listed below are available in **both** the single-runtime and composable image types. Clicking the link for their details leads you to a separate topic for that property. Descriptions for properties that are **unique** to this image type are provided later in this topic.  


| Name               | Type                                                                     | Required | Set in instance? | Description                                                                                                                                                                                                                                                                |
|--------------------|--------------------------------------------------------------------------|----------|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`             | `string`                                                                 | Yes      | No               | A unique name for the app. Must be lowercase alphanumeric characters. Changing the name destroys data associated with the app.                                                                                                                                             |
| [`type`](#types)             | A type                                                         | Yes      | No               | The base image to use with a specific app language. Format: `runtime:version`.                                                                                                                                                                                             |
| [`size`](/create-apps/image-properties/size.md)            | A size                                                        |          | Yes              | How much resources to devote to the app. Defaults to `AUTO` in production environments.                                                                                                                                                                                    |
| [`relationships`](/create-apps/image-properties/relationships.md)    | A dictionary of relationships                          |          | Yes              | Connections to other services and apps.                                                                                                                                                                                                                                    |
| [`disk`](/create-apps/image-properties/disk.md)             | `integer` or `null`                                                      |          | Yes              | The size of the disk space for the app in [MB](/glossary/_index.md#mb). Minimum value is `128`. Defaults to `null`, meaning no disk is available. See the [`disk`](/create-apps/image-properties/disk.md) property details.                                                                     |
| [`mounts`](/create-apps/image-properties/mounts.md)           | A dictionary of mounts                                        |          | Yes              | Directories that are writable even after the app is built. If set as a local source, `disk` is required.                                                                                                                                                                   |
| [`web`](/create-apps/image-properties/web.md)              | A web instance                                                   |          | N/A              | How the web application is served.                                                                                                                                                                                                                                         |
| [`workers`](/create-apps/image-properties/workers.md)          | A worker instance                                            |          | N/A              | Alternate copies of the application to run as background processes.                                                                                                                                                                                                        |
| `timezone`         | `string`                                                                 |          | No               | The timezone for crons to run. Format: a [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Defaults to `UTC`, which is the timezone used for all logs no matter the value here. See also [app runtime timezones](/create-apps/timezone.md) |
| [`access`](/create-apps/image-properties/access.md)           | An access dictionary                                          |          | Yes              | Access control for roles accessing app environments.                                                                                                                                                                                                                       |
| [`variables`](/create-apps/image-properties/variables.md)        | A variables dictionary                                     |          | Yes              | Variables to control the environment.                                                                                                                                                                                                                                      |
| [`firewall`](/create-apps/image-properties/firewall.md)         | A [firewall dictionary                                       |          | Yes              | Outbound firewall rules for the application.                                                                                                                                                                                                                               |
| [`build`](#build)              | A build dictionary                                           |          | No               | What happens when the app is built.                                                                                                                                                                                                                                        |
| [`dependencies`](#dependencies)     | A dependencies dictionary                               |          | No               | What global dependencies to install before the `build` hook is run.                                                                                                                                                                                                        |
| [`hooks`](/create-apps/image-properties/hooks.md)            | A hooks dictionary                                             |          | No               | What commands run at different stages in the build and deploy process.                                                                                                                                                                                                     |
| [`crons`](/create-apps/image-properties/crons.md)            | A cron dictionary                                              |          | No               | Scheduled tasks for the app.                                                                                                                                                                                                                                               |
| [`source`](/create-apps/image-properties/source.md)           | A source dictionary                                           |          | No               | Information on the app's source code and operations that can be run on it.                                                                                                                                                                                                 |
| [`runtime`](#runtime)          | A runtime dictionary                                         |          | No               | Customizations to your PHP runtime.                                                                                                                                                                                                                                |
| [`additional_hosts`](/create-apps/image-properties/additional_hosts.md) | An additional hosts dictionary                      |          | Yes              | Maps of hostnames to IP addresses.                                                                                                                                                                                                                                         |
| [`operations`](/create-apps/runtime-operations.md)       | A dictionary of Runtime operations |          | No               | Runtime operations for the application.                                                                                                                                                                                                                                    |
## Root directory

Some of the properties you can define are relative to your app's root directory.
The root defaults to the location of your `{{< vendor/configfile "app" >}}` file.

That is, if a custom value for `source.root` is not provided in your configuration, the default behavior is equivalent to the above.

To specify another directory, for example for a [multi-app project](/create-apps/multi-app/_index.md),
use the [`source.root` property](#source).

## `type` {#types}

{{% note theme="info" %}}
You can now use the {{% vendor/name %}} composable image to install runtimes and tools in your application container.
If you've reached this section from another page, you may be interested in supported `stacks` where `type` was referenced.
See [supported Nix packages for the `stack` key](/create-apps/app-reference/composable-image.md#supported-nix-packages) for more information.
{{% /note %}}

The `type` defines the base container image used to run the application.
The version is the major (`X`) and sometimes minor (`X.Y`) version numbers,
depending on the service, as in the following table.
Security and other patches are taken care of for you automatically.

Available languages and their supported versions:

{{< readFile file="registry/images/tables/runtimes_supported.md" markdownify="true">}}

### Example configuration

These are used in the format `runtime:version`:

```yaml {configFile="app"}
type: 'php:{{% latest "php" %}}'
```

## `build` {#build}

The only property of the `build` dictionary is `flavor`, which specifies a default set of build tasks to run.
Flavors are language-specific.

See what the build flavor is for your language:

- [Node.js](/languages/nodejs/_index.md#dependencies)
- [PHP](/languages/php/_index.md#dependencies)

In all languages, you can also specify a flavor of `none` to take no action at all
(which is the default for any language other than PHP and Node.js).

```yaml {configFile="app"}
build:
  flavor: none
```
## `dependencies` {#dependencies}

Installs global dependencies as part of the build process.
They're independent of your app's dependencies
and are available in the `PATH` during the build process and in the runtime environment.
They're installed before the `build` hook runs using a package manager for the language.

| Language | Key name              | Package manager                                                                                                    |
|----------|-----------------------|--------------------------------------------------------------------------------------------------------------------|
| PHP      | `php`                 | [Composer](https://getcomposer.org/)                                                                               |
| Python 2 | `python` or `python2` | [Pip 2](https://packaging.python.org/tutorials/installing-packages/)                                               |
| Python 3 | `python3`             | [Pip 3](https://packaging.python.org/tutorials/installing-packages/)                                               |
| Ruby     | `ruby`                | [Bundler](https://bundler.io/)                                                                                     |
| Node.js  | `nodejs`              | [npm](https://www.npmjs.com/) (see [how to use yarn](/languages/nodejs/_index.md#use-yarn-as-a-package-manager))   |

The format for package names and version constraints are defined by the specific package manager.

An example of dependencies in multiple languages:

```yaml {configFile="app"}
dependencies:
  php: # Specify one Composer package per line.
    drush/drush: '8.0.0'
    composer/composer: '^2'
  python2: # Specify one Python 2 package per line.
    behave: '*'
    requests: '*'
  python3: # Specify one Python 3 package per line.
    numpy: '*'
  ruby: # Specify one Bundler package per line.
    sass: '3.4.7'
  nodejs: # Specify one NPM package per line.
    pm2: '^4.5.0'
```

## `runtime` {#runtime}

The following table presents the various possible modifications to your PHP runtime:

| Name                        | Type                                                       | Language | Description                                                                                             |
|-----------------------------|------------------------------------------------------------|----------|---------------------------------------------------------------------------------------------------------|
| `extensions`                | List of `string`s OR [extensions definitions](#extensions) | PHP      | [PHP extensions](/languages/php/extensions.md) to enable.                                               |
| `disabled_extensions`       | List of `string`s                                          | PHP      | [PHP extensions](/languages/php/extensions.md) to disable.                                              |
| `request_terminate_timeout` | `integer`                                                  | PHP      | The timeout (in seconds) for serving a single request after which the PHP-FPM worker process is killed. |
| `sizing_hints`              | A [sizing hints definition](#sizing-hints)                 | PHP      | The assumptions for setting the number of workers in your PHP-FPM runtime.                              |
| `xdebug`                    | An Xdebug definition                                       | PHP      | The setting to turn on [Xdebug](/languages/php/xdebug.md).                                              |

You can also set your [app's runtime timezone](/create-apps/timezone.md).

### Extensions

{{% note theme="info" %}}
You can now use the {{% vendor/name %}} composable image to install runtimes and tools in your application container.
If you've reached this section from another page and are using the composable image, enabling/disabling extensions should be placed under the `stack` key instead of what is listed below.
See [how to configure extensions with the composable image](/create-apps/app-reference/composable-image.md#top-level-properties).
{{% /note %}}

You can enable [PHP extensions](/languages/php/extensions.md) just with a list of extensions:

```yaml {configFile="app"}
runtime:
  extensions:
    - geoip
    - tidy
```

Alternatively, if you need to include configuration options, use a dictionary for that extension:

```yaml {configFile="app"}
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
