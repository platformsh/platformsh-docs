---
title: "How to update your WordPress site to use Composer"
sidebarTitle: Upgrade to use Composer
weight: 2
description: |
    Everything you need to get started with WordPress on Platform.sh. 
---

This guide will take you through the steps to update your [*vanilla*](/guides/wordpress/vanilla/_index.md), fully committed, WordPress repository to one fully managed with Composer. It is assumed that you already have (locally) a vanilla version of WordPress where all of core, themes, and plugins are committed to the repository or committed as submodules, and that it has been set up for deployment on Platform.sh. Because of these assumptions, you should already have Platform.sh configuration files in your repository to deploy the resulting Composer-based WordPress site on Platform.sh. If you do not, follow the [previous guide](/guides/wordpress/vanilla/_index.md) and add them. 

For more context regarding why Platform.sh recommends Composer-based installations of WordPress, see the ["Using Composer" guide](/guides/wordpress/composer/_index.md).

## WordPress Core

Instead of committing all of WordPress to your repository (or adding it as a submodule), this section will show you how to install WordPress through Composer. 

1. **Download Composer** 

    If you do not already have Composer installed, [install it now](https://getcomposer.org/download/).

2. **Branch** 
    
    Since you will be making changes to your repository and Platform.sh environment, branch your codebase:

    ```bash
    $ git checkout -b composer
    ```
3. **Initialize repository as Composer project**

    You will need to have a `composer.json` on your project to use Composer. This file defines the dependencies you want to include (WordPress itself, plugins, and themes). When those dependencies are installed, a matching `composer.lock` file will be generated from it that locks each of them down to the minor version, ensuring repeatable builds until you update.
    
    Run the command:

    ```bash
    $ composer init
    ```

    This will prompt you to set some metadata attributes for the project, such as its name and license information. When you get to the part about installing dependencies, type `no`, as you will add them in a later step.

4. **Cleanup WordPress core**

    Your existing installation of WordPress core is assumed to be in some subdirectory of your repository, such as `wordpress`. When we start managing WordPress with Composer in the next step, *all code in this subdirectory will be overwritten*. The [previous guide](/guides/wordpress/vanilla/_index.md) instructs you to move all plugins and themes out of WordPress core and into a separate `plugins` subdirectory, so if you have not already done so consult that guide and do so now. 

    Inspect WordPress core carefully, and ensure that their is not any data in that subdirectory you would not like to lose specific to your site. Unless you are managing WordPress core as a [submodule](/development/submodules.md#removing-submodules), you can now remove that subdirectory 

    ```bash
    $ rm -rf wordpress
    ```

    Add `wordpress` to your `.gitignore`, by adding our standard WordPress `.gitignore` to the bottom of your existing file. Platform.sh's template `.gitignore` will complete the setup for Composer, but also include other files specific to Platform.sh and developing locally with  Lando. 

    ```bash
    $ curl https://raw.githubusercontent.com/platformsh/template-builder/master/templates/wordpress-composer/files/.gitignore >> .gitignore
    ```
    
    Then, remove WordPress from the repository:

    ```bash
    $ git rm -rf --cached wordpress && rm -rf wordpress
    $ git add . && git commit -m "Remove WordPress"
    ```

4. **Install WordPress with Composer**

    Now that you have made your WordPress site into a Composer project, you can download packages via Composer. So, let's download WordPress itself. 

    ```bash
    $ composer require johnpbloch/wordpress-core-installer
    $ composer require johnpbloch/wordpress-core
    ```

    You will notice that these two dependencies have been added to your `composer.json` file:

    ```json
    {
        "require": {
            "johnpbloch/wordpress-core-installer": "^2.0",
            "johnpbloch/wordpress-core": "^5.5"
        }
    }
    ```

    Run `composer install`. WordPress will now reinstall into the `wordpress` subdirectory, although it will now be ignored in commits.

## Platform.sh configuration

Switching to Composer-based installation will not require any modifications to your Platform.sh configuration files added in the The [previous guide](/guides/wordpress/vanilla/_index.md). Again, add them now if you would like to deploy your WordPress site on Platform.sh if you have not already.

## Themes and Plugins

Like WordPress core itself, themes and plugins can be installed as dependencies with Composer with the same `composer require` command used above. 

1. **Configure the WPPackagist repository**

    When you download dependencies using Composer, you by default retrieve them through [Packagist](https://packagist.org),
    which is the primary Composer repository for public PHP packages.
    In the previous section, you installed WordPress core through this repository.
    Some themes and plugins for WordPress are also on Packagist,
    but most of them are accessible through a similar service specific to WordPress called [WPackagist](https://wpackagist.org). 

    In order to pull from this repository, you'll need to add WPackagist to your `composer.json` file so that Composer knows to look for packages there. Run the command: 

    ```bash
    $ composer config repositories.wppackagist composer https://wpackagist.org
    ```

    You will see that this will add WPackagist to `composer.json`:

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

2. **Configure theme and plugin destination**

    Typically, Composer places installed dependencies in a subdirectory called `vendor` in your repository. But as shown already with WordPress core, this can be configured to install elsewhere if desired (since core installed to `wordpress` instead). To get themes and plugins to install into `wp-content`, add the following block to your `composer.json` file:

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

    Now any plugin that contains as a part of its package metadata a `type` of `wordpress-plugin` will be installed into `wordpress/wp-content/plugins/` instead of `vendor`, and the same goes for themes and must-use plugins. 

3. **Install themes and modules**

    Search for your existing themes and plugins [WPackagist](https://wpackagist.org) and install them through Composer with `composer require`:

    ```bash
    # Plugin
    composer require wpackagist-plugin/wordpress-seo

    # Theme
    composer require wpackagist-theme/hueman
    ```

    You'll see those dependencies added to `composer.json`, and after running `composer install` their subdirectories within `wordpress/wp-content/`.

## Deploying to Platform.sh

So long as you already have the [three Platform.sh configuration files from the previous guide](/guides/wordpress/vanilla/_index.md), you can now commit these changes and deploy your new Composer-based WordPress site to Platform.sh.

```bash
$ git add . && git commit -m "Composerify plugins and themes."
$ git push platform composer
```

## Updating

Updating WordPress and your themes and plugins becomes a lot simpler now that you're using Composer. Create a new branch and update any time a new version becomes available.

```bash
$ git checkout -b updates
$ composer update
```
