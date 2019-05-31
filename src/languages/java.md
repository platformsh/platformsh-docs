# Java

Java is a general-purpose programming language, and one of the most popular in the world today. Platform.sh supports Java runtimes that can be used with build management tools such as Gradle, Maven, and Ant.


## Supported versions

### OpenJDK versions:

* 8
* 11
* 12


To select a Java version, specify a `type` such as `java:11`:

```yaml
# .platform.app.yaml
type: "java:11"
```


## Support libraries

While it is possible to read the environment directly from your application, it is generally easier and more robust to use the [`platformsh/config-reader`](https://github.com/platformsh/config-reader-java) which handles decoding of service credential information for you.

## Support build automation

Platform.sh has support for software project management and comprehension tool in the Java World: 

* [Gradle](https://gradle.org/)
* [Maven](https://maven.apache.org/)
* [Ant](https://ant.apache.org/)



## Accessing services

To access various [services](/configuration/services.md) with Java, see the following examples.  The individual service pages have more information on configuring each service.



{% language name="MongoDB", type="java", url="https://examples.docs.platform.sh/java/mongodb" -%}

{% language name="MySQL", type="java", url="https://examples.docs.platform.sh/java/mysql" -%}

{% language name="PostgreSQL", type="java", url="https://examples.docs.platform.sh/java/postgresql" -%}

{% language name="Redis", type="java", url="https://examples.docs.platform.sh/java/redis" -%}


{%- endcodetabs %}



## Project templates

A number of project templates for major Java applications are available on GitHub. Not all of them are proactively maintained but all can be used as a starting point or reference for building your own website or web application.

### Applications

#### Maven Spring
* [Spring Boot MySQL](https://github.com/platformsh/template-spring-boot-maven-mysql)
* [Spring Boot MongoDB](https://github.com/platformsh/template-spring-mvc-maven-mongodb)