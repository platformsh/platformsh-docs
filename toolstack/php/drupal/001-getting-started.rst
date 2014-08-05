Getting Started
===============

Prerequisites
-------------

.. _drush:

.. rubric:: Drush

Drush is a command-line shell and scripting interface for Drupal, a veritable Swiss Army knife designed to make life easier for those who spend their working hours hacking away at the command prompt. Drush commands can, for example, be used to clear the Drupal cache, run module and database updates, revert features, perform database imports and dumps, and a whole lot more. You can reference the full set of Drush commands at `Drush.org <http://www.drush.org>`_. If you have never used Drush before, you can learn more, find installation instructions, or download Drush on the `Drush Github Repository <https://github.com/drush-ops/drush#description>`_

Platform uses Drush, so all :term:`environments <environment>` can utilize drush commands in the development process. You can either set up :ref:`Drush aliases <create-drush-aliases>` to easily run drush commands on specific remote Platform :term:`environments <environment>` or you can utilize the :ref:`cli`.

Platform's :ref:`cli` requires **Drush 6 or greater**.

.. seealso::
  * `Install Drush <https://github.com/drush-ops/drush>`_
  * :doc:`/using-platform/001-best-practices`

Configure your app
------------------

Make sure your ``.platform.application.yaml`` is specific to :term:`Drupal`.

A Drupal specific ``.platform.app.yaml`` file would look like this:

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

.. seealso::
  * :doc:`/reference/002-configuration-files`