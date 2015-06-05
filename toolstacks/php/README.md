# Configuration

Platform.sh supports custom PHP configurations.

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

The following extensions are enabled by default: *pdo, mysql, mysqli,
pdo\_mysql, sqlite3, gd, curl, intl, mcrypt and zendopcache*. You can
disable those by adding them to the `disabled_extensions` list.

In addition, you can enable the following extensions: *apc, apcu,
blackfire, blackfire.psh-tmpl, enchant, gearman, geoip, gmp, http,
imagick, imap, ldap, memcache, memcached, mongo, pdo\_pgsql,
pdo\_sqlite, pgsql, pinba, pspell, recode, redis, snmp, spplus, ssh2,
tidy, xcache, xdebug, xhprof, xmlrpc and xsl*.

> **note**
> This list might not be fully up to date. For the complete list, check the output of `ls /etc/php5/mods-available` after you SSH into your environment.

## Use your own php.ini

You can also create and push a `php.ini` file that will be appended to
the configuration maintained by Platform.sh.

In your repository, the `php.ini` file should be added to the root of
the application (normally the repository root).

For example, if you need to increase the PHP memory limit:

```php
# php.ini
; Increase PHP memory limit
memory_limit = 256M
```

After pushing your file, you can check that the custom PHP configuration
has been added to your environment by logging in via SSH and type:

```bash
web@kjh43kbobssae-master--php:~$ cat /etc/php5/fpm/php.ini

; =============== Custom configuration from `/app/php.ini`
; Increase PHP memory limit
memory_limit = 256M
```

------------------------------------------------------------------------

> **warning**
>
> We do not limit what you can put in your `php.ini` file, but many
> settings can break your application. This is a facility for advanced
> users.

