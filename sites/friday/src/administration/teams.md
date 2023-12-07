---
title: Administer teams
weight: 1
sidebarTitle: Teams
description: Manage team access and permissions across all your projects and organizations.
---

Organizations on {{% vendor/name %}} are made up of both [projects](/projects/) and [users](/administration/users.md).
While organizations by themselves allow you to assign project and environment type permissions to individual users on individual projects,
having many users and many projects calls for another method to group common access control settings.

**Teams** provide a grouping that connects a subset of an organization's users to a another subset of that organization's projects.
That relationship enables organization owners to set default Project and environment type access settings for each user and project from one place.

There is no limit to the number of teams that can be defined within a single organization.

{{< note theme="info" title="Beta" >}}
You will notice that the CLI commands below for managing teams don't include well defined subcommands specific to those actions. 
Instead, the examples that follow interact with the {{% vendor/name %}} API directly via the authenticated `api:curl` command.

This will change.
{{< /note >}}

## Create a new team

As an organization owner or member with **Manage users** permissions, 
you can create new teams.

Teams must belong to an organization, so [create one]() first.
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

Assuming you have already created the organization `deploy-friday-agency`, 

```bash
{{% variable "ORGANIZATION" %}}=deploy-friday-agency
```

retrieve that {{% variable "ORGANIZATION_ID" %}} with the command:

```bash
ORGANIZATION_ID=$({{% vendor/cli %}} organization:info -o $ORGANIZATION id)
```

Then use that {{% variable "ORGANIZATION_ID" %}} to create a new team for your organization's "Frontend developers" by running:

```bash
{{% vendor/cli %}} api:curl -X POST /teams \
    -d '{"organization_id": "'"{{% variable "$ORGANIZATION_ID" %}}"'", "label": "Frontend Developers"}'
```

That command will provide a {{% variable "TEAM_ID" %}}, which you can use to verify the team was created successfully:

```bash
{{% vendor/cli %}} api:curl -X GET /teams/{{% variable "$TEAM_ID" %}}
```

{{< note theme="info" title="Tip" >}}
You can retrieve the {{% variable "TEAM_ID" %}} during team creation using a tool like `jq`. 
For example,

```bash
TEAM_ID=$({{% vendor/cli %}} api:curl -X POST /teams \
    -d '{"organization_id": "'"{{% variable "$ORGANIZATION_ID" %}}"'", "label": "Frontend Developers"}' | jq -r '.id')
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

To delete the team `Frontend developers` from the organization `deploy-friday-agency`, first retrieve the {{% variable "ORGANIZATION_ID" %}}.

Assuming you have already created the organization `deploy-friday-agency`, 

```bash
ORGANIZATION=deploy-friday-agency
```

retrieve that {{% variable "ORGANIZATION_ID" %}} with the command:

```bash
ORGANIZATION_ID=$({{% vendor/cli %}} organization:info -o $ORGANIZATION id)
```

You can then use that {{% variable "ORGANIZATION_ID" %}} to list the teams associated with it:

```bash
{{% vendor/cli %}} api:curl -X GET "/teams?filter[organization_id]={{% variable "$ORGANIZATION_ID" %}}"
```

The response will include a {{% variable "TEAM_ID" %}} for the team `Frontend developers`.
Use that ID to delete the team:

```bash
{{% vendor/cli %}} api:curl -X DELETE /teams/{{% variable "$TEAM_ID" %}}
```

{{< note theme="info" title="Tip" >}}
You can retrieve the {{% variable "TEAM_ID" %}} using a tool like `jq`. 
For example,

```bash
TEAM_ID=$({{% vendor/cli %}} api:curl -X GET \
    "/teams?filter[organization_id]=$ORGANIZATION_ID" \
    | jq -r '.items | to_entries[] | select(.value.label == "Frontend Developers") | .value.id')
```
{{< /note >}}

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
1. Find the team you want to delete under the **Manage teams** list,
    then click **{{< icon more >}} More**.
1. Click **Edit team**.
1. In the sidebar click the **Edit** link, and edit the team name.
1. Click **Save**.

<--->
+++
title=Using the CLI
+++

To change the name of the team `Frontend developers` (organization `deploy-friday-agency`) to `JS developers`, first retrieve the {{% variable "ORGANIZATION_ID" %}}.

Assuming you have already created the organization `deploy-friday-agency`, 

```bash
ORGANIZATION=deploy-friday-agency
```

retrieve that {{% variable "ORGANIZATION_ID" %}} with the command:

```bash
ORGANIZATION_ID=$({{% vendor/cli %}} organization:info -o $ORGANIZATION id)
```

You can then use that {{% variable "ORGANIZATION_ID" %}} to list the teams associated with it:

```bash
{{% vendor/cli %}} api:curl -X GET "/teams?filter[organization_id]={{% variable "$ORGANIZATION_ID" %}}"
```

The response will include a {{% variable "TEAM_ID" %}} for the team `Frontend developers`.
Use that ID to update the team name:

```bash
{{% vendor/cli %}} api:curl -X PATCH "/teams/{{% variable "$TEAM_ID" %}}" -d '{"label": "JS Developers"}' 
```

{{< note theme="info" title="Tip" >}}
You can retrieve the {{% variable "TEAM_ID" %}} using a tool like `jq`. 
For example,

```bash
TEAM_ID=$({{% vendor/cli %}} api:curl -X GET \
    "/teams?filter[organization_id]=$ORGANIZATION_ID" \
    | jq -r '.items | to_entries[] | select(.value.label == "Frontend Developers") | .value.id')
```
{{< /note >}}

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
1. Find the team you want to delete under the **Manage teams** list,
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

To update or set project and environment type permissions for the team `Frontend developers` (organization `deploy-friday-agency`),

```bash
ORGANIZATION=deploy-friday-agency
```

first retrieve the {{% variable "ORGANIZATION_ID" %}} with the command:

```bash
ORGANIZATION_ID=$({{% vendor/cli %}} organization:info -o $ORGANIZATION id)
```

You can then use that {{% variable "$ORGANIZATION_ID" %}} to list the teams associated with it:

```bash
{{% vendor/cli %}} api:curl -X GET "/teams?filter[organization_id]={{% variable "$ORGANIZATION_ID" %}}"
```

The response will include a {{% variable "TEAM_ID" %}} for the team `Frontend developers`.
Use that ID to update the team's [project](/administration/users.md#project-roles) and [environment type](/administration/users.md##environment-type-roles) permissions:

```bash
{{% vendor/cli %}} api:curl -X PATCH "/teams/{{% variable "$TEAM_ID" %}}" \
    -d '{ 
            "project_permissions": [
                "viewer",
                "production:viewer",
                "staging:contributor",
                "development:contributor"
            ] 
        }' 
```

In the example above, any user added to the Frontend Developers team will have:

- A viewer [project role](/administration/users.md#project-roles) (rather than admin)
- [Environment roles](/administration/users.md##environment-type-roles) that will provide viewer access to production environment types, and contributor access to staging and development environment types 

for all projects the team has been added to.

{{< note theme="info" title="Tip" >}}
You can retrieve the {{% variable "TEAM_ID" %}} using a tool like `jq`. 
For example,

```bash
TEAM_ID=$({{% vendor/cli %}} api:curl -X GET \
    "/teams?filter[organization_id]=$ORGANIZATION_ID" \
    | jq -r '.items | to_entries[] | select(.value.label == "Frontend Developers") | .value.id')
```
{{< /note >}}

{{< /codetabs >}}

### Team members

#### Add users to a team

To join a team, a user must already have been added [to the organization](/administration/users.md#manage-organization-access),
where their [organization permissions](/administration/users.md#organization-permissions) are defined.

{{< note >}}

If you add a viewer to a team with permissions belonging to a paid user license,
the user will be charged as a paid user.

{{< /note >}}

{{< codetabs >}}

+++
title=Using the Console
+++

1. Navigate to your existing organization.
1. Open the user menu (your name or profile picture).
1. Select **Teams** from the dropdown.
1. Find the team you want to delete under the **Manage teams** list,
    then click **{{< icon more >}} More**.
1. Click **Add user**.
1. Locate and select organization users from the dropdown.
1. In the sidebar click the **Edit** link, and edit the team name.
1. Click **Add users**.

<--->
+++
title=Using the CLI
+++

To add a user to the team `Frontend developers` (organization `deploy-friday-agency`),

```bash
ORGANIZATION=deploy-friday-agency
```

first retrieve the {{% variable "ORGANIZATION_ID" %}} with the command:

```bash
ORGANIZATION_ID=$({{% vendor/cli %}} organization:info -o $ORGANIZATION id)
```

Also find a {{% variable "USER_ID" %}} for the user you want to add to the team from their email by running the command:

```bash
USER_ID=$({{% vendor/cli %}} organization:user:get -o {{% variable "$ORGANIZATION" %}} {{% variable "$USER_EMAIL" %}} -P id)
```

You can use the {{% variable "ORGANIZATION_ID" %}} to list the teams associated with it:

```bash
{{% vendor/cli %}} api:curl -X GET "/teams?filter[organization_id]={{% variable "$ORGANIZATION_ID" %}}"
```

The response will include a {{% variable "TEAM_ID" %}} for the team `Frontend developers`.

With all of this info, you can now add a user to the team `Frontend developers`:

```bash
{{% vendor/cli %}} api:curl -X POST "/teams/{{% variable "$TEAM_ID" %}}/members" -d '{"user_id": "'"{{% variable "$USER_ID" %}}"'"}' 
```

{{< note theme="info" title="Tip" >}}
You can retrieve the {{% variable "TEAM_ID" %}} using a tool like `jq`. 
For example,

```bash
TEAM_ID=$({{% vendor/cli %}} api:curl -X GET \
    "/teams?filter[organization_id]=$ORGANIZATION_ID" \
    | jq -r '.items | to_entries[] | select(.value.label == "Frontend Developers") | .value.id')
```
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
1. Find the team you want to delete under the **Manage teams** list,
    then click **{{< icon more >}} More**.
1. Click **Edit team**.
1. Find the user you want to delete under the **USERS** tab view,
    then click **{{< icon more >}} More**.
1. Click **Remove user**.
1. Click **Yes** to confirm.

<--->
+++
title=Using the CLI
+++

To remove a user from the team `Frontend developers` (organization `deploy-friday-agency`),

```bash
ORGANIZATION=deploy-friday-agency
```

first retrieve the {{% variable "ORGANIZATION_ID" %}} with the command:

```bash
ORGANIZATION_ID=$({{% vendor/cli %}} organization:info -o $ORGANIZATION id)
```

You can use the {{% variable "ORGANIZATION_ID" %}} to list the teams associated with it:

```bash
{{% vendor/cli %}} api:curl -X GET "/teams?filter[organization_id]={{% variable "$ORGANIZATION_ID" %}}"
```

The response will include a {{% variable "TEAM_ID" %}} for the team `Frontend developers`. 

You can use that ID to list the members of that team:

```bash
{{% vendor/cli %}} api:curl -X GET "/teams/{{% variable "$TEAM_ID" %}}/members"
```

Find a {{% variable "USER_ID" %}} for the user you want to remove from the team from their email by running the command:

```bash
USER_ID=$({{% vendor/cli %}} organization:user:get -o {{% variable "$ORGANIZATION" %}} {{% variable "$USER_EMAIL" %}} -P id)
```

That response will list all members, including the {{% variable "USER_ID" %}} for the user you want to remove. 
To remove them, run:

```bash
{{% vendor/cli %}} api:curl -X DELETE "/teams/{{% variable "$TEAM_ID" %}}/members/{{% variable "$USER_ID" %}}" 
```

{{< note theme="info" title="Tip" >}}
You can retrieve the {{% variable "TEAM_ID" %}} using a tool like `jq`. 
For example,

```bash
TEAM_ID=$({{% vendor/cli %}} api:curl -X GET \
    "/teams?filter[organization_id]=$ORGANIZATION_ID" \
    | jq -r '.items | to_entries[] | select(.value.label == "Frontend Developers") | .value.id')
```
{{< /note >}}

{{< /codetabs >}}

### Team access to projects

#### Adding projects to a team's access

{{< codetabs >}}

+++
title=Using the Console
+++

**Option 1: Add projects to team with from Team settings**

1. Navigate to your existing organization.
1. Open the user menu (your name or profile picture).
1. Select **Teams** from the dropdown.
1. Find the team you want to delete under the **Manage teams** list,
    then click **{{< icon more >}} More**.
1. Click **Edit team**.
1. Click **+ Add projects**.
1. Select **All projects**, or choose individual projects from the dropdown.
1. Click **Add to team**.

**Option 2: Add teams to project from project's Access settings**

1. Navigate to your existing organization.
1. Click on the project you want to add to the existing team.
1. Navigate to the projects settings by clicking the **{{< icon settings >}} Settings** icon.
1. Click on **Access** settings under **Project settings** in the sidebar.
1. Click on the **TEAMS** tab in the **Access** list view.
1. Click **+Add to projects**.
1. Select **All teams**, or choose individual teams from the dropdown.
1. Click **Add to team**.

<--->
+++
title=Using the CLI
+++

To add the team `Frontend developers` (organization `deploy-friday-agency`) to the project `Django Commerce`,

```bash
ORGANIZATION=deploy-friday-agency
```

first retrieve the {{% variable "ORGANIZATION_ID" %}} with the command:

```bash
ORGANIZATION_ID=$({{% vendor/cli %}} organization:info -o $ORGANIZATION id)
```

Locate the {{% variable "PROJECT_ID" %}} as well by running:

```bash
PROJECT_ID=$({{% vendor/cli %}} project:list --pipe --title="Django Commerce" -o {{% variable "$ORGANIZATION" %}})
```

You can use the {{% variable "ORGANIZATION_ID" %}} to list the teams associated with it:

```bash
{{% vendor/cli %}} api:curl -X GET '/teams?filter[organization_id]={{% variable "ORGANIZATION_ID" %}}'
```

The response will include a {{% variable "TEAM_ID" %}} for the team `Frontend developers`. 
With all of this information in hand, grant the team access to the project:

**Option 1: Add team to the project**

```bash
{{% vendor/cli %}} api:curl -X POST "/projects/{{% variable "$PROJECT_ID" %}}/team-access" \
    --json '[{"team_id": "'"{{% variable "$TEAM_ID" %}}"'"}]' 
```

**Option 2: Add project to the team**

```bash
{{% vendor/cli %}} api:curl -X POST "/teams/{{% variable "$TEAM_ID" %}}/project-access" \
    --json '[{"project_id": "'"{{% variable "$PROJECT_ID" %}}"'"}]' 
```

{{< note theme="info" title="Tip" >}}
You can retrieve the {{% variable "TEAM_ID" %}} using a tool like `jq`. 
For example,

```bash
TEAM_ID=$({{% vendor/cli %}} api:curl -X GET \
    "/teams?filter[organization_id]=$ORGANIZATION_ID" \
    | jq -r '.items | to_entries[] | select(.value.label == "Frontend Developers") | .value.id')
```
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
1. Find the team you want to delete under the **Manage teams** list,
    then click **{{< icon more >}} More**.
1. Click **Edit team**.
1. Find the project you want to modify under the **PROJECTS** tab view,
    then click **{{< icon more >}} More**.
1. Click **Remove project**.
1. Select **All projects**, or choose individual projects from the dropdown.
1. Click **Yes** to confirm.

**Option 2: Remove teams from a project from project's Access settings**

1. Navigate to your existing organization.
1. Click on the project you want to add to the existing team.
1. Navigate to the projects settings by clicking the **{{< icon settings >}} Settings** icon.
1. Click on **Access** settings under **Project settings** in the sidebar.
1. Find the team under the **TEAMS** tab view,
    then click **{{< icon more >}} More**.
1. Click **Remove team**.
1. Click **Yes** to confirm.

<--->
+++
title=Using the CLI
+++
To remove the team `Frontend developers` (organization `deploy-friday-agency`) from the project `Django Commerce`,

```bash
ORGANIZATION=deploy-friday-agency
```

first retrieve the {{% variable "ORGANIZATION_ID" %}} with the command:

```bash
ORGANIZATION_ID=$({{% vendor/cli %}} organization:info -o $ORGANIZATION id)
```

Locate the {{% variable "PROJECT_ID" %}} as well by running:

```bash
PROJECT_ID=$({{% vendor/cli %}} project:list --pipe --title="Django Commerce" -o {{% variable "$ORGANIZATION" %}})
```

You can use the {{% variable "ORGANIZATION_ID" %}} to list the teams associated with it:

```bash
{{% vendor/cli %}} api:curl -X GET '/teams?filter[organization_id]={{% variable "ORGANIZATION_ID" %}}'
```

The response will include a {{% variable "TEAM_ID" %}} for the team `Frontend developers`. 
With all of this information in hand, remove the team's access to the project:

**Option 1: Remove team from the project**

```bash
{{% vendor/cli %}} api:curl -X DELETE "/projects/{{% variable "$PROJECT_ID" %}}/team-access/{{% variable "$TEAM_ID" %}}"
```

**Option 2: Remove project from the team**

```bash
{{% vendor/cli %}} api:curl -X DELETE "/teams/{{% variable "$TEAM_ID" %}}/project-access/{{% variable "$PROJECT_ID" %}}"
```

{{< note theme="info" title="Tip" >}}
You can retrieve the {{% variable "TEAM_ID" %}} using a tool like `jq`. 
For example,

```bash
TEAM_ID=$({{% vendor/cli %}} api:curl -X GET \
    "/teams?filter[organization_id]=$ORGANIZATION_ID" \
    | jq -r '.items | to_entries[] | select(.value.label == "Frontend Developers") | .value.id')
```
{{< /note >}}

{{< /codetabs >}}



