---
title: "PHP"
description: Deploy PHP apps on Platform.sh.
layout: single
---

PHP is a popular scripting language that currently powers around 80% of websites.
You can deploy your PHP apps on Platform.sh.

PHP can be used in two modes:

- CGI (common gateway interface) is a PHP interface to interact with web servers, and it's the mode used by default in the general runtime.
    If you want to use the CLI instead, [see Alternate start commands](#alternate-start-commands).
    PHP is run in CGI mode using PHP-FPM (FastCGI Process Manager).
- CLI (command line interface) is the mode used when logged into your container via SSH or for [crons](../../create-apps/app-reference.md#crons).

## Supported versions

| **Grid** | **Dedicated** |
|----------------------------------|---------------|
|  {{< image-versions image="php" status="supported" environment="grid" >}} | {{< image-versions image="php" status="supported" environment="dedicated" >}} |

{{% image-versions-legacy "php" %}}

{{% language-specification type="php" display_name="PHP" %}}

{{% deprecated-versions %}}

| **Grid** | **Dedicated** |
|----------------------------------|---------------|
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

Web requests are processed as follows:

- Static files such as `.css` or `.jpg` files are served directly by the web server.
- Requests are handled by the existing matching `.php` files defined in the `root` folder. Nonexistent files are handled by the front controller (`passthru`).

To define from which URL path the content should be served, [set the `locations`](../../create-apps/app-reference.md#locations).

Note that all requests are sent to PHP.

In the following example, all requests made to the root of your site (`/`) are sent to the `public` directory:

```yaml {location=".platform.app.yaml"}
web:
    locations:
        '/':
            root: 'public'
            passthru: '/app.php'
```

To have more control, you can [define rules to specify which static files you want to allow](../../create-apps/web/php-basic.md#set-different-rules-for-specific-locations).
See also a step-by-step explanation on [how to create a basic PHP app with a front controller](../../create-apps/web/php-basic.md).

### Complete example

A complete basic app configuration looks like the following:

```yaml {location=".platform.app.yaml"}
name: 'app'

type: 'php:8.1'

web:
    locations:
        '/':
            root: 'public'
            passthru: '/app.php'
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

### Alternative repositories

In addition to the standard `dependencies` format,
you can specify alternative repositories for Composer to use as global dependencies.
So you can install a forked version of a global dependency from a custom repository.

To install from an alternative repository,
specify explicit `require` and `repositories` blocks:

```yaml {location=".platform.app.yaml"}
dependencies:
    php:
        require:
            "platformsh/client": "2.x-dev"
        repositories:
            - type: vcs
              url: "git@github.com:platformsh/platformsh-client-php.git"
```

That installs `platformsh/client` from the specified repository as a global dependency.

The `require` block is equivalent to the composer `require` command:

```yaml {location=".platform.app.yaml"}
dependencies:
    php:
        "platformsh/client": "2.x-dev"
```

The above is equivalent to `composer require platform/client 2.x-dev`.

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

You can set the [PHP runtime timezone](../../create-apps/timezone.md).

Some commonly used settings are:

| Name | Default | Description |
|------|---------|-------------|
| `max_execution_time` | `0` | This is the maximum execution time, in seconds, for your PHP scripts and applications. A value of `0` means there are no time limits. |
| `max_file_uploads` | `20` | This is the maximum number of files that can be uploaded per request. |
| `max_input_time` | `-1` | This is the maximum time, in seconds, that your script is allowed to receive input (e.g for file uploads). A value of `-1` means there are no time limits. |
| `max_input_vars` | `1000` | This is the maximum amount of input variables that are accepted per request. |
| `memory_limit` | `512M` | The memory limit, in megabytes, that's set for PHP. |
| `post_max_size` | `8M` | This is the maximum size, in megabytes, per uploaded file. Increase this value to upload larger files. |
| `zend.assertions` | `-1` | Assertions are optimized and have no impact at runtime. Set assertions to `1` for your local development system. [See more on assertions](https://www.php.net/manual/en/regexp.reference.assertions). |
| `opcache.memory_consumption` | `64` | This is the number of megabytes available for [the OPcache](./tuning.md#opcache-preloading). Increase this value for large applications with many files.|
| `opcache.validate_timestamps` | `On` | [The OPcache](./tuning.md#opcache-preloading) checks for updated files on disk. This is necessary to support applications that generate compiled PHP code from user configuration. If you are certain your application doesn't do so then you can disable this setting for a small performance boost. |

To retrieve the default PHP values, connect to the container with SSH and run `php -i`.
To get specific default values, use grep.
To get the value for `opcache.memory_consumption` you could run something like `php -i | grep opcache.memory_consumption`.

### Customize the PHP settings

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

## Alternate start commands

For further control over your app or to run a custom PHP script, a web server or a thread-based worker process, set a `start` command.
See more on [web commands reference](../../create-apps/app-reference.md#web-commands).

PHP-CLI (command line interface) is the mode used for alternate start commands which differs from PHP-CGI (common gateway interface).
PHP-CGI is the mode used by default in the general runtime.
If you want to use PHP-CGI with PHP-FPM(FastCGI Process Manager), in the `start` commands, use the `/usr/bin/start-php-app` symlink instead of `php`.

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
            start: php <PATH_TO_FILE>.php
    ```

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
            start: php <PATH_TO_FILE>.php
        upstream:
                socket_family: tcp
                protocol: http
    ```

    When you configure your app to connect via a TCP socket, the `$PORT` environment variable is automatically set.
    You might have to configure your app to connect via the `$PORT` TCP socket,
    especially when using web servers such as [Swoole](swoole.md) or [Roadrunner](https://github.com/roadrunner-server/roadrunner).
3. You might also need to override redirects to let the custom web server handle them.

    ```yaml {location=".platform.app.yaml"}
    locations:
            "/":
                allow: false
                passthru: true
    ```

<--->

---
title=Run specific tasks
file=none
highlight=false
---

1. Create a separate shell script that includes runtime-specific tasks such as clearing cache. That script is executed before your app starts.
2. Specify an alternative `start` command by adapting the variables:

    ```yaml {location=".platform.app.yaml"}
    web:
        commands:
            start: bash <PATH_TO_FILE>.sh && php <PATH_TO_YOUR_APP>.php
    ```

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
