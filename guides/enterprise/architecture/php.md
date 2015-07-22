# PHP

Platform.sh supports PHP 5.4, 5.5 and 5.6, the APC and ZO+ opcode caches, and all major PHP extensions, rewriting, and mapping. 

## Custom PHP configurations
Platform.sh now supports custom PHP configurations. You can specify this configuration directly in the.platform.app.yaml file, and you can also provide a php.ini file in your project, for additional configuration tweaks.
In your .platform.app.yaml configuration file, you can now add a runtime key like:

```runtime:
    extensions:
        - http
        - ssh2
    disabled_extensions:
        - sqlite3
```

Platform.sh comes with pdo, mysql, mysqli, pdo_mysql, sqlite3, pdo_sqlite3, gd, curl, intl, mcrypt andzendopcache extensions enabled by default. You can disable those by adding them to thedisabled_extensions list.
In addition, we ship with enchant, gearman, geoip, gmp, http, imagick, imap, ldap, pgsql, pdo_pgsql,pinba, pspell, recode, redis, snmp, spplus, ssh2, tidy, xdebug, xmlrpc and xsl that you can enable.
You can also provide a php.ini file that will be appended to the configuration maintained by Platform.sh. This file needs to be at the root of the application at the end of the build process, so depending on your build process, you might have to move it in place in a build hook.

## Unsupported extensions
The following extensions are currently unsupported on Platform.sh
wkhtmltopdf (https://github.com/wkhtmltopdf/wkhtmltopdf)