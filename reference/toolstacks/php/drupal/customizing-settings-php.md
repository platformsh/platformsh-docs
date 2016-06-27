# Customizing settings.php

For applications using the `drupal` build flavor (those based on our [Drupal 7
example](https://github.com/platformsh/platformsh-example-drupal/tree/7.x)),
Platform.sh automatically generates a `settings.local.php` file. This allows the Drupal site to be connected to MySQL without any additional configuration.

Platform.sh also generates a default `settings.php` file if there isn't one already (again, only when using the `drupal` build flavor).

You can commit your own `settings.php` file to your Git repository, at the root
of your application. Make sure that your `settings.php` requires `settings.local.php`, like the default:

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

## Web-based installation requirements

Background: Code is always read-only on Platform.sh (a deliberate feature, which means your code is entirely determined by your Git repository, bringing security and maintenance benefits). Drupal will therefore not be able to write to `settings.php` on Platform.sh or download and install its own modules. This is a good thing, but means the web-based installation process (via /core/install.php in D8) also cannot write to `settings.php`.

Thankfully Drupal 8 only needs these 4 things to install with a read-only `settings.php`:
- Configure $config_directories[CONFIG_SYNC_DIRECTORY] with a valid (existing) directory.
- Configure $databases with a valid database connection.
- Configure $settings['install_profile'] with the profile you are going to install.
- Configure $settings['hash_salt'] with your private hash salt (you can do this through environment variables).

Unfortunately, there is (currently) a bug in Drupal `8.1.1` which affects this:
- "Staging directory should not have to be writeable" https://www.drupal.org/node/2466197 (patch, needs review)
We will endeavour to update this page when the bug is resolved.

Because of this bug, you might find it easier to install the database elsewhere, and then import the database tables to your platform.sh database via the platform.sh CLI.
