# Environment configuration

You can access an environment's settings by selecting that environment from the `Select Environments` pull-down menu at the top of the page or by clicking that environment within the Environments graphic on the right side. Click the `Settings` tab at the top of the screen.

## General

The `General` screen allows you to extend the behavior of a specific environment.

![env gen settings](/images/env_settings.png)

### Environment name

The first setting allows you to modify the name of the environment and view its parent environment.

### Status

From the `Status` tab, you can activate or delete an environment. 

![env status](/images/env_status.png)

The `Delete` action will destroy all services running on this environment (PHP, MySQL, volumes, etc.) so that only the Git branch remains. You can reactivate the environment later if needed.

To delete the branch as well, you need to execute the following:

```
git push origin :BRANCH-NAME
```

> **note**
> Deleting the Master environment is forbidden.

### Outgoing emails

From this tab, you can allow your application to send emails via a SendGrid SMTP proxy. 

![env email](/images/env_email.png)

Changing this setting will temporarily list the environment's status as "Building", as the project re-builds with the new setting. Once it has re-deployed, it will appear once again as "Active" in your settings.


### Search engine visibility

From this tab, you can tell search engines to ignore the site entirely, even if it is publicly visible.

![env search](/images/env_search.png)


### X-Robots-Tag

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



### HTTP access control

You should not expose your development environments to the whole wide world. Platform.sh allows you to simply implement access control, either by login/password (the equivalent to .htaccess) or by filtering IP addresses or a network using the [CIDR format](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing).  That is, `4.5.6.7` and `4.5.6.0/8` are both legal formats.

> **note**
> Changing access control will trigger a new deploy of the current environment. However, the changes will not propagate to child environments until they are manually redeployed.

These settings get inherited by branches below the one you are on. That means if you create a `staging` environment, and you create branches from this one, they will all inherit the same authentication information and you only have to set-it up once.

You can also setup authentication with the CLI using the following command `platform environment:http-access` which also allows you to read the current setup. This eases the integration of CI jobs with Platform.sh as you will not need to hardcode the values in the CI.

You can allow or deny access to specific IPs or IP ranges. First switch the access control section to ON. Then add one or more IPs or CIDR IP masks, followed by allow or deny. See the example below. Note that allow entries should come before deny entries in case both of them would match.

![Allowing or denying specific ips to project settings](/images/settings_basics_access control.png)

For example, the following configuration will only allow the 1.2.3.4 IP to access your website.

```
1.2.3.4/32 allow
0.0.0.0/0 deny
```


## Access

The `Access` screen allows you to manage the users' access on your project.

You can invite new users to a specific environment by clicking the `Add` button and entering their email address, or modify permissions of existing users by clicking the `Edit` link when hovering the user.

![Manage users of your Platform.sh environments](/images/settings_environ_access.png)

> **note**
>
> Currently, permission changes that grant or revoke SSH access to an environment take effect only after the next time that environment is deployed.

Selecting a user will allow you to either edit or remove access to that environment.

You can also manage access to users on multiple environments using the project configuration screen.


## Variables

The `Variables` screen allows you to define the variables that will be available on a specific environment.

![Configure Platform.sh environment variables](/images/settings_variables-environment.png)

## Routes

The `Routes` screen describes the configuration features that define the routes of your application. Routes cannot be edited here, but it provides a simple routes configuration example for your project's `.platform/routes.yaml` file.

![Configure Platform.sh environment routes](/images/routes.png)

Consult the documentation for more information about properly configuring [Routes](/configuration/routes.html) for your project.
