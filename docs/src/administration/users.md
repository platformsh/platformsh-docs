---
title: "User administration"
weight: 1
sidebarTitle: "Users"
description: |
  Every Platform.sh user has a role that controls their access and permission levels. Different roles allow different levels of access to your applications, environments and projects. You can manage how users interact with your project and environments at Platform.sh
---

{{< description >}}

Any user added to a project or an environment type on Platform.sh will need to [register for an account](https://auth.api.platform.sh/register) before they can contribute. If you need to delete your account at any time you can [transfer ownership](/administration/users.md#transfer-ownership) of your existing projects and then open a [support ticket](/development/troubleshoot.md#deleting-your-platformsh-account) to request your account deletion.  

## User roles


Grant user permissions to the entire project:

* **Project Viewer** - A project viewer can view all environments of the project.
* **Project Administrator** - A project administrator can change settings, push code and execute actions on all environments of the project.

{{< note theme="warning" title="Important" >}}
Over the next 6 weeks, we're updating environment access controls, so that you can update users' access to groups of environments. You'll see environment types available in the management console and CLI once it's live. 
{{< /note >}}

You can also define user access per environment type (Production, Staging, Development). Each permission level progressively increases access to the environments part of a given environment type:

* **Viewer** - Viewer can view all environments of this type.
* **Contributor** - Contributor can push code and branch all environments of this type.
* **Administrator** - Administrator can change settings and execute actions on all environments of this type.


{{< note theme="warning" title="Important" >}}
After you add or remove a user from a project or an environment type, you will need to trigger a redeploy to propagate the access changes to each environment.
You can redeploy by using the CLI command `platform redeploy` or the management console button **Redeploy**. 
{{< /note >}}

If you want contributors to be able to see everything across the project, but only commit to environments of a certain type, set their permission as **Project Viewer** for the whole project and their permission on that environment type to **Contributor**.

{{< note >}}
**Project Owner** - is the person licensed to use Platform.sh and whom the project belongs to. A project owner has a project administrator role and is the only person who can delete the project.
{{< /note >}}


## SSH Access

By default, everyone with access equal or greater than `Contributor` can access the project through SSH. 

You can customize who can SSH, by setting the `access` key in your `.platform.app.yaml` file. [See SSH Access restrictions](/configuration/app/access.md).

## Manage user permissions with Console

From your list of projects, select the project where you want to view or edit user permissions. Click the Settings tab at the top of the page, then click the `Access` tab on the left to show the project-level users and their roles.

![Project user management screenshot](/images/management-console/settings-project-access.png)

The `Access` tab shows project-level users and their roles.

Selecting a user will allow you either to edit that user's permissions or delete the user's access to the project entirely.

Add a new user by clicking on the `Add` button.

You can either grant the `Project admin` role to the user, which will give them `Admin` access to every environment in the project, or grant specific permissions on each environment type.

After inviting a new user, if the user does not have a Platform.sh account, they will receive an invitation email asking to confirm their details and register an account.

In order to push and pull code (or to SSH to one of the project's environments) the user will need to add an SSH key or use the Platform CLI.

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

## User access and integrations

If you have setup an [external integration](/integrations/source/_index.md) to GitHub, GitLab, or Bitbucket, this adds an additional layer of access control to the project that you will need to be aware of. It is, for example, possible that a user that has been given admininstrator privileges to a project on Platform.sh is [unable to clone the project](/administration/web/_index.md#git) locally if they have not also been given access to the repository on GitHub. 

They could use the CLI

```bash
$ platform get <projectID>
```

or the command visible from the "Git" dropdown in the management console

```bash
$ git clone git@github.com:user/github-repo.git Project Name
```

and both would give

```bash
Failed to connect to the Git repository: git@github.com:user/github-repo.git

Please make sure you have the correct access rights and the repository exists.
```

despite their `Admin` access to the project.

This is a good thing, as the project functions as a read-only mirror of your remote repository. Otherwise, changes pushed directly to the project would be overwritten or deleted when commits are pushed via the integration. Platform.sh considers your integrated remote repository to be the "source of truth" as soon as it has been configured, and this caveat ensures that all commits go through the integration.

The best course of action is to have your access updated on the integrated repository. If for some reason that is not a quick change, you can still clone through the project using the legacy pattern (which will set the *project* as its remote), but again, it is not recommended that you commit to the project once you have done so:

```bash
$ git clone <project>@git.<region>.platform.sh:<project>.git
```

## Transfer ownership

If you're the owner of a project, and want to transfer it to a different user, first invite that user as a project administrator and then submit a support ticket from your owner account to ask for the transfer.

Transfering a project automatically transfers the upcoming subscription charges to the new owner.
