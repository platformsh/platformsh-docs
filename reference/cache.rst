Cache
=====

.. _cache_http:

Enable HTTP caching
-------------------

Many hosting solutions are adding an additional layer (Varnish...) to handle caching. Platform.sh allows you to enable HTTP caching right at the web server level. 

If you disable caching, Platform.sh serves the files that are stored in the application directly. For example with Drupal, this means that all HTTP requests will bootstrap Drupal and query the database. When the cache is enabled, if the page has been stored in the Nginx cache, it won't access Drupal.

Cache is enabled by default in your ``.platform/routes.yaml`` file. You can either whitelist the header that participate in the cache key:

.. code-block:: console

    http://{default}/:
        type: upstream
        upstream: php:php
        cache:
            enabled: true
            headers: [ "Accept", "Accept-Language", "X-Language-Locale" ]

Or simply disable caching on the route:

.. code-block:: console

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
    * :ref:`routes`