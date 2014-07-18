Deployment hooks
================

The :term:`deployment hooks` allow you to execute actions during the deployment of your :term:`environment`.

To use the :term:`deployment hooks`, create a file ``.platform.app.yaml`` at the root of your repository.

At the minimum, it should contain something like this:

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

Feel free to add anything else that you want to be executed on deploy.

After your next push, you can see a new ``/var/log/deploy.log`` file when logging to the environment via SSH. It contains the log of the execution of the deployment hook, if any:

.. code-block::
    console

    [2014-07-03 10:03:51.100476] Launching hook 'cd /app/public ; drush -y updatedb'.

    My_custom_profile  7001  Update 7001: Enable the Platform module.
    Do you wish to run all pending updates? (y/n): y
    Performed update: my_custom_profile_update_7001
    'all' cache was cleared.
    Finished performing updates.
