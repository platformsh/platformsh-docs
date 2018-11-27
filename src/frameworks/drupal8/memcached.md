# Using Memcached with Drupal 8.x

Platform.sh recommends using Redis for caching with Drupal 8 over Memcached, as Redis offers better performance when dealing with larger values as Drupal tends to produce.  However, Memcached is also available if desired and is fully supported.

## Requirements

### Add a Memcached service

First you need to create a  Memcached service.  In your `.platform/services.yaml` file, add or uncomment the following:

```yaml
cacheservice:
    type: memcached:1.4
```

That will create a service named `cacheservice`, of type `memcached`, specifically version `1.4`.

### Expose the Memcached service to your application

In your `.platform.app.yaml` file, we now need to open a connection to the new Memcached service.  Under the `relationships` section, add the following:

```yaml
relationships:
    cache: "cacheservice:memcached"
```

The key (left side) is the name that will be exposed to the application in the `PLATFORM_RELATIONSHIPS` [variable](/development/variables.md).  The right hand side is the name of the service we specified above (`cacheservice`) and the endpoint (`memcached`).  If you named the service something different above, change `cacheservice` to that.

### Add the Memcached PHP extension

You will need to enable the PHP Memcached extension.  In your `.platform.app.yaml` file, add the following right after the `type` block:

```yaml
# Additional extensions
runtime:
    extensions:
        - memcached
```

### Add the Drupal module

You will need to add the [Memcache](https://www.drupal.org/project/memcache) module to your project.  If you are using Composer to manage your Drupal 8 site (which we recommend), simply run:

```bash
composer require drupal/memcache
```

Then commit the resulting changes to your `composer.json` and `composer.lock` files.

> **note**
>
> You must commit and deploy your code before continuing, then enable the module. The memcache 
> module must be enabled before it is configured in the `settings.platformsh.php` file.

## Configuration

The Drupal Memcache module must be configured via `settings.platformsh.php`.

Place the following at the end of `settings.platformsh.php`. Note the inline comments, as you may wish to customize it further.  Also review the `README.txt` file that comes with the memcache module, as it has a more information on possible configuration options. For instance, you may want to consider using memcache for locking as well and configuring cache stampede protection.

The example below is intended as a "most common case".

```php

if (getenv('PLATFORM_RELATIONSHIPS') && extension_loaded('memcached')) {
  $relationships = json_decode(base64_decode(getenv('PLATFORM_RELATIONSHIPS')), TRUE);

  // If you named your memcached relationship something other than "cache", set that here.
  $relationship_name = 'cache';

  if (!empty($relationships[$relationship_name])) {
    // This is the line that tells Drupal to use memcached as a backend.
    // Comment out just this line if you need to disable it for some reason and
    // fall back to the default database cache. 
    $settings['cache']['default'] = 'cache.backend.memcache';

    foreach ($relationships[$relationship_name] as $endpoint) {
      $host = sprintf("%s:%d", $endpoint['host'], $endpoint['port']);
      $settings['memcache']['servers'][$host] = 'default';
    }
  }

  // By default Drupal starts the cache_container on the database.  The following
  // code overrides that.
  // Make sure that the $class_load->addPsr4 is pointing to the right location of
  // the memcache module.  The value below should be correct if memcache was installed
  // using Drupal Composer.
  $memcache_exists = class_exists('Memcache', FALSE);
  $memcached_exists = class_exists('Memcached', FALSE);
  if ($memcache_exists || $memcached_exists) {
    $class_loader->addPsr4('Drupal\\memcache\\', 'modules/contrib/memcache/src');

    // If using a multisite configuration, adapt this line to include a site-unique
    // value.
    $settings['memcache']['key_prefix'] = getenv('PLATFORM_ENVIRONMENT');

    // Define custom bootstrap container definition to use Memcache for cache.container.
    $settings['bootstrap_container_definition'] = [
      'parameters' => [],
      'services' => [
        'database' => [
          'class' => 'Drupal\Core\Database\Connection',
          'factory' => 'Drupal\Core\Database\Database::getConnection',
          'arguments' => ['default'],
        ],
        'settings' => [
          'class' => 'Drupal\Core\Site\Settings',
          'factory' => 'Drupal\Core\Site\Settings::getInstance',
        ],
        'memcache.settings' => [
          'class' => 'Drupal\memcache\MemcacheSettings',
          'arguments' => ['@settings'],
        ],
        'memcache.factory' => [
          'class' => 'Drupal\memcache\Driver\MemcacheDriverFactory',
          'arguments' => ['@memcache.settings'],
        ],
        'memcache.backend.cache.container' => [
          'class' => 'Drupal\memcache\DrupalMemcacheInterface',
          'factory' => ['@memcache.factory', 'get'],
          'arguments' => ['container'],
        ],
        'lock.container' => [
          'class' => 'Drupal\memcache\Lock\MemcacheLockBackend',
          'arguments' => ['container', '@memcache.backend.cache.container'],
        ],
        'cache_tags_provider.container' => [
          'class' => 'Drupal\Core\Cache\DatabaseCacheTagsChecksum',
          'arguments' => ['@database'],
        ],
        'cache.container' => [
          'class' => 'Drupal\memcache\MemcacheBackend',
          'arguments' => ['container', '@memcache.backend.cache.container', '@lock.container', '@memcache.config', '@cache_tags_provider.container'],
        ],
      ],
    ];
  }
}
```
