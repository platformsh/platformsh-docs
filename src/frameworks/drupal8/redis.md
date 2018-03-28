# Using Redis with Drupal 8.x

The Drupal 8 Redis module currently only supports the [PhpRedis](https://github.com/nicolasff/phpredis) option, which relies on a PHP extension. Fortunately, that extension is trivial to enable on Platform.sh.

## Requirements

### Add a Redis service

First you need to create a Redis service.  In your `.platform/services.yaml` file, add or uncomment the following:

```yaml
rediscache:
    type: redis:3.2
```

That will create a service named `rediscache`, of type `redis`, specifically version `3.2`.

### Expose the Redis service to your application

In your `.platform.app.yaml` file, we now need to open a connection to the new Redis service.  Under the `relationships` section, add the following:

```yaml
relationships:
    redis: "rediscache:redis"
```

The key (left side) is the name that will be exposed to the application in the `PLATFORM_RELATIONSHIPS` [variable](/administration/variables.md).  The right hand side is the name of the service we specified above (`rediscache`) and the endpoint (`redis`).  If you named the service something different above, change `rediscache` to that.

### Add the Redis PHP extension

You will need to enable the PHP Redis extension.  In your `.platform.app.yaml` file, add the following right after the `type` block:

```yaml
# Additional extensions
runtime:
    extensions:
        - redis
```

### Add the Drupal module

You will need to add the [Redis](https://www.drupal.org/project/redis) module to your project.  If you are using Composer to manage your Drupal 8 site (which we recommend), simply run:

```bash
composer require drupal/redis
```

Then commit the resulting changes to your `composer.json` and `composer.lock` files.

Note that the Redis module does not need to be enabled in Drupal except for diagnostic purposes.  The configuration below is sufficient to leverage its functionality.

## Configuration

To make use of the Redis cache you will need to set some Drupal variables. The configuration is a bit more complex than can be easily represented in Platform.sh's environment variables configuration, so using `settings.php` directly is the recommended approach.

Place the following at the end of `settings.platformsh.php`. Note the inline comments, as you may wish to customize it further.  Also review the `README.txt` file that comes with the redis module, as it has a great deal more information on possible configuration options. For instance, you may wish to not use Redis for the persistent lock if you have a custom module that needs locks to persist for more than a few seconds.

The example below is intended as a "most common case".  (Note: This example assumes Drupal 8.2 or later.)

```php
// Set redis configuration.
if (!empty($_ENV['PLATFORM_RELATIONSHIPS'])) {
  $relationships = json_decode(base64_decode($_ENV['PLATFORM_RELATIONSHIPS']), TRUE);

  if (!empty($relationships['redis'][0]) && !drupal_installation_attempted() && extension_loaded('redis')) {
    $redis = $relationships['redis'][0];

    // Set Redis as the default backend for any cache bin not otherwise specified.
    $settings['cache']['default'] = 'cache.backend.redis';
    $settings['redis.connection']['host'] = $redis['host'];
    $settings['redis.connection']['port'] = $redis['port'];

    // Apply changes to the container configuration to better leverage Redis.
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
}
```

The `example.services.yml` file noted above will also use Redis for the lock and flood
control systems.

The redis module is able to use Redis as a queue backend, however, that should not be done on an ephemeral Redis instance as that could result in lost items when the Redis service instance is restarted or fills up.  If you wish to use Redis for the queue we recommend using a separate persistent Redis instance.  See the [Redis documentation page](/services/redis.md) for more information.

### Verifying Redis is running
Run this command in a SSH session in your environment `redis-cli -h redis.internal info`. You should run it before you push all this new code to your repository.

This should give you a baseline of activity on your Redis installation. There should be very little memory allocated to the Redis cache.

After you push this code, you should run the command and notice that allocated memory will start jumping.
