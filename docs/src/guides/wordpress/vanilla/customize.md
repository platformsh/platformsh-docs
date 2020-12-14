---
title: "Customize WordPress for Platform.sh"
sidebarTitle: "Customize"
weight: -90
toc: false
description: |
    Add some helpful dependencies, and modify your WordPress site to read from a Platform.sh environment.
---

## Wordpress core should reside in a subdirectory

{{< note >}}
If starting from scratch, you can skip to the section covering [`wp-config.php`](#wp-configphp) below.
{{< /note >}}

Keeping WordPress core up-to-date is made much easier when it resides in a subdirectory of your repository, and it will make the recommended transition to using Composer simpler. It also will make defining WordPress as a submodule possible if you choose to do so. 

If you have not done so already, place the code for WordPress core into a subdirectory called `wordpress`, including your `wp-config.php` file.

{{< note >}}
You can name the WordPress core subdirectory whatever you would like - the most common being `wp`, `web`, and `wordpress`. `wordpress` has been chosen for Platform.sh templates and guides because it is often the default install location for [composer-flavored versions of WordPress](/guides/wordpress/deploy/_index.md), and naming it `wordpress` now in your project will make [migrating to use Composer](/guides/wordpress/composer/migrate.md) later on straightforward.
{{< /note >}}

### Core, themes, and plugins can also be submodules

Platform.sh validates and retrieves submodules in the first stages of its build process, so it is possible to manage your code entirely this way. This will, of course, modify the update steps from what is listed below, so visit the [Git submodules](/development/submodules.md) documentation for more information.

## `.environment`

Platform.sh provides multiple *environments* for your projects, that can be customized (with different values for staging and development), but that inherit features from the (`master`) production environment. One case where this happens is through environment variables, 

{{< github repo="platformsh-templates/wordpress-vanilla" file=".environment" lang="txt" >}}

## `wp-config.php`

Platform.sh provides multiple *environments* for your projects, that can be customized (with different values for staging and development), but that inherit features from the (`master`) production environment. One case where this happens is through environment variables, 

With the Configuration Reader library installed, add or update a `wp-config.php` file in the root of your repository to match the code below. In this file, the library's `Config` object is used to:

- Retrieve connection credentials for MariaDB through the `database` relationship to configure the WordPress database. This will set up the database automatically and avoid you having to set the connection yourself during the installer. 
- Use the project's [routes](/configuration/routes/_index.md) to set `WP_HOME` and `WP_SITEURL` settings. 
- Set all of WordPress's security and authentication keys to the Platform.sh-provided `PLATFORM_PROJECT_ENTROPY` - a hashed variable specific to your repository consistent across environments. 

Many other WordPress settings are pre-defined in this file for you, so consult the inline comments for more information.

{{< github repo="platformsh-templates/wordpress-vanilla" file="wordpress/wp-config.php" lang="php" >}}

This will give you the following project structure:

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
