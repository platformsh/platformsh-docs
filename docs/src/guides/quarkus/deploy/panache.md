---
title: "How to Deploy Quarkus on Platform.sh with Panache"
sidebarTitle: "Panache"
weight: -110
layout: single
toc: false
description: |
    Configure a Quarkus application with Panache.
---

Hibernate ORM is the de facto JPA implementation and offers you the full breadth of an Object Relational Mapper. It makes complex mappings possible, but it does not make simple and common mappings trivial. Hibernate ORM with Panache focuses on making your entities trivial and fun to write in Quarkus.

To activate Hibernate Panache and then have it accessed by the Quarkus application already in Platform.sh, it is necessary to modify two files. [There is also instruction in case it is necessary to move an application from scratch](_index.md).

* The first file is the services, where it will include a SQL database as a service.

  ```yaml
  db:
    type: postgresql:11
    disk: 512
  ```

* The second and last file is to grant access to the service to the application; otherwise, it won't access it.

```yaml
name: app
type: "java:11"
disk: 1024
hooks:
    build: ./mvnw package -DskipTests -Dquarkus.package.uber-jar=true
relationships:
    database: "db:postgresql"
web:
    commands:
        start: java -jar $JAVA_OPTS target/file.jar
```

To simplify the application file, there is [Shell variables](https://docs.platform.sh/development/variables.html#shell-variables) int the  `.environment` file. This way,  it does not need to change the application file, only the environment file.

```properties
export HOST=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].host"`
export DATABASE=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].path"`
export QUARKUS_DATASOURCE_PASSWORD=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].password"`
export QUARKUS_DATASOURCE_USERNAME=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].username"`
export QUARKUS_DATASOURCE_JDBC_URL=jdbc:postgresql://${HOST}/${DATABASE}
export QUARKUS_HTTP_PORT=$PORT
export JAVA_OPTS="-Xmx$(jq .info.limits.memory /run/config.json)m -XX:+ExitOnOutOfMemoryError"
```

{{< note title="Tip">}}
Environment variables names are following the conversion rules of [Eclipse MicroProfile](https://github.com/eclipse/microprofile-config/blob/master/spec/src/main/asciidoc/configsources.asciidoc#default-configsources)
{{< /note >}}

Commit that code and push. The specified cluster will now always point to the PostgreSQL or any SQL service that you wish.