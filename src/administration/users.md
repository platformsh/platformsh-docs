# User administration

##User roles

Every Platform.sh user has a role which controls access and improves security on your project. Different roles are authorized to do different things with your applications, environments and users. You can use your collection of Roles to manage how users interact with Platform.sh.

At the project level:

* **Project Administrator** - A project administrator can change settings and execute actions on any environment.
* **Project Viewer** - A project reader can view all environments within a project but cannot execute any actions on them.

A Project Reader can have a specific role on different environments. At the environment level:

* **Environment Administrator** - An environment administrator can change settings and execute actions on this environment.
* **Environment Contributor** - An environment contributor can push code to this environment and branch the environment.
* **Environment Viewer** - An environment reader can only view this environment.

> **Important!**
>
> After a new user is added to an environment, it needs to be rebuilt. Rebuilds are triggered when you push a new commit to the environment in question.  To be able to rebuild without new code changes you can issue the command `git commit --allow-empty -m'rebuild' && git push` to create an empty commit and "force" rebuilding the environment.
>
> When the environment rebuild is complete, allow a minute for the routes to update fully and for the new user to be able to use SSH access.

------------------------------------------------------------------------

When a development team works on a project, the team leader can be the project administrator and decide which roles to give his team members.  One team member can contribute to one environment, another member can administer a different environment and the customer can be a reader of the `master` environment.

If you want your users to be able to see everything (Reader), but only commit to a specific branch, change their permission level on that environment to "Contributor".

> **SSH Access Control**
>
> An environment contributor can push code to the environment and has SSH access to the environment. You can change this by [specifying user types](/configuration/app/access.md) with SSH access.

> **note**
>
> The project owner - the person licensed to use Platform.sh - doesn't have special powers. A project owner usually has a project administrator role.

------------------------------------------------------------------------

## Manage user permissions at the project level

From your list of projects, select the project where you want to view or edit user permissions. At this point, you will not have selected a particular environment. Click the Settings tab at the top of the page, then click the `Access` tab on the left to show the project-level users and their roles. 

![Project user management screenshot](/images/mgmt-console/settings-project-access.png)

The `Access` tab shows project-level users and their roles.

Selecting a user will allow you either to edit that user's permissions or delete the user's access to the project entirely.

Add a new user by clicking on the `Add` button.

If you select the "Viewer" role for the user, you'll have the option of adjusting the user's permissions at the environment level.

From this view, you can assign the user's access. Selecting them to become a "Project admin" will give them "Admin" access to every environment in the project. Alternatively, you can give the user "Admin", "Viewer", "Contributor", or "No Access" to each environment separately. 

If you select the "Viewer" role for the user, you'll have the option of adjusting the user's permissions at the environment level. 

Once this has been done, if the user does not have a Platform.sh account, they will receive an email asking to confirm their details and register an account name and a password.

In order to push and pull code (or to SSH to one of the project's environments) the user will need to add an SSH key.

If the user already has an account, they will receive an email with a link to the project.

------------------------------------------------------------------------


## Manage user permissions at the environment level

From within a project select an environment from the `ENVIRONMENT` pull-down menu. 

Click the `Settings` tab at the top of the screen and then click the `Access` tab on the left hand side.

![Project user management screenshot](/images/mgmt-console/settings-environment-access.png)

The `Access` tab shows environment-level users and their roles.

Selecting a user will allow you either to edit that user's permissions or delete the user's access to the environment entirely.

Add a new user by clicking on the `Add` button.

> **note**
>
> Remember the user will only be able to access the environment once it has been rebuilt (after a `git push`)

------------------------------------------------------------------------
## Manage users with the CLI

You can user the Platform.sh command line client to fully manage your users and integrate this with any other automated system.

Available commands:

* `user:add`
  * Add a user to the project
* `user:delete`
  * Delete a user
* `user:list` (`users`)
  * List project users
* `user:role`
  * View or change a user's role

For example, the following command would add the 'admin' role to alice@example.com in the current project.

```bash
platform user:add
```

This will present you with an interactive wizard that will allow you to choose precisely what rights you want to give the new user.

```bash
$ platform user:add

Email address: alice@example.com
The user's project role can be 'viewer' ('v') or 'admin' ('a').
Project role [V/a]:
The user's environment-level roles can be 'viewer', 'contributor', or 'admin'.
development environment role [V/c/a]:
sprint1 environment role [V/c/a]:
hot-fix environment role [V/c/a]:
master environment role [V/c/a]:
pr-2 environment role [V/c/a]:
pr-3 environment role [V/c/a]:
Summary:
    Email address: alice@example.com
    Project role: viewer
    development: viewer
    sprint1: viewer
    hot-fix: viewer
    pr-2: viewer
    pr-3: viewer
Adding users can result in additional charges.
Are you sure you want to add this user? [Y/n]
User alice@example.com created
```

Once this has been done, the user will receive an email asking her to confirm her details and register an account name and a password.

To give Alice the 'contributor' role on the environment 'development', you could run:

```bash
platform user:role alice@example.com --level environment --environment development --role contributor
```

Use `platform list` to get the full list of commands.

## Transfer ownership

If you want to transfer ownership of a project to a different user, first invite that user as a project administrator and then submit a support ticket from the current project owner to ask for the transfer.

This action will automatically transfer the subscription charges to the new owner.
