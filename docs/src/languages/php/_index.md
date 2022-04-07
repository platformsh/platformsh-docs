---
title: "PHP"
description: PHP is a popular scripting language designed especially for the web. It currently powers over 80% of websites.
layout: single
---

Platform.sh supports deploying PHP applications.

## Supported versions

| **Grid** | **Dedicated** |
|----------------------------------|---------------|
|  {{< image-versions image="php" status="supported" environment="grid" >}} | {{< image-versions image="php" status="supported" environment="dedicated" >}} |

{{< image-versions-legacy "php" >}}

Note that from PHP 7.1, the images use the Zend Thread Safe (ZTS) version of PHP.

{{% language-specification type="php" display_name="PHP" %}}

{{% deprecated-versions %}}

| **Grid** | **Dedicated** |
|----------------------------------|---------------|
|  {{< image-versions image="php" status="deprecated" environment="grid" >}} | {{< image-versions image="php" status="deprecated" environment="dedicated" >}} |

## Usage example

To use PHP, specify PHP as your app’s type:

```yaml {location=".platform.app.yaml"}
type: 'php:<VERSION_NUMBER>'
```

For example:

```yaml {location=".platform.app.yaml"}
type: 'php:8.1'
```

## Manage dependencies

PHP images use the `composer` build flavor by default,
which uses the latest Composer 2.x release as [a dependency](../../configuration/app/app-reference.md#dependencies).
If you want to use composer 1.x instead, remove the following block (if present):

```yaml {location=".platform.app.yaml"}
dependencies:
    php: 
        composer/composer: '^2'
```

Using `composer` as build flavor runs `composer --no-ansi --no-interaction install --no-progress --prefer-dist --optimize-autoloader` <!-- TODO: Check that this is still accurate --> if a `composer.json` file is detected.

In addition to the standard `dependencies` format,
it's also possible to specify alternative repositories for use by Composer.
The standard format:

```yaml {location=".platform.app.yaml"}
dependencies:
    php:
        "platformsh/client": "2.x-dev"
```

is equivalent to `composer require platform/client 2.x-dev`.
You can also specify explicit `require` and `repositories` blocks:

```yaml {location=".platform.app.yaml"}
dependencies:
    php:
        require:
            "platformsh/client": "2.x-dev"
        repositories:
            - type: vcs
              url: "git@github.com:platformsh/platformsh-client-php.git"
```

That would install `platformsh/client` from the alternate repository specified, as a global dependency.
That allows you to install a forked version of a global dependency from a custom repository.
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

To access various [services](/configuration/services/_index.md) with PHP, see the following examples.
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

## PHP Settings

There are two ways to customize `php.ini` values for your application.
The recommended method is to use the [`variables` property](../../configuration/app/app-reference.md#variables) to set `ini` values using the `php` prefix.
For example, to increase the PHP memory limit you'd put the following:

```yaml {location=".platform.app.yaml"}
variables:
    php:
        memory_limit: "256M"
```

It's also possible to provide a custom `php.ini` file in the repository in the root of the application (where your `.platform.app.yaml` file is).

```ini {location="php.ini"}
; php.ini
; Increase PHP memory limit
memory_limit = 256M
```

You can also set the timezone of the PHP runtime in the `php.ini` file or through [the app runtime timezone](../../configuration/app/timezone.md).
Note that the timezone settings of containers/services would remain in UTC

It's possible to change the PHP-FPM runtime configuration via the `runtime` property in your [app configuration](../../configuration/app/app-reference.md#runtime).
See that reference for details on what can be changed.

Environment-specific `php.ini` configuration directives can be provided via environment variables separately from the application code.
See the note on [environment variables](../../development/variables/_index.md#php-specific-variables).

### Disabling functions

A common recommendation for securing a PHP installation is to disable certain built-in functions that are frequently used in remote attacks.  By default, Platform.sh does not disable any functions as they all do have some legitimate use in various applications.  However, you may wish to disable them yourself if you know they are not needed.  For example, to disable `pcntl_exec` and `pcntl_fork` (which are not usable in a web request anyway):

```yaml {location=".platform.app.yaml"}
variables:
    php:
        disable_functions: "pcntl_exec,pcntl_fork"
```

Common functions to disable include:

* `create_function` - It has been replaced by anonymous functions and has no useful purpose since PHP 5.3 and should not be used, ever.
* `exec,passthru,shell_exec,system,proc_open,popen` - These functions all allow a PHP script to run a bash shell command. That is rarely used by web applications, although build scripts may need them.
* `pcntl_exec,pcntl_fork,pcntl_setpriority` - The `pcntl_*` functions (including those not listed here) are responsible for process management.  Most of them will cause a fatal error if used within a web request.  Cron tasks or workers may make use of them.  Most are safe to disable unless you know that you are using them.
* `curl_exec,curl_multi_exec` - These functions allow a PHP script to make arbitrary HTTP requests.  Note that they are frequently used by other HTTP libraries such as Guzzle, in which case you should *not* disable them.
* `show_source` - This function shows a syntax highlighted version of a named PHP source file.  That is rarely useful outside of development.

Naturally if your application does make use of any of these functions, it will fail if you disable them.  In that case, do not disable them.

### Default php.ini settings

The default values for some frequently-modified `php.ini` settings are listed below.

* **memory_limit=128M**
* **post_max_size=64M**
* **upload_max_filesize=64M**
* **display_errors=On**

    This value is on by default to ease setting up a project on Platform.sh. We strongly recommend providing a custom error handler in your application or setting this value to Off before you make your site live.
* **zend.assertions=-1**

    Assertions are optimized out of existence and have no impact at runtime. You should have assertions set to `1` for your local development system.
* **opcache.memory_consumption=64**

    This is the number of megabytes available for the opcache. Large applications with many files may want to increase this value.
* **opcache.validate_timestamps=On**

    The opcache will check for updated files on disk. This is necessary to support applications that generate compiled PHP code from user configuration. If you are certain your application does not do so then you can disable this setting for a small performance boost.

{{< note theme="warning" >}}
We do not limit what you can put in your `php.ini` file, but many settings can break your application. This is a facility for advanced users.
{{< /note >}}

## Foreign Function Interfaces (FFI)

[Foreign Function Interfaces (FFI)](https://en.wikipedia.org/wiki/Foreign_function_interface), allow user-space code to bridge to existing C-ABI-compatible libraries. <!-- TODO: Simplify that part, it still feels heavy -->
FFI is fully supported on Platform.sh.

Note: FFI is only intended for advanced use cases, and is rarely a net win for routine web requests.
Use with caution.

Before you begin: <!-- TODO: Improve structure based on howto -->

Ensure that your `.so` library files are available locally.
You can either place these files directly in your repository or download and compile them in your build hook.
The library files shouldn't be accessible in a publicly web-accessible directory.

If compiling C code, `gcc` is available by default.
If compiling Rust code, you can download the [Rust compiler in the build hook](https://doc.rust-lang.org/stable/book/ch01-01-installation.html).

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
    you need to enable the OPcache for command line scripts in addition to
    the preloader.
    The standard pattern for the command would be `php -d opcache.preload="your-preload-script.php" -d opcache.enable_cli=true your-cli-script.php`.

A working [FFI example](https://github.com/platformsh-examples/php-ffi) is available online for both C and Rust.

## Alternate start commands

PHP is most commonly run in a CGI mode, using PHP-FPM.
That's the default on Platform.sh. <!-- TODO Put that in the general overview + rephrase -->
However, you can also start alternative processes if desired,
such as if you're running an async PHP daemon, a thread-based worker process, or something similar.
To do so, specify an alternative start command in `platform.app.yaml`, similar to the following:

```yaml
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
It also tells the front-controller (Nginx) to connect to your application via a TCP socket,
which is specified in the `PORT` environment variable.
Note that the start command _must_ run in the foreground.

If not specified, the effective default start command varies by PHP version:

* On PHP 5.x, it's `/usr/sbin/php5-fpm`.
* On PHP 7.x and higher, it's `/usr/sbin/php-fpm<VERSION_NUMBER>`.

While you can call it manually that's generally not necessary.
Note that PHP-FPM cannot run simultaneously along with another persistent process (such as ReactPHP or Amp).
If you need both, they have to run in separate containers.

## Project templates

A number of project templates for major PHP applications are available on GitHub. Not all of them are proactively maintained but all can be used as a starting point or reference for building your own website or web application.

{{< repolist lang="php" >}}