# PHP7 Beta Support

PHP7 is the next major version of PHP. It not only brings new language features
but it also sports huge performance boosts over the 5.x generation. On many
workloads it is on-par with HHVM. 

Our performance tests with Drupal 8.0 and PHP 7.0 yielded 2X performance gains
compared with PHP 5.6!

To your joy you may also discover it has a much lower memory footprint than
both PHP 5.6 and HHVM so in some cases it may outperform both by a margin.

But this PHP 7.0 is not yet released. So this is beta level support. You may
get into trouble... and we may not be able to help. Using this in production 
is a risk, we can not recommend, until we announce official stable support.

>  ** BETA MEANS BETA **
>Many extensions have not yet been ported to to PHP 7.0 so on Platform.sh you 
>will find the following extensions available: php-curl, php-gd, php-imap, 
>php-interbase, php-intl, php-ldap, php-mysql, php-opcache, php-pgsql, 
>php-pspell, php-recode, php-snmp, php-sqlite3, php-sybase, php-tidy 
>
>The following extensions are **not** available yet (and might not be for some 
>time) :  php-apcu, php-enchant, php-gearman, php-geoip, php-gmp, php-imagick, 
>php-mcrypt, php-memcache, php-memcached, php-mongo, php-msgpack, php-odbc, 
>php-pecl-http, php-propro, php-raphf, php-readline, php-redis, php-ssh2, 
>php-xdebug, php-xhprof, php-xmlrpc, php-xsl

For some of those there are pure PHP replacements (such as Predis for redis) 
some do not.

To switch your project to php7, put `php:7.0` instead of `php` or `php:5.6` in 
the `type` property of your `.platform.app.yaml`.

Example:

```yaml
    name: "fastapp"
    type: php:7.0
    build:
        flavor: composer
    web:
      document_root: "/"
      passthru: "/index.php"
    disk: 2048
```
