.. _ui_overview:

Web UI
======

Platform.sh provides a responsive web UI which allows you to interact with your projects and manage your environments. The UI is built with `AngularJS <https://www.angularjs.org>`_.

.. image:: images/platform-ui.png
  :alt: Platform.sh web UI
  :align: center

Environment List
----------------

Each of the environments of your projects are available on the left sidebar. 

The name of the environment is strikethroughed if it's been disabled. If it has an arrow next to it, this means the environment has children.

.. seealso::
   * :ref:`environments`

Activity Feed
-------------

The web UI displays all the activity happening on your environments. You can filter messages per type.

Header
------

The web UI exposes 5 main actions that you can use to interface with your :ref:`environments`.

.. image:: images/ui-header.png
  :alt: Platform.sh web UI header
  :align: center

.. seealso::
   * :ref:`platform_actions`
