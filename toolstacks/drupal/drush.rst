.. _drush:

Work with Drush
===============

Drush is a command-line shell and scripting interface for Drupal, a veritable Swiss Army knife designed to make life easier for those who spend their working hours hacking away at the command prompt. Drush commands can, for example, be used to clear the Drupal cache, run module and database updates, revert features, perform database imports and dumps, and a whole lot more. You can reference the full set of Drush commands at `Drush.org <http://www.drush.org>`_. If you have never used Drush before, you can learn more, find installation instructions, or download Drush on the `Drush Github Repository <https://github.com/drush-ops/drush#description>`_

Platform uses Drush, so all :term:`environments <environment>` can utilize drush commands in the development process. You can either set up :ref:`Drush aliases <create-drush-aliases>` to easily run drush commands on specific remote Platform :term:`environments <environment>` or you can utilize the :ref:`cli`.

Platform's :ref:`cli` requires **Drush 6 or greater**.

Install Drush
-------------

`Drush <http://www.drush.org/>`_ is a tool for Drupal developers. 
Composer installs the drush tool in the same place as *platform*, in *~/.composer/vendor/bin/*. 

Install drush. ::

 composer global require drush/drush:6.*

Check your work. ::

 drush

A table of commands appears. 

.. seealso::
  * `Install Drush <https://github.com/drush-ops/drush>`_

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

.. _drush_make_files:

Make files
----------

Create a make file
^^^^^^^^^^^^^^^^^

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

When building as a profile, you **need a make file for Drupal core** called: ``project-core.make``:

.. code-block:: console

    api = 2
    core = 7.x

    projects[drupal][type] = core
    projects[drupal][patch][] = "https://drupal.org/files/issues/install-redirect-on-empty-database-728702-36.patch"
    

Generate a make file
^^^^^^^^^^^^^^^^^^^^

If you want to generate a make file for your existing site, you can use the ``drush make-generate`` command.