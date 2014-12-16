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

The following extensions are enabled by default: *pdo, mysql, mysqli, pdo_mysql, sqlite3, pdo_sqlite3, gd, curl, intl, mcrypt and zendopcache*. You can disable those by adding them to the ``disabled_extensions`` list.

In addition, you can enable the following extensions: *apc, apcu, enchant, gearman, geoip, gmp, http, imagick, imap, ldap, memcache, memcached, mongo, pdo_pgsql, pgsql, pinba, pspell, recode, redis, snmp, spplus, ssh2, tidy, xcache, xdebug, xhprof, xmlrpc, xsl*.

.. seealso::
    * :ref:`application_configuration`

.. _php_ini:

Use your own php.ini
--------------------

You can also push a ``php.ini`` file that will be appended to the configuration maintained by Platform.sh. 

For example if you need to increase the PHP memory limit:

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

The ``php.ini`` file needs to be at the root of the application at the end of the build process. So depending on your build process, you might have to move it in place in a build hook. Example with Drupal if you have a ``project.make`` file:

.. code-block:: yaml
    
    # .platform.app.yaml
    hooks:
        build: |
            set -e
            mv public/sites/default/php.ini php.ini

.. Warning:: 
    We do not limit what you can put in your ``php.ini`` file, but many settings can break your application. This is a facility for advanced users.
