.. _configuration_files:

Configuration files
===================

The :term:`configuration files` are stored in Git and allow you to easily interact with Platform. You can define and configure the services you want to use, the specific routes you need on your project...

Application
-----------

.. note::
  The ``.platform.app.yaml`` file should be located at the root of your application folder.

Your :term:`application` topology is defined into a file called ``.platform.app.yaml``.

A sample ``.platform.app.yaml`` file would look like this:

.. code-block::
    console

    toolstack: "php:drupal"

    web:
        document_root: "/"
        passthru: "/index.php"

    mounts:
        "/public/sites/default/files": "shared:files/files"
        "/tmp": "shared:files/tmp"
        "/private": "shared:files/private"

    crons:
        drupal:
            spec: "*/20 * * * *"
            cmd: "drush core-cron"

    hooks:
        deploy: "cd /app/public ; drush -y updatedb"

.. rubric:: Toolstack

The ``Toolstack`` defines what and how Platform will deploy your application.

The possible values are:

* php:drupal
* php:symfony

.. rubric:: Web

The ``Web`` defines where your :term:`application` is being deployed. This allow you to have multiple application inside your :term:`project`.

The ``passthru`` is relative to the ``document_root`` variable.

.. rubric:: Mounts

The ``Mounts`` define how to mount your folder when your application is being deployed. 

For example with Drupal, you'll want your `sites/default/files`` to be mounted under a shared resource which is writable.

.. rubric:: Crons

The ``Crons`` define when to run crons. 

.. _deployment_hooks:

.. rubric:: Hooks

The ``hooks`` (also called: :term:`deployment hooks`) define the command you want to run during a deployment process.

The possible values are:

* deploy
* build

After a push, you can see the results of the deployment hooks in the ``/var/log/deploy.log`` file when logging to the environment via SSH. It contains the log of the execution of the deployment hook. For example:

.. code-block::
    console

    [2014-07-03 10:03:51.100476] Launching hook 'cd /app/public ; drush -y updatedb'.

    My_custom_profile  7001  Update 7001: Enable the Platform module.
    Do you wish to run all pending updates? (y/n): y
    Performed update: my_custom_profile_update_7001
    'all' cache was cleared.
    Finished performing updates.

Services
--------

.. note::
  The ``services.yaml`` file should be included into a ``.platform`` folder at the root of you Git repository.

.. warning::
   * Configuration of the Services Grid is not fully supported, yet. Content and naming may change.

Platform allows you to completely define and configure the topology and services you want to use at the :term:`environment` level.

A sample ``services.yaml`` file would look like this:

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

.. note::
  The ``services.yaml`` file should be included into a ``.platform`` folder at the root of you Git repository.

Platform allows you to define the routes that will serve your project at the :term:`environment` level.

A sample ``routes.yaml`` file would look like this:

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
