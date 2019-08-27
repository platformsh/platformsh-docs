# Hibernate

[Hibernate ORM](https://hibernate.org/) is an object-relational mapping tool for the Java programming language. It provides a framework for mapping an object-oriented domain model to a relational database. Hibernate handles object-relational impedance mismatch problems by replacing direct, persistent database accesses with high-level object handling functions.

We will use a [configuration reader library](https://github.com/platformsh/config-reader-java) for Java that will make integrating your application with Spring that much smoother, so be sure to check out the [latest version](https://mvnrepository.com/artifact/sh.platform/config) before getting started.

## Maven

```xml
<dependency>
    <groupId>sh.platform</groupId>
    <artifactId>config</artifactId>
    <version>version</version>
</dependency>
```

## Gradle

```
compile group: 'sh.platform', name: 'config', version: '2.2.1'
```

## Services

### MySQL, MariaDB and PostgreSQL

[MySQL, MariaDB](configuration/services/mysql.md), and [PostgreSQL](configuration/services/postgresql.md) are open-source relational database technologies.

The first step is to choose the Database that you would like to use in your project, then, Define set the driver to [MySQL](https://mvnrepository.com/artifact/mysql/mysql-connector-java), [MariaDB](https://mvnrepository.com/artifact/org.mariadb.jdbc/mariadb-java-client) and [PostgreSQL](https://mvnrepository.com/artifact/postgresql/postgresql), and the Java dependencies,  the next step is to determine the SessionFactory client programmatically:

#### MySQL

```java
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import sh.platform.config.Config;
import sh.platform.config.Hibernate;

public class HibernateApp {

    public static void main(String[] args) {
        Config config = new Config();
        Configuration configuration = new Configuration();
        configuration.addAnnotatedClass(Address.class);
        final Hibernate credential = config.getCredential("database", Hibernate::new);
        final SessionFactory sessionFactory = credential.getMySQL(configuration);
        try (Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();
            //...
            transaction.commit();
        }
    }
}
```

> If you wish you can use the same MySQL driver to MariaDB as well.


#### MariaDB

```java
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import sh.platform.config.Config;
import sh.platform.config.Hibernate;

public class HibernateApp {

    public static void main(String[] args) {
        Config config = new Config();
        Configuration configuration = new Configuration();
        configuration.addAnnotatedClass(Address.class);
        final Hibernate credential = config.getCredential("database", Hibernate::new);
        final SessionFactory sessionFactory = credential.getMariaDB(configuration);
        try (Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();
            //...
            transaction.commit();
        }
    }
}
```

#### PostgreSQL

```java
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import sh.platform.config.Config;
import sh.platform.config.Hibernate;

public class HibernateApp {

    public static void main(String[] args) {
        Config config = new Config();
        Configuration configuration = new Configuration();
        configuration.addAnnotatedClass(Address.class);
        final Hibernate credential = config.getCredential("database", Hibernate::new);
        final SessionFactory sessionFactory = credential.getPostgreSQL(configuration);
        try (Session session = sessionFactory.openSession()) {
            Transaction transaction = session.beginTransaction();
            //...
            transaction.commit();
        }
    }
}
```