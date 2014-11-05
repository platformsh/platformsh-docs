User Administration
===================

User Roles
----------

Every Platform.sh user has a role. A role allosws to control access and improve security on your project - different roles are authorized to do different things with your applications, environments and users. You can use your collection of Roles to manage how users interact with Platform.sh.

At the project level:

* **Project Administrator** - A project administrator can change settings and execute actions to any environment. 
* **Project Reader** - A project reader can view all environments within a project but cannot execute any action to those.

A Project Reader can have specific role on different environments: 

* **Environment Administrator** - An environment administrator can change settings and execute actions this environment. 
* **Environment Contributor** - An environment contributor can push code to this environment. He can also branch the environment. 
* **Environment Reader** - An environment reader can only view this environment. 

When a development team works on a project, the team leader can be the project administrator and decide which roles to give his team members. One team member can contribute to one environment, another member can administer a different environment and the customer can be a reader of the master environment.

If you want your users to be able to see everything (Reader), but only commit to a specific branch, change their permission level on that branch to "Environment Contributor".

.. note::
  The project owner - the person licensed to use Platform.sh - doesn't have special powers. A project owner usually has a project administrator role. 

----

Manage User Permissions at the Project Level
--------------------------------------------

  Access the project level configuration.

  .. image:: /use-platform/images/project_w-configarrow.png
     :alt: Project configure icon
     :align: left

  | Click the project configuration icon next to the project name in the upper left corner of the project page.

----

  Manage users.

  .. image:: /use-platform/images/project_usermanagement.png
     :alt: Project user management screenshot
     :align: left
     :width: 400px

  | The ``Access control`` tab shows project level users and their roles.
  |
  | Selecting a user will allow you to either edit that users permissions or delete the users access to the project entirely.
  |
  | Add a new user by clicking on the ``Add user`` button.
  |
  | If you select the 'Reader' role for the user, you'll have the option of adjusting the users permissions at the environment level.
  |

----

Manage User Permissions at the Environment Level
------------------------------------------------

  Access the environment level configuration.

  .. image:: /use-platform/images/environment_w-configarrow.png
     :alt: Project configure icon
     :align: left

  | Click the environment configuration icon next to the environment name on the project page.

----

  Manage users.

  .. image:: /use-platform/images/environment_usermanagement.png
     :alt: Project user management screenshot
     :align: left
     :width: 400px

  | The ``User Management`` tab shows environment level users and their roles.
  |
  | Selecting a user will allow you to either edit that users permissions or delete the users access to the environment entirely.
  |
  | Add a new user by clicking on the ``Add user`` button.
  |
