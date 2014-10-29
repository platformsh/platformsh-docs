.. _configuration_files:

Configuration files
===================

The :term:`configuration files` are stored in Git and allow you to easily interact with Platform.sh. You can define and configure the services you want to deploy and use, the specific routes you need to serve your application...

You can find default configuration files in the `public Platform.sh repositories on Github <https://github.com/platformsh/>`_.

.platform.app.yaml, an Application Configuration File
-----------------------------------------------------

.. note::
  The ``.platform.app.yaml`` needs to be committed at the root of your :term:`application` folder.

The ``.platform.app.yaml`` file defines your :term:`application` and the way it'll be built and deployed on Platform.sh.

.. seealso::
	* `.platform.app.yaml default for Symfony <https://github.com/platformsh/platformsh-examples/blob/symfony/standard/.platform.app.yaml>`_
	* `.platform.app.yaml default for Drupal <https://github.com/platformsh/platform-drupal/blob/master/.platform.app.yaml>`_

Here are the keys that you can define in your ``.platform.app.yaml``:

.. rubric:: Name

The name of the :term:`application`. Must be unique within a project.

.. _toolstack:

.. rubric:: Toolstack

The :term:`toolstack` used to build the :term:`application`.

Possible values are:

* php:drupal
* php:symfony

.. _access:

.. rubric:: Access

You can define the user roles who can login via SSH to the environments they've access to.

Possible values are:

* ssh: admin
* ssh: contributor
* ssh: viewer

.. code-block:: console
    
    # The access configuration.
    access:
        ssh: contributor

.. _relationships:

.. rubric:: Relationships

The :term:`relationships` of the :term:`application` with services or other applications.

The left-hand side is the name of the relationship as it will be exposed to the :term:`application` in the ``PLATFORM_RELATIONSHIPS`` variable. The right-hand side is in the form ``<service name>:<endpoint name>``.

Possible varialbles are:

* database: "mysql:mysql"
* solr: "solr:solr"
* redis: "redis:redis"

.. rubric:: Web

The configuration of the :term:`application` when it is exposed to the web.

Possible variables are:

* ``document_root``: The path of your application root.
* ``passthru``:  Should be relative to your ``document_root``.
* ``whitelist``: Extend the whitelisted extensions. It should be formatted as an array: [ "html" ].

.. note::
  To extend the whitelisted extensions, you should override the default listing and only keep the extensions you need: [ "css", "js", "gif", "jpeg", "jpg", "png", "tiff", "wbmp", "ico", "jng", "bmp", "svgz", "midi", "mpega", "mp2", "mp3", "m4a", "ra", "weba", "3gpp", "mp4", "mpeg", "mpe", "ogv", "mov", "webm", "flv", "mng", "asx", "asf", "wmv", "avi", "ogx", "swf", "jar", "ttf", "eot", "woff", "otf", "txt" ].

.. rubric:: Disk

The size of the persistent disk of the :term:`application` in MB.

.. _mounts:

.. rubric:: Mounts

The mounts that will be performed when the :term:`application` is deployed.

For example with :term:`Drupal`, you'll want your ``sites/default/files`` to be mounted under a shared resource which is writable.

.. _deployment_hooks:

.. rubric:: Hooks

The ``hooks`` (also called: :term:`deployment hooks`) let you define shell commands to run during the deployment process.

They can be executed at various points in the lifecycle of the application (build/deploy).

Possible hooks are:

* **build**: We run build hook before your application has been packaged. No other services are accessible at this time since the application has not been deployed yet.
* **deploy**: We run deploy hook after your application has been deployed and started. You can access other services at this stage (MySQL, Solr, Redis...).

After a Git push, you can see the results of the deployment hooks in the ``/var/log/deploy.log`` file when logging to the environment via SSH. It contains the log of the execution of the deployment hook. For example:

.. code-block:: console

    [2014-07-03 10:03:51.100476] Launching hook 'cd /app/public ; drush -y updatedb'.

    My_custom_profile  7001  Update 7001: Enable the Platform module.
    Do you wish to run all pending updates? (y/n): y
    Performed update: my_custom_profile_update_7001
    'all' cache was cleared.
    Finished performing updates.

.. _crons:

.. rubric:: Crons

The configuration of scheduled execution.

services.yaml, a Topology Configuration File
--------------------------------------------

.. note::
  Find the ``services.yaml`` file in the ``.platform`` folder at the root of your Git repository 
  eg. repository/.platform/services.yaml

Platform allows you to completely define and configure the topology and services you want to use at the :term:`environment` level.

* `services.yaml default for Symfony <https://github.com/platformsh/platformsh-examples/blob/symfony/standard/.platform/services.yaml>`_
* `services.yaml default for Drupal <https://github.com/platformsh/platform-drupal/blob/master/.platform/services.yaml>`_


routes.yaml, an Environment Configuration File
----------------------------------------------

.. note::
  Find the ``routes.yaml`` file in the ``.platform`` folder at the root of your Git repository
  eg. 1237h7rtyh123/repository/.platform/routes.yaml

Platform allows you to define the routes that will serve your project at the :term:`environment` level.

* `routes.yaml default for Symfony <https://github.com/platformsh/platformsh-examples/blob/symfony/standard/.platform/routes.yaml>`_
* `routes.yaml default for Drupal <https://github.com/platformsh/platform-drupal/blob/master/.platform/routes.yaml>`_

https://github.com/platformsh/platformsh-examples/blob/symfony/standard/.platform/routes.yaml

.. todo::
    Need to document the possible values.

last update: |today|
