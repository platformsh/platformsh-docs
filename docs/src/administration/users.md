---
title: "Users"
weight: 1
sidebarTitle: "User administration"
description: |
  Every Platform.sh user has a role that controls their access and permission levels.
---

{{< description >}}

If you are an owner or a Project admin wanting to add a user to a project or an environment, the user has to create an account before they can contribute to the project.

## User roles

| User role    | Description |
| ------------ |-------------|
|Project owner| There is only one and they can create multiple Project admins.  |
|Project admin | Users who can configure project settings, manage other users,  administer environment permissions, push code, and execute actions on all project environments.|

### Transfer a project ownership

If you’re the owner of a project and want to transfer ownership to a different user, first invite that user as a Project admin and then, submit a support ticket from your owner account to ask for the transfer. Transferring a project automatically transfers the upcoming subscription charges to the new owner. Once you transfer ownership, open a [support ticket](/development/troubleshoot.html) to request your account deletion.                                                                                                      

## Environment types

Platform.sh offers three types of environment groups: Production, Staging and
Development. You can assign permissions to each user per environment so for each environment type, users will always have the same set of permissions across all environments of the same type.

For example, if you assign user1 **Admin** permissions for Development environments,  
**Contributor** permissions for Staging environments and **Viewer** for the Production environment. User1 will have **Admin** permissions to all development environments, **Contributor** permissions to all staging environments and **Viewer** permissions to the Production environment.

A few things to consider:

* Only one environment per project can have Production type.
* Environments can share the same Staging and Development type.
* After you add or remove a user from a project or an environment type, you must trigger a redeploy to propagate SSH access changes to each environment. You can redeploy by using the CLI command platform `redeploy` or by clicking **Redeploy** in the management console.


| Environment permission   | Description |
|------------------------- |-------------|
|Viewer                    | Viewers can view all environments of this type. This role includes the Viewer permissions.|
|Contributor               | Contributors can push code and branch all environments of this type
|Admin                     | This role includes Viewer and Contributor permissions. Admins can change settings and execute actions on all environments of this type. To customize who can use SSH [set the access key](/configuration/app/access.html) in your platform.app.yaml|

## Managing users

### Add a user from the console

1. Go to your console and select the project where you want to change the user permissions.
2. Under **Settings**, click **Access**.
Click **+ Add** and add the user details and choose the permissions.
4. Click **Save**.
Once you add the user to the project, they receive an invitation email to confirm their details and a registration link

### Add a user with the CLI

You can use the [Platform.sh CLI (Command Line Interface)](/development/cli/_index.md) to fully manage your users and integrate with any automated system.

Available commands:

* `platform user:add`
  * Add a user to the project
* `platform user:delete`
  * Delete a user
* `platform user:list` (`users`)
  * List project users
* `platform user:role`
  * View or change a user's role

 Add `user1@example.com` to the project with Project Admin permissions:

```bash
platform user:add user1@example.com -r admin
```
Once you add the user to the project, they receive an invitation email to confirm their details and a registration link.

Say you wanted to give User2 the following roles in different environment types:

-  **Viewer** role in the **Production environment**
-  **Contributor** role in **all staging environments**
-  **Admin** role in **all development environments**

Once you add the user to the project, they receive an invitation email to confirm their details and a registration link.

Use `platform list` to get the full list of commands.
