---
title: Deploy Jakarta on {{% vendor/name %}}
sidebarTitle: Get started
weight: 5
---

[Eclipse MicroProfile](https://microprofile.io/) is a community dedicated to optimizing the Enterprise Java mission for microservice-based architectures. The goal is to define a microservices application platform that is portable across multiple runtimes. Currently, the leading players in this group are IBM, Red Hat, Tomitribe, Payara, the London Java Community (LJC), and SouJava.

Java Enterprise Edition (Java EE) is an umbrella that holds specifications and APIs with enterprise features, like distributed computing and web services. Widely used in Java, Java EE runs on reference runtimes that can be anything from microservices to application servers that handle transactions, security, scalability, concurrency, and management for the components it’s deploying. Now, Enterprise Java has been standardized under the Eclipse Foundation with the name [Jakarta EE](https://jakarta.ee/).

## Services

{{% config-reader %}}[Java configuration reader library](https://github.com/platformsh/config-reader-java){{% /config-reader%}}
Note that the Java configuration reader library is used in the following examples.

### MongoDB

You can use [Jakarta NoSQL](https://projects.eclipse.org/projects/ee4j.nosql)/[JNoSQL](https://projects.eclipse.org/projects/technology.jnosql) to use [MongoDB](../../add-services/mongodb.md) with your application by first determining the MongoDB client programmatically.

```java
import com.mongodb.MongoClient;
import jakarta.nosql.document.DocumentCollectionManager;
import jakarta.nosql.document.DocumentCollectionManagerFactory;
import org.jnosql.diana.mongodb.document.MongoDBDocumentConfiguration;
import sh.platform.config.Config;
import sh.platform.config.MongoDB;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Disposes;
import javax.enterprise.inject.Produces;

@ApplicationScoped
class DocumentManagerProducer {

    private DocumentCollectionManagerFactory managerFactory;

    private MongoDB mongoDB;

    @PostConstruct
    public void init() {
        Config config = new Config();
        this.mongoDB = config.getCredential("database", MongoDB::new);
        final MongoClient mongoClient = mongoDB.get();
        MongoDBDocumentConfiguration configuration = new MongoDBDocumentConfiguration();
        this.managerFactory = configuration.get(mongoClient);
    }

    @Produces
    public DocumentCollectionManager getManager() {
        return managerFactory.get(mongoDB.getDatabase());
    }

    public void destroy(@Disposes DocumentCollectionManager manager) {
        this.manager.close();
    }
}
```

### Apache Solr

You can use [Jakarta NoSQL](https://projects.eclipse.org/projects/ee4j.nosql)/[JNoSQL](https://projects.eclipse.org/projects/technology.jnosql) to use [Solr](../../add-services/solr.md) with your application by first determining the Solr client programmatically.

```java
import jakarta.nosql.document.DocumentCollectionManager;
import jakarta.nosql.document.DocumentCollectionManagerFactory;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.jnosql.diana.solr.document.SolrDocumentConfiguration;
import sh.platform.config.Config;
import sh.platform.config.Solr;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Disposes;
import javax.enterprise.inject.Produces;

@ApplicationScoped
class DocumentManagerProducer {

    private DocumentCollectionManagerFactory managerFactory;

    @PostConstruct
    public void init() {
        Config config = new Config();
        Solr solr = config.getCredential("database", Solr::new);
        final HttpSolrClient httpSolrClient = solr.get();
        SolrDocumentConfiguration configuration = new SolrDocumentConfiguration();
        this.managerFactory = configuration.get(httpSolrClient);
    }

    @Produces
    public DocumentCollectionManager getManager() {
        return managerFactory.get("collection");
    }

    public void destroy(@Disposes DocumentCollectionManager manager) {
        this.manager.close();
    }
}

```

### Elasticsearch

You can use [Jakarta NoSQL](https://projects.eclipse.org/projects/ee4j.nosql)/[JNoSQL](https://projects.eclipse.org/projects/technology.jnosql) to use [Elasticsearch](../../add-services/elasticsearch.md) with your application by first determining the Elasticsearch client programmatically.

```java
import jakarta.nosql.document.DocumentCollectionManager;
import jakarta.nosql.document.DocumentCollectionManagerFactory;
import org.elasticsearch.client.RestHighLevelClient;
import org.jnosql.diana.elasticsearch.document.ElasticsearchDocumentConfiguration;
import sh.platform.config.Config;
import sh.platform.config.Elasticsearch;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Disposes;
import javax.enterprise.inject.Produces;

@ApplicationScoped
class DocumentManagerProducer {

    private DocumentCollectionManagerFactory managerFactory;

    @PostConstruct
    public void init() {
        Config config = new Config();
        Elasticsearch elasticsearch = config.getCredential("database", Elasticsearch::new);
        final RestHighLevelClient client = elasticsearch.get();
        ElasticsearchDocumentConfiguration configuration = new ElasticsearchDocumentConfiguration();
        this.managerFactory = configuration.get(client);
    }

    @Produces
    public DocumentCollectionManager getManager() {
        return managerFactory.get("collection");
    }

    public void destroy(@Disposes DocumentCollectionManager manager) {
        this.manager.close();
    }
}
```

### Redis

You can use [Jakarta NoSQL](https://projects.eclipse.org/projects/ee4j.nosql)/[JNoSQL](https://projects.eclipse.org/projects/technology.jnosql) to use [Redis](../../add-services/redis.md) with your application by first determining the Redis client programmatically.

```java
import jakarta.nosql.keyvalue.BucketManager;
import org.jnosql.diana.redis.keyvalue.RedisBucketManagerFactory;
import org.jnosql.diana.redis.keyvalue.RedisConfiguration;
import redis.clients.jedis.JedisPool;
import sh.platform.config.Config;
import sh.platform.config.Redis;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Disposes;
import javax.enterprise.inject.Produces;

@ApplicationScoped
class BucketManagerProducer {

    private static final String BUCKET = "olympus";

    private RedisBucketManagerFactory managerFactory;

    @PostConstruct
    public void init() {
        Config config = new Config();
        Redis redis = config.getCredential("redis", Redis::new);
        final JedisPool jedisPool = redis.get();
        RedisConfiguration configuration = new RedisConfiguration();
        managerFactory = configuration.get(jedisPool);
    }

    @Produces
    public BucketManager getManager() {
        return managerFactory.getBucketManager(BUCKET);
    }

    public void destroy(@Disposes BucketManager manager) {
        manager.close();
    }

}
```

### MySQL

[MySQL](../../add-services/mysql/_index.md) is an open-source relational database technology, and Jakarta EE supports a robust integration with it: [JPA](https://projects.eclipse.org/projects/ee4j.jpa).

The first step is to choose the database that you would like to use in your project. Define the driver for [MySQL](https://mvnrepository.com/artifact/mysql/mysql-connector-java) and the Java dependencies. Then determine the DataSource client programmatically:

```java
import sh.platform.config.Config;
import sh.platform.config.JPA;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Disposes;
import javax.enterprise.inject.Produces;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

@ApplicationScoped
class EntityManagerConfiguration {

    private EntityManagerFactory entityManagerFactory;

    private EntityManager entityManager;

    @PostConstruct
    void setUp() {
        Config config = new Config();
        final JPA credential = config.getCredential("postgresql", JPA::new);
        entityManagerFactory = credential.getMySQL("jpa-example");
        this.entityManager = entityManagerFactory.createEntityManager();
    }

    @Produces
    @ApplicationScoped
    EntityManagerFactory getEntityManagerFactory() {
        return entityManagerFactory;
    }

    @Produces
    @ApplicationScoped
    EntityManager getEntityManager() {
        return entityManager;
    }

    void close(@Disposes EntityManagerFactory entityManagerFactory) {
        entityManagerFactory.close();
    }

    void close(@Disposes EntityManager entityManager) {
        entityManager.close();
    }

}
```

{{< note >}}
You can use the same MySQL driver for MariaDB as well if you wish to do so.
{{< /note >}}


### MariaDB

[MariaDB](../../add-services/mysql/_index.md) is an open-source relational database technology, and Jakarta EE supports a robust integration with it: [JPA](https://projects.eclipse.org/projects/ee4j.jpa).

The first step is to choose the database that you would like to use in your project. Define the driver for [MariaDB](https://mvnrepository.com/artifact/org.mariadb.jdbc/mariadb-java-client) and the Java dependencies. Then determine the DataSource client programmatically:

```java
import sh.platform.config.Config;
import sh.platform.config.JPA;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Disposes;
import javax.enterprise.inject.Produces;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

@ApplicationScoped
class EntityManagerConfiguration {

    private EntityManagerFactory entityManagerFactory;

    private EntityManager entityManager;

    @PostConstruct
    void setUp() {
        Config config = new Config();
        final JPA credential = config.getCredential("postgresql", JPA::new);
        entityManagerFactory = credential.getMariaDB("jpa-example");
        this.entityManager = entityManagerFactory.createEntityManager();
    }

    @Produces
    @ApplicationScoped
    EntityManagerFactory getEntityManagerFactory() {
        return entityManagerFactory;
    }

    @Produces
    @ApplicationScoped
    EntityManager getEntityManager() {
        return entityManager;
    }

    void close(@Disposes EntityManagerFactory entityManagerFactory) {
        entityManagerFactory.close();
    }

    void close(@Disposes EntityManager entityManager) {
        entityManager.close();
    }

}

```

### PostgreSQL

[PostgreSQL](../../add-services/postgresql.md) is an open-source relational database technology, and Jakarta EE supports a robust integration with it: [JPA](https://projects.eclipse.org/projects/ee4j.jpa).

The first step is to choose the database that you would like to use in your project. Define the driver for [PostgreSQL](https://mvnrepository.com/artifact/postgresql/postgresql) and the Java dependencies. Then determine the DataSource client programmatically:

```java
import sh.platform.config.Config;
import sh.platform.config.JPA;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Disposes;
import javax.enterprise.inject.Produces;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

@ApplicationScoped
class EntityManagerConfiguration {

    private EntityManagerFactory entityManagerFactory;

    private EntityManager entityManager;

    @PostConstruct
    void setUp() {
        Config config = new Config();
        final JPA credential = config.getCredential("postgresql", JPA::new);
        entityManagerFactory = credential.getPostgreSQL("jpa-example");
        entityManager = entityManagerFactory.createEntityManager();
    }

    @Produces
    @ApplicationScoped
    EntityManagerFactory getEntityManagerFactory() {
        return entityManagerFactory;
    }

    @Produces
    @ApplicationScoped
    EntityManager getEntityManager() {
        return entityManager;
    }

    void close(@Disposes EntityManagerFactory entityManagerFactory) {
        entityManagerFactory.close();
    }

    void close(@Disposes EntityManager entityManager) {
        entityManager.close();
    }

}
```

## Transaction

To any Eclipse MicroProfile or any non-JTA application is essential to point out, CDI doesn't provide transaction management implementation as part of its specs. Transaction management is left to be implemented by the programmer through the interceptors, such as the code below.

```java
import javax.annotation.Priority;
import javax.inject.Inject;
import javax.interceptor.AroundInvoke;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;
import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.transaction.Transactional;

@Transactional
@Interceptor
@Priority(Interceptor.Priority.APPLICATION)
public class TransactionInterceptor {

    @Inject
    private EntityManager manager;

    @AroundInvoke
    public Object manageTransaction(InvocationContext context) throws Exception {
        final EntityTransaction transaction = manager.getTransaction();
        transaction.begin();
        try {
            Object result = context.proceed();
            transaction.commit();
            return result;
        } catch (Exception exp) {
            transaction.rollback();
            throw exp;
        }
    }
}
```

To treat this issue, see the [Apache Delta Spike docs](https://deltaspike.apache.org/documentation/jpa.html#_extended_persistence_contexts).

## Templates

* [Apache TomEE](https://github.com/platformsh-templates/microprofile-tomee)
* [Thorntail](https://github.com/platformsh-templates/microprofile-thorntail)
* [Payara Micro](https://github.com/platformsh-templates/microprofile-payara)
* [KumuluzEE](https://github.com/platformsh-templates/microprofile-kumuluzee)
* [Helidon](https://github.com/platformsh-templates/microprofile-helidon)
* [Open Liberty](https://github.com/platformsh-templates/microprofile-openliberty)
* [Quarkus](https://github.com/platformsh-templates/quarkus)
* [Tomcat](https://github.com/platformsh-templates/tomcat)
* [WildFly](https://github.com/platformsh-templates/microprofile-wildfly/)