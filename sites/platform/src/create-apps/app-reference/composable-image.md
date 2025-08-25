---
title: "Composable image"
weight: 3
description: Use {{% vendor/name %}}'s composable image to build and deploy your app.
keywords:
  - sleepy crons
  - sleepy_crons
beta: true
banner:
  title: Beta Feature
  body: The {{% vendor/name %}} composable image is currently available in Beta.
        This feature as well as its documentation is subject to change.
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

If you're pressed for time, jump to this comprehensive [configuration example](/create-apps/_index.md#comprehensive-example).

## Top-level properties

The following table lists all the properties you can use at the top level of your app's YAML configuration file.

The column _Set in instance?_ defines whether the given property can be overridden within a `web` or `workers` instance.
To override any part of a property, you have to provide the entire property.

- **Note:** Several properties (for example, `size`, `relationships`, `mounts`) are available in **both** the single-runtime and composable image types. Clicking the link for their details leads you to a separate topic for that property. Descriptions for properties that are **unique** to this image type are provided later in this topic.  


| Name               | Type                                                                     | Required | Set in instance? | Description                                                                                                                                                                                                                                                                |
|--------------------|--------------------------------------------------------------------------|----------|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`             | `string`                                                                 | Yes      | No               | A unique name for the app. Must be lowercase alphanumeric characters. Changing the name destroys data associated with the app.                                                                                                                                             |
| `type`             | A type                                                         | Yes      | No               | [Defines the version of the Nix channel](#supported-nix-channels). Example: `type: "composable:25.05"`                                                                                                                                                                                      |
| [`stack`](#stack)            | An array of Nix packages                                     | Yes      | No               | A list of packages from the {{% vendor/name %}} collection of [supported runtimes](#supported-nix-packages) and/or from [Nixpkgs](https://search.nixos.org/packages).                                                                                                      |
| [`size`](/create-apps/image-properties/size.md)             | A size                                                         |          | Yes              | How much resources to devote to the app. Defaults to `AUTO` in production environments.                                                                                                                                                                                    |
| [`relationships`](/create-apps/image-properties/relationships.md)    | A dictionary of relationships                          |          | Yes              | Connections to other services and apps.                                                                                                                                                                                                                                    |
| [`disk`](/create-apps/image-properties/disk.md)             | `integer` or `null`                                                      |          | Yes              | The size of the disk space for the app in [MB](/glossary/_index.md#mb). Minimum value is `128`. Defaults to `null`, meaning no disk is available.                                                                      |
| [`mounts`](/create-apps/image-properties/mounts.md)           | A dictionary of mounts                                        |          | Yes              | Directories that are writable even after the app is built. If set as a local source, `disk` is required.                                                                                                                                                                   |
| [`web`](/create-apps/image-properties/web.md)              | A web instance                                                   |          | N/A              | How the web application is served.                                                                                                                                                                                                                                         |
| [`workers`](/create-apps/image-properties/workers.md)          | A worker instance                                            |          | N/A              | Alternate copies of the application to run as background processes.                                                                                                                                                                                                        |
| `timezone`         | `string`                                                                 |          | No               | The timezone for crons to run. Format: a [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Defaults to `UTC`, which is the timezone used for all logs no matter the value here. See also [app runtime timezones](/create-apps/timezone.md). |
| [`access`](/create-apps/image-properties/access.md)           | An access dictionary                                          |          | Yes              | Access control for roles accessing app environments.                                                                                                                                                                                                                       |
| [`variables`](/create-apps/image-properties/variables.md)        | A variables dictionary                                     |          | Yes              | Variables to control the environment.                                                                                                                                                                                                                                      |
| [`firewall`](/create-apps/image-properties/firewall.md)         | A firewall dictionary                                       |          | Yes              | Outbound firewall rules for the application.                                                                                                                                                                                                                               |
| [`hooks`](/create-apps/image-properties/hooks.md)            | A hooks dictionary                                             |          | No               | What commands run at different stages in the build and deploy process.                                                                                                                                                                                                     |
| [`crons`](/create-apps/image-properties/crons.md)            | A cron dictionary                                              |          | No               | Scheduled tasks for the app.                                                                                                                                                                                                                                               |
| [`source`](/create-apps/image-properties/source.md)           | A source dictionary                                           |          | No               | Information on the app's source code and operations that can be run on it.                                                                                                                                                                                                 |
| [`additional_hosts`](/create-apps/image-properties/additional_hosts.md) | An additional hosts dictionary                      |          | Yes              | Maps of hostnames to IP addresses.                                                                                                                                                                                                                                         |
| [`operations`](/create-apps/runtime-operations.md)       | A dictionary of runtime operations |          | No               | Runtime operations for the application.                                                                                                                                                                                                                                    |

{{% note %}}
The ``build``, ``dependencies``, and ``runtime`` keys are only supported when using a [single-runtime image](/create-apps/app-reference/single-runtime-image.md).
They are **not** supported when using the composable image.
They are replaced by the `stack` key.
{{% /note %}}


## `stack` {#stack}

Use the ``stack`` key to define which runtimes and binaries you want to install in your application container.
Define them as a YAML array as follows:

```yaml {configFile="apps"}
myapp:
  stack: [ "<nixpackage>@<version>" ]
  # OR
  stack:
    - "<nixpackage>@<version>"
```

To add a language to your stack, use the `<nixpackage>@<version>` format.</br>
To add a tool to your stack, use the `<nixpackage>` format, as no version is needed.

{{% note theme=warning title="Warning" %}}
While technically available during the build phase, `nix` commands aren't supported at runtime as the image becomes read-only.

When using the {{% vendor/name %}} composable image, you don't need `nix` commands.
Everything you install using the `stack` key is readily available to you as the binaries are linked and included in `$PATH`.

For instance, to [start a secondary runtime](#primary-runtime),
just issue the command (e.g. in the [`start` command](/create-apps/app-reference/composable-image.md#web-commands)) instead of the `nix run` command.
{{% /note %}}

#### Primary runtime

If you add multiple runtimes to your application container,
the first declared runtime becomes the primary runtime.
The primary runtime is the one that is automatically started.

To start other declared runtimes, you need to start them manually, using [web commands](#web-commands).
To find out which start command to use, go to the [Languages](/languages/_index.md) section,
and visit the documentation page dedicated to your runtime.

{{% note %}}
If you use PHP, note that PHP-FPM is only started automatically if PHP is defined as the primary runtime.
{{% /note %}}

### Supported Nix channels

- `24.05`
- `25.05`

### Configure Nix channels

The Nix channel can be configured with the [top-level property `type`](#top-level-properties). 

For example, to use the Nix channel `25.05`, you would use the following syntax:

```yaml {configFile="apps"}

type: "composable:25.05"

```

### Supported Nix packages

{{% note %}}
The Nix packages listed in the following table are officially supported by {{% vendor/name %}} to provide optimal user experience.</br>
However, you can add any other packages from [the Nixpkgs collection](https://search.nixos.org/) to your `stack`.
This includes packages from the ``unstable`` channel,
like [FrankenPHP](https://search.nixos.org/packages?channel=unstable&show=frankenphp&from=0&size=50&sort=relevance&type=packages&query=frankenphp).</br>
While available for you to install, packages that aren't listed in the following table are supported by Nix itself, not {{% vendor/name %}}.
{{% /note %}}

Depending on the Nix package, you can select only the major runtime version,
or the major and minor runtime versions as shown in the table.
Security and other patches are applied automatically.

| **Language**                                 | **Nix package** | **Supported version(s)**             |
|----------------------------------------------|---------------|----------------------------------------|
| [Clojure](https://clojure.org/)              | `clojure`     | 1                                      |
| [Elixir](/languages/elixir.html)             | `elixir`      | 1.15<br/>1.14                          |
| [Go](/languages/go.html)                     | `golang`      | 1.22<br/>1.21                          |
| [Java](/languages/java.html)                 | `java`        | 21                                     |
| [Javascript/Bun](https://bun.sh/)            | `bun`         | 1                                      |
| [JavaScript/Node.js](/languages/nodejs.html) | `nodejs`      | 22<br/>20<br/>18                       |
| [Perl](https://www.perl.org/)                | `perl`        | 5                                      |
| [PHP](/languages/php.html)                   | `php`         | 8.3<br/>8.2<br/>8.1                    |
| [Python](/languages/python.html)             | `python`      | 3.12<br/>3.11<br/>3.10<br/>3.9<br/>2.7 |
| [Ruby](/languages/ruby.html)                 | `ruby`        | 3.3<br/>3.2<br/>3.1                    |

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

When you add PHP or Python to your application container,
you can define which extensions (for PHP) or packages (for Python) you also want to add to your stack.

To find out which extensions you can install with your runtime,
follow these steps:

1. Go to the [NixOS search](https://search.nixos.org/).
2. Enter a runtime and click **Search**.
3. In the **Package sets** side bar, select the right set of extensions/packages for your runtime version.</br>
   You can choose the desired extensions/packages from the filtered results.

![Screenshot of the Nix package sets selection for PHP@8.3](/images/nixos/nixos-packages.png "0.5")

#### Install PHP extensions

To enable [PHP extensions](/languages/php/extensions.md),
specify a list of `extensions` below the language definition.</br>
To disable [PHP extensions](/languages/php/extensions.md),
specify a list of `disabled_extensions` below the language definition.</br>
For instance:

```yaml {configFile="apps"}
myapp:
  source:
    root: "/"
  stack:
    - "php@{{% latest "php" %}}":
        extensions:
          - apcu
          - sodium
          - xsl
          - pdo_sqlite
        disabled_extensions:
          - gd
```

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

For instance, to install [``python312Packages.yq``](https://search.nixos.org/packages?channel=unstable&show=python312Packages.yq),
use the following configuration:

```yaml {configFile="apps"}
myapp:
  stack:
    - "python@3.12"
    - "python312Packages.yq" # python package specific
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
    - "python@3.12"
    - "python312Packages.yq" # python package specific
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
      - "python@3.12"
      - "python312Packages.yq" # python package specific
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
