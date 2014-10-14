User Administration
===================

User Roles
----------
Roles are used to allow flexibility in managing how users interact with your project. A user can be granted a role on either the project level or on an environment level. Currently, there are three different roles with specific kinds of permissions.

.. todo:: Define the roles better.

* **Admin** - An administrator has access to all environments and can change environment settings for all environments. *This role can be granted on either the project level or an environment level.*
* **Contributor** - A contributor has access to push code updates to a particular environment. *This role can only be granted on an environment level.*
* **Reader** - A reader has access to view a specific environment or the whole project. *This role can be granted on either the project level or an environment level.*

There is great flexibility here. For example, if you wanted your users to be able to see everything (Reader), but only commit to a specific branch, change their permission level on that branch to "Contributor".

----

Manage User Permissions at the Project Level
--------------------------------------------

  Access the project level configuration.

  .. image:: /use-platform.sh/images/project_w-configarrow.png
     :alt: Project configure icon
     :align: left

  | Click the project configuration icon next to the project name in the upper left corner of the project page.

----

  Manage users.

  .. image:: /use-platform.sh/images/project_usermanagement.png
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

  .. image:: /use-platform.sh/images/environment_w-configarrow.png
     :alt: Project configure icon
     :align: left

  | Click the environment configuration icon next to the environment name on the project page.

----

  Manage users.

  .. image:: /use-platform.sh/images/environment_usermanagement.png
     :alt: Project user management screenshot
     :align: left
     :width: 400px

  | The ``User Management`` tab shows environment level users and their roles.
  |
  | Selecting a user will allow you to either edit that users permissions or delete the users access to the environment entirely.
  |
  | Add a new user by clicking on the ``Add user`` button.
  |
