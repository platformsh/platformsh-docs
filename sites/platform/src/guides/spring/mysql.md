---
title: Configure Spring with MariaDB/MySQL
sidebarTitle: MariaDB/MySQL
weight: -110
description: Configure a Spring application with MariaDB/MySQL.
---

[MariaDB/MySQL](../../add-services/mysql/_index.md) is an open-source relational database technology.
Spring has a robust integration with this technology: [Spring Data JPA](https://spring.io/projects/spring-data-jpa).

The first step is to choose the database that you would like to use in your project.
Define the driver for [MariaDB](https://mvnrepository.com/artifact/org.mariadb.jdbc/mariadb-java-client)
or [MySQL](https://mvnrepository.com/artifact/mysql/mysql-connector-java) and the Java dependencies.
Then determine the DataSource client using the [Java configuration reader library](https://github.com/platformsh/config-reader-java).

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import sh.platform.config.Config;
import sh.platform.config.MariaDB; // Or substitute "MySQL" for "MariaDB"

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Bean(name = "dataSource")
    public DataSource getDataSource() {
        Config config = new Config();
        MariaDB database = config.getCredential("database", MariaDB::new); // Or substitute "MySQL" for "MariaDB"
        return database.get();
    }
}
```
