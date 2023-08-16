---
title: "Using Memcached with Drupal 9.x"
sidebarTitle: "Memcached"
description: |
    Configure Memcached instead of Redis for Drupal caching.
weight: -90
---

{{< vendor/name >}} recommends using Redis for caching with Drupal over Memcached,
as Redis offers better performance when dealing with larger values as Drupal tends to produce.
But Memcached is also available if desired and is fully supported.

## Requirements

### Add a Memcached service

{{% endpoint-description type="memcached" noApp=true php=true onlyLanguage="php" /%}}

### Add the Drupal module

You need to add the [Memcache](https://www.drupal.org/project/memcache) module to your project.
If you're using Composer to manage your Drupal site (which is recommended), run:

```bash
composer require drupal/memcache
```

Then commit the resulting changes to your `composer.json` and `composer.lock` files.

{{< note >}}

You need to commit and deploy your code before continuing, then enable the module.
The Memcache module must be enabled before it's configured in the `settings.platformsh.php` file.

{{< /note >}}

## Configuration

The Drupal Memcache module must be configured via `settings.platformsh.php`.

Place the following at the end of `settings.platformsh.php`.
Note the inline comments, as you may wish to customize it further.
Also review the `README.txt` file that comes with the Memcache module,
as it has a more information on possible configuration options.
For instance, you may want to consider using Memcache for locking as well as configuring cache stampede protection.

The example below is intended as a "most common case" and has been tested with version `8.x-2.3` of the Memcache module.

{{< note >}}

If you don't already have the [Config Reader library](../../development/variables/use-variables.md#access-variables-in-your-app) installed and referenced at the top of the file,
you need to install it with `composer require platformsh/config-reader` and then add the following code before the block below:

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

// If you named your Memcached relationship something other than "memcachedcache", set that here.
$relationship_name = 'memcachedcache';

if ($platformsh->hasRelationship($relationship_name) && extension_loaded('memcached')) {
  $platformsh->registerFormatter('drupal-memcached', function($creds) {
    return sprintf("%s:%d", $creds['host'], $creds['port']);
  });

  // This is the line that tells Drupal to use Memcached as a backend.
  // Comment out just this line if you need to disable it for some reason and
  // fall back to the default database cache.
  $settings['cache']['default'] = 'cache.backend.memcache';

  $host = $platformsh->formattedCredentials($relationship_name, 'drupal-memcached');
  $settings['memcache']['servers'][$host] = 'default';

  // By default Drupal starts the cache_container on the database. The following
  // code overrides that.
  // Make sure that the $class_load->addPsr4 is pointing to the right location of
  // the Memcache module. The value below should be correct if Memcache was installed
  // using Drupal Composer.
  $memcache_exists = class_exists('Memcache', FALSE);
  $memcached_exists = class_exists('Memcached', FALSE);
  if ($memcache_exists || $memcached_exists) {
    $class_loader->addPsr4('Drupal\\memcache\\', 'modules/contrib/memcache/src');

    // If using a multisite configuration, adapt this line to include a site-unique
    // value.
    $settings['memcache']['key_prefix'] = $platformsh->environment;

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
        'memcache.timestamp.invalidator.bin' => [
          'class' => 'Drupal\memcache\Invalidator\MemcacheTimestampInvalidator',
          # Adjust tolerance factor as appropriate when not running memcache on localhost.
          'arguments' => ['@memcache.factory', 'memcache_bin_timestamps', 0.001],
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
          'arguments' => ['container', '@memcache.backend.cache.container','@cache_tags_provider.container','@memcache.timestamp.invalidator.bin'],
        ],
      ],
    ];
  }
}
```
