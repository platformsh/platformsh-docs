---
title: "MariaDB/MySQL (database service)"
weight: 7
sidebarTitle: "MariaDB/MySQL"
description: See how to configure a MariaDB/MySQL server to store your data.
layout: single
---

Platform.sh supports both MariaDB and Oracle MySQL to manage your relational databases.
Their infrastructure setup is nearly identical, though they differ in some features.
See the [MariaDB documentation](https://mariadb.org/learn/)
or [MySQL documentation](https://dev.mysql.com/doc/refman/8.0/en/) for more information.

## Supported versions

The service types `mariadb` and `mysql` both refer to MariaDB.
The service type `oracle-mysql` refers to MySQL as released by Oracle, Inc.
Other than the type, MySQL and MariaDB are identical and the rest of this page refers to both equally.

| **`mariadb`** | **`mysql`** | **`oracle-mysql`** |
|---------------|-------------|--------------------|
|  {{< image-versions image="mariadb" status="supported" >}} | {{< image-versions image="mysql" status="supported" >}} | {{< image-versions image="oracle-mysql" status="supported" >}} |

### Supported versions on Dedicated environments

On Dedicated and Dedicated Generation 3 environments, only MariaDB is available with Galera for replication:

{{< image-versions image="mariadb" status="supported" environment="dedicated" >}}

Dedicated environments don't support any storage engine other than InnoDB.
Tables created on Dedicated environments using the MyISAM storage engine don't replicate between cluster nodes.
See how to [convert the engine for tables](#storage-engine).

### Switching type and version

If you change the service type, your data is removed.
To switch  service types, first [export your data](#exporting-data).
Then remove the old service and create a new one.
Then [import your data](#importing-data) to the new service.

You can't downgrade either MySQL or MariaDB.
Both update their data files to a new version automatically but can't downgrade them.
To experiment with a later version without committing to it, use a non-production environment.

{{% deprecated-versions %}}

| **`mariadb`** | **`mysql`** | **`oracle-mysql`** |
|----------------------------------|---------------|-------------------------|
|  {{< image-versions image="mariadb" status="deprecated" >}} | {{< image-versions image="mariadb" status="deprecated" >}} | {{< image-versions image="oracle-mysql" status="deprecated" >}} |

## Usage example

Configure your service with at least 256 MB in disk space.

{{% endpoint-description type="mariadb" sectionLink="#multiple-databases" multipleText="databases" %}}

### MariaDB example configuration

Service definition:

{{< readFile file="src/registry/images/examples/full/mariadb.services.yaml" highlight="yaml" >}}

App configuration:

{{< readFile file="src/registry/images/examples/full/mariadb.app.yaml" highlight="yaml" >}}

### Oracle MySQL example configuration

Service definition:

{{< readFile file="src/registry/images/examples/full/oracle-mysql.services.yaml" highlight="yaml" >}}

App configuration:

{{< readFile file="src/registry/images/examples/full/oracle-mysql.app.yaml" highlight="yaml" >}}

{{% /endpoint-description %}}

{{< codetabs >}}

---
title=Go
file=static/files/fetch/examples/golang/mysql
highlight=go
---

<--->

---
title=Java
file=static/files/fetch/examples/java/mysql
highlight=java
---

<--->

---
title=Node.js
file=static/files/fetch/examples/nodejs/mysql
highlight=js
---

<--->

---
title=PHP
file=static/files/fetch/examples/php/mysql
highlight=php
---

<--->

---
title=Python
file=static/files/fetch/examples/python/mysql
highlight=python
---

{{< /codetabs >}}

### Configure connections

There may be cases where you want to configure a connection manually.
For example, when using a framework like Symfony Flex that expects the database connection as an environment variable.

To get the URL to connect to the database, run the following command
(replacing `<PROJECT_ID>` and `<ENVIRONMENT_NAME>` with your values):

```bash
platform relationships -p <PROJECT_ID> <ENVIRONMENT_NAME>
```

The result is the complete [information for all relationships](#relationship-reference) with an additional `url` property.
Use the `url` property as your connection.
Note that it can change if you modify the relationship or add additional databases.
So always check it each time your app starts.

You can also see a guide on how to [convert the `PLATFORM_RELATIONSHIPS` environment variable to a different form](https://community.platform.sh/t/convert-platform-relationships-to-database-url/841).

## Relationship reference

Example information available through the [`$PLATFORM_RELATIONSHIPS` environment variable](/development/variables.md#use-platformsh-provided-variables)
or by running `platform relationships`:

### MariaDB reference

{{< relationship "mysql" >}}

### Oracle MySQL reference

{{< relationship "oraclemysql" >}}

## Access the service directly

You can access the service using the Platform CLI by running `platform sql`.

You can also access it from you app container via [SSH](../../../development/ssh/_index.md).
From your [relationship data](#relationship-reference), you need: `host`, `port`, `user`, `path`.
Then run the following command:

```bash
mysql -h <HOST> -P <PORT> -u <USER> <PATH>
```

Assuming the values from the [MariaDB reference](#mariadb-reference), that would be:

```bash
mysql -h mysql.internal -P 3306 -u user main
```

If your database relationship has a password, pass the `-p` switch and enter the password when prompted:

```bash
mysql -p -h mysql.internal -P 3306 -u user main
```

## Multiple databases

With version `10.0` or later, you can define multiple databases and multiple users with different permissions.
To do so, define multiple endpoints using the `configuration` key for your service.

It has the following relevant properties (plus [`properties` for other configuration](#configure-the-database)):

| Name        | Type                      | Required | Description |
| ----------- | ------------------------- | -------- | ----------- |
| `schemas`   | An array of `string`s     |          | All databases to be created. Defaults to a single `main` database. |
| `endpoints` | A dictionary of endpoints |          | The endpoints with their permissions. | 

You need to define each endpoint with a unique name and give it the following properties:

| Name             | Type                     | Required | Description |
| ---------------- | ------------------------ | -------- | ----------- |
| `default_schema` | `string`                 |          | Which of the schemas defined above to default to. If not specified, the `path` property of the relationship is `null` and so tools such as the Platform CLI can't access the relationship. |
| `privileges`     | A permissions dictionary |          | For each of the defined schemas, what permissions the given endpoint has. | 

Possible permissions:

* `ro`: Only SELECT queries are allowed.
* `rw`: SELECT queries and INSERT/UPDATE/DELETE queries are allowed.
* `admin`: All queries are allowed including data definition language (DDL) queries (such as `CREATE TABLE`, `DROP TABLE`).

If neither `schemas` nor `endpoints` is included, it's equivalent to the following default:

```yaml
configuration:
    schemas:
        - main
    endpoints:
        mysql:
            default_schema: main
            privileges:
                main: admin
```

If either `schemas` or `endpoints` are defined, no default is applied and you have to specify the full configuration.

### Multiple databases example

The following configuration example creates a single MariaDB service named `db` with two databases, `main` and `legacy`.
Access to the database is defined through three endpoints:

* `admin` has full access to both databases.
* `reporter` has SELECT query access to `main` but no access to `legacy`.
* `importer` has SELECT/INSERT/UPDATE/DELETE (but not DDL) access to `legacy` but no access to `main`.

```yaml
db:
    type: mariadb:10.5
    disk: 2048
    configuration:
        schemas:
            - main
            - legacy
        endpoints:
            admin:
                default_schema: main
                privileges:
                    main: admin
                    legacy: admin
            reporter:
                privileges:
                    main: ro
            importer:
                default_schema: legacy
                privileges:
                    legacy: rw
```

Expose these endpoints to your app as relationships in your [app configuration](../../app/_index.md):

```yaml
relationships:
    database: "db:admin"
    reports: "db:reporter"
    imports: "db:importer"
```

These relationships are then available in the [`PLATFORM_RELATIONSHIPS` environment variable](#platform_relationships-reference).
Each has its own credentials you can use to connect to the given database.

## Configure the database

For MariaDB 10.1 and later and Oracle MySQL 8.0 and later, you can set some configuration properties
(equivalent to using a `my.cnf` file).

In your settings, add the `properties` key to the `configuration` key.
It offers the following properties:

| Name        | Type               | Default                                                      | Description |
| ----------- | ------------------ | ------------------------------------------------------------ | ----------- |
| `max_allowed_packet` | `integer` | `16`                                                         | The maximum size for packets in MB. Can be from `1` to `100`. |
| `default_charset`    | `string`  | `latin1` before February 2020 and `utf8mb4` after            | The default character set. Affects any tables created after it's set. |
| `default_collation`  | `string`  | `latin1` before February 2020 and `utf8mb4_unicode_ci` after | The default collation. Affects any tables created after it's set. |

An example of setting these properties:

```yaml
db:
    type: mariadb:10.5
    disk: 2048
    configuration:
        properties:
            max_allowed_packet: 64
            default_charset: utf8mb4
            default_collation: utf8mb4_unicode_ci
```

You can also change a table's character set and collation through `ALTER TABLE` commands:

```text
# To change defaults when creating new tables:
ALTER DATABASE main CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# To change defaults when creating new columns:
ALTER TABLE table_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# To convert existing data:
ALTER TABLE table_name CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Consult the [MySQL documentation](https://dev.mysql.com/doc/refman/8.0/en/charset-mysql.html) for further details.

## Storage Engine

It's best to the InnoDB storage engine wherever possible.
MyISAM is only properly supported in non-Dedicated environments.
In Dedicated environments, there is no replication of MyISAM tables.

If MyISAM tables have been inadvertently created or imported in a Dedicated environment
(if you see `ENGINE=MyISAM` in the response to `SHOW CREATE TABLE <existing_table>`),
convert them to use the InnoDB storage engine as follows:

1. Rename the existing table.
   ```sql
   RENAME TABLE <existing_table> <table_old>;
   ```
1. Create a new table from the data in the existing table.
   ```sql
   CREATE TABLE <existing_table> SELECT * from <table_old>;
   ```

Now when you run `SHOW CREATE TABLE <existing_table>`, you see `ENGINE=InnoDB`.

## Exporting data

To download all data in a MariaDB instance, use the Platform.sh CLI.
If you have a single SQL database, the following command exports all data to a local file:

```bash
platform db:dump
```

If you have multiple SQL databases, you are prompted for which one to export.
You can also specify it explicitly by its relationship name:

```bash
platform db:dump --relationship <RELATIONSHIP_NAME>
```

### Compression

By default, the file is uncompressed.
To compress it, use the `--gzip` (`-z`) option:

```bash
platform db:dump --gzip
```

### Using the output in bash

To pipe the result to another command, use the `--stdout` option.
For example, to create a bzip2-compressed file, run:

```bash
platform db:dump --stdout | bzip2 > dump.sql.bz2
```

## Importing data

To load data into a database, pipe an SQL dump through the `platform sql` command, like so:

```bash
platform sql < my_database_backup.sql
```

That runs the database backup against the SQL database on Platform.sh.
That works for any SQL file, so the usual caveats about importing an SQL dump apply
(for example, it's best to run against an empty database).

As with exporting, you can specify a specific environment and a specific database relationship to use:

```bash
platform sql --relationship <RELATIONSHIP_NAME> -e <BRANCH_NAME> < my_database_backup.sql
```

{{< note >}}

Importing a database backup is a destructive operation.
It overwrites data already in your database.
It's best to run it against an empty database.
If not, make a backup or do a database export before importing.

{{< /note >}}

## Replication

In non-Dedicated environments, there is no on-site primary/replica supports.
In Dedicated environments, it's provided automatically as part of the default configuration.

In rare cases (such as for certain backup purposes),
you can also enable [remote replication](../../../guides/general/mysql-replication.md) to your own replica data.
The replica isn't available to your application.

## Troubleshoot

If you run into issues, [troubleshoot MySQL](./troubleshoot.md).