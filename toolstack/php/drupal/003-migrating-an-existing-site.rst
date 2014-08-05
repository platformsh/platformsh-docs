Migrating an Existing Site
==========================

Exporting an Existing Site
--------------------------

If you have :ref:`SSH <ssh>` access, it is recommended that you export your existing site using :ref:`Drush <drush>`.

Once you're logged into the root of your existing site, you can use the following command to create a package of your website that you can then use locally.

.. code-block:: console

  $ drush archive-dump

You can use the ``--destination`` or ``--no-core`` options for this command to control where the file is downloaded to or limit your package to just your site-specific files. The file downloaded this way will include an sql-dump as well as the code and files of your website.

Be sure to get your website working on your local machine before following the steps below to import that website into Platform.

Importing Data Into Platform
----------------------------

If you want to migrate your existing site into Platform, you have 3 things you need to import: *code base*, *database* and *files*.

.. note:: This documentation supposes you're used to work with a terminal.

Import your code base
^^^^^^^^^^^^^^^^^^^^^

This will depend wether you have Git already set up for your project or not.

Your project already uses Git
*****************************

If you're already working with Git for your project, then you simply need to add a **platform** remote repository. In that case, you will keep your existing Git history.

On a terminal, go to your Git project folder and add **platform** as a remote.

.. code-block:: console

   $ cd ~/Sites/platform
   $ git remote add platform [project-id]@git.eu.platform.sh:[project-id].git

.. note:: You can get the Git URL from the Platform UI under the Git icon.

Then push your local branch to your **platform** remote.

.. code-block:: console

   $ git push platform HEAD:master

Both on the terminal and on the Platform UI, you should see your :term:`Master` environment being built.

Your project doesn't use Git yet
********************************

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

Import your Database
^^^^^^^^^^^^^^^^^^^^

We use *drush aliases* to import your existing local database into Platform.

Before playing with the aliases, please backup your local database using drush sql-dump.

.. code-block:: console

   $ drush sql-dump @platform.local > backup_database.sql

You can also sanitize your database prior to import it into Platform by running:

.. code-block:: console

   $ drush sql-sanitize @platform.local

When you're ready, import your database to your Platform environment.

.. code-block:: console

   $ drush sql-cli @platform.local @platform.master

When the process completes, you can visit the URL of your development environment and test that the database has been properly imported.

Import your Files
^^^^^^^^^^^^^^^^^

We use *drush alias* to import your existing local files.

.. code-block:: console

   $ drush rsync @platform.local:%files @platform.master:%files
   You will destroy data from [project-id]-master@ssh.eu.platform.sh:././sites/default/files and replace with data from ~/Sites/platform/sites/default/files/
   Do you really want to continue? (y/n): y

.. note:: Drush will verify that you are copying and over-writing the proper files folders, so double-check that information before you type ``y`` to continue.

This step may take some time, but when the process completes, you can visit the url of your development environment and test that the files have properly been imported.


Copy the database using drush
-----------------------------

Need to get a copy of your site's database locally? The easiest way to do that is to use Drush and the sql-sync command. You'll need to have :ref:`create-drush-aliases` setup for both your Platform site and your local site. If you are using the `Platform CLI <https://github.com/commerceguys/platform-cli>`_ and you've run ``platform get [platform_id]`` for a project, then your Platform aliases have already been setup.

With the :ref:`create-drush-aliases` (depending on how yours are set up), you could use a command similar to this:

.. code-block:: console

   $ drush sql-sync @platform.master @platform.local

With the *Platform CLI* you can run this command from the branch that you wish to synchronize.

.. code-block:: console

  $ platform environment:synchronize

.. seealso::
  * :ref:`Drush <drush>`
  * :ref:`create-drush-aliases`
  * :ref:`cli`
