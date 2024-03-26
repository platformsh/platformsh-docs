---
title: "How to Deploy Quarkus on {{% vendor/name %}} with Elasticsearch"
sidebarTitle: "Elasticsearch"
weight: -110
layout: single
description: |
    Configure a Quarkus application with Elasticsearch.
---

Quarkus provides two ways of accessing Elasticsearch: via the lower level `RestClient` or via the `RestHighLevelClient`. To initialize Elasticsearch in your project's cluster so that it can be accessed by a Quarkus application, it is necessary to modify two files.

{{< note >}}
This guide only covers the *addition* of a service configuration to an existing Quarkus project already configured to deploy on {{% vendor/name %}}. Please see the [deployment guide](/guides/quarkus/deploy/_index.md) for more detailed instructions for setting up app containers and initial projects.
{{< /note >}}

## 1. Add the Elasticsearch service

In your [service configuration](../../add-services/_index.md), include Elasticsearch with a [valid supported version](../../add-services/elasticsearch.md):

{{< readFile file="registry/images/examples/full/elasticsearch.services.yaml" highlight="yaml" configFile="services" >}}

## 2. Add the Elasticsearch relationship

In your [app configuration](/create-apps/app-reference/single-runtime-image.md), use the service name `searchelastic` to grant the application access to Elasticsearch via a relationship:

{{< readFile file="registry/images/examples/full/elasticsearch.app.yaml" highlight="yaml" configFile="app" >}}

## 3. Export connection credentials to the environment

Connection credentials for Elasticsearch, like any service, are exposed to the application container through the `PLATFORM_RELATIONSHIPS` environment variable from the deploy hook onward. Since this variable is a base64 encoded JSON object of all of your project's services, you'll likely want a clean way to extract the information specific to Elasticsearch into it's own environment variables that can be used by Quarkus. On {{% vendor/name %}}, custom environment variables can be defined programmatically in a `.environment` file using `jq` to do just that:

```text
export ES_HOST=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".essearch[0].host")
export ES_PORT=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".essearch[0].port")
export QUARKUS_HIBERNATE_SEARCH_ELASTICSEARCH_HOSTS=${ES_HOST}:${ES_PORT}
export QUARKUS_HTTP_PORT=$PORT
export JAVA_OPTS="-Xmx$(jq .info.limits.memory /run/config.json)m -XX:+ExitOnOutOfMemoryError"
```

{{< note title="Tip" >}}
Environment variables names are following the conversion rules of [Eclipse MicroProfile](https://github.com/eclipse/microprofile-config/blob/master/spec/src/main/asciidoc/configsources.asciidoc#user-content-default-configsources).
{{< /note >}}

## 4. Connect to Elasticsearch

Commit that code and push. The Elasticsearch instance is ready to be connected from within the Quarkus application.
