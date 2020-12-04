---
title: "How to Deploy Quarkus on Platform.sh with JPA"
sidebarTitle: "JPA"
weight: -110
layout: single
description: |
    Configure a Quarkus application with JPA.
---

Hibernate ORM is the de facto standard [JPA](https://jakarta.ee/specifications/persistence/) implementation. It offers you the full breadth of an Object Relational Mapper and it works well in Quarkus. To activate JPA and then have it accessed by the Quarkus application already in Platform.sh, it is necessary to modify two files.

{{< note >}}
This guide only covers the *addition* of a service configuration to an existing Quarkus project already configured to deploy on Platform.sh. Please see the [deployment guide](/guides/quarkus/deploy/_index.md) for more detailed instructions for setting up app containers and initial projects. 
{{< /note >}}

## 1. Add a SQL database service

In your `.platform/services.yaml` file, include a SQL database service. Make sure to visit the documentation for [that service](/configuration/services/_index.md) to find a valid version. For PostgreSQL that would look like:

{{< readFile file="src/registry/images/examples/full/postgresql.services.yaml" highlight="yaml" >}}

## 2. Grant access to the service through a relationship

Your `.platform.app.yaml` file will require a [`relationship`](/configuration/app/relationships.md) in order to have access to the new service. 

{{< readFile file="src/registry/images/examples/full/postgresql.app.yaml" highlight="yaml" >}}

## 3. Export connection credentials to the environment

Connection credentials for services are exposed to the application container through the `PLATFORM_RELATIONSHIPS` environment variable from the deploy hook onward. Since this variable is a base64 encoded JSON object of all of your project's services, you'll likely want a clean way to extract the information specific to the databse into it's own environment variables that can be easily used by Quarkus. On Platform.sh, custom environment variables can be defined programmatically in a `.environment` file using `jq` to do just that:

```text
export HOST=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".postgresdatabase[0].host"`
export DATABASE=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].path"`
export QUARKUS_DATASOURCE_PASSWORD=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".postgresdatabase[0].password"`
export QUARKUS_DATASOURCE_USERNAME=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".postgresdatabase[0].username"`
export QUARKUS_DATASOURCE_JDBC_URL=jdbc:postgresql://${HOST}/${DATABASE}
export QUARKUS_HTTP_PORT=$PORT
export JAVA_OPTS="-Xmx$(jq .info.limits.memory /run/config.json)m -XX:+ExitOnOutOfMemoryError"
```

{{< note title="Tip" >}}
Environment variables names are following the conversion rules of [Eclipse MicroProfile](https://github.com/eclipse/microprofile-config/blob/master/spec/src/main/asciidoc/configsources.asciidoc#default-configsources).
{{< /note >}}

## 4. Connect to the service

Commit that code and push. The specified cluster will now always point to the PostgreSQL or any SQL service that you wish.