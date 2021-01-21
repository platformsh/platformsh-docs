---
title: "How to Deploy Spring on Platform.sh with Redis"
sidebarTitle: "Redis"
weight: -110
layout: single
description: |
    Configure a Spring application with Redis.
---

To activate Redis and then have it accessed by the Spring application already in Platform.sh, it is necessary to modify two files. 

{{< note >}}
This guide only covers the *addition* of a service configuration to an existing Spring project already configured to deploy on Platform.sh. Please see the [deployment guide](/guides/spring/deploy/_index.md) for more detailed instructions for setting up app containers and initial projects. 
{{< /note >}}

## 1. Add the Redis service

In your `.platform/services.yaml` file, include Persistent Redis with a [valid supported version](/configuration/services/redis.md#persistent-redis):

{{< readFile file="src/registry/images/examples/full/redis-persistent.services.yaml" highlight="yaml" >}}

## 2. Add the Redis relationship

In your `.platform.app.yaml` file, use the service name `searchelastic` to grant the application access to Elasticsearch via a relationship:

{{< readFile file="src/registry/images/examples/full/redis-persistent.app.yaml" highlight="yaml" >}}

## 3. Export connection credentials to the environment

Connection credentials for Redis, like any service, are exposed to the application container through the `PLATFORM_RELATIONSHIPS` environment variable from the deploy hook onward. Since this variable is a base64 encoded JSON object of all of your project's services, you'll likely want a clean way to extract the information specific to Elasticsearch into it's own environment variables that can be easily used by Spring. On Platform.sh, custom environment variables can be defined programmatically in a `.environment` file using `jq` to do just that:

```text
export SPRING_REDIS_HOST=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".redisdata[0].host")
export SPRING_REDIS_PORT=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".redisdata[0].port")
export JAVA_OPTS="-Xmx$(jq .info.limits.memory /run/config.json)m -XX:+ExitOnOutOfMemoryError"
```

{{< note title="Tip" >}}
Please check the [Spring Common Application properties](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html#common-application-properties) and the  [Binding from Environment Variables](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-external-config-relaxed-binding-from-environment-variables) to have access to more credentials options.
{{< /note >}}

## 4. Connect to Redis

Commit that code and push. The Redis instance is ready to be connected from within the Spring application.
