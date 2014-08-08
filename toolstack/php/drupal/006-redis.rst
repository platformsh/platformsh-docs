.. _drupal_redis:

Using Redis with Drupal 7.x
===========================

Module and Library
------------------

You will need to add the module and the library to your make file to make use of Redis

.. code-block:: ini

   projects[redis][type] = module
   projects[redis][download][type] = git
   projects[redis][download][branch] = 7.x-2.11

   libraries[predis][download][type] = get
   libraries[predis][download][url] = http://github.com/nrk/predis/archive/v0.8.5.tar.gz
   libraries[predis][directory_name] = predis
   libraries[predis][destination] = libraries
   
Variables
---------

To make use of the Redis cache you will need to set some Drupal Variables. You can either do this in your settings.php file or using the Platform Variables.

.. seealso::
   * `Module README.txt <http://cgit.drupalcode.org/redis/tree/README.txt>`_
   
Platform Variables
^^^^^^^^^^^^^^^^^^

The advantage to using platform variables is that these won't be used on your local build using Platform CLI where you might not have Redis installed.

``drupal:cache_backends``

.. code-block:: console

   [
      "sites/all/modules/redis/redis.autoload.inc",
   ]
   
Remember to tick the JSON Value box

``drupal:lock_inc``

.. code-block:: console

   sites/all/modules/redis/redis.lock.inc
   
``drupal:path_inc``

.. code-block:: console

   sites/all/modules/redis/redis.path.inc

``drupal:redis_client_host``

.. code-block:: console

   redis.internal
   
``drupal:redis_client_interface``

.. code-block:: console

   Predis
   
``drupal:cache_default_class``

.. code-block:: console

   Redis_Cache
   
Settings.php
^^^^^^^^^^^^

.. code-block:: php

   $conf['redis_client_interface'] = 'Predis';
   $conf['redis_client_host']      = 'redis.internal';
   $conf['lock_inc']               = 'sites/all/modules/redis/redis.lock.inc';
   $conf['path_inc']               = 'sites/all/modules/redis/redis.path.inc';
   $conf['cache_backends'][]       = 'sites/all/modules/redis/redis.autoload.inc';
   $conf['cache_default_class']    = 'Redis_Cache';

Adding Entity Cache and Auth Cache
==================================

Adding both these modules can further improve your perfomance

Modules
-------

.. code-block:: ini

   projects[entitycache][version] = 1.2
   projects[commerce_entitycache][version] = 1.1
   projects[authcache][version] = 2.0-beta3
   projects[commerce_authcache][version] = 1.x-dev

Platform Variables
^^^^^^^^^^^^^^^^^^

``drupal:cache_backends``

Add the cache backends for Authcache

.. code-block:: console

   [
      "sites/all/modules/redis/redis.autoload.inc",
      "sites/all/modules/authcache/authcache.cache.inc",
      "sites/all/modules/authcache/modules/authcache_builtin/authcache_builtin.cache.inc"
   ]

Settings.php
^^^^^^^^^^^^

.. code-block:: php

   $conf['cache_backends'][] = 'sites/all/modules/authcache/authcache.cache.inc';
   $conf['cache_backends'][] = 'sites/all/modules/authcache/modules/authcache_builtin/authcache_builtin.cache.inc';
   

