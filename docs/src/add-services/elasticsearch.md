---
title: "Elasticsearch (Search service)"
weight: 1
description: |
  Elasticsearch is a distributed RESTful search engine built for the cloud.
sidebarTitle: "Elasticsearch"
---

{{% description %}}

See the [Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) for more information.

{{% frameworks %}}

- [Drupal](../guides/drupal9/elasticsearch.md)
- [Jakarta EE](../guides/jakarta/deploy.md#elasticsearch)
- [Micronaut](../guides/micronaut/elasticsearch.md)
- [Quarkus](../guides/quarkus/elasticsearch.md)
- [Spring](../guides/spring/elasticsearch.md)

{{% /frameworks %}}

## Supported versions

{{% image-versions-legacy "elasticsearch" %}}

Due to a licensing change, Elasticsearch versions after 7.10 aren't supported.
For newer versions, use [OpenSearch](./opensearch.md) instead.
To switch to OpenSearch, follow the same procedure as for [upgrading](#upgrading).

{{% deprecated-versions %}}

| Grid | {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|------|-------------------------------|------------------------------ |
|  {{< image-versions image="elasticsearch" status="deprecated" environment="grid" >}} | {{< image-versions image="elasticsearch" status="deprecated" environment="dedicated-gen-3" >}} | {{< image-versions image="elasticsearch" status="deprecated" environment="dedicated-gen-2" >}} |

## Relationship

The format exposed in the `$PLATFORM_RELATIONSHIPS` [environment variable](../development/variables/use-variables.md#use-platformsh-provided-variables):

{{< relationship "elasticsearch" >}}

## Usage example

{{% endpoint-description type="elasticsearch" /%}}

{{< codetabs >}}

---
title=Java
file=static/files/fetch/examples/java/elasticsearch
highlight=java
---

<--->

---
title=Node.js
file=static/files/fetch/examples/nodejs/elasticsearch
highlight=js
---

<--->

---
title=PHP
file=static/files/fetch/examples/php/elasticsearch
highlight=php
---

<--->

---
title=Python
file=static/files/fetch/examples/python/elasticsearch
highlight=python
---

{{< /codetabs >}}

{{< note >}}

When you create an index on Elasticsearch,
don't specify the `number_of_shards` or `number_of_replicas` settings in your Elasticsearch API call.
These values are set automatically based on available resources.

{{< /note >}}

## Authentication

By default, Elasticsearch has no authentication.
No username or password is required to connect to it.

Starting with Elasticsearch 7.2 you may optionally enable HTTP Basic authentication.
To do so, include the following in your `services.yaml` configuration:

```yaml {location=".platform/services.yaml"}
search:
    type: elasticsearch:7.2
    disk: 2048
    configuration:
        authentication:
            enabled: true
```

That enables mandatory HTTP Basic auth on all requests.
The credentials are available in any relationships that point at that service,
in the `username` and `password` properties.

This functionality is generally not required if Elasticsearch isn't exposed on its own public HTTP route.
However, certain applications may require it, or it allows you to safely expose Elasticsearch directly to the web.
To do so, add a route to `routes.yaml` that has `search:elasticsearch` as its upstream
(where `search` is whatever you named the service in `services.yaml`).
For example:

```yaml {location=".platform/routes.yaml"}
"https://es.{default}":
    type: upstream
    upstream: search:elasticsearch
```

## Plugins

Elasticsearch 2.4 and later offers a number of plugins.
To enable them, list them under the `configuration.plugins` key in your `services.yaml` file, like so:

```yaml {location=".platform/services.yaml"}
search:
    type: "elasticsearch:7.2"
    disk: 1024
    configuration:
        plugins:
            - analysis-icu
            - lang-python
```

In this example you'd have the ICU analysis plugin and Python script support plugin.

If there is a publicly available plugin you need that isn't listed here, [contact support](../overview/get-support.md).

### Available plugins

This is the complete list of official Elasticsearch plugins that can be enabled:

| Plugin                  | Description                                                                               | 2.4 | 5.x | 6.x | 7.x |
|-----------------------|-------------------------------------------------------------------------------------------|-----|-----|-----|-----|
| `analysis-icu`          | Support ICU Unicode text analysis                                                         | *   | *   | *   | *   |
| `analysis-nori`         | Integrates Lucene Nori analysis module into Elasticsearch                                 |     |     | *   | *   |
| `analysis-kuromoji`     | Japanese language support                                                                 | *   | *   | *   | *   |
| `analysis-smartcn`      | Smart Chinese Analysis Plugins                                                            | *   | *   | *   | *   |
| `analysis-stempel`      | Stempel Polish Analysis Plugin                                                            | *   | *   | *   | *   |
| `analysis-phonetic`     | Phonetic analysis                                                                         | *   | *   | *   | *   |
| `analysis-ukrainian`    | Ukrainian language support                                                                |     | *   | *   | *   |
| `cloud-aws`             | AWS Cloud plugin, allows storing indices on AWS S3                                        | *   |     |     |     |
| `delete-by-query`       | Support for deleting documents matching a given query                                     | *   |     |     |     |
| `discovery-multicast`   | Ability to form a cluster using TCP/IP multicast messages                                 | *   |     |     |     |
| `ingest-attachment`     | Extract file attachments in common formats (such as PPT, XLS, and PDF)                    |     | *   | *   | *   |
| `ingest-user-agent`     | Extracts details from the user agent string a browser sends with its web requests         |     | *   | *   |     |
| `lang-javascript`       | JavaScript language plugin, allows the use of JavaScript in Elasticsearch scripts         |     | *   |     |     |
| `lang-python`           | Python language plugin, allows the use of Python in Elasticsearch scripts                 | *   | *   |     |     |
| `mapper-annotated-text` | Adds support for text fields with markup used to inject annotation tokens into the index  |     |     | *   | *   |
| `mapper-attachments`    | Mapper attachments plugin for indexing common file types                                  | *   | *   |     |     |
| `mapper-murmur3`        | Murmur3 mapper plugin for computing hashes at index-time                                  | *   | *   | *   | *   |
| `mapper-size`           | Size mapper plugin, enables the `_size` meta field                                        | *   | *   | *   | *   |
| `repository-s3`         | Support for using S3 as a repository for Snapshot/Restore                                 |     | *   | *   | *   |
| `transport-nio`         | Support for NIO transport                                                                 |     |     |     | *   |

### Plugin removal

Removing plugins previously added in your `services.yaml` file doesn't automatically uninstall them from your Elasticsearch instances.
This is deliberate, as removing a plugin may result in data loss or corruption of existing data that relied on that plugin.
Removing a plugin usually requires reindexing.

To permanently remove a previously enabled plugin,
[upgrade the service](#upgrading) to create a new instance of Elasticsearch and migrate to it.
In most cases it isn't necessary as an unused plugin has no appreciable impact on the server.

## Upgrading

The Elasticsearch data format sometimes changes between versions in incompatible ways.
Elasticsearch doesn't include a data upgrade mechanism as it's expected that all indexes can be regenerated from stable data if needed.
To upgrade (or downgrade) Elasticsearch, use a new service from scratch.

There are two ways to do so.

### Destructive

In your `services.yaml` file, change the version *and* name of your Elasticsearch service.
Then update the name in the `.platform.app.yaml` relationships block.

When you push that to Platform.sh, the old service is deleted and a new one with the new name is created with no data.
You can then have your application reindex data as appropriate.

This approach has the downsides of temporarily having an empty Elasticsearch instance,
which your application may or may not handle gracefully, and needing to rebuild your index afterward.
Depending on the size of your data that could take a while.

### Transitional

With a transitional approach, you temporarily have two Elasticsearch services.
Add a second Elasticsearch service with the new version a new name and give it a new relationship in `.platform.app.yaml`.
You can optionally run in that configuration for a while to allow your application to populate indexes in the new service as well.

Once you're ready to switch over, remove the old Elasticsearch service and relationship.
You may optionally have the new Elasticsearch service use the old relationship name if that's easier for your app to handle.
Your application is now using the new Elasticsearch service.

This approach has the benefit of never being without a working Elasticsearch instance.
On the downside, it requires two running Elasticsearch servers temporarily,
each of which consumes resources and needs adequate disk space.
Depending on the size of your data, that may be a lot of disk space.
