---
title: "Using Redis with WordPress"
weight: -70
sidebarTitle: "Redis"
description: |
    Configure Redis for your WordPress site.
---

There are a number of Redis plugins for WordPress, only some of which are compatible with Platform.sh.  We have tested and recommend [WP Redis](https://wordpress.org/plugins/wp-redis/) or [Redis Object Cache](https://wordpress.org/plugins/redis-cache/), both of which require a minimal amount of configuration.

## Requirements

### Add a Redis service

First you need to create a Redis service.  In your `.platform/services.yaml` file, add the following:

```yaml
rediscache:
    type: redis:6.0
```

That will create a service named `rediscache`, of type `redis`, specifically version `6.0`.

### Expose the Redis service to your application

In your `.platform.app.yaml` file, we now need to open a connection to the new Redis service.  Under the `relationships` section, add the following:

```yaml
relationships:
    redis: "rediscache:redis"
```

The key (left side) is the name that will be exposed to the application in the `PLATFORM_RELATIONSHIPS` [variable](/development/variables.md).  The right hand side is the name of the service we specified above (`rediscache`) and the endpoint (`redis`).  If you named the service something different above, change `rediscache` to that.

### Add the Redis PHP extension

Because the Redis extension for PHP has been known to have BC breaks at times, we do not bundle a specific verison by default.  Instead, we provide a script to allow you to build your desired version in the build hook.  See the [PHP-Redis page](/languages/php/redis.md) for a simple-to-install script and instructions.

### Add the Redis library

If using Composer to build WordPress, you can install the your chosen Redis plugin with one of the following Composer commands, depending on which plugin you've chosen:

```bash
composer require "wpackagist-plugin/wp-redis":"^1.1.4" 
```
or
```bash
composer require "wpackagist-plugin/redis-cache":"^2.0.23" 
```

Then commit the resulting changes to your `composer.json` and `composer.lock` files.

## Configuration

To enable the Redis cache to work with WordPress, the `object-cache.php` file needs to be copied from the plugin's directory to the `wp-content` directory.  Add the following line to the bottom of your `build` hook, adjusting the paths based on where you have your plugins located, and which plugin you have selected:

WP-Redis
```bash
        if [ -f wordpress/wp-content/plugins/wp-redis/object-cache.php ]; then
            cp wordpress/wp-content/plugins/wp-redis/object-cache.php wordpress/wp-content/object-cache.php
        fi
```
Redis Object Cache
```bash
        if [ -f wordpress/wp-content/plugins/redis-cache/includes/object-cache.php ]; then
            cp wordpress/wp-content/plugins/redis-cache/includes/object-cache.php wordpress/wp-content/object-cache.php
        fi
```

It should now look something like:

```yaml
hooks:
    build: |
        set -e
        bash .platform-scripts/install-redis.sh 6.0.12
        # Copy manually-provided plugins into the plugins directory.
        # This allows manually-provided and composer-provided plugins to coexist.
        rsync -a plugins/* wordpress/wp-content/plugins/

        if [ -f wordpress/wp-content/plugins/redis-cache/includes/object-cache.php ]; then
            cp wordpress/wp-content/plugins/redis-cache/includes/object-cache.php wordpress/wp-content/object-cache.php
        fi
```

Both plugins require slightly different configurations. If you have chosen WP Redis, place the following code in the `wp-config.php` file, somewhere before the final `require_once(ABSPATH . 'wp-settings.php');` line.

```php
<?php

if ($config->hasRelationship('redis') && extension_loaded('redis')) {
		$credentials = $config->credentials('redis');
		$redis_server = array(
			'host'     => $credentials['host'],
			'port'     => $credentials['port'],
			'auth'     => $credentials['password'],
		);
	}
```

If you've decided to use the Redis Object Cache plugin, place the following code in the `wp-config.php` file, somewhere before the final `require_once(ABSPATH . 'wp-settings.php');` line.

```php
<?php

if ($config->hasRelationship('redis') && extension_loaded('redis')) {
		$credentials = $config->credentials('redis');

		define('WP_REDIS_CLIENT', 'phpredis');
		define('WP_REDIS_HOST', $credentials['host']);
		define('WP_REDIS_PORT', $credentials['port']);
	}
```

These sections will set up the parameters the plugins will look for in order to connect to the Redis server.  If you used a different name for the relationship above, change it accordingly.  This code will have no impact when run on a local development environment.

Once you have commited the above changes and pushed, you will need to activate the plugins.

### Verifying Redis is running

Run this command in a SSH session in your environment `redis-cli -h redis.internal info`. You should run it before you push all this new code to your repository.

This should give you a baseline of activity on your Redis installation. There should be very little memory allocated to the Redis cache.

After you push this code, you should run the command and notice that allocated memory will start jumping.

To verify the plugins are working, both add a `redis` command to the wp cli tool. While in a SSH session in your environment, you can run `wp help redis` to see the available commands your chosen plugin has added.  
