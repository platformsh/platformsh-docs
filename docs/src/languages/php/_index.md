---
title: "PHP"
description: PHP is a popular scripting language designed especially for the web. It currently powers around 80% of websites.
layout: single
---

## Supported versions

| Grid and {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|----------------------------------------|------------------------------ |
|  {{< image-versions image="php" status="supported" environment="grid" >}} | {{< image-versions image="php" status="supported" environment="dedicated-gen-2" >}} |

{{% image-versions-legacy "php" %}}

Note that from PHP 7.1, the images use the Zend Thread Safe (ZTS) version of PHP.

{{% language-specification type="php" display_name="PHP" %}}

{{% deprecated-versions %}}

| Grid and {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|----------------------------------------|------------------------------ |
|  {{< image-versions image="php" status="deprecated" environment="grid" >}} | {{< image-versions image="php" status="deprecated" environment="dedicated-gen-2" >}} |

## Alternate start commands

PHP is most commonly run in a CGI mode, using PHP-FPM.
That's the default on Platform.sh.
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
* On PHP 7.0, it's `/usr/sbin/php-fpm7.0`.
* On PHP 7.1, it's `/usr/sbin/php-fpm7.1-zts`.
* On PHP 7.2, it's `/usr/sbin/php-fpm7.2-zts`.
* On PHP 7.3, it's `/usr/sbin/php-fpm7.3-zts`.
* On PHP 7.4, it's `/usr/sbin/php-fpm7.4-zts`.

While you can call it manually that's generally not necessary.
Note that PHP-FPM can't run simultaneously along with another persistent process (such as ReactPHP or Amp).
If you need both, they have to run in separate containers.

## Expanded dependencies

In addition to the standard `dependencies` format,
it's also possible to specify alternative repositories for use by Composer.
The standard format:

```yaml
dependencies:
    php:
        "platformsh/client": "2.x-dev"
```

is equivalent to `composer require platform/client 2.x-dev`.
You can also specify explicit `require` and `repositories` blocks:

```yaml
dependencies:
    php:
        require:
            "platformsh/client": "2.x-dev"
        repositories:
            - type: vcs
              url: "git@github.com:platformsh/platformsh-client-php.git"
```

That would install `platformsh/client` from the alternate repository specified, as a global dependency.
In other words, it's equivalent to the following `composer.json` file:

```json
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

That allows you to install a forked version of a global dependency from a custom repository.

## Build flavor

PHP images use the `composer` build flavor by default,
which runs `composer --no-ansi --no-interaction install --no-progress --prefer-dist --optimize-autoloader` if a `composer.json` file is detected.

Note that by default, all PHP containers include the latest Composer 1.x release.
If you wish to use Composer 2.x, add it as a `dependency`:

```yaml {location=".platform.app.yaml"}
dependencies:
    php:
        composer/composer: '^2'
```

### Changing the flavor

To not use the `composer` build flavor, such as to run your own Composer command,
set the build flavor to `none` and add the command to the start of your `build` hook.
The following example installs Composer dependencies but not development dependencies:

```yaml {location=".platform.app.yaml"}
build:
    flavor: none

hooks:
    build: |
        set -e
        composer install --no-interaction --no-dev
```

You can achieve the same thing with the default build flavor and the `COMPOSER_NO_DEV` variable.
Add the variable to your Production environment:

{{< codetabs >}}
---
title=Using the CLI
highlight=false
file=none
---

Run a command like the following:

```bash
platform variable:create --environment {{< variable "PRODUCTION_ENVIRONMENT_NAME" >}} --level environment --name COMPOSER_NO_DEV --value 1 --prefix env --json false --sensitive false --enabled true --inheritable false --visible-build false --visible-runtime false
```
<--->
---
title=In the Console
highlight=false
file=none
---

1. Navigate to your Production environment.
2. Click {{< icon settings >}} **Settings**.
3. Click **Variables**.
4. Click **+ Add variable**.
5. Fill in `env:COMPOSER_NO_DEV` for the name.
6. Fill in `1` for the value.
7. Make sure **Make inheritable** is *not* selected.
8. Click **Add variable**.

{{< /codetabs >}}

## OPcache preloading

From PHP 7.4, you can use OPcache preloading,
which allows you to load selected files into shared memory when PHP-FPM starts.
That means functions and classes in those files are always available and don't need to be autoloaded,
at the cost of any changes to those files requiring a PHP-FPM restart.
Since PHP-FPM restarts on each new deploy, this feature is a major win on Platform.sh and we recommend using it aggressively.

To enable preloading, add a `php.ini` value that specifies a preload script.
Any [`php.ini` mechanism](/languages/php/ini.md) works,
but using a variable in `.platform.app.yaml` is the recommended approach:

```yaml
variables:
    php:
        opcache.preload: 'preload.php'
```

The `opcache.preload` value is evaluated as a file path relative your [app configuration](../../create-apps/_index.md).
It may be any PHP script that calls `opcache_compile_file()`.

The following example preloads all `.php` files anywhere in the `vendor` directory:

```php
<?php
$directory = new RecursiveDirectoryIterator(getenv('PLATFORM_APP_DIR') . '/vendor');
$iterator = new RecursiveIteratorIterator($directory);
$regex = new RegexIterator($iterator, '/^.+\.php$/i', RecursiveRegexIterator::GET_MATCH);

foreach ($regex as $key => $file) {
    // This is the important part!
    opcache_compile_file($file[0]);
}
```

{{< note >}}

Preloading all `.php` files may not be optimal for your application and may even introduce errors.
Your application framework may provide recommendations or a pre-made preload script to use instead.
You have to determine the optimal preloading strategy for your situation.

{{< /note >}}

#### Preloading and dependencies

Your preload script runs each time PHP-FPM restarts, including during your build.
This means it runs before your dependencies have been installed (such as with Composer).

If your preload script uses `require` for dependencies, it fails during the build
because the dependencies aren't yet present.

To resolve this, you have two options:

* Have your script `include` dependencies instead of `require`
  and fail gracefully if the dependencies aren't there.
* Enable preloading with a variable that [isn't available during the build](../../development/variables/set-variables.md#variable-options).
  Then preloading happens only on deploy.

## FFI

PHP 7.4 introduced support for Foreign Function Interfaces (FFI),
which allows user-space code to bridge to existing C-ABI-compatible libraries.
FFI is fully supported on Platform.sh.

Note: FFI is only intended for advanced use cases, and is rarely a net win for routine web requests.
Use with caution.

There are a few steps to leveraging FFI:

1. Enable the FFI extension in `.platform.app.yaml`:

    ```yaml
    runtime:
        extensions:
            - ffi
   ```

2. Specify a [preload file](#opcache-preloading) in which you can call `FFI::load()`.
   Using `FFI::load()` in preload is considerably faster than loading the linked library on each request or script run.

3. Ensure the library is available locally, but not in a web-accessible directory.
   `.so` files may included in your repository, downloaded in your build hook, or compiled in your build hook.
   If compiling C code, `gcc` is available by default.
   If compiling Rust code, you can download the [Rust compiler in the build hook](https://doc.rust-lang.org/stable/book/ch01-01-installation.html).

4. For running FFI from the command line,
   you need to enable the OPcache for command line scripts in addition to the preloader.
   The standard pattern for the command would be `php -d opcache.preload="your-preload-script.php" -d opcache.enable_cli=true your-cli-script.php`.

A working [FFI example](https://github.com/platformsh-examples/php-ffi) is available online for both C and Rust.

## Debug PHP-FPM

If you want to inspect what's going on with PHP-FPM,
you can install this [small CLI](https://github.com/wizaplace/php-fpm-status-cli):

```yaml
dependencies:
    php:
        wizaplace/php-fpm-status-cli: "^1.0"
```

Then when you are connected to your project over SSH, you can run:

```shell
$ php-fpm-status --socket=unix://$SOCKET --path=/-/status --full
```

## Accessing services

To access various [services](../../add-services/_index.md) with PHP, see the following examples.
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

## Runtime configuration

It's possible to change the PHP-FPM runtime configuration via the `runtime` property in your [app configuration](../../create-apps/app-reference.md#runtime).
See that reference for details on what can be changed.

## Project templates

{{< repolist lang="php" displayName="PHP" >}}
