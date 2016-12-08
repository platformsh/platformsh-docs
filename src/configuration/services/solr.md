# Solr (Search Service)

Apache Solr is a scalable and fault-tolerant search index.

Solr search with generic schemas provided, and a custom schema is also supported.

See the [Solr documentation](https://lucene.apache.org/solr/6_3_0/index.html) for more information.

## Supported versions

* 3.6
* 4.10

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/configuration/environment-variables.md):

```json
{
    "solr": [
        {
            "path": "solr",
            "host": "248.0.65.197",
            "scheme": "solr",
            "port": 8080
        }
    ]
}
```

## Usage example

In your ``.platform/services.yaml``:

```yaml
mysearch:
    type: solr:4.10
    disk: 1024
```

In your ``.platform.app.yaml``:

```yaml
relationships:
    solr: "mysearch:solr"
```

You can then use the service in a configuration file of your application with something like:

```php
<?php
$relationships = getenv("PLATFORM_RELATIONSHIPS");
if (!$relationships) {
  return;
}

$relationships = json_decode(base64_decode($relationships), TRUE);

foreach ($relationships['solr'] as $endpoint) {
  $container->setParameter('solr_host', $endpoint['host']);
  $container->setParameter('solr_port', $endpoint['port']);
}
```

## Configuration

If you want to provide your own Solr configuration, you can add a `core_config` key in your ``.platform/services.yaml``:

```yaml
mysearch:
    type: solr:4.10
    disk: 1024
    configuration:
        core_config: !archive "<directory>"
```

The `directory` parameter points to a directory in the Git repository, in or below the `.platform/` folder. This directory needs to contain everything that Solr 4.10 needs to start a core. At the minimum, `solrconfig.xml` and `schema.xml`.  For example, place them in `.platform/solr/conf/` such that the `schema.xml` file is located at `.platform/solr/conf/schema.xml`.   You can then reference that path like this -

```yaml
mysearch:
    type: solr:4.10
    disk: 1024
    configuration:
        core_config: !archive "solr/conf"
```
