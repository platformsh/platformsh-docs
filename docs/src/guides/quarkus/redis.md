---
title: "How to Deploy Quarkus on Platform.sh with Redis"
sidebarTitle: "Redis"
weight: -110
layout: single
toc: false
description: |
    Configure a Quarkus application with Redis.
---

To move your Quarkus application with Redis to Platform.sh, it needs to change two configurations files, if you compare it with [a Quarkus project from scratch](_index.md).

* The services to include Redis.

  ```yaml
  data:
    type: redis-persistent:6.0
    disk: 256
  ```

* The application container file adds the relationship between the services to grant access between the application and the service.

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

