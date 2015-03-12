.. _user_administration:

User administration
===================

User roles
----------

Every Platform.sh user has a role. A role allows to control access and improve security on your project - different roles are authorized to do different things with your applications, environments and users. You can use your collection of Roles to manage how users interact with Platform.sh.

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

.. seealso::
   * :ref:`Manage users at the project level <ui_project_users>`
   * :ref:`Manage users at the environment level <ui_environment_users>`
