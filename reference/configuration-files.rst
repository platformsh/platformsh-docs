.. _configuration_files:

Configuration files
===================

The :term:`configuration files` are stored in Git and allow you to easily interact with Platform.sh. You can define and configure the services you want to deploy and use, the specific routes you need to serve your application...

You can find some examples for those configuration files on `Github <https://github.com/platformsh/platformsh-examples>`_.

Configure your application
--------------------------

Platform.sh exposes a ``.platform.app.yaml`` file which defines your :term:`application` and the way it will be built and deployed on Platform.sh.

.. note::
  The ``.platform.app.yaml`` is specific to your application. If you have multiple applications inside your Git repository, you need one ``.platform.app.yaml`` at the root of each application.

Here are the keys that you can define in your ``.platform.app.yaml``:

.. _name:

.. rubric:: Name

The ``name`` is the unique identifier of the :term:`application`. Platform.sh supports multiple applications within a project, so each application must have a **unique name** within a project.

.. _toolstack:

.. rubric:: Toolstack

The ``toolstack`` is used to build and run the project. It's in the form ``type[:subtype]``.

Possible values are:

* **php:drupal**
* **php:symfony**
* **nodejs**

.. _access:

.. rubric:: Access

The ``access`` define the user roles who can log in via SSH to the environments they have access to.

Possible values are:

* **ssh: admin**
* **ssh: contributor**
* **ssh: viewer**

.. code-block:: console
    
  # The access configuration.
  access:
    ssh: contributor

.. _relationships:

.. rubric:: Relationships

The ``relationships`` defines how services are mapped within your :term:`application`.

The left-hand side is the name of the relationship as it will be exposed to the :term:`application` in the *PLATFORM_RELATIONSHIPS* environment variable. The right-hand side is in the form ``<service name>:<endpoint name>``.

.. code-block:: console
  
  # The relationships of the application with services or other applications.
  relationships:
    database: "mysql:mysql"
    solr: "solr:solr"

Possible varialbles are:

* **database: "mysql:mysql"**
* **solr: "solr:solr"**
* **redis: "redis:redis"**

.. _web:

.. rubric:: Web

The ``web`` defines how the :term:`application` is exposed to the web (in HTTP).

It has a few sub-keys which are:

* **document_root**: The path relative to the root of the application that is exposed on the web. Typically ``/public`` or ``/web``.
* **passthru**:  The URL that is used in case of a 404 (*which is the equivalent of the rewrite rules in Drupal*). Typically ``/index.php`` or ``/app.php``.
* **whitelist**: Extend the whitelisted extensions. It should be formatted as an array: [ "html" ].

Contrary to standard ``.htaccess`` approaches which accept a **blacklist** and allow everything to be accessed except this specific list of extensions, we accept a **whitelist** and for everything that belongs to the code we only allow a specific list of extensions to be accessed from the web.

Everything that is not in the whitelist doesn't trigger a 403, but instead triggers a 404 and is ``passed thru`` to the URL that you configured: typically ``/index.php``.

.. note::
  To extend the whitelisted extensions, you should override the default listing and only keep the extensions you need: [ "css", "js", "gif", "jpeg", "jpg", "png", "tiff", "wbmp", "ico", "jng", "bmp", "svgz", "midi", "mpega", "mp2", "mp3", "m4a", "ra", "weba", "3gpp", "mp4", "mpeg", "mpe", "ogv", "mov", "webm", "flv", "mng", "asx", "asf", "wmv", "avi", "ogx", "swf", "jar", "ttf", "eot", "woff", "otf", "txt" ].

.. _disk:

.. rubric:: Disk

The ``disk`` defines the size of the persistent disk size of the :term:`application` in MB.

.. note::
  The minimal recommended disk size is 256MB. If you see the error **UserError: Error building the project: Disk size may not be smaller than 128MB**, increase the size to 256MB.

.. _mounts:

.. rubric:: Mounts

The ``mounts`` is an object whose keys are paths relative to the root of the application. It's in the form ``volume_id[/subpath]``.

For example with :term:`Drupal`, you'll want your ``sites/default/files`` to be mounted under a shared resource which is writable:

.. code-block:: console
  
  # The mounts that will be performed when the package is deployed.
  mounts:
    "/public/sites/default/files": "shared:files/files"

.. note::
   The ``shared`` means that the volume is shared between your applications inside an environment. The ``disk`` key defines the size available for that ``shared`` volume.

.. _deployment_hooks:

.. rubric:: Hooks

The ``hooks`` (also called: :term:`deployment hooks`) let you define shell commands to run during the deployment process.

They can be executed at various points in the lifecycle of the application (build/deploy).

Possible hooks are:

* **build**: We run build hooks before your application has been packaged. No other services are accessible at this time since the application has not been deployed yet.
* **deploy**: We run deploy hooks after your application has been deployed and started. You can access other services at this stage (MySQL, Solr, Redis...).

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

The ``crons`` is an object describing processes that are triggered on a schedule.

It has a few sub-keys which are:

* **spec**: The cron specification. For example:  ``*/20 * * * *``.
* **cmd**: The command that is executed, for example `cd public ; drush core-cron``

.. seealso::
  You can find some good examples of `.platform.app.yaml`` files for various toolstacks:

  * `.platform.app.yaml default for Symfony <https://github.com/platformsh/platformsh-examples/blob/symfony/standard/.platform.app.yaml>`_
  * `.platform.app.yaml default for Drupal <https://github.com/platformsh/platform-drupal/blob/master/.platform.app.yaml>`_

.. _services:

Configure your services
-----------------------

Platform.sh allows you to completely define and configure the topology and services you want to use on your project.

The topology is stored into a ``services.yaml`` file which should be added inside the ``.platform`` folder at the root of your Git repository.

If you don't have a ``.platform`` folder, you need to create one:

.. code-block:: console
  
  $ mkdir .platform

Here is an example of a ``services.yaml`` file:

.. code-block:: console

  mysql:
    type: mysql
    disk: 2048

  solr:
    type: solr
    disk: 1024

.. seealso::

  * `services.yaml for Symfony <https://github.com/platformsh/platformsh-examples/blob/symfony/standard-full/.platform/services.yaml>`_
  * `services.yaml for Drupal <https://github.com/platformsh/platform-drupal/blob/master/.platform/services.yaml>`_

.. _routes:

Configure your routes
---------------------

Platform.sh allows you to define the routes that will serve your environments.

A route describes how an incoming URL is going to be processed by Platform.sh.
The routes are stored into a ``routes.yaml`` file which should be added inside the ``.platform`` folder at the root of your Git repository.

If you don't have a ``.platform`` folder, you need to create one:

.. code-block:: console
  
  $ mkdir .platform

Here is an example of a ``routes.yaml`` file:

.. code-block:: console
  
  "http://{default}/":
    type: upstream
    upstream: "php:php"
  "http://www.{default}/":
    type: redirect
    to: "http://{default}/"

.. seealso::

  * `routes.yaml for Symfony <https://github.com/platformsh/platformsh-examples/blob/symfony/standard-full/.platform/routes.yaml>`_
  * `routes.yaml for Drupal <https://github.com/platformsh/platform-drupal/blob/master/.platform/routes.yaml>`_
