
Set up your local development environment
=========================================

Use the CLI
-----------

Use the :ref:`cli` to get a copy of your project, so that you can start working locally.

In order to copy your project locally, you'll need to know its project ID. The command ``platform`` will list all of the active projects in your account.

.. code-block:: none

   ~/htdocs $ platform projects
     Your projects are:
     +---------------+----------------------------+------------------------------------------------+
     | ID            | Name                       | URL                                            |
     +---------------+----------------------------+------------------------------------------------+
     | [project-id]  | New Platform Project       | https://eu.platform.sh/#/projects/[project-id] |
     +---------------+----------------------------+------------------------------------------------+

     Get a project by running platform get [id].
     Delete a project by running platform project:delete [id].
     List a project's environments by running platform environments.

Download an environment
-----------------------

Once you know the project ID you need to use, copying the project to your local system is pretty simple. Navigate to the folder you want to copy the project to and then run ``platform get [project-id] [folder-name]``. You can then choose which branch you want to clone first.

.. code-block:: none

   ~/htdocs $ platform get [project-id] my-project
     Enter a number to choose which environment to checkout:
     [0] : Master
     [1] : Sprint1
     [2] : test
     1
     Cloning into 'platform/repository'...
     remote: counting objects: 11, done.
     Receiving objects: 100% (11/11), 1.36 KiB | 0 bytes/s, done.
     Checking connectivity... done.

You should now have a folder, based on what you used for *[folder-name]* in the ``platform get`` command above. 

Local site structure
^^^^^^^^^^^^^^^^^^^^

Inside the new folder, there are a few directories and a file. They are:

  - **.platform-project** - This JSON file stores information about your project for use by the Platform CLI.

  - **builds** - This folder contains the current and previous builds. Each time you run ``platform build`` (see below) a build is generated in this folder.

  - **repository** - This folder contains all of the files that are in your Platform.sh repository.

  - **shared** - Drupal specific: This folder contains ``settings.local.php``. Each file in `shared` will symlinked from `repository/sites/default` when `platform build` is run.

  - **www** - This folder is a symlink to the currently active build in the builds folder. This should be used as the document root for your local server. For Drupal sites built with Drush Make, the Platform.sh CLI manages symlinks from `www/sites/default` back to the `repository` and `shared` directories.

.. code-block:: none

   ~/htdocs/my-project $ ls
     .platform-project
     builds
     repository
     shared

Build the local site
--------------------

Now that you have a copy of your project locally, you can run ``platform build`` to pull it all together. Explain a bit about what platform build actually does.

.. code-block:: none

   ~/htdocs/my-project $ platform build
     Beginning to build ~/htdocs/my-project/repository/project.make.                        [ok]
     commerce_kickstart-7.x-2.14 downloaded.                                                [ok]
     commerce_bundle-7.x-1.x-dev downloaded.                                                [ok]


.. code-block:: none

   ~/htdocs/my-project $ ls
     .platform-project
     builds
     repository
     shared
     www -> ~/htdocs/my-project/builds/2014-05-19--16-22-46--sprint1

.. seealso::
  * :ref:`cli`
  * `Installation instructions on Github <https://github.com/platformsh/platformsh-cli/blob/development/README.md>`_.

Synchronize data
----------------

With the *Platform CLI* you can run this command from the branch that you wish to synchronize.

.. code-block:: console

  $ platform environment:synchronize

.. seealso::
  * :ref:`Drush <drush>`
  * :ref:`create_drush_aliases`
  * :ref:`cli`

SSH Tunneling
-------------

Use SSH Tunneling to connect your local development site to remote services.

.. code-block:: console

  # Use your own project ID, branch, and specify whether it is the EU or US cluster (eg. us.platform.sh)
  $ ssh -N -L 3306:database.internal:3306 [project ID]-[branch]@ssh.eu.platform.sh & 
  
After the tunnel is build, you can confirm its presence using the `fg` command:

.. code-block:: console

  $ fg
    [1]  + 35203 running    ssh -N -L 3306:database.internal:3306 xjybxziut32me-master@ssh.eu.platform.sh
  # pressing CTRL-C at this point will kill the tunnel.
  # press CTRL-Z to return to the shell without killing the tunnel.

Then you can connect to the remote database normally, as if it were local.

.. code-block:: console

  $ mysql --host=127.0.0.1 --user='' --pass='' --database='main'

