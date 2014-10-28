Getting Started
===============

Configure your app
------------------

Make sure your ``.platform.app.yaml`` is specific to :term:`Drupal`.

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
  * :ref:`configuration_files`
