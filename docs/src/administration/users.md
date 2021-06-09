---
title: "User administration"
weight: 1
sidebarTitle: "Users"
description: |
  Every Platform.sh user has a role which controls access and improves security on your project. Different roles are authorized to do different things with your applications, environments and users. You can use your collection of Roles to manage how users interact with Platform.sh.
---

{{< description >}}

## User roles

{{< note theme="warning" title="Important" >}}
We are deprecating granting user roles on individual environments. You should use environment types instead.
{{< /note >}}

User roles are defined per environment types (Production, Staging, Development):

* **Administrator** - Administrator can change settings and execute actions on all environment of this type.
* **Contributor** - Contributor can push code and branch all environments of this type.
* **Viewer** - Viewer can view all environments of this type.

User roles can also be granted to the entire project:

* **Project Administrator** - A project administrator can change settings and execute actions on all environments of the project.
* **Project Viewer** - A project viewer can view all environments of the project.

{{< note theme="warning" title="Important" >}}
After a user is added to (or removed from) an environment type, all environments of this type will be automatically redeployed, after which the new permissions will be fully updated.

When adding users at the **project level**, however, redeployments do not occur automatically, and you will need to trigger a redeployments to update permissions for each environment. Otherwise, user access will not be updated on those environments until after the next build and deploy commit.
{{< /note >}}

------------------------------------------------------------------------

When a development team works on a project, the team leader can be the project administrator and decide which roles to give his team members.  One team member can contribute to one environment type (e.g Staging), another member can administer a different environment type (e.g Development) and the customer can be a viewer of the Production environment type.

If you want your users to be able to see everything (Project Viewer), but only commit to environments of a certain type, change their permission on that environment type to "Contributor".

{{< note theme="info" title="SSH Access Control">}}
A contributor can push code to the environment and has SSH access to the environment. You can change this by [specifying user types]({{< relref "/configuration/app/access.md" >}}) with SSH access.
{{< /note >}}

{{< note >}}
The project owner - the person licensed to use Platform.sh - doesn't have special powers. A project owner usually has a project administrator role.
{{< /note >}}

## Manage user permissions with Console

From your list of projects, select the project where you want to view or edit user permissions. Click the Settings tab at the top of the page, then click the `Access` tab on the left to show the project-level users and their roles.

![Project user management screenshot](/images/management-console/settings-project-access.jpg)

The `Access` tab shows project-level users and their roles.

Selecting a user will allow you either to edit that user's permissions or delete the user's access to the project entirely.

Add a new user by clicking on the `Add` button.

You can either grant the `Project admin` role to the user, which will give them `Admin` access to every environment in the project, or grant specific permissions on each environment type.

Once this has been done, if the user does not have a Platform.sh account, they will receive an invitation email asking to confirm their details and register an account.

In order to push and pull code (or to SSH to one of the project's environments) the user will need to add an SSH key.

If the user already has an account, they will receive an email with a link to access the project.

## Manage users permissions with the CLI

You can use the Platform.sh command line interface to fully manage your users and integrate this with any other automated system.

Available commands:

* `user:add`
  * Add a user to the project
* `user:delete`
  * Delete a user
* `user:list` (`users`)
  * List project users
* `user:role`
  * View or change a user's role

For example, the following command would add the 'Project admin' role to `alice@example.com` in the current project.

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

Once this has been done, the user will receive an invitation email asking her to confirm her details and register an account.

To give Alice the 'contributor' role on all Development environments, you could run:

```bash
platform user:role alice@example.com --type development --role contributor
```

Use `platform list` to get the full list of commands.

## Transfer ownership

If you want to transfer ownership of a project to a different user, first invite that user as a project administrator and then submit a support ticket from the current project owner to ask for the transfer.

This action will automatically transfer the subscription charges to the new owner.
