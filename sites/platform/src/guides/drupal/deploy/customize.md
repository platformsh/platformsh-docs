---
title: "Customize Drupal for {{% vendor/name %}}"
sidebarTitle: "Customize"
weight: -90
description: |
    Add some helpful dependencies, and modify your Drupal site to read from a {{% vendor/name %}} environment.
---

Now that your code contains all of the configuration to deploy on {{% vendor/name %}},
it's time to make your Drupal site itself ready to run on a {{% vendor/name %}} environment.
There are a number of additional steps that are either required or recommended, depending on how well you want to optimize your site.

## Install the Config Reader

{{% guides/config-reader-info lang="php" %}}

## `settings.php`

`settings.php` is the main Drupal environment-configuration file.
In a stock Drupal installation it contains the database credentials, various other settings, and an enormous amount of comments.

In the Drupal template, the [`settings.php`](https://github.com/platformsh-templates/drupal10/blob/master/web/sites/default/settings.php) file
is mostly replaced with a stub that contains only the most basic configuration
and then includes a `settings.platformsh.php` and `settings.local.php` file, if they exist.
The latter is a common Drupal pattern, and the `settings.local.php` file should never be committed to Git.
It contains configuration that's specific to your local development environment,
such as a local development database.

The `settings.platformsh.php` file contains glue code that configures Drupal
based on the information available in {{% vendor/name %}}'s environment variables.
That includes the database credentials, Redis caching, and file system paths.

The file itself is a bit long, but reasonably self-explanatory.

```php
<?php
/**
 * @file
 * Platform.sh settings.
 */

use Drupal\Core\Installer\InstallerKernel;

$platformsh = new \Platformsh\ConfigReader\Config();

// Set up a config sync directory.
//
// This is defined inside the read-only "config" directory, deployed via Git.
$settings['config_sync_directory'] = '../config/sync';

// Configure the database.
if ($platformsh->hasRelationship('database')) {
  $creds = $platformsh->credentials('database');
  $databases['default']['default'] = [
    'driver' => $creds['scheme'],
    'database' => $creds['path'],
    'username' => $creds['username'],
    'password' => $creds['password'],
    'host' => $creds['host'],
    'port' => $creds['port'],
    'pdo' => [PDO::MYSQL_ATTR_COMPRESS => !empty($creds['query']['compression'])],
    'init_commands' => [
      'isolation_level' => 'SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED',
    ],
  ];
}

// Enable verbose error messages on development branches, but not on the production branch.
// You may add more debug-centric settings here if desired to have them automatically enable
// on development but not production.
if (isset($platformsh->branch)) {
  // Production type environment.
  if ($platformsh->onProduction() || $platformsh->onDedicated()) {
    $config['system.logging']['error_level'] = 'hide';
  } // Development type environment.
  else {
    $config['system.logging']['error_level'] = 'verbose';
  }
}

// Enable Redis caching.
if ($platformsh->hasRelationship('redis') && !InstallerKernel::installationAttempted() && extension_loaded('redis') && class_exists('Drupal\redis\ClientFactory')) {
  $redis = $platformsh->credentials('redis');

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

if ($platformsh->inRuntime()) {
  // Configure private and temporary file paths.
  if (!isset($settings['file_private_path'])) {
    $settings['file_private_path'] = $platformsh->appDir . '/private';
  }
  if (!isset($settings['file_temp_path'])) {
    $settings['file_temp_path'] = $platformsh->appDir . '/tmp';
  }

// Configure the default PhpStorage and Twig template cache directories.
  if (!isset($settings['php_storage']['default'])) {
    $settings['php_storage']['default']['directory'] = $settings['file_private_path'];
  }
  if (!isset($settings['php_storage']['twig'])) {
    $settings['php_storage']['twig']['directory'] = $settings['file_private_path'];
  }

  // Set the project-specific entropy value, used for generating one-time
  // keys and such.
  $settings['hash_salt'] = empty($settings['hash_salt']) ? $platformsh->projectEntropy : $settings['hash_salt'];

  // Set the deployment identifier, which is used by some Drupal cache systems.
  $settings['deployment_identifier'] = $settings['deployment_identifier'] ?? $platformsh->treeId;
}

// The 'trusted_hosts_pattern' setting allows an admin to restrict the Host header values
// that are considered trusted.  If an attacker sends a request with a custom-crafted Host
// header then it can be an injection vector, depending on how the Host header is used.
// However, Platform.sh already replaces the Host header with the route that was used to reach
// Platform.sh, so it is guaranteed to be safe.  The following line explicitly allows all
// Host headers, as the only possible Host header is already guaranteed safe.
$settings['trusted_host_patterns'] = ['.*'];

// Import variables prefixed with 'drupalsettings:' into $settings
// and 'drupalconfig:' into $config.
foreach ($platformsh->variables() as $name => $value) {
  $parts = explode(':', $name);
  list($prefix, $key) = array_pad($parts, 3, null);
  switch ($prefix) {
    // Variables that begin with `drupalsettings` or `drupal` get mapped
    // to the $settings array verbatim, even if the value is an array.
    // For example, a variable named drupalsettings:example-setting' with
    // value 'foo' becomes $settings['example-setting'] = 'foo';
    case 'drupalsettings':
    case 'drupal':
      $settings[$key] = $value;
      break;
    // Variables that begin with `drupalconfig` get mapped to the $config
    // array.  Deeply nested variable names, with colon delimiters,
    // get mapped to deeply nested array elements. Array values
    // get added to the end just like a scalar. Variables without
    // both a config object name and property are skipped.
    // Example: Variable `drupalconfig:conf_file:prop` with value `foo` becomes
    // $config['conf_file']['prop'] = 'foo';
    // Example: Variable `drupalconfig:conf_file:prop:subprop` with value `foo` becomes
    // $config['conf_file']['prop']['subprop'] = 'foo';
    // Example: Variable `drupalconfig:conf_file:prop:subprop` with value ['foo' => 'bar'] becomes
    // $config['conf_file']['prop']['subprop']['foo'] = 'bar';
    // Example: Variable `drupalconfig:prop` is ignored.
    case 'drupalconfig':
      if (count($parts) > 2) {
        $temp = &$config[$key];
        foreach (array_slice($parts, 2) as $n) {
          $prev = &$temp;
          $temp = &$temp[$n];
        }
        $prev[$n] = $value;
      }
      break;
  }
}
```

If you add additional services to your application, such as Solr, Elasticsearch, or RabbitMQ,
you would add configuration for those services to the `settings.platformsh.php` file as well.

## `.environment`

{{% vendor/name %}} runs `source .environment` in the [app root](/create-apps/app-reference/single-runtime-image.md#root-directory)
when a project starts, before cron commands are run, and when you log into an environment over SSH.
That gives you a place to do extra environment variable setup before the app runs,
including modifying the system `$PATH` and other shell level customizations.

The Drupal template includes a small [`.environment` file](https://github.com/platformsh-templates/drupal10/blob/master/.environment).
This modifies the `$PATH` to include the `vendor/bin` directory,
where command line tools like Drush are stored.

You need the file or one like it if you plan to run `drush` as a command,
such as in a cron task like the one in the [app configuration from the previous step](./configure.md#configure-apps-in-platformappyaml).
If you don't include the file, you get a [command not found error](../../../development/troubleshoot.md#command-not-found).

```text {location=".environment"}
# Allow executable app dependencies from Composer to be run from the path.
if [ -n "$PLATFORM_APP_DIR" -a -f "$PLATFORM_APP_DIR"/composer.json ] ; then
  bin=$(composer config bin-dir --working-dir="$PLATFORM_APP_DIR" --no-interaction 2>/dev/null)
  export PATH="${PLATFORM_APP_DIR}/${bin:-vendor/bin}:${PATH}"
fi
```

## Drush configuration

Drush requires a YAML file that declares what its URL is.
That value varies depending on the branch you're on, so it can't be included in a static file.
Instead, the `drush` directory includes a [short script](https://github.com/platformsh-templates/drupal10/blob/master/drush/platformsh_generate_drush_yml.php)
that generates that file on each deploy, writing it to `.drush/drush.yml`.
That allows Drush to run successfully on {{% vendor/name %}}, such as to run cron tasks.

The script contents aren't especially interesting.
For the most part, you can download it from the template,
place it in a `drush` directory in your project so they can be called from the deploy hook, and then forget about it.

{{< guide-buttons previous="Back" next="Deploy Drupal" >}}
