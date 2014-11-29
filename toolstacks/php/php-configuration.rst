Configuration
=============

.. _php_configuration:

Configure PHP
-------------

Platform.sh supports custom PHP configurations. 

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

In addition, you can enable the following extensions: *enchant, gearman, geoip, gmp, http, imagick, imap, ldap, pgsql, pdo_pgsql, pinba, pspell, recode, redis, snmp, spplus, ssh2, tidy, xdebug, xmlrpc and xsl*.

Use your own php.ini
--------------------

You can also provide a php.ini file in your project, for additional configuration tweaks.

You can also provide a php.ini file that will be appended to the configuration maintained by Platform.sh. This file needs to be at the root of the application at the end of the build process, so depending on your build process, you might have to move it in place in a build hook.


.. Note:: 
    We do not limit what you can put in your ``php.ini`` file, but many settings can break your application. This is a facility for advanced users.






Many hosting solutions are adding an additional layer (Varnish...) to handle caching. Platform.sh allows you to enable HTTP caching right at the web server level. 

If you disable caching, Platform.sh serves the files that are stored in the application directly. For example with Drupal, this means that all HTTP requests will bootstrap Drupal and query the database. When the cache is enabled, if the page has been stored in the Nginx cache, it won't access Drupal.

Cache is enabled by default in your ``.platform/routes.yaml`` file. You can either whitelist the header that participate in the cache key:

.. code-block:: yaml

    http://{default}/:
        type: upstream
        upstream: php:php
        cache:
            enabled: true
            headers: [ "Accept", "Accept-Language", "X-Language-Locale" ]

Or simply disable caching on the route:

.. code-block:: yaml

    http://{default}/:
        type: upstream
        upstream: php:php
        cache:
            enabled: false

You can see this in action like this:

.. code-block:: console

    $ curl -I https://coupledehuit.fr/

    HTTP/1.1 200 OK
    ...
    X-Drupal-Cache: HIT
    ...
    Cache-Control: public, max-age=86400
    Last-Modified: Thu, 16 Oct 2014 10:25:30 +0000
    Expires: Sun, 19 Nov 1978 05:00:00 GMT
    ...
    X-Platform-Cache: HIT

.. seealso::
    * :ref:`routes_configuration`