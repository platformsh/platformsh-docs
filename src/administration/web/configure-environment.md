# Environment configuration

You can access the configuration page of an environment by clicking the
configure link under the environment name.

![image](/images/ui-conf-environment.png)

## Settings

The `Settings` screen allows you to extend the behavior of a specific
environment.

![Configure Platform.sh environment settings](/images/ui-conf-environment-settings.png)

The *Delete* action will destroy all services running on this environment (PHP, MySQL, volumes, etc.)
so that only the Git branch remains. You can reactivate the environment later if needed.

To delete the branch as well, you need to execute the following:

```
git push origin :BRANCH-NAME
```

> **note**
> Deleting the Master environment is forbidden.

The access control is very helpful if you need your development
environments to be restricted by a login/password, or be accessible by
only a certain range of IP addresses. Changes to access control will
only become active on the environment's next deployment.

## Variables

The `Variables` screen allows you to define the variables that will be
available on a specific environment.

![Configure Platform.sh environment variables](/images/ui-conf-environment-variables.png)

## Routes

The `Routes` screen allows you to configure the routes of your
environments.

![Configure Platform.sh environment routes](/images/ui-conf-environment-routes.png)

## Users

The `Users` screen allows you to manage the users' access on your project.

You can invite new users to a specific environment by clicking the
`Add user` link and entering their email address, or modify permissions
of existing users by clicking the `Edit` link when hovering the user.

![Manage users of your Platform.sh environments](/images/ui-conf-environment-users.png)

> **note**
> Currently, permission changes that grant or revoke SSH access to an
> environment take effect only after the next time that environment is
> deployed.

Selecting a user will allow you to either edit or remove access to that
environment.

You can also manage access to users on multiple environments using the
project configuration screen.

## Robots.txt

By default, Platform.sh serves the following default and restrictive `robots.txt` on all non-production environments:

```
User-agent: *
Disallow: /
```

That tells search engines to ignore pre-production sites entirely, even if they are publicly visible.  To disable that feature for pre-production sites use the [Platform.sh CLI](/overview/cli.md) command below:

```
platform environment:info restrict_robots false
```

Or to disable it for a specific environment other than the one that is currently checked out, execute the following:

```
platform environment:info -e ENVNAME restrict_robots false
```

(Where `ENVNAME` is the name of the environment, which is generally the branch associated with it.)  Note that you will need to trigger a new deployment after changing this setting.

On a production instance (the master branch, after a domain has been assigned) the search-blocker is disabled and your application can serve a `robots.txt` file as normal.  However, you must ensure that the file is in your project's web root (the directory where the `/` location maps to) and your application is configured to serve it.  See [the location section in `.platform.app.yaml`](/configuration/app-container.md#locations).
