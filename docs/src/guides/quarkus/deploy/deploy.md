---
title: "How to Deploy Quarkus on Platform.sh"
sidebarTitle: "Get started"
weight: -110
layout: single
toc: false
description: |
    Create a Platform.sh account, download a few tools, and prepare to deploy Quarkus.
---


Quarkus is, in its own words, a cloud-native, (Linux) container-first framework for writing Java applications. It has become popular lately because of its fast boot time. In this series of articles about Quarkus, we'll discuss how to deploy a Quarkus application even faster to the cloud with Platform.sh.

{{< note >}}
[Quarkus has a vast guide](https://quarkus.io/guides/), where you can take advantage and learn the complete resources from there.
{{< /note >}}

This topic will review the basics of what makes up a Platform.sh project, including its three principle configuration files and how to define them for Quarkus.

To move your application to the cloud, briefly, you need three files: 

1. [A file to define application](configuration/app/_index.md)
2. [A file to define services](configuration/services/_index.md)
3. [A file to define routes](configuration/routes/_index.md)

### Application container: `.platform.app.yaml`

The application file is the file where you define how you'll package and run your Quarkus application.

```yaml
name: app
type: "java:11"
disk: 1024
hooks:
    build: ./mvnw package -DskipTests -Dquarkus.package.uber-jar=true
web:
    commands:
        start: java -jar $JAVA_OPTS $CREDENTIAL -Dquarkus.http.port=$PORT target/file.jar
```

Simply explaining the file line by line, we have the following settings.

1. `name`: The application name
2. `type` where you'll define the language, in this case, Java, and the version.
3. `disk`: the space in the disk that the application needs in megabytes.
4. `book.build`: the command to package the application
5. `web.commands`: The order to start the application, it is essential to overwrite the port with `-Dquarkus.http.port=$PORT`

To simplify the application file, we'll use [Shell variables](https://docs.platform.sh/development/variables.html#shell-variables) int the  `.environment` file. That is the right choice because you don't need to change the application file, only the environment file.

```shell
export JAVA_OPTS="-Xmx$(jq .info.limits.memory /run/config.json)m -XX:+ExitOnOutOfMemoryError"
```

Thanks to the [Eclipse MicroProfile Configurations](https://github.com/eclipse/microprofile-config), it is possible to overwrite the configurations without impact the application itself. Therefore, you can have a local configuration in the properties file and then overwrite in the cloud with Platform.sh.

{{< note title="Tip">}}
To check the Garbage collector settings, please, check the [Java Performance tuning session.](languages/java/tuning.md)
{{< /note >}}


### Service configuration: `services.yaml`

The `services.yaml` file lists the pre-packaged services you need for your application to run. You pick the major version of the service, and Platform.sh updates the patch version periodically so that you always get the newest version when you deploy.

When a application needs a service, it will need to append in this services file and then set the [relationship](configuration/app/relationships.md) attribute in the application container file. The attribute is safety reasons. By default, the access is revoked and needs to grand between application and services and between application and application (in the microservices age).

### Requests configuration:`routes.yaml`

This file defines its application will be public and the URL. In the sample below, it will expose an application with the name `app`. 

```yaml
"https://{default}/":
  type: upstream
  upstream: "app:http"

"https://www.{default}/":
  type: redirect
  to: "https://{default}/"
```
