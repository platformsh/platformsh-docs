---
title: Deploying WordPress on Upsun
sidebarTitle: WordPress
weight: -75
description: |
    Welcome to the Upsun documentation specific to the WordPress CMS on Upsun.
    It includes common reference materials useful for deploying WordPress, but also external community and blog
  resources that cover more advanced topics relevant for the CMS.
---


{{< note theme="info" >}}

Before you proceed, be sure to checkout the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project)
and the main [Getting started guide](/get-started/here/_index.md). These two resources provide all of the core concepts
and common commands you'll need to know before using the materials below.

{{< /note >}}

Now that you have completed the [Getting started guide](/get-started/here/_index.md), there are a few remaining changes
required in order to have a successful deployment of WordPress on Upsun. WordPress, like Upsun, is extremely flexible
meaning that there are dozens of ways to set up your WordPress site, and dozens of ways to configure your Upsun project.
To complete these getting started steps, the following assumptions are made:
* You are building a composer-based WordPress site using John P Bloch's [WordPress Composer Fork](https://github.com/johnpbloch/wordpress)
* You do not have a composer.json file, or are comfortable making changes to your existing version
* You selected PHP as your runtime, and Mariadb as your service in the Getting Started guide

## Additional Files Required
Copy the following files from the [Platform.sh WordPress Composer template](https://github.com/platformsh-templates/wordpress-composer/)
and add them to the root of your project
* [composer.json](https://raw.githubusercontent.com/platformsh-templates/wordpress-composer/61da65da21039b280b588642cd329a2eb253e472/composer.json)
* [wp-cli.yml](https://github.com/platformsh-templates/wordpress-composer/blob/61da65da21039b280b588642cd329a2eb253e472/wp-cli.yml)
* [wp-config.php](https://github.com/platformsh-templates/wordpress-composer/blob/61da65da21039b280b588642cd329a2eb253e472/wp-config.php)

Add a directory `plugins` and a file `.gitkeep` inside of it.

{{< note theme="info" >}}
If you do not anticipate the need to support non-public plugins, or already have an alternative method to support them
you can skip adding a `plugins` directory to your project.
{{< /note >}}

git 
