---
title: "PHP"
description: Deploy PHP apps on {{% vendor/name %}}.
layout: single
---

{{% note theme="info" %}}

You can now use the {{% vendor/name %}} composable image (BETA) to install runtimes and tools in your application container.
To find out more about this feature, see the [dedicated documentation page](/create-apps/app-reference/composable-image.md).</br>
Also, see how you can [modify your PHP runtime when using the composable image](#modify-your-php-runtime-when-using-the-composable-image).

{{% /note %}}

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like. When you deploy your app, you always get the latest available patches.

{{< image-versions image="php" status="supported" environment="grid" >}}

Note that from PHP versions 7.1 to 8.1, the images support the Zend Thread Safe (ZTS) version of PHP.

{{% language-specification type="php" display_name="PHP" %}}

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  <APP_NAME>:
    type: 'php:<VERSION_NUMBER>'
```

For example:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'php:{{% latest "php" %}}'
```

{{% deprecated-versions %}}

{{< image-versions image="php" status="deprecated" environment="grid" >}}

## Usage example

Configure your app to use PHP on {{% vendor/name %}}.

### 1. Specify the version

Choose a [supported version](#supported-versions)
and add it to your [app configuration](../../create-apps/_index.md):

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'php:{{% latest "php" %}}'
```
### 2. Serve your app

To serve your app, define what (and how) content should be served by setting the [`locations` parameter](/create-apps/app-reference/single-runtime-image.md#locations).

Usually, it contains the two following (optional) keys:

- `root` for the document root,
  the directory to which all requests for existing `.php` and static files (such as `.css`, `.jpg`) are sent.
- `passthru` to [define a front controller](../../create-apps/web/php-basic.md#set-different-rules-for-specific-locations) to handle nonexistent files.
  The value is a file path relative to the [app root](/create-apps/app-reference/single-runtime-image.md#root-directory).

  {{< note >}}

  For enhanced security, when setting `passthru` to `true`, you might also want to add the following configuration:

  1. Set `scripts` to `false`.
     This prevents PHP scripts from being executed from the specified location.

  2. Set `allow` to `false`.
     By default, when PHP scripts aren't executed, their source code is delivered.
     Setting `allow` to `false` allows you to keep the source code of your PHP scripts confidential.

  {{< /note >}}

Adjust the `locations` block to fit your needs.

In the following example, all requests made to your site's root (`/`) are sent to the `public` directory
and nonexistent files are handled by `app.php`:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'php:{{% latest "php" %}}'
    web:
      locations:
        '/':
          root: 'public'
          passthru: '/app.php'
```
See how to [create a basic PHP app with a front controller](../../create-apps/web/php-basic.md).
To have more control, you can define rules to specify which files you want to allow [from which location](../../create-apps/web/php-basic.md#set-different-rules-for-specific-locations).

### Complete example

A complete basic app configuration looks like the following:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'php:{{% latest "php" %}}'
    web:
      locations:
        '/':
          root: 'public'
          passthru: '/app.php'
```
## Dependencies

Up to PHP version 8.1, it's assumed that you're using [Composer](https://getcomposer.org/) 1.x to manage dependencies.
If you have a `composer.json` file in your code, the default [build flavor is run](/create-apps/app-reference/single-runtime-image.md#build):

```bash
composer --no-ansi --no-interaction install --no-progress --prefer-dist --optimize-autoloader
```

To use Composer 2.x on your project, either use PHP 8.2+ or, in your app configuration, add the following [dependency](/create-apps/app-reference/single-runtime-image.md#dependencies):

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'php:{{% latest "php" %}}'
    [...]
    dependencies:
      php:
        composer/composer: '^2'
```
Adding a dependency to the [dependencies block](/create-apps/app-reference/single-runtime-image.md#dependencies) makes it available globally.
So you can then use included dependencies as commands within your app container.
You can add multiple global dependencies to the dependencies block, such as [Node.js](../nodejs/_index.md#2-specify-any-global-dependencies).

If you want to have more control over Composer or if you don't want to use Composer at all, adapt the [build flavor](#change-the-build-flavor).
You can also use a [private, authenticated third-party Composer repository](./composer-auth.md).

### Change the build flavor

If you need more control over the dependency management,
you can either use your custom build flavor
or interact with Composer itself through [its environment variables](https://getcomposer.org/doc/03-cli.md#environment-variables).

You can remove the default build flavor and run your own commands for complete control over your build.
Set the build flavor to `none` and add the commands you need to your `build` hook, as in the following example:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'php:{{% latest "php" %}}'
    [...]
    build:
      flavor: none

    hooks:
      build: |
        set -e
        composer install --no-interaction --no-dev
```
That installs production dependencies with Composer but not development dependencies.
The same can be achieved by using the default build flavor and [adding the `COMPOSER_NO_DEV` variable](../../development/variables/set-variables.md).

See more on [build flavors](/create-apps/app-reference/single-runtime-image.md#build).

### Alternative repositories

In addition to the standard `dependencies` format,
you can specify alternative repositories for Composer to use as global dependencies.
So you can install a forked version of a global dependency from a custom repository.

To install from an alternative repository:

1. Set an explicit `require` block:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'php:{{% latest "php" %}}'
    [...]
    dependencies:
      php:
        require:
          "platformsh/client": "2.x-dev"
```
   This is equivalent to `composer require platform/client 2.x-dev`.

2. Add the repository to use:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'php:{{% latest "php" %}}'
    [...]
    dependencies:
      php:
        require:
          "platformsh/client": "2.x-dev"
        repositories:
          - type: vcs
            url: "git@github.com:platformsh/platformsh-client-php.git"
```
That installs `platformsh/client` from the specified repository URL as a global dependency.

For example, to install Composer 2 and the `platform/client 2.x-dev` library from a custom repository,
use the following:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'php:{{% latest "php" %}}'
    [...]
    dependencies:
      php:
        composer/composer: '^2'
        require:
          "platformsh/client": "2.x-dev"
        repositories:
          - type: vcs
            url: "git@github.com:platformsh/platformsh-client-php.git"
```
## Connect to services

{{< codetabs v2hide="true" >}}

+++
title=Elasticsearch
file=static/files/fetch/examples/php/elasticsearch
highlight=php
markdownify=false
+++

<--->

+++
title=Memcached
file=static/files/fetch/examples/php/memcached
highlight=php
markdownify=false
+++

<--->

+++
title=MongoDB
file=static/files/fetch/examples/php/mongodb
highlight=php
markdownify=false
+++

<--->

+++
title=MySQL
file=static/files/fetch/examples/php/mysql
highlight=php
markdownify=false
+++

<--->

+++
title=PostgreSQL
file=static/files/fetch/examples/php/postgresql
highlight=php
markdownify=false
+++

<--->

+++
title=RabbitMQ
file=static/files/fetch/examples/php/rabbitmq
highlight=php
markdownify=false
+++

<--->

+++
title=Redis
file=static/files/fetch/examples/php/redis
highlight=php
markdownify=false
+++

<--->

+++
title=Solr
file=static/files/fetch/examples/php/solr
highlight=php
markdownify=false
+++

{{< /codetabs >}}


{{% access-services version="2" %}}

## PHP settings

You can configure your PHP-FPM runtime configuration by specifying the [runtime in your app configuration](/create-apps/app-reference/single-runtime-image.md#runtime).

In addition to changes in runtime, you can also change the PHP settings.
Some commonly used settings are:

| Name | Default | Description |
|------|---------|-------------|
| `max_execution_time` | `300` | The maximum execution time, in seconds, for your PHP scripts and apps. A value of `0` means there are no time limits. |
| `max_file_uploads` | `20` | The maximum number of files that can be uploaded in each request. |
| `max_input_time` | `60` | The maximum time in seconds that your script is allowed to receive input (such as for file uploads). A value of `-1` means there are no time limits. |
| `max_input_vars` | `1000` | The maximum number of input variables that are accepted in each request. |
| `memory_limit` | `128M` | The memory limit, in megabytes, for PHP. Ensure that the PHP memory limit is set to a lower value than your environment's memory. |
| `post_max_size` | `64M` | The maximum size, in megabytes, per uploaded file. To upload larger files, increase the value. |
| `zend.assertions` | `-1` | Assertions are optimized and have no impact at runtime. Set assertions to `1` for your local development system. [See more on assertions](https://www.php.net/manual/en/regexp.reference.assertions). |
| `opcache.memory_consumption` | `64` | The number of megabytes available for [the OPcache](./tuning.md#opcache-preloading). For large apps with many files, increase this value. |
| `opcache.validate_timestamps` | `On` | If your app doesn't generate compiled PHP, you can [disable this setting](./tuning.md#disable-opcache-timestamp-validation). |

### Retrieve the default values

To retrieve the default PHP values, run the following [CLI command](../../administration/cli/_index.md):

```bash
{{% vendor/cli %}} ssh "php --info"
```

To get specific default values, use grep.
For example, to get the value for `opcache.memory_consumption`, run the following command:

```bash
{{% vendor/cli %}} ssh "php --info" | grep opcache.memory_consumption
```

### Retrieve the settings

To see the settings used on your environment:

1.  Find the PHP configuration files with the following [CLI command](../../administration/cli/_index.md):

    ```bash
    {{% vendor/cli %}} ssh "php --ini"
    ```

    The output is something like the following:

    ```bash
    Configuration File (php.ini) Path: /etc/php/8.0-zts/cli
    Loaded Configuration File:         /etc/php/8.0-zts/cli/php.ini
    Scan for additional .ini files in: /etc/php/8.0-zts/cli/conf.d
    Additional .ini files parsed:      (none)
    ```

2.  Display the configuration file by adapting the following command with the output from step 1:

    ```bash
    {{% vendor/cli %}} ssh "cat {{< variable "LOADED_CONFIGURATION_FILE_PATH" >}}"
    ```

### Customize PHP settings

You can customize PHP values for your app in two ways.
The recommended method is to use variables.

{{< codetabs >}}

+++
title=Using variables
+++

Set variables to override PHP settings for a given environment using the [CLI](../../administration/cli/_index.md).

For example, to set the PHP memory limit to 256 MB on a specific environment, run the following CLI command:

```bash
{{% vendor/cli %}} variable:create --level environment \
    --prefix php --name memory_limit \
    --value 256M --environment {{< variable "ENVIRONMENT_NAME" >}} \
    --no-interaction
```

For more information, see how to use [PHP-specific variables](../../development/variables/_index.md#php-specific-variables).

<--->

+++
title=Using `php.ini`
+++

You can provide a custom `php.ini` file at the [app root](/create-apps/app-reference/single-runtime-image.md#root-directory).
Using this method isn't recommended since it offers less flexibility and is more error-prone.
Consider using variables instead.

For example, to change the PHP memory limit, use the following configuration:

```ini {location="php.ini"}
memory_limit = 256M
```

{{< /codetabs >}}

If you're using [PHP-CLI](#execution-mode),
you need to take into account the default settings of PHP-CLI when you customize your PHP settings.
The default settings of PHP-CLI can't be overwritten and are the following:

```text
max_execution_time=0
max_input_time=-1
memory_limit=-1
```

### Disable functions for security

A common recommendation for securing PHP installations is disabling built-in functions frequently used in remote attacks.
By default, {{% vendor/name %}} doesn't disable any functions.

If you're sure a function isn't needed in your app, you can disable it.

For example, to disable `pcntl_exec` and `pcntl_fork`, add the following to your [app configuration](../../create-apps/_index.md):

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'php:{{% latest "php" %}}'
    variables:
      php:
        disable_functions: "pcntl_exec,pcntl_fork"
```
Common functions to disable include:

| Name | Description |
|------|-------------|
| `create_function` | This function has been replaced by anonymous functions and shouldn't be used anymore. |
| `exec`, `passthru`, `shell_exec`, `system`, `proc_open`, `popen` | These functions allow a PHP script to run a bash shell command. Rarely used by web apps except for build scripts that might need them. |
| `pcntl_*` | The `pcntl_*` functions are responsible for process management. Most of them cause a fatal error if used within a web request. Cron tasks or workers may need them. Most are usually safe to disable. |
| `curl_exec`, `curl_multi_exec` | These functions allow a PHP script to make arbitrary HTTP requests. If you're using HTTP libraries such as Guzzle, don't disable them. |
| `show_source` | This function shows a syntax highlighted version of a named PHP source file. Rarely useful outside of development. |

## Execution mode

PHP has two execution modes you can choose from:

- The command line interface mode (PHP-CLI) is the mode used for command line scripts and standalone apps.
  This is the mode used when you're logged into your container via SSH, for [crons](/create-apps/app-reference/single-runtime-image.md#crons),
  and usually also for [alternate start commands](#alternate-start-commands).
  To use PHP-CLI, run your script with `php {{<variable "PATH_TO_SCRIPT" >}}`,
  where {{<variable "PATH_TO_SCRIPT" >}} is a file path relative to the [app root](/create-apps/app-reference/single-runtime-image.md#root-directory).
- The Common Gateway Interface mode (PHP-CGI) is the mode used for web apps and web requests.
  This is the default mode when the `start` command isn't explicitly set.
  To use PHP-CGI, run your script with a symlink: `/usr/bin/start-php-app {{<variable "PATH_TO_SCRIPT" >}}`,
  where {{<variable "PATH_TO_SCRIPT" >}} is a file path relative to the [app root](/create-apps/app-reference/single-runtime-image.md#root-directory).
  With PHP-CGI, PHP is run using the FastCGI Process Manager (PHP-FPM).

## Alternate start commands

To specify an alternative process to run your code, set a `start` command.
For more information about the start command, see the [web commands reference](/create-apps/app-reference/single-runtime-image.md#web-commands).

By default, start commands use PHP-CLI.
Find out how and when to use each [execution mode](#execution-mode).

Note that the `start` command must run in the foreground and is executed before the [deploy hook](../../create-apps/hooks/hooks-comparison.md).
That means that PHP-FPM can't run simultaneously with another persistent process
such as [ReactPHP](https://github.com/platformsh-examples/platformsh-example-reactphp)
or [Amp](https://github.com/platformsh-examples/platformsh-example-amphp).
If you need multiple processes, they have to run in separate containers.

See some generic examples on how to use alternate start commands:

{{< codetabs >}}

+++
title=Run a custom script
+++

1. Add your script in a PHP file.

2. Specify an alternative `start` command by adapting the following:

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}
web:
  commands:
    start: /usr/bin/start-php-app
{{< /snippet >}}
```

<--->

+++
title=Run a custom web server
+++

1.  Add your web server's code in a PHP file.

2.  Specify an alternative `start` command by adapting the following:

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}
web:
  commands:
    start: /usr/bin/start-php-app
{{< /snippet >}}
```

3.  Configure the container to listen on a TCP socket:

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}
web:
  upstream:
    socket_family: tcp
    protocol: http
{{< /snippet >}}
```

When you listen on a TCP socket, the `$PORT` environment variable is automatically set.
See more options on how to [configure where requests are sent](/create-apps/app-reference/single-runtime-image.md#upstream).
You might have to configure your app to connect via the `$PORT` TCP socket,
especially when using web servers such as [Swoole](swoole.md) or [Roadrunner](https://github.com/roadrunner-server/roadrunner).

4.  Optional: Override redirects to let the custom web server handle them:

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}
locations:
  "/":
    passthru: true
    scripts: false
    allow: false
{{< /snippet >}}
```

<--->

+++
title=Run specific tasks
+++

To execute runtime-specific tasks (such as clearing cache) before your app starts, follow these steps:

1.  Create a separate shell script that includes all the commands to be run.

2.  Specify an alternative `start` command by adapting the following:

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}
web:
  commands:
    start: bash {{< variable "PATH_TO_SCRIPT" >}} && /usr/bin/start-php-app
{{< /snippet >}}
```

   {{<variable "PATH_TO_SCRIPT" >}} is the bash script created in step 1.
   {{<variable "PATH_TO_SCRIPT" >}} is a file path relative to the [app root](/create-apps/app-reference/single-runtime-image.md#root-directory).

{{< /codetabs >}}

## Foreign function interfaces

PHP 7.4 introduced support for [foreign function interfaces (FFIs)](https://en.wikipedia.org/wiki/Foreign_function_interface).
FFIs allow your PHP program to call routines or use services written in C or Rust.

Note: FFIs are only intended for advanced use cases.
Use with caution.

If you are using C code, you need `.so` library files.
Either place these files directly in your repository or compile them in a makefile using `gcc` in your [build hook](../../create-apps/hooks/hooks-comparison.md#build-hook).
Note: The `.so` library files shouldn't be located in a publicly accessible directory.

If you are compiling Rust code, use the build hook to [install Rust](https://doc.rust-lang.org/stable/book/ch01-01-installation.html).

To leverage FFIs, follow these steps:

1.  [Enable and configure OPcache preloading](./tuning.md#enable-opcache-preloading).

2.  Enable the FFI extension:

```yaml {configFile="app"}
applications:
  myapp:
    type: 'php:{{% latest "php" %}}'
    runtime:
      extensions:
        - ffi
```

3.  Make sure that your [preload script](./tuning.md#opcache-preloading) calls the `FFI::load()` function.
    Using this function in preload is considerably faster than loading the linked library on each request or script run.

4.  If you are running FFIs from the command line,
    enable the preloader by adding the following configuration:

```yaml {configFile="app"}
applications:
  myapp:
    type: 'php:{{% latest "php" %}}'
    variables:
      php:
        opcache.enable_cli: true
```

5.  Run your script with the following command:

    ```bash
    php {{<variable "CLI_SCRIPT" >}}
    ```

{{< repolist lang="php" displayName="PHP" >}}

## Frameworks

All major PHP web frameworks can be deployed on {{% vendor/name %}}.
See dedicated guides for deploying and working with them:

- [Laravel](/get-started/stacks/laravel)
- [Symfony](/get-started/stacks/symfony/_index.md)

## Modify your PHP runtime when using the composable image

{{% note theme= "warning" %}}

This section is only relevant when using the {{% vendor/name %}} [composable image (BETA)](/create-apps/app-reference/composable-image.md).

{{% /note %}}

The following table presents the possible modifications you can make to your PHP primary runtime using the `stack` key and composable image.
Each modification should be listed below the stack chosen (i.e. `extensions` are enabled under `.applications.frontend.stack[0]["php@8.3"].extensions` for PHP 8.3).
See the example below for more details.

| Name                        | Type                                                       | Description                                                                                |
|-----------------------------|------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| `extensions`                | List of `string`s OR [extensions definitions](/create-apps/app-reference/composable-image#php-extensions-and-python-packages) | [PHP extensions](/languages/php/extensions.md) to enable.                                  |
| `disabled_extensions`       | List of `string`s                                          | [PHP extensions](/languages/php/extensions.md) to disable.                                 |
| `request_terminate_timeout` | `integer`                                                  | The timeout for serving a single request after which the PHP-FPM worker process is killed. |
| `sizing_hints`              | A [sizing hints definition](/create-apps/app-reference/composable-image#sizing-hints)                 | The assumptions for setting the number of workers in your PHP-FPM runtime.                 |
| `xdebug`                    | An Xdebug definition                                       | The setting to turn on [Xdebug](/languages/php/xdebug.md).                                 |

Here is an example configuration:

```yaml {configFile="app"}
applications:
  frontend:
    stack:
      - "php@8.3":
          extensions:
            - apcu # A PHP extension made available to the PHP runtime
            - sodium
            - xsl
            - pdo_sqlite

          xdebug:
            idekey: YOUR_KEY

          disabled_extensions:
            - gd

          request_terminate_timeout: 200

          sizing_hints:
            request_memory: 45
            reserved_memory: 70

      - "php83Extensions.apcu" # A PHP extension made available to all runtimes.
      - "python@3.12"
      - "python312Packages.yq"
```

{{% note %}}

You can also set your [app's runtime timezone](/create-apps/timezone.md).

{{% /note %}}
