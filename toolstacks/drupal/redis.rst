.. _drupal_redis:

Using Redis with Drupal 7.x
===========================

Requirements
------------

You will need to add the `Redis <https://www.drupal.org/project/redis>`_ module and `Predis <http://github.com/nrk/predis>`_ library to your project.

If you are using a make file, you can add those lines to your ``project.make``:

.. code-block:: ini

   projects[redis][type] = module
   projects[redis][download][type] = git
   projects[redis][download][branch] = 7.x-2.11

   libraries[predis][download][type] = get
   libraries[predis][download][url] = http://github.com/nrk/predis/archive/v0.8.7.tar.gz
   libraries[predis][directory_name] = predis
   libraries[predis][destination] = libraries

.. seealso::
  * :ref:`drush_make_files`
   
Configuration
-------------

To make use of the Redis cache you will need to set some Drupal variables. You can either do this in your ``settings.php`` file or by setting Platform Variables directly via the UI.

.. seealso::

   * `Redis README.txt <http://cgit.drupalcode.org/redis/tree/README.txt>`_
   * :ref:`environment_variables`
   
Via the Web UI
^^^^^^^^^^^^^^

The advantage of using :term:`environment variables` is that these won't be used in your local build where you might not have Redis installed.

Add the following :term:`environment variables` using the Platform UI.

``drupal:cache_backends``

.. code-block:: console

   [
      "sites/all/modules/redis/redis.autoload.inc"
   ]
   
.. note::
   Remember to tick the JSON Value box.

.. note::
   Use the actual path to your Redis module in case it is in a different location. For example: ``sites/all/modules/contrib/redis``.

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

.. note::
   Currently, you need to commit some code to rebuild your environment so that the new variables are properly added to your ``settings.local.php``. This will be fixed soon.
   
Via settings.php
^^^^^^^^^^^^^^^^

If you prefer to commit these variables directly to your ``settings.php``, here are the lines to add:

.. code-block:: php

   $conf['redis_client_interface'] = 'Predis';
   $conf['redis_client_host']      = 'redis.internal';
   $conf['lock_inc']               = 'sites/all/modules/redis/redis.lock.inc';
   $conf['path_inc']               = 'sites/all/modules/redis/redis.path.inc';
   $conf['cache_backends'][]       = 'sites/all/modules/redis/redis.autoload.inc';
   $conf['cache_default_class']    = 'Redis_Cache';

.. seealso::
   * :ref:`custom_settings_php`