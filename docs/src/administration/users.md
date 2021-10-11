---
title: "Users"
weight: 1
sidebarTitle: "User administration"
description: |
  Learn how to add and delete users, as well as how to assign user permissions per environment type.
---

{{< description >}}

## User roles

Every Platform.sh user has a role that controls their access and permission levels.
If you are an organization owner, or an organization user with **manage plan** permissions wanting to add a user to a project or an environment, the user has to create an account before they can contribute to the project.

| User role    | Description |
| ------------ |-------------|
|Project Owner| There is only one and they can create multiple Project Admins.  |
|Project Admin | Users who can configure project settings, manage other users, administer environment permissions, push code, and execute actions on all project environments.|


## Environment types

Each environment type groups one or more environments together so that you can manage access for all environments of a certain type.
Platform.sh offers three types of environment groups: Production, Staging, and Development.
You can assign user permissions for each environment type.
Any permissions you assign to an environment type apply to all environments of that type.

For example, if you assign user1 **Admin** permissions for Development environments, User1 effectively has **Admin** permissions to all development environments.

A few things to consider:

* Only one environment per project can be the Production type. It's set automatically as the default branch and can't be overridden separately.
* You can change an environment type and have multiple Staging or Development environments.
* To customize who can use SSH, [set the access key](/configuration/app/access.html) in your platform.app.yaml


| Environment permission   | Description |
|------------------------- |-------------|
|Viewer                    | Viewers can view all environments of this type.|
|Contributor               | Contributors can push code and branch all environments of this type. This role includes the Viewer permissions.
|Admin                     | Admins can change settings and execute actions on all environments of this type. This role includes the Viewer and Contributor permissions.

## Manage users

### Add a user to a project

To add a user to a project, follow these steps:

{{< codetabs >}}
---
title="In the console"
---
1. Go to your console and select the project where you want to add a new user.
2. Under **Settings**, click **Access**.
1. Click **+ Add**
1. Add the user's details and choose their permissions.
4. Click **Save**.
5. After you add a user from a project or an environment type, you must trigger a redeploy to propagate SSH access changes to each environment. You can redeploy by clicking **Redeploy** in the console.
---
title="Using the CLI"
---
You can use the [Platform.sh CLI (Command Line Interface)](/development/cli/_index.md) to create new users.

* `platform user:add`

Say you want to add `user1@example.com` to the project with **Project Admin** permissions:

```bash
platform user:add user1@example.com -r admin
```
Once you add the user to the project, they receive an invitation email to join the project.

Use `platform list` to get the full list of commands.

{{< /codetabs >}}

Once you add a user to a project, they receive an invitation to join the project.

## Manage existing users

### Delete a user from a project

To delete a user from a project, follow these steps:

{{< codetabs >}}
---
title="In the console"
---
1. Go to your console and select the project where you want to delete a user.
2. Under **Settings**, click **Access**.
3. Select the user you want to delete and click **Delete**
4. Click **Save**.
5. After you delete a user from a project or an environment type, you must trigger a redeploy to propagate SSH access changes to each environment. You can redeploy by clicking **Redeploy** in the console.
---
title="Using the CLI"
---
Use the [Platform.sh CLI (Command Line Interface)](/development/cli/_index.md) to delete existing users.

* `platform user:delete`

  ```bash
  platform user:delete user1@example.com
  ```

  Use `platform list` to get the full list of commands.

  After you delete a user from a project or an environment type, you must trigger a redeploy to propagate SSH access changes to each environment. You can redeploy by using the CLI command platform `redeploy`.

{{< /codetabs >}}

Once you delete a user, they won't be able to access the project anymore.


### Change user permissions from the console

To change the user permissions, follow the steps:

{{< codetabs >}}
---
title="In the console"
---
1. Go to your console and select the project where you want to change the user permissions.
2. Under **Settings**, click **Access**.
3. Select a user and change the permissions.
4. Click **Save**.
5. After you delete a user from a project or an environment type, you must trigger a redeploy to propagate SSH access changes to each environment. You can redeploy by clicking **Redeploy** in the console.
---
title="Using the CLI"
---
Use the [Platform.sh CLI (Command Line Interface)](/development/cli/_index.md)to change user permissions.

* `platform user:role`

  ```bash
  platform user:role user1@example.com -r contributor
  ```

Use `platform list` to get the full list of commands.

After you delete a user from a project or an environment type, you must trigger a redeploy to propagate SSH access changes to each environment. You can redeploy by using the CLI command platform `redeploy`.

{{< /codetabs >}}


### Transfer a project ownership

You can transfer your plan ownership to a different [organization](https://docs.platform.sh/administration/organizations.html) anytime.

#### Before you begin

You have to be the organization owner or an organization user with the **manage plans** permission.

1. Invite the new organization owner as a **Project Admin**.
2. Submit a [support ticket](https://console.platform.sh/-/users/~/tickets) from your organization owner's account to ask for the transfer.

Once the transfer is completed, the new organization can administer all project settings, billing, and gets the subscription charges.


##Troubleshooting

[Source Integrations](integrations/source/troubleshooting.html)
