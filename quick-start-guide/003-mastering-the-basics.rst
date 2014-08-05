Mastering the Basics - Part 3
=============================

Now that you know how to push your code and test it on specific :term:`environment`, let's discover some other great features that Platform offers.

Create Hierarchical environments
--------------------------------
.. figure:: images/clone-hierarchy.png
   :alt: Understand hierarchical environments.

   Platform allows you to organize and structure your :term:`environments <environment>` as you want.

When you :term:`Branch` an :term:`environment`, this creates a child of this :term:`environment`. Each child :term:`environment` can :term:`Sync` code and/or data from his parent and :term:`merge` code to his parent.

.. seealso::
  * :ref:`best_practices`

User permissions
----------------
Permissions on hierarchical environments are inherited from the first parent. Additionally, in the project editing interface you can select specific roles on a per-environment basis.

.. figure:: images/clone-hierarchy-permissions.png
   :alt: Permissions in a hierarchy.

   **NOTE:** Permissions in a hierarchy can be inherited.

.. seealso::
  * :ref:`getting_help`

Pull code from private Git repositories
---------------------------------------
Let's say you're building a module (*or theme, library...*) which is stored in a private Git repository that you have access to and want to use it on your project.

Platform allows you to get code that is stored in a private Git repository, directly from your :term:`make file`.

.. figure:: images/ssh-key.png
   :alt: Get the project public SSH key.

   Copy the project public SSH key on the *Access Control* tab of the project configuration screen.

To grant Platform access to your private Git repository, you need to add the project public SSH key in the deploy keys of your Git repository. If your private repository is on Github, go to the target repository's settings page. Go to *Deploy Keys* and click *Add deploy key*. Paste the public SSH key in and submit.

If you're using Drupal for example, you can now use your private module by adding it to your :term:`make file`:

.. code-block:: ini

  ; Add private repository from Github
  projects[module_private][type] = module
  projects[module_private][subdir] = "contrib"
  projects[module_private][download][type] = git
  projects[module_private][download][branch] = dev
  projects[module_private][download][url] = "git@github.com:guguss/module_private.git"
