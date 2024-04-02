---
title: "How to Deploy Quarkus on {{% vendor/name %}} with Redis"
sidebarTitle: "Redis"
weight: -110
layout: single
description: |
    Configure a Quarkus application with Redis.
---

To activate Redis and then have it accessed by the Quarkus application already in {{% vendor/name %}}, it is necessary to modify two files.

{{< note >}}
This guide only covers the *addition* of a service configuration to an existing Quarkus project already configured to deploy on {{% vendor/name %}}. Please see the [deployment guide](/guides/quarkus/deploy/_index.md) for more detailed instructions for setting up app containers and initial projects.
{{< /note >}}

## 1. Add the Redis service

In your [service configuration](../../add-services/_index.md), include Persistent Redis with a [valid supported version](../../add-services/redis.md#persistent-redis):

{{< readFile file="registry/images/examples/full/redis-persistent.services.yaml" highlight="yaml" configFile="services" >}}

## 2. Add the Redis relationship

In your [app configuration](/create-apps/app-reference/single-runtime-image.md), use the service name `searchelastic` to grant the application access to Elasticsearch via a relationship:

{{< readFile file="registry/images/examples/full/redis-persistent.app.yaml" highlight="yaml" configFile="app" >}}

## 3. Export connection credentials to the environment

Connection credentials for Redis, like any service, are exposed to the application container through the `PLATFORM_RELATIONSHIPS` environment variable from the deploy hook onward. Since this variable is a base64 encoded JSON object of all of your project's services, you'll likely want a clean way to extract the information specific to Elasticsearch into it's own environment variables that can be used by Quarkus. On {{% vendor/name %}}, custom environment variables can be defined programmatically in a `.environment` file using `jq` to do just that:

```text
export REDIS_HOST=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".redisdata[0].host")
export REDIS_PORT=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".redisdata[0].port")
export QUARKUS_REDIS_HOSTS=redis://${REDIS_HOST}:${REDIS_PORT}
export QUARKUS_HTTP_PORT=$PORT
export JAVA_OPTS="-Xmx$(jq .info.limits.memory /run/config.json)m -XX:+ExitOnOutOfMemoryError"
```

{{< note title="Tip" >}}
Environment variables names are following the conversion rules of [Eclipse MicroProfile](https://github.com/eclipse/microprofile-config/blob/master/spec/src/main/asciidoc/configsources.asciidoc#user-content-default-configsources).
{{< /note >}}

## 4. Connect to Redis

Commit that code and push. The Redis instance is ready to be connected from within the Quarkus application.
