---
title: "How to Deploy Quarkus on Platform.sh with Elasticsearch"
sidebarTitle: "Elasticsearch"
weight: -110
layout: single
toc: false
description: |
    Configure a Quarkus application with Elasticsearch.
---

Quarkus provides two ways of accessing Elasticsearch: via the lower level `RestClient` or via the `RestHighLevelClient` we will call them the low level and the high level clients.

To move your Quarkus application with Panache Elasticsearch to Platform.sh, it needs to change two configurations files, if you compare it with [a Quarkus project from scratch](_index.md).

* The services to include Elasticsearch.

  ```yaml
  searchelastic:
    type: elasticsearch:7.2
    disk: 1024
  ```

* The application container file adds the relationship between the services to grant access between the application and the service.

```yaml
name: app
type: "java:11"
disk: 1024
hooks:
    build: ./mvnw package -DskipTests -Dquarkus.package.uber-jar=true

relationships:
    search: "searchelastic:elasticsearch"
web:
    commands:
        start: java -jar $JAVA_OPTS $CREDENTIAL -Dquarkus.http.port=$PORT target/file.jar
```

To simplify the application file, we'll use [Shell variables](https://docs.platform.sh/development/variables.html#shell-variables) int the  `.environment` file. That is the right choice because you don't need to change the application file, only the environment file.

```properties
export ES_HOST=`echo $PLATFORM_RELATIONSHIPS|base64 -d|json_pp|jq -r ".search[0].host"`
export ES_PORT=`echo $PLATFORM_RELATIONSHIPS|base64 -d|json_pp|jq -r ".search[0].port"`
export JAVA_OPTS="$JAVA_MEMORY -XX:+ExitOnOutOfMemoryError"
export CREDENTIAL="-Dquarkus.hibernate-search.elasticsearch.hosts=${ES_HOST}:${ES_PORT}"
```

Commit that code and push. The application is ready and connected to a Elasticsearch instance.