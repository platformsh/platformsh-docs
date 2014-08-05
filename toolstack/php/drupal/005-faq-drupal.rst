.. _drupal_faq:

Frequently Asked Questions (FAQ)
================================

How should I name my make files?
--------------------------------

In order for Platform to automatically detect your make file, you need to call it **\`project.make\`**.

You can also have a **specific make file for Drupal core** called **\`project-core.make\`**

.. seealso::
   * :ref:`best_practices`

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

How do I add variables to my settings.php?
------------------------------------------

You need to push your ``settings.php`` and make sure you include the settings.local.php that Platform will create for you on each environment.

.. code-block:: console

   $local_settings = dirname(__FILE__) . '/settings.local.php';
   if (file_exists($local_settings)) {
     require_once($local_settings);
   }

.. seealso::
   * :ref:`environment_variables`

When I push a make file with a new module version, does Platform runs the update?
---------------------------------------------------------------------------------

After a push, Platform will rebuild your environment and download all the modules that are in your make file.

If an update function (hook_update) needs to run, you'll have to manually trigger it by going to ``/update.php`` or use the :ref:`deployment hooks <deployment_hooks>` to automatically run the updates.