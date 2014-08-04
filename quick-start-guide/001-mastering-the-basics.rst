Mastering the Basics - Part 1
=============================

Once you've purchased a Platform package, you will be automatically redirected to your new Platform account. You can access your existing Platform accounts through your `Commerce Guys Marketplace account <https://marketplace.commerceguys.com/user>`_. Once you've logged in, click on the "Platforms" tab on your user account page. You will find a list of platform projects with links to each of them.

Install Kickstart / Drupal / Empty Git
--------------------------------------

.. figure:: /quick-start-guide/images/ui-setup.png
  :alt: Platform Setup

  The first time you access the :doc:`/platform-components/platform-interaction-methods/001-platform-web-ui`, you'll see the project setup wizard which helps you to configure your project.

Choose a name for your project (this could be the domain of the site you are working on) and then choose a starting point:

* **Commerce Kickstart**: The quickest way to get up and running with Drupal Commerce.
* **Drupal 7**: Standard Drupal 7 installation profile.
* **From scratch**: Empty Git repository. Choose this option if you are migrating an existing site.

Once you’re done, Platform will build your project and provide you a default :term:`environment` called :term:`Master`.

.. note::
   Choosing either 'Commerce Kickstart' or 'Drupal 7' will cause Platform to generate a :term:`make file` in the root of your repository. This :term:`make file` will be used to build your site.

.. seealso::
   * :doc:`/using-platform/003-migrating-an-existing-site`

First look at Platform
----------------------

.. figure:: /quick-start-guide/images/ui-intro.png
  :alt: Platform UI

  Once you've completed your project setup, you will be sent to your new project page. Now you can start working with Platform!

  1. **Project selection and configuration -** Switch between projects, or manage the configurations of the current project. Changing the project here will update everything below it to the current project.
  2. **Account administration, support, and documentation-** Use these quick access links to documentation resources, support options, or your current user account information.
  3. **Environment indicator, access information, and configuration-** This will tell you which environment (or branch) you are currently working in. The configuration icon and website link will apply specifically to this environment.
  4. **Git branch, synchronize, merge, and backups-** These primary actions are used for your regular development workflow for the specific environment. Read more about these actions in the :doc:`/platform-components/platform-interaction-methods/001-platform-web-ui` section.
  5. **Environment selector-** Switch between environment contexts. When you create a new branch by clicking the branch action link, those environemtns will appear here. Selecting an environment here will change everything to the right of this to that environment's context.
  6. **Environment activity stream-** Follow the latest activity for the current environment.


---------

.. image:: /quick-start-guide/images/icon-configure.png
  :alt: Configure icon
  :align: left

The **configuration icon** is a contextual link. It will direct you to the configuration settings for either the current :term:`project` or :term:`environment` that you are viewing.

--------

.. seealso::
  * :doc:`/platform-components/platform-interaction-methods/001-platform-web-ui`

Access Your Site
----------------
Each :term:`environment` has its own URL that you can access by clicking *View this website* under its name.

.. figure:: images/platform-getting-started-01.png
   :alt: Accessing an environment from the UI.

---------

.. image:: /quick-start-guide/images/icon-configure.png
  :alt: Configure icon
  :align: left

You can administer the Settings, Variables, Routes, and Users specifically for each :term:`environment` by clicking the **configuration icon** here.

--------

.. _branch-an-environment:

Branch an Environment
---------------------
When you :term:`branch` an :term:`environment`, you create a new :term:`environment` which is an exact copy of its parent (*including files, database and services*).

During a :term:`branch` operation, Platform freezes the parent :term:`environment` and takes a snapshot. Then the parent :term:`environment` is released and the child :term:`environment` is built using the snapshot.

To :term:`branch` an environment, click the `Branch` icon on the top right of the :term:`Platform UI` and give it a name (for example: *Sprint1*).

.. seealso::
  * :doc:`/using-platform/001-best-practices`

-------------------------------------
Make a Local Copy of Your Environment
-------------------------------------

You might not need to *run* a copy of your :term:`environment` locally, but you will most likely want to be able to add some modules, themes, libraries or some custom code. To do that, you need to clone a copy of the codebase for your :term:`environment` down to your local system using Git. If you *do* want to run a copy of your environment locally, you will probably want to do so with a copy of the database from this :term:`environment`.

.. note::
   Make sure you have Git installed and you have uploaded your public SSH key prior to running this command. See the :doc:`/introduction/002-technical-requirements` for more information.

.. seealso::
   `Push changes to an environment </quick-start-guide/002-mastering-the-basics.html#push-changes-to-an-environment>`_

Clone the codebase with Git
---------------------------

One of the first elements you'll see at the top of the Platform interface is a "PULL | CLONE" text widget. You can use the commands listed there to clone the branch you are currently viewing.

.. figure:: /quick-start-guide/images/pull-clone-copy.png
  :alt: Pull or Clone your repository

  Select **CLONE** on the widget and copy the command listed in the adjacent text box. It should start with 'git clone'.

----

.. image:: /quick-start-guide/images/icon-warning.png
  :alt: SSH warning
  :align: left

If you haven't added an :term:`SSH key` to your user account, you will see a notice to do so. Add your SSH keys through the `Commerce Guys Marketplace account <https://marketplace.commerceguys.com/user>`_. On your account page, click on the SSH Keys tab to add your SSH Keys.

----

In your terminal, paste the command you copied and add a name for the folder at the end of the command:

.. code-block:: console

   $ git clone --branch [branch-name] [project-id]@git.eu.platform.sh:[project-id].git project-folder-name

Once you have cloned the branch locally, you can see the files that are contained in the Git repository:

.. code-block:: console

   $ cd project-folder-name
   $ ls
      project.make

If you selected an option other than 'From scratch' during your Platform setup, you'll see that Platform initialized your Git repository with a single :term:`make file`. Platform uses a :term:`make file` to build your site. In the :term:`make file`, you can add any contributed modules, themes or libraries you need. You can also add your custom code within specific folders (``modules/``, ``themes/`` or ``libraries/``) in the repository, like you would for any Drupal site.

.. note::
   A couple of things you should know:

   * Platform was built with many best practices in mind. That's why instead of storing a complete copy of the Drupal files, we actually advise you to only commit a :term:`make file`, which will contain the list of the contributed projects you want to use on your site. To learn more about those best practices, have a look at :doc:`../using-platform/001-best-practices`.

   * Make sure you copy your commands from the Platform interface. Bonus points if you have your platform id memorized.

Copy the database using drush
-----------------------------

Need to get a copy of your site's database locally? The easiest way to do that is to use Drush and the sql-sync command. You'll need to have :ref:`Drush aliases <create-drush-aliases>` setup for both your Platform site and your local site. If you are using the `Platform CLI <https://github.com/commerceguys/platform-cli>`_ and you've run ``platform get [platform_id]`` for a project, then your Platform aliases have already been setup.

With the :ref:`Drush aliases <create-drush-aliases>` (depending on how yours are set up), you could use a command similar to this:

.. code-block:: console

   $ drush sql-sync @platform.master @platform.local

With the *Platform CLI* you can run this command from the branch that you wish to synchronize.

.. code-block:: console

  $ platform environment:synchronize

.. seealso::
  * :doc:`/platform-components/platform-interaction-methods/003-drush`
  * :ref:`create-drush-aliases`
  * :doc:`/platform-components/platform-interaction-methods/002-command-line-interface`
