Developing Locally
==================

Using the CLI to Build Your Site
--------------------------------

Use the :term:`Platform CLI` to get a copy of your project, so that you can start working locally.

In order to copy your project locally, you'll need to know its' project id. The command ``platform projects`` will list all of the active projects on your account.

.. code-block:: none

   ~/htdocs $ platform projects
     Your projects are:
     +---------------+----------------------------+---------------------------------------------+
     | ID            | Name                       | URL                                         |
     +---------------+----------------------------+---------------------------------------------+
     | [project-id]  | New Platform Project       | https://eu1.c-g.io/#/projects/[project-id]  |
     +---------------+----------------------------+---------------------------------------------+

     Get a project by running platform get [id].
     Delete a project by running platform project:delete [id].
     List a project's environments by running platform environments.


Once you know the project id you need to use, copying the project to your local system is pretty simple. Navigate to the folder you want to copy the project to and then run ``platform get [project-id] [folder-name]``. You'll have to choose which branch you want to pull down to start with.

.. code-block:: none

   ~/htdocs $ platform get [project-id] platform
     Enter a number to choose which environment to checkout:
     [0] : Master
     [1] : Sprint1
     [2] : test
     1
     Cloning into 'platform/repository'...
     remote: counting objects: 11, done.
     Receiving objects: 100% (11/11), 1.36 KiB | 0 bytes/s, done.
     Checking connectivity... done.


You should now have a folder, based on what you used for *[folder-name]* in the platform get command above. Inside this folder, there are a couple directories and a file. They are:

  - **.platform-project** - This JSON file stores information about your project for use by the Platform CLI.

  - **builds** - This folder contains the current and previous builds. Each time you run \`platform build\` (see below) a build is generated in this folder.

  - **repository** - This folder contains all of the files that are in your Platform repository.

  - **shared** - This folder contains settings.local.php and each file in here is symlinked to your sites/default folder when a build is created.

  - **www** - This folder is a symlink to the currently active build in the builds folder.


.. code-block:: none

   ~/htdocs/platform ]$ ls
     .platform-project
     builds
     repository
     shared


Now that you have a copy of your project locally, you can run \`platform build\` to pull it all together. Explain a bit about what platform build actually does.

.. code-block:: none

   ~/htdocs/platform $ platform build
     Beginning to build ~/htdocs/platform/repository/project.make.                          [ok]
     commerce_kickstart-7.x-2.14 downloaded.                                                [ok]
     commerce_bundle-7.x-1.x-dev downloaded.                                                [ok]


.. code-block:: none

   ~/htdocs/platform ]$ ls
     .platform-project
     builds
     repository
     shared
     www -> ~/htdocs/platform/builds/2014-05-19--16-22-46--sprint1

.. seealso::
   * `Installing Platform CLI <https://github.com/commerceguys/platform-cli>`_

Synchronizing Data
------------------

The easiest way to do that is to use Drush and the sql-sync command. You'll need to have :ref:`Drush aliases <create-drush-aliases>` setup for both your Platform site and your local site. If you are using the `Platform CLI <https://github.com/commerceguys/platform-cli>`_ and you've run ``platform get [platform_id]`` for a project, then your Platform aliases have already been setup.

With the :ref:`Drush aliases <create-drush-aliases>` (depending on how yours are set up), you could use a command similar to this:

.. code-block:: console

   $ drush sql-sync @platform.master @platform.local

..

With the *Platform CLI* you can run this command from the branch that you wish to synchronize.

.. code-block:: console

  $ platform environment:synchronize

.. seealso::
  * :doc:`/platform-components/platform-interaction-methods/003-drush`
  * :ref:`create-drush-aliases`
  * :doc:`/platform-components/platform-interaction-methods/002-command-line-interface`

