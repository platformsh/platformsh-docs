---
title: Administer teams
sidebarTitle: Teams
weight: 1
description: Manage team access and permissions across all your projects and organizations.
---

Organizations on {{% vendor/name %}} are made up of both [projects](/projects/) and [users](/administration/users.md).
While organizations by themselves allow you to assign project and environment type permissions to individual users on individual projects,
having many users and many projects calls for another method to group common access control settings.

**Teams** provide a grouping that connects a subset of an organization's users to another subset of that organization's projects.
That relationship enables organization owners to set default project and environment type access settings for each user and project from one place.

There is no limit to the number of teams that can be defined within a single organization.

## Create a new team

As an organization owner or member with **Manage users** permissions, 
you can create new teams.

Teams must belong to an organization, so [create one](/administration/organizations.md#create-a-new-organization) first.
You can create new organizations with different payment methods and billing addresses
and organize your projects as you want, but keep in mind that both users and teams are restricted to single organizations.

{{< codetabs >}}

+++
title=Using the Console
+++

1. Navigate to your existing organization.
1. Open the user menu (your name or profile picture).
1. Select **Teams** from the dropdown.
1. Click **+ Create team**.
1. Enter the information for your team. Only the team name is required at this point, but you can define environment type permissions now if you'd like.
1. Click **Create team**.

<--->
+++
title=Using the CLI
+++

1. Run the following command:
   
   ```bash
   {{% vendor/cli %}} team:create -o {{< variable "ORGANIZATION_NAME" >}}
   ```
2. Enter a team name.
3. Define your team's project role (admin or viewer).
4. If your team has viewer rights on the project, define its role on each type of environment.
5. Enter `Y` to confirm.

{{< note >}}
To view a list of all the existing teams in your organization, run the following command:

```bash
{{% vendor/cli %}} team:list -o {{< variable "ORGANIZATION_NAME" >}}
```
{{< /note >}}

{{< /codetabs >}}

## Delete an existing team

As an organization owner or member with **Manage users** permissions, 
you can delete existing teams.

Note that deleting teams and deleting users are not equivalent.
Deleting a team will remove member access permissions to projects described by the team,
but it will _not_ [remove users from the organization](/administration/users.md#remove-a-user-from-an-organization) (or your billing).

{{< codetabs >}}

+++
title=Using the Console
+++

1. Navigate to your existing organization
1. Open the user menu (your name or profile picture).
1. Select **Teams** from the dropdown.
1. Find the team you want to delete under the **Manage teams** list,
    then click **{{< icon more >}} More**.
1. Click **Delete team**.
1. Click **Yes** to confirm.

<--->
+++
title=Using the CLI
+++

1. Run the following command:
   
   ```bash
   {{% vendor/cli %}} team:delete -o {{< variable "ORGANIZATION_NAME" >}}
   ```
2. Select the team you want to delete.
5. Enter `Y` to confirm.

{{< /codetabs >}}


## Manage team settings

As an organization owner or member with **Manage users** permissions, 
you can manage the settings of existing teams such as:

- [It's name](#team-name)
- [The environment type permissions granted to members on individual projects](#project--environment-type-permissions)
- [Team members](#team-members)
- [Project access](#team-access-to-projects)

### Team name

{{< codetabs >}}

+++
title=Using the Console
+++

1. Navigate to your existing organization.
1. Open the user menu (your name or profile picture).
1. Select **Teams** from the dropdown.
1. Find the team you want to rename under the **Manage teams** list,
    then click **{{< icon more >}} More**.
1. Click **Edit team**.
1. In the sidebar click the **Edit** link, and edit the team name.
1. Click **Save**.

<--->
+++
title=Using the CLI
+++

1. Run the following command:
   
   ```bash
   {{% vendor/cli %}} team:update -o {{< variable "ORGANIZATION_NAME" >}}
   ```
2. Select the team you want to rename.
3. Enter the new name.
4. Confirm or adjust the team permissions.
5. Enter `Y` to confirm.

{{< /codetabs >}}


### Project & environment type permissions

The primary purpose of teams is to allow organizations to quickly apply, audit, and update project and environment type permissions for groups of users. 

{{< codetabs >}}

+++
title=Using the Console
+++

1. Navigate to your existing organization
1. Open the user menu (your name or profile picture).
1. Select **Teams** from the dropdown.
1. Find the team you want to modify under the **Manage teams** list,
    then click **{{< icon more >}} More**.
1. Click **Edit team**.
1. In the sidebar, you can:

    * Assign **Project permissions** by selecting the check box to make team members *Project admins* of every project added to the team.
    * Assign **Environment type permissions** by using the dropdowns to grant *No access*, *Viewer*, *Contributor*, or *Admin* rights to team members for *Production*, *Staging*, and *Development* project environment types.

1. Click **Save**.

<--->
+++
title=Using the CLI
+++

1. Run the following command:
   
   ```bash
   {{% vendor/cli %}} team:update -o {{< variable "ORGANIZATION_NAME" >}}
   ```
2. Select the team whose permissions you want to update.
3. Confirm or adjust the team name.
4. Adjust the team permissions.
5. Enter `Y` to confirm.

{{< /codetabs >}}

### Team members

#### Add users to a team

To join a team, a user must already have been added [to the organization](/administration/users.md#manage-organization-access),
where their [organization permissions](/administration/users.md#organization-permissions) are defined.

{{< codetabs >}}

+++
title=Using the Console
+++

1. Navigate to your existing organization.
1. Open the user menu (your name or profile picture).
1. Select **Teams** from the dropdown.
1. Find the team you want to modify under the **Manage teams** list,
    then click **{{< icon more >}} More**.
1. Click **Add user**.
1. Locate and select organization users from the dropdown.
1. In the sidebar click the **Edit** link, and edit the team name.
1. Click **Add users**.

<--->
+++
title=Using the CLI
+++

1. Run the following command:
   
   ```bash
   {{% vendor/cli %}} team:user:add -o {{< variable "ORGANIZATION_NAME" >}}
   ```
2. Select the team you want to add a user to.
3. Enter the user's email address.
4. Enter `Y` to confirm.

{{< note >}}
To view a list of all the users on a team, follow these steps:

1. Run the following command:

   ```bash
   {{% vendor/cli %}} team:user:list -o {{< variable "ORGANIZATION_NAME" >}}
   ```

2. Select the team whose users you want to display.

{{< /note >}}

{{< /codetabs >}}

#### Remove users from a team

Note that deleting users from teams and deleting users from organizations are not equivalent.
Deleting users from a team will remove member access permissions to projects described by the team,
but it will _not_ [remove users from the organization](/administration/users.md#remove-a-user-from-an-organization) (or your billing).

{{< codetabs >}}

+++
title=Using the Console
+++

1. Navigate to your existing organization.
1. Open the user menu (your name or profile picture).
1. Select **Teams** from the dropdown.
1. Find the team you want to modify under the **Manage teams** list,
    then click **{{< icon more >}} More**.
1. Click **Edit team**.
1. Find the user you want to remove under the **USERS** tab view,
    then click **{{< icon more >}} More**.
1. Click **Remove user**.
1. Click **Yes** to confirm.

<--->
+++
title=Using the CLI
+++

1. Run the following command:
   
   ```bash
   {{% vendor/cli %}} team:user:delete -o {{< variable "ORGANIZATION_NAME" >}}
   ```
2. Select a team.
3. Select the user you want to remove from the team.
4. Enter `Y` to confirm.

{{< /codetabs >}}

### Team access to projects

#### Adding projects to a team's access

{{< codetabs >}}

+++
title=Using the Console
+++

**Option 1: Add projects to team with from Team settings**

1. Navigate to your existing organization.
2. Open the user menu (your name or profile picture).
3. Select **Teams** from the dropdown.
4. Find the team you want to modify under the **Manage teams** list,
    then click **{{< icon more >}} More**.
5. Click **Edit team**.
6. Click **+ Add projects**.
7. Select **All projects**, or choose individual projects from the dropdown.
   {{< note >}}
   **All projects** refers to all existing projects.
   Any future project you create will need to be added to the team manually.
   {{< /note >}}
8. Click **Add to team**.

</br>

**Option 2: Add teams to project from project's Access settings**

1. Navigate to your existing organization.
2. Select the project you want to add to the existing team.
3. Navigate to the project's settings by clicking the **{{< icon settings >}} Settings** icon.
4. Click **Access** settings under **Project settings** in the sidebar.
5. Select the **TEAMS** tab in the **Access** list view.
6. Click **+Add to projects**.
7. Select **All teams**, or choose individual teams from the dropdown.
   {{< note >}}
   **All teams** refers to all existing teams.
   Any future team you create will need to be added to the project manually.
   {{< /note >}}
8. Click **Add to team**.

<--->
+++
title=Using the CLI
+++

1. Run the following command:
   
   ```bash
   {{% vendor/cli %}} team:project:add -o {{< variable "ORGANIZATION_NAME" >}}
   ```
2. Select a team.
3. Select the project you want the team to access.
4. Enter `Y` to confirm.

{{< note >}}
To view a list of all the projects added to a team, follow these steps:

1. Run the following command:

   ```bash
   {{% vendor/cli %}} team:project:list -o {{< variable "ORGANIZATION_NAME" >}}
   ```
2. Select the team whose projects you want to display.

{{< /note >}}

{{< /codetabs >}}

#### Remove project from team's access

{{< codetabs >}}

+++
title=Using the Console
+++

**Option 1: Remove projects from a team with from Team settings**

1. Navigate to your existing organization.
1. Open the user menu (your name or profile picture).
1. Select **Teams** from the dropdown.
1. Find the team you want to modify under the **Manage teams** list,
    then click **{{< icon more >}} More**.
1. Click **Edit team**.
1. Find the project you want to modify under the **PROJECTS** tab view,
    then click **{{< icon more >}} More**.
1. Click **Remove project**.
1. Select **All projects**, or choose individual projects from the dropdown.
1. Click **Yes** to confirm.

</br>

**Option 2: Remove teams from a project from project's Access settings**

1. Navigate to your existing organization.
1. Select the project you want to add to the existing team.
1. Navigate to the project's settings by clicking the **{{< icon settings >}} Settings** icon.
1. Click **Access** settings under **Project settings** in the sidebar.
1. Find the team under the **TEAMS** tab view,
    then click **{{< icon more >}} More**.
1. Click **Remove team**.
1. Click **Yes** to confirm.

<--->
+++
title=Using the CLI
+++

1. Run the following command:
   
   ```bash
   {{% vendor/cli %}} team:project:delete -o {{< variable "ORGANIZATION_NAME" >}}
   ```
2. Select a team.
3. Select the project whose access you want to revoke for the team.
4. Enter `Y` to confirm.

{{< /codetabs >}}



