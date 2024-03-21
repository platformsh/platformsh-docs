---
title: "Using Redis with Drupal"
sidebarTitle: "Redis"
description: Add Redis caching to your existing Drupal site.
weight: -70
---

Redis is a fast open-source in-memory database and cache,
useful for application-level caching.
For more information on this service, see the [dedicated Redis page](../../add-services/redis.md)
or the [official Redis documentation](https://redis.io/docs/).

Follow the instructions on this page to do one of the following:

- Add and configure Redis for Drupal if you have deployed Drupal manually.
- Fine-tune your existing configuration if you have deployed Drupal using a [{{% vendor/name %}} template](../../development/templates.md).

## Before you begin

You need:

- A [Drupal version deployed on {{% vendor/name %}}](../drupal/deploy/_index.md)
- The [{{% vendor/name %}} CLI](../../administration/cli/)
- [Composer](https://getcomposer.org/)
- The [Config Reader library](../../guides/drupal/deploy/customize.md#install-the-config-reader)

You also need a `settings.platformsh.php` file from which you can [manage the configuration of the Redis service](../drupal/deploy/customize.md#settingsphp).
If you installed Drupal with a template, this file is already present in your project.

{{< note >}}

By default, Redis is an ephemeral service.
This means that the Redis storage isn't persistent
and that data can be lost when a container is moved, shut down
or when the service hits its memory limit.

To solve this, {{% vendor/name %}} recommends that you change the [service type](../../add-services/redis.md#service-types)
to [persistent Redis](../../add-services/redis.md#persistent-redis) (`redis-persistent`).

{{< /note >}}

## Add a Redis service

### 1. Configure the service

To define the service, use the `redis-persistent` type:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
    type: redis-persistent:<VERSION>
```

Note that persistent Redis requires `disk` to store data.
For more information, refer to the [dedicated Redis page](../../add-services/redis.md).

If want to use ephemeral Redis instead, use the `redis` type:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
    type: redis:<VERSION>
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost.
Back up your data before changing the service.

### 2. Add the relationship

To define the relationship, use the `redis` endpoint :

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
relationships:
    <RELATIONSHIP_NAME>: "<SERVICE_NAME>:redis"
```

You can define `<SERVICE_NAME>` and `<RELATIONSHIP_NAME>` as you like, but it’s best if they’re distinct.
With this definition, the application container now has access to the service via the relationship `<RELATIONSHIP_NAME>`.

For PHP, enable the extension for the service:

```yaml {configFile="app"}
# PHP extensions.
runtime:
    extensions:
        - redis
```

### Example Configuration

#### [Service definition](../../add-services/_index.md)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
cacheredis:
    type: redis-persistent:7.0
```

#### [App configuration](../../add-services/_index.md)

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
relationships:
    rediscache: "cacheredis:redis"
```

### 3. Add the Drupal module

To add the Redis module to your project, run the following command:

```bash
composer require drupal/redis
```

Then commit the resulting changes to your `composer.json`
and `composer.lock` files.

## Configure your Redis service

To configure your Redis service, follow these steps:

1. Add the following code at the top of your `settings.platformsh.php` file:

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

      // You can leverage Redis by using it for the lock and flood control systems
      // and the cache tag checksum.
      // To do so, apply the following changes to the container configuration.
      // Alternatively, copy the contents of the modules/contrib/redis/example.services.yml file
      // to your project-specific services.yml file.
      // Modify the contents to fit your needs and remove the following line.
      $settings['container_yamls'][] = 'modules/contrib/redis/example.services.yml';

      // Allow the services to work before the Redis module itself is enabled.
      $settings['container_yamls'][] = 'modules/contrib/redis/redis.services.yml';

      // To use Redis for container cache, add the classloader path manually.
      $class_loader->addPsr4('Drupal\\redis\\', 'modules/contrib/redis/src');

      // Use Redis for container cache.
      // The container cache is used to load the container definition itself.
      // This means that any configuration stored in the container isn't available
      // until the container definition is fully loaded.
      // To ensure that the container cache uses Redis rather than the
      // default SQL cache, add the following lines.
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

To verify that Redis is running, run the following command:

```bash
{{% vendor/cli %}} ssh 'echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq'
```

In the output, retrieve the value of the `host` property for your Redis relationship.

Then, run the following command:

```bash
{{% vendor/cli %}} ssh -- redis-cli -h {{< variable "HOST" >}} info
```

The output produces information and statistics about Redis,
showing that the service is up and running.
