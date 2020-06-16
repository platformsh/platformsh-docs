---
title: "Moving a Java application to Platform.sh"
weight: 2
sidebarTitle: "Moving to Platform.sh"
---



It is common to have a Java application that wants to migrate to Platform.sh. It has support to several styles of Java application such as monolith, microservices, stateful, and stateless.



## Minimum Requirement



To run a Java application at Platform.sh you must check: 



* [A supported Java version](https://docs.platform.sh/languages/java.html#supported-versions)
* [A build management](https://docs.platform.sh/languages/java.html#support-build-automation)
  * [Gradle](https://docs.gradle.org/current/userguide/gradle_wrapper.html)
  * [Maven](https://maven.apache.org/) 
  * [Maven Wrapper](https://www.baeldung.com/maven-wrapper)
  * [Ant](https://ant.apache.org/)
* A Git Repository:
  * [GitHub](https://docs.platform.sh/integrations/source/github.html)
  * [BitBucket](https://docs.platform.sh/integrations/source/bitbucket.html)
  * [GitLab](https://docs.platform.sh/integrations/source/gitlab.html)
  * The default Git repository provided by Platform.sh

{{< note >}}
A container application cannot be bigger than **8 GB**, checkout, [tunning](https://docs.platform.sh/languages/java/tuning.html) to more details.
{{< /note >}}

## Monolith/Single Application

To start a Java application, you need to understand the Platform.sh [structure](https://docs.platform.sh/overview/structure.html), as mimimium it requests two [YAML files](https://docs.platform.sh/configuration/yaml.html): 

1. [Application](https://docs.platform.sh/configuration/app.html)
2. [Route](https://docs.platform.sh/configuration/routes.html)

### Application

```yaml
name: app
type: "java:<version>" 1
disk: 1024
hooks:
    build: 2
web:
    commands:
        start: 3
```

1. [A Java version](https://docs.platform.sh/languages/java.html#supported-versions), e,g.: `java:11`
2. [The build defines what happens when building the application](https://docs.platform.sh/configuration/app/build.html#build), This build process might generate an executable file such as a uber-jar e.g.: `mvn clean package`
3. [The commands key defines the command to launch the application](https://docs.platform.sh/configuration/app/web.html#commands). E.g.:  `java -jar file.jar`
4. In the start's command needs to receive the port where the application will execute thought the `PORT` environment. That is trivial if your application follows the port bind principle. E.g.: `java -jar jar --port=$PORT`

### Route

```yaml
"https://{default}/":
  type: upstream
  upstream: 1
"https://www.{default}/":
  type: redirect
  to: "https://{default}/"
```

1. It defines the application will link in the route, e.g.: `"app:http"`

{{< note >}}

Be aware that the container has a maximum memory if the application is stateless to increase a more powerful computer, there is the strategy to use a [load balancer](https://community.platform.sh/t/how-to-configure-load-balancer-in-a-single-application/553).

Be aware that after the build, it creates a read-only system. You have the [mount option to create a writable folder](https://docs.platform.sh/configuration/app/storage.html#mounts).

{{< /note >}}

## Microservices

You have the option to use several languages in microservices. If you're using Java there are several options to aggregate these services into a microservices:

* [Maven Modules](https://maven.apache.org/guides/mini/guide-multiple-modules.html)
* [Gradle Multi-project](https://guides.gradle.org/creating-multi-project-builds/)
* [Git submodules](https://docs.platform.sh/development/submodules.html)

[Platform.sh supports multiple applications](https://docs.platform.sh/configuration/app/multi-app.html) and there are two options:

* [One application YAML file to each application](https://docs.platform.sh/configuration/app.html)
* [Aggregate all applications in a single file with applications.yaml](https://docs.platform.sh/configuration/app/multi-app.html#applicationsyaml)

| Article                                                      | Content                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [Microservices in the cloud, part two](https://platform.sh/blog/2019/microservices-in-the-cloud-part-two/) | [Source](https://github.com/EventosJEspanol/latin-america-micro-profile) |
| [Microservices in the cloud, part one](https://platform.sh/blog/2019/microservices-in-the-cloud-part-one/) | [Source](https://github.com/EventosJEspanol/latin-america-micro-profile) |
| [Multiple Applications](https://community.platform.sh/t/multiple-applications-tomcat/468) | [Source](https://github.com/platformsh-examples/tomcat-multi-app) |
| [Configure multi-applications with applications.yaml](https://community.platform.sh/t/how-to-configure-multi-applications-with-applications-yaml/552) | [Source](https://github.com/platformsh-examples/tomcat-multi-app-applications) |

{{< note >}}

As a single application, you have the option to set load balancer to some or [all applications in the project cluster](https://community.platform.sh/t/how-to-configure-load-balancer-in-a-multiple-applications/554).

{{< /note >}}

## Access to services included at Platform.sh

[Unlike other PaaS services, Platform.sh is batteries included, which means that you don’t need to subscribe to an external service to get a cache or a search engine](https://docs.platform.sh/configuration/services.html). However, you can use a database or any services such as a transition process, just be aware of the [firewall](https://docs.platform.sh/configuration/app/firewall.html). 

When applications need to access a service, it is important to activate the [Relationships tag](https://docs.platform.sh/configuration/app/relationships.html), because. by default an application may not talk to any other container within a project it includes others projects as a microservices architecture.

After activating the container application to access other services or another application container, the next step is to connect your app to those services. There are several ways to do that, we'll explain the main ones.

### Overwrite

If you are using some frameworks that follow the [Twelve-Factor App](https://12factor.net/), mainly the [third term](https://12factor.net/config) such as Spring, Eclipse MicroProfile Config, Quarkus, Micronauts, and so on, that is easy because you can overwrite the configuration on the application file without add any dependency.

The services information are on the as **PLATFORM_RELATIONSHIPS** [environment that will exist only on a runtime](https://docs.platform.sh/development/variables.html) that is A base64-encoded JSON object whose keys are the relationship name and the values are arrays of relationship endpoint definitions. 

Platform.sh has support to [jq](https://stedolan.github.io/jq/) that allows to extract information from this JSON.

```shell
export HOST=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].host"`
```

| Article                                                      | Source                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [Spring Data MongoDB](https://community.platform.sh/t/how-to-overwrite-spring-data-mongodb-variable-to-access-platform-sh-services/528) | [Source](https://github.com/platformsh-examples/java-overwrite-configuration/tree/master/spring-mongodb) |
| [Jakarta EE/MicroProfile Config](https://community.platform.sh/t/how-to-overwrite-configuration-to-jakarta-microprofile-to-access-platform-sh-services/520) | [Source](https://github.com/platformsh-examples/java-overwrite-configuration/tree/master/jakarta-nosql) |
| [Spring Data JPA](https://community.platform.sh/t/how-to-overwrite-spring-data-variable-to-access-platform-sh-services/518) | [Source](https://github.com/platformsh-examples/java-overwrite-configuration/tree/master/spring-jpa) |
| [Payara JPA](https://community.platform.sh/t/how-to-overwrite-variables-to-payara-jpa-access-platform-sh-sql-services/519) | [Source](https://github.com/platformsh-examples/java-overwrite-configuration/blob/master/payara/README.md) |

Several variables might pollute the application files if you wish there is the `.environment` [file as part of your application](https://docs.platform.sh/development/variables.html?#shell-variables). 

E.g.:

```shell
export HOST=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].host"`
export PASSWORD=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].password"`
export USER=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].username"`
export DATABASE=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].path"`
export JDBC=jdbc:postgresql://${HOST}/${DATABASE}
export JAVA_MEMORY=-Xmx$(jq .info.limits.memory /run/config.json)m
export JAVA_OPTS="$JAVA_MEMORY -XX:+ExitOnOutOfMemoryError"
```

This `.environment` can interact to each application file. E.g.: 

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
        start: java -jar $JAVA_OPTS $CREDENTIAL -Dquarkus.http.port=$PORT jarfile.jar

```



### Using Java Config Reader

If your frameworks do not support the possibility to overwrite configurations, there is [Platform.sh Config Reader](https://github.com/platformsh/config-reader-java).This library provides a streamlined and easy to use way to interact with a Platform.sh environment. It offers utility methods to access routes  and relationships more cleanly than reading the raw environment  variables yourself. [Check the maven dependency](https://mvnrepository.com/artifact/sh.platform/config).

```java
import Config;

Config config = new Config();
MySQL database = config.getCredential("database", MySQL::new);
DataSource dataSource = database.get();
```
