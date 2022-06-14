---
title: "PHP"
description: PHP is a popular scripting language designed especially for the web. It currently powers around 80% of websites.
layout: single
---

Platform.sh supports deploying PHP applications.

## Supported versions

| **Grid** | **Dedicated** |
|----------------------------------|---------------|
|  {{< image-versions image="php" status="supported" environment="grid" >}} | {{< image-versions image="php" status="supported" environment="dedicated" >}} |

Note that from PHP 7.1, the images use the Zend Thread Safe (ZTS) version of PHP.

{{% language-specification type="php" display_name="PHP" %}}

{{< image-versions-legacy "php" >}}

{{% deprecated-versions %}}

| **Grid** | **Dedicated** |
|----------------------------------|---------------|
|  {{< image-versions image="php" status="deprecated" environment="grid" >}} | {{< image-versions image="php" status="deprecated" environment="dedicated" >}} |

## Usage example

Configure your app to use PHP on Platform.sh (a complete example is included at the end).

### 1. Specify the version

<!-- Choose a version from the [list above](#supported-versions)
and add it to your [app configuration](../create-apps/_index.md): -->

{{< readFile file="src/registry/images/examples/full/php.app.yaml" highlight="yaml" location=".platform.app.yaml" >}}

### 2. Specify the dependency management

Add the following to your app configuration to use composer 2.x:

```yaml {location=".platform.app.yaml"}
dependencies:
    php: 
        composer/composer: '^2'
```

### 3. Build your app

Include any commands needed to build and setup your app in the `hooks`.
By default, none is needed for PHP, as in the following example:

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        set -e
```

### 4. Start your app

Set the location from which content should be served.
And set the passthru to handle all non-static requests.

```yaml {location=".platform.app.yaml"}
web:
    locations:
        '/':
            root: 'public'
            passthru: '/app.php'
```

A [start command](../../create-apps/app-reference.md#required-command) is not required for PHP.

### Complete example

A complete basic app configuration looks like the following:

```yaml {location=".platform.app.yaml"}
name: 'app'

type: 'php:8.1'

dependencies:
    php:
        composer/composer: '^2'

hooks:
    build: |
        set -e

web:
    locations:
        '/':
            root: 'public'
            passthru: '/app.php'
```

## Manage dependencies

PHP images use the `composer` build flavor by default,
which uses the latest Composer 2.x release as [a dependency](../../create-apps/app-reference.md#dependencies).
To use Composer 2.x, add the following to your app configuration:

```yaml {location=".platform.app.yaml"}
dependencies:
    php: 
        composer/composer: '^2'
```

### Alternative repositories

In addition to the standard `dependencies` format,
you can specify alternative repositories for Composer to use.
The standard format:

```yaml {location=".platform.app.yaml"}
dependencies:
    php:
        "platformsh/client": "2.x-dev"
```

is equivalent to `composer require platform/client 2.x-dev`.

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
The above is equivalent to the following `composer.json` file:

```json {location="composer.json"}
{
    "repositories": [
        {
            "type": "vcs",
            "url":  "git@github.com:platformsh/platformsh-client-php.git"
        }
    ],
    "require": {
        "platformsh/client": "2.x-dev"
    }
}
```

## Connecting to services

The following examples show how to access various [services](/add-services/_index.md) with PHP.
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

### Configuration reader

While it is possible to read the environment directly from your application,
it is generally easier and more robust to use the [`platformsh/config-reader`](https://github.com/platformsh/config-reader-php) Composer library which handles decoding of service credential information for you.

## PHP settings

For dedicated, [see the configuration options](../../dedicated/overview/grid.md#configuration-options).

By default, PHP is run in CGI mode using PHP-FPM.
It's possible to change the PHP-FPM runtime configuration via the `runtime` property in your [app configuration](../../create-apps/app-reference.md#runtime).
See that reference for details on what can be changed.

You can set the [PHP  runtime timezone](../../create-apps/timezone.md).

### Default `php.ini` settings

The default `php.ini` values can be retrieved by calling the `phpinfo()` function from within a php script:

``` yaml {location="info.php"}
<?php

// Show all information, defaults to INFO_ALL
phpinfo();

// Show just the module information.
// phpinfo(8) yields identical results.
phpinfo(INFO_MODULES);

?>
```

Don't forget to remove the file once you've retrieved all the information you need.
For full reference, consult the [PHP documentation](https://www.php.net/manual/en/function.phpinfo.php).

Some noteworthy `php.ini` settings are:

- `display_errors=On`: This value is on by default. Use a custom error handler in your application to track errors. Set this value to Off before you make your site live.
- `zend.assertions=-1`: Assertions are optimized out of existence and have no impact at runtime. You should have assertions set to `1` for your local development system.
- `opcache.memory_consumption=64`: This is the number of megabytes available for [the OPcache](/languages/php/tuning.md#enable-opcache-preloading). Increase this value for large applications with many files.
- `opcache.validate_timestamps=On`: [the OPcache](/languages/php/tuning.md#enable-opcache-preloading) checks for updated files on disk. This is necessary to support applications that generate compiled PHP code from user configuration. If you are certain your application does not do so then you can disable this setting for a small performance boost.

{{< note theme="warning" >}}
There are no limits set to what you can put in your `php.ini` file, but many settings can break your application.
{{< /note >}}

There are two ways to customize `php.ini` values for your application.
The recommended method is to use the [`variables` property](../../create-apps/app-reference.md#variables) to set `ini` values using the `php` prefix.
For example, to increase the PHP memory limit, you'd put the following:

```yaml {location=".platform.app.yaml"}
variables:
    php:
        memory_limit: "256M"
```

As an alternative, you can provide a custom `php.ini` file at the [app root](../../create-apps/app-reference.md#root-directory)

```ini {location="php.ini"}
; Increase PHP memory limit
memory_limit = 256M
```

For environment-specific `php.ini` configuration directives, provide them via environment variables that are separate from the application code.
See the note on [environment variables](../../development/variables/_index.md#php-specific-variables).

### Disable functions for security

A common recommendation for securing PHP installations is disabling built-in functions frequently used in remote attacks.
By default, Platform.sh does not disable any functions as they all have some legitimate use.

If you're sure a function isn't needed in your app, you can disable it.

For example, to disable `pcntl_exec` and `pcntl_fork`:

```yaml {location=".platform.app.yaml"}
variables:
    php:
        disable_functions: "pcntl_exec,pcntl_fork"
```

Common functions to disable include:

- `exec`, `passthru`, `shell_exec`, `system`, `proc_open`, `popen`: These functions allow a PHP script to run a bash shell command. Rarely used by web applications except for build scripts that might need them.
- `pcntl_exec`, `pcntl_fork`, `pcntl_setpriority`: The `pcntl_*` functions (including those not listed here) are responsible for process management. Most of them cause a fatal error if used within a web request. Cron tasks or workers may need them. Most are usually safe to disable.
- `curl_exec`, `curl_multi_exec`: These functions allow a PHP script to make arbitrary HTTP requests. These are frequently used by other HTTP libraries such as Guzzle, in which case you should *not* disable them.
- `show_source`: This function shows a syntax highlighted version of a named PHP source file. Rarely useful outside of development.
- `create_function`: It has been replaced by anonymous functions and has no useful purpose since PHP 5.3 and shouldn't be used, ever.

## Alternate start commands

If you're running an async PHP daemon, a thread-based worker process, or something similar, you can start these using alternative processes.
To do so, specify an alternative start command, similar to the following:

```yaml {location=".platform.app.yaml"}
web:
    commands:
        start: php run.php
    upstream:
            socket_family: tcp
            protocol: http
```

The above configuration executes the `run.php` script in the application root when the container starts using the PHP-CLI SAPI,
just before the deploy hook runs,
but does *not* launch PHP-FPM.

It also tells the front-controller (Nginx) to connect to your application via a TCP socket.
That port is specified as `PORT` environment variable.
Note that the start command _must_ run in the foreground.

If not specified, the effective default start command for PHP-FPM varies by PHP version:

- On PHP 5.x, it's `/usr/sbin/php5-fpm`.
- On PHP 7.x and higher, it's `/usr/sbin/php-fpm<VERSION_NUMBER>`, where `<VERSION_NUMBER>` is the PHP version set as your app's type.

You can call PHP-FPM manually but that's generally not necessary.

Note that PHP-FPM can't run simultaneously along with another persistent process such as ReactPHP or Amp.
If you need both, they have to run in separate containers.

## Foreign function interfaces

With [foreign function interfaces (FFIs)](https://en.wikipedia.org/wiki/Foreign_function_interface),
your PHP program can call routines or use services written in C or Rust.
FFI is fully supported on Platform.sh.

FFI is only intended for advanced use cases. Use with caution.

Ensure that your `.so` library files are available locally.
You can either place these files directly in your repository or download and compile them in your build hook.
Note: The library files shouldn't be accessible in a publicly web-accessible directory.

If compiling C code, `gcc` is available by default.
If compiling Rust code, use the build hook to [install Rust](https://doc.rust-lang.org/stable/book/ch01-01-installation.html).

To leverage FFI:

1. Enable the FFI extension:

    ```yaml {location=".platform.app.yaml"}
    runtime:
        extensions:
            - ffi
   ```

2. Specify a [preload file](#opcache-preloading) <!-- TODO: Change link --> in which you can call `FFI::load()`.
    Using `FFI::load()` in preload is considerably faster than loading the linked library on each request or script run.
3. If you are running FFI from the command line,
    enable OPcache for command line scripts in addition to the preloader.
    The standard pattern for the command would be `php -d opcache.preload="your-preload-script.php" -d opcache.enable_cli=true your-cli-script.php`.

See [complete working examples for C and Rust](https://github.com/platformsh-examples/php-ffi).

## Project templates

A number of project templates for major PHP applications are available on GitHub. Not all of them are proactively maintained but all can be used as a starting point or reference for building your own website or web application.

{{< repolist lang="php" >}}