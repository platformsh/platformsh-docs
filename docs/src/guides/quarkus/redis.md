---
title: "How to Deploy Quarkus on Platform.sh with Redis"
sidebarTitle: "Redis"
weight: -110
layout: single
toc: false
description: |
    Configure a Quarkus application with Redis.
---

To activate Redis and then have it accessed by the Quarkus application already in Platform.sh, it is necessary to modify two files. [There is also instruction in case it is necessary to move an application from scratch](_index.md).

* The first file is the services, where it will include Redis as a service.

  ```yaml
  data:
    type: redis-persistent:6.0
    disk: 256
  ```

* The second and last file is to grant access to the service to the application; otherwise, it won't access it.

```yaml
name: app
type: "java:11"
disk: 1024
hooks:
    build: ./mvnw package -DskipTests -Dquarkus.package.uber-jar=true

relationships:
    redis:  "data:redis"
web:
    commands:
        start: java -jar $JAVA_OPTS $CREDENTIAL -Dquarkus.http.port=$PORT target/file.jar
```

To simplify the application file, we'll use [Shell variables](https://docs.platform.sh/development/variables.html#shell-variables) int the  `.environment` file. That is the right choice because you don't need to change the application file, only the environment file.

```properties
export REDIS_HOST=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".redis[0].host"`
export REDIS_PORT=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".redis[0].port"`
export REDIS=redis://${REDIS_HOST}:${REDIS_PORT}
export JAVA_MEMORY=-Xmx$(jq .info.limits.memory /run/config.json)m
export JAVA_OPTS="$JAVA_MEMORY -XX:+ExitOnOutOfMemoryError"
export CREDENTIAL="-Dquarkus.redis.hosts=$REDIS"
```

Commit that code and push. The application is ready and connected to a Redis instance.

