---
title: "PHP"
description: Get started deploying PHP apps on Platform.sh.
layout: single
---

PHP is a popular scripting language that currently powers around 80% of websites.
You can deploy your PHP apps on Platform.sh.

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

Configure your app to use PHP on Platform.sh (a complete example is included at the end).

### 1. Specify the version

Choose a version from the [list above](#supported-versions)
and add it to your [app configuration](../../create-apps/_index.md):

{{< readFile file="src/registry/images/examples/full/php.app.yaml" highlight="yaml" location=".platform.app.yaml" >}}

### 2. Specify the dependency management

To manage PHP dependencies and libraries, use [Composer](https://getcomposer.org/).

PHP containers use Composer 1.x by default.
To use Composer 2.x, add the following to your app configuration:

```yaml {location=".platform.app.yaml"}
dependencies:
    php: 
        composer/composer: '^2'
```

### 3. Serve your app

Set the [location](../../create-apps/app-reference.md#locations) from which content should be served.
And set the passthru to handle all non-static requests.

```yaml {location=".platform.app.yaml"}
web:
    locations:
        '/':
            root: 'public'
            passthru: '/app.php'
```

In the above example all requests made to the root of your site (`/`) are sent to the `public` directory where the following happens:

- Static files (`.css`, `.jpg`, ...) are served directly by the web-server.
- Dynamic requests are handled by the existing matching `.php` files in `public`.
- Requests to non-existing files are sent to `public/app.php`.

Note that all requests are sent to PHP.
To have more control, you can define rules to specify which static files you want to allow:

```yaml {location=".platform.app.yaml"}
web:
    locations:
        '/':
            # Handle dynamic requests
            root: 'public'
            passthru: '/index.php'
            # Disallow static files
            allow: false
            rules:
                # Allow common image files only.
                '\.(jpe?g|png|gif|svgz?|css|js|map|ico|bmp|eot|woff2?|otf|ttf)$':
                    allow: true
```

A [start command](../../create-apps/app-reference.md#required-command) isn't required for PHP.

### Complete example

A complete basic app configuration looks like the following:

```yaml {location=".platform.app.yaml"}
name: 'app'

type: 'php:8.1'

dependencies:
    php:
        composer/composer: '^2'

web:
    locations:
        '/':
            root: 'public'
            passthru: '/app.php'
```

## Dependencies

By default, PHP images use `composer` to manage dependencies.
If a `composer.json` file is present on your project, `composer --no-ansi --no-interaction install --no-progress --prefer-dist --optimize-autoloader` is run during [build](../../create-apps/hooks/hooks-comparison.md#build-hook).

The Composer [build flavor](../../create-apps/app-reference.md#build) uses the latest Composer 1.x release as [a dependency](../../create-apps/app-reference.md#dependencies) to manage dependencies.
To use Composer 2.x on your project, add the following to your app configuration:

```yaml {location=".platform.app.yaml"}
dependencies:
    php: 
        composer/composer: '^2'
```

### Alternative repositories

In addition to the standard `dependencies` format,
you can specify alternative repositories for Composer to use.
The equivalent to `composer require platform/client 2.x-dev` is:

```yaml {location=".platform.app.yaml"}
dependencies:
    php:
        "platformsh/client": "2.x-dev"
```

To install from an alternate repository,  specify explicit `require` and `repositories` blocks:

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
So you can install a forked version of a global dependency from a custom repository.

## Connecting to services

The following examples show how to access various [services](../../add-services/_index.md) with PHP.
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

PHP can be used in two modes:

- CGI (common gateway interface): the mode used in the `passthru`. CGI is a PHP interface to interact with web servers. PHP-FPM (FastCGI Process Manager) is commonly used to run the CGI mode.
- CLI (command line interface): the mode used for [crons](../../create-apps/app-reference.md#crons) or when SSH-ed into your container.

By default, PHP is run in CGI mode using PHP-FPM (FastCGI Process Manager).

It's possible to change some of the PHP-FPM runtime configuration via the `runtime` property in your [app configuration](../../create-apps/app-reference.md#runtime). You can set the [PHP  runtime timezone](../../create-apps/timezone.md).

Some noteworthy settings are:

| Name | Value | Description |
|------|-------|-------------|
| `zend.assertions` | `-1` | Assertions are optimized out of existence and have no impact at runtime. You should have assertions set to `1` for your local development system. |
| `opcache.memory_consumption` | `64` | This is the number of megabytes available for [the OPcache](./tuning.md#opcache-preloading). Increase this value for large applications with many files.|
| `opcache.validate_timestamps` | `On` | [The OPcache](./tuning.md#opcache-preloading) checks for updated files on disk. This is necessary to support applications that generate compiled PHP code from user configuration. If you are certain your application doesn't do so then you can disable this setting for a small performance boost. |
| `max_execution_time` | `0` | This is the maximum execution time, in seconds, for your PHP scripts and applications. A value of `0` means there are no time limits. |
| `max_file_uploads` | `20` | This is the maximum number of files that can be uploaded per request. |
| `max_input_time` | `-1` | This is the maximum time, in seconds, that your script is allowed to receive input (e.g for file uploads). A value of `-1` means there are no time limits. |
| `max_input_vars` | `1000` | This is the maximum amount of input variables that are accepted per request. |
| `memory_limit` | `512M` | The memory limit, in megabytes, that's set for PHP. |
| `post_max_size` | `8M` | This is the maximum size, in megabytes, per uploaded file. Increase this value to upload larger files. |

The default PHP values can be retrieved by running `php -i` when SSH-ed into your container.
Use grep to get specific values.
To get the value for `opcache.memory_consumption` you could run something like `php -i | grep opcache.memory_consumption`.

### Customize the PHP settings

There are two ways to customize PHP values for your application.
The recommended method is to [set variables using the `php` prefix](../../create-apps/app-reference.md#variables).
For example, to increase the PHP memory limit, you'd put the following:

```yaml {location=".platform.app.yaml"}
variables:
    php:
        memory_limit: "256M"
```

The advantage of this method is that you can use the same files for all your environments and override values on any given environment if needed.

As an alternative, you can provide a custom `php.ini` file at the [app root](../../create-apps/app-reference.md#root-directory)

```ini {location="php.ini"}
; Increase PHP memory limit
memory_limit = 256M
```

To change the PHP configuration in a specific environment,
in that environment add a [PHP-specific environment variable](../../development/variables/_index.md#php-specific-variables).

For Dedicated, [see the configuration options](../../dedicated/overview/grid.md#php).

### Disable functions for security

A common recommendation for securing PHP installations is disabling built-in functions frequently used in remote attacks.
By default, Platform.sh doesn't disable any functions as they all have some legitimate use.

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
| `exec`, `passthru`, `shell_exec`, `system`, `proc_open`, `popen` | These functions allow a PHP script to run a bash shell command. Rarely used by web applications except for build scripts that might need them. |
| `pcntl_*` | The `pcntl_*` functions are responsible for process management. Most of them cause a fatal error if used within a web request. Cron tasks or workers may need them. Most are usually safe to disable. |
| `curl_exec`, `curl_multi_exec` | These functions allow a PHP script to make arbitrary HTTP requests. If you are using HTTP libraries like Guzzle, don't disable them. |
| `show_source` | This function shows a syntax highlighted version of a named PHP source file. Rarely useful outside of development. |

## Alternate start commands

For further control over your app you can set a `start` command to specify alternative processes.

Typical use cases include running:

- An async PHP daemon.
- A thread-based worker process.
- A custom PHP script.

The alternative processes use PHP-CLI instead of PHP-CGI.
If you want to use PHP-CGI with PHP-FPM, in the `start` command, use the `/usr/bin/start-php-app` symlink instead of `php`.

Note that the `start` commands must run in the foreground and are executed before the [deploy hook](../../create-apps/hooks/hooks-comparison.md).
Additionally, PHP-FPM can't run simultaneously along with another persistent process such as [ReactPHP](https://github.com/platformsh-examples/platformsh-example-reactphp) or [Amp](https://github.com/platformsh-examples/platformsh-example-amphp).
If you need both, they have to run in separate containers.

{{< codetabs >}}

---
title=Run a custom script
file=none
highlight=false
---

If you want to run a custom script:

1. Add your script in a PHP file,
2. Specify an alternative start command, similar to the following:

    ```yaml {location=".platform.app.yaml"}
    web:
        commands:
            start: php <YOUR_FILE>.php
    ```

<--->

---
title=Run a custom web server
file=none
highlight=false
---

If you want to launch your own server to return content and handle user requests:

1. Add your script in a PHP file,
2. Specify an alternative start command, similar to the following:

    ```yaml {location=".platform.app.yaml"}
    web:
        commands:
            start: php <YOUR_FILE>.php
        upstream:
                socket_family: tcp
                protocol: http
    ```

    By configuring your app to connect to Nginx via a TCP socket, you also enable the definition of the `$PORT` environment variable.
    This variable can be useful as some scripts need to rely on its value to function correctly, which is typically the case when using [Swoole](swoole.md), or [Roadrunner](https://github.com/roadrunner-server/roadrunner). You might have to configure your app to connect with Nginx via the `$PORT` TCP socket.
3. Finally, you may also need to override the locations/redirection to let the custom web server handle these.

    ```yaml {location=".platform.app.yaml"}
    locations:
            "/":
                allow: false
                passthru: true
    ```

{{< /codetabs >}}

For runtime specific tasks such as clearing cache, you need to run these in the `start` command, with something like: `bash clearcache.sh && php <YOUR_FILE>.php`

For more details, see the reference of [web commands](../../create-apps/app-reference.md#web-commands).

## Foreign function interfaces

[Foreign function interfaces (FFIs)](https://en.wikipedia.org/wiki/Foreign_function_interface),
allow your PHP program to call routines or use services written in C or Rust.

Starting from PHP 7.4, you can use FFI on your app, though you shouldn't have to in most cases.

If you are using C code, Ensure that your `.so` library files are available locally.
You can either place these files directly in your repository, or with your makefile to compile them using `gcc` in your [build hook](../../create-apps/hooks/hooks-comparison.md#build-hook).
Note: The `.so` library files shouldn't be located in a publicly accessible directory.

If you are compiling Rust code, use the build hook to [install Rust](https://doc.rust-lang.org/stable/book/ch01-01-installation.html).

To leverage FFI:

1. Enable the FFI extension:

    ```yaml {location=".platform.app.yaml"}
    runtime:
        extensions:
            - ffi
   ```

2. Specify a [preload file](./tuning.md#opcache-preloading) in which you call `FFI::load()`.
    Using `FFI::load()` in preload is considerably faster than loading the linked library on each request or script run.

3. If you are running FFI from the command line,
    enable OPcache for command line scripts in addition to the preloader.
    The standard pattern for the command would be `php -d opcache.preload="<YOUR_PRELOAD_SCRIPT>.php" -d opcache.enable_cli=true <YOUR_CLI_SCRIPT>.php`

See [complete working examples for C and Rust](https://github.com/platformsh-examples/php-ffi).

## Project templates

{{< repolist lang="php" displayName="php" >}}
