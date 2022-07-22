---
title: "PHP"
description: Deploy PHP apps on Platform.sh.
layout: single
---

PHP is a popular scripting language that currently powers around 80% of websites.
You can deploy your PHP apps on Platform.sh.

## Supported versions

For PHP 7.1+, the Zend Thread Safe (ZTS) version of PHP is used.

| Grid and Dedicated Generation 3 | Dedicated |
|---------------------------------|-----------|
|  {{< image-versions image="php" status="supported" environment="grid" >}} | {{< image-versions image="php" status="supported" environment="dedicated" >}} |

{{% image-versions-legacy "php" %}}

{{% language-specification type="php" display_name="PHP" %}}

{{% deprecated-versions %}}

| Grid and Dedicated Generation 3 | Dedicated |
|---------------------------------|-----------|
|  {{< image-versions image="php" status="deprecated" environment="grid" >}} | {{< image-versions image="php" status="deprecated" environment="dedicated" >}} |

## Usage example

Configure your app to use PHP on Platform.sh.

### 1. Specify the version

Choose a version from the [list above](#supported-versions)
and add it to your [app configuration](../../create-apps/_index.md):

{{< readFile file="src/registry/images/examples/full/php.app.yaml" highlight="yaml" location=".platform.app.yaml" >}}

### 2. Specify a dependency manager

To manage PHP dependencies and libraries, use [Composer](https://getcomposer.org/).
PHP containers use Composer 1.x by default.
See more options for [dependency management](#dependencies).

### 3. Serve your app

To serve your app, define what (and how) content should be served by [setting the `locations`](../../create-apps/app-reference.md#locations):

1. Set the `root` folder to which all requests for existing `.php` and static files (such as .css, .jpg) are sent.
2. (Optional) Set a `passthru` to define a front controller to handle non-existent files. The `passthru` value is a file path relative to the [app root](../../create-apps/app-reference.md#root-directory).

In the following example, all requests made to the root of your site (`/`) are sent to the `public` directory, non-existing files are handled by `app.php`:

```yaml {location=".platform.app.yaml"}
web:
    locations:
        '/':
            root: 'public'
            passthru: '/app.php'
```

See a step-by-step explanation on how to [create a basic PHP app with a front controller](../../create-apps/web/php-basic.md).
To have more control, you can define rules to specify which files you want to allow [from which location](../../create-apps/web/php-basic.md#set-different-rules-for-specific-locations).

### Complete example

A complete basic app configuration looks like the following:

```yaml {location=".platform.app.yaml"}
name: 'app'

type: 'php:8.1'

web:
    locations:
        '/':
            root: 'public'
```

## Dependencies

By default, PHP images assume you're using Composer 1.x to manage dependencies.
If you have a `composer.json` file in your code, the default [build flavor is run](https://docs.platform.sh/create-apps/app-reference.html#build):

```bash
composer --no-ansi --no-interaction install --no-progress --prefer-dist --optimize-autoloader
```

To use Composer 2.x on your project, in your app configuration, add the following [dependency](../../create-apps/app-reference.md#dependencies):

```yaml {location=".platform.app.yaml"}
dependencies:
    php: 
        composer/composer: '^2'
```

You can add several global dependencies to the dependencies block.

### Alternative repositories

In addition to the standard `dependencies` format,
you can specify alternative repositories for Composer to use as global dependencies.
So you can install a forked version of a global dependency from a custom repository.

To install from an alternative repository:

1. Set an explicit `require` block:

    ```yaml {location=".platform.app.yaml"}
    dependencies:
        php:
            require:
                "platformsh/client": "2.x-dev"
    ```

    The above is equivalent to `composer require platform/client 2.x-dev`.

2. Add the repository to use:

    ```yaml {location=".platform.app.yaml"}
            repositories:
                - type: vcs
                  url: "git@github.com:platformsh/platformsh-client-php.git"
    ```

That installs `platformsh/client` from the specified repository url as a global dependency.

For example, to install the `platform/client 2.x-dev` client from a custom repository in addition to composer 2, you can use:

```yaml {location=".platform.app.yaml"}
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

The following examples show how to use PHP to access various [services](../../add-services/_index.md).
The individual service pages have more information on configuring each service.

{{< codetabs >}}

---
title=Elasticsearch
file=static/files/fetch/examples/php/elasticsearch
highlight=php
markdownify=false
---

<--->

---
title=Memcached
file=static/files/fetch/examples/php/memcached
highlight=php
markdownify=false
---

<--->

---
title=MongoDB
file=static/files/fetch/examples/php/mongodb
highlight=php
markdownify=false
---

<--->

---
title=MySQL
file=static/files/fetch/examples/php/mysql
highlight=php
markdownify=false
---

<--->

---
title=PostgreSQL
file=static/files/fetch/examples/php/postgresql
highlight=php
markdownify=false
---

<--->

---
title=RabbitMQ
file=static/files/fetch/examples/php/rabbitmq
highlight=php
markdownify=false
---

<--->

---
title=Redis
file=static/files/fetch/examples/php/redis
highlight=php
markdownify=false
---

<--->

---
title=Solr
file=static/files/fetch/examples/php/solr
highlight=php
markdownify=false
---

{{< /codetabs >}}

{{% config-reader %}}
[`platformsh/config-reader` Composer library](https://github.com/platformsh/config-reader-php)
{{% /config-reader%}}

## PHP settings

You can configure your PHP-FPM runtime configuration by specifying the [runtime in your app configuration](../../create-apps/app-reference.md#runtime).

Some commonly used settings are:

| Name | Default | Description |
|------|---------|-------------|
| `max_execution_time` | `0` | The maximum execution time, in seconds, for your PHP scripts and apps. A value of `0` means there are no time limits. |
| `max_file_uploads` | `20` | The maximum number of files that can be uploaded in each request. |
| `max_input_time` | `-1` | The maximum time in seconds that your script is allowed to receive input (such as for file uploads). A value of `-1` means there are no time limits. |
| `max_input_vars` | `1000` | The maximum number of input variables that are accepted in each request. |
| `memory_limit` | `512M` | The memory limit, in megabytes, for PHP. |
| `post_max_size` | `8M` | The maximum size, in megabytes, per uploaded file. To upload larger files, increase the value. |
| `zend.assertions` | `-1` | Assertions are optimized and have no impact at runtime. Set assertions to `1` for your local development system. [See more on assertions](https://www.php.net/manual/en/regexp.reference.assertions). |
| `opcache.memory_consumption` | `64` | The number of megabytes available for [the OPcache](./tuning.md#opcache-preloading). For large apps with many files, increase this value.|
| `opcache.validate_timestamps` | `On` | If your app doesn't generate compiled PHP, you can [disable this setting](./tuning.md#disable-opcache-timestamp-validation). |

To retrieve the default PHP values, connect to the container with SSH and run `php -i`.
To get specific default values, use grep.
For example, to get the value for `opcache.memory_consumption`, run `php -i | grep opcache.memory_consumption`.

### Customize PHP settings

There are two ways to customize PHP values for your app.
The recommended method is to [set variables using a `php:` prefix](../../create-apps/app-reference.md#variables).
For example, to change the PHP memory limit, use the following configuration:

```yaml {location=".platform.app.yaml"}
variables:
    php:
        memory_limit: "256M"
```

The advantage of this method is that you can use the same files for all your environments and override values on any given environment if needed.

To change the PHP configuration in a specific environment,
in that environment override the app variables by adding a [PHP-specific environment variable](../../development/variables/_index.md#php-specific-variables).

As an alternative, you can provide a custom `php.ini` file at the [app root](../../create-apps/app-reference.md#root-directory).

```ini {location="php.ini"}
memory_limit = 256M
```

For Dedicated environments, see the [configuration options](../../dedicated/overview/grid.md#configuration-options).

### Disable functions for security

A common recommendation for securing PHP installations is disabling built-in functions frequently used in remote attacks.
By default, Platform.sh doesn't disable any functions.

If you're sure a function isn't needed in your app, you can disable it.

For example, to disable `pcntl_exec` and `pcntl_fork`:

```yaml {location=".platform.app.yaml"}
variables:
    php:
        disable_functions: "pcntl_exec,pcntl_fork"
```

Common functions to disable include:

| Name | Description |
|------|-------------|
| `create_function` | This function has been replaced by anonymous functions and shouldn't be used anymore.|
| `exec`, `passthru`, `shell_exec`, `system`, `proc_open`, `popen` | These functions allow a PHP script to run a bash shell command. Rarely used by web apps except for build scripts that might need them. |
| `pcntl_*` | The `pcntl_*` functions are responsible for process management. Most of them cause a fatal error if used within a web request. Cron tasks or workers may need them. Most are usually safe to disable. |
| `curl_exec`, `curl_multi_exec` | These functions allow a PHP script to make arbitrary HTTP requests. If you're using HTTP libraries such as Guzzle, don't disable them. |
| `show_source` | This function shows a syntax highlighted version of a named PHP source file. Rarely useful outside of development. |

## Execution mode

PHP offers two execution modes depending on your use-case:

- Command line interface (PHP-CLI) is the mode used for command line scripts and standalone applications.
    This is the mode used when logged into your container via SSH, for [crons](../../create-apps/app-reference.md#crons)
    and usually also for [alternate start commands](#alternate-start-commands).
    To use PHP-CLI mode, run your script with `php <SCRIPT>.php`.
- Common gateway interface (PHP-CGI) is the mode used for web applications and web requests.
    This is the default mode when the `start` command isn't explicitly set.
    To use PHP-CGI mode, run your script with the symlink: `/usr/bin/start-php-app <SCRIPT>.php` instead of `php`.
    PHP is run in CGI mode using PHP-FPM (FastCGI Process Manager).

## Alternate start commands

To specify an alternative process to run your code, set a `start` command.
For more information about the start command, see [web commands reference](../../create-apps/app-reference.md#web-commands).

By default, start commands use the PHP-CLI and run your script with `php <SCRIPT>.php`.
Find out how and when to use [which execution mode](#execution-mode).

Note that the `start` command must run in the foreground and is executed before the [deploy hook](../../create-apps/hooks/hooks-comparison.md).
That means that PHP-FPM can't run simultaneously along with another persistent process such as [ReactPHP](https://github.com/platformsh-examples/platformsh-example-reactphp) or [Amp](https://github.com/platformsh-examples/platformsh-example-amphp).
If you need multiple processes, they have to run in separate containers.

Set up alternate start commands to:

{{< codetabs >}}

---
title=Run a custom script
file=none
highlight=false
---

1. Add your script in a PHP file,
2. Specify an alternative `start` command by adapting the variable:

    ```yaml {location=".platform.app.yaml"}
    web:
        commands:
            start: php <APP>.php
    ```

    Where `<APP>` is a file path relative to the [app root](../../create-apps/app-reference.md#root-directory).

<--->

---
title=Run a custom web server
file=none
highlight=false
---

1. Add your web server's code in a PHP file,
2. Specify an alternative `start` command by adapting the variable:

    ```yaml {location=".platform.app.yaml"}
    web:
        commands:
            start: php <APP>.php
    ```

    Where `<APP>` is a file path relative to the [app root](../../create-apps/app-reference.md#root-directory).
3. Set the upstream to TCP:

    ```yaml {location=".platform.app.yaml"}
        upstream:
            socket_family: tcp
            protocol: http

    ```

    When you configure your app to connect via a TCP socket, the `$PORT` environment variable is automatically set.
    See more options on [how to configure the upstream](../../create-apps/app-reference.md#upstream).
    You might have to configure your app to connect via the `$PORT` TCP socket,
    especially when using web servers such as [Swoole](swoole.md) or [Roadrunner](https://github.com/roadrunner-server/roadrunner).
4. (optional) override redirects:

    ```yaml {location=".platform.app.yaml"}
    locations:
            "/":
                allow: false
                passthru: true
    ```

    To let the custom web server handle redirects, the .

<--->

---
title=Run specific tasks
file=none
highlight=false
---

To execute runtime-specific tasks (such as clearing cache) before your app starts:

1. Create a separate shell script that includes all the commands to be run.
2. Specify an alternative `start` command by adapting the following:

    ```yaml {location=".platform.app.yaml"}
    web:
        commands:
            start: bash <SCRIPT>.sh && php <APP>.php
    ```

    Where `<SCRIPT>.sh` is the bash script created in the step 1 and `<APP>.php` is your app.
    `<SCRIPT>` and `<APP>` are file paths relative to the [app root](../../create-apps/app-reference.md#root-directory).
{{< /codetabs >}}

## Foreign function interfaces

[Foreign function interfaces (FFI)](https://en.wikipedia.org/wiki/Foreign_function_interface)
allow your PHP program to call routines or use services written in C or Rust.

Starting from PHP 7.4, you can use FFI on your app, though you shouldn't have to in most cases.

If you are using C code, you need `.so` library files.
Either place these files directly in your repository or compile them in a makefile using `gcc` in your [build hook](../../create-apps/hooks/hooks-comparison.md#build-hook).
Note: The `.so` library files shouldn't be located in a publicly accessible directory.

If you are compiling Rust code, use the build hook to [install Rust](https://doc.rust-lang.org/stable/book/ch01-01-installation.html).

To leverage FFI:

1. [Enable and configure OPcache](tuning.md#enable-opcache).
2. Enable the FFI extension:

    ```yaml {location=".platform.app.yaml"}
    runtime:
        extensions:
            - ffi
   ```

3. Specify a [preload file](./tuning.md#opcache-preloading) in which you call `FFI::load()`.
    Using `FFI::load()` in preload is considerably faster than loading the linked library on each request or script run.
4. If you are running FFI from the command line,
    enable OPcache for command line scripts in addition to the preloader.
    The standard pattern for the command is `php -d opcache.preload="<PRELOAD_SCRIPT_NAME>.php" -d opcache.enable_cli=true <CLI_SCRIPT_NAME>.php`

See [complete working examples for C and Rust](https://github.com/platformsh-examples/php-ffi).

## Project templates

{{< repolist lang="php" displayName="PHP" >}}
