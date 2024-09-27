---
title: "Customize WordPress for {{% vendor/name %}}"
sidebarTitle: "Customize"
weight: -90
description: |
    Add some helpful dependencies, and modify your WordPress site to read from a {{% vendor/name %}} environment.
---

Now that your code contains all of the configuration to deploy on {{% vendor/name %}}, it’s time to make your WordPress site itself ready to run on a {{% vendor/name %}} environment. 

## Install the Config Reader

{{% guides/config-reader-info lang="php" %}}

## `wp-config.php`

With the Configuration Reader library installed, add or update a `wp-config.php` file in the root of your repository to match the code below. In this file, the library's `Config` object is used to:

- Retrieve connection credentials for MariaDB through the `database` relationship to configure the WordPress database. This will set up the database automatically and avoid you having to set the connection yourself during the installer. 
- Use the project's [routes](../../../define-routes/_index.md) to set `WP_HOME` and `WP_SITEURL` settings. 
- Set all of WordPress's security and authentication keys to the {{% vendor/name %}}-provided `PLATFORM_PROJECT_ENTROPY` - a hashed variable specific to your repository consistent across environments. 

Many other WordPress settings are pre-defined in this file for you, so consult the inline comments for more information.

```php
<?php

use Platformsh\ConfigReader\Config;

require __DIR__.'/../vendor/autoload.php';

// Create a new config object to ease reading the Platform.sh environment variables.
// You can alternatively use getenv() yourself.
$config = new Config();

// Set default scheme and hostname.
$site_scheme = 'http';
$site_host = 'localhost';

// Update scheme and hostname for the requested page.
if (isset($_SERVER['HTTP_HOST'])) {
  $site_host = $_SERVER['HTTP_HOST'];
  $site_scheme = !empty($_SERVER['HTTPS']) ? 'https' : 'http';
}

if ($config->isValidPlatform()) {
	if ($config->hasRelationship('database')) {
		// This is where we get the relationships of our application dynamically
		// from Platform.sh.

		// Avoid PHP notices on CLI requests.
		if (php_sapi_name() === 'cli') {
			session_save_path("/tmp");
		}

		// Get the database credentials
		$credentials = $config->credentials('database');

		// We are using the first relationship called "database" found in your
		// relationships. Note that you can call this relationship as you wish
		// in your `.platform.app.yaml` file, but 'database' is a good name.
		define( 'DB_NAME', $credentials['path']);
		define( 'DB_USER', $credentials['username']);
		define( 'DB_PASSWORD', $credentials['password']);
		define( 'DB_HOST', $credentials['host']);
		define( 'DB_CHARSET', 'utf8' );
		define( 'DB_COLLATE', '' );

		// Check whether a route is defined for this application in the Platform.sh
		// routes. Use it as the site hostname if so (it is not ideal to trust HTTP_HOST).
		if ($config->routes()) {

			$routes = $config->routes();

			foreach ($routes as $url => $route) {
				if ($route['type'] === 'upstream' && $route['upstream'] === $config->applicationName) {

					// Pick the first hostname, or the first HTTPS hostname if one exists.
					$host = parse_url($url, PHP_URL_HOST);
					$scheme = parse_url($url, PHP_URL_SCHEME);
					if ($host !== false && (!isset($site_host) || ($site_scheme === 'http' && $scheme === 'https'))) {
						$site_host = $host;
						$site_scheme = $scheme ?: 'http';
					}
				}
			}
		}

		// Debug mode should be disabled on Platform.sh. Set this constant to true
		// in a wp-config-local.php file to skip this setting on local development.
		if (!defined( 'WP_DEBUG' )) {
			define( 'WP_DEBUG', false );
		}

		// Set all of the necessary keys to unique values, based on the Platform.sh
		// entropy value.
		if ($config->projectEntropy) {
			$keys = [
				'AUTH_KEY',
				'SECURE_AUTH_KEY',
				'LOGGED_IN_KEY',
				'NONCE_KEY',
				'AUTH_SALT',
				'SECURE_AUTH_SALT',
				'LOGGED_IN_SALT',
				'NONCE_SALT',
			];
			$entropy = $config->projectEntropy;
			foreach ($keys as $key) {
				if (!defined($key)) {
					define( $key, $entropy . $key );
				}
			}
		}
	}
}
else {
  // Local configuration file should be in project root.
  if (file_exists(dirname(__FILE__, 2) . '/wp-config-local.php')) {
    include(dirname(__FILE__, 2) . '/wp-config-local.php');
  }
}

// Do not put a slash "/" at the end.
// https://codex.wordpress.org/Editing_wp-config.php#WP_HOME
define( 'WP_HOME', $site_scheme . '://' . $site_host );
// Do not put a slash "/" at the end.
// https://codex.wordpress.org/Editing_wp-config.php#WP_SITEURL
define( 'WP_SITEURL', WP_HOME );
define( 'WP_CONTENT_DIR', dirname( __FILE__ ) . '/wp-content' );
define( 'WP_CONTENT_URL', WP_HOME . '/wp-content' );

// Disable WordPress from running automatic updates
define( 'WP_AUTO_UPDATE_CORE', false );

// Since you can have multiple installations in one database, you need a unique
// prefix.
$table_prefix  = 'wp_';

// Default PHP settings.
ini_set('session.gc_probability', 1);
ini_set('session.gc_divisor', 100);
ini_set('session.gc_maxlifetime', 200000);
ini_set('session.cookie_lifetime', 2000000);
ini_set('pcre.backtrack_limit', 200000);
ini_set('pcre.recursion_limit', 200000);

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
  define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
```

## Setting up Composer

Through this guide you will set up your WordPress repository to install everything during it's build using Composer. That includes themes, plugins, and even WordPress Core itself. Any new plugins you want to use or migrate from your existing application can be committed as dependencies using Composer, but there are a few changes we need to make to the `composer.json` file to prepare it for the final {{% vendor/name %}} environment.

First, the John Bloch script has a default `wordpress` installation directory, so the `composer.json` file needs to know that all new themes and plugins have a destination within that subdirectory.

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

Next, having placed `wp-config.php` in the root of your repository, you need to add a `post-install-cmd` to move the file into `wordpress` after `composer install` has finished.

```json
  "scripts": {
    "copywpconfig": [
      "cp wp-config.php wordpress/"
    ],
    "post-install-cmd": "@copywpconfig"
  },
```

Since you're likely using [WPPackagist](https://wpackagist.org/) to download plugins and themes with Composer, you also need to add `wpackagist.org` as a repository in `composer.json`.

```json
  "repositories": [
    {
      "type": "composer",
      "url": "https://wpackagist.org"
    }
  ]
```

Lastly, to prevent committing WordPress Core when it is installed via Composer, and to otherwise setup your local development environment, make sure that your `.gitignore` file includes everything in `wordpress`, as [shown in the template](https://github.com/platformsh-templates/wordpress-composer/blob/master/.gitignore).

## Additional packages

Finally, install `wp-cli` and `psy/psysh` using Composer.
With these packages included, the WordPress CLI is available when you SSH into the application container.

```bash
composer require wp-cli/wp-cli-bundle psy/psysh --ignore-platform-reqs
```

If you've installed the WordPress CLI as a dependency as in the [previous step](./configure.md#configure-apps-in-platformappyaml),
you can use it directly.
(As long as you have only `wp-cli/wp-cli-bundle` as a dependency and not `wp-cli/wp-cli`.)

Otherwise, commit the changes from composer and push.
Then you can use the WordPress CLI within an application container from the `vendor` directory:

```bash
./vendor/bin/wp plugin list
```

If you receive an error stating `This doesn't seem to be a WordPress installation.`,
try providing the `--path` flag and point to your WordPress install path.

{{< guide-buttons previous="Back" next="Deploy WordPress" >}}