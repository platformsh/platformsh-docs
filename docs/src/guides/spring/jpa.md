---
title: "How to Deploy Spring on Platform.sh with JPA"
sidebarTitle: "JPA"
weight: -110
layout: single
description: |
    Configure a Spring application with JPA.
---

To activate JPA and then have it accessed by the Spring application already configured for Platform.sh, it is necessary to modify two files.

{{< note >}}
This guide only covers the *addition* of a service configuration to an existing Spring project already configured to deploy on Platform.sh. Please see the [deployment guide](/guides/spring/deploy/_index.md) for more detailed instructions for setting up app containers and initial projects. 
{{< /note >}}

## 1. Add a SQL database service

In your [service configuration](../../configuration/services/_index.md), include a SQL database service with a [valid supported version](../../configuration/services/_index.md) to find a valid version. For PostgreSQL that would look like:

{{< readFile file="src/registry/images/examples/full/postgresql.services.yaml" highlight="yaml" location=".platform/services.yaml" >}}

## 2. Grant access to the service through a relationship

To access the new service, set a `relationship` in your [app configuration](../../configuration/app/app-reference.md#relationships).

{{< readFile file="src/registry/images/examples/full/postgresql.app.yaml" highlight="yaml" location=".platform.app.yaml" >}}

## 3. Export connection credentials to the environment

Connection credentials for services are exposed to the application container through the `PLATFORM_RELATIONSHIPS` environment variable from the deploy hook onward. Since this variable is a base64 encoded JSON object of all of your project's services, you'll likely want a clean way to extract the information specific to the databse into it's own environment variables that can be easily used by Spring. On Platform.sh, custom environment variables can be defined programmatically in a `.environment` file using `jq` to do just that:

```text
export DB_PORT=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".postgresdatabase[0].port"`
export HOST=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".postgresdatabase[0].host"`
export DATABASE=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".postgresdatabase[0].path"`
export SPRING_DATASOURCE_URL="jdbc:mysql://${HOST}:${DB_PORT}/${DATABASE}"
export SPRING_DATASOURCE_USERNAME=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".postgresdatabase[0].username"`
export SPRING_DATASOURCE_PASSWORD=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".postgresdatabase[0].password"`
export JAVA_OPTS="-Xmx$(jq .info.limits.memory /run/config.json)m -XX:+ExitOnOutOfMemoryError"
```

{{< note title="Tip" >}}
Please check the [Spring Common Application properties](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html#common-application-properties) and the  [Binding from Environment Variables](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-external-config-relaxed-binding-from-environment-variables) to have access to more credentials options.
{{< /note >}}

## 4. Connect to the service

Commit that code and push. The specified cluster will now always point to the PostgreSQL or any SQL service that you wish.