.. _drupal_cache:

Adding Entity Cache and Auth Cache
==================================

You can further improve the perfomances of your site by adding the `Entity Cache <https://www.drupal.org/project/entitycache>`_ and `Auth Cache <https://www.drupal.org/project/authcache>`_ modules to your project.

Requirements
------------

If you are using a make file, you can add those lines to your ``project.make``:

.. code-block:: ini

   projects[entitycache][version] = 1.2
   projects[authcache][version] = 2.0-beta3

If you're project is using Drupal Commerce, you can also add the `Commerce Entity Cache <https://www.drupal.org/project/commerce_entitycache>`_ and `Commerce Auth Cache <https://www.drupal.org/project/commerce_authcache>`_ modules:

.. code-block:: ini

   projects[commerce_entitycache][version] = 1.1
   projects[commerce_authcache][version] = 1.x-dev

.. seealso::
  * :ref:`drush_make`

Configuration
-------------

Variables
^^^^^^^^^

The advantage to using :term:`environment variables` is that these won't be used on your local build using Platform CLI where you might not have Redis installed.

Add the following :term:`environment variables` on Platform UI.

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

If you prefer commit those variables to your ``settings.php``, here are the lines to add:

.. code-block:: php

   $conf['cache_backends'][] = 'sites/all/modules/authcache/authcache.cache.inc';
   $conf['cache_backends'][] = 'sites/all/modules/authcache/modules/authcache_builtin/authcache_builtin.cache.inc';
