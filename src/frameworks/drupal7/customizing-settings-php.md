# Customizing settings.php

For applications using the `drupal` build flavor (those based on our [Drupal 7
example](https://github.com/platformsh/platformsh-example-drupal7)), Platform.sh automatically generates a `settings.local.php` file. This allows the Drupal site to be connected to MySQL without any additional configuration.

Platform.sh also generates a default `settings.php` file if there isn't one already (again, only when using the `drupal` build flavor).

You can commit your own `settings.php` file to your Git repository, at the root
of your application. Make sure that your `settings.php` requires `settings.local.php`, like so:

```php
<?php
$update_free_access = FALSE;

$local_settings = dirname(__FILE__) . '/settings.local.php';
if (file_exists($local_settings)) {
  require_once($local_settings);
}
```

> **note**
> You should never commit a `settings.local.php` file to your repository. The file will always be overwritten by Platform.sh (when using the `drupal` build flavor).

> **note**
> You should add a custom `$drupal_hash_salt` to your `settings.php` file.

## Shared variables

You can use your custom `settings.php` to define configuration that is
shared among all your environments.

For example, you can extract the `PLATFORM_RELATIONSHIPS` variable to
get the configuration of all services deployed on your environment.
Since the `PLATFORM_RELATIONSHIPS` is JSON encoded, you'll need to
decode it before using it.

Here is an example to define the Redis configuration:

```php
// Connect to Redis on Platform.sh.
if (!empty($_ENV['PLATFORM_RELATIONSHIPS'])) {
  $relationships = json_decode(base64_decode($_ENV['PLATFORM_RELATIONSHIPS']), TRUE);
  if (!empty($relationships['redis'][0])) {
    $conf['redis_client_host'] = $relationships['redis'][0]['host'];
    $conf['redis_client_port'] = $relationships['redis'][0]['port'];
    $conf['redis_client_interface'] = 'PhpRedis';
    $conf['cache_backends'][]       = 'sites/all/modules/redis/redis.autoload.inc';
    $conf['cache_default_class']    = 'Redis_Cache';
    // The 'cache_form' bin must be assigned to non-volatile storage.
    $conf['cache_class_cache_form'] = 'DrupalDatabaseCache';
  }
}
```
