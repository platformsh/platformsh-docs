# Solr (Search Service)

Apache Solr is a scalable and fault-tolerant search index.

Solr search with generic schemas provided, and a custom schema is also supported.

See the [Solr documentation](https://lucene.apache.org/solr/6_3_0/index.html) for more information.

## Supported versions

* 3.6
* 4.10
* 6.3

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
    type: solr:6.3
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

## Solr 4

For Solr 4, Platform.sh supports only a single core per server called `collection1`.

If you want to provide your own Solr configuration, you can add a `core_config` key in your ``.platform/services.yaml``:

```yaml
mysearch:
    type: solr:4.10
    disk: 1024
    configuration:
        core_config: !archive "<directory>"
```

The `directory` parameter points to a directory in the Git repository, in or below the `.platform/` folder. This directory needs to contain everything that Solr needs to start a core. At the minimum, `solrconfig.xml` and `schema.xml`.  For example, place them in `.platform/solr/conf/` such that the `schema.xml` file is located at `.platform/solr/conf/schema.xml`.   You can then reference that path like this -

```yaml
mysearch:
    type: solr:4.10
    disk: 1024
    configuration:
        core_config: !archive "solr/conf"
```

## Solr 6

For Solr 6 and later Platform.sh supports multiple cores via different endpoints.  Cores and endpoints are defined separately, with endpoints referencing cores.  Each core may have its own configuration or share a configuration.  It is best illustrated with an example.

```yaml
solrsearch:
    type: solr:6.3
    disk: 1024
    configuration:
        cores:
            mainindex: !archive "core1-conf"
            extraindex: !archive "core2-conf"
        endpoints:
            main:
              core: mainindex
            extra:
              core: extraindex
```

The above definition defines a single Solr 6.3 server.  That server has 2 cores defined: `maincore` &mdash; the configuration for which is in the `.platform/core1-conf` directory &mdash; and `extracore` &mdash; the configuration for which is in the `.platform/core2-conf` directory.

It then defines two endpoints: `main` is connected to the `mainindex` core while `extra` is connected to the `extraindex` core.  Two endpoints may be connected to the same core but at this time there would be no reason to do so.  Additional options may be defined in the future.  

Each endpoint is then available in the relationships definition in `.platform.app.yaml`.  For example, to allow an application to talk to both of the cores defined above its `.platform.app.yaml` file should contain the following:
 
```yaml
relationships:
    solr1: 'solrsearch:main'
    solr2: 'solrsearch:extra'
```

That is, the application's environment would include a `solr1` relationship that connects to the `main` endpoint, which is the `mainindex` core, and a `solr2` relationship that connects to the `extra` endpoint, which is the `extraindex` core.

The relationships array would then look something like the following:

```json
{
    "solr1": [
        {
            "path": "solr/mainindex",
            "host": "248.0.65.197",
            "scheme": "solr",
            "port": 8080
        }
    ],
    "solr2": [
        {
            "path": "solr/extraindex",
            "host": "248.0.65.197",
            "scheme": "solr",
            "port": 8080
        }
    ]
}
```

If no configuration is specified, the default configuration is equivalent to:

```yaml
solrsearch:
  type: solr:6.3
  configuration:
    cores:
      collection1: <default Drupal 8 configuration>
    endpoints:
        solr:
            core: collection1
```

The Solr 6.x Drupal 8 configuration files are reasonably generic and should work in many other circumstance, but explicitly defining a core, configuration, and endpoint is generally recommended.
