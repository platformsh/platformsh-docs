.. _drupal_faq:

Frequently Asked Questions (FAQ)
================================

How should I name my make files?
--------------------------------

In order for Platform to automatically detect your make file, you need to call it **\`project.make\`**.

You can also have a **specific make file for Drupal core** called **\`project-core.make\`**



Can I run Drupal 8 in Platform?
-------------------------------

Drush 7 is required to build Drupal 8, so you won't be able to build a Drupal 8 make file.

But you can still commit Drupal 8 as a complete project (commit the whole core directory) and it'll work fine.

How do I import a database in an environment without drush aliases?
-------------------------------------------------------------------

.. todo::
    This should go somewhere to the **import existing site** section.

.. code-block:: console

  $ scp LOCAL_DB.sql REMOTE_PHP_SERVER:/tmp
  $ mysql -h database.internal main < /tmp/LOCAL_DB.sql

When I push changes to a make file, does Platform.sh run the update?
--------------------------------------------------------------------

After a push, Platform will rebuild your environment and download all the modules that are in your make file.

If an update function (hook_update) needs to run, you'll have to manually trigger it by going to ``/update.php`` or use the :ref:`deployment hooks <deployment_hooks>` to automatically run the updates.

How can I override the default robots.txt?
------------------------------------------

If your project is using a make file, you will end up with the default ``robots.txt`` provided by Drupal.

On your Development environments, Platform.sh automatically overrides your ``robots.txt`` file with:

.. code-block:: console

    User-agent: *
    Disallow: /

On the Master environment, you can still override it using a :ref:`deployment hook <deployment_hooks>`.

Simply commit your custom ``robots.txt`` at the root of your repository, and add this line to your ``.platform.app.yaml``:

.. code-block:: console

    hooks:
        build: "cp public/sites/default/robots.txt public/robots.txt"

After you push, you should see this line on your logs:

.. code-block:: console

    Executing post-build hook: cp public/sites/default/robots.txt public/robots.txt

.. seealso::
   * :ref:`deployment hooks <deployment_hooks>`
   