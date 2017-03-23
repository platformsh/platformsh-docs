# Elasticsearch (Search Service)

Elasticsearch is a distributed RESTful search engine built for the cloud.

See the [Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) for more information.

## Supported versions

* 0.90
* 1.4
* 1.7
* 2.4
* 5.2

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
    type: elasticsearch:5.2
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

The Elasticsearch 2.4 and later services offer a number of plugins.  To enable them, list them under the `configuration.plugins` key in your `services.yaml` file, like so:

```yaml
mysearch:
    type: "elasticsearch:5.2"
    disk: 1024
    configuration:
        plugins:
            - analysis-icu
            - lang-python
            
```

In this example you'd have the ICU analysis plugin and Python script support plugin.

If there is a publicly available plugin you need that is not listed here, please contact our support team.

### Available plugins

This is the complete list of official Elasticsearch plugins that can be enabled:

| Plugin              | Description                                                                       | 2.4 | 5.2 |
|---------------------|-----------------------------------------------------------------------------------|-----|-----|
| analysis-icu        | Support ICU Unicode text analysis                                                 | *   | *   |
| analysis-kuromoji   | Japanese language support                                                         | *   | *   |
| analysis-phonetic   | Phonetic analysis                                                                 | *   | *   |
| analysis-smartcn    | Smart Chinese Analysis Plugins                                                    | *   | *   |
| analysis-stempel    | Stempel Polish Analysis Plugin                                                    | *   | *   |
| analysis-ukrainian  | Ukrainian language support                                                        |     | *   |
| cloud-aws           | AWS Cloud plugin, allows storing indices on AWS S3                                | *   |     |
| delete-by-query     | Support for deleting documents matching a given query                             | *   |     |
| discovery-multicast | Ability to form a cluster using TCP/IP multicast messages                         | *   |     |
| ingest-attachment   | Extract file attachments in common formats (such as PPT, XLS, and PDF)            |     | *   |
| ingest-user-agent   | Extracts details from the user agent string a browser sends with its web requests |     | *   |
| lang-python         | Python language plugin, allows the use of Python in Elasticsearch scripts         | *   | *   |
| mapper-attachments  | Mapper attachments plugin for indexing common file types                          | *   | *   |
| mapper-murmur3      | Murmur3 mapper plugin for computing hashes at index-time                          | *   | *   |
| mapper-size         | Size mapper plugin, enables the `_size` meta field                                | *   | *   |
| repository-s3       | Support for using S3 as a repository for Snapshot/Restore                         |     | *   |
