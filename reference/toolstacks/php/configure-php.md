# Configuring PHP

## PHP version

You can choose which version of PHP you want to run in your `.platform.app.yaml` file:

```yaml
name: myphpapp
type: php:5.6
```

### Supported versions

* 5.4 (default)
* 5.5
* 5.6
* 7.0

> **note**
> You can also use HHVM.

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
| apc          | *   | *   | *   | *   |
| apcu         | *   |     |     |     |
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
