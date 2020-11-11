---
title: "How to Deploy Quarkus on Platform.sh"
sidebarTitle: "Get started"
weight: -110
layout: single
toc: false
description: |
    Create a Platform.sh account, download a few tools, and prepare to deploy Quarkus.
---


Quarkus is, in its own words, a cloud-native, (Linux) container-first framework for writing Java applications. It has become popular lately because of its fast boot time and low RSS memory. In this series of articles about Quarkus, we'll discuss how to deploy a Quarkus application even faster to the cloud with Platform.sh.

Quarkus became so popular because it is light and straightforward to use. Quarkus has integration with several databases such as [PostgreSQL](configuration/services/postgresql.md), [MariaDB](configuration/services/mysql.md), [MySQL](configuration/services/mysql.md), [MongoDB](configuration/services/mongodb.md), [Redis](configuration/services/redis.md), [Elasticsearch](configuration/services/elasticsearch.md), etc. 
To Dependency injection, it provides a Quarkus DI based on CDI. As Java Developer, you can let the frameworks handle the Object life cycle, besides taking advantage of the inversion of control (IoC) programming principle.

{{< note title="Tip">}}
[Quarkus has a vast guide](https://quarkus.io/guides/), where you can take advantage and learn the complete resources from there.
{{< /note >}}
```



## Hello World Quarkus



Let's start with the basics, where we'll create a Quarkus application from scratch and then move it to Platform.sh. There two ways to make a Quarkus application:



1. [Maven Archetype](https://quarkus.io/guides/getting-started): where you can create your first project from a terminal using Maven. E.g.:

    ```
     mvn io.quarkus:quarkus-maven-plugin:1.9.2.Final:create \
         -DprojectGroupId=org.acme \
         -DprojectArtifactId=getting-started \
         -DclassName="org.acme.getting.started.GreetingResource" \
         -Dpath="/hello"
     ```

     

2. [The start code link](https://code.quarkus.io/): A Ui interface that helps you bootstrap your Quarkus application and discover its extension ecosystem.

As soon as you generate the application it will create an  `ExemploResource` with the Hello world message.

```java
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
@Path("/hello")
public class ExampleResource {
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return "Hello World From Platform.sh";
    }

}
```

{{< note title="Tip">}}
If you want to change the hello world message, please, don't forget to update the test as well.
{{< /note >}}

Quarkus requires Apache Maven 3.6.2 or higher to run the application, but even if your machine does not have the generated project brings a Maven Wrapper with the Maven version that it needs to run. So you can package and run this application from this [Maven Wrapper](https://www.baeldung.com/maven-wrapper).

```shell
 ./mvnw package
```

We've finished the application, and it is ready to run. Be prepared to see how fast this application starts.

```java
java -jar target/file.jar
```

## Configure Quarkus for Platform.sh

Congratulations, you have your first Quarkus application running locally. This topic will review the basics of what makes up a Platform.sh project, including its three principle configuration files and how to define them for Quarkus.

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

```she
export JAVA_MEMORY=-Xmx$(jq .info.limits.memory /run/config.json)m
export JAVA_OPTS="$JAVA_MEMORY -XX:+ExitOnOutOfMemoryError"
```

Thanks to the [Eclipse MicroProfile Configurations](https://github.com/eclipse/microprofile-config), it is possible to overwrite the configurations without impact the application itself. Therefore, you can have a local configuration in the properties file and then overwrite in the cloud with Platform.sh.

{{< note title="Tip">}}
To check the Garbage collector settings, please, check the [Java Performance tuning session.](languages/java/tuning.md)
{{< /note >}}


### Service configuration: `services.yaml`

The `services.yaml` file lists the pre-packaged services you need for your application to run. You pick the major version of the service, and Platform.sh updates the patch version periodically so that you always get the newest version when you deploy.

When your application needs a service, you'll need to append in this services file and then set the [relationship](configuration/app/relationships.md) attribute in the application container file. The attribute is safety reasons. By default, the access is revoked and needs to grand between application and services and between application and application (in the microservices age).

We'll explain the credential configuration to its respective page later.

### Requests configuration:`routes.yaml`

This file defines its application will be public and the URL. In the sample below, we'll expose an application with the name `app`. 

```yaml
"https://{default}/":
  type: upstream
  upstream: "app:http"

"https://www.{default}/":
  type: redirect
  to: "https://{default}/"
```

The application is now ready, so it’s time to move it to the cloud with Platform.sh using the [following steps](https://docs.platform.sh/gettingstarted/first-project.html):

- Create a new [free trial account](gettingstarted/introduction/template/create-project.md).
- Sign up with a new user and password, or login using a current GitHub, Bitbucket, or Google account. If you use a third-party login, you’ll be able to set a password for your Platform.sh account later.
- Select the region of the world where your site should live.
- Select the `Create empty project` option

{{< note title="Tip">}}

You have the option to either integrate to [GitHub](integrations/source/github.md), [GitLab](integrations/source/gitlab.md), or Platform.sh will provide to you. 

{{< /note >}}

Done! We have a simple and nice [Quarkus application ready to go to the cloud](https://github.com/platformsh-templates/quarkus).
