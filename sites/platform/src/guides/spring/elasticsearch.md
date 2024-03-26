---
title: "How to Deploy Spring on {{% vendor/name %}} with Elasticsearch"
sidebarTitle: "Elasticsearch"
weight: -110
layout: single
description: |
    Configure a Spring application with Elasticsearch.
---

To activate Elasticsearch and then have it accessed by the Spring application already in {{% vendor/name %}}, it is necessary to modify two files.

{{< note >}}
This guide only covers the *addition* of a service configuration to an existing Spring project already configured to deploy on {{% vendor/name %}}. Please see the [deployment guide](/guides/spring/deploy/_index.md) for more detailed instructions for setting up app containers and initial projects.
{{< /note >}}

## 1. Add the Elasticsearch service

In your [service configuration](../../add-services/_index.md), include Elasticsearch with a [valid supported version](../../add-services/elasticsearch.md):

{{< readFile file="registry/images/examples/full/elasticsearch.services.yaml" highlight="yaml" configFile="services" >}}

## 2. Add the Elasticsearch relationship

In your [app configuration](/create-apps/app-reference/single-runtime-image.md), use the service name `searchelastic` to grant the application access to Elasticsearch via a relationship:

{{< readFile file="registry/images/examples/full/elasticsearch.app.yaml" highlight="yaml" configFile="app" >}}

## 3. Export connection credentials to the environment

Connection credentials for Elasticsearch, like any service, are exposed to the application container through the `PLATFORM_RELATIONSHIPS` environment variable from the deploy hook onward. Since this variable is a base64 encoded JSON object of all of your project's services, you'll likely want a clean way to extract the information specific to Elasticsearch into it's own environment variables that can be used by Spring. On {{% vendor/name %}}, custom environment variables can be defined programmatically in a `.environment` file using `jq` to do just that:

```text
export ES_HOST=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".essearch[0].host")
export ES_PORT=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".essearch[0].port")
export SPRING_ELASTICSEARCH_REST_URIS="http://${ES_HOST}:${ES_PORT}"
export JAVA_OPTS="-Xmx$(jq .info.limits.memory /run/config.json)m -XX:+ExitOnOutOfMemoryError"
```

{{< note title="Tip" >}}

{{% spring-common-props %}}

{{< /note >}}

## 4. Connect to Elasticsearch

Commit that code and push. The Elasticsearch instance is ready to be connected from within the Spring application.
