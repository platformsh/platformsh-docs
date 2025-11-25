---
title: "Composable image"
weight: 5
description: Use {{% vendor/name %}}'s composable image to build and deploy your app.
---

The {{% vendor/name %}} composable image provides enhanced flexibility when defining your app.
It enables you to install several runtimes and tools in your application container,
in a **"one image to rule them all"** approach.

The composable image is built on [Nix](https://nix.dev), which offers the following benefits:

- You can add as many packages to your application container as you need,
  choosing from over 120,000 packages from [the Nixpkgs collection](https://search.nixos.org/packages).
- The packages you add are built in isolation, enabling you to install different versions of the same package.
- With [Nix](https://nix.dev/reference/glossary#term-Nix), there are no undeclared dependencies in your source code.
  What works on your local machine is guaranteed to work on any other machine.

This page introduces all the settings available to configure your composable image from your `{{< vendor/configfile "app" >}}` file
(usually located at the root of your Git repository).</br>
Note that multi-app projects can be [set in various ways](../multi-app/_index.md).

You can also skip directly to this [comprehensive example](/create-apps/_index.md#comprehensive-example) of a composable image configuration on the "Configure apps" page. This example includes all of the primary application properties listed in the table in the next section.

## Primary application properties

All application configuration takes place in a `{{< vendor/configfile "app" >}}` file, with each application configured under a unique key beneath the top-level `applications` key.

The following table presents all of the properties available to each unique application `name`.

The **Set in instance** column defines whether the given property can be overridden within a `web` or `workers` instance.
To override any part of a property, you must provide the entire property.

{{% note theme="info" %}}

- The `type` and `stack` properties are unique to the composable image type and are described later in this topic. All other properties are available in both single-runtime and composable images — click a property name to view its details in a separate topic.  
- The ``stack`` key replaces the ``build``, ``dependencies``, and ``runtime`` keys that are available in the [single-runtime image](/create-apps/app-reference/single-runtime-image.md).

{{% /note %}}

| Name                 | Type                                                                                     | Required | Set in instance? | Description                                                                                                                                                                                                                                                      |
|----------------------|------------------------------------------------------------------------------------------|----------|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`             | `string`                                                                 | Yes      | No               | A unique name for the app. Must be lowercase alphanumeric characters. **Changing the name destroys data associated with the app**.                                                                                                                                             |
| [`type`](#type)             | A type                                                         | Yes      | No               | [Defines the version of the Nix channel](#supported-nix-channels). Mandatory in each application that uses the composable image. Example: `type: "composable:{{% latest composable %}}"`.                                                                                                                                                                                      |
| [`stack`](#stack)              |  `runtimes` and/or  `packages` arrays                                                     | Yes      | No               | Specifies [{{% vendor/name %}}-supported `runtimes`](#supported-nix-packages) and extra [NixPkgs `packages`](https://search.nixos.org/packages) beyond those in the `type` channel.                                                                                            |
| [`container_profile`](/create-apps/image-properties/container_profile.md)  | A container profile |          | Yes              | Determines which combinations of CPU and RAM a container can use. Default value is `HIGH_CPU`; see [Resources](#resources) if using multiple runtimes.                                                                                                                                                                                                                            |
| [`relationships`](/create-apps/image-properties/relationships.md)      | A dictionary of relationships                                          |          | Yes              | Connections to other services and apps.                                                                                                                                                                                                                          |
| [`mounts`](/create-apps/image-properties/mounts.md)             | A dictionary of mounts                                                        |          | Yes              | Directories that are writable even after the app is built. Allocated disk for mounts is defined with a separate resource configuration call using `{{% vendor/cli %}} resources:set`.                                                                            |
|[`web`](/create-apps/image-properties/web.md)                | A web instance                                                                   |          | N/A              | How the web application is served.                                                                                                                                                                                                                               |
| [`workers`](/create-apps/image-properties/workers.md)            | A worker instance                                                            |          | N/A              | Alternate copies of the application to run as background processes.                                                                                                                                                                                              |
| `timezone`           | `string`                                                                                 |          | No               | The timezone for crons to run. Format: a [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Defaults to `UTC`, which is the timezone used for all logs no matter the value here. See also [app runtime timezones](../timezone.md). |
| [`access`](/create-apps/image-properties/access.md)             | An access dictionary                                                          |          | Yes              | Access control for roles accessing app environments.                                                                                                                                                                                                             |
| [`variables`](/create-apps/image-properties/variables.md)          | A variables dictionary                                                     |          | Yes              | Variables to control the environment.                                                                                                                                                                                                                            |
| [`firewall`](/create-apps/image-properties/firewall.md)           | A firewall dictionary                                                       |          | Yes              | Outbound firewall rules for the application.                                                                                                                                                                                                                     |
| [`hooks`](/create-apps/image-properties/hooks.md)          | A hooks dictionary                                                                 |          | No               | Specifies commands and/or scripts to run in the `build`, `deploy`, and `post_deploy` phases.                                                                                                                                                                                           |
| [`crons`](/create-apps/image-properties/crons.md)              | A cron dictionary                                                              |          | No               | Scheduled tasks for the app.                                                                                                                                                                                                                                     |
| [`source`](/create-apps/image-properties/source.md)             | A source dictionary                                                           |          | No               | Information on the app source code and operations that can be run on it.                                                                                                                                                                                       |
| [`additional_hosts`](/create-apps/image-properties/additional_hosts.md)   | An additional hosts dictionary                                      |          | Yes              | Mappings of hostnames to IP addresses.                                                                                                                                                                                                                               |
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

View the list of [supported Nix runtimes](#supported-nix-packages) in the `stack` section below. 

## `stack` {#stack}

You must define the `stack` element by using distinct `runtimes` and `packages` keys, as described in the following table. 

See the [example `stack` configuration](#example-stack-configuration) that follows this table.

| Name            | Type                | Required | Additional keys | Description                                                       | 
|-----------------|---------------------|------------------| ----------|-------------------------------------------------------------------|
| `runtimes` | array     |  No        | `extensions`, `disabled_extensions`, and related subkeys | An array of 1+ language runtimes specified as `"<nixruntime@version>"` or `<nixruntime>`.<BR>The first declared runtime (or _[primary runtime](#primary-runtime)_) is started automatically.<BR>See the complete list of [supported runtimes](#supported-nix-packages) below. |
| `packages`      | array |  No        | `package`, `channel`, additional keys to demonstrate passthrough flexibility | Additional Nix tools/libraries, using the channel from `type` unless overridden locally by specifying the `package` and its `channel`. Format: `<nixpackage>`   |

**If you use PHP or Python runtimes**, see the [PHP extensions and Python packages](/create-apps/app-reference/composable-image.md#php-extensions-and-python-packages) section later in this topic for additional configuration details.

<!-- TO-DO: delete if table above is approved
- **`runtimes`**: an array of language runtimes, with or without version numbers. You can specify multiple runtimes in one application container, as shown in the [example `stack` configuration](#example-stack-configuration) below. See the complete list of [supported runtimes](#supported-nix-packages).<br>

  The first declared runtime is considered the [primary runtime](#primary-runtime) and is started automatically.<br>

  Optional: 
    - version numbers: If omitted, the most recent version in the channel is used. 
    - `extensions` key
    - `disabled_extensions` key

- **`packages`**: an array of extra system tools or libraries installed from Nix packages.<br>
  Packages originate from the Nix channel that is defined by the `type` key, unless overridden locally by specifying the `package` and its `channel`. See the `config.yaml` file excerpt below.<br>

  Optional: additional keys, such as:
  - `package` (string, as part of a `package` object) 
  - `channel` (string; defines the channel that contains the package, such as `unstable`)
  - Additional configuration keys (to demonstrate passthrough flexibility)
-->

### Example: `stack` configuration {#example-stack-configuration}

The `config.yaml` file excerpt below shows the following stack configuration: 
- `php@{{% latest "php" %}}` as the primary runtime with additional `extensions` and one `disabled_extensions`
- `nodejs@{{% latest "nodejs" %}}` and `python@{{% latest "python" %}}` runtimes
- `yarn` and `python313Packages.yq` packages (by default from the latest {{% vendor/company_name %}}-supported Nix channel you configured in `type`)
- `python313Packages.jupyterlab` package from the `unstable` channel with additional config keys 
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
              - pdo_sqlite
              - php-facedetect
              - sodium
              - xsl
              - name: blackfire   # php@{{% latest "php" %}} extension
                configuration:  # extension subkeys
                    server_id: {{% variable "SERVER_ID" %}}
                    server_token: {{% variable "SERVER_TOKEN" %}}
            disabled_extensions:
              - gd
        - "nodejs@{{% latest "nodejs" %}}"
        - "python@{{% latest "python" %}}"
      packages:
        - yarn                      # Package manager
        - python313Packages.yq      # Python package 
        - package: python313Packages.jupyterlab   # Python package with optional Nix configuration
          channel: unstable
          configuration:
            withMathjax: false      # Disable MathJax support
            withMimeExtensions: true
        - package: wkhtmltopdf      # Conversion tool
          channel: unstable
```

{{% note theme=warning title="Warning" %}}
While technically available during the build phase, `nix` commands aren't supported at runtime because the image becomes read-only.

When using the {{% vendor/name %}} composable image, you don't need `nix` commands.
Everything you install using the `stack` key is readily available to you as the binaries are linked and included in `$PATH`.

For instance, to [start a secondary runtime](#primary-runtime),
just issue the command (e.g. in the [`start` command](/create-apps/image-properties/web.md#web-commands)) instead of the `nix run` command.
{{% /note %}}

### Primary runtime {#primary-runtime}

If you add multiple runtimes to your application container,
the first declared runtime becomes the primary runtime.
The primary runtime is the one that is automatically started.

To start other declared runtimes, you need to start them manually by using [web commands](/create-apps/image-properties/web.md#web-commands).
To find out which start command to use, go to the [Languages](/languages/_index.md) section
and visit the documentation page dedicated to your runtime.

{{% note %}}
If you use PHP, the PHP-FPM service starts automatically only when PHP is the primary runtime. 
{{% /note %}}

See the [`stack` configuration example](#example-stack-configuration) above, which declares multiple runtimes.


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


### Find PHP extensions and Python packages {#php-extensions-and-python-packages}

To discover which PHP extensions and Python packages you can install with these runtimes: 

1. Go to the [NixOS search](https://search.nixos.org/).
1. Enter a runtime and click **Search**.
1. In the **Package sets** side bar, select the right set of extensions/packages for your runtime version.</br>
   You can choose the desired extensions/packages from the filtered results.

![Screenshot of the Nix package sets selection for PHP@8.3](/images/nixos/nixos-packages.png "0.5")



  {{% note title="Note: PHP extension names" %}}
  To help you find PHP extension names,
  some maintainers provide a ``PHP upstream extension`` value in the [NixOS search engine](https://search.nixos.org/packages?channel=unstable&show=php82Extensions.gd).

  ![Screenshot of an upstream extension value shown in the NixOS search](/images/nixos/nixossearch-upstream-value.png "0.5")

  If this information is not provided, copy the ``<EXTENSION-NAME>`` extension name from the appropriate ``<PHP><VERSION>Extensions.<EXTENSION-NAME>`` search result and add it to ``stack.runtimes.extensions`` as shown in the [`stack` configuration example](#example-stack-configuration) above.

  

  {{% /note %}}

4. Add the PHP extensions to `stack.runtimes.extensions` and Python packages to `stack.packages` as described in the [`stack`](#stack) section near the beginning of this topic.

Note that you can use environment variables or your `php.ini` file to [include additional configuration options](/languages/php/_index.md#customize-php-settings)
  for your PHP extensions.


### PHP runtime extensions


### PHP runtime sizing hints {#sizing_hints}

{{% note %}}
If you use PHP, the PHP-FPM service starts automatically only when PHP is the primary runtime.
{{% /note %}}

The following table shows the properties that can be set in `sizing_hints`:

| Name              | Type      | Default | Minimum | Description                                    |
|-------------------|-----------|---------|---------|------------------------------------------------|
| `request_memory`  | `integer` | 45      | 10      | The average memory consumed per request in MB. |
| `reserved_memory` | `integer` | 70      | 70      | The amount of memory reserved in MB.           |

See more about [PHP-FPM workers and sizing](/languages/php/fpm.md).

<!-- TO-DO: Delete - not needed?
#### Install Python packages

To install Python packages (which supplement Python `stack.runtimes`), add them to `stack.packages` as new packages. 
Provide the complete package name.

See [``python313Packages.yq``](https://search.nixos.org/packages?channel=unstable&show=python313Packages.yq) in `stack.packages` in the [example `stack` configuration](#example-stack-configuration) above.

Alternatively, if you need to include configuration options for your extensions, use either your ``php.ini`` file or [environment variables](/development/variables/set-variables.md).

-->
## Combine single-runtime and composable images {#combine-single-runtime-and-composable-images}

In a [multiple application context](/create-apps/multi-app/_index.md),
you can use a mix of [single-runtime images](/create-apps/app-reference/single-runtime-image.md)
and [composable images](/create-apps/app-reference/composable-image.md).

In this scenario, PHP is the primary runtime and is started automatically (PHP-FPM also starts automatically when PHP is the primary runtime). For details, see the [Primary runtime](#primary-runtime) section in this topic.

The following sample configuration includes two applications: 
- a ``frontend`` app that uses a composable image
- a ``backend`` app that uses a single-runtime image

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
        - "php@{{% latest "php" %}}":
            extensions:
              - apcu
              - sodium
              - xsl
              - pdo_sqlite
        - "python@3.13"
      packages:
        - "python313Packages.yq" # python package specific
```

## Resources

Resources for application containers are not committed to YAML files, but instead managed over the API using either the
Console or the `{{% vendor/cli %}} resources:set` command.

For more information, see how to [manage resources](/manage-resources.md).

{{% note %}}
The default container profile for a composable image is ``HIGH_CPU``.<br>
<BR>If your stack defines multiple runtimes, you need to do one of the following:
- Change
the [default container_profile](/manage-resources/adjust-resources.md#advanced-container-profiles)
- Change [default CPU and RAM ratio](/manage-resources/resource-init.md) on first deployment using the following
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

