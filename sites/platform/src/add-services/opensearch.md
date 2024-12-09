---
title: "OpenSearch (search service)"
weight: -20
description: |
  OpenSearch is a distributed RESTful search engine built for the cloud.
sidebarTitle: "OpenSearch"
---

OpenSearch is a distributed RESTful search engine built for the cloud.

See the [OpenSearch documentation](https://opensearch.org/docs/latest/) for more information.

To switch from Elasticsearch, follow the same procedure as for [upgrading](#upgrading).

## Supported versions

<!--
To update the versions in this table, use docs/data/registry.json
-->

<!-- vale on -->
<table>
    <thead>
        <tr>
            <th>Grid</th>
            <th>Dedicated Gen 3</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="opensearch" status="supported" environment="grid" >}}</td>
            <td>{{< image-versions image="opensearch" status="supported" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="opensearch" status="supported" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>
<!-- vale off -->

On Grid and {{% names/dedicated-gen-3 %}}, from version 2, you only specify the major version.
The latest compatible minor version and patches are applied automatically. On Grid, version 1 represents a rolling release - the latest minor version available from the upstream (starting with opensearch 1.3).

You can see the latest minor and patch versions of OpenSearch available from the [`2.x`](https://opensearch.org/lines/2x.html) and [`1.x`](https://opensearch.org/lines/1x.html) release lines.

## Deprecated versions

The following versions are still available in your projects,
but they're at their end of life and are no longer receiving security updates from upstream,
or are no longer the recommended way to configure the service on {{% vendor/name %}}.

<table>
    <thead>
        <tr>
            <th>Grid</th>
            <th>Dedicated Gen 3</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="opensearch" status="deprecated" environment="grid" >}}</td>
            <td>{{< image-versions image="opensearch" status="deprecated" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="opensearch" status="deprecated" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

To ensure your project remains stable in the future,
switch to [a supported version](#supported-versions).

## Relationship reference

Example information available through the [`{{% vendor/prefix %}}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables)
or by running `{{% vendor/cli %}} relationships`.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed.
So your apps should only rely on the `{{% vendor/prefix %}}_RELATIONSHIPS` environment variable directly rather than hard coding any values.

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

## Usage example

### 1. Configure the service

To define the service, use the `opensearch` type:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
  type: opensearch:<VERSION>
  disk: 256
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost.
Back up your data before changing the service.

### 2. Define the relationship

To define the relationship, use the following configuration:

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
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

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<SERVICE_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
# The example below shows configuration with an explicitly set service name and endpoint.
# See the Application reference for all options for defining relationships and endpoints.
# Note that legacy definition of the relationship is still supported.
# More information: https://docs.platform.sh/create-apps/app-reference/single-runtime-image.html#relationships
relationships:
  <RELATIONSHIP_NAME>:
    service: <SERVICE_NAME>
    endpoint: opensearch
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<RELATIONSHIP_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< /codetabs >}}

### Example configuration

### [Service definition](/add-services.html)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
opensearch:
  type: opensearch:{{% latest "opensearch" %}}
  disk: 256
```

#### [App configuration](/create-apps/_index.md)

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
# The example below shows simplified configuration leveraging a default service
# (identified from the relationship name) and a default endpoint.
# See the Application reference for all options for defining relationships and endpoints.
relationships:
  opensearch:
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
# The example below shows configuration with an explicitly set service name and endpoint.
# See the Application reference for all options for defining relationships and endpoints.
# Note that legacy definition of the relationship is still supported.
# More information: https://docs.platform.sh/create-apps/app-reference/single-runtime-image.html#relationships
relationships:
  opensearch:
    service: opensearch
    endpoint: opensearch
```

{{< /codetabs >}}

### Use in app

To use the configured service in your app, add a configuration file similar to the following to your project.

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
name: myapp

[...]

relationships:
  opensearch:
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
name: myapp

[...]

relationships:
  opensearch:
    service: opensearch
    endpoint: opensearch
```

{{< /codetabs >}}

This configuration defines a single application (`myapp`), whose source code exists in the `<PROJECT_ROOT>/myapp` directory.</br>
`myapp` has access to the `opensearch` service, via a relationship whose name is [identical to the service name](#2-define-the-relationship)
(as per [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships).

From this, `myapp` can retrieve access credentials to the service through the environment variable `{{< vendor/prefix >}}_RELATIONSHIPS`. That variable is a base64-encoded JSON object, but can be decoded at runtime (using the built-in tool `jq`) to provide more accessible environment variables to use within the application itself:

```bash {location="myapp/.environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo ${{< vendor/prefix >}}_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export OS_SCHEME=$(echo $RELATIONSHIPS_JSON | jq -r ".opensearch[0].scheme")
export OS_HOST=$(echo $RELATIONSHIPS_JSON | jq -r ".opensearch[0].host")
export OS_PORT=$(echo $RELATIONSHIPS_JSON | jq -r ".opensearch[0].port")

# Surface more common OpenSearch connection string variables for use in app.
export OPENSEARCH_USERNAME=$(echo $RELATIONSHIPS_JSON | jq -r ".opensearch[0].username")
export OPENSEARCH_PASSWORD=$(echo $RELATIONSHIPS_JSON  | jq -r ".opensearch[0].password")
export OPENSEARCH_HOSTS=[\"$OS_SCHEME://$OS_HOST:$OS_PORT\"]
```

The above file &mdash; `.environment` in the `myapp` directory &mdash; is automatically sourced by {{< vendor/name >}} into the runtime environment, so that the variable `OPENSEARCH_HOSTS` can be used within the application to connect to the service.

Note that `OPENSEARCH_HOSTS` and all {{< vendor/name >}}-provided environment variables like `{{% vendor/prefix %}}_RELATIONSHIPS`, are environment-dependent. Unlike the build produced for a given commit, they can't be reused across environments and only allow your app to connect to a single service instance on a single environment.

A file very similar to this is generated automatically for your when using the `{{< vendor/cli >}} ify` command to [migrate a codebase to {{% vendor/name %}}](/get-started).

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
# The name of the service container. Must be unique within a project.
opensearch:
  type: opensearch:{{% latest "opensearch" %}}
  disk: 2048
  configuration:
    authentication:
      enabled: true
```

That enables mandatory HTTP Basic auth on all requests.
The credentials are available in any relationships that point at that service,
in the `username` and `password` properties.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed. So your apps should only rely on the `{{% vendor/prefix %}}_RELATIONSHIPS` environment variable directly rather than hard coding any values.

This functionality is generally not required if OpenSearch isn't exposed on its own public HTTP route.
However, certain applications may require it, or it allows you to safely expose OpenSearch directly to the web.
To do so, add a route to `{{< vendor/configfile "routes" >}}` that has `opensearch:opensearch` as its upstream
(where `opensearch` is whatever you named the service).

For example:

```yaml {configFile="routes"}
"https://www.os.{default}/":
  type: redirect
  to: "https://os.{default}/"
"https://os.{default}/":
  type: upstream
  upstream: "opensearch:opensearch"
```

## Plugins

OpenSearch offers a number of plugins.
To enable them, list them under the `configuration.plugins` key in your `{{< vendor/configfile "services" >}}` file, like so:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
opensearch:
  type: "opensearch:{{% latest "opensearch" %}}"
  disk: 1024
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
