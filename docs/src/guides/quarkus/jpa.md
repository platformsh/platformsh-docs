---
title: "How to Deploy Quarkus on Platform.sh with JPA"
sidebarTitle: "Get started"
weight: -110
layout: single
toc: false
description: |
    Configure a Quarkus application with JPA.
---



Hibernate ORM is the de facto standard [JPA](https://jakarta.ee/specifications/persistence/) implementation and offers you the full breadth of an Object Relational Mapper. It works beautifully in Quarkus.

To use JPA with Quarkus, essentially, you'll need:

- [A Quarkus Application](_index.md)

- a configuration settings in `application.properties`

- annotate your entities with `@Entity` and any other mapping annotation as usual

  E.g.:

  ```java
  import javax.persistence.Cacheable;
  import javax.persistence.Column;
  import javax.persistence.Entity;
  import javax.persistence.GeneratedValue;
  import javax.persistence.GenerationType;
  import javax.persistence.Id;
  import javax.persistence.NamedQuery;
  import javax.persistence.QueryHint;
  import javax.persistence.SequenceGenerator;
  import javax.persistence.Table;
  @Entity
  @Table(name = "animal")
  @NamedQuery(name = "Animal.findAll", query = "SELECT f FROM Animal f ORDER BY f.name", hints = @QueryHint(name = "org.hibernate.cacheable", value = "true"))
  @Cacheable
  public class Animal {
      @Id
      @SequenceGenerator(name = "animalSequence", sequenceName = "animal_id_seq", allocationSize = 1, initialValue = 10)
      @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "animalSequence")
      private Integer id;
  
      @Column(length = 40, unique = true)
      private String name;
     //getter and setter
  }
  ```

- Hibernate ORM extension dependency

- The JDBC driver dependency

Example dependencies using Maven with PostgreSQL JDBC driver:

```xml

<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-hibernate-orm</artifactId>
</dependency>
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-agroal</artifactId>
</dependency>
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-resteasy</artifactId>
</dependency>
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-resteasy-jsonb</artifactId>
</dependency>
<dependency>
    <groupId>io.quarkus</groupId>
    <artifactId>quarkus-jdbc-postgresql</artifactId>
</dependency>
```

{{< note title="Tip">}}
[To get more details about Quarkus configuration.](https://quarkus.io/guides/hibernate-orm)
{{< /note >}}

The application.properties` file will enable you to run locally where you can use [SSH tunneling](development/local/tethered.md#ssh-tunneling).  Don't worry about it on production once we'll overwrite those configurations later.

```properties
quarkus.datasource.db-kind=postgresql
quarkus.datasource.username=quarkus_test
quarkus.datasource.password=quarkus_test
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost/quarkus_test
quarkus.datasource.jdbc.max-size=8
quarkus.datasource.jdbc.min-size=2
quarkus.hibernate-orm.database.generation=update
quarkus.hibernate-orm.log.sql=true
```

## Configure Quarkus for Platform.sh

In this section, we'll move this JPA application to Platform.sh, if we compare with the [getting start](_index.md) application, we'll change two files:

* The services to include SQL database services, in this sample PostgreSQL.

  ```yaml
  db:
    type: postgresql:11
    disk: 512
  ```

* The application container file adds the relationship between the services to grant access between the application and the service.

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
        start: java -jar $JAVA_OPTS $CREDENTIAL -Dquarkus.http.port=$PORT target/file.jar
```

To simplify the application file, we'll use [Shell variables](https://docs.platform.sh/development/variables.html#shell-variables) int the  `.environment` file. That is the right choice because you don't need to change the application file, only the environment file.

```properties
export HOST=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].host"`
export PASSWORD=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].password"`
export USER=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].username"`
export DATABASE=`echo $PLATFORM_RELATIONSHIPS|base64 -d|jq -r ".database[0].path"`
export JDBC=jdbc:postgresql://${HOST}/${DATABASE}
export JAVA_MEMORY=-Xmx$(jq .info.limits.memory /run/config.json)m
export JAVA_OPTS="$JAVA_MEMORY -XX:+ExitOnOutOfMemoryError"
export CREDENTIAL="-Dquarkus.datasource.username=$USER -Dquarkus.datasource.password=$PASSWORD -Dquarkus.datasource.jdbc.url=$JDBC"
```

The application is now ready, so it’s time to move it to the cloud with Platform.sh using the [following steps](https://docs.platform.sh/gettingstarted/first-project.html):

- Create a new [free trial account](gettingstarted/introduction/template/create-project.md).
- Sign up with a new user and password, or login using a current GitHub, Bitbucket, or Google account. If you use a third-party login, you’ll be able to set a password for your Platform.sh account later.
- Select the region of the world where your site should live.
- Select the `Create empty project` option

{{< note title="Tip">}}

You have the option to either integrate to [GitHub](integrations/source/github.md), [GitLab](integrations/source/gitlab.md), or Platform.sh will provide to you. 

{{< /note >}}

Done! We have a simple and nice [Quarkus application ready to go to the cloud](https://github.com/platformsh-examples/quarkus/tree/master/jpa).