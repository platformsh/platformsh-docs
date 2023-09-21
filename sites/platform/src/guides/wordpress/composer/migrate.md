---
title: "Upgrade your WordPress site to use Composer"
sidebarTitle: Upgrade to use Composer
weight: 2
description: |
    Learn how to use WordPress with Composer on {{% vendor/name %}}.
---

Composer helps you declare, manage, and install all the dependencies needed to run your project.
It allows you to make your WordPress site [more stable, more secure, and easier to maintain](./_index.md).

With Composer, you don't need to commit all of WordPress core, its themes and plugins to your project's Git repository. 
You also don't need to manage any of these elements as Git submodules. 

## Before you begin

To update your WordPress site to use Composer, check that:

- You already have a [vanilla version of WordPress installed locally](../vanilla/_index.md).
- Your project has been set up for deployment on {{% vendor/name %}}.
  If you don't have {{% vendor/name %}} configuration files in your repository,
  [deploy WordPress without Composer](../vanilla/_index.md) before upgrading to a Composer-based site.
- You have [downloaded and installed Composer](https://getcomposer.org/download/).

## 1. Install WordPress with Composer

To install WordPress with Composer, complete the following steps:

1. Switch to a new Git branch.
    
   To safely make changes to your repository and {{% vendor/name %}} environment, run the following command:

   ```bash
   $ git checkout -b composer
   ```

2. Turn your repository into a Composer repository.

   To use Composer, you need:

   - A `composer.json` file listing all the dependencies needed for your project to run 
     (WordPress itself, its plugins, and its themes).
   - A `composer.lock` file listing the exact versions of all the dependencies installed on your project.
     Generated from the `composer.json` file, it ensures repeatable builds until you update.

   To turn your repository into a Composer repository and generate those files, run the following command:

   ```bash
   $ composer init
   ```

   When prompted, set metadata attributes for your project, 
   such as its name and license information.
   When you get to the part about installing dependencies, type `no`, 
   as you add them in step 5.

3. Clean up WordPress core.

   If you've been managing WordPress and its dependencies as Git submodules, [remove the submodules](../../../development/submodules.md#removing-submodules).

   Otherwise, your existing installation of WordPress core is assumed to be in a subdirectory of your repository (often named `wordpress`).
   For Composer to manage WordPress, remove this subdirectory: 

   ```bash
   $ rm -rf wordpress
   ```

   Then, at the end of your existing `.gitignore` file,
   add the content of {{% vendor/name %}}’s [template `.gitignore` file](https://github.com/platformsh-templates/wordpress-composer/blob/master/.gitignore). 

   This adds the `wordpress` subdirectory to the resulting `.gitignore` file. 
   This way, after Composer reinstalls WordPress, the `wordpress` subdirectory is ignored in commits.
    
   Now remove WordPress from the repository:

   ```bash
   $ git rm -rf --cached wordpress && rm -rf wordpress
   $ git add . && git commit -m "Remove WordPress"
   ```

4. Launch the installation of WordPress with Composer.

   Now that you have made your WordPress site into a Composer project, you can download packages via Composer.
   
   To download WordPress itself, run the following commands:

   ```bash
   $ composer require johnpbloch/wordpress-core-installer
   $ composer require johnpbloch/wordpress-core
   ```

   The two dependencies are now listed in your `composer.json` file:

   ```json
    {
        "require": {
            "johnpbloch/wordpress-core-installer": "^2.0",
            "johnpbloch/wordpress-core": "^6.0"
        }
    }
   ```

5. Complete the installation:
    
   ```bash
   $ composer install
   ```
     
   Composer reinstalls WordPress into the `wordpress` subdirectory.

## 2. Install WordPress themes and plugins with Composer

Just like with WordPress core, you can install themes and plugins with the `composer require` command.
To do so, complete the following steps:

1. Configure the WPackagist repository.

   By default, when you download dependencies using Composer, you retrieve them through [Packagist](https://packagist.org),
   which is the primary Composer repository for public PHP packages.
   Some themes and plugins for WordPress are also on Packagist,
   but most of them are accessible through a similar service specific to WordPress called [WPackagist](https://wpackagist.org). 

   To allow Composer to download packages from the WPackagist repository, run the following command: 

   ```bash
   $ composer config repositories.wppackagist composer https://wpackagist.org
   ```

   WPackagist is now listed in your `composer.json` file:

   ```json
    {
        "repositories": {
            "wppackagist": {
                "type": "composer",
                "url": "https://wpackagist.org"
            }
        }
    }
   ```

2. Optional: Configure theme and plugin destination.

   By default, Composer places installed dependencies in a `vendor` subdirectory.

   You can configure a different destination for your themes and plugins.
   For instance, to install them into `wp-content`, add the following configuration:

   ```json {location="composer.json"}
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
   
   Make sure you add the new destination subdirectories to your `.gitignore` file.

   After inspecting package metadata, Composer now installs plugins with a `type` of `wordpress-plugin` into `wordpress/wp-content/plugins/` instead of `vendor`.
   And similarly for themes and must-use plugins.


3. Launch the installation of plugins and themes with Composer.

   To search for themes and plugins in [WPackagist](https://wpackagist.org) and install them through Composer, run a `composer require` command:

   ```bash
   # Plugin
   $ composer require wpackagist-plugin/wordpress-seo

   # Theme
   $ composer require wpackagist-theme/hueman
   ```

   The two dependencies are now listed in your `composer.json` file.

4. Complete the installation:
    
   ```bash
   $ composer install 
   ````

   Each dependency is now installed.


## 3. Deploy to {{% vendor/name %}}

Switching to a Composer-based installation doesn't require any modifications to the {{% vendor/name %}} configuration files 
created when [you deployed your vanilla version](../vanilla/_index.md). 
Make sure that your project contains those three files. 
You can then commit all your changes 
and deploy your new Composer-based WordPress site to {{% vendor/name %}}:

```bash
git add . && git commit -m "Composerify plugins and themes."
git push {{% vendor/cli %}} composer
```

## 4. Update your Composer-based WordPress site

### Perform a standard update with Composer

Updating WordPress, your themes and plugins becomes a lot simpler with Composer. 
When a new version becomes available, create a new branch and launch the update:

```bash
git checkout -b updates
composer update
```

### Automate your updates with a source operation

{{< premium-features/tiered "Elite and Enterprise" >}}

[Source operations](../../../create-apps/source-operations.md) allow you to automate the maintenance of your Composer-based WordPress site. 
For instance, you can [update all the dependencies in your project with a single command](/learn/tutorials/dependency-updates.md).
