# Using Elasticsearch with Drupal 8.x

## Requirements

### Add the Drupal modules

You will need to add the [Search API](https://www.drupal.org/project/search_api) and [Elasticsearch Connector](https://www.drupal.org/project/elasticsearch_connector) modules to your project. If you are using composer, the easiest way to add them is to simply run:

```bash
$ composer require drupal/search_api drupal/elasticsearch_connector
```

And then commit the changes to `composer.json` and `composer.lock`.

### Add an Elasticsearch service

First you need to create an Elasticsearch service.  In your `.platform/services.yaml` file, add or uncomment the following:

```yaml
elasticsearch:
    type: elasticsearch:6.5
    disk: 2014
```

The above definition defines a single Elasticsearch 6.5 server.  Because Elasticsearch defines additional indexes dynamically there is no need to define custom endpoints.

### Expose the Elasticsearch service to your application

In your `.platform.app.yaml` file, you now need to open a connection to the new Elasticsearch service.  Under the `relationships` section, add or uncomment the following:

```
relationships:
    elasticsearch: 'elasticsearch:elasticsearch'
```

## Configuration

Because Drupal defines connection information via the Configuration Management system, you will need to first define an Elasticsearch "Cluster" at `admin/config/search/elasticsearch-connector`.  Note the "machine name" the server is given.

Then, paste the following code snippet into your `settings.platformsh.php` file.

> **note**
>
> If you do not already have the Platform.sh Config Reader library installed and referenced at the top of the file, you will need to install it with `composer require platformsh/config-reader` and then add the following code before the block below:
>
> ```php
> $platformsh = new \Platformsh\ConfigReader\Config();
> if (!$platformsh->inRuntime()) {
>   return;
> }
> ```

- Edit the value of `$relationship_name` if you are using a different relationship.

- Edit the value of `$es_server_name` to match the machine name of your cluster in Drupal.

```php
// Update these values to the relationship name (from .platform.app.yaml)
// and the machine name of the server from your Drupal configuration.
$relationship_name = 'elasticsearch';
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
