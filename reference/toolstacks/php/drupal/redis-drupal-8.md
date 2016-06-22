# Using Redis with Drupal 8.x

> **note**
> Redis support for Drupal 8 is still in alpha. The instructions below assume
> you are OK with running an alpha-version of a Drupal module. It should be
> stable and has been deployed in production, but more cautious users may prefer
> to wait for the module to have a stable release. The instructions below are
> unlikely to change at that time, but it is possible. See https://www.drupal.org/project/redis 
> for more information.

The Drupal 8 Redis module currently only supports the [PhpRedis](https://github.com/nicolasff/phpredis)
option, which relies on a PHP extension. Fortunately, that extension is trivial to enable on
Platform.sh

## Requirements

### Add a Redis service

First you need to create a Redis service.  In your `.platform/services.yaml` file,
add or uncomment the following:

```yaml
rediscache:
    type: redis:3.0
```

That will create a service named `rediscache`, of type `redis`, specifically version `3.0`.

### Expose the Redis service to your application

In your `.platform.app.yaml` file, we now need to open a connection to the new 
Redis service.  Under the `relationships` section, add the following:

```yaml
relationships:
    redis: "rediscache:redis"
```

The key (left side) is the name that will be exposed to the application in the PLATFORM_RELATIONSHIPS
variable.  The right hand side is the name of the service we specified above (`rediscache`) and
the type of endpoint (`redis`).  If you named the service something different above, change `rediscache`
to that.

### Add the Redis PHP extension

You will need to enable the PHP Redis extension.  In your `.platform.app.yaml` file,
add the following right after the `type` block:

```yaml
# Additional extensions
runtime:
    extensions:
        - redis
```

### Add the Drupal module

You will need to add the [Redis](https://www.drupal.org/project/redis)
module to your project.  If you are using Composer to manage your Drupal 8 site
(which we recommend), simply run:

```bash
composer require drupal/redis
```

Then commit the resulting changes to your `composer.json` and `composer.lock` files.

## Configuration

To make use of the Redis cache you will need to set some Drupal variables. The
configuration is a bit more complex than can be easily represented in
Platform.sh's environment variables configuration, so using `settings.php` directly
is the recommended approach.

Place the following at the end of `settings.php`. Note the inline comments, as you may wish to customize
it further.  Also review the `README.txt` file that comes with the redis module,
as it has a great deal more information on possible configuration options. For instance,
you may wish to not use Redis for the persistent lock if you have a custom module 
that needs locks to persist for more than a few seconds.

The example below is intended as a "most common case".

```php
// Set redis configuration.
if (!empty($_ENV['PLATFORM_RELATIONSHIPS']) && extension_loaded('redis')) {
  $relationships = json_decode(base64_decode($_ENV['PLATFORM_RELATIONSHIPS']), TRUE);

  if (!empty($relationships['redis'][0])) {
    $redis = $relationships['redis'][0];

    $settings['cache']['default'] = 'cache.backend.redis';
    $settings['redis.connection']['host'] = $redis['host'];
    $settings['redis.connection']['port'] = $redis['port'];

    // Enable the redis server overrides, e.g. cache tags checksum.
    // See that file, you might want to copy and customize it, it is meant as an example
    // and will change as more backends are offered by the redis module.
    $settings['container_yamls'][] = 'modules/contrib/redis/example.services.yml';

    // Manually add the classloader path, this is required for the container cache bin definition below
    // and allows to use it without the redis module being enabled.
    $class_loader->addPsr4('Drupal\\redis\\', 'modules/contrib/redis/src');

    // Use redis for container cache.
    $settings['bootstrap_container_definition'] = [
      'parameters' => [],
      'services' => [
        'redis.factory' => [
          'class' => 'Drupal\redis\ClientFactory',
        ],
        'cache.backend.redis' => [
          'class' => 'Drupal\redis\Cache\CacheBackendFactory',
          'arguments' => ['@redis.factory', '@cache_tags_provider.container'],
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
      ],
    ];

    // Explicitly set the fast backend for bootstrap, default, discover and config,
    // otherwise this gets lost when redis is enabled.
    $settings['cache']['bins']['bootstrap'] = 'cache.backend.chainedfast';
    $settings['cache']['bins']['discovery'] = 'cache.backend.chainedfast';
    $settings['cache']['bins']['config'] = 'cache.backend.chainedfast';
    // Default does not use the fast chained backend by default, but core only uses it for small caches
    // ensure this is also the case for a specific site before enabling this.
    // $settings['cache']['bins']['default'] = 'cache.backend.chainedfast';

    // The static cache should always use a memory cache, not Redis
    $settings['cache']['bins']['static'] = 'cache.backend.memory';

    // Set a fixed prefix so that all requests share that, the default is currently not reliable.
    $settings['cache_prefix'] = 'prefix_';
  }
}
```

The `example.services.yml` file noted above will also use Redis for the lock and flood
control systems.

Although the redis module is able to use Redis for a queue backend, we do not recommend
that on Platform.sh. Our [Redis instance is not persistent](/reference/service/redis), which means every deploy
would result in an emptied queue and possible lost items when the Redis instance
gets full. It is, however, safe for transient information like caching and locking.

### Verifying Redis is running
Run this command in a SSH session in your environment `redis-cli -h redis.internal info`. You should run it before you push all this new code to your repository.

This should give you a baseline of activity on your Redis installation. There should be very little memory allocated to the Redis cache.

After you push this code, you should run the command and notice that allocated memory will start jumping.

> **note**
> If you use Domain Access and Redis, ensure that your Redis settings (particularly `$settings['cache']`)
> are included before the Domain Access `settings.inc` file - see
> [this Drupal.org issue](https://www.drupal.org/node/2008486#comment-7782941) for more information.
