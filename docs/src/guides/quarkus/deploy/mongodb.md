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
        start: java -jar $JAVA_OPTS $CREDENTIAL -Dquarkus.http.port=$PORT target/file.jar
```

To simplify the application file, we'll use [Shell variables](https://docs.platform.sh/development/variables.html#shell-variables) int the  `.environment` file. That is the right choice because you don't need to change the application file, only the environment file.

```properties
export MONGO_PORT=`echo $PLATFORM_RELATIONSHIPS|base64 -d|json_pp|jq -r ".mongodb[0].port"`
export MONGO_HOST=`echo $PLATFORM_RELATIONSHIPS|base64 -d|json_pp|jq -r ".mongodb[0].host"`
export MONGO_ADDRESS="${MONGO_HOST}:${MONGO_PORT}"
export MONGO_PASSWORD=`echo $PLATFORM_RELATIONSHIPS|base64 -d|json_pp|jq -r ".mongodb[0].password"`
export MONGO_USER=`echo $PLATFORM_RELATIONSHIPS|base64 -d|json_pp|jq -r ".mongodb[0].username"`
export MONGO_DATABASE=`echo $PLATFORM_RELATIONSHIPS|base64 -d|json_pp|jq -r ".mongodb[0].path"`
export JAVA_MEMORY=-Xmx$(jq .info.limits.memory /run/config.json)m
export JAVA_OPTS="$JAVA_MEMORY -XX:+ExitOnOutOfMemoryError"
export CREDENTIAL="-Dquarkus.mongodb.hosts=$MONGO_ADDRESS -Dquarkus.mongodb.credentials.username=$MONGO_USER -Dquarkus.mongodb.credentials.password=$MONGO_PASSWORD -Dquarkus.mongodb.database=$MONGO_DATABASE"
```

Commit that code and push. The application is ready and connected to a MongoDB instance.