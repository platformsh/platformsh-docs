# Environment configuration

You can access the configuration page of an environment by clicking the configure link under the environment name.

![image](/images/ui-conf-environment.png)

## Settings

The `Settings` screen allows you to extend the behavior of a specific environment.

![Configure Platform.sh environment settings](/images/ui-conf-environment-settings.png)

The *Delete* action will destroy all services running on this environment (PHP, MySQL, volumes, etc.) so that only the Git branch remains. You can reactivate the environment later if needed.

To delete the branch as well, you need to execute the following:

```
git push origin :BRANCH-NAME
```

> **note**
> Deleting the Master environment is forbidden.

## Basic Autentication / Restrict access to IPs

You should not expose your development environments to the whole wide world. Platform.sh allows you to simply implement access control, either by login/password (the equivalent to .htaccess) or by filtering IP addresses or a network using the [CIDR format](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing).

> Changes to access control will only become active on the environment's next deployment.

These settings get inherited by branches below the one you are one. So if you create a `staging` environment, and you create branches from this one, they will all inherit the same authentication information. So you only have to set-it up once.

You can also setup authentication with the CLI using the following command `platform environment:http-access` which also allows you to read the current setup. This eases the integration of CI jobs with Platform.sh as you will not need to hardcode the values in the CI.

You can allow or deny access to specific IPs / networks by switching `ON` the access control button and then adding CIDRs followed by `allow` or `deny` mention as you want.

![Allowing or denying specific ips to project settings](/images/ui-conf-project-access-ip-settings.png)

## Variables

The `Variables` screen allows you to define the variables that will be available on a specific environment.

![Configure Platform.sh environment variables](/images/ui-conf-environment-variables.png)

## Routes

The `Routes` screen allows you to configure the routes of your environments.

![Configure Platform.sh environment routes](/images/ui-conf-environment-routes.png)

## Users

The `Users` screen allows you to manage the users' access on your project.

You can invite new users to a specific environment by clicking the `Add user` link and entering their email address, or modify permissions of existing users by clicking the `Edit` link when hovering the user.

![Manage users of your Platform.sh environments](/images/ui-conf-environment-users.png)

> **note**
>
> Currently, permission changes that grant or revoke SSH access to an environment take effect only after the next time that environment is deployed.

Selecting a user will allow you to either edit or remove access to that environment.

You can also manage access to users on multiple environments using the project configuration screen.

## X-Robots-Tag

By default, Platform.sh includes an additional `X-Robots-Tag` header on all non-production environments:

```
X-Robots-Tag: noindex, nofollow
```

That tells search engines to not index sites on non-production environments entirely nor traverse links from those sites, even if they are publicly visible.  That keeps non-production sites out of search engine indexes that would dilute the SEO of the production site.  To disable that feature for a non-production environment, use the [Platform.sh CLI](/gettingstarted/cli.md) command below:

```
platform environment:info restrict_robots false
```

Or to disable it for a specific environment other than the one that is currently checked out, execute the following:

```
platform environment:info -e ENVNAME restrict_robots false
```

where `ENVNAME` is the name of the environment.

On a production instance (the master branch, after a domain has been assigned) the search-blocker is disabled and your application can serve a `robots.txt` file as normal.  However, you must ensure that the file is in your project's web root (the directory where the `/` location maps to) and your application is configured to serve it.  See [the location section in `.platform.app.yaml`](/configuration/app/web.md#locations).
