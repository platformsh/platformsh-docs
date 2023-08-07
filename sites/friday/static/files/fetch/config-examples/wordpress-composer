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
