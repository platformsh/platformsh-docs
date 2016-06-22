# Environment configuration

You can access the configuration page of an environment by clicking the
configure link under the environment name.

![image](/images/ui-conf-environment.png)

## Settings

The `Settings` screen allows you to extend the behavior of a specific
environment.

![Configure Platform.sh environment settings](/images/ui-conf-environment-settings.png)

The *Delete* action will destroy all services running on this environment (PHP, MySQL, volumes...) 
so that only the Git branch remains. You can reactivate the environment later if needed.

To also delete the branch, you need to use Git and run:

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

The `Users` screen allows you to manage users access on your project.

You can invite new users to a specific environment by clicking the
`Add user` link and entering their email address, or modify permissions
of existing users by clicking the `Edit` link when hovering the user.

![Manage users of your Platform.sh environments](/images/ui-conf-environment-users.png)

> **note**
> Currently, permissions changes that grant or revoke SSH access to an
> environment take effect only after the next time that environment is
> deployed.

Selecting a user will allow you to either edit or remove access to that
environment.

You can also manage access to users on multiple environments using the
project configuration screen.

## Robots.txt

By default, Platform.sh returns a restrictive `robots.txt` on all environments. If you need to provide a custom `robots.txt`, first disable the default one by [Platform.sh CLI](/user_guide/overview/cli/index.html) command below.

```
platform environment:info restrict_robots false
```

Then, you have to serve your `robots.txt` by configuring ["/" location in `.platform.app.yaml`](/user_guide/reference/platform-app-yaml.html#locations).

> **note**
> A deployment is required after running the CLI command to make the changes effective.

