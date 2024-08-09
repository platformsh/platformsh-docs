---
title: "How to Deploy Micronaut on {{% vendor/name %}} with MongoDB"
sidebarTitle: "MongoDB"
weight: -110
layout: single
description: |
    Configure a Micronaut application with MongoDB.
---

To activate MongoDB and then have it accessed by the Micronaut application already in {{% vendor/name %}}, it is necessary to modify two files.

{{< note >}}
This guide only covers the *addition* of a MongoDB service configuration to an existing Micronaut project already configured to deploy on {{% vendor/name %}}. Please see the [deployment guide](/guides/micronaut/deploy/_index.md) for more detailed instructions for setting up app containers and initial projects.
{{< /note >}}

## 1. Add the MongoDB service

In your [service configuration](../../add-services/_index.md), include MongoDB with a [valid supported version](../../add-services/mongodb.md):

```yaml {configFile="services"}
dbmongo:
  type: mongodb:3.6
  disk: 512
```

## 2. Grant access to MongoDb through a relationship

In your [app configuration](/create-apps/app-reference/single-runtime-image.md), use the service name `dbmongo` to grant the application access to MongoDB via a relationship:

{{< readFile file="registry/images/examples/full/mongodb.app.yaml" highlight="yaml" configFile="app" >}}

## 3. Export connection credentials to the environment

Connection credentials for services are exposed to the application container through the `PLATFORM_RELATIONSHIPS` environment variable from the deploy hook onward. Since this variable is a base64 encoded JSON object of all of your project's services, you'll likely want a clean way to extract the information specific to the database into it's own environment variables that can be used by Micronaut. On {{% vendor/name %}}, custom environment variables can be defined programmatically in a `.environment` file using `jq` to do just that:

```text
export MONGO_PORT=`echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".mongodb[0].port"`
export MONGO_HOST=`echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".mongodb[0].host"`
export MONGO_PASSWORD=`echo $PLATFORM_RELATIONSHIPS |base64 --decode | jq -r ".mongodb[0].password"`
export MONGO_USER=`echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".mongodb[0].username"`
export MONGO_DATABASE=`echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".mongodb[0].path"`
export MONGO_URL=mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}
export JAVA_OPTS="-Xmx$(jq .info.limits.memory /run/config.json)m -XX:+ExitOnOutOfMemoryError"
```

{{< note title="Tip" >}}
Environment variable names are following the conversion rules of the [Micronaut Documentation](https://docs.micronaut.io/latest/guide/index.html).
{{< /note >}}

## 4. Connect to the service

Commit that code and push. The application is ready and connected to a MongoDB instance.
