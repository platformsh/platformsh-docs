.. _ui_conf_environment:

Environment configuration
=========================

You can access the configuration page of an environment by clicking the configure link under the environment name.

.. image:: images/ui-conf-environment.png
  :alt: Platform.sh environment configuration screen
  :width: 40%
  :align: center

----------------------------------

.. _ui_environment_settings:

Settings
--------

The ``Settings`` screen allows you to extend the behavior of a specific environment.

.. image:: images/ui-conf-environment-settings.png
   :alt: Configure Platform.sh environment settings

.. note:: Deleting the Master environment is forbidden.

The access control is very helpful if you need your development environments to be restricted by a login/password, or be accessible by only a certain range of IP addresses.

.. seealso::
   * :ref:`outgoing_email`

----------------------------------

.. _ui_environment_variables:

Variables
---------

The ``Variables`` screen allows you to define the variables that will be available on a specific environment.

.. image:: images/ui-conf-environment-variables.png
   :alt: Configure Platform.sh environment variables

.. seealso::
   * :ref:`environment_variables`

----------------------------------

.. _ui_environment_routes:

Routes
------

The ``Routes`` screen allows you to configure the routes of your environments.

.. image:: images/ui-conf-environment-routes.png
   :alt: Configure Platform.sh environment routes

.. seealso::
   * :ref:`routes_configuration`

----------------------------------

.. _ui_environment_users:

Users
-----

The ``Users`` screen allows you to manage users access on your project.

You can invite new users to a specific environment by clicking the ``Add user`` link and entering their email address, or modify permissions of existing users by clicking the ``Edit`` link when hovering the user.

.. image:: images/ui-conf-environment-users.png
   :alt: Manage users of your Platform.sh environments

Selecting a user will allow you to either edit or remove access to that environment.

You can also manage access to users on multiple environments using the :ref:`project configuration screen <ui_project_users>`.

.. seealso::
   * :ref:`User roles <user_administration>`