---
title: "How to Deploy Spring on Platform.sh with MongoDB"
sidebarTitle: "MongoDB"
weight: -110
layout: single
description: |
    Configure a Spring application with MongoDB.
---

To activate MongoDB and then have it accessed by the Spring application already in Platform.sh, it is necessary to modify two files. 

{{< note >}}
This guide only covers the *addition* of a MongoDB service configuration to an existing Spring project already configured to deploy on Platform.sh. Please see the [deployment guide](/guides/spring/deploy/_index.md) for more detailed instructions for setting up app containers and initial projects. 
{{< /note >}}

## 1. Add the MongoDB service

In your `.platform/services.yaml` file, include MongoDB with a [valid supported version](/configuration/services/mongodb.md):

{{< readFile file="src/registry/images/examples/full/mongodb.services.yaml" highlight="yaml" >}}

## 2. Grant access to MongoDb through a relationship

In your `.platform.app.yaml` file, use the service name `dbmongo` to grant the application access to MongoDB via a relationship:

{{< readFile file="src/registry/images/examples/full/mongodb.app.yaml" highlight="yaml" >}}

## 3. Export connection credentials to the environment

Connection credentials for services are exposed to the application container through the `PLATFORM_RELATIONSHIPS` environment variable from the deploy hook onward. Since this variable is a base64 encoded JSON object of all of your project's services, you'll likely want a clean way to extract the information specific to the databse into it's own environment variables that can be easily used by Spring. On Platform.sh, custom environment variables can be defined programmatically in a `.environment` file using `jq` to do just that:

```text
export SPRING_DATA_MONGODB_USERNAME=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".dbmongo[0].username"`
export SPRING_DATA_MONGODB_PASSWORD=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".dbmongo[0].password"`
export SPRING_DATA_MONGODB_HOST=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".dbmongo[0].host"`
export SPRING_DATA_MONGODB_DATABASE=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".dbmongo[0].path"`
export JAVA_OPTS="-Xmx$(jq .info.limits.memory /run/config.json)m -XX:+ExitOnOutOfMemoryError"
```

{{< note title="Tip" >}}
Please check the [Spring Common Application properties](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html#common-application-properties) and the  [Binding from Environment Variables](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-external-config-relaxed-binding-from-environment-variables) to have access to more credentials options.
{{< /note >}}

## 4. Connect to the service

Commit that code and push. The application is ready and connected to a MongoDB instance.
