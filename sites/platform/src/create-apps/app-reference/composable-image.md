---
title: "Composable image"
weight: 3
description: Use {{% vendor/name %}}'s composable image to build and deploy your app.
keywords:
  - sleepy crons
  - sleepy_crons
---

The {{% vendor/name %}} composable image provides enhanced flexibility when defining your app.
It allows you to install several runtimes and tools in your application container,
in a **"one image to rule them all"** approach.

The composable image is built on [Nix](https://nix.dev), which offers the following benefits:

- You can add as many packages to your application container as you need,
  choosing from over 120,000 packages from [the Nixpkgs collection](https://search.nixos.org/packages).
- The packages you add are built in total isolation, so you can install different versions of the same package.
- With [Nix](https://nix.dev/reference/glossary#term-Nix), there are no undeclared dependencies in your source code.
  What works on your local machine is guaranteed to work on any other machine.

This page introduces all the settings available to configure your composable image from your `{{< vendor/configfile "app" >}}` file
(usually located at the root of your Git repository).</br>
Note that multi-app projects can be [set in various ways](/create-apps/multi-app/_index.md).

You can also skip directly to this [comprehensive example](/create-apps/_index.md#comprehensive-example) of a composable image configuration on the "Configure apps" page. This example includes all of the top-level properties listed in the table in the next section.


## Top-level properties

All application configuration takes place in a `{{< vendor/configfile "app" >}}` file, with each application configured under a unique key beneath the top-level `applications` key.

The following table presents all of the properties available to each unique application `name`.

The **Set in instance** column defines whether the given property can be overridden within a `web` or `workers` instance.
To override any part of a property, you must provide the entire property.

{{% note theme="info" %}}

- The `type` and `stack` properties are unique to the composable image type and are described later in this topic. All other properties are available in both single-runtime and composable images — click a property name to view its details in a separate topic.  
- The ``stack`` key replaces the ``build``, ``dependencies``, and ``runtime`` keys that are available in the [single-runtime image](/create-apps/app-reference/single-runtime-image.md).


| Name               | Type                                                                     | Required | Set in instance? | Description                                                                                                                                                                                                                                                                |
|--------------------|--------------------------------------------------------------------------|----------|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`             | `string`                                                                 | Yes      | No               | A unique name for the app. Must be lowercase alphanumeric characters. **Changing the name destroys data associated with the app**.                                                                                                                                             |
| [`type`](#type)             | A type                                                         | Yes      | No               | [Defines the version of the Nix channel](#supported-nix-channels). Mandatory in each application that uses the composable image. Example: `type: "composable:{{% latest composable %}}"`.                                                                                                                                                                                      |
| [`stack`](#stack)              |  `runtimes` and/or  `packages` arrays                                                     | Yes      | No               | Specifies [{{% vendor/name %}}-supported `runtimes`](#supported-nix-packages) and extra [NixPkgs `packages`](https://search.nixos.org/packages) beyond those in the `type` channel.                                                                                            |
| [`size`](/create-apps/image-properties/size.md)             | A container size                                                         |          | Yes              | Amount of resources to allocate to the app; defaults to `AUTO` in production environments. Examples: `S`, `M`,`4XL`.                                                                                                                                                           |
| [`relationships`](/create-apps/image-properties/relationships.md)    | A dictionary of relationships                          |          | Yes              | Connections to other services and apps.                                                                                                                                                                                                                                    |
| [`disk`](/create-apps/image-properties/disk.md)             | `integer` or `null`                                                      |          | Yes              | The size of the disk space for the app in [MB](/glossary/_index.md#mb). Minimum value is `128`. Defaults to `null`, meaning no disk is available.                                                                      |
| [`mounts`](/create-apps/image-properties/mounts.md)           | A dictionary of mounts                                        |          | Yes              | Directories that are writable even after the app is built. If set as a local source, `disk` is required.                                                                                                                                                                   |
| [`web`](/create-apps/image-properties/web.md)              | A web instance                                                   |          | N/A              | How the web application is served.                                                                                                                                                                                                                                         |
| [`workers`](/create-apps/image-properties/workers.md)          | A worker instance                                            |          | N/A              | Alternate copies of the application to run as background processes.                                                                                                                                                                                                        |
| `timezone`         | `string`                                                                 |          | No               | The timezone for crons to run. Format: a [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Defaults to `UTC`, which is the timezone used for all logs no matter the value here. See also [app runtime timezones](/create-apps/timezone.md). |
| [`access`](/create-apps/image-properties/access.md)           | An access dictionary                                          |          | Yes              | Access control for roles accessing app environments.                                                                                                                                                                                                                       |
| [`variables`](/create-apps/image-properties/variables.md)        | A variables dictionary                                     |          | Yes              | Variables to control the environment.                                                                                                                                                                                                                                      |
| [`firewall`](/create-apps/image-properties/firewall.md)         | A firewall dictionary                                       |          | Yes              | Outbound firewall rules for the application.                                                                                                                                                                                                                               |
| [`hooks`](/create-apps/image-properties/hooks.md)            | A hooks dictionary                                             |          | No               | Specifies commands and/or scripts to run in the `build`, `deploy`, and `post_deploy` phases.                                                                                                                                                                                                      |
| [`crons`](/create-apps/image-properties/crons.md)            | A cron dictionary                                              |          | No               | Scheduled tasks for the app.                                                                                                                                                                                                                                               |
| [`source`](/create-apps/image-properties/source.md)           | A source dictionary                                           |          | No               | Information on the app source code and operations that can be run on it.                                                                                                                                                                                                 |
| [`additional_hosts`](/create-apps/image-properties/additional_hosts.md) | An additional hosts dictionary                      |          | Yes              | Mappings of hostnames to IP addresses.                                                                                                                                                                                                                                         |
| [`operations`](/create-apps/runtime-operations.md)       | A dictionary of runtime operations |          | No               | Runtime operations for the application.                                                                                                                                                                                                                                    |



## `type` {#type}

Required for all applications that use the composable image. Defines the version of the Nix channel that application uses. 

For example, to specify the Nix channel `{{% latest composable %}}` for `{{< variable "APP_NAME" >}}`, use the following syntax:

```yaml {configFile="apps"}
applications:
  {{% variable "APP_NAME" %}}:
      type: "composable:{{% latest composable %}}"
```

### Supported Nix channels

Upsun supports the following Nix channel versions: 

- `{{% latest composable %}}`

View the list of [supported Nix runtimes](#supported-nix-packages) in the `stack` section below. 

## `stack` {#stack}

You must define the `stack` element by using distinct `runtimes` and `packages` keys, as described in the following table. 

See the [example `stack` configuration](#example-stack-configuration) that follows this table.

| Name            | Type                | Required | Additional keys | Description                                                       | 
|-----------------|---------------------|------------------| ----------|-------------------------------------------------------------------|
| `runtimes` | array     |  No        | `extensions`, `disabled_extensions`, and related subkeys | An array of 1+ language runtimes specified as `"<nixruntime@version>"` or `<nixruntime>`.<BR>The first declared runtime (or _[primary runtime](#primary-runtime)_) is started automatically.<BR>See the complete list of [supported runtimes](#supported-nix-packages) below. |
| `packages`      | array |  No        | `package`, `channel`, additional keys to demonstrate passthrough flexibility | Additional Nix tools/libraries, using the channel from `type` unless overridden locally by specifying the `package` and its `channel`. Format: `<nixpackage>`   |

### Example: `stack` configuration {#example-stack-configuration}

The `config.yaml` file excerpt below shows the following stack configuration: 
- `php@{{% latest "php" %}}` as the primary runtime with additional `extensions` and one `disabled_extensions`
- `nodejs@{{% latest "nodejs" %}}` and `python@{{% latest "python" %}}` runtimes
- `yq`, `yarn`, and `python313Packages.yq` packages (by default from the latest {{% vendor/company_name %}}-supported Nix channel you defined in `type`)
- `wkhtmltopdf` package from the `unstable` Nix channel


```yaml {configFile="app"}
applications: 
  {{% variable "APP_NAME" %}}:
    type: "composable:{{% latest composable %}}"
    stack:
      runtimes:
        - "php@{{% latest "php" %}}":
            extensions: 
              - apcu
              - sodium
              - xsl
              - pdo_sqlite
              - php-facedetect
            disabled_extensions:
              - gd
        - "nodejs@{{% latest "nodejs" %}}"
        - "python@{{% latest "python" %}}"
      packages:
        - yq                     # tool
        - yarn
        - python313Packages.yq # specific Python package
        - package: wkhtmltopdf
          channel: unstable
```

{{% note theme=warning title="Warning" %}}
While technically available during the build phase, `nix` commands aren't supported at runtime because the image becomes read-only.

When using the {{% vendor/name %}} composable image, you don't need `nix` commands.
Everything you install using the `stack` key is readily available to you as the binaries are linked and included in `$PATH`.

For instance, to [start a secondary runtime](#primary-runtime),
just issue the command (e.g. in the [`start` command](/create-apps/app-reference/composable-image.md#web-commands)) instead of the `nix run` command.
{{% /note %}}

### Primary runtime {#primary-runtime}

If you add multiple runtimes to your application container,
the first declared runtime becomes the primary runtime.
The primary runtime is the one that is automatically started.

To start other declared runtimes, you need to start them manually by using [web commands](/create-apps/image-properties/web.md#web-commands).
To find out which start command to use, go to the [Languages](/languages/_index.md) section
and visit the documentation page dedicated to your runtime.

{{% note %}}
If you use PHP, note that PHP-FPM is only started automatically if PHP is defined as the primary runtime.
{{% /note %}}

See the [`stack` configuration example](#example-stack-configuration) above, which declares multiple runtimes.

{{% composable/composable-channels %}}


### Supported runtimes {#supported-nix-packages}

{{% note %}}

Upsun officially supports the Nix runtimes below, and you can add them to `stack.runtimes`.</br>
Runtimes not listed below are supported only by Nix as NixPkgs _packages_, not as {{% vendor/name %}} runtimes. Add them to `stack.packages`. </br>For example, if your app requires the [FrankenPHP](https://search.nixos.org/packages?channel=unstable&show=frankenphp&from=0&size=50&sort=relevance&type=packages&query=frankenphp) runtime from the `unstable` channel, you would add this to `stack.packages`. See the [`stack` configuration example](#example-stack-configuration) above for a similar addition.

{{% /note %}}

Note that for some runtimes (such as Clojure), you can specify only the major version. 
</br>
For other runtimes (such as Elixir), you can specify either the major or the major.minor version. 
Security and other patches are applied automatically.

| **Language**                                 | **Nix package** | **Supported version(s)**                        |
|----------------------------------------------|-----------------|-------------------------------------------------|
| [Clojure](https://clojure.org/)              | `clojure`       | 1                                               |
| [Elixir](/languages/elixir.html)             | `elixir`        | 1.18<br/>1.15<br/>1.14                          |
| [Go](/languages/go.html)                     | `golang`        | 1.22<br/>1.21                                   |
| [Java](/languages/java.html)                 | `java`          | 22<br/>21                                       |
| [Javascript/Bun](https://bun.sh/)            | `bun`           | 1                                               |
| [JavaScript/Node.js](/languages/nodejs.html) | `nodejs`        | 24<br/>22<br/>20<br/>18                         |
| [Perl](https://www.perl.org/)                | `perl`          | 5                                               |
| [PHP](/languages/php.html)                   | `php`           | 8.4<br/>8.3<br/>8.2<br/>8.1                     |
| [Python](/languages/python.html)             | `python`        | 3.13<br/>3.12<br/>3.11<br/>3.10<br/>3.9<br/>2.7 |
| [Ruby](/languages/ruby.html)                 | `ruby`          | 3.4<br/>3.3<br/>3.2<br/>3.1                     |

**Example:**

You want to add PHP version {{% latest php %}} and ``facedetect`` to your application container.
To do so, use the following configuration:

```yaml {configFile="apps"}
myapp:
  stack: [ "php@{{% latest php %}}", "facedetect" ]
  # OR
  stack:
    - "php@{{% latest php %}}"
    - "facedetect"
```

### PHP extensions and Python packages

When you add PHP or Python to `stack.runtimes`,
you can define which PHP extensions to add to `stack.runtimes.extensions` or Python packages to add to `stack.packages`.

To find out which extensions you can install with your runtime,
follow these steps:

1. Go to the [NixOS search](https://search.nixos.org/).
2. Enter a runtime and click **Search**.
3. In the **Package sets** side bar, select the right set of extensions/packages for your runtime version.</br>
   You can choose the desired extensions/packages from the filtered results.

![Screenshot of the Nix package sets selection for PHP@8.3](/images/nixos/nixos-packages.png "0.5")

#### Install PHP runtime extensions

Indicate enabled or disabled [PHP extensions](/languages/php/extensions.md) by including the `extensions` and `disabled_extensions` keys as needed to `stack.runtimes`.</br>

See `stack.runtimes` in the [example `stack` configuration](#example-stack-configuration) above.

{{% note %}}
To help you find out the name of the PHP package you want to use,
some maintainers provide a ``PHP upstream extension`` value in the [NixOS search engine](https://search.nixos.org/packages?channel=unstable&show=php82Extensions.gd).

![Screenshot of an upstream extension value shown in the NixOS search](/images/nixos/nixossearch-upstream-value.png "0.5")

If this information is not provided, note that PHP package names on NixOS always respect the ``<PHP><VERSION>Extensions.<EXTENSION-NAME>`` format.</br>
Therefore, you can copy the ``<EXTENSION-NAME>`` as shown in the NixOS search results, and use it in your configuration.

{{% /note %}}

Note that you can use environment variables or your `php.ini` file to [include further configuration options](/languages/php/_index.md#customize-php-settings) for your PHP extensions.

#### Install Python packages

To install Python packages, add them to your stack as new packages.
To do so, use the full name of the package.

For instance, to install [``python313Packages.yq``](https://search.nixos.org/packages?channel=unstable&show=python313Packages.yq),
use the following configuration:

```yaml {configFile="apps"}
myapp:
  stack:
    - "python@3.13"
    - "python313Packages.yq" # python package specific
```

Alternatively, if you need to include configuration options for your extensions, use either your ``php.ini`` file or [environment variables](/development/variables/set-variables.md).

### Example configuration

Here is a full composable image configuration example. Note the use of the `<nixpackage>@<version>` format.

```yaml {configFile="apps"}
myapp:
  stack:
    - "php@{{% latest "php" %}}":
        extensions:
          - apcu
          - sodium
          - xsl
          - pdo_sqlite
    - "python@3.13"
    - "python313Packages.yq" # python package specific
    - "yq"                   # tool
```

### Combine single-runtime and composable images

In a [multiple application context](/create-apps/multi-app/_index.md),
you can use a mix of [single-runtime images](/create-apps/app-reference/single-runtime-image.md)
and [composable images](/create-apps/app-reference/composable-image.md).
Here is an example configuration including a ``frontend`` app and a ``backend`` app:

```yaml {configFile="apps"}
backend:
    stack:
      - "php@{{% latest "php" %}}":
          extensions:
            - apcu
            - sodium
            - xsl
            - pdo_sqlite
      - "python@3.13"
      - "python313Packages.yq" # python package specific
frontend:
    type: 'nodejs:{{% latest "nodejs" %}}
```

{{% note %}}
If you add multiple runtimes to your application container,
the first declared runtime becomes the primary runtime.
The primary runtime is the one that is automatically started.

To start other declared runtimes, you need to start them manually, using [web commands](#web-commands).
To find out which start command to use, go to the [Languages](/languages/_index.md) section,
and visit the documentation page dedicated to your language.

If you use PHP, note that PHP-FPM is only started automatically if PHP is defined as the primary runtime.
{{% /note %}}
