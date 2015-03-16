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
   :width: 100%

.. note:: Deleting the Master environment is forbidden.

.. seealso::
   * :ref:`outgoint_email`
   * :ref:`access_control`

----------------------------------

.. _ui_environment_variables:

Variables
---------

The ``Variables`` screen allows you to define the variables that will be available on a specific environment.

.. image:: images/ui-conf-environment-variables.png
   :alt: Configure Platform.sh environment variables
   :width: 100%

.. seealso::
   * :ref:`environment_variables`

----------------------------------

.. _ui_environment_routes:

Routes
------

@TODO

----------------------------------

.. _ui_environment_users:

Users
-----

The ``Users`` screen allows you to manage users access on your project.

You can invite new users to your project by clicking the ``Add user`` link and entering their email address, or modify permissions of existing users by clicking the ``Edit`` link when hovering the user.

.. image:: images/ui-conf-project-users.png
   :alt: Project configure icon
   :width: 100%

Selecting a user will allow you to either edit that user's permissions or delete the user's access to the project entirely.

.. image:: images/ui-conf-project-users-access.png
   :alt: Manage users of your Platform.sh project
   :width: 100%

If you check the ``Super user`` box, this user will be an administrator of the project and will have fulll access on all environments. If you uncheck the box, you'll have the option of adjusting the user's permissions on each environment.

.. note::
   The ``Account owner`` is locked and you can't change its permissions.

.. seealso::
   * :ref:`User roles <user_administration>`