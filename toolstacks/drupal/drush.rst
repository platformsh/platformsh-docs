Getting Started
===============

Prerequisites
-------------

.. _drush:

.. rubric:: Drush

Drush is a command-line shell and scripting interface for Drupal, a veritable Swiss Army knife designed to make life easier for those who spend their working hours hacking away at the command prompt. Drush commands can, for example, be used to clear the Drupal cache, run module and database updates, revert features, perform database imports and dumps, and a whole lot more. You can reference the full set of Drush commands at `Drush.org <http://www.drush.org>`_. If you have never used Drush before, you can learn more, find installation instructions, or download Drush on the `Drush Github Repository <https://github.com/drush-ops/drush#description>`_

Platform uses Drush, so all :term:`environments <environment>` can utilize drush commands in the development process. You can either set up :ref:`Drush aliases <create-drush-aliases>` to easily run drush commands on specific remote Platform :term:`environments <environment>` or you can utilize the :ref:`cli`.

Platform's :ref:`cli` requires **Drush 6 or greater**.


`Drush <http://www.drush.org/>`_ is a tool for Drupal developers. 
Composer installs the drush tool in the same place as *platform*, in *~/.composer/vendor/bin/*. 

Install drush. ::

 composer global require drush/drush:6.*

Check your work. ::

 drush

A table of commands appears. 


.. seealso::
  * `Install Drush <https://github.com/drush-ops/drush>`_

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