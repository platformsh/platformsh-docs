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
applications:
  myapp:
    type: 'java:<VERSION>'

    hooks:
      build: [2]
    web:
      commands:
        start: [3]
```
1. [A Java version](/languages/java/_index.md#supported-versions), e,g.: `java:{{% latest "java" %}}`
2. [Hooks define what happens when building the application](../../create-apps/hooks/_index.md). This build process typically generates an executable file such as a uber-jar. For example, `mvn clean package`.
3. [The commands key defines the command to launch the application](/create-apps/app-reference/single-runtime-image.md#web-commands). For example,  `java -jar file.jar`.
4. In the start's command needs to receive the port where the application will execute thought the `PORT` environment. That's best when your app follows the port bind principle. For example, `java -jar jar --port=$PORT`.

{{< note >}}

Be aware that after the build, it creates a read-only system. You have the [mount option to create a writable folder](/create-apps/app-reference/single-runtime-image.md#mounts).

{{< /note >}}

### Route

```yaml {configFile="app"}
routes:
  "https://{default}/":
    type: upstream
    upstream: "myapp:http" [1]
  "https://www.{default}/":
    type: redirect
    to: "https://{default}/"

applications:
  myapp:
    type: 'java:<VERSION>'

    hooks:
      build: [2]
    web:
      commands:
        start: [3]
```
1. It defines the application will link in the route. For example,`"myapp:http"`.

{{< note version="1" >}}
Application instances have a limited amount of memory at build time, which has a maximum of 8 GB.
At runtime that limit depends on your plan and configuration.
A stateless application can be scaled horizontally to multiple application instances using Varnish in a [load balancer](https://community.platform.sh/t/how-to-configure-load-balancer-in-a-single-application/553) configuration.
{{< /note >}}

{{< note version="2" >}}
Application instances have a limited amount of memory at build time, which has a maximum of 8 GB.
At runtime that limit depends on [the resources you have defined for your application container](/manage-resources.md) using `{{% vendor/cli %}} resources:set`.
A stateless application can be scaled horizontally to multiple application instances with `{{% vendor/cli %}} resources:set` or by using Varnish in a [load balancer](https://community.platform.sh/t/how-to-configure-load-balancer-in-a-single-application/553) configuration.
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

While the table above shows examples for Platform.sh rather than for {{% vendor/name %}}, the same rules apply with only slight changes in configuration.

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

Service credentials are available within the [service environment variables](/development/variables/_index.md#service-environment-variables), or the [`{{< vendor/prefix >}}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< codetabs >}}
+++
title= Service environment variables
+++
Assuming the relationship `postgresql` is configured to grant access to a PostgreSQL service container, you can map the automatically generated environment variable (`POSTGRESQL_HOST`) to whatever your application expects to use:

```bash {location=".environment"}
export DB_HOST=$POSTGRESQL_HOST
```
This sets environment variables with the names your app needs,
and the values from [service environment variables](/development/variables/_index.md#service-environment-variables).

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

This variable is a base64-encoded JSON object with keys of the relationship name and values of arrays of relationship endpoint definitions.

{{% vendor/name %}} supports the [`jq` tool](https://stedolan.github.io/jq/), which allows to extract information from this JSON.

```bash {location=".environment"}
export DB_HOST=`echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".postgresql[0].host"`
```

This sets environment variables with names your app needs and the values from [`{{% vendor/prefix %}}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< /codetabs >}}

| Article                                                      | Source                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [Spring Data MongoDB](https://community.platform.sh/t/how-to-overwrite-spring-data-mongodb-variable-to-access-platform-sh-services/528) | [Source](https://github.com/platformsh-examples/java-overwrite-configuration/tree/master/spring-mongodb) |
| [Jakarta EE/MicroProfile Config](https://community.platform.sh/t/how-to-overwrite-configuration-to-jakarta-microprofile-to-access-platform-sh-services/520) | [Source](https://github.com/platformsh-examples/java-overwrite-configuration/tree/master/jakarta-nosql) |
| [Spring Data JPA](https://community.platform.sh/t/how-to-overwrite-spring-data-variable-to-access-platform-sh-services/518) | [Source](https://github.com/platformsh-examples/java-overwrite-configuration/tree/master/spring-jpa) |
| [Payara JPA](https://community.platform.sh/t/how-to-overwrite-variables-to-payara-jpa-access-platform-sh-sql-services/519) | [Source](https://github.com/platformsh-examples/java-overwrite-configuration/blob/master/payara/README.md) |

{{< note version="2" >}}
While the table above shows examples for Platform.sh rather than for {{% vendor/name %}}, the same rules apply with only slight changes in configuration.
{{< /note >}}

To reduce the number of lines in the application file and to make it cleaner,
you have the option to move the variable environment to another file: a [`.environment` file](../../development/variables/set-variables.md#set-variables-via-script).

**Example:**

You can obtain relationship information through the [service environment variables](/development/variables/_index.md#service-environment-variables) themselves,
or through the [`{{% vendor/prefix %}}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
Say your application has a relationship named ``postgresql`` to a database service named `postgresql`:

{{< codetabs >}}
+++
title= Service environment variables
+++

```bash {location=".environment"}
export DB_HOST=${POSTGRESQL_HOST}
export DB_PASSWORD=${POSTGRESQL_PASSWORD}
export DB_USER=${POSTGRESQL_USERNAME}
export DB_DATABASE=${POSTGRESQL_PATH}
export JDBC=jdbc:postgresql://${HOST}/${DATABASE}
export JAVA_MEMORY=-Xmx$(jq .info.limits.memory /run/config.json)m
export JAVA_OPTS="$JAVA_MEMORY -XX:+ExitOnOutOfMemoryError"
```

This sets environment variables with the names your app needs,
and the values from [service environment variables](/development/variables/_index.md#service-environment-variables).

<--->

+++
title= `{{% vendor/prefix %}}_RELATIONSHIPS` environment variable
+++
This `{{% vendor/prefix %}}_RELATIONSHIPS` variable is a base64-encoded JSON object with keys of the relationship name and values of arrays of relationship endpoint definitions.

{{% vendor/name %}} supports the [`jq` tool](https://stedolan.github.io/jq/), which allows to extract information from this JSON.

```bash {location=".environment"}
export DB_HOST=`echo ${{% vendor/prefix %}}_RELATIONSHIPS | base64 --decode | jq -r ".postgresql[0].host"`
export DB_PASSWORD=`echo ${{% vendor/prefix %}}_RELATIONSHIPS | base64 --decode | jq -r ".postgresql[0].password"`
export DB_USER=`echo ${{% vendor/prefix %}}_RELATIONSHIPS | base64 --decode | jq -r ".postgresql[0].username"`
export DB_DATABASE=`echo ${{% vendor/prefix %}}_RELATIONSHIPS | base64 --decode | jq -r ".postgresql[0].path"`
export JDBC=jdbc:postgresql://${HOST}/${DATABASE}
export JAVA_MEMORY=-Xmx$(jq .info.limits.memory /run/config.json)m
export JAVA_OPTS="$JAVA_MEMORY -XX:+ExitOnOutOfMemoryError"
```

This sets environment variables with names your app needs and the values from [`{{% vendor/prefix %}}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< /codetabs >}}

This `.environment` file can interact to each application file.

**Example:**

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'java:{{% latest "java" %}}'
    hooks:
      build: ./mvnw package -DskipTests -Dquarkus.package.uber-jar=true
    relationships:
      postgresql:
    web:
      commands:
        start: java -jar $JAVA_OPTS $CREDENTIAL -Dquarkus.http.port=$PORT jarfile.jar
```
