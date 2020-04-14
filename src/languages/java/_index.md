---
title: "Java"
weight: 3
description: Java is a general-purpose programming language, and one of the most popular in the world today. Platform.sh supports Java runtimes that can be used with build management tools such as Gradle, Maven, and Ant.
 
layout: single
---

## Supported versions

### OpenJDK versions:

* 8
* 11
* 12
* 13

{{< image-versions image="java" status="supported" >}}

To specify a Java container, use the `type` property in your `.platform.app.yaml`.

{{< highlight yaml >}}
{{< readFile file="src/registry/images/examples/full/java.app.yaml" >}}
{{< /highlight >}}

## Support libraries

While it is possible to read the environment directly from your application, it is generally easier and more robust to use the [`platformsh/config-reader`](https://github.com/platformsh/config-reader-java) which handles decoding of service credential information for you.

## Support build automation

Platform.sh supports the most common project management tools in the Java ecosystem, including:

* [Gradle](https://gradle.org/)
* [Maven](https://maven.apache.org/)
* [Ant](https://ant.apache.org/)


## Accessing services

To access various [services](/configuration/services.html) with Java, see the following examples.  The individual service pages have more information on configuring each service.

{{< tabs "Elasticsearch" "Kafka" "Memcached" "MongoDB" "MySQL" "PostgreSQL" "RabbitMQ" "Redis" "Solr" >}}

{{< tab id="Elasticsearch" active="true" >}}
{{< highlight java >}}
{{< readFile file="static/files/fetch/examples/java/elasticsearch" >}}
{{< /highlight >}}
{{< /tab >}}

{{< tab id="Kafka" >}}
{{< highlight java >}}
{{< readFile file="static/files/fetch/examples/java/kafka" >}}
{{< /highlight >}}
{{< /tab >}}

{{< tab id="Memcached" >}}
{{< highlight java >}}
{{< readFile file="static/files/fetch/examples/java/memcached" >}}
{{< /highlight >}}
{{< /tab >}}

{{< tab id="MongoDB" >}}
{{< highlight java >}}
{{< readFile file="static/files/fetch/examples/java/mongodb" >}}
{{< /highlight >}}
{{< /tab >}}

{{< tab id="MySQL">}}
{{< highlight java >}}
{{< readFile file="static/files/fetch/examples/java/mysql" >}}
{{< /highlight >}}
{{< /tab >}}

{{< tab id="PostgreSQL" >}}
{{< highlight java >}}
{{< readFile file="static/files/fetch/examples/java/postgresql" >}}
{{< /highlight >}}
{{< /tab >}}

{{< tab id="RabbitMQ">}}
{{< highlight java >}}
{{< readFile file="static/files/fetch/examples/java/rabbitmq" >}}
{{< /highlight >}}
{{< /tab >}}

{{< tab id="Redis">}}
{{< highlight java >}}
{{< readFile file="static/files/fetch/examples/java/redis" >}}
{{< /highlight >}}
{{< /tab >}}

{{< tab id="Solr" >}}
{{< highlight java >}}
{{< readFile file="static/files/fetch/examples/java/solr" >}}
{{< /highlight >}}
{{< /tab >}}

{{< /tabs >}}

## Project templates

A number of project templates for major Java applications are available on GitHub. Not all of them are proactively maintained but all can be used as a starting point or reference for building your own website or web application.

{{< repolist lang="java" >}}
