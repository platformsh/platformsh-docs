---
title: "How to update your WordPress site to use Composer"
sidebarTitle: Upgrade to use Composer
weight: 2
description: |
    Everything you need to get started with WordPress on Platform.sh. 
---

Composer helps you declare, manage, and install all the dependencies needed to run your project.
It allows you to make your WordPress site [more stable, more secure, and easier to maintain](./_index.md).

To update your WordPress site to use Composer, check that:

- You already have a [vanilla version of WordPress installed locally](./_index.md).
- Your WordPress core, themes, and plugins are committed to your WordPress repository or committed as submodules.
- Your project has been set up for deployment on Platform.sh.
  If you do not have Platform.sh configuration files in your repository,
  make sure you [deploy WordPress without Composer](./_index.md) before upgrading to a Composer-based site.

## Install WordPress with Composer

Instead of committing all of WordPress to your repository (or adding it as a submodule), you can install it with Composer. To do so:

1. **Download Composer** 

    If you do not already have Composer installed, [install it now](https://getcomposer.org/download/).

2. Switch to a new Git branch
    
   To safely make changes to your repository and Platform.sh environment, run the following command:

    ```bash
    $ git checkout -b composer
    ```
3. **Turn your repository into a Composer repository**

   To use Composer, you need:

   - A `composer.json` file listing all the dependencies needed for your project to run (WordPress itself, its plugins, and its themes).
   - A `composer.lock` file listing the exact versions of all the dependencies installed on your project.
     Generated from the `composer.json` file, it ensures repeatable builds until you update.

   To turn your repository into a Composer repository and generate those files, run the following command:

    ```bash
    $ composer init
    ```

   When prompted, set metadata attributes for your project (name, license information...).
   When you get to the part about installing dependencies, type `no`, as you will add them later.

4. **Clean up WordPress core**

     Your existing installation of WordPress core is assumed to be in a subdirectory of your repository (often named `wordpress`). For Composer to manage WordPress, **this subdirectory needs to be overwritten**. Make sure that you move all your important data to another subdirectory. For instance, add your plugins and themes to a separate `plugins` subdirectory. 

    Unless you are managing WordPress core as a [submodule](/development/submodules.md#removing-submodules), you can now remove the `wordpress` subdirectory: 

    ```bash
    $ rm -rf wordpress
    ```

    Then, you need to overwrite your existing `.gitignore` file with Platform.sh’s template `.gitignore` file, which is then used to complete the setup for Composer. Note that the `wordpress` subdirectory is added to the resulting `.gitignore` file. This way, after Composer reinstalls WordPress, the `wordpress` subdirectory will be ignored in commits:

    ```bash
    $ curl https://raw.githubusercontent.com/platformsh/template-builder/master/templates/wordpress-composer/files/.gitignore >> .gitignore
    ```
    
    You can now remove WordPress from the repository:

    ```bash
    $ git rm -rf --cached wordpress && rm -rf wordpress
    $ git add . && git commit -m "Remove WordPress"
    ```

4. **Launch the installation of WordPress with Composer**

    Now that you have made your WordPress site into a Composer project, you can download packages via Composer. To download WordPress itself, run the commands:

    ```bash
    $ composer require johnpbloch/wordpress-core-installer
    $ composer require johnpbloch/wordpress-core
    ```

    The two dependencies are now listed in your `composer.json` file:

    ```json
    {
        "require": {
            "johnpbloch/wordpress-core-installer": "^2.0",
            "johnpbloch/wordpress-core": "^5.5"
        }
    }
    ```

    Complete the installation:
    
    ```bash
     $ composer install
     ```
     
     Composer reinstalls WordPress into the `wordpress` subdirectory.

## Install WordPress Themes and Plugins with Composer

Just like WordPress core, you can install themes and plugins with the `composer require` command. To do so:

1. **Configure the WPackagist repository**

    By default, when you download dependencies using Composer, you retrieve them through [Packagist](https://packagist.org),
    which is the primary Composer repository for public PHP packages.
    Some themes and plugins for WordPress are also on Packagist,
    but most of them are accessible through a similar service specific to WordPress called [WPackagist](https://wpackagist.org). 

    To allow Composer to download packages from the WPackagist repository, add it to your `composer.json` file: 

    ```bash
    $ composer config repositories.wppackagist composer https://wpackagist.org
    ```

    WPackagist is now listed in your `composer.json`:

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

2. **(Optional) Configure theme and plugin destination**

    By default, Composer places installed dependencies in a subdirectory called `vendor` in your repository. But you can configure a different destination for your themes and plugins. For instance, to install them into `wp-content`, add the following block to your `composer.json` file:

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

    After inspecting package metadata, Composer now installs the plugins whose `type` matches `wordpress-plugin` into `wordpress/wp-content/plugins/` instead of `vendor`, and the same goes for themes and must-use plugins. 

3. **Launch the installation of plugins and themes with Composer**

    To search for themes and plugins in [WPackagist](https://wpackagist.org) and install them through Composer, run a `composer require` command:

    ```bash
    # Plugin
    $ composer require wpackagist-plugin/wordpress-seo

    # Theme
    $ composer require wpackagist-theme/hueman
    ```

    The two dependencies are now listed in your `composer.json` file.

    Complete the installation:
    
    ```bash
     $ composer install 
     ````

    Each dependency is now installed and has a subdirectory in `wordpress/wp-content/`.


## Deploy to Platform.sh

Switching to a Composer-based installation doesn't require any modifications to the Platform.sh configuration files created when [you deployed your vanilla version](/guides/wordpress/vanilla/_index.md). Make sure that your project contains those three files. You can then commit all your changes and deploy your new Composer-based WordPress site to Platform.sh:

```bash
$ git add . && git commit -m "Composerify plugins and themes."
$ git push platform composer
```

## Update your Composer-based WordPress site

### Perform a standard update with Composer

Updating WordPress, your themes and plugins becomes a lot simpler with Composer. When a new version becomes available, create a new branch and launch the update:

```bash
$ git checkout -b updates
$ composer update
```

### Automate your updates with a source operation

{{< tiered-feature "Elite and Enterprise" >}}

[Source operations](/create-apps/source-operations.md) allow you to automate the maintenance of your Composer-based WordPress site. 
For instance, you can [update all the dependencies in your project with a single command](/create-apps/source-operations#update-dependencies).