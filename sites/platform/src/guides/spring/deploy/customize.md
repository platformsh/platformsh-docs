---
title: "Customize Spring for {{% vendor/name %}}"
sidebarTitle: "Customize"
weight: -90
description: |
    Add some helpful dependencies, and modify your Spring site to read from a {{% vendor/name %}} environment.
---

Now that your code contains all of the configuration to deploy on {{% vendor/name %}}, it's time to make your Spring site itself ready to run on a {{% vendor/name %}} environment. There are a number of additional steps that are either required or recommended, depending on how well you want to optimize your site.

## Install the Config Reader

{{% guides/config-reader-info lang="java" %}}

Below is an example of how to install the Config Reader for Java using Maven:

```xml
<dependency>
    <groupId>sh.platform</groupId>
    <artifactId>config</artifactId>
    <version>2.2.2</version>
</dependency>
```

and Gradle:

```txt
compile group: 'sh.platform', name: 'config', version: '2.2.2'
```

## `.environment`

The `{{< vendor/configfile "app" >}}` file in the [previous step](./configure.md#configure-apps-in-platformappyaml)
has been pulled directly from the [Spring template](https://github.com/platformsh-templates/spring-mvc-maven-mongodb/blob/master/.platform.app.yaml).
It is sufficient to deploy Spring on its own, but since [Spring Config](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config.typesafe-configuration-properties.relaxed-binding.environment-variables)
makes it possible to overwrite configurations without impacting the application itself,
you might elect to rely more heavily on environment variables in its place.

Consider this simplified `{{< vendor/configfile "app" >}}` file:

```yaml {configFile="app"}
name: myapp
type: "java:11"
disk: 1024
hooks:
  build: mvn clean package
web:
  commands:
    start: java -jar $JAVA_OPTS target/file.jar --server.port=$PORT
```

On {{% vendor/name %}}, we can set the environment variable `JAVA_OPTS` by committing a `.environment` file to the repository's root. {{% vendor/name %}} runs `source .environment` in the application root when a project starts, and when logging into the environment over SSH.
That gives you a place to do extra environment variable setup prior to the application running, including modifying the system `$PATH` and other shell level customizations.
It allows us to define `JAVA_OPTS` when running on {{% vendor/name %}}, but otherwise not be used during local development testing.

```shell
# .environment
export JAVA_OPTS="-Xmx$(jq .info.limits.memory /run/config.json)m -XX:+ExitOnOutOfMemoryError"
```

{{< note title="Tip">}}
To check the Garbage collector settings, please, check the [Java Performance tuning section.](/languages/java/tuning.md)
{{< /note >}}

{{< guide-buttons previous="Back" next="Deploy Spring" >}}
