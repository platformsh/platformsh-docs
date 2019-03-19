# Java

Platform.sh supports building and deploying applications written in Java. It has built-in support for Maven, Ant and Gradle.

## Supported versions

We support both the Oracle JVM and the Open JDK but we strongly suggest you use the Open JDK as support for the Oracle JVM may be dropped in the future if they continue with their licensing shenanigans.

**Open JDK**

* Java 8
* Java 11
* Java 12
* Java 13 (tracking release-candidates, do not use in production)

To specify a java container, use the `type` property in your `.platform.app.yaml`.

```yaml
type: 'java:12'
```

**Oracle Java**

* Java 8

```yaml
type: 'oracle-java:8'
```

## Running Tomcat

You can find an example Tomcat based application using Maven here:  https://github.com/platformsh/platformsh-example-java-tomcat-maven and a Spring Boot one using gradle over here: https://github.com/platformsh/platformsh-example-java-spring-gradle

## Building and running the application
Note that there will still be an Nginx proxy server sitting in front of your application.  If desired, certain paths may be served directly by Nginx without hitting your application (for static files, primarily) or you may route all requests to the Java application unconditionally, as in the example above.
