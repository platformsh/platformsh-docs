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


## Manage project users

If you have set up an external integration to GitHub, GitLab, or Bitbucket and your users can't clone the project locally,
see how to [troubleshoot source integrations](../integrations/source/troubleshoot.md).

### Project user permissions

Within a project, each user has a role that controls their access and permission levels.

- Project admin: Users who can configure project settings, add and remove users, administer environment permissions, push code,
  and execute actions on all project environments.
- Project viewer: Any user with access to environment types automatically gets this role.

Users can still see projects that they can't access if they have the [**List projects** permission](#organization-user-permissions).

#### View a user's permissions across all of the projects in your organization

For each user, you can view a summary of the user roles (and therefore permissions)
they've been granted on all of the projects in your organization.

{{< codetabs >}}
+++
title=Using the CLI
+++

This feature is available for **v4.1.2+** of the CLI.

Run a command similar to the following,
using the email address of the user whose permissions you want to view:

```bash
platform oups --org {{< variable "ORGANIZATION_NAME" >}} {{< variable "EMAIL_ADDRESS" >}}
```

<--->
+++
title=In the Console
+++

1. Navigate to your organization.
2. Open the user menu (your name or profile picture).
3. Click **Users**.
4. For the user whose user permissions you want to view,
   click **{{< icon more >}} More**.
5. Click **Edit user**.

{{< /codetabs >}}

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
| Viewer      | Yes              | No        | Yes                | No         | No              | No              |
| Contributor | Yes              | Yes       | Yes                | Yes        | No              | No              |
| Admin       | Yes              | Yes       | Yes                | Yes        | Yes             | Yes             |

### Add a user to a project

To add a user, you need to be a [project admin](#project-user-permissions).

To add a user, follow these steps:

{{< codetabs >}}
+++
title=Using the CLI
+++

To add a user, run the following command:

```bash
platform user:add {{< variable "EMAIL_ADDRESS" >}} -r {{< variable "PERMISSIONS_TO_GRANT" >}}
```

For example, if you want to add `user1@example.com` to the project as a project admin,
run the following command:

```bash
platform user:add user1@example.com -r admin
```

If you want to add `user2@example.com` to the project as a contributor for Development environments
and a viewer for Staging environments,
run the following command:

```bash
platform user:add user2@example.com -r development:contributor -r staging:viewer
```

<--->
+++
title=In the Console
+++

1. Select the project where you want to add a new user.
2. Click {{< icon settings >}} **Settings**.
3. Click **Access**.
4. Click **+ Add**.
5. Add the user's details and choose their permissions.
6. Click **Save**.

{{< /codetabs >}}

The user has to create an account before they can contribute to the project.
Once you add a user to a project, they receive an email with instructions.
If they don't yet have an account, they need to create one.
After you add a user to a project, SSH access changes are automatically applied and you don't need to redeploy. 

### Change existing permissions for environment types

To manage user permissions for environment types, you need to be a [project admin](#project-user-permissions),
be an organization owner, or have the [**Manage users** permission for the organization](#organization-user-permissions).

To change user permissions, follow these steps:

{{< codetabs >}}
+++
title=Using the CLI
+++

To update an existing user's permissions, run the following command:

```bash
platform user:update {{< variable "EMAIL_ADDRESS" >}} -r {{< variable "PERMISSIONS_TO_GRANT" >}}
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

1. Select the project where you want to update user access.
2. Click {{< icon settings >}} **Settings**.
3. Click **Access**.
4. Click the user you want to update permissions for.
5. Update environment type permissions, or click **Remove user**.
6. Click **Accept**.

{{< /codetabs >}}

After you change a user's permissions for an environment type, SSH access changes are automatically applied and you don't need to redeploy. 

### Remove a user from a project

To remove a user from a project, you need to be a [project admin](#project-user-permissions),
be an organization owner, or have the [**Manage users** permission for the organization](#organization-user-permissions).

To remove a user, follow these steps:

{{< codetabs >}}
+++
title=Using the CLI
+++

Run the following command:

```bash
platform user:delete user1@example.com
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
6. Click **Remove from project**.
7. Click **Yes**.

{{< /codetabs >}}

Once you remove a user, they can no longer access the project.

After you remove a user from a project or environment type, SSH access changes are automatically applied and you don't need to redeploy. 

## Manage organization users

All users who are added to any project within an organization become members of that organization.
By default, such users have no [organization permissions](#organization-user-permissions).
You can also have organization admins who aren't part of any projects.

Users who are a part of an organization with the **List projects** permission can see all projects in that organization at the organization's URL,
which takes the form `https://console.platform.sh/{{< variable "ORGANIZATION_NAME" >}}`.
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

Remove a user from an organization will remove them from all projects they were a member of.
