Migrate an Existing Site to Platform
====================================

If you want to migrate your existing site into Platform, here are the 3 components you need to import: *code base*, *database* and *files*.

Import your code base
---------------------

This will depend wether you have Git already set up for your project or not.

Your project already uses Git
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you're already working with Git for your project, then you simply need to add a **platform** remote repository. In that case, you will keep your existing Git history.

On a terminal, go to your Git project folder and add **platform** as a remote.

.. code-block:: console

   $ cd ~/Sites/platform
   $ git remote add platform [project-id]@git.eu.platform.sh:[project-id].git

.. note:: You can copy-paste the Git URL from the Platform UI under the Git icon.

Then push your local branch to your **platform** remote.

.. code-block:: console

   $ git push platform HEAD:master

Both on the terminal and on the Platform UI, you should see your :term:`Master` environment being built.

Your project doesn't use Git yet
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you're not working with Git for your project, then you'll need to initialize your repo.

On a terminal, go to your project folder, initiate the Git repository, and add a **platform** remote repository.

.. code-block:: console

   $ cd ~/Sites/mysite
   $ git init
   $ git remote add platform [project-id]@git.eu.platform.sh:[project-id].git

.. note:: You can get the Git URL from the Platform UI under the Git icon.

Commit your project to the **platform** remote repository and push the code.

.. code-block:: console

   $ git add *
   $ git commit -m "Initial commit of My Site"
   $ git push platform master

.. note:: *git init* should have created a default *master* branch for you locally, so you can directly push that branch to you *master* remote branch on Platform.

Both on the terminal and on the Platform UI, you should see your :term:`Master` environment being built.

Import your database
--------------------

With Drush
^^^^^^^^^^

You can use *drush aliases* to import your existing local database into Platform.

.. seealso::
  * :ref:`create_drush_aliases`

Before playing with the aliases, you should backup your local database using drush sql-dump.

.. code-block:: console

   $ drush sql-dump @platform.local > backup_database.sql

You can also sanitize your database prior to import it into Platform by running:

.. code-block:: console

   $ drush sql-sanitize @platform.local

When you're ready, import your database to your remote Platform environment.

.. code-block:: console

   $ drush sql-sync @platform.local @platform.master

When the process completes, you can visit the URL of your development environment and test that the database has been properly imported.

Without Drush
^^^^^^^^^^^^^

Export your database in a sql file or in a compressed file.

Copy it via SSH to the remote environment on Platform into the ``/app/tmp`` folder which is writable:

.. code-block:: console

   $ scp database.sql [project-id]-master@ssh.eu.platform.sh:/app/tmp

Log in to the environment via SSH and import the database:

.. code-block:: console

   $ ssh [project-id]-master@ssh.eu.platform.sh
   web@[project-id]-master--php:~$ mysql -h database.internal main < tmp/database.sql

Import your files
-----------------

With Drush
^^^^^^^^^^

We use *drush alias* to import your existing local files.

.. code-block:: console

   $ drush rsync @platform.local:%files @platform.master:%files
   You will destroy data from [project-id]-master@ssh.eu.platform.sh:././sites/default/files and replace with data from ~/Sites/platform/sites/default/files/
   Do you really want to continue? (y/n): y

.. note:: Drush will verify that you are copying and over-writing the proper files folders, so double-check that information before you type ``y`` to continue.

This step may take some time, but when the process completes, you can visit the url of your development environment and test that the files have properly been imported.

Without Drush
^^^^^^^^^^^^^

Go to your files folder on your local machine and synchronise them to your remote Platform environment:

.. code-block:: console

   $ rsync -r files/. [project-id]-master@ssh.eu.platform.sh:public/sites/default/files/
