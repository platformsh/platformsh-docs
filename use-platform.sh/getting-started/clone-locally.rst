Clone the codebase locally
==========================

Get the Platform CLI
--------------------

The best way to interact with Platform.sh is with the [Platform Command Line Interface](https://github.com/platformsh/platformsh-cli "Link to Github page of Platform CLI") tool. After following the installation instructions on the Github page, you can set up your local development environment with just a couple commands:

.. code-block:: console

   $ platform // this will authenticate you and list your projects
   $ platform get *[project id]* // this will check out the code and build the project locally


Branch an Environment
---------------------

Branching can be done using the Platform.sh UI as well as with the Platform CLI. 

When you :term:`branch` an :term:`environment`, you create a new :term:`environment` which is an exact copy of its parent (*including files, database and services*).

During a :term:`branch` operation, Platform freezes the parent :term:`environment` and takes a snapshot. Then the parent :term:`environment` is released and the child :term:`environment` is built using the snapshot.

To :term:`branch` an environment, click the `Branch` icon on the top right of the :term:`Platform UI` and give it a name (for example: *Sprint1*).

.. seealso::
  * :ref:`best_practices`
  

Clone the codebase with Git
---------------------------

Only clone the codebase with Git directly if you do not use the Platform CLI. Otherwise, the Platform CLI is the tool you're looking for!

You might not need to *run* a copy of your :term:`environment` locally, but you will most likely want to be able to add code to your project. To do that, you need to clone a copy of the codebase for your :term:`environment` down to your local system using Git. If you *do* want to run a copy of your environment locally, you will probably want to do so with a copy of the database from this :term:`environment`.

.. note::
   Make sure you have Git installed and you have uploaded your public SSH key prior to running this command. See the :ref:`technical_requirements` for more information.

One of the first elements you'll see at the top of the Platform interface is a "PULL | CLONE" text widget. You can use the commands listed there to clone the branch you are currently viewing.

.. figure:: /use-platform.sh/getting-started/images/pull-clone-copy.png
  :alt: Pull or Clone your repository

  Select **CLONE** on the widget and copy the command listed in the adjacent text box. It should start with 'git clone'.

----

.. image:: /use-platform.sh/getting-started/images/icon-warning.png
  :alt: SSH warning
  :align: left

If you haven't added an :term:`SSH key` to your user account, you will see a notice to do so. Add your SSH keys through the `Commerce Guys Marketplace account <https://marketplace.commerceguys.com/user>`_. On your account page, click on the SSH Keys tab to add your SSH Keys.

----

In your terminal, paste the command you copied and add a name for the folder at the end of the command:

.. code-block:: console

   $ git clone --branch [branch-name] [project-id]@git.eu.platform.sh:[project-id].git project-folder-name

Once you have cloned the branch locally, you can see the files that are contained in the Git repository.

.. note::
   * Make sure you copy your commands from the Platform interface. Bonus points if you have your platform id memorized.
