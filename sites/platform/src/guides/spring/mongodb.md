---
title: "How to Deploy Spring on {{% vendor/name %}} with MongoDB"
sidebarTitle: "MongoDB"
weight: -110
layout: single
description: |
    Configure a Spring application with MongoDB.
---

To activate MongoDB and then have it accessed by the Spring application already in {{% vendor/name %}}, it is necessary to modify two files.

{{< note >}}
This guide only covers the *addition* of a MongoDB service configuration to an existing Spring project already configured to deploy on {{% vendor/name %}}. Please see the [deployment guide](/guides/spring/deploy/_index.md) for more detailed instructions for setting up app containers and initial projects.
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

Connection credentials for services are exposed to the application container through the `PLATFORM_RELATIONSHIPS` environment variable from the deploy hook onward. Since this variable is a base64 encoded JSON object of all of your project's services, you'll likely want a clean way to extract the information specific to the database into it's own environment variables that can be used by Spring. On {{% vendor/name %}}, custom environment variables can be defined programmatically in a `.environment` file using `jq` to do just that:

```text
export SPRING_DATA_MONGODB_USERNAME=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".dbmongo[0].username"`
export SPRING_DATA_MONGODB_PASSWORD=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".dbmongo[0].password"`
export SPRING_DATA_MONGODB_HOST=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".dbmongo[0].host"`
export SPRING_DATA_MONGODB_DATABASE=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".dbmongo[0].path"`
export JAVA_OPTS="-Xmx$(jq .info.limits.memory /run/config.json)m -XX:+ExitOnOutOfMemoryError"
```

{{< note title="Tip" >}}

{{% spring-common-props %}}

{{< /note >}}

## 4. Connect to the service

Commit that code and push. The application is ready and connected to a MongoDB instance.

## Use Spring Data for MongoDB

You can use [Spring Data MongoDB](https://spring.io/projects/spring-data-mongodb) to use MongoDB with your app.
First, determine the MongoDB client using the [Java configuration reader library](https://github.com/platformsh/config-reader-java).

```java
import com.mongodb.MongoClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import sh.platform.config.Config;
import sh.platform.config.MongoDB;

@Configuration
public class MongoConfig extends AbstractMongoConfiguration {

    private Config config = new Config();

    @Override
    @Bean
    public MongoClient mongoClient() {
        MongoDB mongoDB = config.getCredential("database", MongoDB::new);
        return mongoDB.get();
    }

    @Override
    protected String getDatabaseName() {
        return config.getCredential("database", MongoDB::new).getDatabase();
    }
}
```
