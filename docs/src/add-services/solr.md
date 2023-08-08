---
title: "Solr (Search service)"
weight: 30
sidebarTitle: "Solr"
---

Apache Solr is a scalable and fault-tolerant search index.

Solr search with generic schemas provided, and a custom schema is also supported. See the [Solr documentation](https://lucene.apache.org/solr/6_3_0/index.html) for more information."

{{% frameworks %}}

- [Drupal](../guides/drupal9/solr.md)
- [Ibexa DXP](../guides/ibexa/deploy.md#solr-specificity)
- [Jakarta EE](../guides/jakarta/deploy.md#apache-solr)
- [Spring](../guides/spring/solr.md)

{{% /frameworks %}}

## Supported versions

{{% major-minor-versions-note configMinor="true" %}}

| Grid | {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|------|-------------------------------|------------------------------ |
|  {{< image-versions image="solr" status="supported" environment="grid" >}} | {{< image-versions image="solr" status="supported" environment="dedicated-gen-3" >}} | {{< image-versions image="solr" status="supported" environment="dedicated-gen-2" >}} |

{{% deprecated-versions %}}

| Grid | {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|------|-------------------------------|------------------------------ |
|  {{< image-versions image="solr" status="deprecated" environment="grid" >}} | {{< image-versions image="solr" status="deprecated" environment="dedicated-gen-3" >}} | {{< image-versions image="solr" status="deprecated" environment="dedicated-gen-2" >}} |

{{% relationship-ref-intro %}}

{{% service-values-change %}}

{{< relationship "solr" >}}

## Usage example

{{% endpoint-description type="solr" sectionLink="#solr-6-and-later" multipleText="cores" /%}}

{{< codetabs >}}

+++
title=Go
file=static/files/fetch/examples/golang/solr
highlight=go
+++

<--->

+++
title=Java
file=static/files/fetch/examples/java/solr
highlight=java
+++

<--->

+++
title=Node.js
file=static/files/fetch/examples/nodejs/solr
highlight=js
+++

<--->

+++
title=PHP
file=static/files/fetch/examples/php/solr
highlight=php
+++

<--->

+++
title=Python
file=static/files/fetch/examples/python/solr
highlight=python
+++

{{< /codetabs >}}

## Solr 4

For Solr 4, Platform.sh supports only a single core per server called `collection1`.

You must provide your own Solr configuration via a `core_config` key in your ``.platform/services.yaml``:

```yaml
searchsolr:
    type: solr:4.10
    disk: 1024
    configuration:
        core_config: !archive "{{< variable "DIRECTORY" >}}"
```

The `directory` parameter points to a directory in the Git repository, in or below the `.platform/` folder. This directory needs to contain everything that Solr needs to start a core. At the minimum, `solrconfig.xml` and `schema.xml`. For example, place them in `.platform/solr/conf/` such that the `schema.xml` file is located at `.platform/solr/conf/schema.xml`. You can then reference that path like this -

```yaml
searchsolr:
    type: solr:4.10
    disk: 1024
    configuration:
        core_config: !archive "solr/conf/"
```

## Solr 6 and later

For Solr 6 and later Platform.sh supports multiple cores via different endpoints. Cores and endpoints are defined separately, with endpoints referencing cores. Each core may have its own configuration or share a configuration. It is best illustrated with an example.

```yaml
searchsolr:
    type: solr:8.4
    disk: 1024
    configuration:
        cores:
            mainindex:
                conf_dir: !archive "core1-conf"
            extraindex:
                conf_dir: !archive "core2-conf"
        endpoints:
            main:
                core: mainindex
            extra:
                core: extraindex
```

The above definition defines a single Solr 8.0 server. That server has 2 cores defined: `mainindex` &mdash; the configuration for which is in the `.platform/core1-conf` directory &mdash; and `extraindex` &mdash; the configuration for which is in the `.platform/core2-conf` directory.

It then defines two endpoints: `main` is connected to the `mainindex` core while `extra` is connected to the `extraindex` core. Two endpoints may be connected to the same core but at this time there would be no reason to do so. Additional options may be defined in the future.

Each endpoint is then available in the relationships definition in `.platform.app.yaml`. For example, to allow an application to talk to both of the cores defined above its `.platform.app.yaml` file should contain the following:

```yaml
relationships:
    solrsearch1: 'searchsolr:main'
    solrsearch2: 'searchsolr:extra'
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

### Configsets

For even more customizability, it's also possible to define Solr configsets. For example, the following snippet would define one configset, which would be used by all cores. Specific details can then be overridden by individual cores using `core_properties`, which is equivalent to the Solr `core.properties` file.

```yaml
searchsolr:
    type: solr:8.4
    disk: 1024
    configuration:
        configsets:
            mainconfig: !archive "configsets/solr8"
        cores:
            english_index:
                core_properties: |
                    configSet=mainconfig
                    schema=english/schema.xml
            arabic_index:
                core_properties: |
                    configSet=mainconfig
                    schema=arabic/schema.xml
        endpoints:
            english:
                core: english_index
            arabic:
                core: arabic_index
```

In this example, `.platform/configsets/solr8` contains the configuration definition for multiple cores. There are then two cores created: `english_index` uses the defined configset, but specifically the `.platform/configsets/solr8/english/schema.xml` file, while `arabic_index` is identical except for using the `.platform/configsets/solr8/arabic/schema.xml` file. Each of those cores is then exposed as its own endpoint.

Note that not all core.properties features make sense to specify in the `core_properties`. Some keys, such as `name` and `dataDir`, aren't supported, and may result in a solrconfig that fails to work as intended, or at all.

### Default configuration

#### Default for version 9+

If you don't specify any configuration, the following default is used:

```yaml {location=".platform/services.yaml"}
searchsolr:
    type: solr:9.1
    configuration:
        cores:
            collection1:
                conf_dir: !archive "example"
        endpoints:
            solr:
                core: collection1
```

The example configuration directory is equivalent to the [Solr example configuration set](https://github.com/apache/solr/tree/main/solr/server/solr/configsets/sample_techproducts_configs/conf).
This default configuration is designed only for testing.
You are strongly recommended to define your own configuration with a custom core and endpoint.

#### Default for versions below 9

If you don't specify any configuration, the following default is used:

```yaml {location=".platform/services.yaml"}
searchsolr:
    type: solr:8.4
    configuration:
        cores:
            collection1: {}
        endpoints:
            solr:
                core: collection1
```

The default configuration is based on an older version of the Drupal 8 Search API Solr module that is no longer in use.
You are strongly recommended to define your own configuration with a custom core and endpoint.

### Limitations

The recommended maximum size for configuration directories (zipped) is 2MB. These need to be monitored to ensure they don't grow beyond that. If the zipped configuration directories grow beyond this, performance declines and deploys become longer. The directory archives are compressed and string encoded. You could use this bash pipeline `echo $(($(tar czf - . | base64 | wc -c )/(1024*1024))) Megabytes` inside the directory to get an idea of the archive size.

The configuration directory is a collection of configuration data, like a data dictionary, e.g. small collections of key/value sets. The best way to keep the size small is to restrict the directory context to plain configurations. Including binary data like plugin `.jar` files inflates the archive size, and isn't recommended.

## Accessing the Solr server administrative interface

Because Solr uses HTTP for both its API and admin interface it's possible to access the admin interface over an SSH tunnel.

```bash
platform tunnel:single --relationship {{< variable "RELATIONSHIP_NAME" >}}
```

By default, this opens a tunnel at `127.0.0.1:30000`.

You can now open `http://localhost:30000/solr/` in a browser to access the Solr admin interface.
Note that you can't create indexes or users this way,
but you can browse the existing indexes and manipulate the stored data.

For {{% names/dedicated-gen-2 %}} use `ssh -L 8888:localhost:8983 {{< variable "USER" >}}@{{< variable "CLUSTER_NAME" >}}.ent.platform.sh` to open a tunnel instead,
after which the Solr server administrative interface is available at `http://localhost:8888/solr/`.

## Available plugins

This is the complete list of plugins that are available and loaded by default:

| Plugin                                                                             | Description                                            | 8.11 | 9.x |
|------------------------------------------------------------------------------------|--------------------------------------------------------|------|-----|
| [JTS](https://solr.apache.org/guide/8_1/spatial-search.html#jts-and-polygons-flat) | Library for creating and manipulating vector geometry. |*     |*    |
| [ICU4J](https://solr.apache.org/guide/8_3/language-analysis.html)                  | Library providing Unicode and globalization support.                                                                                                                                      |*     |*    |  

## Upgrading

The Solr data format sometimes changes between versions in incompatible ways. Solr doesn't include a data upgrade mechanism as it is expected that all indexes can be regenerated from stable data if needed. To upgrade (or downgrade) Solr you need to use a new service from scratch.

There are two ways of doing that.

### Destructive

In your `services.yaml` file, change the version of your Solr service *and* its name. Then update the name in the `.platform.app.yaml` relationships block.

When you push that to Platform.sh, the old service is deleted and a new one with the name is created, with no data. You can then have your application re-index data as appropriate.

This approach has the downside of temporarily having an empty Solr instance, which your application may or may not handle gracefully, and needing to rebuild your index afterward. Depending on the size of your data that could take a while.

### Transitional

For a transitional approach you temporarily have two Solr services. Add a second Solr service with the new version a new name and give it a new relationship in `.platform.app.yaml`. You can optionally run in that configuration for a while to allow your application to populate indexes in the new service as well.

Once you're ready to cut over, remove the old Solr service and relationship. You may optionally have the new Solr service use the old relationship name if that's easier for your application to handle. Your application is now using the new Solr service.

This approach has the benefit of never being without a working Solr instance. On the downside, it requires two running Solr servers temporarily, each of which consumes resources and need adequate disk space. Depending on the size of your data that may be a lot of disk space.
