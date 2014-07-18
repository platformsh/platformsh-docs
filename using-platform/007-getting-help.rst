Getting Help
============

Known Issues
------------
"No Application Configured"
^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you see the ``No Application Configured`` when accessing your site within a browser, this means that the environment you’re trying to access is not completely ready yet.

Make sure it's completely built. The latest environment status on your Platform activity stream should be marked as **Success**.



Frequently Asked Questions (FAQ)
--------------------------------

What is the difference between a Platform, a Project and an Environment?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

A Platform is the infrastructure which is running all your projects.

A project is the site that you're working on. Each project can contain multiple environments.

An environment is a standalone copy of your live site (the Master environment) which can be used for testing, implementing new features...

Do you support MySQL?
^^^^^^^^^^^^^^^^^^^^^

Platform uses MariaDB to manage and store your databases. It's a fork of MySQL which is more stable and has more interesting features.

Do you support other database services?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

We'll soon support PostgreSQL. We aim to support all the most popular database services like MongoDB...

Does cloning an environment duplicate services?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Yes ! Branching an environment creates an exact copy (snapshot) of the parent environment, containing the files, the database, the services...

Why do I see "File not found"?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you see the "File not found" when accessing your site within a browser, this means that you’ve pushed your code as a vanilla project but no *index.php* has been found.

Make sure your repository contains an *index.php* file as the root, or that your make files are properly named.

How should I name my make files?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In order for Platform to automatically detect your make file, you need to call it **\`project.make\`**.

You can also have a **specific make file for Drupal core** called **\`project-core.make\`**

.. seealso::
   * :doc:`/using-platform/001-best-practices`

Can I run Drupal 8 in Platform?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Drush 7 is required to build Drupal 8, so you won't be able to build a Drupal 8 make file.

But you can still commit Drupal 8 as a complete project (commit the whole core directory) and it'll work fine.

What happens if I push a local branch to my project?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you push a local branch that you created with Git, you create what we call an :term:`inactive environment`, ie. an environment that is not deployed.

This means there won't be any services attached to this branch.

You are able to convert an :term:`inactive environment` into an :term:`active environment` and vice versa back from the environment configuration page.

How do I use Solr with Platform?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. todo::
	This should go somewhere to the **services** section.

ssh into your env and do: cat /etc/hosts (is there solr there?)

How do I import a database in an environment without drush aliases?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. todo::
	This should go somewhere to the **import existing site** section.

.. code-block:: console

  $ scp LOCAL_DB.sql REMOTE_PHP_SERVER:/tmp
  $ mysql -h database.internal main < /tmp/LOCAL_DB.sql

How do I add variables to my settings.php?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You need to push your ``settings.php`` and make sure you include the settings.local.php that Platform will create for you on each environment.

.. code-block:: console

   $local_settings = dirname(__FILE__) . '/settings.local.php';
   if (file_exists($local_settings)) {
     require_once($local_settings);
   }

.. seealso::
   * :doc:`/reference/004-environment-variables`

How does Master scale?
^^^^^^^^^^^^^^^^^^^^^^

Master get all the resources that are divided into each service (PHP 40%, MySQL 30%, Redis 10%, Solr 20%…). Each Development environment get the Development plan resources.

What exactly am I sshing into?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You're logged in to the PHP service. It's a read-only file system.

Can I edit a quick fix on a Platform environment without triggering a rebuild?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

No ! Since the PHP service you access via SSH is a read-only file system, you'll have to push your fix to be able to test it.

What do I see when I push code?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

We try to make the log as self-explanatory as possible, so you should see the Git output and also output from the drush make...

You can also find it back by clicking on the status of the activity in the :term:`Platform UI`.

When I push a make file with a new module version, does Platform runs the update?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

After a push, Platform will rebuild your environment and download all the modules that are in your make file.

If an update function (hook_update) needs to run, you'll have to manually trigger it by going to ``/update.php`` or use the :doc:`/reference/003-deployment-hooks` to automatically run the updates.

What Linux distribution is Platform using?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Platform is built on Debian.

Glossary
--------

In the :ref:`glossary-label` you can find explained terminology.

How do I submit a help request?
-------------------------------

.. image:: images/submit_ticket.png
   :alt: Submit a ticket
   :align: left

In the upper right corner of any Platform project page, there is a **Support** menu. Use the **Submit ticket** menu item to navigate to the Platform support form. Try to provide as much information as possible on the support form.


If I choose the Development plan, can I use that plan for production?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The Development plan provides all the tools to build your website. You can create as many development profiles as you wish for yourself and for your team.
Once your project is built and ready for production, you can choose another plan to go live. These plans are listed on the `pricing page <https://platform.sh/pricing/>`_.

Why did you choose the .sh extension for your domain?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
'sh' is the short version of shell.
According to Wikipedia™, in computing, a `shell <http://en.wikipedia.org/wiki/Shell_(computing)>`_ is a `user interface <http://en.wikipedia.org/wiki/User_interface>`_ for access to an operating system's services. Generally, operating system shells use either a `command-line interface <http://en.wikipedia.org/wiki/Command-line_interface>`_ (CLI) or `graphical user interface <http://en.wikipedia.org/wiki/Graphical_user_interface>`_ (GUI).
This is exactly what Platform.sh is about: Giving developers tools to build, test, deploy, and run great websites!

Which geographic zones is Platform covering?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Platform leverages the powerful AWS Infrastructure.
We can deploy your site in a `data center <https://aws.amazon.com/about-aws/globalinfrastructure/regional-product-services/>`_ that is very close to your target audience.
