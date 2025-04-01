---
title: "OpenSearch (search service)"
weight: -20
description: |
  OpenSearch is a distributed RESTful search engine built for the cloud.
sidebarTitle: "OpenSearch"
---

{{% description %}}

See the [OpenSearch documentation](https://opensearch.org/docs/latest/) for more information.

To switch from Elasticsearch, follow the same procedure as for [upgrading](#upgrading).

## Supported versions

In the list below, notice that there you only specify the major version.
Each version represents a rolling release of the latest minor version available from the upstream.
The latest compatible minor version and patches are applied automatically.

{{< image-versions image="opensearch" status="supported" environment="grid" >}}

You can see the latest minor and patch versions of OpenSearch available from the [`2.x`](https://opensearch.org/lines/2x.html) and [`1.x`](https://opensearch.org/lines/1x.html) (1.3) release lines.

## Deprecated versions

The following versions are still available in your projects,
but they're at their end of life and are no longer receiving security updates from upstream,
or are no longer the recommended way to configure the service on {{% vendor/name %}}.

{{< image-versions image="opensearch" status="deprecated" environment="grid" >}}

To ensure your project remains stable in the future,
switch to [a supported version](#supported-versions).

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
OPENSEARCH_USERNAME=
OPENSEARCH_SCHEME=http
OPENSEARCH_SERVICE=opensearch
OPENSEARCH_FRAGMENT=
OPENSEARCH_IP=123.456.78.90
OPENSEARCH_INSTANCE_IPS=['123.456.78.90']
OPENSEARCH_HOSTNAME=azertyuiopqsdfghjklm.opensearch.service._.eu-1.{{< vendor/urlraw "hostname" >}}
OPENSEARCH_PORT=9200
OPENSEARCH_CLUSTER=azertyuiopqsdf-main-afdwftq
OPENSEARCH_EPOCH=0
OPENSEARCH_HOST=opensearch.internal
OPENSEARCH_REL=opensearch
OPENSEARCH_PATH=
OPENSEARCH_PASSWORD=ChangeMe
OPENSEARCH_QUERY={}
OPENSEARCH_TYPE=opensearch:{{% latest "opensearch" %}}
OPENSEARCH_PUBLIC=false
OPENSEARCH_HOST_MAPPED=false
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
    "scheme": "http",
    "service": "opensearch",
    "fragment": null,
    "ip": "169.254.99.100",
    "hostname": "azertyuiopqsdfghjklm.opensearch.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
    "port": 9200,
    "cluster": "azertyuiopqsdf-main-7rqtwti",
    "host": "opensearch.internal",
    "rel": "opensearch",
    "path": null,
    "query": [],
    "password": "ChangeMe",
    "type": "opensearch:{{% latest "opensearch" %}}",
    "public": false,
    "host_mapped": false
}
```

Here is an example of how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_OPENSEARCH_HOST="$(echo $RELATIONSHIPS_JSON | jq -r '.opensearch[0].host')"
```

{{< /codetabs >}}

## Usage example

### 1. Configure the service

To define the service, use the ``opensearch`` type:

```yaml {configFile="app"}
services:
  # The name of the service container. Must be unique within a project.
  <SERVICE_NAME>:
    type: opensearch:<VERSION>
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

The example above leverages [default endpoint](/create-apps/app-reference/single-runtime-image.md#relationships) configuration for relationships.
That is, it uses default endpoints behind-the-scenes, providing a [relationship](/create-apps/app-reference/single-runtime-image.md#relationships)
(the network address a service is accessible from) that is identical to the _name_ of that service.

Depending on your needs, instead of default endpoint configuration,
you can use [explicit endpoint configuration](/create-apps/app-reference/single-runtime-image.md#relationships).

With the above definition, the application container (``<APP_NAME>``) now has [access to the service](#use-in-app) via the relationship ``<SERVICE_NAME>`` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      <RELATIONSHIP_NAME>:
        service: <SERVICE_NAME>
        endpoint: opensearch
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/app-reference/single-runtime-image.md#relationships) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/app-reference/single-runtime-image.md#relationships).

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
      opensearch:
services:
  # The name of the service container. Must be unique within a project.
  opensearch:
    type: opensearch:{{% latest "opensearch" %}}
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
      opensearch:
        service: opensearch
        endpoint: opensearch
services:
  # The name of the service container. Must be unique within a project.
  opensearch:
    type: opensearch:{{% latest "opensearch" %}}
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
      opensearch:
services:
  # The name of the service container. Must be unique within a project.
  opensearch:
    type: opensearch:{{% latest "opensearch" %}}
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
      opensearch:
        service: opensearch
        endpoint: opensearch
services:
  # The name of the service container. Must be unique within a project.
  opensearch:
    type: opensearch:{{% latest "opensearch" %}}
```

{{< /codetabs >}}

This configuration defines a single application (`myapp`), whose source code exists in the `<PROJECT_ROOT>/myapp` directory.</br>
`myapp` has access to the `opensearch` service, via a relationship whose name is [identical to the service name](#2-define-the-relationship)
(as per [default endpoint](/create-apps/app-reference/single-runtime-image.md#relationships) configuration for relationships).

From this, ``myapp`` can retrieve access credentials to the service through the [relationship environment variables](#relationship-reference).

```bash {location="myapp/.environment"}
# Set environment variables for individual credentials.
# For more information, please visit {{< vendor/urlraw "docs" >}}/development/variables.html#service-environment-variables.
export OS_SCHEME=${OPENSEARCH_SCHEME}
export OS_HOST=${OPENSEARCH_HOST}
export OS_PORT=${OPENSEARCH_PORT}

# Surface more common OpenSearch connection string variables for use in app.
export OS_USERNAME=${OPENSEARCH_USERNAME}
export OS_PASSWORD=${OPENSEARCH_PASSWORD}
export OPENSEARCH_HOSTS=[\"$OS_SCHEME://$OS_HOST:$OS_PORT\"]
```

The above file — ``.environment`` in the ``myapp`` directory — is automatically sourced by {{% vendor/name %}} into the runtime environment, so that the variable ``OPENSEARCH_HOSTS`` can be used within the application to connect to the service.

Note that ``OPENSEARCH_HOSTS``, and all {{% vendor/name %}} [service environment variables](/development/variables/_index.md#service-environment-variables) like ``OPENSEARCH_HOST``, are environment-dependent.
Unlike the build produced for a given commit,
they can’t be reused across environments and only allow your app to connect to a single service instance on a single environment.

A file very similar to this is generated automatically for your when using the ``{{% vendor/cli %}} ify`` command to [migrate a codebase to {{% vendor/name %}}](/get-started/_index.md).

{{< note >}}

When you create an index on OpenSearch,
don't specify the `number_of_shards` or `number_of_replicas` settings in your OpenSearch API call.
These values are set automatically based on available resources.

{{< /note >}}

## Authentication

By default, OpenSearch has no authentication.
No username or password is required to connect to it.

You may optionally enable HTTP Basic authentication.
To do so, include the following in your `{{< vendor/configfile "services" >}}` configuration:

```yaml {configFile="services"}
services:
  # The name of the service container. Must be unique within a project.
  opensearch:
    type: opensearch:{{% latest "opensearch" %}}
    configuration:
      authentication:
        enabled: true
```

That enables mandatory HTTP Basic auth on all requests.
The credentials are available in any relationships that point at that service,
in the `OPENSEARCH_USERNAME` and `OPENSEARCH_PASSWORD` [service environment variables](/development/variables/_index.md#service-environment-variables).

You can obtain the complete list of available service environment variables in your app container by running ``{{% vendor/cli %}} ssh env``.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed. So your apps should only rely on the [service environment variables](/development/variables/_index.md#service-environment-variables) directly rather than hard coding any values.

This functionality is generally not required if OpenSearch isn't exposed on its own public HTTP route.
However, certain applications may require it, or it allows you to safely expose OpenSearch directly to the web.
To do so, add a route to `{{< vendor/configfile "routes" >}}` that has `opensearch:opensearch` as its upstream
(where `opensearch` is whatever you named the service).
For example:

```yaml {configFile="routes"}
routes:
  "https://www.os.{default}/":
    type: redirect
    to: "https://os.{default}/"
  "https://os.{default}/":
    type: upstream
    upstream: "opensearch:opensearch"

services:
  # The name of the service container. Must be unique within a project.
  opensearch:
    configuration:
      authentication:
        enabled: true
```

## Plugins

OpenSearch offers a number of plugins.
To enable them, list them under the `configuration.plugins` key in your `{{< vendor/configfile "services" >}}` file, like so:

```yaml {configFile="services"}
services:
  # The name of the service container. Must be unique within a project.
  opensearch:
    configuration:
      plugins:
        - analysis-icu
```

In this example you'd have the ICU analysis plugin and the size mapper plugin.

If there is a publicly available plugin you need that isn't listed here, [contact support](/learn/overview/get-support.md).

### Available plugins

This is the complete list of plugins that can be enabled:

| Plugin                  | Description                                                                               | 1   | 2 |
|-------------------------|-------------------------------------------------------------------------------------------|-----|---|
| `analysis-icu`          | Support ICU Unicode text analysis                                                         | *   | * |
| `analysis-kuromoji`     | Japanese language support                                                                 | *   | * |
| `analysis-nori`         | Integrates Lucene Nori analysis module into OpenSearch                                    | *   | * |
| `analysis-phonetic`     | Phonetic analysis                                                                         | *   | * |
| `analysis-smartcn`      | Smart Chinese Analysis Plugins                                                            | *   | * |
| `analysis-stempel`      | Stempel Polish Analysis Plugin                                                            | *   | * |
| `analysis-ukrainian`    | Ukrainian language support                                                                | *   | * |
| `ingest-attachment`     | Extract file attachments in common formats (such as PPT, XLS, and PDF)                    | *   | * |
| `mapper-annotated-text` | Adds support for text fields with markup used to inject annotation tokens into the index  | *   | * |
| `mapper-murmur3`        | Murmur3 mapper plugin for computing hashes at index-time                                  | *   | * |
| `mapper-size`           | Size mapper plugin, enables the `_size` meta field                                        | *   | * |
| `repository-s3`         | Support for using S3 as a repository for Snapshot/Restore                                 | *   | * |
| `transport-nio`         | Support for NIO transport                                                                 | *   | * |


### Alternative plugins

**These plugins are currently available for `OpenSearch 2.0` only.** The names below show exactly how they should be added to your configuration. For example, to use the `alerting` plugin, specify it in your `services.yaml` as so:

```yaml {configFile="services"}
services:
  opensearch:
    configuration:
      plugins:
        - alerting
```

{{< note title="Different names used" theme="warning" >}}

It should be noted that **these names may differ to what they are commonly known as in the [OpenSearch docs](https://opensearch.org/docs/latest/).** To help your understanding of what each plugin does, please click each plugin for a link to the corresponding GitHub repositories.

{{< /note >}}


| Plugin                                                                                                    | Description  | 1     | 2 |
-----------------------------------------------------------------------------------------------------------|--------------|-------|---|
| [`alerting`](https://github.com/opensearch-project)                                                       | Monitor data and send alert notifications automatically                           | N/A   | * |
| [`opensearch-anomaly-detection`](https://github.com/opensearch-project/anomaly-detection)                 | Detect anomalies as you log and monitor data in near real time                             | N/A   | * |
| [`asynchronous-search`](https://github.com/opensearch-project/asynchronous-search)                        |Run search queries in the background and retrieve results as they become available                                    | N/A   | * |
| [`opensearch-cross-cluster-replication`](https://github.com/opensearch-project/cross-cluster-replication) |Replicate data across two opensearch clusters             | N/A   | * |
| [`opensearch-custom-codecs`](https://github.com/opensearch-project/custom-codecs)                         | Provide custom Lucene codecs for loading through Apache Lucene's `NamedSPILoader`                                     | N/A   | * |
| [`opensearch-flow-framework`](https://github.com/opensearch-project/flow-framework)                       | Innovate AI applications on OpenSearch                     | N/A   | * |
| [`notifications`](https://github.com/opensearch-project/notifications)                                    | A central location for all of your notifications from OpenSearch plugins                         | N/A   | * |
| [`opensearch-reports-scheduler`](https://github.com/opensearch-project/reporting)                         |Export and share reports from OpenSearch Dashboards dashboards, saved search, alerts and visualizations                                     | N/A   | * |
| [`geospatial`](https://github.com/opensearch-project/geospatial)                                          |An OpenSearch plugin that contains geospatial specific features                                                     | N/A   | * |
| [`opensearch-index-management`](https://github.com/opensearch-project/index-management)                   |A suite of features to monitor and manage indexes                               | N/A   | * |
| [`opensearch-job-scheduler`](https://github.com/opensearch-project/job-scheduler)                         |Schedule periodical jobs running within OpenSearch nodes                                     | N/A   | * |
| [`opensearch-knn`](https://github.com/opensearch-project/k-NN)                                            |Run the nearest neighbor search on billions of documents                                                        | N/A   | * |
| [`opensearch-ml-plugin`](https://github.com/opensearch-project/ml-commons/)                               |Leverage existing Open source machine learning algorithms                                          | N/A   | * |
| [`opensearch-skills`](https://github.com/opensearch-project/skills)                                       |Provides tools for ml-common's agent framework `OpenSearch ml-commons`                                                   | N/A   | * |
| [`neural-search`](https://github.com/opensearch-project/neural-search)                                    |Index documents and conduct a neural search on indexed documents                                                | N/A   | * |
| [`opensearch-observability`](https://github.com/opensearch-project/observability)                         |Collection of plugins and applications to visualize data-driven events                                     | N/A   | * |
| [`performance-analyzer`](https://github.com/opensearch-project/performance-analyzer)                      |A REST API to query numerous performance metrics                                 | N/A   | * |
| [`opensearch-sql-plugin`](https://github.com/opensearch-project/sql)                                      |Extract insights out of OpenSearch using SQL or Piped Processing Language (PPL)                                             | N/A   | * |

### Plugin removal

Removing plugins previously added in your `{{< vendor/configfile "services" >}}` file doesn't automatically uninstall them from your OpenSearch instances.
This is deliberate, as removing a plugin may result in data loss or corruption of existing data that relied on that plugin.
Removing a plugin usually requires reindexing.

To permanently remove a previously enabled plugin,
[upgrade the service](#upgrading) to create a new instance of OpenSearch and migrate to it.
In most cases it isn't necessary as an unused plugin has no appreciable impact on the server.

## Upgrading

The OpenSearch data format sometimes changes between versions in incompatible ways.
OpenSearch doesn't include a data upgrade mechanism as it's expected that all indexes can be regenerated from stable data if needed.
To upgrade (or downgrade) OpenSearch, use a new service from scratch.

There are two ways to do so.

### Destructive

In your `{{< vendor/configfile "services" >}}` file, change the version *and* name of your OpenSearch service.
Be sure to also update the reference to the now changed service name in it's corresponding application's `relationship` block.

When you push that to {{% vendor/name %}}, the old service is deleted and a new one with the new name is created with no data.
You can then have your application reindex data as appropriate.

This approach has the downsides of temporarily having an empty OpenSearch instance,
which your application may or may not handle gracefully, and needing to rebuild your index afterward.
Depending on the size of your data that could take a while.

### Transitional

With a transitional approach, you temporarily have two OpenSearch services.
Add a second OpenSearch service with the new version a new name and give it a new relationship in `{{< vendor/configfile "app" >}}`.
You can optionally run in that configuration for a while to allow your application to populate indexes in the new service as well.

Once you're ready to switch over, remove the old OpenSearch service and relationship.
You may optionally have the new OpenSearch service use the old relationship name if that's easier for your app to handle.
Your application is now using the new OpenSearch service.

This approach has the benefit of never being without a working OpenSearch instance.
On the downside, it requires two running OpenSearch servers temporarily,
each of which consumes resources and needs adequate disk space.
Depending on the size of your data, that may be a lot of disk space.
