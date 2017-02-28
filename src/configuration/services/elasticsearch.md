# Elasticsearch (Search Service)

Elasticsearch is a distributed RESTful search engine built for the cloud.

See the [Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) for more information.

## Supported versions

* 0.90
* 1.4
* 1.7
* 2.4

## Relationship

The format exposed in the `$PLATFORM_RELATIONSHIPS` [environment variable](/development/variables.md):

```json
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

In your `.platform/services.yaml`:

```yaml
mysearch:
    type: elasticsearch:2.4
    disk: 1024
```

In your `.platform.app.yaml`:

```yaml
relationships:
    elasticsearch: "mysearch:elasticsearch"
```

You can then use the service in a configuration file of your application with something like:

```php
<?php
if (isset($_ENV['PLATFORM_RELATIONSHIPS'])) {
  $relationships = json_decode(base64_decode($_ENV['PLATFORM_RELATIONSHIPS']), TRUE);

  foreach ($relationships['elasticsearch'] as $endpoint) {
    $container->setParameter('elasticsearch_host', $endpoint['host']);
    $container->setParameter('elasticsearch_port', $endpoint['port']);
  }
}
```

## Plugins

The Elasticsearch 2.4 and later containers offer a number of plugins.  To enable them, list them under the `configuration.extensions` key in your `services.yaml` file, like so:

```yaml
mysearch:
    type: "elasticsearch:2.4"
    disk: 1024
    configuration:
        extensions:
            - analysis-icu
            - lang-python
            
```

In this example you'd have the ICU analysis plugin and 

### Available plugins

The following official Elasticsearch plugins are supported.

* **analysis-icu** - Support ICU Unicode text analysis
* **analysis-kuromoji** - Japanese langauge support
* **analysis-phonetic** - Phonetic analysis
* **analysis-smartcn** - Smart Chinese Analysis Plugins
* **analysis-stempel** - Stempel Polish Analysis Plugin
* **cloud-aws** - AWS Cloud plugin, allows storing indices on AWS S3
* **cloud-azure** - Micorosoft Azure plugin, allows storing indices on Azure
* **cloud-gce** - Google Cloud Engine plugin, allows storing indices on GCE
* **delete-by-query** - Support for deleting documents matching a givenquery
* **lang-python** - Python language plugin, allows the use of Python in Elasticsearch scripts
* **mapper-attachments** - (Elasticsearch 2.x only) Mapper attachments plugin for indexing common file types 
* **mapper-murmur3** - Murmur3 mapper plugin for computing hashes at index-time
* **mapper-size** - Size mapper plugin, enables the `_size` meta field
