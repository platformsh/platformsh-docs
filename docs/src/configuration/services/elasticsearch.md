---
title: "Elasticsearch (Search service)"
weight: 1
description: |
  Elasticsearch is a distributed RESTful search engine built for the cloud.
sidebarTitle: "Elasticsearch"
---

{{< description >}}

See the [Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) for more information.

## Supported versions
<!--
To update the versions in this table, use docs/data/registry.json
-->
| **Grid** | **Dedicated** | **Dedicated Generation 3** |
|----------------------------------|---------------|---------------|
|  {{< image-versions image="elasticsearch" status="supported" environment="grid" >}} | {{< image-versions image="elasticsearch" status="supported" environment="dedicated" >}} | {{< image-versions image="elasticsearch" status="supported" environment="dedicated-gen-3" >}} |

Elasticsearch 7.9 is not available in the EU-1 and US-1 regions. Please consider [region migration](/guides/general/region-migration.md) if your project is in those regions.

{{% deprecated-versions %}}

| **Grid** | **Dedicated** | **Dedicated Generation 3** |
|----------------------------------|---------------|---------------|
|  {{< image-versions image="elasticsearch" status="deprecated" environment="grid" >}} | {{< image-versions image="elasticsearch" status="deprecated" environment="dedicated" >}} | {{< image-versions image="elasticsearch" status="deprecated" environment="dedicated-gen-3" >}} |

## Relationship

The format exposed in the `$PLATFORM_RELATIONSHIPS` [environment variable](/development/variables.md#platformsh-provided-variables):

{{< relationship "elasticsearch" >}}

## Usage example

{{% endpoint-description type="elasticsearch" %}}

Service definition:

{{< readFile file="src/registry/images/examples/full/elasticsearch.services.yaml" highlight="yaml" >}}

App configuration:

{{< readFile file="src/registry/images/examples/full/elasticsearch.app.yaml" highlight="yaml" >}}

{{% /endpoint-description %}}

{{< codetabs >}}

---
title=Java
file=static/files/fetch/examples/java/elasticsearch
highlight=java
---

<--->

---
title=Nodejs
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
When you create an index on Elasticsearch, you should not specify `number_of_shards` and `number_of_replicas` settings in your Elasticsearch API call. These values will be set automatically based on available resources.
{{< /note >}}

## Authentication

By default, Elasticsearch has no authentication.  No username or password is required to connect to it.

Starting with Elasticsearch 7.2 you may optionally enable HTTP Basic authentication.  To do so, include the following in your `services.yaml` configuration:

```yaml
search:
    type: elasticsearch:7.2
    disk: 2048
    configuration:
        authentication:
            enabled: true
```

That will enable mandatory HTTP Basic auth on all requests.  The credentials will be available in any relationships that point at that service, in the `username` and `password` properties, respectively.

This functionality is generally not required if Elasticsearch is not exposed on its own public HTTP route.  However, certain applications may require it, or it allows you to safely expose Elasticsearch directly to the web.  To do so, add a route to `routes.yaml` that has `search:elasticsearch` as its upstream (where `search` is whatever you named the service in `services.yaml`).  For example:

```yaml
"https://es.{default}":
    type: upstream
    upstream: search:elasticsearch
```

## Plugins

The Elasticsearch 2.4 and later services offer a number of plugins.  To enable them, list them under the `configuration.plugins` key in your `services.yaml` file, like so:

```yaml
search:
    type: "elasticsearch:7.2"
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

| Plugin                | Description                                                                               | 2.4 | 5.x | 6.x | 7.x |
|-----------------------|-------------------------------------------------------------------------------------------|-----|-----|-----|-----|
| analysis-icu          | Support ICU Unicode text analysis                                                         | *   | *   | *   | *   |
| analysis-nori         | Integrates Lucene nori analysis module into Elasticsearch                                 |     |     | *   | *   |
| analysis-kuromoji     | Japanese language support                                                                 | *   | *   | *   | *   |
| analysis-smartcn      | Smart Chinese Analysis Plugins                                                            | *   | *   | *   | *   |
| analysis-stempel      | Stempel Polish Analysis Plugin                                                            | *   | *   | *   | *   |
| analysis-phonetic     | Phonetic analysis                                                                         | *   | *   | *   | *   |
| analysis-ukrainian    | Ukrainian language support                                                                |     | *   | *   | *   |
| cloud-aws             | AWS Cloud plugin, allows storing indices on AWS S3                                        | *   |     |     |     |
| delete-by-query       | Support for deleting documents matching a given query                                     | *   |     |     |     |
| discovery-multicast   | Ability to form a cluster using TCP/IP multicast messages                                 | *   |     |     |     |
| ingest-attachment     | Extract file attachments in common formats (such as PPT, XLS, and PDF)                    |     | *   | *   | *   |
| ingest-user-agent     | Extracts details from the user agent string a browser sends with its web requests         |     | *   | *   |     |
| lang-javascript       | Javascript language plugin, allows the use of Javascript in Elasticsearch scripts         |     | *   |     |     |
| lang-python           | Python language plugin, allows the use of Python in Elasticsearch scripts                 | *   | *   |     |     |
| mapper-annotated-text | Adds support for text fields with markup used to inject annotation tokens into the index  |     |     | *   | *   |
| mapper-attachments    | Mapper attachments plugin for indexing common file types                                  | *   | *   |     |     |
| mapper-murmur3        | Murmur3 mapper plugin for computing hashes at index-time                                  | *   | *   | *   | *   |
| mapper-size           | Size mapper plugin, enables the `_size` meta field                                        | *   | *   | *   | *   |
| repository-s3         | Support for using S3 as a repository for Snapshot/Restore                                 |     | *   | *   | *   |
| transport-nio         | Support for NIO transport                                                                 |     |     |     | *   |

### Plugins removal

Removing plugins previously added in your `services.yaml` file will not automatically uninstall them from your Elasticsearch instances.  This is deliberate, as removing a plugin may result in data loss or corruption of existing data that relied on that plugin.  Removing a plugin will usually require reindexing.

If you wish to permanently remove a previously-enabled plugin, you will need to follow the "Upgrading" procedure below to create a new instance of Elasticsearch and migrate to it.  In most cases that is not necessary, however, as an unused plugin has no appreciable impact on the server.

## Upgrading

The Elasticsearch data format sometimes changes between versions in incompatible ways.  Elasticsearch does not include a data upgrade mechanism as it is expected that all indexes can be regenerated from stable data if needed.  To upgrade (or downgrade) Elasticsearch you will need to use a new service from scratch.

There are two ways of doing that.

### Destructive

In your `services.yaml` file, change the version of your Elasticsearch service *and* its name.  Then update the name in the `.platform.app.yaml` relationships block.

When you push that to Platform.sh, the old service will be deleted and a new one with the name name created, with no data.  You can then have your application reindex data as appropriate.

This approach is simple but has the downside of temporarily having an empty Elasticsearch instance, which your application may or may not handle gracefully, and needing to rebuild your index afterward.  Depending on the size of your data that could take a while.

### Transitional

For a transitional approach you will temporarily have two Elasticsearch services.  Add a second Elasticsearch service with the new version a new name and give it a new relationship in `.platform.app.yaml`.  You can optionally run in that configuration for a while to allow your application to populate indexes in the new service as well.

Once you're ready to cut over, remove the old Elasticsearch service and relationship.  You may optionally have the new Elasticsearch service use the old relationship name if that's easier for your application to handle.  Your application is now using the new Elasticsearch service.

This approach has the benefit of never being without a working Elasticsearch instance.  On the downside, it requires two running Elasticsearch servers temporarily, each of which will consume resources and need adequate disk space.  Depending on the size of your data that may be a lot of disk space.
