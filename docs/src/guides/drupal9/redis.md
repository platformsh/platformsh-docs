---
title: "Using Redis with Drupal 9.x"
sidebarTitle: "Redis"
description: Add Redis caching to your existing Drupal site.
weight: -70
---

Redis is a fast open-source in-memory database and cache, 
useful for application-level caching. 
For more information on this service, see the [dedicated Redis page](../../add-services/redis.md) 
or the [official Redis documentation](https://redis.io/docs/).

Follow the instructions on this page to do one of the following:

- Add and configure Redis for Drupal 9.x if you have deployed Drupal manually.
- Fine-tune your existing configuration if you have deployed Drupal 9 using a [Platform.sh template](../../development/templates.md).

## Before you begin

Make sure that:

- You have [deployed Drupal 9.x on Platform.sh](../drupal9/deploy/_index.md).
- You have [installed the Platform.sh CLI](../../administration/cli/).
- You have [installed Composer](https://getcomposer.org/).
  Composer is the tool recommended by both Platform.sh and Drupal 
  to [add the Redis module to your Drupal project](../../guides/drupal9/redis.md#3-add-the-drupal-module). 
  Platform.sh also recommends you use Composer to manage your whole site and its dependencies.
- You have [installed the Platform.sh Config Reader library](../../guides/drupal9/deploy/customize.md#install-the-config-reader).

Note that, by default, Redis is an ephemeral service.
This means that the Redis storage isn't persistent 
and that data can be lost when a container is moved, shut down 
or when the service hits its memory limit.

To solve this, you can change the [service type](../../add-services/redis.md#service-types) 
to persistent Redis (`redis-persistent`).
Alternatively, you can clean the cache each time your app starts 
via the `start` key in [your web configuration](../../create-apps/app-reference.md#web-commands).

## Add a Redis service

{{% endpoint-description type="redis" noApp=true onlyLanguage="php" php=true /%}}

### 3. Add the Drupal module

To add the Redis module to your project using [Composer](https://getcomposer.org/),
run the following command:

```bash
composer require drupal/redis
```

Then commit the resulting changes to your `composer.json` 
and `composer.lock` files.

Alternatively, you can [install the Redis module manually](https://www.drupal.org/project/redis/releases/8.x-1.6), 
although it is not recommended by Platform.sh or Drupal.

## Configure your Redis service

To configure your Redis service:

1. After [installing the Platform.sh Config Reader library](../../guides/drupal9/deploy/customize.md#install-the-config-reader), 
   add the following code at the top of your `settings.platformsh.php` file:

   ```php {location="settings.platformsh.php"}
    <?php

    $platformsh = new \Platformsh\ConfigReader\Config();
    if (!$platformsh->inRuntime()) {
       return;
    }
   ```

2. Add the following code at the end of the file:

   ```php {location="settings.platformsh.php"}
   <?php

   // Enable Redis caching.
    if ($platformsh->hasRelationship('rediscache') && !InstallerKernel::installationAttempted() && extension_loaded('redis')) {
      $redis = $platformsh->credentials('rediscache');

      // Set Redis as the default backend for any cache bin not otherwise specified.
      $settings['cache']['default'] = 'cache.backend.redis';
      $settings['redis.connection']['host'] = $redis['host'];
      $settings['redis.connection']['port'] = $redis['port'];

      // Apply changes to the container configuration to make better use of Redis.
      // This includes using Redis for the lock and flood control systems, as well
      // as the cache tag checksum. Alternatively, copy the contents of that file
      // to your project-specific services.yml file, modify as appropriate, and
      // remove this line.
      $settings['container_yamls'][] = 'modules/contrib/redis/example.services.yml';

      // Allow the services to work before the Redis module itself is enabled.
      $settings['container_yamls'][] = 'modules/contrib/redis/redis.services.yml';

      // Manually add the classloader path, this is required for the container
      // cache bin definition below.
      $class_loader->addPsr4('Drupal\\redis\\', 'modules/contrib/redis/src');

      // Use redis for container cache.
      // The container cache is used to load the container definition itself, and
      // thus any configuration stored in the container itself isn't available
      // yet. These lines force the container cache to use Redis rather than the
      // default SQL cache.
      $settings['bootstrap_container_definition'] = [
        'parameters' => [],
        'services' => [
          'redis.factory' => [
            'class' => 'Drupal\redis\ClientFactory',
          ],
          'cache.backend.redis' => [
            'class' => 'Drupal\redis\Cache\CacheBackendFactory',
            'arguments' => ['@redis.factory', '@cache_tags_provider.container', '@serialization.phpserialize'],
          ],
          'cache.container' => [
            'class' => '\Drupal\redis\Cache\PhpRedis',
            'factory' => ['@cache.backend.redis', 'get'],
            'arguments' => ['container'],
          ],
          'cache_tags_provider.container' => [
            'class' => 'Drupal\redis\Cache\RedisCacheTagsChecksum',
            'arguments' => ['@redis.factory'],
          ],
          'serialization.phpserialize' => [
            'class' => 'Drupal\Component\Serialization\PhpSerialize',
          ],
        ],
      ];
    }
   ```

   You can customize your configuration further 
   using the inline comments from this example configuration.
   For more information on possible configuration options, 
   see the `README.txt` file delivered with the Redis module 
   or the [official Redis documentation](https://redis.io/docs/). 

## Verify Redis is running

To verify that Redis is running:

1. [Connect to your app with SSH](../../development/ssh/). 

2. In your SSH terminal, run the following command:

   ```bash
   echo $PLATFORM_RELATIONSHIPS | base64 --decode | json_pp
   ```
   In the output, retrieve the value of the `host` property for your Redis relationship.

3. Run the following command:

   ```bash
   redis-cli -h {{< variable "HOST" >}} info
   ```

   The output produces information and statistics about Redis,
   showing that the service is up and running.

## Clear SQL cache tables

After verifying that your site uses Redis for caching, 
if you have a MySQL database,
purge any remaining cache data in it.

To do so, use the [`TRUNCATE TABLE` statement](https://mariadb.com/kb/en/truncate-table/) 
to empty all tables beginning with `cache` except for `cache_form`.
Despite its name, `cache_form` isn't part of the cache system properties
and shouldn't be moved out of SQL.
