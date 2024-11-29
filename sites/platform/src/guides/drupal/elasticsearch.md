---
title: "Using Elasticsearch with Drupal"
sidebarTitle: "Elasticsearch"
description: |
    Add an Elasticsearch server to your site and connect it to Drupal.
weight: -100
---

## Requirements

### Add an Elasticsearch service

#### 1. Configure the service

To define the service, use the `elasticsearch`:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
  type: elasticsearch:<VERSION>
  disk: 256
```

If you’re using a [premium version](add-services/elasticsearch.md#supported-versions), use the `elasticsearch-enterprise` type instead.

Note that changing the name of the service replaces it with a brand new service and all existing data is lost.
Back up your data before changing the service.

#### 2. Define the relationship

To define the relationship, use the following configuration:

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

You can define `<SERVICE_NAME>` as you like, so long as it's unique between all defined services
and matches in both the application and services configuration.

The example above leverages [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.
That is, it uses default endpoints behind-the-scenes, providing a [relationship](/create-apps/app-reference/single-runtime-image#relationships)
(the network address a service is accessible from) that is identical to the _name_ of that service.

Depending on your needs, instead of default endpoint configuration,
you can use [explicit endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has [access to the service](/add-services/elasticsearch.md#2-define-the-relationship) via the relationship `<SERVICE_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

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
    endpoint: elasticsearch
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has [access to the service](#2-define-the-relationship) via the relationship `<RELATIONSHIP_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< /codetabs >}}

### Example configuration

#### [Service definition](/add-services)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
elasticsearch:
  type: elasticsearch:{{% latest "elasticsearch" %}}
  disk: 256
```

If you're using a [premium version](add-services/elasticsearch.md#supported-versions),
use the `elasticsearch-enterprise` type in the service definition.

#### [App configuration](/create-apps)

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
  elasticsearch:
```

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
    service: elasticsearch
    endpoint: elasticsearch
```

{{< /codetabs >}}

### Add the Drupal modules

You need to add the [Search API](https://www.drupal.org/project/search_api) and [Elasticsearch Connector](https://www.drupal.org/project/elasticsearch_connector) modules to your project. If you are using composer, the easiest way to add them is to run:

```bash
composer require drupal/search_api drupal/elasticsearch_connector
```

And then commit the changes to `composer.json` and `composer.lock`.

## Configuration

Because Drupal defines connection information via the Configuration Management system, you need to first define an Elasticsearch "Cluster" at `admin/config/search/elasticsearch-connector`.
Note the "machine name" the server is given.

Then, paste the following code snippet into your `settings.platformsh.php` file.

{{< note >}}

If you do not already have the [Config Reader library](../../development/variables/use-variables.md#access-variables-in-your-app) installed and referenced at the top of the file, you need to install it with `composer require platformsh/config-reader` and then add the following code before the block below:

```php
<?php

$platformsh = new \Platformsh\ConfigReader\Config();
if (!$platformsh->inRuntime()) {
   return;
}
```

{{< /note >}}

- Edit the value of `$relationship_name` if you are using a different relationship.

- Edit the value of `$es_server_name` to match the machine name of your cluster in Drupal.

```php
<?php

// Update these values to the relationship name (from {{< vendor/configfile "app" >}})
// and the machine name of the server from your Drupal configuration.
$relationship_name = 'essearch';
$es_cluster_name = 'YOUR_CLUSTER_HERE';
if ($platformsh->hasRelationship($relationship_name)) {
  $platformsh->registerFormatter('drupal-elastic', function($creds) {
    return sprintf('http://%s:%s', $creds['host'], $creds['port']);
  });

  // Set the connector configuration to the appropriate value, as defined by the formatter above.
  $config['elasticsearch_connector.cluster.' . $es_cluster_name]['url'] = $platformsh->formattedCredentials($relationship_name, 'drupal-elastic');
}
```

Commit that code and push.
The specified cluster now always points to the Elasticsearch service.
Then configure Search API as normal.
