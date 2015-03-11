.. _ui_conf_project:

Project configuration
=====================

You can access the configuration page of your project by clicking the gear icon next to the project name.

.. figure:: images/ui-conf-project.png
  :alt: Platform.sh project configuration screen

.. _ui_project_settings:

Settings
--------

The ``Settings`` screen provides the SSH key that Platform.sh will use when trying to access external private Git repository during the build process.

.. figure:: images/ui-conf-project-ssh-key.png
   :alt: Get the project public SSH key.

This is useful if you want to reuse some code components accross multiple projects and manage those components as dependencies of your project.

.. seealso::
   * :ref:`private_repository`

.. _ui_project_users:

Users
-----

.. _ui_project_domains:

Domains
-------