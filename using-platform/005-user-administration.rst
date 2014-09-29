User Administration
===================

Everyone who uses platform has an account in Marketplace and one or more user roles. The marketplace account stores all the user profile information, like password, SSH key and e-mail address. A role defines how much a user can do on Platform. 

User Roles
----------
Every Platform user has a role. A role is a security idea - different roles are authorized to do different things with projects, environments and users. You can use your collection of Roles to manage how users interact with Platform. 

.. todo:: Define the roles better.

* **Project Administrator** - A project administrator can change settings for all environments. 
* **Project Reader** - A project reader has view all environments in a project. 
* **Environment Administrator** - An environment administrator can change settings for an environment. 
* **Environment Contributor** - A contributor has access to push code updates to an environment. 
* **Environment Reader** - A reader has access to view an environment. 

One user can have many roles. A project reader can be an admin on some environments and a contributor on other environments. 

When a development team works on a project, the team leader can be the project admin and decide which roles to give her team members. One team member can contribute to one environment, another member can administer a different environment and the customer can be a reader of the master environment. 

If you want your users to be able to see everything (Reader), but only commit to a specific branch, change their permission level on that branch to "Contributor".

A project owner - the person licensed to use Platform - doesn't have special powers. A project owner usually has a project admin role. 


----

Manage User Permissions at the Project Level
--------------------------------------------

  Access the project level configuration.

  .. image:: /using-platform/images/project_w-configarrow.png
     :alt: Project configure icon
     :align: left

  | Click the project configuration icon next to the project name in the upper left corner of the project page.

----

  Manage users.

  .. image:: /using-platform/images/project_usermanagement.png
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

  .. image:: /using-platform/images/environment_w-configarrow.png
     :alt: Project configure icon
     :align: left

  | Click the environment configuration icon next to the environment name on the project page.

----

  Manage users.

  .. image:: /using-platform/images/environment_usermanagement.png
     :alt: Project user management screenshot
     :align: left
     :width: 400px

  | The ``User Management`` tab shows environment level users and their roles.
  |
  | Selecting a user will allow you to either edit that users permissions or delete the users access to the environment entirely.
  |
  | Add a new user by clicking on the ``Add user`` button.
  |
