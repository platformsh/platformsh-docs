---
title: Deploy Drupal on {{% vendor/name %}}
sidebarTitle: Drupal
sectionBefore: PHP
#layout: single
weight: -64
description: |
    Complete the last required steps to successfully deploy Drupal on {{% vendor/name %}}.
---

{{< note title="Note" theme="info" >}}
Before you start, check out the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project) and the main [Getting started guide](/get-started/here/_index.md).
They provide all of the core concepts and common commands you need to know before using the materials below.

It should also be noted that this guide works for the following variations of Drupal:

- [v10.x](https://www.drupal.org/project/drupal/releases/10.3.12)

- [v11.x](https://www.drupal.org/project/drupal/releases/11.1.2)

- [CMS](https://new.drupal.org/docs/drupal-cms/get-started/install-drupal-cms)

{{< /note >}}


For Drupal to successfully deploy and operate, **after completing the [Getting started guide](/get-started/here/_index.md)**,
you still need to make a few changes to your {{% vendor/name %}} configuration.

{{% guides/requirements name="Drupal" %}}
In addition to the above, you should also have:

- The Drupal files in a repository

-  A local copy of that repository where you have selected both `Redis` and `MariaDB` during the [Configure your project](/get-started/here/configure) portion of the [Getting Started](/get-started/here/_index.md) guide

## Configure

Open the `.upsun/config.yaml` file that's been generated and replace with the following:

```yaml {filename=".upsun/config.yaml"}
applications:
    drupal:
        type: php:{{% latest "php" %}}
        relationships:
            mariadb: 'db:mysql'
            redis: 'cache:redis'
        mounts:
            # The default Drupal files directory.
            '/web/sites/default/files':
                source: storage
                source_path: 'files'
            # Drupal gets its own dedicated tmp directory. The settings.platformsh.php
            # file will automatically configure Drupal to use this directory.
            '/tmp':
                source: storage
                source_path: 'tmp'
            # Private file uploads are stored outside the web root. The settings.platformsh.php
            # file will automatically configure Drupal to use this directory.
            '/private':
                source: storage
                source_path: 'private'
            # Drush needs a scratch space for its own caches.
            '/.drush':
                source: storage
                source_path: 'drush'
            # Drush will try to save backups to this directory, so it must be
            # writeable even though you will almost never need to use it.
            '/drush-backups':
                source: storage
                source_path: 'drush-backups'
        build:
            flavor: composer
        web:
            locations:
                '/':
                    root: 'web'
                    expires: 5m
                    passthru: '/index.php'
                    allow: false
                    rules:
                        '\.(avif|webp|jpe?g|png|gif|svgz?|css|js|map|ico|bmp|eot|woff2?|otf|ttf)$':
                            allow: true
                        '^/robots\.txt$':
                            allow: true
                        '^/sitemap\.xml$':
                            allow: true
                        '^/sites/sites\.php$':
                            scripts: false
                        '^/sites/[^/]+/settings.*?\.php$':
                            scripts: false
                '/sites/default/files':
                    allow: true
                    expires: 5m
                    passthru: '/index.php'
                    root: 'web/sites/default/files'
                    scripts: false
                    rules:
                        '^/sites/default/files/(css|js)':
                            expires: 2w
        hooks:
            build: |
                set -e
            deploy: |
                set -e
                if [ -n "$(drush status --field=bootstrap)" ]; then
                    drush -y cache-rebuild
                    drush -y updatedb
                    if [ -n "$(ls $(drush php:eval "echo realpath(Drupal\Core\Site\Settings::get('config_sync_directory'));")/*.yml 2>/dev/null)" ]; then
                        drush -y config-import
                    else
                        echo "No config to import. Skipping."
                    fi
                else
                    echo "Drupal not installed. Skipping standard Drupal deploy steps"
                fi
        crons:
            # Run Drupal's cron tasks every 19 minutes.
            drupal:
                spec: '*/19 * * * *'
                commands:
                    start: 'cd web ; drush core-cron'
        runtime:
            # Enable the redis extension so Drupal can communicate with the Redis cache.
            extensions:
                - redis
                - sodium
                - apcu
                - blackfire
                - gd
        source:
            root: /
services:
    db:
        type: mariadb:{{% latest "mariadb" %}}
    cache:
        type: redis:{{% latest "redis" %}}
routes:
    "https://{default}/":
        type: upstream
        upstream: "drupal:http"
        cache:
            enabled: true
            # Base the cache on the session cookie and custom Drupal cookies. Ignore all other cookies.
            cookies: ['/^SS?ESS/', '/^Drupal.visitor/']
    "https://www.{default}/":
        type: redirect
        to: "https://{default}/"
```

This configuration is similar to the deployment process for [Drupal on Upsun Fixed](https://fixed.docs.upsun.com/guides/drupal/deploy.html), however it is slightly updated for [Upsun's configuration](https://docs.upsun.com/learn/tutorials/migrating/from-fixed.html).
## Variables

The `project:init` command created a `.environment` file containing environment variables for the two services (MariaDB and Redis). Now append the following Drush configuration to the bottom of that file:

```bash {location=".environment"}
# Allow executable app dependencies from Composer to be run from the path.
if [ -n "$PLATFORM_APP_DIR" -a -f "$PLATFORM_APP_DIR"/composer.json ] ; then
  bin=$(composer config bin-dir --working-dir="$PLATFORM_APP_DIR" --no-interaction 2>/dev/null)
  export PATH="${PLATFORM_APP_DIR}/${bin:-vendor/bin}:${PATH}"
fi

# Set the URI for Drush commands.
export PRIMARY_URL="$(echo "$PLATFORM_ROUTES" | base64 --decode | jq -r 'to_entries[] | select(.value.primary) | .key | rtrimstr("/")')"
export DRUSH_OPTIONS_URI="$PRIMARY_URL"
```

## `settings.php`
Open `web/sites/default/settings.php` and append the following to the bottom of that file.

```php {location="web/sites/default/settings.php"}
// Upsun configuration
if (getenv('PLATFORM_APPLICATION') && file_exists(__DIR__ . '/settings.upsun.php')) {
  include __DIR__ . '/settings.upsun.php';
}
```

## Upsun-specific settings
Then create a new Upsun-specific settings file `web/sites/default/settings.upsun.php`
which should contain the following:

```php {location="web/sites/default/settings.upsun.php"}
<?php
/**
 * @file
 * Upsun Fixed settings.
 */

use Drupal\Core\Installer\InstallerKernel;

// Set up a config sync directory.
//
// This is defined inside the read-only "config" directory, deployed via Git.
$settings['config_sync_directory'] = '../config/sync';

// Configure the database.
$databases['default']['default'] = [
    'driver' => getenv('DB_SCHEME'),
    'database' => getenv('DB_PATH'),
    'username' => getenv('DB_USERNAME'),
    'password' => getenv('DB_PASSWORD'),
    'host' => getenv('DB_HOST'),
    'port' => getenv('DB_PORT'),
    'init_commands' => [
      'isolation_level' => 'SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED',
    ],
];

// Enable verbose error messages on development/staging branches, but not on the production branch.
// You may add more debug-centric settings here if desired to have them automatically enable
// on development but not production.
if (getenv('PLATFORM_ENVIRONMENT_TYPE') == 'production') {
    // Production environment type.
    $config['system.logging']['error_level'] = 'hide';
} else {
    // Non-production environment types.
    $config['system.logging']['error_level'] = 'verbose';
}

// Enable Redis caching.
if (!InstallerKernel::installationAttempted() && extension_loaded('redis') && class_exists('Drupal\redis\ClientFactory')) {

  // Set Redis as the default backend for any cache bin not otherwise specified.
  $settings['cache']['default'] = 'cache.backend.redis';
  $settings['redis.connection']['host'] = getenv('CACHE_HOST');
  $settings['redis.connection']['port'] = getenv('CACHE_PORT');

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

if (getenv('PLATFORM_BRANCH')) {
  // Configure private and temporary file paths.
  if (!isset($settings['file_private_path'])) {
    $settings['file_private_path'] = getenv('PLATFORM_APP_DIR') . '/private';
  }
  if (!isset($settings['file_temp_path'])) {
    $settings['file_temp_path'] = getenv('PLATFORM_APP_DIR') . '/tmp';
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
  $settings['hash_salt'] = empty($settings['hash_salt']) ? getenv('PLATFORM_PROJECT_ENTROPY') : $settings['hash_salt'];

  // Set the deployment identifier, which is used by some Drupal cache systems.
  $settings['deployment_identifier'] = $settings['deployment_identifier'] ?? getenv('PLATFORM_TREE_ID');;
}

// The 'trusted_hosts_pattern' setting allows an admin to restrict the Host header values
// that are considered trusted.  If an attacker sends a request with a custom-crafted Host
// header then it can be an injection vector, depending on how the Host header is used.
// However, Upsun Fixed already replaces the Host header with the route that was used to reach
// Upsun Fixed, so it is guaranteed to be safe.  The following line explicitly allows all
// Host headers, as the only possible Host header is already guaranteed safe.
$settings['trusted_host_patterns'] = ['.*'];
```

## `config/sync`
Create the `config/sync` empty directory referenced in the settings file:

```bash {location="Terminal"}
mkdir -p config/sync && touch config/sync/.gitkeep
```

## Deploy changes

Now commit all of the above changes and push to {{% vendor/name %}}.

```bash {location="Terminal"}
git add .
git commit -m "Add changes to complete my {{% vendor/name %}} configuration"
upsun push -y
```

{{< note title="Snippets" theme="info" >}}
You can also find all the snippets described in this post on GitHub
- [Drupal 11](https://github.com/upsun/snippets/tree/main/examples/drupal11)
{{</ note >}}

## Further resources

### Documentation

- [PHP documentation](/languages/php/_index.md)
- [Authenticated Composer repositories](/languages/php/composer-auth.md)


### Community content

- [Drupal topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=drupal)
- [PHP topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=php)

### Blogs

- [_Drupal and Upsun_](https://devcenter.upsun.com/posts/drupal-and-upsun/)

<!-- ## Video -->
