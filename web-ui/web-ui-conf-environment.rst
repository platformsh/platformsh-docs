.. _ui_conf_environment:

Environment configuration
=========================

You can access the configuration page of an environment by clicking the configure link under the environment name.

.. figure:: images/ui-conf-environment.png
  :alt: Platform.sh environment configuration screen

----------------------------------

.. _ui_environment_settings:

Settings
--------

----------------------------------

.. _ui_environment_variables:

Variables
---------

----------------------------------

.. _ui_environment_routes:

Routes
------

----------------------------------

.. _ui_environment_users:

Users
-----

Access the environment-level configuration.

.. image:: images/ui-conf-environment-users.png
   :alt: Project configure icon
   :align: left

Click the environment configuration icon next to the environment name on the project page.

.. image:: images/ui-conf-environment-users.png
   :alt: Project user management screenshot
   :align: left
   :width: 400px

The ``User Management`` tab shows environment-level users and their roles.

Selecting a user will allow you to either edit that user's permissions or delete the user's access to the environment entirely.

Add a new user by clicking on the ``Add user`` button.

.. note::
  After a new user is added to the environment, it needs to be rebuilt (git push) for the changes to take effect. When the environment rebuild is complete, allow a minute for the routes to fully update and for the new user to be able to use SSH access.