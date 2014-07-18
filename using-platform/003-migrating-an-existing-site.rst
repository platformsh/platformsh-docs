Migrating an Existing Site
==========================

Exporting an Existing Site
--------------------------

If you have :ref:`SSH <ssh>` access, it is recommended that you export your existing site using :ref:`Drush <drush>`.

Once you're logged into the root of your existing site, you can use the following command to create a package of your website that you can then use locally.

.. code-block:: console

  $ drush archive-dump

You can use the ``--destination`` or ``--no-core`` options for this command to control where the file is downloaded to or limit your package to just your site-specific files. The file downloaded this way will include an sql-dump as well as the code and files of your website.

Be sure to get your website working on your local machine before following the steps below to import that website into Platform.

.. note::

  You may prefer to use some of the :ref:`Drush alias <create-drush-aliases>` techniques described below to export your existing website.

Importing Data Into Platform
----------------------------

If you want to import your existing site into Platform, you need to start with the **from scratch** option on the second step of the *Setting up your project* wizard. In that case, Platform will create an empty Git repository for you.

You have 3 things you need to import: *code base*, *database* and *files*.

.. note:: This documentation supposes you're familiar with working with a terminal.

Import your code base
^^^^^^^^^^^^^^^^^^^^^

This will depend wether you already have Git set up for your project or not.

Your project already uses Git
*****************************

If you're already working with Git for your project, then you simply need to add a **platform** remote repository. In that case, you will keep your existing Git history.

On a terminal, go to your Git project folder and add **platform** as a remote.

.. code-block:: console

   $ cd ~/Sites/platform
   $ git remote add platform [project-id]@git.eu1.c-g.io:[project-id].git

.. note:: You can get the Git URL from the Platform UI under the Git icon.

Then push your local branch to your **platform** remote.

.. code-block:: console

   $ git push platform HEAD:master

Both on the terminal and on the Platform UI, you should see your :term:`Master` environment being built.

Your project doesn't use Git yet
********************************

If you're not working with Git for your project, then you'll need to initialize your repo.

On a terminal, go to your project folder, initiate the Git repository, and add a **platform** remote repository.

.. code-block:: console

   $ cd ~/Sites/mysite
   $ git init
   $ git remote add platform [project-id]@git.eu1.c-g.io:[project-id].git

.. note:: You can get the Git URL from the Platform UI under the Git icon.

Commit your project to the **platform** remote repository and push the code.

.. code-block:: console

   $ git add *
   $ git commit -m "Initial commit of My Site"
   $ git push platform master

.. note:: *git init* should have created a default *master* branch for you locally, so you can directly push that branch to you *master* remote branch on Platform.

Both on the terminal and on the Platform UI, you should see your :term:`Master` environment being built.

.. _create-drush-aliases:

Create Drush Aliases
^^^^^^^^^^^^^^^^^^^^

.. todo:: The Drush aliases will be automatically generated at some point, so the user won't need to manually create them. This section needs to be redone.

.. note:: Platform CLI generates Drush aliases for you automatically, when you  \`platform get [platform_id]\` your project.

Platform utilizes `drush aliases`_ to make it easy to use Drush to manage your development websites. Here's an example of a `drush alias file`_.

.. _drush aliases: https://drupal.org/node/670460
.. _drush alias file: http://drush.ws/examples/example.aliases.drushrc.php

Navigate to your ``.drush`` folder and create a new file called ``platform.aliases.drushrc.php``.

.. code-block:: console

   $ cd ~/.drush
   $ touch platform.aliases.drushrc.php
   $ sudo vim platform.aliases.drushrc.php

In your new alias file, you can create aliases for your various Platform projects. For example:

.. code-block:: php

  <?php
  // Platform environment
  $aliases['master'] = array(
    'uri' => 'master-[project-id].eu1.c-g.io',
    'root' => '.',
    'remote-host' => 'ssh.eu1.c-g.io',
    'remote-user' => '[project-id]-master',
  );
  // Platform branch environment
  $aliases['BRANCHNAME'] = array(
    'uri' => 'BRANCHNAME-[project-id].eu1.c-g.io',
    'root' => '.',
    'remote-host' => 'ssh.eu1.c-g.io',
    'remote-user' => '[project-id]-BRANCHNAME',
  );
  // Platform local environment
  $aliases['local'] = array(
    'site' => 'platform',
    'env' => 'local',
    'uri' => 'platform',
    'root' => '~/Sites/platform',
  );

Then test your settings to make sure they work.

.. code-block:: console

   $ drush @platform.master status
   Drupal version                  :  7.24
   Site URI                        :  master-[project-id].eu1.c-g.io
   Database driver                 :  mysql
   Database username               :
   Database name                   :  main
   Database                        :  Connected
   Drupal bootstrap                :  Successful
   etc...

Import your Database
^^^^^^^^^^^^^^^^^^^^

We use *drush aliases* to import your existing local database into Platform.

Before playing with the aliases, please backup your local database using drush sql-dump.

.. code-block:: console

   $ drush sql-dump @platform.local > backup_database.sql

You can also sanitize your database prior to import it into Platform by running:

.. code-block:: console

   $ drush sql-sanitize @platform.local

When you're ready, import your database to your Platform environment.

.. code-block:: console

   $ drush sql-cli @platform.local @platform.master

When the process completes, you can visit the URL of your development environment and test that the database has been properly imported.

Import your Files
^^^^^^^^^^^^^^^^^

We use *drush alias* to import your existing local files.

.. code-block:: console

   $ drush rsync @platform.local:%files @platform.master:%files
   You will destroy data from [project-id]-master@ssh.eu1.c-g.io:././sites/default/files and replace with data from ~/Sites/platform/sites/default/files/
   Do you really want to continue? (y/n): y

.. note:: Drush will verify that you are copying and over-writing the proper files folders, so double-check that information before you type ``y`` to continue.

This step may take some time, but when the process completes, you can visit the url of your development environment and test that the files have properly been imported.

**Congratulations, your existing Drupal site is now running on Platform !**
