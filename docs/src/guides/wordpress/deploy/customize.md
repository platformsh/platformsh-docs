---
title: "Customize Wordpress for Platform.sh"
sidebarTitle: "Customize"
weight: -90
toc: false
description: |
    Add some helpful dependencies, and modify your WordPress site to read from a Platform.sh environment.
---

Now that your code contains all of the configuration to deploy on Platform.sh, it’s time to make your WordPress site itself ready to run on a Platform.sh environment. 

## Install the Config Reader

{{< guides/config-reader-php >}}

## `wp-config.php`

With the Configuration Reader library installed, add or update a `wp-config.php` file in the root of your repository to match the code below. In this file, the library's `Config` object is used to:

- Retrieve connection credentials for MariaDB through the `database` relationship to configure the WordPress database. This will set up the database automatically and avoid you having to set the connection yourself during the installer. 
- Use the project's [routes](/configuration/routes/_index.md) to set `WP_HOME` and `WP_SITEURL` settings. 
- Set all of WordPress's security and authentication keys to the Platform.sh-provided `PLATFORM_PROJECT_ENTROPY` - a hashed variable specific to your repository consistent across environments. 

Many other WordPress settings are pre-defined in this file for you, so consult the inline comments for more information.

{{< github repo="platformsh-templates/wordpress-composer" file="wp-config.php" lang="php" >}}

## Setting up Composer

Through this guide you will set up your WordPress repository to install everything during it's build using Composer. That includes themes, plugins, and even WordPress Core itself. Any new plugins you want to use or migrate from your existing application can be committed as dependencies using Composer, but there are a few changes we need to make to the `composer.json` file to prepare it for the final Platform.sh environment.  

First, the John Bloch script has a default `wordpress` installation directory, so the `composer.json` file will need to know to know that all new themes and plugins have a destination within that subdirectory. 

```json
  "extra": {
    "installer-paths": {
      "wordpress/wp-content/plugins/{$name}": [
        "type:wordpress-plugin"
      ],
      "wordpress/wp-content/themes/{$name}": [
        "type:wordpress-theme"
      ],
      "wordpress/wp-content/mu-plugins/{$name}": [
        "type:wordpress-muplugin"
      ]
    }
  }
```

Next, having placed `wp-config.php` in the root of your repository, you will need to add a `post-install-cmd` to move the file into `wordpress` after `composer install` has finished.

```json
  "scripts": {
    "copywpconfig": [
      "cp wp-config.php wordpress/"
    ],
    "post-install-cmd": "@copywpconfig"
  },
```

Since you'll likely be using [WPPackagist](https://wpackagist.org/) to download plugins and themes with Composer, you will also need to add `wppackagist.org` as a repository in `composer.json`.

```json
  "repositories": [
    {
      "type": "composer",
      "url": "https://wpackagist.org"
    }
  ]
```

Lastly, to prevent committing WordPress Core when it is installed via Composer, and to otherwise setup your local development environment, add a `.gitignore` file with the following to the root of the project:

{{< github repo="platformsh-templates/wordpress-composer" file=".gitignore" lang="bash" >}}


## Additional packages

Finally, install `wp-cli` and `psy/psych` using Composer. With these packages included, the WordPress CLI will be available to you when you SSH into the application container. 

```bash
$ composer require wp-cli/wp-cli-bundle psy/psysh --ignore-platform-reqs
```

{{< guide-buttons next="Deploy WordPress" >}}
