
Set up your local development environment
=========================================

Use the CLI
-----------

Use the :ref:`cli` to get a copy of your project, so that you can start working locally.

In order to copy your project locally, you'll need to know its project ID. The command ``platform projects`` will list all of the projects in your account.

.. code-block:: none

   ~/htdocs $ platform projects
     Your projects are:
     +---------------+----------------------------+------------------------------------------------+
     | ID            | Name                       | URL                                            |
     +---------------+----------------------------+------------------------------------------------+
     | [project-id]  | New Platform Project       | https://eu.platform.sh/#/projects/[project-id] |
     +---------------+----------------------------+------------------------------------------------+

     Get a project by running platform get [id].
     List a project's environments by running platform environments.

Download a project
------------------

Once you know the project ID you need to use, copying the project to your local system is simple. Navigate to the folder you want to copy the project to and then run ``platform get [project-id] [folder-name]``. You can then choose which branch you want to clone first.

.. code-block:: none

   ~/htdocs $ platform get [project-id] my-project
     Enter a number to choose which environment to checkout:
     [0] : Master
     [1] : Sprint1
     [2] : test
     1
     Cloning into 'my-project/repository'...
     remote: counting objects: 11, done.
     Receiving objects: 100% (11/11), 1.36 KiB | 0 bytes/s, done.
     Checking connectivity... done.

You should now have a folder, based on what you used for *[folder-name]* in the ``platform get`` command above. 

Local site structure
^^^^^^^^^^^^^^^^^^^^

Inside the new folder, there are a few directories and a file. They are:

  - **.platform-project** - This YAML file stores information about your project, for use by the CLI.

  - **builds** - This folder contains the current and some previous builds. Each time you run ``platform build`` (see below) a build is generated in this folder.

  - **repository** - This folder contains all of the files in your Platform.sh repository.

  - **shared** - Files that can be shared between environments. For Drupal projects, this folder contains ``settings.local.php``, and each file in ``shared`` will be symlinked from ``sites/default`` when the local environment is built.

  - **www** - This is a symlink to the currently active build in the ``builds`` folder. It should be used as the document root for your local web server.

.. code-block:: none

   ~/htdocs/my-project $ ls -a
     .platform-project
     builds
     repository
     shared

Build the local site
--------------------

Now that you have a copy of your project locally, you can run ``platform build`` to pull it all together.

.. code-block:: none

   ~/htdocs/my-project $ platform build
     Building application using the toolstack php:drupal
     Beginning to build ~/htdocs/my-project/repository/project.make.
     drupal-7.34 downloaded.
     drupal patched with install-redirect-on-empty-database-728702-36.patch.
     Generated PATCHES.txt file for drupal
     platform-7.x-1.3 downloaded.
     Build complete

.. code-block:: none

   ~/htdocs/my-project $ ls -a
     .platform-project
     builds
     repository
     shared

Other commands
--------------

Run ``platform list`` to see the other commands provided by the CLI.

.. seealso::
  * :ref:`cli`
  * `Installation instructions on GitHub <https://github.com/platformsh/platformsh-cli/blob/master/README.md>`_.

SSH tunneling
-------------

Use SSH tunneling to connect your local development site to Platform.sh services.

.. code-block:: console

  # Use your own project ID, branch, and specify whether it is the EU or US region (eg. us.platform.sh)
  $ ssh -N -L 3306:database.internal:3306 [project ID]-[branch]@ssh.eu.platform.sh & 
  
After the tunnel is built, you can confirm its presence using the ``fg`` command:

.. code-block:: console

  $ fg
    [1]  + 35203 running    ssh -N -L 3306:database.internal:3306 xjybxziut32me-master@ssh.eu.platform.sh
  # pressing CTRL-C at this point will kill the tunnel.
  # press CTRL-Z to return to the shell without killing the tunnel.

Then you can connect to the remote database normally, as if it were local.

.. code-block:: console

  $ mysql --host=127.0.0.1 --user='' --pass='' --database='main'

