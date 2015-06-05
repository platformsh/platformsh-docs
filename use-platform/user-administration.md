# User administration

##User roles

Every Platform.sh user has a role. A role allows to control access and
improve security on your project - different roles are authorized to do
different things with your applications, environments and users. You can
use your collection of Roles to manage how users interact with
Platform.sh.

At the project level:

-   **Project Administrator** - A project administrator can change
    settings and execute actions on any environment.
-   **Project Reader** - A project reader can view all environments
    within a project but cannot execute any actions on them.

A Project Reader can have a specific role on different environments. At
the environment level:

-   **Environment Administrator** - An environment administrator can
    change settings and execute actions on this environment.
-   **Environment Contributor** - An environment contributor can push
    code to this environment. He or she can also branch the environment.
-   **Environment Reader** - An environment reader can only view this
    environment.

When a development team works on a project, the team leader can be the
project administrator and decide which roles to give his team members.
One team member can contribute to one environment, another member can
administer a different environment and the customer can be a reader of
the `master` environment.

If you want your users to be able to see everything (Reader), but only
commit to a specific branch, change their permission level on that
environment to "Contributor".

> **note**

> The project owner - the person licensed to use Platform.sh - doesn't
> have special powers. A project owner usually has a project
> administrator role.

------------------------------------------------------------------------

## Manage user permissions at the project level

> Access the project-level configuration.
>
> ![Project configure icon](/use-platform/images/project_w-configarrow.png)
>
> Click the project configuration icon next to the project name in the
> upper-left corner of the project page.

------------------------------------------------------------------------

> Manage users.
>
> ![Project user management screenshot](/use-platform/images/project_usermanagement.png)
>
> The `Access control` tab shows project-level users and their roles.
>
> Selecting a user will allow you either to edit that user's permissions
> or delete the user's access to the project entirely.
>
> Add a new user by clicking on the `Add user` button.
>
> If you select the 'Reader' role for the user, you'll have the option
> of adjusting the user's permissions at the environment level.

------------------------------------------------------------------------

## Manage user permissions at the environment level

> Access the environment-level configuration.
>
> ![Project configure icon](/use-platform/images/environment_w-configarrow.png)
>
> Click the environment configuration icon next to the environment name
> on the project page.

------------------------------------------------------------------------

> Manage users.
>
> ![Project user management screenshot](/use-platform/images/environment_usermanagement.png)
>
> The `User Management` tab shows environment-level users and their
> roles.
>
> Selecting a user will allow you either to edit that user's permissions
> or delete the user's access to the environment entirely.
>
> Add a new user by clicking on the `Add user` button.

> **note**

> After a new user is added to the environment, it needs to be rebuilt
> (git push) for the changes to take effect. When the environment
> rebuild is complete, allow a minute for the routes to update fully and
> for the new user to be able to use SSH access.
