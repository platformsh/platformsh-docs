---
title: "Using Redis with WordPress"
weight: -70
sidebarTitle: "Redis"
description: |
    Configure Redis for your WordPress site.
---

There are a number of Redis plugins for WordPress, only some of which are compatible with {{% vendor/name %}}.
We've tested and recommend [WP Redis](https://wordpress.org/plugins/wp-redis/)
and [Redis Object Cache](https://wordpress.org/plugins/redis-cache/),
both of which require a minimal amount of configuration.

## Requirements

### 1. Add a Redis service

To create a Redis service, add the following to your [services configuration](../../add-services/_index.md):

```yaml {configFile="services"}
rediscache:
  type: redis:6.0
```

That creates a service named `rediscache` with the type `redis`, specifically version `6.0`.

### 2. Expose the Redis service to your application

Next open a connection to the new Redis service.
In the `relationships` section of your [app configuration](../../create-apps/_index.md),
add the following:

```yaml {configFile="app"}
relationships:
  redis: "rediscache:redis"
```

The key (left side) is the name that's exposed to the application in the [`PLATFORM_RELATIONSHIPS` variable](../../development/variables/use-variables.md#use-provided-variables).
The value (right side) is the name of the service you specified in step 1 (`rediscache`) and the endpoint (`redis`).
If you named the service something different in step 1, change `rediscache` to that.

### 3. Add the Redis PHP extension

Add the Redis extension for PHP in one of two ways:

* In your [app configuration](/create-apps/app-reference/single-runtime-image.md#extensions) (for extension versions tied to the PHP version)
* Using a [builder script](../../languages/php/redis.md) (if you need more control over the extension version)

### 4. Add the Redis library

If you're using Composer to build WordPress,
install your chosen Redis plugin with a Composer command depending on the plugin:

{{< codetabs >}}

+++
title=WP Redis
highlight=bash
+++

composer require "wpackagist-plugin/wp-redis":"^1.1.4"

<--->

+++
title=Redis Object Cache
highlight=bash
+++

composer require "wpackagist-plugin/redis-cache":"^2.0.23"

{{< /codetabs >}}

Then commit the resulting changes to your `composer.json` and `composer.lock` files.

## Configuration

To enable the Redis cache to work with WordPress,
the `object-cache.php` file needs to be copied from the plugin's directory to the `wp-content` directory.
Add the following line to the bottom of your `build` hook in your [app configuration](/create-apps/app-reference/single-runtime-image.md#hooks),
adjusting the paths based on where your plugins are located:

{{< codetabs >}}
+++
title=WP Redis
+++

```yaml {configFile="app"}
hooks:
  build: |
    ...
    if [ -f wordpress/wp-content/plugins/wp-redis/object-cache.php ]; then
        cp wordpress/wp-content/plugins/wp-redis/object-cache.php wordpress/wp-content/object-cache.php
    fi
```

<--->

+++
title=Redis Object Cache
+++

```yaml {configFile="app"}
hooks:
  build: |
    ...
    if [ -f wordpress/wp-content/plugins/redis-cache/includes/object-cache.php ]; then
        cp wordpress/wp-content/plugins/redis-cache/includes/object-cache.php wordpress/wp-content/object-cache.php
    fi
```

{{< /codetabs >}}

It should now look something like:

```yaml {configFile="app"}
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

Each plugin requires slightly different configuration.
Place the code for your chosen plugin in the `wp-config.php` file,
somewhere before the final `require_once(ABSPATH . 'wp-settings.php');` line.

{{< note >}}

The following examples assume you are using the [Config Reader library](../../development/variables/use-variables.md#access-variables-in-your-app).

{{</ note >}}

{{< codetabs >}}

+++
title=WP Redis
+++

```php {location="wp-config.php"}
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

<--->

+++
title=Redis Object Cache
+++

```php {location="wp-config.php"}
<?php

if ($config->hasRelationship('redis') && extension_loaded('redis')) {
    $credentials = $config->credentials('redis');

    define('WP_REDIS_CLIENT', 'phpredis');
    define('WP_REDIS_HOST', $credentials['host']);
    define('WP_REDIS_PORT', $credentials['port']);
}
```

{{< /codetabs >}}

These sections set up the parameters the plugins look for to connect to the Redis server.
If you used a different name for the relationship above, change it accordingly.
This code has no impact when run on a local development environment.

Once you have committed the above changes and pushed, you need to activate the plugins.

### Verifying Redis is running

Run this command in a SSH session in your environment: `{{% vendor/cli %}} redis info`.
You should run it before you push all this new code to your repository.

This should give you a baseline of activity on your Redis installation.
There should be very little memory allocated to the Redis cache.

After you push this code, you should run the command and notice that allocated memory starts jumping.

To verify the plugins are working, add a `redis` command to the WP CLI tool.
While in a SSH session in your environment,
you can run `wp help redis` to see the available commands your chosen plugin has added.
