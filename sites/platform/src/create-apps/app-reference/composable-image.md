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

{{% /note %}}

| Name               | Type                                                                     | Required | Set in instance? | Description                                                                                                                                                                                                                                                                |
|--------------------|--------------------------------------------------------------------------|----------|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`             | `string`                                                                 | Yes      | No               | A unique name for the app. Must be lowercase alphanumeric characters. **Changing the name destroys data associated with the app**.                                                                                                                                             |
| [`type`](#type)             | A type                                                         | Yes      | No               | [Defines the version of the Nix channel](#supported-nix-channels). Mandatory in each application that uses the composable image. Example: `type: "composable:{{% latest composable %}}"`.                                                                                                                                                                                      |
| [`stack`](#stack)              |  `runtimes` and/or  `packages` arrays                                                     | Yes      | No               | Specifies [{{% vendor/name %}}-supported `runtimes`](#supported-nix-packages) and extra [Nixpkgs `packages`](https://search.nixos.org/packages) beyond those in the `type` channel.                                                                                            |
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
| [`source`](/create-apps/image-properties/source.md)           | A source dictionary                                           |          | No               | Details about the app’s source code and available operations.                                                                                                                                                                                                 |
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

{{% note theme="info" %}}

Nix releases new channels a few times per year. Channels that were fully supported can quickly become deprecated. With Composable Images, you are responsible for: 

 - Keeping your Nix channel up to date  
 - Ensuring requested runtimes and packages are available and current

Unlike Single Runtime Images, which receive automatic minor and security updates, Composable Images require proactive maintenance. We recommend reviewing your configuration at least twice per year to upgrade the Nix channel and any runtimes or packages you rely on.

See [Which image type should I use?](/create-apps/app-reference.html#which-image-type) for a quick comparison of [Single Runtime](/create-apps/app-reference/single-runtime-image.md) vs Composable Images.

{{% /note %}}

Upsun supports the following Nix channel versions:

- `{{% latest composable %}}`

View the list of [supported Nix runtimes](#supported-nix-packages) in the `stack` section below.

## `stack` {#stack}

You must define the `stack` element by using distinct `runtimes` and `packages` keys, as described in the following table.

See the [example `stack` configuration](#example-stack-configuration) that follows this table.

| Name            | Type                | Required | Additional keys | Description                                                       |
|-----------------|---------------------|------------------| ----------|-------------------------------------------------------------------|
| `runtimes` | array     |  No        | `extensions`, `disabled_extensions`, and related subkeys | An array of 1+ language runtimes specified as `"<nixruntime@version>"` or `<nixruntime>`.<BR>The first declared runtime (or _[primary runtime](#multiple-runtimes-primary-runtime)_) is started automatically.<BR>See the complete list of [supported runtimes](#supported-nix-packages) below. |
| `packages`      | array |  No        | `package`, `channel`, additional keys to demonstrate passthrough flexibility | Additional Nix tools/libraries, using the channel from `type` unless overridden locally by specifying the `package` and its `channel`. Format: `<nixpackage>`   |

{{% note title="Runtimes extensions or packages?" %}}
Be sure you understand where to specify a runtime's additional components. For example:
- **PHP**: Manage extensions by using the `stack.runtimes.extensions` and `stack.runtimes.disabled_extensions` keys.<br>
  - Note: In some scenarios, you might [add PHP settings](/languages/php/_index.md#customize-php-settings) via environment variables or `php.ini`.

- **Python**: Install extra packages via the `stack.packages` key.<br>

See the [example `stack` configuration](#example-stack-configuration) below.<br>
For other runtimes, see the [Languages](/languages/_index.md) section.
{{% /note %}}

### Example: `stack` configuration {#example-stack-configuration}

The `{{< vendor/configfile "app" >}}` file excerpt below shows the following `stack` configuration:
- **Primary runtime:** `php@8.4` with additional extensions and one disabled extension
- **Secondary runtimes:** `nodejs@{{% latest "nodejs" %}}` and `python@{{% latest "python" %}}`
- **Nix packages:**
  - `yarn` and `python313Packages.yq` from the channel defined in `type`
  - `python313Packages.jupyterlab` (with config) and `wkhtmltopdf` from the `unstable` channel

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: "composable:{{% latest composable %}}"
    stack:
      runtimes:
        - "php@8.4":
            extensions:
              - apcu
              - pdo_sqlite
              - facedetect
              - sodium
              - xsl
              - name: blackfire   # php@8.4 extension
                configuration:    # extension subkeys
                    server_id: {{% variable "SERVER_ID" %}}
                    server_token: {{% variable "SERVER_TOKEN" %}}
            disabled_extensions:
              - gd
        - "nodejs@{{% latest "nodejs" %}}"
        - "python@{{% latest "python" %}}"
      packages:
        - yarn                      # Package manager
        - python313Packages.yq      # Python package
        - package: python313Packages.jupyterlab
          channel: unstable
        - package: wkhtmltopdf      # Conversion tool
          channel: unstable
```

{{% note theme=warning title="Warning" %}}
Although `nix` commands are available during the build phase, they are not supported at runtime because the final image is read-only.

When you use the {{% vendor/name %}} composable image, you don't need `nix` commands.
Anything you declare under the `stack` key is automatically installed and the binaries are included in your `$PATH`, making them immediately available to use.

For example, to [start a secondary runtime](#multiple-runtimes-primary-runtime),
you can run it directly in your [`start` command](/create-apps/image-properties/web.md#web-commands) without using `nix run`.
{{% /note %}}

### Working with multiple runtimes: primary runtime {#multiple-runtimes-primary-runtime}

If you add multiple runtimes to your application container,
the first declared runtime becomes the primary runtime.
The primary runtime is the one that is automatically started.

To start other declared runtimes (or _secondary_ runtimes), you need to start them manually by using [web commands](/create-apps/image-properties/web.md#web-commands).
To find out which start command to use, go to the [Languages](/languages/_index.md) section
and visit the documentation page dedicated to your runtime.

Containers that define multiple runtimes typically require some resource sizing adjustments. For details, see the [Resources](#resources) section of this topic.

See the [`stack` configuration example](#example-stack-configuration) above, which declares multiple runtimes.

### PHP as a primary runtime {#php-as-a-primary-runtime}

If a PHP runtime is the first declared (or _primary_) runtime in the app:
  - The PHP-FPM service starts automatically.
  - You can configure the PHP-FPMP service by using `request_terminate_timeout` and `sizing_hints` keys in the app's `stack.runtimes` key.

    The [`stack` configuration example](#example-stack-configuration) above declares PHP as a primary runtime but does not show these additional keys.

For the complete list of PHP extension keys and PHP-FPM sizing hints, see [Modify your PHP runtime when using the composable image](/languages/php.md#modify-your-php-runtime-when-using-a-composable-image) section in the "PHP" topic.

Related resource: [When php-fpm runs out of workers: a 502 error field guide](https://devcenter.upsun.com/posts/when-php-fpm-runs-out-of-workers-a-502-error-field-guide/) (Dev Center article)



### {{% vendor/company_name %}}-supported Nix runtimes {#supported-nix-packages}

{{% note %}}

{{% vendor/company_name %}} officially supports the Nix runtimes listed below. To use them in your container, add them to the `stack.runtimes` array.</br>
Runtimes **not** listed below are supported only by Nix as Nixpkgs _packages_, not as {{% vendor/name %}} runtimes. In those cases, add them to `stack.packages`. </br>For example, if your app requires the [FrankenPHP](https://search.nixos.org/packages?channel=unstable&show=frankenphp&from=0&size=50&sort=relevance&type=packages&query=frankenphp) runtime from the `unstable` channel, you would add `frankenphp` to `stack.packages`. See the [`stack` configuration example](#example-stack-configuration) above for a similar addition.

{{% /note %}}

For some runtimes (such as Clojure), you can specify only a major version.
</br>
For other runtimes (such as Elixir), you can specify a major or a major.minor version.
Security and other patches are applied automatically.

| **Language**                                 | **Nix package** | **Supported version(s)**                        |
|----------------------------------------------|-----------------|-------------------------------------------------|
| [Clojure](https://clojure.org/)              | `clojure`       | 1                                               |
| [Elixir](/languages/elixir.html)             | `elixir`        | 1.19<br/>1.18<br/>1.17                          |
| [Go](/languages/go.html)                     | `golang`        | 1.25<br/>1.24                                   |
| [Java](/languages/java.html)                 | `java`          | 25                                       |
| [Javascript/Bun](https://bun.sh/)            | `bun`           | 1                                               |
| [JavaScript/Node.js](/languages/nodejs.html) | `nodejs`        | 24<br/>22<br/>20                         |
| [Perl](https://www.perl.org/)                | `perl`          | 5                                               |
| [PHP](/languages/php.html)                   | `php`           | 8.5<br/>8.4<br/>8.3<br/>8.2                     |
| [Python](/languages/python.html)             | `python`        | 3.13<br/>3.12<br/>3.11 |
| [Ruby](/languages/ruby.html)                 | `ruby`          | 4.0<br/>3.4<br/>3.3                     |


### PHP extensions and Python packages {#php-extensions-and-python-packages}

To discover which PHP extensions and Python packages are available for these runtimes:

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

4. Add extensions to `stack.runtimes.extensions` and packages to `stack.packages` as described in the [`stack`](#stack) section above.



## Resources (CPU, memory, disk space) {#resources}

By default, {{% vendor/name %}} assigns a container profile and container size to each application and service on the first deployment of a project. <br>

The container _profile_ defines and enforces a specific CPU-to-memory ratio. The default container profile for an app or service in a composable image is ``HIGH_CPU``.

To change the container _size_, which is a **vertical‑scaling** action, you must [change your plan size](/administration/pricing.md#plans). When you redeploy, the container runs with the CPU‑to‑memory ratio defined by its profile, so it enforces the size you specified.

If you define **multiple runtimes** in an application's `.applications.<app_name>.stack.runtimes` key, you must [change your plan size](/administration/pricing.md#plans) to Medium (`M`) or larger.


### Downsize a disk

You can reduce the target disk size of an app. Keep in mind:
- Backups created before the downsize are incompatible and cannot be used; you must [create new backups](/environments/backup.md).
- The downsize will fail if the disk contains more data than the target size.

## Combine single-runtime and composable images {#combine-single-runtime-and-composable-images}

In a [multiple application context](/create-apps/multi-app/_index.md),
you can use a mix of [single-runtime images](/create-apps/app-reference/single-runtime-image.md)
and composable images.


The following sample configuration includes two applications:
- ``frontend`` – uses a single-runtime image
- ``backend`` – uses a composable image<br>
  In this app, PHP is the primary runtime and is started automatically (PHP-FPM also starts automatically when PHP is the primary runtime). For details, see the [PHP as a primary runtime](#php-as-a-primary-runtime) section in this topic.


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

