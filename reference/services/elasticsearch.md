# Elasticsearch

Elasticsearch is a distributed RESTful search engine built for the cloud.

## Supported versions

* 0.9 (default)
* 1.4

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](reference/environment-variables.md):

```bash
{
    "elasticsearch": [
        {
            "host": "248.0.65.198",
            "scheme": "http",
            "port": "9200"
        }
    ]
}
```

## Usage example

In your ``.platform/services.yaml``:

```yaml
mysearch:
    type: elasticsearch:1.4
    disk: 1024
```

In your ``.platform.app.yaml``:

```yaml
relationships:
    elasticsearch: "mysearch:elasticsearch"
```

You can them use the service in a configuration file of your application with something like:

```php
<?php
$relationships = getenv("PLATFORM_RELATIONSHIPS");
if (!$relationships) {
  return;
}

$relationships = json_decode(base64_decode($relationships), TRUE);

foreach ($relationships['elasticsearch'] as $endpoint) {
  $container->setParameter('elasticsearch_host', $endpoint['host']);
  $container->setParameter('elasticsearch_port', $endpoint['port']);
}
```
