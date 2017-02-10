# PHP Support

PHP is a popular scripting language designed especially for the web. It currently powers over 80% of websites.

Platform.sh also supports HHVM, an alternative PHP engine developed by Facebook that includes several extensions to the PHP language, collectivelly called "Hack".

Both are interchangeable from a configuration perspective, although code that uses Hack will only run on HHVM.

## Supported versions

### PHP

* 5.4
* 5.5
* 5.6
* 7.0
* 7.1

Note that as of PHP 7.1 we use the Zend Thread Safe (ZTS) version of PHP.

### HHVM

* 3.9
* 3.12

To select a PHP version, specify a `type` such as `php:7.0` or `hhvm:3.9`:

```yaml
# .platform.app.yaml
type: "php:7.0"
```

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

* json (5.6 and later)
* pdo
* mysql
* mysqli
* mysqlnd
* pdo_mysql
* pdo_sqlite
* sockets (7.0 and later)
* sqlite3
* gd
* curl
* intl
* mcrypt (5.6 and earlier)
* zendopcache (5.4 only) / opcache (5.5 and later)
* bcmath
* openssl

You can disable those by adding them to the `disabled_extensions` list.

This is the complete list of extensions that can be enabled:

| Extension    | 5.4 | 5.5 | 5.6 | 7.0 | 7.1 |
|--------------|-----|-----|-----|-----|-----|
| apc          | *   |     |     |     |     |
| apcu         |     | *   | *   | *   | *   |
| apcu_bc      |     |     |     | *   | *   |
| blackfire    | *   | *   | *   | *   | *   |
| bz2          |     |     |     | *   | *   |
| curl         | *   | *   | *   | *   | *   |
| enchant      | *   | *   | *   | *   | *   |
| event        |     |     |     |     | *   |
| gd           | *   | *   | *   | *   | *   |
| gearman      | *   | *   | *   |     |     |
| geoip        | *   | *   | *   |     |     |
| gmp          | *   | *   | *   | *   | *   |
| http         | *   | *   |     |     |     |
| igbinary     |     |     |     | *   | *   |
| imagick      | *   | *   | *   | *   | *   |
| imap         | *   | *   | *   | *   | *   |
| interbase    | *   | *   | *   | *   | *   |
| intl         | *   | *   | *   | *   | *   |
| json         |     |     | *   | *   | *   |
| ldap         | *   | *   | *   | *   | *   |
| mcrypt       | *   | *   | *   | *   | *   |
| memcache     | *   | *   | *   |     |     |
| memcached    | *   | *   | *   | *   | *   |
| mongo        | *   | *   | *   |     |     |
| mongodb      |     |     |     | *   | *   |
| msgpack      |     |     | *   | *   | *   |
| mssql        | *   | *   | *   |     |     |
| mysql        | *   | *   | *   |     |     |
| mysqli       | *   | *   | *   | *   | *   |
| mysqlnd      | *   | *   | *   |     |     |
| odbc         | *   | *   | *   | *   | *   |
| opcache      |     | *   | *   | *   | *   |
| pdo          | *   | *   | *   | *   | *   |
| pdo_dblib    | *   | *   | *   | *   | *   |
| pdo_firebird | *   | *   | *   | *   | *   |
| pdo_mysql    | *   | *   | *   | *   | *   |
| pdo_odbc     | *   | *   | *   | *   | *   |
| pdo_pgsql    | *   | *   | *   | *   | *   |
| pdo_sqlite   | *   | *   | *   | *   | *   |
| pecl-http    |     |     | *   |     |     |
| pgsql        | *   | *   | *   | *   | *   |
| pinba        | *   | *   | *   |     |     |
| propro       |     |     | *   |     |     |
| pspell       | *   | *   | *   | *   | *   |
| pthreads     |     |     |     |     | *   |
| raphf        |     |     | *   |     |     |
| readline     | *   | *   | *   | *   | *   |
| recode       | *   | *   | *   | *   | *   |
| redis        | *   | *   | *   | *   | *   |
| snmp         | *   | *   | *   | *   | *   |
| sockets      |     |     | *   | *   | *   |
| spplus       | *   | *   |     |     |     |
| sqlite3      | *   | *   | *   | *   | *   |
| ssh2         | *   | *   | *   |     |     |
| tidy         | *   | *   | *   | *   | *   |
| xcache       | *   | *   |     |     |     |
| xdebug       | *   | *   | *   | *   | *   |
| xhprof       | *   | *   | *   |     |     |
| xmlrpc       | *   | *   | *   | *   | *   |
| xsl          | *   | *   | *   | *   | *   |
| zendopcache  | *   |     |     |     |     |


> **note**
> You can check out the output of `ls /etc/php5/mods-available` to
> see the up-to-date complete list of extensions after you SSH into
> your environment. For PHP 7, use `ls /etc/php/*/mods-available`.

## Alternate start commands

PHP is most commonly run in a CGI mode, using PHP-FPM.  That is the default on Platform.sh.  However, you can also start alternative processes if desired, such as if you're running an Async PHP daemon, a thread-based worker process, etc.  To do so, simply specify an alternative start command in `platform.app.yaml`, similar to the following:

```yaml
web:
    commands:
        start: php run.php
    upstream:
            socket_family: tcp
            protocol: http
```

The above configuration will execute the `run.php` script in the application root when the container starts using the PHP-CLI SAPI, just before the deploy hook runs, but will *not* launch PHP-FPM.  It will also tell the front-controller (Nginx) to connect to your application via a TCP socket, which will be specified in the 'PORT' environment variable.

If not specified, the effective default start command varies by PHP version:

* On PHP 5.x, it's `/usr/sbin/php5-fpm`.
* On PHP 7.0, it's `/usr/sbin/php-fpm7.0`.
* On PHP 7.1, it's `/usr/sbin/php-fpm7.1-zts`.

While you can call it manually that is generally not necessary.  Note that PHP-FPM cannot run simultaneously along with another persistent process (such as ReactPHP or AmPHP).  If you need both they will have to run in separate containers.

## PHP Worker sizing hints

Platform.sh uses a heuristic to automatically set the number of workers of a PHP runtime based on the memory available in the container. This heuristic is based on assumptions about the memory necessary on average to process a request. You can tweak those assumptions if your application will typically use considerably more or less memory.  In most cases, however, you should not need to change them.

### The heuristic

The heuristic is based on three input parameters:

 * The memory available for the container, which depends on the size of the container (`S`, `M`, `L`, `XL`, `XXL`),
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

You can change them by using the `runtime.sizing_hints.reserved_memory` and `runtime.sizing_hints.request_memory` in your `.platform.app.yaml`. For example, if your application consumes on average `110 MB` of memory for a request (don't feel bad, we have seen many Drupal websites that do), use:

```
runtime:
    sizing_hints:
        request_memory: 110
```

### Measuring PHP worker memory usage

To see how much memory your PHP worker processes are using, you can open an
[SSH session](/development/ssh.md) and look at the PHP access log:

    less /var/log/php.access.log

In the fifth column, you'll see the peak memory usage that occurred while each
request was handled. The peak usage will probably vary between requests, but in
order to avoid the severe performance costs that come from swapping, your size
hint should be somewhere between the average and worst case memory usages that
you observe.


## Custom php.ini

You can also create and push a `php.ini` file that will be appended to the configuration maintained by Platform.sh.

In your repository, the `php.ini` file should be added to the root of the application (where your `.platform.app.yaml` file is).

For example, if you need to increase the PHP memory limit:

```
; php.ini
; Increase PHP memory limit
memory_limit = 256M
```

Another example is to set the timezone of the PHP runtime (though, the timezone settings of containers/services would remain in UTC):

```
; php.ini
; Set PHP runtime timezone
date.timezone = "Europe/Paris"
```

Environment-specific `php.ini` configuration directives can be provided via environment variables.  See the note in the [Environment variables](/development/variables.md#php-specific-variables) section.

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
