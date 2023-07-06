---
title: "MariaDB/MySQL (database service)"
weight: -60
sidebarTitle: "MariaDB/MySQL"
description: See how to configure a MariaDB/MySQL server to store your data.
layout: single
---

Platform.sh supports both MariaDB and Oracle MySQL to manage your relational databases.
Their infrastructure setup is nearly identical, though they differ in some features.
See the [MariaDB documentation](https://mariadb.org/learn/)
or [MySQL documentation](https://dev.mysql.com/doc/refman/en/) for more information.

{{% frameworks %}}

- [Hibernate](../../guides/hibernate/deploy.md#mysql)
- [Jakarta EE](../../guides/jakarta/deploy.md#mysql)
- [Spring](../../guides/spring/mysql.md)

{{% /frameworks %}}

## Supported versions

{{% major-minor-versions-note configMinor="true" %}}

The service types `mariadb` and `mysql` both refer to MariaDB.
The service type `oracle-mysql` refers to MySQL as released by Oracle, Inc.
Other than the value for their `type`,
MySQL and MariaDB have the same behavior and the rest of this page applies to both of them.

| **`mariadb`** | **`mysql`** | **`oracle-mysql`** |
|---------------|-------------|--------------------|
|  {{< image-versions image="mariadb" status="supported" >}} | {{< image-versions image="mysql" status="supported" >}} | {{< image-versions image="oracle-mysql" status="supported" >}} |

### Supported versions on Dedicated environments

`oracle-mysql` is not yet available for {{% names/dedicated-gen-3 %}} environments.
It also isn't available for {{% names/dedicated-gen-2 %}} environments.

On Dedicated environments, MariaDB is available with Galera for replication.
Supported versions are the following:

| {{% names/dedicated-gen-2 %}} | {{% names/dedicated-gen-3 %}} |
|-------------------------------|-------------------------------|
| {{< image-versions image="mariadb" status="supported" environment="dedicated-gen-2" >}} | {{< image-versions image="mariadb" status="supported" environment="dedicated-gen-3" >}} |

Dedicated environments only support the InnoDB storage engine.
Tables created on Dedicated environments using the MyISAM storage engine don't replicate between all hosts in the cluster.
See how to [convert tables to the InnoDB engine](#storage-engine).

{{% deprecated-versions %}}

| **`mariadb`** | **`mysql`** | **`oracle-mysql`** |
|----------------------------------|---------------|-------------------------|
|  {{< image-versions image="mariadb" status="deprecated" >}} | {{< image-versions image="mariadb" status="deprecated" >}} | {{< image-versions image="oracle-mysql" status="deprecated" >}} |

### Switching type and version

If you change the service type, your data is removed.

To switch service types:

1. [Export your data](#exporting-data).
1. Remove the old service from your [service configuration](../_index.md).
1. Specify a new service type.
1. [Import your data](#importing-data) into the new service.

### Downgrade

You can't downgrade to a previous version and retain your data.
To downgrade your database, follow these steps:

1. [Export your data](#exporting-data).
1. Remove the old service from your [service configuration](../_index.md).
1. Add a new service with a different name and your desired version.
1. [Import your data](#importing-data) into the new service.

## Usage example

Configure your service with at least 256 MB in disk space.

{{% endpoint-description type="mariadb" sectionLink="#multiple-databases" multipleText="databases" /%}}

{{< codetabs >}}

+++
title=Go
file=static/files/fetch/examples/golang/mysql
highlight=go
+++

<--->

+++
title=Java
file=static/files/fetch/examples/java/mysql
highlight=java
+++

<--->

+++
title=Node.js
file=static/files/fetch/examples/nodejs/mysql
highlight=js
+++

<--->

+++
title=PHP
file=static/files/fetch/examples/php/mysql
highlight=php
+++

<--->

+++
title=Python
file=static/files/fetch/examples/python/mysql
highlight=python
+++

{{< /codetabs >}}

### Configure connections

There may be cases where you want to configure a database connection manually.

To get the URL to connect to the database, run the following command:

```bash
platform relationships
```

The result is the complete [information for all relationships](#relationship-reference) with an additional `url` property.
Use the `url` property as your connection.

{{% service-values-change %}}

You can also see a guide on how to [convert the `PLATFORM_RELATIONSHIPS` environment variable to a different form](https://community.platform.sh/t/convert-platform-relationships-to-database-url/841).

## Configuration options

You can configure your MySQL service in the [services configuration](../_index.md) with the following options:

| Name         | Type                    | Version                            | Description |
| ------------ | ----------------------- | ---------------------------------- | ----------- |
| `schemas`    | An array of `string`s   | 10.0+                              | All databases to be created. Defaults to a single `main` database. |
| `endpoints`  | An endpoints dictionary | 10.0+                              | Endpoints with their permissions. See [multiple databases](#multiple-databases). |
| `properties` | A properties dictionary | MariaDB: 10.1+; Oracle MySQL: 8.0+ | Additional properties for the database. Equivalent to using a `my.cnf` file. See [property options](#configure-the-database). |

Example configuration:

```yaml {location=".platform/services.yaml"}
db:
    type: mariadb:10.5
    disk: 2048
    configuration:
        schemas:
            - main
        endpoints:
            mysql:
                default_schema: main
                privileges:
                    main: admin
        properties:
            max_allowed_packet: 64
```

{{% relationship-ref-intro %}}

{{% service-values-change %}}

### MariaDB reference

{{< relationship "mysql" >}}

### Oracle MySQL reference

{{< relationship "oraclemysql" >}}

## Access the service directly

You can access the service using the Platform CLI by running `platform sql`.

You can also access it from you app container via [SSH](../../development/ssh/_index.md).
From your [relationship data](#relationship-reference), you need: `host`, `port`, `user`, `path`.
Then run the following command:

```bash
mysql -h {{< variable "HOST" >}} -P {{< variable "PORT" >}} -u {{< variable "USER" >}} {{< variable "PATH" >}}
```

Assuming the values from the [MariaDB reference](#mariadb-reference), that would be:

```bash
mysql -h mysql.internal -P 3306 -u user main
```

If your database relationship has a password, pass the `-p` switch and enter the password when prompted:

```bash
mysql -p -h mysql.internal -P 3306 -u user main
```

## Define permissions

With version `10.0` or later, you can define multiple users with different permissions for your database.
To do so, define multiple endpoints in your [service configuration](#configuration-options).

For each endpoint you add, you can define the following properties:

| Name             | Type                     | Required | Description |
| ---------------- | ------------------------ | -------- | ----------- |
| `default_schema` | `string`                 |          | Which of the defined schemas to default to. If not specified, the `path` property of the relationship is `null` and so tools such as the Platform CLI can't access the relationship. |
| `privileges`     | A permissions dictionary |          | For each of the defined schemas, what permissions the given endpoint has. |

Possible permissions:

| Name        | Type          | Description                                         |
| ----------- | ------------- | --------------------------------------------------- |
| Read-only   | `ro`          | Can select, create temporary tables, and see views. |
| Read-write  | `rw`          | In addition to read-only permissions, can also insert, update, delete, manage and execute events, execute routines, create and drop indexes, manage and execute triggers, and lock tables. |
| Admin       | `admin`       | In addition to read-write permissions, can also create, drop, and alter tables; create views; and create and alter routines. |
| Replication | `replication` | For [replicating databases](./mysql-replication.md). In addition to read-only permissions, can also lock tables. |

You can also specify `schemas` for [multiple databases](#multiple-databases).
If neither `schemas` nor `endpoints` is included, it's equivalent to the following default:

```yaml {location=".platform/services.yaml"}
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

## Multiple databases

With version `10.0` or later, you can define multiple databases.
To do so, define multiple `schemas` in your [service configuration](#configuration-options).

You can also specify multiple `endpoints` for [permissions](#define-permissions).
If neither `schemas` nor `endpoints` is included, it's equivalent to the following default:

```yaml {location=".platform/services.yaml"}
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

{{< note >}}

Removing a schema from the list of `schemas` on further deployments results in the deletion of the schema.

{{</note >}}


### Multiple databases example

The following configuration example creates a single MariaDB service named `db` with two databases, `main` and `legacy`.
Access to the database is defined through three endpoints:

* `admin` has full access to both databases.
* `reporter` has SELECT query access to `main` but no access to `legacy`.
* `importer` has SELECT/INSERT/UPDATE/DELETE (but not DDL) access to `legacy` but no access to `main`.

```yaml {location=".platform/services.yaml"}
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

Expose these endpoints to your app as relationships in your [app configuration](../../create-apps/_index.md):

```yaml {location=".platform.app.yaml"}
relationships:
    database: "db:admin"
    reports: "db:reporter"
    imports: "db:importer"
```

These relationships are then available in the [`PLATFORM_RELATIONSHIPS` environment variable](#relationship-reference).
Each has its own credentials you can use to connect to the given database.

## Configure the database

For MariaDB 10.1 and later and Oracle MySQL 8.0 and later, you can set some configuration properties
(equivalent to using a `my.cnf` file).

In your settings, add the `properties` key to the `configuration` key.
It offers the following properties:

| Name                                  | Type      | Default                                                      | Description                                                                                                                                                                           |
|---------------------------------------|-----------|--------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `max_allowed_packet`                  | `integer` | `16`                                                         | The maximum size for packets in MB. Can be from `1` to `100`.                                                                                                                         |
| `default_charset`                     | `string`  | `utf8mb4` after February 2020 and `latin1` before            | The default character set. Affects any tables created after it's set.                                                                                                                 |
| `default_collation`                   | `string`  | `utf8mb4_unicode_ci` after February 2020 and `latin1` before | The default collation. Affects any tables created after it's set.                                                                                                                     |
| `optimizer_switch`                    | `string`  |                                                              | A place to set various server optimization variables. See the [MariaDB documentation](https://mariadb.com/kb/en/optimizer-switch/).                                                   |
| `optimizer_use_condition_selectivity` | `integer` | `4` in version 10.4.1+ and `1` before that                   | Which statistics are used by the optimizer. From `1` to `5`. See the [MariaDB documentation](https://mariadb.com/kb/en/server-system-variables/#optimizer_use_condition_selectivity). |

An example of setting these properties:

```yaml {location=".platform/services.yaml"}
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

For further details, see the [MariaDB documentation](https://mariadb.com/kb/en/character-set-and-collation-overview/).

{{% databases-passwords %}}

## Storage Engine

It's best to use the InnoDB storage engine wherever possible.
MyISAM is only properly supported in non-Dedicated environments.
In Dedicated environments, there is no replication of MyISAM tables.

If MyISAM tables have been inadvertently created or imported in a Dedicated environment
(if you see `ENGINE=MyISAM` in the response to `SHOW CREATE TABLE {{< variable "EXISTING_TABLE" >}}`),
convert them to use the InnoDB storage engine as follows:

1. Rename the existing table.

   ```text
   RENAME TABLE {{< variable "EXISTING_TABLE" >}} {{< variable "OLD_TABLE" >}};
   ```

1. Create a new table from the data in the existing table.

   ```text
   CREATE TABLE {{< variable "EXISTING_TABLE" >}} SELECT * from {{< variable "OLD_TABLE" >}};
   ```

Now when you run `SHOW CREATE TABLE {{< variable "EXISTING_TABLE" >}}`, you see `ENGINE=InnoDB`.

## Service timezone

To change the timezone for a given connection, run `SET time_zone = {{< variable "TIMEZONE" >}};`.

## Exporting data

To download all data from your SQL database, use the Platform.sh CLI.
If you have a single SQL database, the following command exports all data to a local file:

```bash
platform db:dump
```

If you have multiple SQL databases, you are prompted for which one to export.
You can also specify a database by its relationship name:

```bash
platform db:dump --relationship {{< variable "RELATIONSHIP_NAME" >}}
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
platform sql --relationship {{< variable "RELATIONSHIP_NAME" >}} -e {{< variable "BRANCH_NAME" >}} < my_database_backup.sql
```

{{< note >}}

Importing a database backup is a destructive operation.
It overwrites data already in your database.
It's best to run it against an empty database.
If not, make a backup or do a database export before importing.

{{< /note >}}

## Sanitizing data

To ensure people who review code changes can't access personally identifiable information stored in your database,
[sanitize your development environments](../../development/sanitize-db/mariadb.md).

## Replication

In non-Dedicated environments, there is no on-site primary/replica supports.
In Dedicated environments, it's provided automatically as part of the default configuration.

In rare cases (such as for certain backup purposes),
you can also enable [remote replication](./mysql-replication.md) to your own replica data.
The replica isn't available to your application.

## Troubleshoot

If you run into issues, [troubleshoot MySQL](./troubleshoot.md).
