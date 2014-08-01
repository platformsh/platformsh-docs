Getting Started
===============

Prerequisites
-------------

.. rubric:: Composer

.. todo::
    Need to write composer introduction.

Configure your app
------------------

Make sure your ``.platform.application.yaml`` is specific to :term:`Symfony`.

A Drupal specific ``.platform.app.yaml`` file would look like this:

.. code-block::
    console

    toolstack: "php:symfony"

    web:
        document_root: "/web"
        passthru: "/app_dev.php"

    mounts:
        "/app/cache": "shared:files/cache"
        "/app/logs": "shared:files/logs"
        "/app/sessions": "shared:files/sessions"

    hooks:
        build: "./app/console cache:warmup"

.. seealso::
  * :doc:`/reference/002-configuration-files`