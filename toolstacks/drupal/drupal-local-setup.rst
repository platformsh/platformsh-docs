Local setup
===========

Platform.sh supports three modes for organizing the code in your repository.

* **Profile**. Platform.sh builds your project like Drupal.org does for distributions.
* **Project**. Platform.sh takes you project.make file and hands it over to *drush make*. You don't need all Drupal core and contributed modules in your repository.
* **Vanilla** for legacy code bases. If you *git push* all your code (Drupal and contributed modules) to the master branch in your repository, Platform.sh assumes you want to use this mode.

These modes use different layouts for files. 


Profile mode
------------

Platform.sh looks for a file name ending in ``.profile``. If your project contains a profile Platform.sh builds your project in profile mode. This is similar to what Drupal.org does to build distributions. Everything you have in your repository will be copied to your ``profiles/[name]`` folder.

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

.. note::
   When building as a profile, you need a specific make file for Drupal core called: ``project-core.make``.

.. code-block:: console

    api = 2
    core = 7.x

    projects[drupal][type] = core
    projects[drupal][patch][] = "https://drupal.org/files/issues/install-redirect-on-empty-database-728702-36.patch"
    
Project mode
------------

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


A make file
^^^^^^^^^^^

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

Generate a make file
^^^^^^^^^^^^^^^^^^^^

If you want to generate a make file for your existing site, you can use the ``drush make-generate`` command.


Vanilla mode
------------

Platform.sh accepts your project's files. You are expected to have an ``index.php`` file at the root of your repository.

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




Drush aliases
-------------

.. _create-drush-aliases:

Create Drush aliases
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
   ...
