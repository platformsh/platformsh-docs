---
title: Administer users
weight: 1
sidebarTitle: Users
description: Learn how to add, remove, and manage users in projects and organizations.
---

You can manage user permissions within specific projects.
To help manage permissions, group your environments by [environment type](#environment-types).

Each user in a project is also added to your organization.
You can also [manage organization users](#manage-organization-users).

## Project user permissions

Within a project, each user has a role that controls their access and permission levels.

- Project admin: Users who can configure project settings, add and remove users, administer environment permissions, push code,
  and execute actions on all project environments.
- Project viewer: Any user with access to environment types automatically gets this role.

Users can still see projects that they can't access if they have the [**List projects** permission](#organization-user-permissions).

### Environment types

Each environment type groups one or more environments together so that you can manage access for all environments of that type.
So you can set permissions for multiple environments at once based on their purpose.

You can set permissions for each of three environment types: Production, Staging, and Development.
Any permissions you assign to an environment type apply to all environments of that type.

Each project can have only one environment set as Production.
It's set automatically as the default branch and can't be overridden.
You can have multiple Staging and Development environments
and can change each of their types.

The following table shows the permissions for each environment type role.

- Only one environment per project can be the Production type.
  It's set automatically as the default branch and can't be overridden separately.
- You can change an environment's type (if it's not Production).
- You can have multiple Staging and Development environments.

To customize which roles can use SSH, set [`access` in your app configuration](../create-apps/app-reference.md#access).

| Role        | View environment | Push code | Branch environment | SSH access | Change settings | Execute actions |
|-------------|------------------|-----------|--------------------|------------|-----------------|-----------------|
| Viewer      | Yes              | No        | No                 | No         | No              | No              |
| Contributor | Yes              | Yes       | Yes                | Yes        | No              | No              |
| Admin       | Yes              | Yes       | Yes                | Yes        | Yes             | Yes             |

### Project access

If you have set up an external integration to GitHub, GitLab, or Bitbucket and your users can't clone the project locally,
see how to [troubleshoot source integrations](../integrations/source/troubleshoot.md).

## Manage project users

### Add a user to a project

To add a user, you need to be a [project admin](#project-user-permissions).

To add a user, follow these steps:

{{< codetabs >}}
+++
title=In the Console
+++

1. Select the project where you want to add a new user.
2. Click {{< icon settings >}} **Settings**.
3. Click **Access**.
4. Click **+ Add**.
5. Add the user's details and choose their permissions.
6. Click **Save**.

<--->
+++
title=Using the CLI
+++

Say you want to add `user1@example.com` to the project as a project admin:

```bash
platform user:add user1@example.com -r admin
```

If you want to add `user2@example.com` to the project as a contributor for Development environments
and a viewer for Staging environments,
run the following command:

The user has to create an account before they can contribute to the project.
Once you add a user to a project, they receive an email with instructions.
For SSH access changes to apply after you add a user to a project,
you have to redeploy each environment by either clicking **Redeploy** in the Console or running `platform redeploy`.

{{< /codetabs >}}

### Remove a user from a project

To remove a user from a project, you need to be a [project admin](#project-user-permissions).

To remove a user, follow these steps:

{{< codetabs >}}

<--->
+++
title=In the Console
+++

1. Select the project where you want to add a new user.
2. Click {{< icon settings >}} **Settings**.
3. Click **Access**.
4. Click the user you want to delete.
5. Click **Remove user**.
6. Click **Accept**.

The user is added to your organization.

If the user is already a member of your organization,
you can add them by following these steps:

1. Navigate to your organization or a project in it.
2. Open the user menu (your name or profile picture).
3. Click **Users**.
4. For the user you want to add, click **{{< icon more >}} More**.
5. Click **Add to project**.
6. Select the project you want to add and their permissions
7. Click **Save**.

{{< /codetabs >}}

Once you add a user to a project, they receive an email with instructions.
If they don't yet have an account, they need to create one.

To apply SSH access changes after you add a user to a project,
[trigger a redeploy](../development/troubleshoot.md#force-a-redeploy).

### Remove a user from a project

To remove a user from a project, you need to be a [project admin](#project-user-permissions)
be an organization owner, or have the [**Manage users** permission for the organization](#organization-user-permissions).

To remove a user, follow these steps:

{{< codetabs >}}
+++
title=Using the CLI
+++
To remove an existing user:

```bash
platform user:delete user1@example.com
```

{{< /codetabs >}}

Once you remove a user, they can no longer access the project.
For SSH access changes to apply after you remove a user from a project or an environment type,
you have to redeploy each environment by either clicking **Redeploy** in the Console or running `platform redeploy`.

### Change existing permissions for environment types

To manage user permissions, you need to be a [project admin](#project-user-permissions).

Follow these steps:

{{< codetabs >}}

<--->
+++
title=In the Console
+++

1. Select the project where you want to add a new user.
2. Click {{< icon settings >}} **Settings**.
3. Click **Access**.
4. Click the user whose permissions you want to manage.
5. Change the settings.
6. Click **Save**.

<--->

+++
title=Using the CLI
+++
Say you want `user1@example.com` to have the Viewer role for Production environments
and the Contributor role for Development environments:

```bash
platform user:update user1@example.com -r production:v,development:c
```

After you change a user's role for an environment type, you must redeploy each environment to propagate access changes.
You can redeploy using the CLI command `platform redeploy`.

{{< /codetabs >}}

Once you remove a user, they can no longer access the project.

To apply SSH access changes after you add a remove a user from a project or environment type,
[trigger a redeploy](../development/troubleshoot.md#force-a-redeploy).

### Change existing permissions for environment types

To manage user permissions for environment types, you need to be a [project admin](#project-user-permissions)
be an organization owner, or have the [**Manage users** permission for the organization](#organization-user-permissions).

To change user permissions, follow these steps:

{{< codetabs >}}
+++
title=Using the CLI
+++

To update an existing user's permissions, run the following command:

```bash
platform user:update {{ variable "EMAIL_ADDRESS" }} -r {{ variable "PERMISSIONS_TO_GRANT" }}
```

If you want `user1@example.com` to be a viewer for Production environments
and a contributor for Development environments,
run the following command:

```bash
platform user:update user1@example.com -r production:viewer,development:contributor
```

<--->
+++
title=In the Console
+++

1. Navigate to your organization or a project in it.
2. Open the user menu (your name or profile picture).
3. Click **Users**.
4. For the user you want to remove, click **{{< icon more >}} More**.
5. For the project you want to remove them from, click **{{< icon more >}} More**.
6. Update the permissions.
7. Click **Save**.

{{< /codetabs >}}

To apply SSH access changes after changing a user's permissions for an environment type,
[trigger a redeploy](../development/troubleshoot.md#force-a-redeploy).

## Manage organization users

All users who are added to any project within an organization become members of that organization.
By default, such users have no [organization permissions](#organization-user-permissions).
You can also have organization admins who aren't part of any projects.

Users who are a part of an organization can see all projects in that organization at the organization's URL,
which takes the form `https://console.platform.sh/<ORGANIZATION_NAME>`.
They can only access projects they've been explicitly invited to.
For more information on project access control, see how to [manage project users](#manage-project-users).

### Organization user permissions

As an organization owner or an organization user with the **Manage users** permission,
you can invite other users to your organization and grant them the following permissions:

- **Manage billing** (`billing`):
  Add, remove, and edit billing information.
  Access invoices and vouchers.
  Users with this permission receive monthly invoices by email.
- **Manage plans** (`plans`):
  Add, remove, and edit plans and plan options for existing projects.
  Plan options include the amount of storage, number of environments, and number of user licenses.
- **Manage users** (`members`):
  Add, remove, and edit organization-level users and permissions, except their own.
  Users with this permission can't grant other users permissions that they themselves don't have.
- **Create projects** (`projects:create`):
  Create new projects within the organization.
- **List projects** (`projects:list`):
  See all projects in an organization, even those the user can't access.

{{< note theme="warning" >}}

Users with the **Manage users** (`members`) permission can add, edit, or remove _any_ user's permissions except their own.

{{< /note >}}

Users without any of these permissions can only access [projects where they're users](#project-user-permissions).
They can't access or manage the rest of the organization.

### Add a user to an organization

{{< codetabs >}}
+++
title=Using the CLI
+++

To invite a user to your organization, run the following command:

```bash
platform organization:user:add {{< variable "EMAIL_ADDRESS" >}} --org {{< variable "ORGANIZATION_NAME" >}} --permission {{< variable "PERMISSIONS" >}}
```

For example, to invite `alice@example.com` to the `acme` organization
with the **Manage billing** and **Create projects** permissions, run the following command:

```bash
platform organization:user:add alice@example.com --org acme --permission billing,projects:create
```

<--->
+++
title=Using the Console
+++

1. Navigate to the organization you want to manage (or a project in it).
2. Open the user menu (your name or profile picture).
3. Click **Users**.
4. Click **+ Invite users**.
5. Enter the users' email addresses separated by commas.
6. Select which organization-wide permissions they should have.
7. Click **Invite**.

{{< /codetabs >}}

All users you invite receive an invitation email with instructions.

### Manage existing organization users

{{< codetabs >}}
+++
title=Using the CLI
+++

To update permissions for a user in your organization, run the following command:

```bash
platform organization:user:update {{< variable "EMAIL_ADDRESS" >}} --org {{< variable "ORGANIZATION_NAME" >}} --permission {{< variable "PERMISSIONS" >}}
```

For example, to update the permissions for `alice@example.com` in your `acme` organization
so that she has only the **Manage billing** permission, run the following command:

```bash
platform organization:user:update alice@example.com --org acme --permission billing
```

<--->
+++
title=Using the Console
+++

1. Navigate to the organization you want to manage (or a project in it).
2. Open the user menu (your name or profile picture).
3. Click **Users**.
4. Next to the user you want to manage, click **{{< icon "more" >}} More**.
5. Click **Edit user**.

You see all the projects the user is a part of and their permissions in those projects.
You also see their permissions across the organization.

To edit their organization permissions, follow these steps:

1. Select or clear the checkboxes for the relevant permissions.
2. Click **Save**.
3. Click **Yes**.

{{< /codetabs >}}

### Remove a user from an organization

{{< codetabs >}}
+++
title=Using the CLI
+++

To update remove a user from your organization, run the following command:

```bash
platform organization:user:delete {{< variable "EMAIL_ADDRESS" >}} --org {{< variable "ORGANIZATION_NAME" >}}
```

For example, to remove `alice@example.com` from your `acme` organization, run the following command:

```bash
platform organization:user:delete alice@example.com --org acme
```

<--->
+++
title=Using the Console
+++

1. Navigate to the organization you want to manage (or a project in it).
2. Open the user menu (your name or profile picture).
3. Click **Users**.
4. Next to the user you want to remove, click **{{< icon "more" >}} More**.
5. Click **Remove from organization**.

To delete users in bulk, select the users to remove and click **Remove users from organization**.

{{< /codetabs >}}
