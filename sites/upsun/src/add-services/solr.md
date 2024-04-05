---
title: "Solr (Search service)"
weight: 30
sidebarTitle: "Solr"
---

Apache Solr is a scalable and fault-tolerant search index.

Solr search with generic schemas provided, and a custom schema is also supported. See the [Solr documentation](https://lucene.apache.org/solr/6_3_0/index.html) for more information.

{{% frameworks version="1" %}}

- [Ibexa DXP](../guides/ibexa/deploy.md#solr-specificity)
- [Jakarta EE](../guides/jakarta/deploy.md#apache-solr)
- [Spring](../guides/spring/solr.md)

{{% /frameworks %}}

## Supported versions

{{% major-minor-versions-note configMinor="true" %}}

{{< image-versions image="solr" status="supported" environment="grid" >}}

{{% deprecated-versions %}}

{{< image-versions image="solr" status="deprecated" environment="grid" >}}

{{% relationship-ref-intro %}}

{{< codetabs >}}
+++
title= Service environment variables
+++

{{% service-values-change %}}

```bash
SOLR_USERNAME=
SOLR_SCHEME=solr
SOLR_SERVICE=solr
SOLR_IP=123.456.78.90
SOLR_FRAGMENT=
SOLR_HOSTNAME=azertyuiopqsdfghjklm.solr.service._.eu-1.{{< vendor/urlraw "hostname" >}}
SOLR_PORT=8080
SOLR_CLUSTER=azertyuiopqsdf-main-afdwftq
SOLR_HOST=solr.internal
SOLR_REL=solr
SOLR_PATH=solr/collection1
SOLR_QUERY={}
SOLR_PASSWORD=
SOLR_EPOCH=0
SOLR_TYPE=solr:{{% latest "solr" %}}
SOLR_PUBLIC=false
SOLR_HOST_MAPPED=false
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal:

```json
{
    "username": null,
    "scheme": "solr",
    "service": "solr",
    "fragment": null,
    "ip": "123.456.78.90",
    "hostname": "azertyuiopqsdfghjklm.solr.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
    "port": 8080,
    "cluster": "azertyuiopqsdf-main-afdwftq",
    "host": "solr.internal",
    "rel": "solr",
    "path": "solr\/collection1",
    "query": [],
    "password": null,
    "type": "solr:{{% latest "solr" %}}",
    "public": false,
    "host_mapped": false
}
```

Here is an example of how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_SOLR_HOST="$(echo $RELATIONSHIPS_JSON | jq -r '.solr[0].host')"
```

{{< /codetabs >}}

## Usage example

{{% endpoint-description type="solr" sectionLink="#solr-6-and-later" multipleText="cores" /%}}

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    myapp:
        # The location of the application's code.
        source:
            root: "myapp"

        [...]

        # Relationships enable an app container's access to a service.
        relationships:
            solrsearch: "solr:solr"

services:
    # The name of the service container. Must be unique within a project.
    solr:
        type: solr:{{% latest "solr" %}}
```

{{% v2connect2app serviceName="solr" relationship="solr" var="SEARCH_URL" %}}

```bash {location="myapp/.environment"}
# Set environment variables for individual credentials.
# For more information, please visit {{< vendor/urlraw "docs" >}}/development/variables.html#service-environment-variables.
export SEARCH_HOST=${SOLR_HOST}
export SEARCH_PORT=${SOLR_PORT}
export SEARCH_PATH=${SOLR_PATH}

# Surface more common Solr connection string variables for use in app.
export SEARCH_URL="http://${SEARCH_HOST}:${SEARCH_PORT}/${SEARCH_PATH}"
```

{{% /v2connect2app %}}

## Solr 4

For Solr 4, {{% vendor/name %}} supports only a single core per server called `collection1`.

You must provide your own Solr configuration via a `core_config` key in your `{{< vendor/configfile "services" >}}`:

```yaml {configFile="services"}
services:
    # The name of the service container. Must be unique within a project.
    solr:
        type: "solr:4.10"
        configuration:
            core_config: !archive "{{< variable "DIRECTORY" >}}"
```

{{< variable "DIRECTORY" >}} points to a directory in the Git repository, in or below the `{{< vendor/configdir >}}/` folder. This directory needs to contain everything that Solr needs to start a core. At the minimum, `solrconfig.xml` and `schema.xml`.

For example, place them in `{{< vendor/configdir >}}/solr/conf/` such that the `schema.xml` file is located at `{{< vendor/configdir >}}/solr/conf/schema.xml`. You can then reference that path like this -

```yaml {configFile="services"}
services:
    # The name of the service container. Must be unique within a project.
    solr:
        type: "solr:4.10"
        configuration:
            core_config: !archive "solr/conf/"
```

## Solr 6 and later

For Solr 6 and later {{% vendor/name %}} supports multiple cores via different endpoints. Cores and endpoints are defined separately, with endpoints referencing cores. Each core may have its own configuration or share a configuration. It is best illustrated with an example.

```yaml {configFile="services"}
services:
    # The name of the service container. Must be unique within a project.
    solr:
        type: solr:{{% latest "solr" %}}
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

The above definition defines a single Solr {{% latest "solr" %}} server. That server has 2 cores defined:

- `mainindex` &mdash; the configuration for which is in the `{{< vendor/configdir >}}/core1-conf` directory
- `extraindex` &mdash; the configuration for which is in the `{{< vendor/configdir >}}/core2-conf` directory.

It then defines two endpoints: `main` is connected to the `mainindex` core while `extra` is connected to the `extraindex` core. Two endpoints may be connected to the same core but at this time there would be no reason to do so. Additional options may be defined in the future.

Each endpoint is then available in the relationships definition in `{{< vendor/configfile "app" >}}`. For example, to allow an application to talk to both of the cores defined above its configuration should contain the following:

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    myapp:
    
        type: "php:{{% latest "php" %}}"

        source:
            root: "myapp"

        [...]

        relationships:
            solrsearch1: 
                service: solr
                endpoint: main
            solrsearch2:
                service: solr
                endpoint: extra

services:
    # The name of the service container. Must be unique within a project.
    solr:
        type: solr:{{% latest "solr" %}}
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

That is, the application's environment would include a `solrsearch1` relationship that connects to the `main` endpoint, which is the `mainindex` core, and a `solrsearch2` relationship that connects to the `extra` endpoint, which is the `extraindex` core.

The relationships array would then look something like the following:

```json
{
    "solrsearch1": [
        {
            "path": "solr/mainindex",
            "host": "248.0.65.197",
            "scheme": "solr",
            "port": 8080
        }
    ],
    "solrsearch2": [
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

```yaml {configFile="services"}
services:
    # The name of the service container. Must be unique within a project.
    solr:
        type: solr:{{% latest "solr" %}}
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

In this example, `{{< vendor/configdir >}}/configsets/solr8` contains the configuration definition for multiple cores. There are then two cores created:

- `english_index` uses the defined configset, but specifically the `{{< vendor/configdir >}}/configsets/solr8/english/schema.xml` file
- `arabic_index` is identical except for using the `{{< vendor/configdir >}}/configsets/solr8/arabic/schema.xml` file.

Each of those cores is then exposed as its own endpoint.

Note that not all core properties features make sense to specify in the `core_properties`. Some keys, such as `name` and `dataDir`, aren't supported, and may result in a `solrconfig` that fails to work as intended, or at all.

### Default configuration

#### Default for version 9+

If you don't specify any configuration, the following default is used:

```yaml {configFile="services"}
services:
    # The name of the service container. Must be unique within a project.
    solr:
        type: solr:{{% latest "solr" %}}
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

```yaml {configFile="services"}
services:
    # The name of the service container. Must be unique within a project.
    solr:
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

The recommended maximum size for configuration directories (zipped) is 2MB. These need to be monitored to ensure they don't grow beyond that. If the zipped configuration directories grow beyond this, performance declines and deploys become longer. The directory archives are compressed and string encoded. You could use this bash pipeline

```bash
echo $(($(tar czf - . | base64 | wc -c )/(1024*1024))) Megabytes
```

inside the directory to get an idea of the archive size.

The configuration directory is a collection of configuration data, like a data dictionary, e.g. small collections of key/value sets. The best way to keep the size small is to restrict the directory context to plain configurations. Including binary data like plugin `.jar` files inflates the archive size, and isn't recommended.

## Accessing the Solr server administrative interface

Because Solr uses HTTP for both its API and admin interface it's possible to access the admin interface over an SSH tunnel.

```bash
{{% vendor/cli %}} tunnel:single --relationship {{< variable "RELATIONSHIP_NAME" >}}
```

By default, this opens a tunnel at `127.0.0.1:30000`.

You can now open `http://localhost:30000/solr/` in a browser to access the Solr admin interface.
Note that you can't create indexes or users this way,
but you can browse the existing indexes and manipulate the stored data.

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

In your `{{< vendor/configfile "services" >}}` file, change the version of your Solr service *and* its name.
Be sure to also update the reference to the now changed service name in it's corresponding application's `relationship` block.

When you push that to {{% vendor/name %}}, the old service is deleted and a new one with the name is created, with no data. You can then have your application re-index data as appropriate.

This approach has the downside of temporarily having an empty Solr instance, which your application may or may not handle gracefully, and needing to rebuild your index afterward. Depending on the size of your data that could take a while.

### Transitional

For a transitional approach you temporarily have two Solr services. Add a second Solr service with the new version a new name and give it a new relationship in `{{< vendor/configfile "app" >}}`. You can optionally run in that configuration for a while to allow your application to populate indexes in the new service as well.

Once you're ready to cut over, remove the old Solr service and relationship. You may optionally have the new Solr service use the old relationship name if that's easier for your application to handle. Your application is now using the new Solr service.

This approach has the benefit of never being without a working Solr instance. On the downside, it requires two running Solr servers temporarily, each of which consumes resources and need adequate disk space. Depending on the size of your data that may be a lot of disk space.
