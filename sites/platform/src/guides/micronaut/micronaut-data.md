---
title: "How to Deploy Micronaut on {{% vendor/name %}} with Micronaut Data"
sidebarTitle: "Micronaut Data"
weight: -110
layout: single
description: |
    Configure a Micronaut application with Micronaut Data.
---

[Micronaut Data](https://micronaut-projects.github.io/micronaut-data/latest/guide/) is a database access toolkit that uses Ahead of Time (AoT) compilation to pre-compute queries for repository interfaces that are then executed by a thin, lightweight runtime layer.

{{< note >}}
This guide only covers the *addition* of a service configuration to an existing Micronaut project already configured to deploy on {{% vendor/name %}}. Please see the [deployment guide](/guides/micronaut/deploy/_index.md) for more detailed instructions for setting up app containers and initial projects.
{{< /note >}}

## 1. Add a SQL database service

In your [service configuration](../../add-services/_index.md), include a SQL database service. Make sure to visit the documentation for [that service](../../add-services/_index.md) to find a valid version. For PostgreSQL that would look like:

{{< readFile file="registry/images/examples/full/postgresql.services.yaml" highlight="yaml" configFile="services" >}}

## 2. Grant access to the service through a relationship

To access the new service, set a `relationship` in your [app configuration](/create-apps/app-reference/single-runtime-image.md#relationships).

{{< readFile file="registry/images/examples/full/postgresql.app.yaml" highlight="yaml" configFile="app" >}}

## 3. Export connection credentials to the environment

Connection credentials for services are exposed to the application container through the `PLATFORM_RELATIONSHIPS` environment variable from the deploy hook onward. Since this variable is a base64 encoded JSON object of all of your project's services, you'll likely want a clean way to extract the information specific to the database into it's own environment variables that can be used by Micronaut. On {{% vendor/name %}}, custom environment variables can be defined programmatically in a `.environment` file using `jq` to do just that:

```text
export JDBC_HOST=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].host"`
export JDBC_PORT=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].port"`
export DATABASE=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].path"`
export DATASOURCES_DEFAULT_PASSWORD=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].password"`
export DATASOURCES_DEFAULT_USERNAME=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].username"`
export DATASOURCES_DEFAULT_URL=jdbc:postgresql://${JDBC_HOST}:${JDBC_PORT}/${DATABASE}
export JAVA_OPTS="-Xmx$(jq .info.limits.memory /run/config.json)m -XX:+ExitOnOutOfMemoryError"
```

{{< note title="Tip" >}}
Environment variable names are following the conversion rules of the [Micronaut Documentation](https://docs.micronaut.io/latest/guide/index.html).
{{< /note >}}

## 4. Connect to the service

Commit that code and push. The specified cluster will now always point to the PostgreSQL or any SQL service that you wish.
