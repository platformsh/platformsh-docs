---
title: "Java"
description: Java is a general-purpose programming language, and one of the most popular in the world today. Platform.sh supports Java runtimes that can be used with build management tools such as Gradle, Maven, and Ant.
layout: single
---

{{< description >}}

## Supported versions

### OpenJDK versions:

{{< image-versions image="java" status="supported" >}}

To specify a Java container, use the `type` property in your `.platform.app.yaml`.

{{< readFile file="src/registry/images/examples/full/java.app.yaml" highlight="yaml" >}}

## Support libraries

While it is possible to read the environment directly from your application, it is generally easier and more robust to use the [`platformsh/config-reader`](https://github.com/platformsh/config-reader-java) which handles decoding of service credential information for you.

## Support build automation

Platform.sh supports the most common project management tools in the Java ecosystem, including:

* [Gradle](https://gradle.org/)
* [Maven](https://maven.apache.org/)
* [Ant](https://ant.apache.org/)


## Accessing services

To access various [services](/configuration/services.html) with Java, see the following examples.  The individual service pages have more information on configuring each service.

{{< codetabs >}}

---
title=Elasticsearch
file=static/files/fetch/examples/java/elasticsearch
highlight=java
---

<--->

---
title=Kafka
file=static/files/fetch/examples/java/kafka
highlight=java
---

<--->

---
title=Memcached
file=static/files/fetch/examples/java/memcached
highlight=java
---

<--->

---
title=MongoDB
file=static/files/fetch/examples/java/mongodb
highlight=java
---

<--->

---
title=MySQL
file=static/files/fetch/examples/java/mysql
highlight=java
---

<--->

---
title=PostgreSQL
file=static/files/fetch/examples/java/postgresql
highlight=java
---

<--->

---
title=RabbitMQ
file=static/files/fetch/examples/java/rabbitmq
highlight=java
---

<--->

---
title=Redis
file=static/files/fetch/examples/java/redis
highlight=java
---

<--->

---
title=Solr
file=static/files/fetch/examples/java/solr
highlight=java
---

{{< /codetabs >}}

## Project templates

A number of project templates for major Java applications are available on GitHub. Not all of them are proactively maintained but all can be used as a starting point or reference for building your own website or web application.

{{< repolist lang="java" >}}
