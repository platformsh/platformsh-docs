---
title: "Customize WordPress for Platform.sh"
sidebarTitle: "Customize"
weight: -90
toc: false
description: |
    Add some helpful dependencies, and modify your WordPress site to read from a Platform.sh environment.
---

Deploying WordPress without Composer on Platform.sh is not recommended, but should you wish to do so there are a few additional modifications you will need to make to your repository.

## Place WordPress core into a subdirectory

{{< note >}}
If starting from scratch, you can skip to the section covering [`wp-config.php`](#wp-configphp) below.
{{< /note >}}

Keeping WordPress core up-to-date is made much easier when it resides in a subdirectory of your repository, and it will make the recommended transition to using Composer simpler. It also will make defining WordPress as a submodule possible if you choose to do so. 

Place all code for WordPress core into a subdirectory called `wordpress`, including your `wp-config.php` file.

{{< note >}}
You can name the WordPress core subdirectory whatever you would like - the most common being `wp`, `web`, and `wordpress`. `wordpress` has been chosen for Platform.sh templates and guides because it is often the default install location for [composer-flavored versions of WordPress](/guides/wordpress/deploy/_index.md), and naming it `wordpress` now in your project will make [migrating to use Composer](/guides/wordpress/composer/migrate.md) later on straightforward. If naming the directory something other than `wordpress`, make sure to update the `web.locations["/"].root` attribute to match in your `.platform.app.yaml file`, as well as any other `root` attribute there.
{{< /note >}}

### Core, themes, and plugins can also be submodules

Platform.sh validates and retrieves submodules in the first stages of its build process, so it is possible to manage your code entirely this way. This will, of course, modify the update steps from what is listed below, so visit the [Git submodules](/development/submodules.md) documentation for more information.

## `.environment`

Platform.sh provides multiple *environments* for your projects, that can be customized (with different values for staging and development), but that inherit features from the (`master`) production environment. One clear case where this can be useful is environment variables. Each environment on Platform.sh comes with a set of [pre-defined variables](/development/variables.html#platformsh-provided-variables) that provide information about the branch you are working on, the application's configuration, and the credentials to connect to each service defined in `services.yaml`. 

Service credentials reside in a base64 encoded JSON object variable called `PLATFORM_RELATIONSHIPS`, and it is from this variable that you can define your database connection to the MariaDB container. To make each property (username, password, etc.) more easily accessible to `wp-config.php`, you can use the pre-installed `jq` package to clean the object into individual variables.
 
{{< github repo="platformsh-templates/wordpress-vanilla" file=".environment" lang="txt" >}}

As you can see above, you can define a number of environment-specific or project-wide variable settings in this file that will be applied when deployed on Platform.sh but not locally. 

## `wp-config.php`

Now that your database credentials have been cleaned up and `WP_HOME` defined, you can pull these values into `wp-config.php` to configure WordPress for deployment on a Platform.sh environment. 

Below is the `wp-config.php` file from the [WordPress template](https://github.com/platformsh-templates/wordpress-vanilla) using the variables defined in the previous section. Many other WordPress settings are pre-defined in this file for you, so consult the inline comments for more information.

{{< github repo="platformsh-templates/wordpress-vanilla" file="wordpress/wp-config.php" lang="php" >}}

Up to this point, this guide should give you the following project structure:

```txt
.
├── .platform
│   ├── services.yaml
│   └── routes.yaml
├── wordpress
│   ├── wp-admin
│   ├── wp-content
│   ├── wp-includes
│   ├── ...
│   ├── wp-cli.yml
│   └── wp-config.php
└── .platform.app.yaml
```

{{< guide-buttons next="Deploy WordPress" >}}