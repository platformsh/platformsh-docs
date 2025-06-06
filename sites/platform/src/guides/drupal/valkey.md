---
title: "Using Valkey with Drupal"
sidebarTitle: "Valkey"
description: Add Valkey caching to your existing Drupal site.
weight: -70
---

[Valkey](https://valkey.io/) is an open source datastore that can be used high-performance data retrieval and key-value storage. For more information on this service, see the [dedicated Valkey page](../../add-services/valkey.md) or the [official Valkey documentation](https://valkey.io/topics/).

Follow the instructions on this page to do one of the following:

- Add and configure Valkey for Drupal if you have deployed Drupal manually.
- Fine-tune your existing configuration if you have deployed Drupal using a [{{% vendor/name %}} template](../../development/templates.md).

## Before you begin

You need:

- A [Drupal version deployed on {{% vendor/name %}}](../drupal/deploy/_index.md)
- The [{{% vendor/name %}} CLI](../../administration/cli/)
- [Composer](https://getcomposer.org/)
- The [Config Reader library](../../guides/drupal/deploy/customize.md#install-the-config-reader)

You also need a `settings.platformsh.php` file from which you can [manage the configuration of the Valkey service](../drupal/deploy/customize.md#settingsphp).
If you installed Drupal with a template, this file is already present in your project.

{{< note >}}

By default, Valkey is an ephemeral service.
This means that the Valkey storage isn't persistent
and that data can be lost when a container is moved, shut down
or when the service hits its memory limit.

To solve this, {{% vendor/name %}} recommends that you change the [service type](../../add-services/valkey.md#service-types)
to [persistent Valkey](../../add-services/valkey.md#persistent-valkey) (`valkey-persistent`).

{{< /note >}}

## Add a Valkey service

### 1. Configure the service

To define the service, use the `valkey-persistent` endpoint:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
  type: valkey-persistent:8.0
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost.
Back up your data before changing the service.

### 2. Define the relationship

To define the relationship, use the `valkey` endpoint :

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
# The example below shows simplified configuration leveraging a default service
# (identified from the relationship name) and a default endpoint.
# See the Application reference for all options for defining relationships and endpoints.
relationships:
  <SERVICE_NAME>:
```

You can define `<SERVICE_NAME>` as you like, so long as it’s unique between all defined services and matches in both the application and services configuration.

The example above leverages [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships. That is, it uses default endpoints behind-the-scenes, providing a [relationship](/create-apps/app-reference/single-runtime-image#relationships) (the network address a service is accessible from) that is identical to the name of that service.

Depending on your needs, instead of default endpoint configuration, you can use [explicit endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has access to the service via the relationship `<SERVICE_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables#use-provided-variables).

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
# The example below shows configuration with an explicitly set service name and endpoint.
# See the Application reference for all options for defining relationships and endpoints.
# Note that legacy definition of the relationship is still supported.
# More information: https://docs.platform.sh/create-apps/app-reference/single-runtime-image.html#relationships
relationships:
  <RELATIONSHIP_NAME>:
    service: <SERVICE_NAME>
    endpoint: valkey
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has access to the service via the relationship `<RELATIONSHIP_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< /codetabs >}}

For PHP, enable the [extension](/languages/php/extensions) for the service:

```yaml {configFile="app"}
# PHP extensions.
runtime:
  extensions:
    - redis
```

### 3. Add the Drupal module

[Drupal supports Valkey through the existing redis module](https://www.drupal.org/project/redis/issues/3443819). To add
the Redis module to your project, run the following command:

```bash
composer require drupal/redis
```

Then commit the resulting changes to your `composer.json`
and `composer.lock` files. Afterwards, you can enable the module with:

```bash
platform drush enable redis
```

## Configure your Valkey service

To configure your Valkey service, follow these steps:

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

   // Enable Valkey caching.
    if ($platformsh->hasRelationship('valkeycache') && !InstallerKernel::installationAttempted() && extension_loaded('valkey')) {
      $valkey = $platformsh->credentials('valkeycache');

      // Set Valkey as the default backend for any cache bin not otherwise specified.
      $settings['cache']['default'] = 'cache.backend.valkey';
      $settings['valkey.connection']['host'] = $valkey['host'];
      $settings['valkey.connection']['port'] = $valkey['port'];

      // You can leverage Valkey by using it for the lock and flood control systems
      // and the cache tag checksum.
      // To do so, apply the following changes to the container configuration.
      // Alternatively, copy the contents of the modules/contrib/valkey/example.services.yml file
      // to your project-specific services.yml file.
      // Modify the contents to fit your needs and remove the following line.
      $settings['container_yamls'][] = 'modules/contrib/valkey/example.services.yml';

      // Allow the services to work before the Valkey module itself is enabled.
      $settings['container_yamls'][] = 'modules/contrib/valkey/valkey.services.yml';

      // To use Valkey for container cache, add the classloader path manually.
      $class_loader->addPsr4('Drupal\\valkey\\', 'modules/contrib/valkey/src');

      // Use Valkey for container cache.
      // The container cache is used to load the container definition itself.
      // This means that any configuration stored in the container isn't available
      // until the container definition is fully loaded.
      // To ensure that the container cache uses Valkey rather than the
      // default SQL cache, add the following lines.
      $settings['bootstrap_container_definition'] = [
        'parameters' => [],
        'services' => [
          'valkey.factory' => [
            'class' => 'Drupal\valkey\ClientFactory',
          ],
          'cache.backend.valkey' => [
            'class' => 'Drupal\valkey\Cache\CacheBackendFactory',
            'arguments' => ['@valkey.factory', '@cache_tags_provider.container', '@serialization.phpserialize'],
          ],
          'cache.container' => [
            'class' => '\Drupal\valkey\Cache\PhpValkey',
            'factory' => ['@cache.backend.valkey', 'get'],
            'arguments' => ['container'],
          ],
          'cache_tags_provider.container' => [
            'class' => 'Drupal\valkey\Cache\ValkeyCacheTagsChecksum',
            'arguments' => ['@valkey.factory'],
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
   see the `README.txt` file delivered with the Valkey module
   or the [official Valkey documentation](https://valkey.io/topics/).

## Verify Valkey is running

To verify that Valkey is running, run the following command:

```bash
{{% vendor/cli %}} valkey info
```

The output produces information and statistics about Valkey,showing that the service is up and running.

## Further resources

### Documentation

- [Valkey documentation](https://valkey.io/topics/)
- [Platform.sh Valkey Documentation](/add-services/valkey)
