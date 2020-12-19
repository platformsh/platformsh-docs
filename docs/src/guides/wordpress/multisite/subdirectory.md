---
title: "Subdirectory: path-based WordPress Networks"
sidebarTitle: "Subdirectory"
weight: 1
description: |
    Serve a number of unique WordPress sites with paths off the main domain.
---

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
