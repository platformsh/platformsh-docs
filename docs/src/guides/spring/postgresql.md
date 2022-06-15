---
title: Configure Spring with PostgreSQL
sidebarTitle: PostgreSQL
weight: -110
description: Configure a Spring application with PostgreSQL.
---

[PostgreSQL](../../add-services/postgresql.md) is an open-source relational database technology.
Spring has a robust integration with this technology: [Spring Data JPA](https://spring.io/projects/spring-data-jpa).

The first step is to choose the database that you would like to use in your project.
Define the driver for [PostgreSQL](https://mvnrepository.com/artifact/postgresql/postgresql) and the Java dependencies.
Then determine the DataSource client using the [Java configuration reader library](https://github.com/platformsh/config-reader-java).

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
