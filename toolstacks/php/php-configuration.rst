Configuration
=============

.. _php_configuration:

Platform.sh supports custom PHP configurations.

.. _php_extension:

PHP extensions
--------------

You can define the PHP extensions you want to enable or disable:

.. code-block:: yaml

    # .platform.app.yaml
    runtime:
        extensions:
            - http
            - redis
            - ssh2
        disabled_extensions:
            - sqlite3



The following extensions are enabled by default: *pdo, mysql, mysqli, pdo_mysql, sqlite3, gd, curl, intl, mcrypt and zendopcache*. You can disable those by adding them to the ``disabled_extensions`` list.

In addition, you can enable the following extensions: *apc, apcu, blackfire, blackfire.psh-tmpl, enchant, gearman, geoip, gmp, http, imagick, imap, ldap, memcache, memcached, mongo, pdo_pgsql, pdo_sqlite, pgsql, pinba, pspell, recode, redis, snmp, spplus, ssh2, tidy, xcache, xdebug, xhprof, xmlrpc and xsl*.

.. note::

  This list might not be fully up to date. For the complete list, check the output of ``ls /etc/php5/mods-available`` after you SSH into your environment.

.. seealso::
    * :ref:`application_configuration`

.. _php_ini:

Use your own php.ini
--------------------

You can also create and push a ``php.ini`` file that will be appended to the configuration maintained by Platform.sh.

In your repository, the ``php.ini`` file should be added to the root of the application (normally the repository root).

For example, if you need to increase the PHP memory limit:

.. code-block:: php

    # php.ini
    ; Increase PHP memory limit
    memory_limit = 256M

After pushing your file, you can check that the custom PHP configuration has been added to your environment by logging in via SSH and type:

.. code-block:: console

    web@kjh43kbobssae-master--php:~$ cat /etc/php5/fpm/php.ini

    ; =============== Custom configuration from `/app/php.ini`
    ; Increase PHP memory limit
    memory_limit = 256M

----

.. Warning::
    We do not limit what you can put in your ``php.ini`` file, but many settings can break your application. This is a facility for advanced users.
