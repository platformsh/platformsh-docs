---
title: "MariaDB/MySQL (database service)"
weight: -60
sidebarTitle: "MariaDB/MySQL"
description: See how to configure a MariaDB/MySQL server to store your data.
layout: single
---

{{% vendor/name %}} supports both MariaDB and Oracle MySQL to manage your relational databases.
Their infrastructure setup is nearly identical, though they differ in some features.
See the [MariaDB documentation](https://mariadb.org/learn/)
or [MySQL documentation](https://dev.mysql.com/doc/refman/en/) for more information.

{{% frameworks version="1" %}}

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

{{% relationship-ref-intro %}}

### MariaDB reference

{{< codetabs >}}
+++
title= Service environment variables
+++

{{% service-values-change %}}

```bash
MARIADB_USERNAME=user
MARIADB_SCHEME=mysql
MARIADB_SERVICE=mariadb
MARIADB_FRAGMENT=
MARIADB_IP=123.456.78.90
MARIADB_HOSTNAME=azertyuiopqsdfghjklm.mariadb.service._.eu-1.{{< vendor/urlraw "hostname" >}}
MARIADB_PORT=3306
MARIADB_CLUSTER=azertyuiop-main-afdwftq
MARIADB_HOST=mariadbdatabase.internal
MARIADB_REL=mysql
MARIADB_PATH=main
MARIADB_QUERY={'is_master': True}
MARIADB_PASSWORD=
MARIADB_EPOCH=0
MARIADB_TYPE=mariadb:{{< latest "mariadb" >}}
MARIADB_PUBLIC=false
MARIADB_HOST_MAPPED=false
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal.

```json
{
    "username": "user",
    "scheme": "mysql",
    "service": "mariadb",
    "fragment": null,
    "ip": "123.456.78.90",
    "hostname": "azertyuiopqsdfghjklm.mariadb.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
    "port": 3306,
    "cluster": "azertyuiop-main-7rqtwti",
    "host": "mariadb.internal",
    "rel": "mysql",
    "path": "main",
    "query": {
        "is_master": true
    },
    "password": "",
    "type": "mariadb:{{% latest "mariadb" %}}",
    "public": false,
    "host_mapped": false
}
```

Example on how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_DATABASE_HOST=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".mariadb[0].host")
```

{{< /codetabs >}}

### Oracle MySQL reference

{{< codetabs >}}
+++
title= Service environment variables
+++

{{% service-values-change %}}

```bash
ORACLEMYSQL_USERNAME=user
ORACLEMYSQL_SCHEME=mysql
ORACLEMYSQL_SERVICE=oracle-mysql
ORACLEMYSQL_FRAGMENT=
ORACLEMYSQL_IP=123.456.78.90
ORACLEMYSQL_HOSTNAME=azertyuiopqsdfghjklm.oracle-mysql.service._.eu-1.{{< vendor/urlraw "hostname" >}}
ORACLEMYSQL_PORT=3306
ORACLEMYSQL_CLUSTER=azertyuiop-main-afdwftq
ORACLEMYSQL_HOST=oraclemysql.internal
ORACLEMYSQL_REL=mysql
ORACLEMYSQL_PATH=main
ORACLEMYSQL_QUERY={'is_master': True}
ORACLEMYSQL_PASSWORD=
ORACLEMYSQL_EPOCH=0
ORACLEMYSQL_TYPE=oracle-mysql:{{< latest "oracle-mysql" >}}
ORACLEMYSQL_PUBLIC=false
ORACLEMYSQL_HOST_MAPPED=false
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal.

```json
{
    "username": "user",
    "scheme": "mysql",
    "service": "oracle-mysql",
    "fragment": null,
    "ip": "123.456.78.90",
    "hostname": "azertyuiopqsdfghjklm.oracle-mysql.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
    "port": 3306,
    "cluster": "azertyuiop-main-afdwftq",
    "host": "oraclemysql.internal",
    "rel": "mysql",
    "path": "main",
    "query": {
        "is_master": true
    },
    "password": "",
    "type": "oracle-mysql:{{< latest "oracle-mysql" >}}",
    "public": false,
    "host_mapped": false
}
```

Example on how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_ORACLE_HOST="$(echo $RELATIONSHIPS_JSON | jq -r '.oraclemysql[0].host')"
```

{{< /codetabs >}}

## Usage example

Configure your service with at least 256 MB in disk space.

{{% endpoint-description type="mariadb" sectionLink="#multiple-databases" multipleText="databases" /%}}

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    myapp:
        # The location of the application's code.
        source:
            root: "/"

        [...]

        # Relationships enable an app container's access to a service.
        relationships:
            mariadb:

service:
    mariadb:
        type: mariadb:{{% latest "mariadb" %}}
```

{{% v2connect2app serviceName="mariadb" relationship="mariadb" var="MARIADB_URL"%}}

```bash {location="myapp/.environment"}
# Set environment variables for individual credentials.
# For more information, please visit {{< vendor/urlraw "docs" >}}/development/variables.html#service-environment-variables.
export DB_CONNECTION==${MARIADB_SCHEME}
export DB_USERNAME=${MARIADB_USERNAME}
export DB_PASSWORD=${MARIADB_PASSWORD}
export DB_HOST=${MARIADB_HOST}
export DB_PORT=${MARIADB_PORT}
export DB_DATABASE=${MARIADB_PATH}

# Surface connection string variable for use in app.
export DATABASE_URL="${DB_CONNECTION}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
```

{{% /v2connect2app %}}

### Configure connections

There may be cases where you want to configure a database connection manually.

To get the URL to connect to the database, run the following command:

```bash
{{% vendor/cli %}} ssh env
```

The result is the complete [information for all relationships](#relationship-reference) with an additional `DATABASE_URL` property, defined on step [Use in app](#use-in-app).
<BR>Use the `DATABASE_URL` property as your connection.

{{% service-values-change %}}

You can also see a guide on how to [convert the `{{< vendor/prefix >}}_RELATIONSHIPS` environment variable to a different form](https://community.platform.sh/t/convert-platform-relationships-to-database-url/841).

## Configuration options

You can configure your MySQL service in the [services configuration](../_index.md) with the following options:

| Name         | Type                    | Version                            | Description |
| ------------ | ----------------------- | ---------------------------------- | ----------- |
| `schemas`    | An array of `string`s   | 10.0+                              | All databases to be created. Defaults to a single `main` database. |
| `endpoints`  | An endpoints dictionary | 10.0+                              | Endpoints with their permissions. See [multiple databases](#multiple-databases). |
| `properties` | A properties dictionary | MariaDB: 10.1+; Oracle MySQL: 8.0+ | Additional properties for the database. Equivalent to using a `my.cnf` file. See [property options](#configure-the-database). |

Example configuration:

```yaml {configFile="services"}
services:
    # The name of the service container. Must be unique within a project.
    mariadb:
        type: mariadb:{{% latest "mariadb" %}}
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

## Access the service directly

You can access the service using the {{< vendor/name >}} CLI by running `{{< vendor/cli >}} sql`.

You can also access it from you app container via [SSH](../../development/ssh/_index.md).
From your [relationship data](#relationship-reference), you need: `MARIADB_HOST`, `MARIADB_PORT`, `MARIADB_USERNAME`, `MARIADB_PATH` values.
Then run the following command:

```bash
mysql -h {{< variable "MARIADB_HOST" >}} -P {{< variable "MARIADB_PORT" >}} -u {{< variable "MARIADB_USERNAME" >}} {{< variable "MARIADB_PATH" >}}
```

Assuming the values from the [MariaDB reference](#mariadb-reference), that would be:

```bash
mysql -h mariadb.internal -P 3306 -u user main
```

If your database relationship has a password, pass the `-p` switch and enter the password when prompted:

```bash
mysql -p -h mariadb.internal -P 3306 -u user main
```

## Define permissions

With version `10.0` or later, you can define multiple users with different permissions for your database.
To do so, define multiple endpoints in your [service configuration](#configuration-options).

For each endpoint you add, you can define the following properties:

| Name             | Type                     | Required | Description |
| ---------------- | ------------------------ | -------- | ----------- |
| `default_schema` | `string`                 |          | Which of the defined schemas to default to. If not specified, the `path` property of the relationship is `null` and so tools such as the {{< vendor/name >}} CLI can't access the relationship. |
| `privileges`     | A permissions dictionary |          | For each of the defined schemas, what permissions the given endpoint has. |

Possible permissions:

| Name        | Type          | Description                                         |
| ----------- | ------------- | --------------------------------------------------- |
| Read-only   | `ro`          | Can select, create temporary tables, and see views. |
| Read-write  | `rw`          | In addition to read-only permissions, can also insert, update, delete, manage and execute events, execute routines, create and drop indexes, manage and execute triggers, and lock tables. |
| Admin       | `admin`       | In addition to read-write permissions, can also create, drop, and alter tables; create views; and create and alter routines. |
| Replication | `replication` | For [replicating databases](./mysql-replication.md). In addition to read-only permissions, can also lock tables. |

## Multiple databases

With version `10.0` or later, you can define multiple databases.
To do so, define multiple `schemas` in your [service configuration](#configuration-options).

You can also specify multiple `endpoints` for [permissions](#define-permissions).
If neither `schemas` nor `endpoints` is included, it's equivalent to the following default:

```yaml {configFile="services"}
services:
    # The name of the service container. Must be unique within a project.
    mariadb:
        type: mariadb:{{% latest "mariadb" %}}
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

The following configuration example creates a single MariaDB service named `mariadb` with two databases, `main` and `legacy`.
Access to the database is defined through three endpoints:

* `admin` has full access to both databases.
* `reporter` has SELECT query access to `main` but no access to `legacy`.
* `importer` has SELECT/INSERT/UPDATE/DELETE (but not DDL) access to `legacy` but no access to `main`.

```yaml {configFile="services"}
services:
    # The name of the service container. Must be unique within a project.
    mariadb:
        type: mariadb:{{% latest "mariadb" %}}
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

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    myapp:
        # The location of the application's code.
        source:
            root: "myapp"
        
        [...]

        # Relationships enable an app container's access to a service.
        relationships:
            database: "mariadb:admin"
            reports: "mariadb:reporter"
            imports: "mariadb:importer"
```

These relationships are then available in the [service environment variables](#relationship-reference).
Each has its own credentials, prefixed with the relationship name, you can use to connect to the given database.

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
| `innodb_adaptive_hash_index`          | `integer` | `0` in version 10.5+ and `1` before that                     | Enable/Disable InnoDB Hash Index. See the [MariaDB documentation](https://mariadb.com/kb/en/innodb-system-variables/#innodb_adaptive_hash_index).                                     |
| `max_heap_table_size`                 | `integer` | `32`                                                         | The maximum size for user-created MEMORY tables in MB. Can be from `1` to `4096`.                                                                                                     |
| `table_definition_cache`              | `integer` | `400`                                                        | The number of table definitions that can be cached. See the [MariaDB documentation](https://mariadb.com/kb/en/server-system-variables/#table_definition_cache).                       |
| `table_open_cache`                    | `integer` | `400`                                                        | The maximum number of open tables cached in one table cache instance. See the [MariaDB documentation](https://mariadb.com/kb/en/server-system-variables/#table_open_cache).           |
| `wsrep_sync_wait`                     | `integer` | `0` (Disabled)                                               | Ensure execution of statements in fully synced nodes. See the [MariaDB documentation](https://mariadb.com/kb/en/galera-cluster-system-variables/#wsrep_sync_wait).                    |

An example of setting these properties:

```yaml {configFile="services"}
services:
    # The name of the service container. Must be unique within a project.
    mariadb:
        type: mariadb:{{% latest "mariadb" %}}
        configuration:
            properties:
                max_allowed_packet: 64
                default_charset: utf8mb4
                default_collation: utf8mb4_unicode_ci
```

You can also change a table's character set and collation through `ALTER TABLE` commands:

```sql
-- To change defaults when creating new tables:
ALTER DATABASE main CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- To change defaults when creating new columns:
ALTER TABLE table_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- To convert existing data:
ALTER TABLE table_name CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

For further details, see the [MariaDB documentation](https://mariadb.com/kb/en/character-set-and-collation-overview/).

{{% databases-passwords %}}

## Storage Engine

{{% version/specific %}}
It's best to use the InnoDB storage engine wherever possible.
MyISAM is only properly supported in non-Dedicated environments.
In Dedicated environments, there is no replication of MyISAM tables.

If MyISAM tables have been inadvertently created or imported in a Dedicated environment
(if you see `ENGINE=MyISAM` in the response to `SHOW CREATE TABLE EXISTING_TABLE`),
convert them to use the InnoDB storage engine as follows:
<--->
It's best to use the InnoDB storage engine wherever possible instead of MyISAM.
If MyISAM tables have been inadvertently created or imported in your environments
(if you see `ENGINE=MyISAM` in the response to `SHOW CREATE TABLE EXISTING_TABLE`),
convert them to use the InnoDB storage engine as follows:
{{% /version/specific %}}

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

To download all data from your SQL database, use the {{% vendor/name %}} CLI.
If you have a single SQL database, the following command exports all data to a local file:

```bash
{{% vendor/cli %}} db:dump
```

If you have multiple SQL databases, you are prompted for which one to export.
You can also specify a database by its relationship name:

```bash
{{% vendor/cli %}} db:dump --relationship {{< variable "RELATIONSHIP_NAME" >}}
```

### Compression

By default, the file is uncompressed.
To compress it, use the `--gzip` (`-z`) option:

```bash
{{% vendor/cli %}} db:dump --gzip
```

### Using the output in bash

To pipe the result to another command, use the `--stdout` option.
For example, to create a bzip2-compressed file, run:

```bash
{{% vendor/cli %}} db:dump --stdout | bzip2 > dump.sql.bz2
```

## Importing data

To load data into a database, pipe an SQL dump through the `{{% vendor/cli %}} sql` command, like so:

```bash
{{% vendor/cli %}} sql < my_database_backup.sql
```

That runs the database backup against the SQL database on {{% vendor/name %}}.
That works for any SQL file, so the usual caveats about importing an SQL dump apply
(for example, it's best to run against an empty database).

As with exporting, you can specify a specific environment and a specific database relationship to use:

```bash
{{% vendor/cli %}} sql --relationship {{< variable "RELATIONSHIP_NAME" >}} -e {{< variable "BRANCH_NAME" >}} < my_database_backup.sql
```

{{< note >}}

Importing a database backup is a destructive operation.
It overwrites data already in your database.
It's best to run it against an empty database.
If not, make a backup or do a database export before importing.

{{< /note >}}

## Sanitizing data

To ensure people who review code changes can't access personally identifiable information stored in your database,
[sanitize your preview environments](../../development/sanitize-db/_index.md).

## Replication

There is no on-site primary/replica support in your environments.

In rare cases (such as for certain backup purposes),
you can also enable [remote replication](./mysql-replication.md) to your own replica data.
The replica isn't available to your application.

## Troubleshoot

If you run into issues, [troubleshoot MySQL](./troubleshoot.md).
