Local setup
===========

There are 3 ways you can structure your files depending on how you're building your site with Drupal.

File Structure
--------------

Profile
^^^^^^^

If your project contains a profile file: ``*.profile``, Platform builds your project in profile mode. This is similar to what Drupal.org does to build distributions. Everything you have in your repository will be copied to your ``profile/[name]`` folder.

.. code-block:: console

    .git/
    project.make
    project-core.make
    my_profile.info
    my_profile.install
    my_profile.profile
    modules/
      features/
        my_feature_01/
        ...
      custom/
        my_custom_module/
        ...
    themes/
      custom/
        my_custom_theme/
        ...
    libraries/
      custom/
        my_custom_libraries/
        ...
    translations/
      ...

Project
^^^^^^^

If your project doesn’t contain a profile file, but contains a make file: ``project.make``, Platform builds your project using Drush make. Everything you have in your repository will be copied to your ``sites/default`` folder.

.. code-block:: console

    .git/
    project.make
    modules/
      features/
        my_feature_01/
        ...
      custom/
        my_custom_module/
        ...
    themes/
      custom/
        my_custom_theme/
        ...
    libraries/
      custom/
        my_custom_libraries/
        ...
    translations/
      ...

Vanilla
^^^^^^^

In any other case, Platform builds your project as-is. In that case, you are expected to have a ``index.php`` at the root of your repository.

.. code-block:: console

    .git/
    index.php
    ... (Drupal files)
    includes/
    profiles/
    modules/
      contrib/
      custom/
    themes/
      contrib/
      custom/
    libraries
      contrib/
      custom/

.. _drush_make:

Drush .make Files
-----------------

Platform can automatically build your site using make files. This allows you to easily test specific versions, apply patches and keep your site up to date. It also keeps your working directory much cleaner, since it only contains your custom code.

Simply name your make file: ``project.make``.

And place all the contributed projects (modules, libraries, themes, etc...) you need on your site. 

Here is a sample make file which includes Drupal core with a patch applied to it and the Platform indicator module:

.. code-block:: console

    api = 2
    core = 7.x

    projects[drupal][type] = core
    projects[drupal][patch][] = "https://drupal.org/files/issues/install-redirect-on-empty-database-728702-36.patch"

    ; Platform indicator module.
    projects[platform][version] = "1.2"
    projects[platform][subdir] = "contrib"

.. note::
   You can also have a specific make file for Drupal core: ``project-core.make``. This is useful if you're building your site as an installation profile.

.. _create-drush-aliases:

Create Drush Aliases
^^^^^^^^^^^^^^^^^^^^

.. note:: Platform CLI generates Drush aliases for you automatically, when you  \`platform get [platform_id]\` your project.

Platform utilizes `drush aliases`_ to make it easy to use Drush to manage your development websites. Here's an example of a `drush alias file`_.

.. _drush aliases: https://drupal.org/node/670460
.. _drush alias file: http://drush.ws/examples/example.aliases.drushrc.php

Navigate to your ``.drush`` folder and create a new file called ``platform.aliases.drushrc.php``.

.. code-block:: console

   $ cd ~/.drush
   $ sudo vi platform.aliases.drushrc.php

In your new alias file, you can create aliases for your various Platform projects. For example:

.. code-block:: php

  <?php
  // Platform environment
  $aliases['master'] = array(
    'uri' => 'master-[project-id].eu.platform.sh',
    'root' => '/app/public',
    'remote-host' => 'ssh.eu.platform.sh',
    'remote-user' => '[project-id]-master',
  );
  // Platform branch environment
  $aliases['BRANCHNAME'] = array(
    'uri' => 'BRANCHNAME-[project-id].eu.platform.sh',
    'root' => '/app/public',
    'remote-host' => 'ssh.eu.platform.sh',
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
   Site URI                        :  master-[project-id].eu.platform.sh
   Database driver                 :  mysql
   Database username               :
   Database name                   :  main
   Database                        :  Connected
   Drupal bootstrap                :  Successful
   etc...
   
Create a local running version of your Drupal site
--------------------------------------------------

Now that you have a local platform build script, let's get a copy of your site up and running. We're going to use our drush aliases to make this a little easier.

Step 1: Setup your local environment
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

First, you'll need an empty database and a development environment that runs PHP and MySQL. After you have a copy of your platform built (see above) and once you have noted your new database name and credentials, you will be able to create a new site alias for your platform.

.. code-block:: console

   $ sudo vi ~/.drush/platform.aliases.drushrc.php

The command above would need to have the word "platform" to be replaced by your platform name. You'll need to take a quick look at your local environment settings and modify any of the settings that will help drush understand your local setup.
   
.. code-block:: php

   <?php
   // Platform local environment
   $aliases['local'] = array(
     'site' => 'platform',
     'env' => 'local',
     'uri' => 'platform',
     'root' => '~/Sites/platform/www', // This will need to point to the most recent build, which is aliased to the www folder
   );

Step 2: Connect your local database
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In step one, we had you create a local database. Now we need to add that to your local build. There is a folder that the Platform CLI will use for local builds that require database credentials: ``shared/settings.local.php``

.. code-block:: php

   <?php
   // Database configuration.
   $databases['default']['default'] = array(
     'driver' => 'mysql',
     'host' => 'localhost',
     'username' => '',
     'password' => '',
     'database' => '',
     'prefix' => '',
   );

Step 3: Sync your Database and Files
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

We are going to use the drush command ``sql-sync`` which accepts drush aliases @from and @to. 

.. code-block:: console

   $ drush sql-sync @platform.master @platform.local
   You will destroy data in db and replace with data from ssh.eu.platform.sh/main.
   You might want to make a backup first, using the sql-dump command.
   Do you really want to continue? (y/n): y
   
.. note::
   
   If you get an error like this one: ``Error: no database record could be found for target @platform.local``, then you can add the ``db-url`` to your local alias by opening up the drush alias file (see step 1) and adding this line: ``'db-url' => 'mysql://un:pw@localhost:8889/dbname',`` to the ``$aliases['local']`` array.
   
Finally, we need to bring in an up-to-date copy of the files to your local site (``drush rsync @from @to``):

.. code-block:: console

   $ drush rsync @platform.master:%files @platform.local:%files
   
.. note::
 
   If you get an error like ``Could not evaluate source path @platform.master%file`` you'll want to make sure you have a colon between the drush-alias and the file folder declaration. Or if you get an error like ``rsync: mkdir "~/Sites/platform/www/sites/default/files" failed: No such file or directory (2)`` then you'll want to make sure your ``'root' =>`` in your drush alias is pointing to a non-relative directory.
   
Step 4: Access your newly local running site!
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Congratulations! You now have a local version of your platform all setup. To synchronize from your chosen branch to your local, run these four commands from your ``platform/repository`` folder:

.. code-block:: console

   $ git pull
   $ platform build
   $ drush sql-sync @platform.master @platform.local
   $ drush rsync @platform.master:%files @platform.local:%files
