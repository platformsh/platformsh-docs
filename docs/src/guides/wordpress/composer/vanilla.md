---
title: "WordPress without Composer on Platform.sh"
weight: 1
sidebarTitle: "Not using Composer"
description: |
    Everything you need to get started with WordPress on Platform.sh. 
---

This guide will take you through the steps of setting up "vanilla" WordPress - that is, WordPress not managed through Composer, but rather by either fully committing Wordpress, themes, and plugins or defining them with submodules - on Platform.sh. It should be noted that this approach comes with certain limitations based on the way Platform.sh works, and for this reason is [not recommended](/guides/wordpress/composer/_index.md). Instead, consider using the ["Upgrade to use Composer"](/guides/wordpress/composer/migrate.md) guide to modify your project into one that uses Composer. 

## Setting up Vanilla WordPress for Platform.sh

### Wordpress core should reside in a subdirectory

Keeping WordPress core up-to-date is made much easier when it resides in a subdirectory of your repository, and it will make the recommended transition to using Composer simpler. It also will make defining WordPress as a submodule possible if you choose to do so. 

If you have not done so already, place the code for WordPress core into a subdirectory called `wordpress`, including your `wp-config.php`.

{{< note >}}
You can name the WordPress core subdirectory whatever you would like - the most common being `wp`, `web`, and `wordpress`. `wordpress` has been chosen for Platform.sh templates and guides because it is often the default install location for [composer-flavored versions of WordPress](/guides/wordpress/deploy/_index.md), and naming it `wordpress` now in your project will make [migrating to use Composer](/guides/wordpress/composer/migrate.md) later on straightforward.
{{< /note >}}

### Core, themes, and plugins can also be submodules

Platform.sh validates and retrieves submodules in the first stages of its build process, so it is possible to manage your code entirely this way. This will, of course, modify the update steps from what is listed below, so visit the [Git submodules](/development/submodules.md) documentation for more information.

## Deploying to Platform.sh

{{< guides/config-desc name="WordPress" >}}

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

### Requests configuration: `routes.yaml`

{{< guides/config-routes template="wordpress-vanilla" name="WordPress" >}}

### Service configuration: `services.yaml`

The `services.yaml` file lists the pre-packaged services you need for your application to run. You pick the major version of the service, and Platform.sh updates the patch version periodically so that you always get the newest version when you deploy.

We recommend the latest [MariaDB](/configuration/services/mysql.md) version for WordPress. You can add [other services](/configuration/services/_index.md) if desired, such as [Solr](/configuration/services/solr.md) or [Elasticsearch](/configuration/services/elasticsearch.md). You will need to configure WordPress to use those services as well once the service is enabled.

Each service entry has a name (`db` in the example below), as well as a `type` that specifies the service and version to use.  Note that not all services support clean version upgrades, and none support downgrades.  If you want to try upgrading a service, confirm on its service page that it's supported and test on a branch before pushing to your `master` branch.

If a service stores persistent data then it will also have a `disk` key, which specifies the amount of storage to give it, in MB.

{{< readFile file="static/files/fetch/servicesyaml/wordpress-vanilla" highlight="yaml" >}}

### Application container: `.platform.app.yaml`

{{< guides/config-app template="wordpress-vanilla" >}}

You will see that in this file the WordPress CLI is installed in the application container during the build process. Also, the `web.locations` block will expose `wordpress/index.php` under the primary route. 

{{< /guides/config-app >}}

### Deploy 

#### Tools

{{< guides/tools >}}

#### Sign up for Platform.sh and initialize your project

You will first need to visit the [Platform.sh accounts](https://accounts.platform.sh/platform/trial/general/setup) page and fill out your information to set up your trial account. If you don't want to sign up initially with your e-mail address, you can sign up using an existing GitHub, Bitbucket, or Google account. If you choose one of these options, you will be able to set a password for your Platform.sh account later.

After creating an account, you will be prompted to create your first project. Since you'll be providing your own code, use the "Blank project" option. You will be able to give the project a title and choose a region closest to the visitors of your site. You also have the option to select more resources for your project, although the `development` plan should be enough for you to get started.

The easiest way to get the ID of the project is to run just `plaform` on its own, which lists all of your projects. As you have only one project, you can copy its ID. Then in your Git repository run

```bash
$ platform set-remote <PROJECT_ID>
```

That creates an upstream called platform for your Git repository. Don't push to it yet, but once the project is fully configured you will be able to push to that remote and have the project build automatically.

## Updating WordPress core, themes, and plugins

Platform.sh allows you plenty of flexibility to define how your WordPress sites are built and deployed, but with one important caveat: once the build stage has completed, the file system will be read-only from that point on. It's for this reason that updating core, themes, and plugins from within the administration panel of the deployed site is not an option, and why the subdirectory recommendations have been included in this guide. 

Following [WordPress's update recommendations](https://wordpress.org/support/article/updating-wordpress/), you can add a script to the project root called `update-wpcore.sh` that will quickly update WordPress with your updated repository, either with the latest version or with a specific one you have specified (i.e. `./update-wpcore.sh 5.5.1)

```bash
#!/usr/bin/env bash

TMP='wpcore-update'
WP_INSTALL_DIR='wordpress'

update () {
    curl https://wordpress.org/$(get_version $1) -o $TMP.tar.gz
    rm -rf $WP_INSTALL_DIR/wp-includes && rm -rf $WP_INSTALL_DIR/wp-admin
    tar -xvf $TMP.tar.gz && rm $TMP.tar.gz
}

get_version () {
    if [ -z "$1" ]
    then
        echo "latest"
    else
        echo wordpress-$1.tar.gz
    fi
}

update $1
```

Whenever a new version of WordPress is released, create a new branch and run the script to get the latest version:

```bash
$ git checkout -b update-wp
$ ./update-wpcore.sh
...
$ git add . && git commit -m "Update WordPress."
$ git push platform update-wp
```

Merge the changes when you're satisfied that your tests are passing as expected, and replicate the approach for themes and plugins if desired. 

{{< note >}}
It is technically possible to define write access to select parts of the file system to enable at runtime updates to core, themes, and plugins through the use of [mounts](/configuration/app/storage.md#basic-mounts). Since [Composer](/guides/wordpress/composer/migrate.md) is the recommended way to manage WordPress on Platform.sh, this approach is not included in this guide. If you would like to take your project in this direction, keep two things in mind:

1. Platform.sh project file systems are read-only for security reasons - placing code in a writable directory creates a potential route for exploiting your site, and is generally not best practice. 
2. When mounts are added to your application container, *the contents of that subdirectory (i.e. `wp-content/plugins/`) will be overwritten by the persistent contents of that mount**. Sticking to the recommendation that plugins and themes should remain in subdirectories outside of core will be fine, but should you try to commit them within `wordpress`, they will be lost by runtime.

{{< /note >}}