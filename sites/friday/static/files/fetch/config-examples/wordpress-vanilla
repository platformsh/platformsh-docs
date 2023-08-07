<?php

// Set default scheme and hostname.
$site_scheme = 'http';
$site_host = 'localhost';

// Update scheme and hostname for the requested page.
if (isset($_SERVER['HTTP_HOST'])) {
  $site_host = $_SERVER['HTTP_HOST'];
  $site_scheme = !empty($_SERVER['HTTPS']) ? 'https' : 'http';
}

if (getenv('PLATFORM_RELATIONSHIPS')) {
	if(getenv('DB_NAME')){

		// Avoid PHP notices on CLI requests.
		if (php_sapi_name() === 'cli') {
			session_save_path("/tmp");
		}

		// We are using the first relationship called "database" found in your
		// relationships. Note that you can call this relationship as you wish
		// in your `.platform.app.yaml` file, but 'database' is a good name.
		define( 'DB_NAME', getenv('DB_NAME'));
		define( 'DB_USER', getenv('DB_USER'));
		define( 'DB_PASSWORD', getenv('DB_PASSWORD'));
		define( 'DB_HOST', getenv('DB_HOST'));
		define( 'DB_CHARSET', 'utf8' );
		define( 'DB_COLLATE', '' );

		// Debug mode should be disabled on Platform.sh. Set this constant to true
		// in a wp-config-local.php file to skip this setting on local development.
		if (!defined( 'WP_DEBUG' )) {
			define( 'WP_DEBUG', false );
		}

		// Set all of the necessary keys to unique values, based on the Platform.sh
		// entropy value.
		if (getenv('PLATFORM_PROJECT_ENTROPY')) {
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
			$entropy = getenv('PLATFORM_PROJECT_ENTROPY');
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
// define( 'WP_HOME', $site_scheme . '://' . $site_host );
define( 'WP_HOME', getenv('WP_HOME'));
// Do not put a slash "/" at the end.
// https://codex.wordpress.org/Editing_wp-config.php#WP_SITEURL
define( 'WP_SITEURL', WP_HOME );
define( 'WP_CONTENT_DIR', dirname( __FILE__ ) . '/wp-content' );
define( 'WP_CONTENT_URL', WP_HOME . 'wp-content' );

// Disable WordPress from running automatic updates
define( 'WP_AUTO_UPDATE_CORE', false );

// Since you can have multiple installations in one database, you need a unique
// prefix.
$table_prefix  = 'wp_';

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
  define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
