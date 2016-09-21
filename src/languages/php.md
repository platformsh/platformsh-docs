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
* sqlite3
* gd
* curl
* intl
* mcrypt
* zendopcache (5.4 only) / opcache (5.5 and later)

You can disable those by adding them to the `disabled_extensions` list.

This is the complete list of extensions that can be enabled:

| Extension    | 5.4 | 5.5 | 5.6 | 7.0 |
|--------------|-----|-----|-----|-----|
| apc          | *   |     |     |     |
| apcu         |     | *   | *   | *   |
| apcu_bc      |     |     |     | *   |
| blackfire    | *   | *   | *   | *   |
| bz2          |     |     |     | *   |
| curl         | *   | *   | *   | *   |
| enchant      | *   | *   | *   | *   |
| gd           | *   | *   | *   | *   |
| gearman      | *   | *   | *   |     |
| geoip        | *   | *   | *   |     |
| gmp          | *   | *   | *   | *   |
| http         | *   | *   |     |     |
| igbinary     |     |     |     | *   |
| imagick      | *   | *   | *   | *   |
| imap         | *   | *   | *   | *   |
| interbase    | *   | *   | *   | *   |
| intl         | *   | *   | *   | *   |
| json         |     |     | *   | *   |
| ldap         | *   | *   | *   | *   |
| mcrypt       | *   | *   | *   | *   |
| memcache     | *   | *   | *   |     |
| memcached    | *   | *   | *   | *   |
| mongo        | *   | *   | *   |     |
| mongodb      |     |     |     | *   |
| msgpack      |     |     | *   | *   |
| mssql        | *   | *   | *   |     |
| mysql        | *   | *   | *   |     |
| mysqli       | *   | *   | *   | *   |
| mysqlnd      | *   | *   | *   |     |
| odbc         | *   | *   | *   | *   |
| opcache      |     | *   | *   | *   |
| pdo          | *   | *   | *   | *   |
| pdo_dblib    | *   | *   | *   | *   |
| pdo_firebird | *   | *   | *   | *   |
| pdo_mysql    | *   | *   | *   | *   |
| pdo_odbc     | *   | *   | *   | *   |
| pdo_pgsql    | *   | *   | *   | *   |
| pdo_sqlite   | *   | *   | *   | *   |
| pecl-http    |     |     | *   |     |
| pgsql        | *   | *   | *   | *   |
| pinba        | *   | *   | *   |     |
| propro       |     |     | *   |     |
| pspell       | *   | *   | *   | *   |
| raphf        |     |     | *   |     |
| readline     | *   | *   | *   | *   |
| recode       | *   | *   | *   | *   |
| redis        | *   | *   | *   | *   |
| snmp         | *   | *   | *   | *   |
| spplus       | *   | *   |     |     |
| sqlite3      | *   | *   | *   | *   |
| ssh2         | *   | *   | *   |     |
| tidy         | *   | *   | *   | *   |
| xcache       | *   | *   |     |     |
| xdebug       | *   | *   | *   | *   |
| xhprof       | *   | *   | *   |     |
| xmlrpc       | *   | *   | *   | *   |
| xsl          | *   | *   | *   | *   |
| zendopcache  | *   |     |     |     |


> **note**
> You can check out the output of `ls /etc/php5/mods-available` to
> see the up-to-date complete list of extensions after you SSH into
> your environment. For PHP 7, use `ls /etc/php/mods-available`.


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

You can also create and push a `php.ini` file that will be appended to
the configuration maintained by Platform.sh.

In your repository, the `php.ini` file should be added to the root of
the application (normally the repository root).

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

After pushing your file, you can check that the custom PHP configuration
has been added to your environment by logging in via SSH and type:

```
web@kjh43kbobssae-master--php:~$ cat /etc/php5/fpm/php.ini

; =============== Custom configuration from `/app/php.ini`
; Increase PHP memory limit
memory_limit = 256M

; Set PHP runtime timezone
date.timezone = "Europe/Paris"
```

------------------------------------------------------------------------

> **warning**
>
> We do not limit what you can put in your `php.ini` file, but many
> settings can break your application. This is a facility for advanced
> users.
