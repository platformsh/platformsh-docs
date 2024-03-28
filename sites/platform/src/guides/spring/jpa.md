---
title: "How to Deploy Spring on {{% vendor/name %}} with JPA"
sidebarTitle: "JPA"
weight: -110
layout: single
description: |
    Configure a Spring application with JPA.
---

To activate JPA and then have it accessed by the Spring application already configured for {{% vendor/name %}}, it is necessary to modify two files.

{{< note >}}
This guide only covers the *addition* of a service configuration to an existing Spring project already configured to deploy on {{% vendor/name %}}. Please see the [deployment guide](/guides/spring/deploy/_index.md) for more detailed instructions for setting up app containers and initial projects.
{{< /note >}}

## 1. Add a SQL database service

In your [service configuration](../../add-services/_index.md), include a SQL database service with a [valid supported version](../../add-services/_index.md) to find a valid version. For PostgreSQL that would look like:

{{< readFile file="registry/images/examples/full/postgresql.services.yaml" highlight="yaml" configFile="services" >}}

## 2. Grant access to the service through a relationship

To access the new service, set a `relationship` in your [app configuration](/create-apps/app-reference/single-runtime-image.md#relationships).

{{< readFile file="registry/images/examples/full/postgresql.app.yaml" highlight="yaml" configFile="app" >}}

## 3. Export connection credentials to the environment

Connection credentials for services are exposed to the application container through the `PLATFORM_RELATIONSHIPS` environment variable from the deploy hook onward. Since this variable is a base64 encoded JSON object of all of your project's services, you'll likely want a clean way to extract the information specific to the database into it's own environment variables that can be used by Spring. On {{% vendor/name %}}, custom environment variables can be defined programmatically in a `.environment` file using `jq` to do just that:

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

{{% spring-common-props %}}

{{< /note >}}

## 4. Connect to the service

Commit that code and push.
The specified cluster now always points to the PostgreSQL or any SQL service that you wish.
