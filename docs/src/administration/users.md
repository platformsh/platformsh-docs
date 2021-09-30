---
title: "User administration"
weight: 1
sidebarTitle: "User administration"
description: |
  Every Platform.sh user has a set of permissions. Depending on your role, you'll be able to access different levels of the application, environments and projects. If you want to add a user to a project or an environment type, the user has to create an account before they can contribute to the project.
---

{{< description >}}

### User roles

| User role    | Description |
| ------------ |-------------|
| Project owner                   | The organization where the project was created in the first place. There is only one and can create multiple project administrators. You can delete your account any time by [transferring ownership](/administration/users.md#transfer-ownership) of your existing projects. Once you transfer ownership, open a [support ticket](/development/troubleshoot.md#deleting-your-platformsh-account) to request your account deletion. Note that transferring a project automatically transfers the upcoming subscription charges to the new owner. |
|Project Admin | Users who can configure project settings, administer environment permissions, push code, and execute actions on all project environments. |                                                                                                                                                                                              

### Permissions per environment type

Environment types offer a way to group environments (production, staging, and development) together. If you group your environments, you can grant user permissions per environment type at the project level.

A few things to consider:

* Environments can share the same type.
* Environments can change their type from Staging to Development and the other way around.
* After you add or remove a user from a project or an environment type, you must trigger a redeploy to propagate SSH access changes to each environment. You can redeploy by using the CLI command platform redeploy or the Redeploy button in the management console.



| Role                     | Description |
|------------------------- |-------------|
|Viewer                    | Viewers can view all environments of this type.|
|Contributor               | This role includes the viewer permissions. Contributors can push code and branch all environments of this type. By default, everyone with access equal or greater than Contributor can access the environment through SSH. To customize who can use SSH, [set the access key]([support ticket](/development/troubleshoot.md#deleting-your-platformsh-account)) in your platform.app.yaml |
|Admin                     | This role includes viewer and contributor permissions. Administrators can change settings and execute actions on all environments of this type. By default, everyone with access equal or greater than Contributor can access the environment through SSH. To customize who can use SSH [set the access key]([support ticket](/development/troubleshoot.md#deleting-your-platformsh-account)) in your platform.app.yaml|

{{< note theme="warning" title="Warning" >}}
Once you add or remove a user from a project or environment, you must trigger a redeploy to propagate SSH access changes to each environment. Redeploy using the CLI command `platform redeploy` or in the management console, click **Redeploy**.
{{< /note >}}

### Add users from the console

1. Go to your console and select the project where you want to change the user permissions.
2. Under **Settings**, click **Access** on the left-hand side of the console.
Click **+Add**.
3. Add the user details and choose the permissions.
4. Click **Save**.

### Manage users permissions with the CLI

You can use the [Platform.sh CLI (Command Line Interface](/development/cli/_index.md) to fully manage your users and integrate with any automated system.

Available commands:

* `platform user:add`
  * Add a user to the project
* `platform user:delete`
  * Delete a user
* `platform user:list` (`users`)
  * List project users
* `platform user:role`
  * View or change a user's role

 **Example**

 Add `user@example.com` to the project with Project Admin permissions:

```bash
platform user:add alice@example.com -r admin
```
Once you add the user to the project, they receive an invitation email to confirm their details and a registration link.

**Example**

To give Bob different levels of access depending on the environment type, in the current project:

-  **Viewer** role to the **Production environment**
-  **Contributor** role to **all Staging type environments**
-  **Admin** role to **all Development type environments**

You would run:

```bash
platform user:role bob@example.com -r production:viewer -r staging:contributor -r development:admin
```

Use `platform list` to get the full list of commands.
