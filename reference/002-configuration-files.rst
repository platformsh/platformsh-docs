Configuration files
===================

The :term:`configuration files` are stored in Git and allow you to easily interact with Platform. You can define and configure the services you want to use, the specific routes you need on your project...

Simply create a ``.platform`` folder at the root of you Git repository and put your :term:`configuration files` in it.


Services
--------

.. warning::
   * Configuration of the Services Grid is not fully supported, yet. Content and naming may change.

Platform allows you to completely define and configure the topology and services you want to use at the :term:`environment` level.

Here is an example of the default ``services.yaml`` file:

.. code-block::
    console

    php:
      type: php
      size: M
      disk: 2048
      access:
        "ssh": "admin"
      relationships:
        "database": "mysql:mysql"
        "solr": "solr:solr"
        "redis": "redis:redis"

    mysql:
      type: mysql
      size: M
      disk: 2048

    redis:
      type: redis
      size: M
      
    solr:
      type: solr
      size: M
      disk: 1024

Routes
------

Platform allows you to define the routes that will serve your project at the :term:`environment` level.

Here is an example of the default ``routes.yaml`` file:

.. code-block::
    console

    http://www.{default}/:
      to: http://{default}/
      type: redirect
    http://{default}/:
      cache:
        enabled: true
      rewrite:
        type: drupal
      ssi:
        enabled: true
      type: upstream
      upstream: php:php
