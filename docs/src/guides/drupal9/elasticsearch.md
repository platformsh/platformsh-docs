---
title: "Using Elasticsearch with Drupal 9.x"
sidebarTitle: "Elasticsearch"
description: |
    Add an Elasticsearch server to your site and connect it to Drupal.
weight: -100
---

## Requirements

### Add an Elasticsearch service

{{% endpoint-description type="elasticsearch" noApp=true %}}

[Service definition](../../configuration/services/_index.md):

{{< readFile file="src/registry/images/examples/full/elasticsearch.services.yaml" highlight="yaml" >}}

[App configuration](../../configuration/app/app-reference.md):

{{< readFile file="src/registry/images/examples/full/elasticsearch.app.yaml" highlight="yaml" >}}

{{% /endpoint-description %}}

### Add the Drupal modules

You will need to add the [Search API](https://www.drupal.org/project/search_api) and [Elasticsearch Connector](https://www.drupal.org/project/elasticsearch_connector) modules to your project. If you are using composer, the easiest way to add them is to simply run:

```bash
$ composer require drupal/search_api drupal/elasticsearch_connector
```

And then commit the changes to `composer.json` and `composer.lock`.

## Configuration

Because Drupal defines connection information via the Configuration Management system, you will need to first define an Elasticsearch "Cluster" at `admin/config/search/elasticsearch-connector`.  Note the "machine name" the server is given.

Then, paste the following code snippet into your `settings.platformsh.php` file.

{{< note >}}

If you do not already have the Platform.sh Config Reader library installed and referenced at the top of the file, you will need to install it with `composer require platformsh/config-reader` and then add the following code before the block below:

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

// Update these values to the relationship name (from .platform.app.yaml)
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

Commit that code and push.  The specified cluster will now always point to the Elasticsearch service.  Then configure Search API as normal.
