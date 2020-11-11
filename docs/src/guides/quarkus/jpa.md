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

