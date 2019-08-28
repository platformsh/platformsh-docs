# Spring

The [Spring Framework](https://spring.io/projects/spring-framework) provides a comprehensive programming and configuration model for modern Java-based enterprise applications - on any kind of deployment platform. Platform.sh is very flexible and allows you to use Spring Framework in several flavors such as [Spring MVC](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html) and [Spring Boot](https://spring.io/projects/spring-boot).

We will use a [configuration reader library](https://github.com/platformsh/config-reader-java) for Java that will make integrating your application with Spring that much smoother, so be sure to check out the [latest version](https://mvnrepository.com/artifact/sh.platform/config) before getting started.

## Services

### MongoDB

You can use [Spring Data MongoDB](https://spring.io/projects/spring-data-mongodb) to use [MongoDB](/configuration/services/mongodb.md) with your application by first determining the MongoDB client programmatically.

```java
import com.mongodb.MongoClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import sh.platform.config.Config;
import sh.platform.config.MongoDB;

@Configuration
public class MongoConfig extends AbstractMongoConfiguration {

    private Config config = new Config();

    @Override
    @Bean
    public MongoClient mongoClient() {
        MongoDB mongoDB = config.getCredential("database", MongoDB::new);
        return mongoDB.get();
    }

    @Override
    protected String getDatabaseName() {
        return config.getCredential("database", MongoDB::new).getDatabase();
    }
}
```

### Apache Solr

You can use [Spring Data Solr](https://spring.io/projects/spring-data-solr) to use [Solr](configuration/services/solr.md) with your application by first determining the MongoDB client programmatically.

```java
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.solr.core.SolrTemplate;
import sh.platform.config.Config;
import sh.platform.config.Solr;

@Configuration
public class SolrConfig {

    @Bean
    public HttpSolrClient elasticsearchTemplate() {
        Config config = new Config();
        final Solr credential = config.getCredential("solr", Solr::new);
        final HttpSolrClient httpSolrClient = credential.get();
        String url = httpSolrClient.getBaseURL();
        httpSolrClient.setBaseURL(url.substring(0, url.lastIndexOf('/')));
        return httpSolrClient;
    }

    @Bean
    public SolrTemplate solrTemplate(HttpSolrClient client) {
        return new SolrTemplate(client);
    }
}

```

### Redis

You can use [Spring Data Redis](https://spring.io/projects/spring-data-redis) to use [Redis](configuration/services/redis.md) with your application by first determining the MongoDB client programmatically.

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericToStringSerializer;

@Configuration
public class RedisConfig {


    @Bean
    JedisConnectionFactory jedisConnectionFactory() {
        Config config = new Config();
        RedisSpring redis = config.getCredential("redis", RedisSpring::new);
        return redis.get();
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        final RedisTemplate<String, Object> template = new RedisTemplate<String, Object>();
        template.setConnectionFactory(jedisConnectionFactory());
        template.setValueSerializer(new GenericToStringSerializer<Object>(Object.class));
        return template;
    }

}
```

### MySQL, MariaDB and PostgreSQL

[MySQL, MariaDB](configuration/services/mysql.md), and [PostgreSQL](configuration/services/postgresql.md) are open-source relational database technologies. Spring has robust integration with this technology: [Spring Data JPA](https://spring.io/projects/spring-data-jpa).
  
The first step is to choose the Database that you would like to use in your project, then, Define set the driver to [MySQL](https://mvnrepository.com/artifact/mysql/mysql-connector-java), [MariaDB](https://mvnrepository.com/artifact/org.mariadb.jdbc/mariadb-java-client) and [PostgreSQL](https://mvnrepository.com/artifact/postgresql/postgresql), and the Java dependencies,  the next step is to determine the DataSource client programmatically:

#### MySQL

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import sh.platform.config.Config;
import sh.platform.config.MySQL;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Bean(name = "dataSource")
    public DataSource getDataSource() {
        Config config = new Config();
        MySQL database = config.getCredential("database", MySQL::new);
        return database.get();
    }
}
```

> If you wish you can use the same MySQL driver to MariaDB as well.


#### MariaDB

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import sh.platform.config.Config;
import sh.platform.config.MariaDB;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Bean(name = "dataSource")
    public DataSource getDataSource() {
        Config config = new Config();
        MariaDB database = config.getCredential("database", MariaDB::new);
        return database.get();
    }
}
```


#### PostgreSQL

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import sh.platform.config.Config;
import sh.platform.config.PostgreSQL;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Bean(name = "dataSource")
    public DataSource getDataSource() {
        Config config = new Config();
        PostgreSQL database = config.getCredential("database", PostgreSQL::new);
        return database.get();
    }
}
```

### RabbitMQ

You can use [Spring JMS](https://spring.io/guides/gs/messaging-jms/) to use [RabbitMQ](configuration/services/rabbitmq.md) with your application by first determining the RabbitMQ client programmatically.

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.config.JmsListenerContainerFactory;

@Configuration
@EnableJms
public class JMSConfig {

    @Bean
    public JmsListenerContainerFactory jmsListenerContainerFactory() {
        Config config = new Config();
        final RabbitMQSpring rabbitMQ = config.getCredential("rabbitmq", RabbitMQSpring::new);
        final JmsListenerContainerFactory factory = rabbitMQ.get();
        return factory;
    }
}
```
