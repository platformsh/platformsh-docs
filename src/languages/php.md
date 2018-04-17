# PHP Support

<!-- toc -->

PHP is a popular scripting language designed especially for the web. It currently powers over 80% of websites.

## Supported versions

### PHP

* 5.6
* 7.0
* 7.1
* 7.2

Note that as of PHP 7.1 we use the Zend Thread Safe (ZTS) version of PHP.

To select a PHP version, specify a `type` such as `php:7.2`:

```yaml
# .platform.app.yaml
type: "php:7.2"
```

## Deprecated versions

The following versions are available but are not receiving security updates from upstream, so their use is not recommended. They will be removed at some point in the future.

### PHP

* 5.4
* 5.5

## PHP extensions

You can define the PHP extensions you want to enable or disable:

```yaml
# .platform.app.yaml
runtime:
    extensions:
        - http
        - redis
        - ssh2
    disabled_extensions:
        - sqlite3
```

The following extensions are enabled by default:

* bcmath
* bz2 (7.1 and later)
* common (7.1 and later)
* curl
* dba (7.1 and later)
* enchant (7.1 and later)
* gd
* imap (7.1 and later)
* interbase (7.1 and later)
* intl
* json (5.6 and later)
* ldap (7.1 and later)
* mbstring (7.1 and later)
* mcrypt (5.6 and earlier)
* mysql
* mysqli (not in 7.1)
* mysqlnd (not in 7.1)
* odbc (7.1 and later)
* openssl
* pdo (not in 7.1)
* pdo_mysql (not in 7.1)
* pdo_sqlite (not in 7.1)
* pgsql (7.1 and later)
* pspell (7.1 and later)
* readline (7.1 and later)
* recode (7.1 and later)
* snmp (7.1 and later)
* soap (7.1 and later)
* sodium (7.2)
* sqlite3
* sockets (7.0 and later)
* sybase (7.1 and later)
* tidy (7.1 and later)
* xml (7.1 and later)
* xmlrpc (7.1 and later)
* zendopcache (5.4 only) / opcache (5.5 and later)
* zip (7.1 and later)


You can disable those by adding them to the `disabled_extensions` list.

This is the complete list of extensions that can be enabled:

| Extension    | 5.4 | 5.5 | 5.6 | 7.0 | 7.1 | 7.2 |
|--------------|-----|-----|-----|-----|-----|-----|
| amqp         |     |     |     | *   | *   |     |
| apc          | *   |     |     |     |     |     |
| apcu         |     | *   | *   | *   | *   | *   |
| apcu_bc      |     |     |     | *   | *   | *   |
| applepay     |     |     |     | *   | *   | *   |
| blackfire    | *   | *   | *   | *   | *   | *   |
| bcmath       |     |     |     | *   | *   | *   |
| bz2          |     |     |     | *   | *   | *   |
| curl         | *   | *   | *   | *   | *   | *   |
| enchant      | *   | *   | *   | *   | *   | *   |
| event        |     |     |     |     | *   | *   |
| gd           | *   | *   | *   | *   | *   | *   |
| gearman      | *   | *   | *   |     |     |     |
| geoip        | *   | *   | *   |     |     |     |
| gmp          | *   | *   | *   | *   | *   | *   |
| http         | *   | *   |     |     |     |     |
| igbinary     |     |     |     | *   | *   | *   |
| imagick      | *   | *   | *   | *   | *   | *   |
| imap         | *   | *   | *   | *   | *   | *   |
| interbase    | *   | *   | *   | *   | *   | *   |
| intl         | *   | *   | *   | *   | *   | *   |
| ioncube      |     |     |     | *   | *   |     |
| json         |     |     | *   | *   | *   | *   |
| ldap         | *   | *   | *   | *   | *   | *   |
| mailparse    |     |     |     | *   | *   | *   |
| mcrypt       | *   | *   | *   | *   | *   |     |
| memcache     | *   | *   | *   |     |     |     |
| memcached    | *   | *   | *   | *   | *   | *   |
| mongo        | *   | *   | *   |     |     |     |
| mongodb      |     |     |     | *   | *   | *   |
| msgpack      |     |     | *   | *   | *   | *   |
| mssql        | *   | *   | *   |     |     |     |
| mysql        | *   | *   | *   |     |     |     |
| mysqli       | *   | *   | *   | *   | *   | *   |
| mysqlnd      | *   | *   | *   |     |     |     |
| newrelic     |     |     | *   | *   | *   | *   |
| oauth        |     |     |     | *   | *   |     |
| odbc         | *   | *   | *   | *   | *   | *   |
| opcache      |     | *   | *   | *   | *   | *   |
| openssl      |     |     |     |     |     |     |
| pdo          | *   | *   | *   | *   | *   | *   |
| pdo_dblib    | *   | *   | *   | *   | *   | *   |
| pdo_firebird | *   | *   | *   | *   | *   | *   |
| pdo_mysql    | *   | *   | *   | *   | *   | *   |
| pdo_odbc     | *   | *   | *   | *   | *   | *   |
| pdo_pgsql    | *   | *   | *   | *   | *   | *   |
| pdo_sqlite   | *   | *   | *   | *   | *   | *   |
| pecl-http    |     |     | *   |     |     |     |
| pgsql        | *   | *   | *   | *   | *   | *   |
| pinba        | *   | *   | *   |     |     |     |
| propro       |     |     | *   |     |     |     |
| pspell       | *   | *   | *   | *   | *   | *   |
| pthreads     |     |     |     |     | *   | *   |
| raphf        |     |     | *   |     |     |     |
| readline     | *   | *   | *   | *   | *   | *   |
| recode       | *   | *   | *   | *   | *   | *   |
| redis        | *   | *   | *   | *   | *   | *   |
| snmp         | *   | *   | *   | *   | *   | *   |
| sockets      |     |     | *   | *   | *   |     |
| sockets      |     |     | *   | *   | *   |
| sodium       |     |     |     |     |     | *   |
| spplus       | *   | *   |     |     |     |     |
| sqlite3      | *   | *   | *   | *   | *   | *   |
| ssh2         | *   | *   | *   |     | *   | *   |
| tideways     |     |     |     | *   | *   | *   |
| tidy         | *   | *   | *   | *   | *   | *   |
| uuid         |     |     |     |     | *   |     |
| xcache       | *   | *   |     |     |     |     |
| xdebug       | *   | *   | *   | *   | *   | *   |
| xhprof       | *   | *   | *   |     |     |     |
| xmlrpc       | *   | *   | *   | *   | *   | *   |
| xsl          | *   | *   | *   | *   | *   |     |
| yaml         |     |     |     |     | *   |     |
| zbarcode     |     |     |     | *   | *   |     |
| zendopcache  | *   |     |     |     |     |     |

> **note**
> You can check out the output of `ls /etc/php5/mods-available` to
> see the up-to-date complete list of extensions after you SSH into
> your environment. For PHP 7, use `ls /etc/php/*/mods-available`.

## Custom PHP extensions

It is possible to use an extension not listed here but it takes slightly more work:

1. Download the .so file for the extension as part of your build hook using `curl` or similar. It can also be added to your Git repository if the file is not publicly downloadable, although committing large binary blobs to Git is generally not recommended.

2. Provide a custom `php.ini` file in the application root (as a sibling of your `.platform.app.yaml` file) that loads the extension using an absolute path. For example, if the extension is named `spiffy.so` and is in the root of your application, you would have a `php.ini` file that reads:

```ini
extension=/app/spiffy.so
```

## Alternate start commands

PHP is most commonly run in a CGI mode, using PHP-FPM. That is the default on Platform.sh. However, you can also start alternative processes if desired, such as if you're running an Async PHP daemon, a thread-based worker process, etc. To do so, simply specify an alternative start command in `platform.app.yaml`, similar to the following:

```yaml
web:
    commands:
        start: php run.php
    upstream:
            socket_family: tcp
            protocol: http
```

The above configuration will execute the `run.php` script in the application root when the container starts using the PHP-CLI SAPI, just before the deploy hook runs, but will *not* launch PHP-FPM. It will also tell the front-controller (Nginx) to connect to your application via a TCP socket, which will be specified in the `PORT` environment variable. Note that the start command _must_ run in the foreground.

If not specified, the effective default start command varies by PHP version:

* On PHP 5.x, it's `/usr/sbin/php5-fpm`.
* On PHP 7.0, it's `/usr/sbin/php-fpm7.0`.
* On PHP 7.1, it's `/usr/sbin/php-fpm7.1-zts`.

While you can call it manually that is generally not necessary. Note that PHP-FPM cannot run simultaneously along with another persistent process (such as ReactPHP or Amp). If you need both they will have to run in separate containers.

## PHP Worker sizing hints

Platform.sh uses a heuristic to automatically set the number of workers of the PHP-FPM runtime based on the memory available in the container. This heuristic is based on assumptions about the memory necessary on average to process a request. You can tweak those assumptions if your application will typically use considerably more or less memory.

Note that this value is independent of the `memory_limit` set in `php.ini`, which is the maximum amount of memory a single PHP process can use before it is automatically terminated.  These estimates are used only for determining the number of PHP-FPM workers to start.

### The heuristic

The heuristic is based on three input parameters:

 * The memory available for the container, which depends on the size of the container (`S`, `M`, `L`),
 * The memory that an average request is expected to require,
 * The memory that should be reserved for things that are not specific to a request (memory for `nginx`, the op-code cache, some OS page cache, etc.)

The number of workers is calculated as:

```
             / ContainerMemory - ReservedMemory   \
workers = max|---------------------------------, 2|
             \           RequestMemory            /
```

### Defaults

The default assumptions are:

 * `45 MB` for the average per-request memory
 * `70 MB` for the reserved memory

These are deliberately conservative values that should allow most programs to run without modification.

You can change them by using the `runtime.sizing_hints.reserved_memory` and `runtime.sizing_hints.request_memory` in your `.platform.app.yaml`. For example, if your application consumes on average `110 MB` of memory for a request use:

```
runtime:
    sizing_hints:
        request_memory: 110
```

The `request_memory` has a lower limit of 10 MB while `reserved_memory` has a lower limit of 70 MB.  Values lower than those will be replaced with those minimums.

### Measuring PHP worker memory usage

To see how much memory your PHP worker processes are using, you can open an [SSH session](/development/ssh.md) and look at the PHP access log:

    less /var/log/php.access.log

In the fifth column, you'll see the peak memory usage that occurred while each request was handled. The peak usage will probably vary between requests, but in order to avoid the severe performance costs that come from swapping, your size hint should be somewhere between the average and worst case memory usages that you observe.

A good way to determine an optimal request memory is with the following command:

`cat /var/log/php.access.log | awk '{print $6}' | sort -n | uniq -c`

This will print out a table of how many requests used how much memory, in KB.  As an example, consider the following output:

```
      1 
   4800 2048
    948 4096
    785 6144
    584 8192
    889 10240
    492 12288
    196 14336
     68 16384
      2 18432
      1 22528
      6 131072
```

This indicates that the majority of requests (4800) used 2048 KB of memory.  Those are mainly static files so ignore them.  Most requests used up to around 10 MB of memory, while a few used as much as 18 MB and a very very few (6 requests) peaked at 131 MB.  (In this example those are probably cache clears.)

A conservative approach would suggest an average request memory of 16 MB should be sufficient.  A more aggressive stance would suggest 10 MB.  The more aggressive approach would potentially allow for more concurrent requests at the risk of some requests needing to use swap memory, thus slowing them down.

> **note**
> If you are running on PHP 5.x then don't bother adjusting the worker memory usage until you upgrade to PHP 7.x.  PHP 7 is vastly more memory efficient than PHP 5 and you will likely need less than half as much memory per process under PHP 7.

## Custom php.ini

There are two ways to customize `php.ini` values for your application. The recommended method is to use the [`variables` property](/configuration/app/variables.md) of `.platform.app.yaml` to set ini values using the `php` prefix. For example, to increase the PHP memory limit you'd put the following in `.platform.app.yaml`:

 ```yaml
 variables:
    php:
        memory_limit: 256M
 ```

It's also possible to provide a custom `php.ini` file in the repository in the root of the application (where your `.platform.app.yaml` file is).

```
; php.ini
; Increase PHP memory limit
memory_limit = 256M
```

Another example is to set the timezone of the PHP runtime (though, the timezone settings of containers/services would remain in UTC):

 ```yaml
 variables:
    php:
        "date.timezone": "Europe/Paris"
 ```

or

```
; php.ini
; Set PHP runtime timezone
date.timezone = "Europe/Paris"
```

Environment-specific `php.ini` configuration directives can be provided via environment variables separately from the application code. See the note in the [Environment variables](/development/variables.md#php-specific-variables) section.

### Default php.ini settings

The default values for some frequently-modified `php.ini` settings are listed below.

<dl>
<dt>memory_limit=128M</dt> <dd></dd>
<dt>post_max_size=64M</dt> <dd></dd>
<dt>upload_max_filesize=64M</dt> <dd></dd>
<dt>display_errors=On</dt> <dd>This value is on by default to ease setting up a project on Platform.sh. We strongly recommend providing a custom error handler in your application or setting this value to Off before you make your site live.</dd>
<dt>zend.assertions=-1</dt> <dd>Assertions are optimized out of existence and have no impact at runtime. You should have assertions set to `1` for your local development system.</dd>
<dt>opcache.memory_consumption=64</dt> <dd>This is the number of megabytes available for the opcache. Large applications with many files may want to increase this value.</dd>
<dt>opcache.validate_timestamps=On</dt> <dd>The opcache will check for updated files on disk. This is necessary to support applications that generate compiled PHP code from user configuration. If you are certain your application does not do so then you can disable this setting for a small performance boost.</dd>
</dl>

------------------------------------------------------------------------

> **warning**
>
> We do not limit what you can put in your `php.ini` file, but many
> settings can break your application. This is a facility for advanced
> users.

### Debug PHP-FPM

If you want to inspect what's going on with PHP-FPM, you can install this [small CLI](https://github.com/wizaplace/php-fpm-status-cli):

```yaml
dependencies:
  php:
    wizaplace/php-fpm-status-cli: "^1.0"
```

Then when you are connected to your project over SSH you can run:

```shell
$ php-fpm-status --socket=unix:///run/app.sock --path=/-/status --full
```

## Project templates

A number of project templates for major PHP applications are available on GitHub. Not all of them are proactively maintained but all can be used as a starting point or reference for building your own website or web application.

### Applications

* [EZ Platform](https://github.com/platformsh/platformsh-example-ezplatform)
* [Drupal 7](https://github.com/platformsh/platformsh-example-drupal7)
* [Drupal 7 Commerce Kickstart](https://github.com/platformsh/platformsh-example-drupalcommerce7)
* [Drupal 8](https://github.com/platformsh/platformsh-example-drupal8)
* [Drupal 8 (Multisite variant)](https://github.com/platformsh/platformsh-example-drupal8-multisite)
* [Laravel](https://github.com/platformsh/platformsh-example-laravel)
* [Moodle](https://github.com/platformsh/platformsh-example-moodle)
* [Magento 1](https://github.com/platformsh/platformsh-example-magento1)
* [Magento 2](https://github.com/platformsh/platformsh-example-magento)
* [Sculpin](https://github.com/platformsh/platformsh-example-sculpin)
* [TYPO3](https://github.com/platformsh/platformsh-example-typo3)
* [WordPress](https://github.com/platformsh/platformsh-example-wordpress)
* [GravCMS](https://github.com/platformsh/platformsh-example-gravcms)

### Frameworks

* [Amp/Aerys](https://github.com/platformsh/platformsh-example-amphp)
* [React PHP](https://github.com/platformsh/platformsh-example-reactphp)
* [Symfony 2.8](https://github.com/platformsh/platformsh-example-symfony/tree/2.8)
* [Symfony 3.x](https://github.com/platformsh/platformsh-example-symfony/tree/3.0)
