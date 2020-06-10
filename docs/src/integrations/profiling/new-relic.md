---
title: "New Relic"
description: |
  Platform.sh supports [New Relic APM](https://newrelic.com/products/application-monitoring) for profiling PHP and Java applications. These instructions do not apply to other languages.
---

{{< description >}}

## On a Grid plan

### 1. Get your license key

Sign up at [https://newrelic.com](https://newrelic.com/signup) and get your license key.

### 2. Add your license key

Add your New Relic license key as a project level variable:

```bash
platform variable:create --visible-build false php:newrelic.license --value '<your-new-relic-license-key>'
```

###  PHP

#### 3. Enable the New Relic extension

Enable the New Relic extension in your `.platform.app.yaml` as follows:

```bash
runtime:
    extensions:
        - newrelic
```

Push the changes to your Platform.sh environment to enable New Relic as follows:

```bash
git add .platform.app.yaml
git commit -m "Enable New Relic."
git push
```

That's it! You need to wait a little bit for your New Relic dashboard to be generated.



### Java



To set up new-relic in the Java project, we have two ways:

- Using the maven project
- Download the code through `application.app.yaml`.

#### Maven

This section explains how to configure Maven to download and unzip the `newrelic-java.zip` file, which contains all New Relic Java agent components.

To set up the application with New Relic, you have two options:

To set up the application with New Relic, you have two options:

1. Configuring and download from Maven
2. Downloading on your own

Configure your `pom.xml` to download `newrelic-java.zip`. For example:

```xml
<dependency>
     <groupId>com.newrelic.agent.java</groupId>
     <artifactId>newrelic-java</artifactId>
      <version>JAVA_AGENT_VERSION</version>
     <scope>provided</scope>
     <type>zip</type>
</dependency>
```



Replace `JAVA_AGENT_VERSION` with the [latest Java agent version 1](https://docs.newrelic.com/docs/agents/java-agent/getting-started/java-release-notes).

Unzip `newrelic-java.zip` by configuring `maven-dependency-plugin` in your `pom.xml`. For example:

```xml
   <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-dependency-plugin</artifactId>
        <version>3.1.1</version>
        <executions>
          <execution>
            <id>unpack-newrelic</id>
            <phase>package</phase>
            <goals>
              <goal>unpack-dependencies</goal>
            </goals>
            <configuration>
              <includeGroupIds>com.newrelic.agent.java</includeGroupIds>
              <includeArtifactIds>newrelic-java</includeArtifactIds>
              <excludes>**/newrelic.yml</excludes>
              <overWriteReleases>false</overWriteReleases>
              <overWriteSnapshots>false</overWriteSnapshots>
              <overWriteIfNewer>true</overWriteIfNewer>
              <outputDirectory>${project.build.directory}</outputDirectory>
            </configuration>
          </execution>
        </executions>
      </plugin>
```

The next step is to configure the [`.platform.app.yaml`](https://docs.platform.sh/configuration/app-containers.html) file to:

1. Set the agent in the JVM parameters
2. Overwrite the application file with the proper license key and application name. You can also do it using the [API](https://docs.platform.sh/development/variables.html) or [the web UI](https://docs.platform.sh/administration/web/configure-project.html#variables). Therefore this configuration will work outside the code very useful when the application is on a public repository.

```yaml
name: app
type: 'java:8'
disk: 1024
hooks:
    build: |
        mvn clean package
        rm -rf newrelic/
        mv target/newrelic/ newrelic/

mounts:
    'server/':
        source: local
        source_path: server_source

variables:
    env:
        NEW_RELIC_LICENSE_KEY: <LICENSE_KEY>
        NEW_RELIC_APP_NAME: <NAME_APPLICATION>

web:
    commands:
        start: |
             java -jar \
            -Xmx$(jq .info.limits.memory /run/config.json)m -XX:+ExitOnOutOfMemoryError \
            -javaagent:/app/newrelic/newrelic.jar //the other parameters here
            
```



To use this installation it is only required that you modify `.platform.app.yaml` , which will download and set the New Relic Java agent for you.



```yaml
name: app
type: 'java:8'
disk: 1024


variables:
    env:
        NEW_RELIC_URL: https://download.newrelic.com/newrelic/java-agent/newrelic-agent/current/newrelic-java.zip
        NEW_RELIC_LICENSE_KEY: <LICENSE_KEY>
        NEW_RELIC_APP_NAME: <NAME_APPLICATION>

hooks:
    build: |
      mvn clean package
      rm -rf newrelic
      curl -O $NEW_RELIC_URL
      unzip newrelic-java.zip


web:
    commands:
        start: |
            java -jar \
            -Xmx$(jq .info.limits.memory /run/config.json)m \
            -XX:+ExitOnOutOfMemoryError \
            -javaagent:/app/newrelic/newrelic.jar //the left of the commands here
```



## On a Dedicated cluster

Sign up at [https://newrelic.com](https://newrelic.com/signup) and get your license key.  Then open a support ticket and let us know what your key is.  Our support team will install it and let you know when it is complete.

## Troubleshoot

Additionally, you can check that your application is properly connected to New Relic by looking at the `/var/log/app.log` file:

```bash
platform log app

2017/04/19 14:00:16.706450 (93) Info: Reporting to: https://rpm.newrelic.com/accounts/xxx/applications/xxx
2017/04/19 14:00:16.706668 (93) Info: app 'xxx-master-xxx.app' connected with run id 'xxx'
```
