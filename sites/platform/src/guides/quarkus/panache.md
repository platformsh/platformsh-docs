---
title: "How to Deploy Quarkus on {{% vendor/name %}} with Panache"
sidebarTitle: "Panache"
weight: -110
layout: single
description: |
    Configure a Quarkus application with Panache.
---

Hibernate ORM is a JPA implementation and offers you the full breadth of an Object Relational Mapper. It makes complex mappings possible, but they can sometimes be difficult. Hibernate ORM with Panache focuses on helping you write your entities in Quarkus.

To activate Hibernate Panache and then have it accessed by the Quarkus application already in {{% vendor/name %}}, it is necessary to modify two files.

{{< note >}}
This guide only covers the *addition* of a service configuration to an existing Quarkus project already configured to deploy on {{% vendor/name %}}. Please see the [deployment guide](./deploy/_index.md) for more detailed instructions for setting up app containers and initial projects.
{{< /note >}}

## 1. Add a SQL database service

In your [service configuration](../../add-services/_index.md), include a SQL database service. Make sure to visit the documentation for [that service](../../add-services/_index.md) to find a valid version. For PostgreSQL that would look like:

{{< readFile file="registry/images/examples/full/postgresql.services.yaml" highlight="yaml" configFile="services" >}}

## 2. Grant access to the service through a relationship

To access the new service, set a `relationship` in your [app configuration](/create-apps/app-reference/single-runtime-image.md#relationships).

{{< readFile file="registry/images/examples/full/postgresql.app.yaml" highlight="yaml" configFile="app" >}}

## 3. Export connection credentials to the environment

Connection credentials for services are exposed to the application container through the `PLATFORM_RELATIONSHIPS` environment variable from the deploy hook onward. Since this variable is a base64 encoded JSON object of all of your project's services, you'll likely want a clean way to extract the information specific to the database into it's own environment variables that can be used by Quarkus. On {{% vendor/name %}}, custom environment variables can be defined programmatically in a `.environment` file using `jq` to do just that:

```text
export HOST=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".postgresdatabase[0].host")
export DATABASE=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".postgresdatabase[0].path")
export QUARKUS_DATASOURCE_PASSWORD=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".postgresdatabase[0].password")
export QUARKUS_DATASOURCE_USERNAME=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".postgresdatabase[0].username")
export QUARKUS_DATASOURCE_JDBC_URL=jdbc:postgresql://${HOST}/${DATABASE}
export QUARKUS_HTTP_PORT=$PORT
export JAVA_OPTS="-Xmx$(jq .info.limits.memory /run/config.json)m -XX:+ExitOnOutOfMemoryError"
```

{{< note title="Tip" >}}
Environment variables names are following the conversion rules of [Eclipse MicroProfile](https://github.com/eclipse/microprofile-config/blob/master/spec/src/main/asciidoc/configsources.asciidoc#user-content-default-configsources).
{{< /note >}}

## 4. Connect to the service

Commit that code and push. The specified cluster will now always point to the PostgreSQL or any SQL service that you wish.
