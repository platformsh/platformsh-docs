---
title: Administer users
weight: 1
sidebarTitle: Users
description: Manage user access and permissions across all your projects and organizations.
---

{{% vendor/name %}} offers very granular and flexible user permissions across projects and organizations.
When a user is added to a project, they are automatically added to your organization.

{{< note title="Available add-on" >}}

The Standard User Management add-on offers free viewer permissions, custom [organization permissions](#organization-permissions),
[teams](/administration/teams.md), and [MFA enforcement within an organization](/administration/mfa.md).
See how to [subscribe to this add-on](/administration/billing/add-on-subscription.md#standard-user-management-add-on).

{{< /note >}}

## Manage project access

If you have set up an external integration to GitHub, GitLab, or Bitbucket and your users can't clone the project locally,
see how to [troubleshoot source integrations](../integrations/source/troubleshoot.md).

### Project roles

A user can have one of the following roles to control their access at project level:

| Role           | View environment | Push code | Manage user access | Change settings | Execute actions on all environments |
|----------------|------------------|-----------|--------------------|-----------------|-------------------------------------|
| Project admin  | Yes              | Yes       | Yes                | Yes             | Yes                                 |
| Project viewer | Yes              | No        | No                 | No              | No                                  |

By default, organization owners have **Project admin** access on all of the projects within their organization.

### Environment type roles

An environment type (Production, Staging, and Development) groups one or more environments together so that you can manage access for all environments of that type:

- A role assigned to an environment type applies to all environments of that type.
- Only one environment per project can be of the type: Production.
  It is set automatically as the default branch and can't be overridden separately.
- You can change an environment's type (except for the Production environment).
- You can have multiple preview (staging and development) environments.

A user can have one of the following roles on an environment type which grants them permissions on all environments of this type:

| Role        | View environment | Force push | Push code | Branch environment | SSH access | Change settings | Execute actions |
|-------------|------------------|------------|-----------|--------------------|------------|-----------------|-----------------|
| Admin       | Yes              | Yes        | Yes       | Yes                | Yes        | Yes             | Yes             |
| Contributor | Yes              | No         | Yes       | Yes                | Yes        | No              | No              |
| Viewer      | Yes              | No         | No        | Yes                | No         | No              | No              |

To customize which roles can use SSH, set [`access` in your app configuration](/create-apps/app-reference/single-runtime-image.md#access).

### View a user's permissions across all of the projects in your organization

For each user, you can view a summary of their roles and permissions
across all projects in your organization.

{{< codetabs >}}
+++
title=Using the CLI
+++

This feature is available for **v4.1.2+** of the CLI.

Run a command similar to the following,
using the email address of the user whose permissions you want to view:

```bash
{{% vendor/cli %}} organization:user:projects --org {{< variable "ORGANIZATION_NAME" >}} {{< variable "EMAIL_ADDRESS" >}}
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

### Add a user to a project

To invite a user, you need to be a [project admin](#project-roles).

To add a user, follow these steps:

{{< codetabs >}}
+++
title=Using the CLI
+++

To add a user, run the following command:

```bash
{{% vendor/cli %}} user:add {{< variable "EMAIL_ADDRESS" >}} -r {{< variable "PERMISSIONS_TO_GRANT" >}}
```

For example, if you want to add `user1@example.com` to the project as a project admin,
run the following command:

```bash
{{% vendor/cli %}} user:add user1@example.com -r admin
```

If you want to add `user2@example.com` to the project as a contributor for Development environments
and a viewer for Staging environments,
run the following command:

```bash
{{% vendor/cli %}} user:add user2@example.com -r development:contributor -r staging:viewer
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

The user has to create an account before they can access the project.
Once you add a user to a project, they receive an invitation email with instructions.

To apply SSH access changes after you add a user to a project,
[trigger a redeploy](../development/troubleshoot.md#force-a-redeploy).

### Manage project users

To manage user permissions on a project, you need to be a [project admin](#project-roles),
be an organization owner, or have the [**Manage users** permission for the organization](#organization-permissions).

To change user permissions, follow these steps:

{{< codetabs >}}
+++
title=Using the CLI
+++

To update an existing user's permissions, run the following command:

```bash
{{% vendor/cli %}} user:update {{< variable "EMAIL_ADDRESS" >}} -r {{< variable "PERMISSIONS_TO_GRANT" >}}
```

If you want `user1@example.com` to be a viewer for Production environments
and a contributor for Development environments,
run the following command:

```bash
{{% vendor/cli %}} user:update user1@example.com -r production:viewer,development:contributor
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

To apply SSH access changes after you add a remove a user from a project or environment type,
[trigger a redeploy](../development/troubleshoot.md#force-a-redeploy).

### Remove a user from a project

To remove a user from a project, you need to be a [project admin](#project-roles),
be an organization owner, or have the [**Manage users** permission for the organization](#organization-permissions).

To remove a user, follow these steps:

{{< codetabs >}}
+++
title=Using the CLI
+++

Run the following command:

```bash
{{% vendor/cli %}} user:delete user1@example.com
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

To apply SSH access changes after changing a user's permissions for an environment type,
[trigger a redeploy](../development/troubleshoot.md#force-a-redeploy).

## Manage organization access

All users who are added to any project within an organization become members of that organization.
By default, such users have no [organization permissions](#organization-permissions).
You can also have organization users who aren't part of any projects.

Users who are a part of an organization with the **List projects** permission can see all projects in that organization at the organization's URL,
which takes the form `https://console.{{% vendor/urlraw "host" %}}/{{< variable "ORGANIZATION_NAME" >}}`.
They can only access projects they've been explicitly invited to.
For more information on project access control, see how to [manage project users](#manage-project-users).

### Organization permissions

{{< partial "user-mgt-sellable/body.md" >}}

As an organization owner or an organization user with the **Manage users** permission,
you can invite other users to your organization and grant them the following permissions:

- **Manage billing** (`billing`):
  Add, remove, and edit billing information.
  Access invoices and vouchers.
  Users with this permission receive monthly invoices by email.
- **Manage plans** (`plans`):
  Access to update settings of existing projects in an organization.
- **Manage users** (`members`):
  Add, remove, and edit organization-level users and permissions, except their own.
  Users with this permission can't grant other users permissions that they themselves don't have.
- **Create projects** (`projects:create`):
  Create new projects within the organization.
- **List projects** (`projects:list`):
  See all projects in an organization, even those the user can't access.

{{< note >}}

Users with the **Manage users** (`members`) permission can add, edit, or remove _any_ user's permissions except their own.

Users with the **Manage billing** (`billing`) permission automatically are granted **List projects** (`projects:list`) permission.
That is, they are able to see all organization projects once given billing rights.

{{< /note >}}

Users without any of these permissions can only access [projects where they're users](#project-roles).
They can't access or manage the rest of the organization.

Organization owners have all permissions within their organization.
Their permission level can't be edited.
Organization owners can't be removed from their organization,
except through an [ownership transfer](../administration/organizations.md#transfer-project-ownership).

### Add a user to an organization

{{< codetabs >}}
+++
title=Using the CLI
+++

To invite a user to your organization, run the following command:

```bash
{{% vendor/cli %}} organization:user:add {{< variable "EMAIL_ADDRESS" >}} --org {{< variable "ORGANIZATION_NAME" >}} --permission {{< variable "PERMISSIONS" >}}
```

For example, to invite `alice@example.com` to the `acme` organization
with the **Manage billing** and **Create projects** permissions, run the following command:

```bash
{{% vendor/cli %}} organization:user:add alice@example.com --org acme --permission billing,projects:create
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

### Manage organization users

{{< codetabs >}}
+++
title=Using the CLI
+++

To update permissions for a user in your organization, run the following command:

```bash
{{% vendor/cli %}} organization:user:update {{< variable "EMAIL_ADDRESS" >}} --org {{< variable "ORGANIZATION_NAME" >}} --permission {{< variable "PERMISSIONS" >}}
```

For example, to update the permissions for `alice@example.com` in your `acme` organization
so that she has only the **Manage billing** permission, run the following command:

```bash
{{% vendor/cli %}} organization:user:update alice@example.com --org acme --permission billing
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
{{% vendor/cli %}} organization:user:delete {{< variable "EMAIL_ADDRESS" >}} --org {{< variable "ORGANIZATION_NAME" >}}
```

For example, to remove `alice@example.com` from your `acme` organization, run the following command:

```bash
{{% vendor/cli %}} organization:user:delete alice@example.com --org acme
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
