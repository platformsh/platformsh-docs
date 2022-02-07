---
title: "How to Deploy Quarkus on Platform.sh with Panache"
sidebarTitle: "Panache"
weight: -110
layout: single
description: |
    Configure a Quarkus application with Panache.
---

Hibernate ORM is the de facto JPA implementation and offers you the full breadth of an Object Relational Mapper. It makes complex mappings possible, but it does not make simple and common mappings trivial. Hibernate ORM with Panache focuses on making your entities trivial and fun to write in Quarkus.

To activate Hibernate Panache and then have it accessed by the Quarkus application already in Platform.sh, it is necessary to modify two files. 

{{< note >}}
This guide only covers the *addition* of a service configuration to an existing Quarkus project already configured to deploy on Platform.sh. Please see the [deployment guide](/guides/quarkus/deploy/_index.md) for more detailed instructions for setting up app containers and initial projects. 
{{< /note >}}

## 1. Add a SQL database service

In your [service configuration](../../configuration/services/_index.md), include a SQL database service. Make sure to visit the documentation for [that service](/configuration/services/_index.md) to find a valid version. For PostgreSQL that would look like:

{{< readFile file="src/registry/images/examples/full/postgresql.services.yaml" highlight="yaml" location=".platform/services.yaml" >}}

## 2. Grant access to the service through a relationship

To access the new service, set a `relationship` in your [app configuration](../../configuration/app/app-reference.md#relationships).

{{< readFile file="src/registry/images/examples/full/postgresql.app.yaml" highlight="yaml" location=".platform.app.yaml" >}}

## 3. Export connection credentials to the environment

Connection credentials for services are exposed to the application container through the `PLATFORM_RELATIONSHIPS` environment variable from the deploy hook onward. Since this variable is a base64 encoded JSON object of all of your project's services, you'll likely want a clean way to extract the information specific to the databse into it's own environment variables that can be easily used by Quarkus. On Platform.sh, custom environment variables can be defined programmatically in a `.environment` file using `jq` to do just that:

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
Environment variables names are following the conversion rules of [Eclipse MicroProfile](https://github.com/eclipse/microprofile-config/blob/master/spec/src/main/asciidoc/configsources.asciidoc#default-configsources).
{{< /note >}}

## 4. Connect to the service

Commit that code and push. The specified cluster will now always point to the PostgreSQL or any SQL service that you wish.
