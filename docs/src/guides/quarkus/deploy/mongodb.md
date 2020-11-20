---
title: "How to Deploy Quarkus on Platform.sh with MongoDB"
sidebarTitle: "MongoDB"
weight: -110
layout: single
toc: false
description: |
    Configure a Quarkus application with MongoDB.
---

MongoDB with Panache provides active record style entities (and repositories) like you have in [Hibernate ORM with Panache](https://quarkus.io/guides/hibernate-orm-panache) and focuses on making your entities trivial and fun to write in Quarkus.

To activate MongoDB and then have it accessed by the Quarkus application already in Platform.sh, it is necessary to modify two files. [There is also instruction in case it is necessary to move an application from scratch](_index.md).

* The first file is the services, where it will include MongoDB as a service.

  ```yaml
  mongodb:
    type: mongodb:3.6
    disk: 1024
  ```

* The second and last file is to grant access to the service to the application; otherwise, it won't access it.

```yaml
name: app
type: "java:11"
disk: 1024
hooks:
    build: ./mvnw package -DskipTests -Dquarkus.package.uber-jar=true

relationships:
    mongodb: 'mongodb:mongodb'
web:
    commands:
        start: java -jar $JAVA_OPTS target/file.jar
```

To simplify the application file, there is [Shell variables](https://docs.platform.sh/development/variables.html#shell-variables) int the  `.environment` file. This way,  it does not need to change the application file, only the environment file.

```properties
export MONGO_PORT=`echo $PLATFORM_RELATIONSHIPS|base64 -d|json_pp|jq -r ".mongodb[0].port"`
export MONGO_HOST=`echo $PLATFORM_RELATIONSHIPS|base64 -d|json_pp|jq -r ".mongodb[0].host"`
export QUARKUS_MONGODB_HOSTS="${MONGO_HOST}:${MONGO_PORT}"
export QUARKUS_MONGODB_CREDENTIALS.PASSWORD=`echo $PLATFORM_RELATIONSHIPS|base64 -d|json_pp|jq -r ".mongodb[0].password"`
export QUARKUS_MONGODB_CREDENTIALS.USERNAME=`echo $PLATFORM_RELATIONSHIPS|base64 -d|json_pp|jq -r ".mongodb[0].username"`
export QUARKUS_MONGODB_DATABASE=`echo $PLATFORM_RELATIONSHIPS|base64 -d|json_pp|jq -r ".mongodb[0].path"`
export QUARKUS_HTTP_PORT=$PORT
export JAVA_OPTS="-Xmx$(jq .info.limits.memory /run/config.json)m -XX:+ExitOnOutOfMemoryError"
```

{{< note title="Tip">}}
Environment variables names are following the conversion rules of [Eclipse MicroProfile](https://github.com/eclipse/microprofile-config/blob/master/spec/src/main/asciidoc/configsources.asciidoc#default-configsources)
{{< /note >}}

Commit that code and push. The application is ready and connected to a MongoDB instance.

