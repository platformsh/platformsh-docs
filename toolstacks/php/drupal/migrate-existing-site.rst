Migrate an existing site to Platform.sh
=======================================

To migrate your existing site into Platform.sh, here are the three components you need to import: *code base*, *database* and *files*.

Import your code base
---------------------

This will depend wether you have Git already set up for your project or not.

Your project already uses Git
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you're already working with Git for your project, then you simply need to add a **platform** remote repository. In that case, you will keep your existing Git history.

On a terminal, go to your Git project folder and add **platform** as a remote.

.. code-block:: console

   $ cd ~/Sites/platform
   $ git remote add platform [PROJECT-ID]@git.[CLUSTER].platform.sh:[PROJECT-ID].git

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
   $ git remote add platform [PROJECT-ID]@git.[CLUSTER].platform.sh:[PROJECT-ID].git

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

   $ drush @platform.local sql-dump > backup_database.sql

You can also sanitize your database prior to import it into Platform by running:

.. code-block:: console

   $ drush @platform.local sql-sanitize

When you're ready, export your local database and then import it into your remote Platform environment.

.. code-block:: console

   $ drush @platform.local sql-dump > local_database.sql
   $ drush @platform.master sql-cli < local_database.sql

When the process completes, you can visit the URL of your development environment and test that the database has been properly imported.

Without Drush
^^^^^^^^^^^^^

Export your database in an SQL file or in a compressed file.

Copy it via SSH to the remote environment on Platform into the ``/app/tmp`` folder which is writable:

.. code-block:: console

   $ scp database.sql [PROJECT-ID]-master@ssh.[CLUSTER].platform.sh:/app/tmp

Log in to the environment via SSH and import the database:

.. code-block:: console

   $ ssh [PROJECT-ID]-master@ssh.[CLUSTER].platform.sh
   web@[PROJECT-ID]-master--php:~$ mysql -h database.internal main < tmp/database.sql

Import your files
-----------------

With Drush
^^^^^^^^^^

We use *drush alias* to import your existing local files.

.. code-block:: console

   $ drush rsync @platform.local:%files @platform.master:%files
   You will destroy data from [PROJECT-ID]-master@ssh.[CLUSTER].platform.sh:././sites/default/files and replace with data from ~/Sites/platform/sites/default/files/
   Do you really want to continue? (y/n): y

.. note:: Drush will verify that you are copying and over-writing the proper files folders, so double-check that information before you type ``y`` to continue.

This step may take some time, but when the process completes, you can visit the URL of your development environment and test that the files have properly been imported.

Without Drush
^^^^^^^^^^^^^

Go to your files folder on your local machine and synchronize them to your remote Platform environment:

.. code-block:: console

   $ rsync -r files/. [PROJECT-ID]-master@ssh.[CLUSTER].platform.sh:public/sites/default/files/

Rebuild the site registry
-------------------------

During the migration process, one or more modules may have changed location. This could result in a WSOD (white screen of death), any number of errors (fatal or otherwise), or just a plain broken site. To remedy this situation, the `registry will need to be rebuilt <https://www.drupal.org/project/registry_rebuild>`_. To rebuild the Drupal registry on your Platform.sh instance, you will need to do the following:

First, SSH into your web container.

.. code-block:: console

   $ ssh [PROJECT-ID]-master@ssh.[CLUSTER].platform.sh

Second, execute the following commands to download, tweak, and run the registry rebuild.

.. code-block:: console

   $ drush dl registry_rebuild --destination=/app/tmp
   $ sed -i 's/, define_drupal_root()/, '"'"'\/app\/public'"'"'/' /app/tmp/registry_rebuild/registry_rebuild.php
   $ cd /app/public
   $ php ../tmp/registry_rebuild/registry_rebuild.php
