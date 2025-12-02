---
title: "Single-runtime image"
weight: 4
description: See all of the options for controlling your apps and how they're built and deployed on {{% vendor/name %}}.
---

{{% description %}}

Use the `{{< vendor/configfile "app" >}}` file,
located at the root of your Git repository, to configure the apps in a single-runtime image.

See a [comprehensive example](/create-apps/_index.md#comprehensive-example) of a configuration in
a `{{< vendor/configfile "app" >}}` file.

[Multi-app projects](/create-apps/multi-app/_index.md) can be set up in various ways.

## Primary application properties

In the `{{< vendor/configfile "app" >}}` file, configure each application as a unique key beneath the top-level `applications` key.

For example, if your deployed site requires a Javascript `frontend` application container and a Python `backend` application container, the `{{< vendor/configfile "app" >}}` file would start to look something like this:

```yaml {configFile="app"}
applications:
  frontend:
    type: 'nodejs:{{% latest "nodejs" %}}'
    # Additional frontend configuration
  backend:
    type: 'python:{{% latest "python" %}}'
    # Additional backend configuration
```

The following table presents all of the properties available to each unique app beneath the `applications` key.

The **Set in instance** column defines whether the given property can be overridden within a `web` or `workers` instance.
To override any part of a property, you have to provide the entire property.

{{% note theme="info" %}}

The `build`, `dependencies`, and `runtime` properties are unique to this image type and are described later in this topic. All other properties are available in both single-runtime and composable images — click a property name to view its details in a separate topic.

{{% /note %}}

| Name                                                                      | Type                                                                                       | Required | Set in instance? | Description                                                                                                                                                                                                                                                      |
|---------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|----------|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`type`](#types)                                                          | A type                                                                          | Yes      | No               | The base image to use with a specific app language. Format: `runtime:version`.                                                                                                                                                                                   |
| [`container_profile`](/create-apps/image-properties/container_profile.md) | A container profile |          | Yes              | Determines which combinations of CPU and RAM a container can use.
| [`relationships`](/create-apps/image-properties/relationships.md)         | A dictionary of relationships                                            |          | Yes              | Connections to other services and apps.                                                                                                                                                                                                                          |
| [`mounts`](/create-apps/image-properties/mounts.md)                       | A dictionary of mounts                                                           |          | Yes              | Directories that are writable even after the app is built. Allocated disk for mounts is defined with a separate resource configuration call using `{{% vendor/cli %}} resources:set`.                                                                            |
| [`web`](/create-apps/image-properties/web.md)                             | A web instance                                                                     |          | N/A              | How the web application is served.                                                                                                                                                                                                                               |
| [`workers`](/create-apps/image-properties/workers.md)                     | A worker instance                                                             |          | N/A              | Alternate copies of the application to run as background processes.                                                                                                                                                                                              |
| [`timezone`](/create-apps/timezone.md)                                    | `string`                                                                                   |          | No               | The timezone for crons to run. Format: a [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Defaults to `UTC`, which is the timezone used for all logs no matter the value here. See also [app runtime timezones](../timezone.md) |
| [`access`](/create-apps/image-properties/access.md)                       | An access dictionary                                                            |          | Yes              | Access control for roles accessing app environments.                                                                                                                                                                                                             |
| [`variables`](/create-apps/image-properties/variables.md)                 | A variables dictionary                                                       |          | Yes              | Variables to control the environment.                                                                                                                                                                                                                            |
| [`firewall`](/create-apps/image-properties/firewall.md)                   | A firewall dictionary                                                       |          | Yes              | Outbound firewall rules for the application.                                                                                                                                                                                                                     |
| [`build`](#build)                                                         | A build dictionary                                                               |          | No               | What happens when the app is built.                                                                                                                                                                                                                              |
| [`dependencies`](#dependencies)                                           | A dependencies dictionary                                                 |          | No               | What global dependencies to install before the `build` hook runs.                                                                                                                                                                                              |
| [`hooks`](/create-apps/image-properties/hooks.md)                         | A hooks dictionary                                                               |          | No               | What commands run at different stages in the `build`, `deploy`, and `post_deploy` phases.                                                                                                                                                                                           |
| [`crons`](/create-apps/image-properties/crons.md)                         | A cron dictionary                                                                |          | No               | Scheduled tasks for the app.                                                                                                                                                                                                                                     |
| [`source`](/create-apps/image-properties/source.md)                       | A source dictionary                                                             |          | No               | Details about the app’s source code and available operations.                                                                                                                                                                                       |
| [`runtime`](#runtime)                                                     | A runtime dictionary                                                           |          | No               | Customizations to your PHP runtime.                                                                                                                                                                                                                      |
| [`additional_hosts`](/create-apps/image-properties/additional_hosts.md)   | An additional hosts dictionary                                        |          | Yes              | Mappings of hostnames to IP addresses.                                                                                                                                                                                                               |
| [`operations`](/create-apps/runtime-operations.md)                        | A dictionary of runtime operations                   |          | No               | Runtime operations for the application.                                                                                                                                                                                                                          |

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

To specify another directory, for example for a [multi-app project](../multi-app/_index.md),
use the [`source.root` property](create-apps/image-properties/source.md).

## `type` {#types}

{{% note theme="info" %}}
To install _multiple_ runtimes and tools in your application container, use the {{% vendor/name %}} composable image.<br>
If you arrived here from another page, you may want to review the supported `stack` key where `type` was referenced.<br>
For details, see the list of [supported Nix runtimes](/create-apps/app-reference/composable-image.md#supported-nix-packages) that you can define in a composable image `stack`.
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
applications:
  {{% variable "APP_NAME" %}}:
    type: 'php:{{% latest "php" %}}'
```

### Combine single-runtime and composable images {#combine-single-runtime-and-composable-images}

In a [multiple application context](/create-apps/multi-app/_index.md),
you can use a mix of single-runtime images
and [composable images](/create-apps/app-reference/composable-image.md).


The following sample configuration includes two applications:
- ``frontend`` – uses a single-runtime image
- ``backend`` – uses a composable image<br>

```yaml {configFile="app"}
applications:
  frontend:
    # this app uses the single-runtime image with a specific node.js runtime
    type: 'nodejs:{{% latest "nodejs" %}}'
  backend:
    # this app uses the composable image and specifies two runtimes
    type: "composable:{{% latest composable %}}"
    stack:
      runtimes:
        - "php@8.4":
            extensions:
              - apcu
              - sodium
              - xsl
              - pdo_sqlite
        - "python@3.13"
      packages:
        - "python313Packages.yq" # python package specific
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
applications:
  myapp:
    source:
      root: "/"
    type: 'nodejs:{{% latest "nodejs" %}}'
    build:
      flavor: none
```

## `dependencies` {#dependencies}

Installs global dependencies as part of the build process.
They're independent of the code dependencies of your application
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
applications:
  {{% variable "APP_NAME" %}}:
    type: 'nodejs:{{% latest "nodejs" %}}'
    source:
      root: "/"
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

This applies to PHP only.

The following table lists the various possible modifications to your PHP runtime:

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
To install multiple runtimes and tools in your application container, use the {{% vendor/name %}} composable image.<br>
If you arrived here from another page and you are using the composable image, you enable and disable extensions by using the `stack.runtimes.extensions`/`stack.runtimes.disabled_extensions` keys.<br>
For details and an example, see the [`stack`](/create-apps/app-reference/composable-image.md#stack) section in the "Composable image" topic.
{{% /note %}}

You can enable [PHP extensions](/languages/php/extensions.md) just with a list of extensions:

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: 'php:{{% latest "php" %}}'
    source:
      root: "/"
    runtime:
      extensions:
        - geoip
        - tidy
```

Alternatively, if you need to include configuration options, use a dictionary for that extension:

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: 'php:{{% latest "php" %}}'
    source:
      root: "/"
    runtime:
      extensions:
        - geoip
        - name: blackfire
          configuration:
            server_id: {{% variable "SERVER_ID" %}}:
            server_token: {{% variable "SERVER_TOKEN" %}}:
```

In this case, the `name` property is required.

### Sizing hints

The following table shows the properties that can be set in `sizing_hints`:

| Name              | Type      | Default | Minimum | Description                                    |
|-------------------|-----------|---------|---------|------------------------------------------------|
| `request_memory`  | `integer` | 45      | 10      | The average memory consumed per request in MB. |
| `reserved_memory` | `integer` | 70      | 70      | The amount of memory reserved in MB.           |

See more about [PHP-FPM workers and sizing](/languages/php/fpm.md).


## Resources (CPU, memory, and disk space) {#resources}

By default, {{% vendor/name %}} assigns a container profile and container size to each application and service on the first deployment of a project. <br>

The container _profile_ defines and enforces a specific CPU-to-memory ratio. The default container profile for an app or service in a composable image is ``HIGH_CPU``.

Use the {{% vendor/name %}} CLI or Console to manually adjust the allocated container _size_ (CPU and memory resources)—that is, to perform a **vertical‑scaling** action. When you redeploy, the container runs with the CPU‑to‑memory ratio defined by its profile, so it enforces the size you specified.

Related topics:
- For detailed steps for changing the container size, see the [Vertical scaling](/manage-resources/adjust-resources.html#vertical-scaling) section of the "Resource configuration topic.
- For details about container sizes for each resource allocation strategy (shared CPU, guaranteed CPU, and initial allocation), see the [Advanced: Container profiles](/manage-resources/adjust-resources.md#advanced-container-profiles) section of the "Resource configuration" topic.
- To learn more about general resource management in {{% vendor/name %}}, see the topics in the [Manage resources](/manage-resources.md) section.


### Downsize a disk

You can reduce the target disk size of an app. Keep in mind:
- Backups created before the downsize are incompatible and cannot be used; you must [create new backups](/environments/backup.md).
- The downsize will fail if the disk contains more data than the target size.
