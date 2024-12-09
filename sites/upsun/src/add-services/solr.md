---
title: "Solr (Search service)"
weight: 30
sidebarTitle: "Solr"
---

Apache Solr is a scalable and fault-tolerant search index.

Solr search with generic schemas provided, and a custom schema is also supported. See the [Solr documentation](https://lucene.apache.org/solr/6_3_0/index.html) for more information.

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like.
When you deploy your app, you always get the latest available patches.

{{< image-versions image="solr" status="supported" environment="grid" >}}

{{% deprecated-versions %}}

{{< image-versions image="solr" status="deprecated" environment="grid" >}}

## Relationship reference

For each service [defined via a relationship](#usage-example) to your application,
{{% vendor/name %}} automatically generates corresponding environment variables within your application container,
in the ``$<RELATIONSHIP-NAME>_<SERVICE-PROPERTY>`` format.

Here is example information available through the [service environment variables](/development/variables/_index.md#service-environment-variables) themselves,
or through the [``PLATFORM_RELATIONSHIPS`` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< codetabs >}}
+++
title= Service environment variables
+++

You can obtain the complete list of available service environment variables in your app container by running ``{{% vendor/cli %}} ssh env``.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed. So your apps should only rely on the [service environment variables](/development/variables/_index.md#service-environment-variables) directly rather than hard coding any values.

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

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/_index.md#service-environment-variables).
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

### 1. Configure the service

To define the service, use the ``solr`` type:

```yaml {configFile="app"}
services:
    # The name of the service container. Must be unique within a project.
    <SERVICE_NAME>:
        type: solr:<VERSION>
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost. Back up your data before changing the service.

### 2. Define the relationship

To define the relationship, use the following configuration:

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
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

With the above definition, the application container (``<APP_NAME>``) now has access to the service via the relationship ``<SERVICE_NAME>`` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="services"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      <RELATIONSHIP_NAME>:
        service: <SERVICE_NAME>
        endpoint: solr
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<RELATIONSHIP_NAME>` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

{{< /codetabs >}}

### Example configuration

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      solr:
services:
  # The name of the service container. Must be unique within a project.
  solr:
    type: solr:{{% latest "solr" %}}
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      solr:
        service: solr
        endpoint: solr
services:
  # The name of the service container. Must be unique within a project.
  solr:
    type: solr:{{% latest "solr" %}}
```

{{< /codetabs >}}


### Use in app

To use the configured service in your app, add a configuration file similar to the following to your project.

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # The location of the application's code.
    source:
      root: "myapp"

    [...]

    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      solr:
services:
  # The name of the service container. Must be unique within a project.
  solr:
    type: solr:{{% latest "solr" %}}
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # The location of the application's code.
    source:
      root: "myapp"

    [...]

    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      solr:
        service: solr
        endpoint: solr
services:
  # The name of the service container. Must be unique within a project.
  solr:
    type: solr:{{% latest "solr" %}}
```

{{< /codetabs >}}

This configuration defines a single application (`myapp`), whose source code exists in the `<PROJECT_ROOT>/myapp` directory.</br>
`myapp` has access to the `solr` service, via a relationship whose name is [identical to the service name](#2-define-the-relationship)
(as per [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships).

From this, ``myapp`` can retrieve access credentials to the service through the [relationship environment variables](#relationship-reference).

```bash {location="myapp/.environment"}
# Set environment variables for individual credentials.
# For more information, please visit https://docs.upsun.com/development/variables.html#service-environment-variables.
export QUEUE_SCHEME=${SOLR_SCHEME}
export QUEUE_USERNAME=${SOLR_USERNAME}
export QUEUE_PASSWORD=${SOLR_PASSWORD}
export QUEUE_HOST=${SOLR_HOST}
export QUEUE_PORT=${SOLR_PORT}

# Set a single RabbitMQ connection string variable for AMQP.
export AMQP_URL="${QUEUE_SCHEME}://${QUEUE_USERNAME}:${QUEUE_PASSWORD}@${QUEUE_HOST}:${QUEUE_PORT}/"
```

The above file — ``.environment`` in the ``myapp`` directory — is automatically sourced by {{% vendor/name %}} into the runtime environment, so that the variable ``SEARCH_URL`` can be used within the application to connect to the service.

Note that ``SEARCH_URL``, and all {{% vendor/name %}} [service environment variables](/development/variables/_index.md#service-environment-variables) like ``SOLR_HOST``, are environment-dependent.
Unlike the build produced for a given commit,
they can’t be reused across environments and only allow your app to connect to a single service instance on a single environment.

A file very similar to this is generated automatically for your when using the ``{{% vendor/cli %}} ify`` command to [migrate a codebase to {{% vendor/name %}}](/get-started/_index.md).

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

    # Relationships enable access from this app to a given service.
    # The example below shows configuration with explicitly set service names and endpoints.
    # See the Application reference for all options for defining relationships and endpoints.
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
