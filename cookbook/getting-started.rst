TODO list:

Goals of this document:
* getting started guide

* short overview of Platform.sh

* define the needed tools

* local setup (note the major versions of PHP and MariaDB)

* explain the ideal workflow with Platform.sh

* access rights

* merge

* create new project

* Drupal specific steps

  * distribution

  * Drush make

  * vanilla

  * migrate existing project

  * custom code (modul, external repo - drush make)

* e-mail settings (note for the master env)

* Symphony TODO


--------------------------------------------

What is Platform.sh?
Platform.sh is a groundbreaking hosting and development tool for web applications. It extends a branch-merge Git workflow to infrastructure so that every branch has its own URL and can be tested as if it were in production. Platform.sh architecture allows it to scale for the largest sites.

Note: The environments used in Platform.sh are deployed on a read-only filesystems and are rebuilt with every Git push.

Drupal
======

How to set up your local Drupal development
-------------------------------------------

This guide will teach you how to set up local Drupal development for use with Platform.sh.

Prerequisites
^^^^^^^^^^^^^

To succeed with Platform.sh you need the following installed on your local machine:

For the Platform.sh CLI:
~~~~~~~~~~~~~~~~~~~~~~~~

* An `id_rsa public/private keypair <https://help.github.com/articles/generating-ssh-keys/>`_
* `Git <http://git-scm.com/>`_
* `Composer <https://getcomposer.org/>`_
* `The Platform.sh CLI <https://github.com/platformsh/platformsh-cli>`_
* `Drush <https://github.com/drush-ops/drush>`_

For your Drupal stack:
~~~~~~~~~~~~~~~~~~~~~~

* `Nginx <http://nginx.org/>`_ (or Apache) web server
* `MariaDB <https://mariadb.org/>`_ (or MySQL) database
* Optional: `Solr <https://lucene.apache.org/solr/>`_, `Redis <http://redis.io/>`_

You will also need to have signed up for a `Platform.sh <https://platform.sh>`_ project.

Platform.sh is currently running PHP 5.4, MySQL Ver 15.1 Distrib 5.5.40-MariaDB

Goals
^^^^^

#. Authenticate locally using the `Platform.sh CLI <https://github.com/platformsh/platformsh-cli>`_
#. Upload your SSH public key
#. Use the `Platform.sh CLI <https://github.com/platformsh/platformsh-cli>`_ to obtain and build your project’s repository
#. Understand Settings.php
#. Understand Build Modes
#. Connect to your local database
#. Use your Drush aliases
#. Synchronize databases and files with Platform.sh

Authenticate locally using the Platform.sh CLI
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The `Platform.sh CLI <https://github.com/platformsh/platformsh-cli>`_ will authenticate you with Platform.sh and show your projects.

.. code-block:: console

  # this command will authenticate you on Platform.sh
  $ platform

The credentials you enter are the same for your account on `Commerce Guys' Marketplace <https://marketplace.commerceguys.com/user>`_.

Upload your SSH public key
^^^^^^^^^^^^^^^^^^^^^^^^^^

You need an `id_rsa public/private keypair <https://help.github.com/articles/generating-ssh-keys/>`_ to use Platform.sh.

Upload using the Web UI
~~~~~~~~~~~~~~~~~~~~~~~

To upload the public key in the browser go to `your user account <https://marketplace.commerceguys.com/user>`_ and click the `SSH Keys` tab. Name your key in the *Title* field, and paste the public key into the *Key* field. Your key will typically be found at ``~/.ssh/id_rsa.pub`` on Linux and Mac OS X machines.

.. image:: images/edit-ssh.png
   :alt: Screenshot of a public key field

Upload using Platform.sh CLI
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Alternately, you can upload your SSH key using the Platform.sh CLI itself.

.. code-block:: console

  $ platform ssh-key:add ~/.ssh/id_rsa.pub
  Enter a name for the key: My public key

Use the Platform.sh CLI to obtain and build your project’s repository
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``platform`` command will show you a list of your projects.

.. code-block:: console

  $ platform
  Welcome to Platform.sh!
  Your projects are:
  +---------------+-------------------------------------+-------------------------------------------------+
  | ID            | Name                                | URL                                             |
  +---------------+-------------------------------------+-------------------------------------------------+
  | [PROJECT-ID] | My Drupal Site                      | https://[CLUSTER].platform.sh//#/projects/[PROJECT-ID] |
  | [PROJECT-ID] | A Symfony Project                   | https://[CLUSTER].platform.sh/#/projects/[PROJECT-ID] |

You can obtain a local copy of the project using the ``platform get [PROJECT-ID]`` command:

.. code-block:: console

  # This command will get the `My Drupal Site` project
  $ platform get [PROJECT-ID]

Now you can see the local directory structure that the Platform CLI provides for your local development:

.. code-block:: console

  $ ls -1
  # Contains all builds of your projects
  builds

  # Checkout of the Git repository
  repository

  # Your files directory, and your settings.local.php file
  shared

  # A symlink that always references the latest build
  # This should be the document root for your local web server
  www -> builds/2014-12-08--15-21-46--staging

The ``builds`` directory contains every build of your project. This is relevant when you use Drush Make files to assist in your site building.

The ``repository`` directory is your local checkout of the Platform.sh Git repository. This is where you edit code and issue normal Git commands, like ``git pull``, ``git add``, ``git commit``, and ``git push``.

The ``shared`` directory is for your settings.local.php file which stores the connection details to your local database.

See the section below about Settings.php for a full explanation of the settings.local.php file.

The ``www`` symlink is created by the ``platform build`` command and will always reference the latest build in the builds directory. The ``www`` directory should become your DOCROOT for local development.

Understand Settings.php
^^^^^^^^^^^^^^^^^^^^^^^

Drupal sites use a file called settings.php to store database connection details and other important configurations. Platform.sh has a specific concept for managing settings.php which is important to understand to succeed. For both the local copy of your site, as well as on the server, settings.php should be found at sites/default/settings.php, and should be generated by Platform.sh. That means you will not be committing a settings.php file to your Git repository in normal circumstances. Here is the entire contents of a generated settings.php:

.. code-block:: php
  :linenos:

  <?php
  $update_free_access = FALSE;

  $drupal_hash_salt = '5vNH-JwuKOSlgzbJCL3FbXvNQNfd8Bz26SiadpFx6gE';

  $local_settings = dirname(__FILE__) . '/settings.local.php';
  if (file_exists($local_settings)) {
    require_once($local_settings);
  }

The important part to see, starting in line 6, is the inclusion of another file, ``settings.local.php``, which will handle the actual connection to the database, as well as the parsing of other important environmental variables from Platform.sh.

Understand Build Modes
^^^^^^^^^^^^^^^^^^^^^^

Platform.sh offers three build modes for Drupal projects: Vanilla, Drush Make, and Install Profiles.

.. note::
  You can change build modes by changing the files in your repository. Platform.sh recognizes each mode based on the presence or absence of ``project.make`` or ``*.profile`` files.


Vanilla build mode
~~~~~~~~~~~~~~~~~~

In *Vanilla mode* you commit all of Drupal's files directly into the Git repository instead of using Drush Make.

In this mode, you should add your own settings.local.php file with your local database credentials directly to ``sites/default``. The following lines are present in your repository's .gitignore file, which will guarantee that a settings.local.php file won't get committed to Git:

.. note::
  # /.gitignore

  # Ignore configuration files that may contain sensitive information.
  sites/*/settings*.php

Drush Make build mode
~~~~~~~~~~~~~~~~~~~~~

Drush Make build mode looks for a ``project.make`` file which will get executed during the build process.

The default ``project.make`` file for a Drupal 7 installation looks like this:

.. code-block:: console

  api = 2
  core = 7.x

  ; Drupal core.
  projects[drupal][type] = core
  projects[drupal][version] = 7.32
  projects[drupal][patch][] = "https://drupal.org/files/issues/install-redirect-on-empty-database-728702-36.patch"

  ; Platform indicator module.
  projects[platform][version] = 1.3
  projects[platform][subdir] = contrib

If you are building with Drush Make, the proper place for your file is ``shared/settings.local.php``. The `Platform.sh CLI <https://github.com/platformsh/platformsh-cli>`_ will have created this file for you when you ran the platform get command.

.. note::
  If there is no shared/settings.local.php file, create one following the `example found here <https://github.com/platformsh/platformsh-cli/blob/master/resources/drupal/settings.local.php>`_, and re-run platform build.)

When using Drush Make files, the ``platform build`` command will generate a `sites/default/settings.php` file with each build of your application. The `shared/settings.local.php` file will also be symlinked into the `www/sites/default` directory, where the generated settings.php can include it.

Install Profile build mode
~~~~~~~~~~~~~~~~~~~~~~~~~~

If your project contains a profile file: ``*.profile``, the Platform.sh CLI builds your project in profile mode. This is similar to what Drupal.org does to build distributions. Everything you have in your repository will be copied to your ``profile/[name]`` folder.

.. note::
  It is a mistake to mix Vanilla mode with other modes. If you've copied all of the Drupal core files into your repository then you need to make sure you don't have any ``*.make` or ``*.profile`` files.

Connect to your local database
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Your local database credentials will be put in a ``settings.local.php`` file. Where this file is stored depends on what build mode you are using for Drupal.

Database credentials
~~~~~~~~~~~~~~~~~~~~

Whether your ``settings.local.php`` file is in `repository/sites/default/settings.local.php` (Vanilla mode) or `shared/settings.local.php` (Drush Make mode), you need to add your local database credentials.

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

.. note::
  You never have to add the server-side database credentials to ``settings.local.php``. Platform.sh generates a ``settings.php`` for each environment, already containing the proper database credentials.


Drush Aliases
^^^^^^^^^^^^^

The `Platform.sh CLI <https://github.com/platformsh/platformsh-cli>`_ generates and maintains Drush Aliases that allow you to issue remote Drush commands on any environment (branch) that is running on Platform.sh. There is also a Drush Alias for your local site.

To see your Drush Aliases, use the ``platform drush-aliases`` command:

.. code-block:: console

  $ platform drush-aliases
  Aliases for My Site (tqmd2kvitnoly):
      @tqmd2kvitnoly._local
      @tqmd2kvitnoly.master
      @tqmd2kvitnoly.staging
      @tqmd2kvitnoly.sprint1

.. note::
  Run local Drush commands with ``drush``. Run remote Drush commands with ``platform drush``. Any ``platform drush`` command will execute on the remote environment that you currently have checked out.

Change the Drush Alias Group
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can set the Drush alias group name to something more convenient:

.. code-block:: console

  $ platform drush-aliases -g [alias group]

After that, they will be easier to remember and type.

.. code-block:: console

  $ platform drush-aliases -g mysite
  Project aliases created, group: @mysite
  Delete old alias group @tqmd2kvitnoly? [Y/n] Y
  Aliases for My Site (tqmd2kvitnoly):
      @mysite._local
      @mysite.master
      @mysite.staging
      @mysite.sprint1


Synchronize Databases and Files with the Platform CLI
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Given the Drush aliases shown above, you can now use a normal Drush command to synchronize my local database with the data from my Master environment online:

.. code-block:: console

  $ drush sql-sync @mysite.master @mysite._local

In the same style, use Drush to grab the uploaded files from the files directory and pull them into your local environment:

.. code-block:: console

  $ drush rsync @mysite.staging:%files @mysite._local:%files

.. note::
  Never commit the files that are in your ``files`` directory to the Git repository. Git is only meant for code, not *data*, and files that are managed by your Drupal site are considered data.

IDE Specific Tips
^^^^^^^^^^^^^^^^^

MAMP pro:

In order for MAMP to work well with the symlinks created by the `Platform.sh CLI <https://github.com/platformsh/platformsh-cli>`_, add the following to the section under Hosts > Advanced called “Customized virtual host general settings.” For more details visit `MAMP Pro documentation page <http://documentation.mamp.info/en/documentation/mamp/>`_.

.. code-block:: console

  <Directory />
          Options FollowSymLinks
          AllowOverride All
  </Directory>

.. seealso::
  `Laravel Forum Archives <http://forumsarchive.laravel.io/viewtopic.php?pid=11232#p11232>`_

last update: |today|
