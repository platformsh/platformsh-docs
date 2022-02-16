---
title: "User administration"
weight: 1
sidebarTitle: "Users"
description: |
  Learn how to add and delete users and assign user permissions per environment type.
---

Learn about user roles and environment types, how to add and delete users, and how to assign user permissions per environment type.

## User roles

Within a project, each user has a role that controls their access and permission levels.

* Project Admin: Users who can configure project settings, add and remove users, administer environment permissions, push code, and execute actions on all project environments.
* Project Viewer: Any user with access to environment types automatically gets this role.

These control who has access to projects.
Users can still see projects that they can't access if they're a member of an organization.
See more on access control for [organizations](./organizations.md).

To see all projects you have a role in, from the main console page
click **All projects&nbsp;<span aria-label="and then">></span> All projects**.

## Environment types

Each environment type groups one or more environments together so that you can manage access for all environments of a certain type.
This allows you to set permissions for multiple environments at once based on their purpose.

Platform.sh offers three environment types: Production, Staging, and Development.
You can assign user permissions for each environment type.
Any permissions you assign to an environment type apply to all environments of that type.

For example, if you assign User1 **Admin** permissions for Development environments,
User1 has **Admin** permissions for all environments of that type.

A few things to consider:

* Only one environment per project can be the Production type. It's set automatically as the default branch and can't be overridden separately.
* You can change an environment's type (if it's not Production).
* You can have multiple Staging and Development environments.

The following table shows the available roles for environment types.

| Role | View environment | Push code | Branch environment | SSH access | Change settings | Execute actions |
| ---- | ---------------- | --------- | ------------------ | ---------- | --------------- | --------------- |
| Viewer | Yes | No |  No |  No |  No |  No |
| Contributor | Yes | Yes | Yes | Yes | No | No |
| Admin| Yes | Yes | Yes | Yes | Yes | Yes |

To customize who can use SSH, [set the access key](/configuration/app/app-reference.md#access) in your `platform.app.yaml` file.

## Manage users

### Add a user to a project

If you are an organization owner, or an organization user with [manage plan](/administration/organizations.md#organization-permissions) or [manage users](/administration/organizations.md#organization-permissions) permissions wanting to add a user to a project or an environment, follow these steps:

{{< codetabs >}}

---
title=In the console
file=none
highlight=false
---

1. In the console, select the project where you want to add a new user.
2. Under **Settings**, click **Access**.
3. Click **+ Add**.
4. Add the user's details and choose their permissions.
5. Click **Save**.

<--->
---
title=Using the CLI
file=none
highlight=false
---

Say you want to add `user1@example.com` to the project with a Project Admin role:

```bash
platform user:add user1@example.com -r admin
```

{{< /codetabs >}}

The user has to create an account before they can contribute to the project.
Once you add a user to a project, they receive an email with instructions.
For SSH access changes to apply after you add a user to a project, you have to redeploy each environment by either clicking **Redeploy** in the console or running `platform redeploy`.

### Delete a user from a project

To delete a user from a project, follow these steps:

{{< codetabs >}}

---
title=In the console
file=none
highlight=false
---

1. In the console, select the project where you want to delete a user.
2. Under **Settings**, click **Access**.
3. Select the user you want to delete and click **Delete**.
4. Click **Save**.

<--->

---
title=Using the CLI
file=none
highlight=false
---
To delete existing users:

```bash
platform user:delete user1@example.com
```
{{< /codetabs >}}

Once you delete a user, they can no longer access the project.
After you delete a user from a project or an environment type,
you must [trigger a redeploy](../development/troubleshoot.md#force-a-redeploy) to propagate SSH access changes to each environment.

### Change existing permissions for environment types

To change user permissions, follow these steps:

{{< codetabs >}}

---
title=In the console
file=none
highlight=false
---

1. In the console, select the project where you want to change the user permissions.
2. Under **Settings**, click **Access**.
3. Select a user and change the permissions.
4. Click **Save**.

<--->

---
title=Using the CLI
file=none
highlight=false
---
Say you want `user1@example.com` to have the Viewer role for Production environments
and the Contributor role for Development environments:

```bash
platform user:update user1@example.com -r production:v,development:c
```

After you change a user's role for an environment type, you must trigger a redeploy each environment to propagate access changes. You can redeploy using the CLI command `platform redeploy`.

{{< /codetabs >}}

### Transfer project ownership

You can transfer your plan ownership to a different [organization](/administration/organizations.md) anytime.
You have to be an organization owner or an organization user with [manage plan](/administration/organizations.md#organization-permissions) permissions.

1. Make the new organization owner a Project Admin for the project you want to transfer.
2. Submit a [support ticket](https://console.platform.sh/-/users/~/tickets) from your organization account to ask for the transfer.

Once the transfer is completed, the new organization can administer all project settings and billing and receives future invoices.

## Troubleshooting

If you have setup an external integration to GitHub, GitLab, or Bitbucket and your users can't clone the project locally,
see how to [troubleshoot source integrations](/integrations/source/troubleshoot.md).
