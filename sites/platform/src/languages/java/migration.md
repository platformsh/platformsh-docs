---
title: "Moving a Java application to {{% vendor/name %}}"
weight: 2
sidebarTitle: "Moving to {{% vendor/name %}}"
---

{{% composable/disclaimer %}}

It is common to have a Java application that you want to migrate to {{% vendor/name %}}.
{{% vendor/name %}} supports several styles of Java application, such as monolith, microservices, stateful, and stateless.

## Minimum Requirement

To run a Java application at {{% vendor/name %}} you need:

* [A supported Java version](/languages/java/_index.md#supported-versions)
* [A build management tool](/languages/java/_index.md#support-build-automation)
  * [Gradle](https://docs.gradle.org/current/userguide/gradle_wrapper.html)
  * [Maven](https://maven.apache.org/)
  * [Maven Wrapper](https://www.baeldung.com/maven-wrapper)
  * [Ant](https://ant.apache.org/)
* A Git Repository:
  * [GitHub](/integrations/source/github.md)
  * [BitBucket](/integrations/source/bitbucket.md)
  * [GitLab](/integrations/source/gitlab.md)
  * The default Git repository provided by {{% vendor/name %}}

{{< note >}}
A container application can't be bigger than **8 GB** of memory.
For more details, see [tuning](./tuning.md).
{{< /note >}}

## Monolith/Single Application

To start a Java application, you need to understand the [{{% vendor/name %}} structure](/learn/overview/structure.md).
You will need to configure your [application](../../create-apps/_index.md), [routes](../../define-routes/_index.md),
and [services](../../add-services/_index.md).

### Application

```yaml {configFile="app"}
name: myapp
type: 'java:<VERSION>' [1]
disk: 1024
hooks:
  build: [2]
web:
  commands:
    start: [3]
```
1. [A Java version](/languages/java/_index.md#supported-versions), e,g.: `java:{{% latest "java" %}}`
2. [Hooks define what happens when building the application](../../create-apps/hooks/_index.md). This build process typically generates an executable file such as a uber-jar e.g.: `mvn clean package`
3. [The commands key defines the command to launch the application](/create-apps/app-reference/single-runtime-image.md#web-commands). E.g.:  `java -jar file.jar`
4. In the start's command needs to receive the port where the application will execute thought the `PORT` environment. That's best when your app follows the port bind principle. E.g.: `java -jar jar --port=$PORT`

{{< note >}}

Be aware that after the build, it creates a read-only system. You have the [mount option to create a writable folder](/create-apps/app-reference/single-runtime-image.md#mounts).

{{< /note >}}

### Route

```yaml {configFile="routes"}
"https://{default}/":
  type: upstream
  upstream: "myapp:http" [1]
"https://www.{default}/":
  type: redirect
  to: "https://{default}/"
```
1. It defines the application will link in the route, e.g.: `"myapp:http"`

{{< note >}}
Application instances have a limited amount of memory at build time, which has a maximum of 8 GB.
At runtime that limit depends on your plan and configuration.
A stateless application can be scaled horizontally to multiple application instances using Varnish in a [load balancer](https://community.platform.sh/t/how-to-configure-load-balancer-in-a-single-application/553) configuration.
{{< /note >}}

## Microservices

You have the option to use several languages in microservices. If you're using Java there are several options to aggregate these services into a microservices:

* [Maven Modules](https://maven.apache.org/guides/mini/guide-multiple-modules.html)
* [Gradle Multi-project](https://guides.gradle.org/creating-multi-project-builds/)
* [Git submodules](/development/submodules.md)

[{{% vendor/name %}} supports multiple applications](../../create-apps/multi-app/_index.md) and there are two options:

* One application YAML file to each application
* Aggregate all applications in a single file with an `{{< vendor/configfile "apps" >}}` file

| Article                                                      | Content                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [Microservices in the cloud, part two](https://platform.sh/blog/2019/microservices-in-the-cloud-part-two/) | [Source](https://github.com/EventosJEspanol/latin-america-micro-profile) |
| [Microservices in the cloud, part one](https://platform.sh/blog/2019/microservices-in-the-cloud-part-one/) | [Source](https://github.com/EventosJEspanol/latin-america-micro-profile) |
| [Multiple Applications](https://community.platform.sh/t/multiple-applications-tomcat/468) | [Source](https://github.com/platformsh-examples/tomcat-multi-app) |
| [Configure multi-applications with `{{< vendor/configfile "apps" >}}`](https://community.platform.sh/t/how-to-configure-multi-applications-with-applications-yaml/552) | [Source](https://github.com/platformsh-examples/tomcat-multi-app-applications) |

{{< note >}}
You can load balance to some or [all applications in the project cluster](https://community.platform.sh/t/how-to-configure-load-balancer-in-a-multiple-applications/554).
{{< /note >}}

## Access to managed services

{{% vendor/name %}} provides [managed services](/add-services/_index.md) such as databases, cache and search engines.
However, you can use a database or any services such as a transition process, just be aware of the [firewall](/create-apps/app-reference/single-runtime-image.md#firewall).

When applications need to access a service, it is important to include the [`relationships` key](/create-apps/app-reference/single-runtime-image.md#relationships).
By default an application may not talk to any other container without a `relationship` explicitly allowing access.

To connect to a service from your deployed application, you need to pass the relationships information into your application's configuration.
The way to do so varies with the application.
The most common mechanisms are listed below.

### Overwrite

If you are using a framework that follows the [Twelve-Factor App](https://12factor.net/) methodology, particularly the [third point](https://12factor.net/config), you can configure the application directly from environment variables.
Examples of such frameworks include Spring, Eclipse MicroProfile Config, Quarkus, and Micronauts.

Service credentials are available within the [**PLATFORM_RELATIONSHIPS** environment variable](../../development/variables/use-variables.md#use-provided-variables).
This variable is a base64-encoded JSON object with keys of the relationship name and values of arrays of relationship endpoint definitions.

{{% vendor/name %}} supports the [`jq` tool](https://stedolan.github.io/jq/), which allows to extract information from this JSON.

```shell
export DB_HOST=`echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".postgresql[0].host"`
```

| Article                                                      | Source                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [Spring Data MongoDB](https://community.platform.sh/t/how-to-overwrite-spring-data-mongodb-variable-to-access-platform-sh-services/528) | [Source](https://github.com/platformsh-examples/java-overwrite-configuration/tree/master/spring-mongodb) |
| [Jakarta EE/MicroProfile Config](https://community.platform.sh/t/how-to-overwrite-configuration-to-jakarta-microprofile-to-access-platform-sh-services/520) | [Source](https://github.com/platformsh-examples/java-overwrite-configuration/tree/master/jakarta-nosql) |
| [Spring Data JPA](https://community.platform.sh/t/how-to-overwrite-spring-data-variable-to-access-platform-sh-services/518) | [Source](https://github.com/platformsh-examples/java-overwrite-configuration/tree/master/spring-jpa) |
| [Payara JPA](https://community.platform.sh/t/how-to-overwrite-variables-to-payara-jpa-access-platform-sh-sql-services/519) | [Source](https://github.com/platformsh-examples/java-overwrite-configuration/blob/master/payara/README.md) |

To reduce the number of lines in the application file and to make it cleaner,
you have the option to move the variable environment to another file: a [`.environment` file](../../development/variables/set-variables.md#set-variables-via-script).

E.g.:

```shell
export DB_HOST=`echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".postgresql[0].host"`
export DB_PASSWORD=`echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".postgresql[0].password"`
export DB_USER=`echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".postgresql[0].username"`
export DB_DATABASE=`echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".postgresql[0].path"`
export JDBC=jdbc:postgresql://${HOST}/${DATABASE}
export JAVA_MEMORY=-Xmx$(jq .info.limits.memory /run/config.json)m
export JAVA_OPTS="$JAVA_MEMORY -XX:+ExitOnOutOfMemoryError"
```

This `.environment` can interact to each application file. E.g.:

```yaml {configFile="app"}
name: myapp
type: "java:11"
disk: 1024
hooks:
  build: ./mvnw package -DskipTests -Dquarkus.package.uber-jar=true
relationships:
  postgresql:
web:
  commands:
    start: java -jar $JAVA_OPTS $CREDENTIAL -Dquarkus.http.port=$PORT jarfile.jar
```
### Using Java Config Reader

If your framework doesn't support configuration via environment variables, use the [Config Reader](../../development/variables/use-variables.md#access-variables-in-your-app).
This library provides a streamlined way to interact with a {{% vendor/name %}} environment. It offers utility methods to access routes and relationships more cleanly than reading the raw environment variables yourself. [See the maven dependency](https://mvnrepository.com/artifact/sh.platform/config).

```java
import Config;

Config config = new Config();
MySQL database = config.getCredential("postgresql", MySQL::new);
DataSource dataSource = database.get();
```

