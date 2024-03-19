---
title: "Customize WordPress for {{% vendor/name %}}"
sidebarTitle: "Customize"
weight: -90
description: |
    Add some helpful dependencies, and modify your WordPress site to read from a {{% vendor/name %}} environment.
---

Deploying WordPress without Composer on {{% vendor/name %}} isn't recommended,
but should you wish to do so there are a few additional modifications you need to make to your repository.

## Place WordPress core into a subdirectory

{{< note >}}
If starting from scratch, you can skip to the section covering [`wp-config.php`](#wp-configphp) below.
{{< /note >}}

Keeping WordPress core up-to-date is made much easier when it resides in a subdirectory of your repository
and it makes the recommended transition to using Composer simpler.
It also makes defining WordPress as a submodule possible if you choose to do so. 

Place all code for WordPress core into a subdirectory called `wordpress`, including your `wp-config.php` file.

{{< note >}}
You can name the WordPress core subdirectory whatever you would like - the most common being `wp`, `web`, and `wordpress`. `wordpress` has been chosen for {{% vendor/name %}} templates and guides because it is often the default install location for [composer-flavored versions of WordPress](/guides/wordpress/deploy/_index.md), and naming it `wordpress` now in your project will make [migrating to use Composer](/guides/wordpress/composer/migrate.md) later on straightforward. If naming the directory something other than `wordpress`, make sure to update the `web.locations["/"].root` attribute to match in your `{{< vendor/configfile "app" >}}` file, as well as any other `root` attribute there.
{{< /note >}}

### Core, themes, and plugins can also be submodules

{{% vendor/name %}} validates and retrieves submodules in the first stages of its build process,
so it's possible to manage your code entirely this way.
This modifies the update steps from what's listed below,
so visit the [Git submodules](/development/submodules.md) documentation for more information.

## `.environment`

{{% vendor/name %}} provides multiple *environments* for your projects, that can be customized (with different values for staging and development), but that inherit features from the production environment. One clear case where this can be useful is environment variables. Each environment on {{% vendor/name %}} comes with a set of [pre-defined variables](../../../development/variables/use-variables.md#use-provided-variables) that provide information about the branch you are working on, the application's configuration, and the credentials to connect to each service defined in `{{< vendor/configfile "services" >}}`. 

Service credentials reside in a base64 encoded JSON object variable called `PLATFORM_RELATIONSHIPS`,
which you can use to define your database connection to the MariaDB container.
To make each property (username, password, and so on) more accessible to `wp-config.php`,
you can use the pre-installed `jq` package to clean the object into individual variables.

```text
# .environment

export DB_NAME=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].path")
export DB_HOST=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].host")
export DB_PORT=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].port")
export DB_USER=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].username")
export DB_PASSWORD=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].password")

export WP_HOME=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.primary == true) | .key')
export WP_SITEURL="${WP_HOME}wp"
export WP_DEBUG_LOG=/var/log/app.log
if [ "$PLATFORM_ENVIRONMENT_TYPE" != production ] ; then
    export WP_ENV='development'
else
    export WP_ENV='production'
fi
```
 
As you can see above, you can define a number of environment-specific or project-wide variable settings in this file
that are applied when deployed on {{% vendor/name %}} but not locally. 

## `wp-config.php`

Now that your database credentials have been cleaned up and `WP_HOME` defined, you can pull these values into `wp-config.php` to configure WordPress for deployment on a {{% vendor/name %}} environment. 

Below is the `wp-config.php` file from the [WordPress template](https://github.com/platformsh-templates/wordpress-vanilla) using the variables defined in the previous section. Many other WordPress settings are pre-defined in this file for you, so consult the inline comments for more information.

{{< readFile file="static/files/fetch/config-examples/wordpress-vanilla" highlight="php" >}}

Up to this point, this guide should give you the following project structure:

```txt
.
├── {{< vendor/configdir >}}
│   ├── {{< vendor/configfile "services" "strip" >}}
│   └── {{< vendor/configfile "routes" "strip" >}}
├── wordpress
│   ├── wp-admin
│   ├── wp-content
│   ├── wp-includes
│   ├── ...
│   ├── wp-cli.yml
│   └── wp-config.php
└── {{< vendor/configfile "app" >}}
```

{{< guide-buttons previous="Back" next="Deploy WordPress" >}}
