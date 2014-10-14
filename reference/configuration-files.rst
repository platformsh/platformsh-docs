.. _configuration_files:

Configuration files
===================

The :term:`configuration files` are stored in Git and allow you to easily interact with Platform. You can define and configure the services you want to use, the specific routes you need on your project...

Default configuration files can be found in the `public Platform.sh repositories <https://github.com/platformsh/>`_.


.platform.app.yaml, an Application Configuration File
-----------------------------------------------------

.. note::
  Find the ``.platform.app.yaml`` file in the root of your application folder
  (project)/repository/.platform.app.yaml on your local environment, ./public/sites/default/.platform.app.yaml on your remote environment

Your :term:`application` topology is defined into a file called ``.platform.app.yaml``.

* `.platform.app.yaml default for Symfony <https://github.com/platformsh/platformsh-examples/blob/symfony/standard/.platform.app.yaml>`_
* `.platform.app.yaml default for Drupal <https://github.com/platformsh/platform-drupal/blob/master/.platform.app.yaml>`_


The *.platform.app.yaml* holds many attributes and values. These are documented within the file. 


services.yaml, a Topology Configuration File
--------------------------------------------

.. note::
  Find the ``services.yaml`` file in the ``.platform`` folder at the root of your Git repository 
  eg. 1237h7rtyh123/repository/.platform/services.yaml

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
