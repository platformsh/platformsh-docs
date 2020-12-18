---
title: "Multiple WordPress sites in a single Project"
sidebarTitle: "Multi-site"
description: |
    Platform.sh supports running [multiple applications](/bestpractices/oneormany.md) multiple applications in the same project, and these can be two or more WordPress sites.
weight: -80
---

It is possible to maintain a [WordPress Network](https://wordpress.org/support/article/create-a-network/), also known as a multisite installation, on Platform.sh. In this case, multiple WordPress sites share the same core files. They share the same database, and each have access to the same collection of themes and plugins, all managed from one administration panel. Each site is "virtual", in that they do not have distinct directories for any part of their installation except those for media uploads. Consult WordPress's [Before You Create a Network](https://wordpress.org/support/article/before-you-create-a-network/) guide about how your WordPress installation will be affected by these changes if you are still considering multisite.

In this guide you will learn how to set up the two variations of WordPress multisite on Platform.sh:

- [Path-based](#subdirectory-path-based-wordpress-networks): invidual WordPress sites are served from *subdirectories* of the main domain, like `https://my-wordpress-site/site1`.
- [Domain-based](#subdomain-domain-based-wordpress-networks): individual WordPress sites are served from *subdomains*, like `https://site1.my-wordpress-site`.

## Starting assumptions

This documentation contains a number of guides for setting up and maintaining WordPress on Platform.sh, [ideally through Composer](/guides/wordpress/composer/_index.md). This guide will not directly address deployment, and will only focus on modifying an existing site already configured for Platform.sh to support a WordPress Network. It also assumed that you have already deployed that site to a Platform.sh project. If you have not already gone through this setup, consult the guides and templates below before continuing:

- [How to Deploy WordPress on Platform.sh with Composer](/guides/wordpress/deploy/_index.md)
- [WordPress (Composer) template](https://github.com/platformsh-templates/wordpress-composer)
- [WordPress (Bedrock) template](https://github.com/platformsh-templates/wordpress-bedrock)
- [How to Deploy WordPress on Platform.sh without Composer](/guides/wordpress/vanilla/_index.md)

Additionally, each of the examples below have been applied to the [Bedrock](https://github.com/platformsh-templates/wordpress-bedrock) template, a particular Composer-managed WordPress distribution. It comes with a few starting constraints for the directory structure of your projects, but makes configuration changes easier to illustrate. If you are using another [Composer-based](https://github.com/platformsh-templates/wordpress-composer) or [Vanilla](https://github.com/platformsh-templates/wordpress-vanilla) version of WordPress, replicate the steps in your own project. 

## Subdirectory: path-based WordPress Networks

In most cases, it's generally recommended to chose the subdirectory multsite method over subdomain. 

To start, create a new branch called `multisite` to test the changes:

```bash
$ git checkout -b multisite
```

### Table prefix

In `config/application.php` (`wp-config.php` in Composer and Vanilla), you will first need to ensure that a table prefix has been set for the database.

```php
$table_prefix = env('DB_PREFIX') ?: 'wp_';
```
### Enable multi-site 

In `config/application.php`, add the following line to enable multi-site on the project and then push to the Platform.sh environment. 

```php
Config::define('WP_ALLOW_MULTISITE', true);
```

Then push the changes to Platform.sh and activate the environment.

```bash
$ git push platform multisite
$ platform environment:activate multisite
```

### Configure the network

When the deployment has completed for the new environment, log into the administration panel and visit "Network Setup" under "Tools" in the sidebar. By default, the **Sub-directories** option should be selected already for you. Modify the the network's "Title" and "Admin Email" if desired, and then save the changes by clicking the "Install" button at the bottom of the page. 

WordPress will offer you an additional block of configuration to then add to your `config/application.php` file:

```php
Config::define('MULTISITE', true);
Config::define('SUBDOMAIN_INSTALL', false);
Config::define('DOMAIN_CURRENT_SITE', <CURRENT-ENVIRONMENT-DOMAIN-ON-PLATFORM.SH>);
Config::define('PATH_CURRENT_SITE', '/');
Config::define('SITE_ID_CURRENT_SITE', 1);
Config::define('BLOG_ID_CURRENT_SITE', 1);
```

Copy the block provided into `config/applcation.php` or `wp-config.php`. Do not commit and push yet, as we will need to modify it slightly to use the current environment's URL for all environments, not just the `multisite` branch.

### Update the site domain

Here you will have two options to update the `DOMAIN_CURRENT_SITE` variable in your configuration. First, you can add the [Configuration Reader](https://github.com/platformsh/config-reader-php) to your dependencies with Composer. With this library, you will be able to quickly retrieve the current environment's URL from the base64 encoded `PLATFORM_ROUTES` environment variable, and substitute it into the configuration block above. 

Install the library with Composer:

```bash
$ composer require platformsh/config-reader
```

and then modify the configuration to include a call to the `getPrimaryRoute` method:

```php
use Platformsh\ConfigReader\Config;
$config = new Config();
$CURRENT_SITE = $config->getPrimaryRoute();

...

Config::define('DOMAIN_CURRENT_SITE', $CURRENT_SITE['url']);
```

Alternatively, you can withdraw the "primary" route for WordPress directly from `PLATFORM_ROUTES` and define a new environment variable for it in a `.environment` file using jq:

```bash
# .environment 
export WP_HOME=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.primary == true) | .key')
```

and then use that environment variable directly in `config/application.php`:

```php
Config::define('DOMAIN_CURRENT_SITE', env('WP_HOME'));
```

Once you have made the change, commit and push to Platform.sh. 

### Add new sites at subdirectories

After you have pushed, you will notice that a new entry has become visible from the top dropdown navigation. It is now labelled "My Sites", and by visiting "Network Admin > Dashboard" you will be able to maintain all of the sites on your network.

You can add a new site 

## Subdomain: domain-based WordPress Networks

Subdomain networks will require additional changes to your codebase from the subdirectory example above.

To start, create a new branch called `multisite` to test the changes:

```bash
$ git checkout -b multisite
```
