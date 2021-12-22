---
title: "Using Redis with Drupal 9.x"
sidebarTitle: "Redis"
description: |
    Add Redis caching to your existing Drupal site.
weight: -70
---

If you are using the Platform.sh-provided Drupal template, most of this work is already done for you.  Redis is already configured and will be enabled after the installation is complete.

Note that this Redis service is ephemeral, meaning it does not persist if the container moves or is shut down. Your app must treat it as ephemeral and not rely on it being there. One way to do this is regenerating cache in the `start` key in [your web configuration](/configuration/app/app-reference.md#commands) so the cache is regenerated each time your app starts.

If you are working from an older repository or migrating a pre-built site to Platform.sh, see the instructions below.

## Requirements

### Add a Redis service

{{% endpoint-description type="redis" noApp=true %}}

[Service definition](../../configuration/services/_index.md):

{{< readFile file="src/registry/images/examples/full/redis.services.yaml" highlight="yaml" >}}

[App configuration](../../configuration/app/app-reference.md):

{{< readFile file="src/registry/images/examples/full/redis.app.yaml" highlight="yaml" >}}

{{% /endpoint-description %}}

### Add the Redis PHP extension

You will need to enable the PHP Redis extension.  In your `.platform.app.yaml` file, add the following right after the `type` block:

```yaml
runtime:
    extensions:
        - redis
```

### Add the Drupal module

You will need to add the [Redis](https://www.drupal.org/project/redis) module to your project.  If you are using Composer to manage your Drupal site (which we recommend), run:

```bash
composer require drupal/redis
```

Then commit the resulting changes to your `composer.json` and `composer.lock` files.

Note that the Redis module does not need to be enabled in Drupal except for diagnostic purposes.  The configuration below is sufficient to make use of its functionality.

## Configuration

Place the following at the end of `settings.platformsh.php`. Note the inline comments, as you may wish to customize it further.  Also review the `README.txt` file that comes with the Redis module, as it has a great deal more information on possible configuration options. For instance, you may wish to not use Redis for the persistent lock if you have a custom module that needs locks to persist for more than a few seconds.

The example below is intended as a "most common case".  (Note: This example assumes Drupal 8.8/Drupal 9.0 and later.)

{{< note >}}
If you do not already have the Platform.sh Config Reader library installed and referenced at the top of the file, you will need to install it with `composer require platformsh/config-reader` and then add the following code before the block below:

```php
<?php

$platformsh = new \Platformsh\ConfigReader\Config();
if (!$platformsh->inRuntime()) {
   return;
}
```
{{< /note >}}


```php
<?php

// Set redis configuration.
if ($platformsh->hasRelationship('rediscache') && !\Drupal\Core\Installer\InstallerKernel::installationAttempted() && extension_loaded('rediscache')) {
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

  // Manually add the classloader path, this is required for the container cache bin definition below
  // and allows to use it without the redis module being enabled.
  $class_loader->addPsr4('Drupal\\redis\\', 'modules/contrib/redis/src');

  // Use redis for container cache.
  // The container cache is used to load the container definition itself, and
  // thus any configuration stored in the container itself is not available
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

The `example.services.yml` file noted above will also use Redis for the lock and flood control systems.

The redis module is able to use Redis as a queue backend, however, that should not be done on an ephemeral Redis instance as that could result in lost items when the Redis service instance is restarted or fills up.  If you wish to use Redis for the queue we recommend using a separate persistent Redis instance.  See the [Redis documentation page](/configuration/services/redis.md) for more information.

### Verifying Redis is running

You can verify that Redis is running correctly by connecting to it from an SSH session in your environment.  After logging in, run

```bash
echo $PLATFORM_RELATIONSHIPS | base64 --decode | json_pp
```

to get the list of relationships and find the `host` property for your Redis relationship.  Then with that value, run

```bash
redis-cli -h YOUR_REDIS_HOSTNAME info
```

This should give you a baseline of activity on your Redis installation. There should be very little memory allocated to the Redis cache.

After you push this code, you should run the command and notice that allocated memory will start jumping.

### Clear SQL cache tables

Once you've confirmed that your site is using Redis for caching, you can and should purge any remaining cache data in the MySQL database as it is now just taking up space.  `TRUNCATE` any table that begins with `cache` *except* for `cache_form`.  Despite its name `cache_form` is not part of the cache system proper and thus should not be moved out of SQL.
