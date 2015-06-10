# Environment configuration

You can access the configuration page of an environment by clicking the
configure link under the environment name.

![image](images/ui-conf-environment.png)

## Settings

The `Settings` screen allows you to extend the behavior of a specific
environment.

![Configure Platform.sh environment settings](images/ui-conf-environment-settings.png)

> **note**
> Deleting the Master environment is forbidden.

The access control is very helpful if you need your development
environments to be restricted by a login/password, or be accessible by
only a certain range of IP addresses.

## Variables

The `Variables` screen allows you to define the variables that will be
available on a specific environment.

![Configure Platform.sh environment variables](images/ui-conf-environment-variables.png)

## Routes

The `Routes` screen allows you to configure the routes of your
environments.

![Configure Platform.sh environment routes](images/ui-conf-environment-routes.png)

## Users

The `Users` screen allows you to manage users access on your project.

You can invite new users to a specific environment by clicking the
`Add user` link and entering their email address, or modify permissions
of existing users by clicking the `Edit` link when hovering the user.

![Manage users of your Platform.sh environments](images/ui-conf-environment-users.png)

Selecting a user will allow you to either edit or remove access to that
environment.

You can also manage access to users on multiple environments using the
project configuration screen \<ui\_project\_users\>.
