---
title: "Composable image"
weight: 5
description: Use {{% vendor/name %}}'s composable image to build and deploy your app.
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
Note that multi-app projects can be [set in various ways](../multi-app/_index.md).

If you're pressed for time, jump to this comprehensive [configuration example](/create-apps/_index.md#comprehensive-example).

## Primary application properties

All application configuration takes place in a `{{< vendor/configfile "app" >}}` file, with each application configured under a unique key beneath the top-level `applications` key.

It is possible to use multiple runtimes in a single application container,
for instance PHP, NodeJS and Python, while remaining in control of their versions.

For example, the unified `{{< vendor/configfile "app" >}}` file may look like the following:

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: "composable:{{% latest composable %}}"
    stack:
      - runtimes:
          - "php@{{% latest "php" %}}":
              extensions:
                - apcu
                - sodium
                - xsl
                - pdo_sqlite
          - "nodejs@{{% latest "nodejs" %}}"
          - "python@3.13"
    # Additional {{% variable "APP_NAME" %}}: configuration
```

The following table presents all of the properties available to each unique application name (`{{< variable "APP_NAME" >}}` above).

The **Set in instance?** column defines whether the given property can be overridden within a `web` or `workers` instance.
To override any part of a property, you must provide the entire property.

{{% note theme="info" %}}

- Except for `type` and `stack` keys, the single-runtime and composable image types use the keys listed below in the same manner, and clicking the key name takes you to a separate topic for that key. Descriptions for keys that are **unique** to this image type are provided later in this topic. 
- The ``stack`` key replaces the ``build``, ``dependencies``, and ``runtime`` keys available in the [single-runtime image](/create-apps/app-reference/single-runtime-image.md).

{{% /note %}}

| Name                 | Type                                                                                     | Required | Set in instance? | Description                                                                                                                                                                                                                                                      |
|----------------------|------------------------------------------------------------------------------------------|----------|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`type`](#type)             | A type                                                         | Yes      | No               | [Defines the version of the Nix channel](#supported-nix-channels). Mandatory in each application that uses the composable image. Example: `type: "composable:{{% latest composable %}}"`.                                                                                                                                                                                      |
| [`stack`](#stack)              |  `runtimes` and/or  `packages` arrays                                                     | Yes      | No               | Defines the array of [{{% vendor/name %}}-supported `runtimes`](#supported-nix-packages) and the array of [NixPkgs `packages`](https://search.nixos.org/packages) to install in addition to those available in the channel specified in `type` key.                                                                                            |
| [`container_profile`](/create-apps/image-properties/container_profile.md)  | A container profile |          | Yes              | Container profile of the application.                                                                                                                                                                                                                            |
| [`relationships`](/create-apps/image-properties/relationships.md)      | A dictionary of relationships                                          |          | Yes              | Connections to other services and apps.                                                                                                                                                                                                                          |
| [`mounts`](/create-apps/image-properties/mounts.md)             | A dictionary of mounts                                                        |          | Yes              | Directories that are writable even after the app is built. Allocated disk for mounts is defined with a separate resource configuration call using `{{% vendor/cli %}} resources:set`.                                                                            |
|[`web`](/create-apps/image-properties/web.md)                | A web instance                                                                   |          | N/A              | How the web application is served.                                                                                                                                                                                                                               |
| [`workers`](/create-apps/image-properties/workers.md)            | A worker instance                                                            |          | N/A              | Alternate copies of the application to run as background processes.                                                                                                                                                                                              |
| `timezone`           | `string`                                                                                 |          | No               | The timezone for crons to run. Format: a [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Defaults to `UTC`, which is the timezone used for all logs no matter the value here. See also [app runtime timezones](../timezone.md). |
| [`access`](/create-apps/image-properties/access.md)             | An access dictionary                                                          |          | Yes              | Access control for roles accessing app environments.                                                                                                                                                                                                             |
| [`variables`](/create-apps/image-properties/variables.md)          | A variables dictionary                                                     |          | Yes              | Variables to control the environment.                                                                                                                                                                                                                            |
| [`firewall`](/create-apps/image-properties/firewall.md)           | A firewall dictionary                                                       |          | Yes              | Outbound firewall rules for the application.                                                                                                                                                                                                                     |
| [`hooks`](/create-apps/image-properties/hooks.md)          | A hooks dictionary                                                                 |          | No               | What commands run at different stages in the build and deploy process.                                                                                                                                                                                           |
| [`crons`](/create-apps/image-properties/crons.md)              | A cron dictionary                                                              |          | No               | Scheduled tasks for the app.                                                                                                                                                                                                                                     |
| [`source`](/create-apps/image-properties/source.md)             | A source dictionary                                                           |          | No               | Information on the app's source code and operations that can be run on it.                                                                                                                                                                                       |
| [`additional_hosts`](/create-apps/image-properties/additional_hosts.md)   | An additional hosts dictionary                                      |          | Yes              | Maps of hostnames to IP addresses.                                                                                                                                                                                                                               |
| [`operations`](/create-apps/runtime-operations.md)         | A dictionary of runtime operations                 |          | No               | Runtime operations for the application.                                                                                                                                                                                                                          |


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



## `stack` {#stack}

You must define the `stack` element with distinct `runtimes` and `packages` keys, as follows:

- **`runtimes`**: an array of language runtimes. Examples:`php`, `python`, `node.js`. See the complete list of [supported language runtimes](#supported-nix-packages).<br>
  Optional: version numbers and other keys such as `extensions`, `disabled_extensions`. 
- **`packages`**: an array of extra system tools or libraries installed from Nix packages.<br>
  Packages originate from the Nix channel that is defined by the `type` key, unless overridden locally with `channel`. See the `config.yaml` file excerpt below.
  Optional: additional keys, such as:
  - `package` (string)
  - `channel` (string; for example, `unstable`)
  - Additional configuration keys (to demonstrate passthrough flexibility)


    For example, to use a package version in an unstable channel, define a package:channel mapping in the `packages` array, as shown below: 
    ```yaml
    packages:
      - package: wkhtmltopdf
        channel: unstable
    ```
### Supported Nix packages

{{% note %}}
The Nix packages listed in the following table are officially supported by {{% vendor/name %}} to provide optimal user experience.<br>
However, you can add any other packages from the [Nixpkgs collection](https://search.nixos.org/) to your `stack` array (see the [`stack`](#stack) section below).
This includes packages from the ``unstable`` channel,
such as [FrankenPHP](https://search.nixos.org/packages?channel=unstable&show=frankenphp&from=0&size=50&sort=relevance&type=packages&query=frankenphp).</br>
While available for you to install, packages that aren't listed in the following table are supported by Nix itself, not {{% vendor/name %}}.
{{% /note %}}

Depending on the Nix package, you can select only the major runtime version,
or the major and minor runtime versions as shown in the table.
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

**Example `stack` configuration**

To put it all together, the `config.yaml` excerpt below shows the configuration for the following stack: 
- `php@{{% latest "php" %}}` runtime with additional `extensions` and one item under `disabled_extensions`
- `nodejs@{{% latest "nodejs" %}}` runtime
- `yarn` and `imagemagick` packages from the {{% latest composable %}} Nix channel
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
      packages:
        - yarn
        - imagemagick
        - package: wkhtmltopdf
          channel: unstable
```

{{% note theme=warning title="Warning" %}}
While technically available during the build phase, `nix` commands aren't supported at runtime as the image becomes read-only.

When using the {{% vendor/name %}} composable image, you don't need `nix` commands.
Everything you install using the `stack` key is readily available to you as the binaries are linked and included in `$PATH`.

For instance, to [start a secondary runtime](#primary-runtime),
just issue the command (e.g. in the [`start` command](/create-apps/image-properties/web.md#web-commands)) instead of the `nix run` command.
{{% /note %}}

#### Primary runtime

If you add multiple runtimes to your application container,
the first declared runtime becomes the primary runtime.
The primary runtime is the one that is automatically started.

To start other declared runtimes, you need to start them manually, using [web commands](/create-apps/image-properties/web.md#web-commands).
To find out which start command to use, go to the [Languages](/languages/_index.md) section,
and visit the documentation page dedicated to your runtime.

{{% note %}}
If you use PHP, note that PHP-FPM is only started automatically if PHP is defined as the primary runtime.
{{% /note %}}

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

Indicate enabled or disabled [PHP extensions](/languages/php/extensions.md) by including the `extensions` and `disabled_extensions` keys as needed below the language definition.</br>

Example:

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: "composable:{{% latest composable %}}"
    source:
      root: "/"
    stack:
      runtimes:
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
To help you find PHP package names,
some maintainers provide a ``PHP upstream extension`` value in the [NixOS search engine](https://search.nixos.org/packages?channel=unstable&show=php82Extensions.gd).

![Screenshot of an upstream extension value shown in the NixOS search](/images/nixos/nixossearch-upstream-value.png "0.5")

If this information is not provided, note that PHP package names on NixOS always respect the ``<PHP><VERSION>Extensions.<EXTENSION-NAME>`` format.
Therefore, you can copy the ``<EXTENSION-NAME>`` as shown in the NixOS search results and use it in your configuration.

Note that you can use environment variables or your `php.ini` file to [include further configuration options](/languages/php/_index.md#customize-php-settings)
for your PHP extensions.

{{% /note %}}

#### Install Python packages

To install Python packages, add them as new packages to the `packages` array of the `stack`. 
Specify the complete package name.

For instance, to install [``python313Packages.yq``](https://search.nixos.org/packages?channel=unstable&show=python313Packages.yq), use the following configuration:

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: "composable:{{% latest composable %}}"
    stack:
      packages:
        - "python@3.13"
        - "python313Packages.yq" # python package specific
```

Alternatively, if you need to include configuration options for your extensions, use either your ``php.ini`` file or [environment variables](/development/variables/set-variables.md).

### Example configuration

Here is a full composable image configuration example. Note the use of the `<nixpackage>@<version>` format.

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
      packages:
        - yq                     # tool
        - yarn
        - imagemagick
        - "python@3.13"
        - "python313Packages.yq" # python package specific
        - package: wkhtmltopdf
          channel: unstable
```

### Combine single-runtime and composable images

In a [multiple application context](/create-apps/multi-app/_index.md),
you can use a mix of [single-runtime images](/create-apps/app-reference/single-runtime-image.md)
and [composable images](/create-apps/app-reference/composable-image.md).
The following sample configuration includes two applications: a ``frontend`` app and a ``backend`` app:

```yaml {configFile="app"}
applications:
  frontend:
    # this app uses the composable image
    type: "composable:{{% latest composable %}}" 
    stack:
      - "php@{{% latest "php" %}}":
          extensions:
            - apcu
            - sodium
            - xsl
            - pdo_sqlite
      - "python@3.13"
      - "python313Packages.yq" # python package specific
  backend:
    # this app uses the single-runtime image with a specific node.js runtime
    type: 'nodejs:{{% latest "nodejs" %}} 
```

{{% note %}}
If you add multiple runtimes to your application container,
the first declared runtime becomes the primary runtime.
The primary runtime is the one that is automatically started.

To start other declared runtimes, you need to start them manually, using [web commands](/create-apps/image-properties/web.md#web-commands).
To find out which start command to use, go to the [Languages](/languages/_index.md) section,
and visit the documentation page dedicated to your language.

If you use PHP, note that PHP-FPM is only started automatically if PHP is defined as the primary runtime.
{{% /note %}}

## Resources

Resources for application containers are not committed to YAML files, but instead managed over the API using either the
Console or the `{{% vendor/cli %}} resources:set` command.

For more information, see how to [manage resources](/manage-resources.md).

{{% note %}}
Composable image container profile defaults to ``HIGH_CPU``.
<BR>If multiple runtimes are added to your stack,
you would need to change
the [default container_profile](/manage-resources/adjust-resources.md#advanced-container-profiles)
<br>or change [default CPU and RAM ratio](/manage-resources/resource-init.md) on first deployment using the following
commands:

```bash
{{% vendor/cli %}} push --resources-init=manual
```
{{% /note %}}

## Available disk space

Disk for application containers are not committed to YAML files, but instead managed over the API using either the
Console or the `{{% vendor/cli %}} resources:set` command.

For more information, see how to [manage resources](/manage-resources.md).

### Downsize a disk

You can decrease the size of an existing disk for an app. If you do so, be aware that:

- Backups from before the downsize are incompatible and can no longer be used. You need to [create new backups](/environments/backup.md).
- The downsize fails if there’s more data on the disk than the desired size.

