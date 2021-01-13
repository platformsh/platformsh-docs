---
title: "How to Deploy Micronaut on Platform.sh with Elasticsearch"
sidebarTitle: "Elasticsearch"
weight: -110
layout: single
description: |
    Configure a Micronaut application with Elasticsearch.
---

Micronaut provides two ways of accessing Elasticsearch: via the lower level `RestClient` or via the `RestHighLevelClient`. To initialize Elasticsearch in your project's cluster so that it can be accessed by a Micronaut application, it is necessary to modify two files. 

{{< note >}}
This guide only covers the *addition* of a service configuration to an existing Micronaut project already configured to deploy on Platform.sh. Please see the [deployment guide](/guides/micronaut/deploy/_index.md) for more detailed instructions for setting up app containers and initial projects. 
{{< /note >}}

## 1. Add the Elasticsearch service

In your `.platform/services.yaml` file, include Elasticsearch with a [valid supported version](/configuration/services/elasticsearch.md):

{{< readFile file="src/registry/images/examples/full/elasticsearch.services.yaml" highlight="yaml" >}}

## 2. Add the Elasticsearch relationship

In your `.platform.app.yaml` file, use the service name `searchelastic` to grant the application access to Elasticsearch via a relationship:

{{< readFile file="src/registry/images/examples/full/elasticsearch.app.yaml" highlight="yaml" >}}

## 3. Export connection credentials to the environment

Connection credentials for Elasticsearch, like any service, are exposed to the application container through the `PLATFORM_RELATIONSHIPS` environment variable from the deploy hook onward. Since this variable is a base64 encoded JSON object of all of your project's services, you'll likely want a clean way to extract the information specific to Elasticsearch into it's own environment variables that can be easily used by Micronaut. On Platform.sh, custom environment variables can be defined programmatically in a `.environment` file using `jq` to do just that:

```text
export ES_HOST=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".essearch[0].host")
export ES_PORT=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".essearch[0].port")
export ELASTICSEARCH_HTTPHOSTS="http://${ES_HOST}:${ES_PORT}"
export JAVA_OPTS="-Xmx$(jq .info.limits.memory /run/config.json)m -XX:+ExitOnOutOfMemoryError"
```

{{< note title="Tip" >}}
Environment variables names are following the conversion rules of the [Micronaut Documentation](https://docs.micronaut.io/latest/guide/index.html).
{{< /note >}}

## 4. Connect to Elasticsearch

Commit that code and push. The Elasticsearch instance is ready to be connected from within the Quarkus application.
