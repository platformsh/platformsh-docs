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

## Use a framework

If you use one of the following frameworks, follow its guide:

- [Hibernate](../../guides/hibernate/deploy.md#mysql)
- [Jakarta EE](../../guides/jakarta/deploy.md#mysql)
- [Spring](../../guides/spring/mysql.md)

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like. When you deploy your app, you always get the latest available patches.

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

<table>
    <thead>
        <tr>
            <th>{{% names/dedicated-gen-2 %}}</th>
            <th>{{% names/dedicated-gen-3 %}}</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="mariadb" status="supported" environment="dedicated-gen-2" >}}</td>
            <td>{{< image-versions image="mariadb" status="supported" environment="dedicated-gen-3" >}}</thd>
        </tr>
    </tbody>
</table>

Dedicated environments only support the InnoDB storage engine.
Tables created on Dedicated environments using the MyISAM storage engine don't replicate between all hosts in the cluster.
See how to [convert tables to the InnoDB engine](#storage-engine).

### Deprecated versions

The following versions are [deprecated](/glossary.html#deprecated-versions).
They're available, but they aren't receiving security updates from upstream and aren't guaranteed to work.
They'll be removed in the future,
so migrate to one of the [supported versions](#supported-versions).

| **`mariadb`** | **`mysql`** | **`oracle-mysql`** |
|----------------------------------|---------------|-------------------------|
|  {{< image-versions image="mariadb" status="deprecated" >}} | {{< image-versions image="mariadb" status="deprecated" >}} | {{< image-versions image="oracle-mysql" status="deprecated" >}} |

### Upgrade

When upgrading your service, skipping versions may result in data loss.
Upgrade sequentially from one supported version to another (10.5 -> 10.6 -> 10.11 -> 11.0),
and check that each upgrade commit translates into an actual deployment.

To upgrade, update the service version in your [service configuration](../_index.md).

### Change the service type

To change the service type:

1. [Export your data](#exporting-data).
   {{% note %}}
   Changing the service type, especially when done repeatedly, may result in data loss.
   Backing up your data is therefore crucial.
   {{% /note %}}
2. Remove the old service from your [service configuration](../_index.md).
3. Specify a new service type.
4. [Import your data](#importing-data) into the new service.

### Downgrade

You can't downgrade to a previous version and retain your data.
To downgrade your database, follow these steps:

1. [Export your data](#exporting-data).
1. Remove the old service from your [service configuration](../_index.md).
1. Add a new service with a different name and your desired version.
1. [Import your data](#importing-data) into the new service.

## Usage example

Configure your service with at least 256 MB in disk space.

### 1. Configure the service

To define the service, use the `mariadb` or `mysql` type for MariaDB or the `oracle-mysql` type for Oracle MySQL:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
  type: mariadb:<VERSION>
  disk: 256
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost.
Back up your data before changing the service.

### 2. Define the relationship

To define the relationship, use the following configuration:

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
# The example below shows simplified configuration leveraging a default service
# (identified from the relationship name) and a default endpoint.
# See the Application reference for all options for defining relationships and endpoints.
relationships:
  <SERVICE_NAME>:
```

You can define `<SERVICE_NAME>` as you like, so long as it's unique between all defined services
and matches in both the application and services configuration.

The example above leverages [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.
That is, it uses default endpoints behind-the-scenes, providing a [relationship](/create-apps/app-reference/single-runtime-image#relationships)
(the network address a service is accessible from) that is identical to the _name_ of that service.

Depending on your needs, instead of default endpoint configuration,
you can use [explicit endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<SERVICE_NAME>` and its corresponding [`{{% vendor/prefix %}}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
# The example below shows configuration with an explicitly set service name and endpoint.
# See the Application reference for all options for defining relationships and endpoints.
# Note that legacy definition of the relationship is still supported.
# More information: https://docs.platform.sh/create-apps/app-reference/single-runtime-image.html#relationships
relationships:
  <RELATIONSHIP_NAME>:
    service: <SERVICE_NAME>
    endpoint: mysql
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<RELATIONSHIP_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< /codetabs >}}

### MariaDB example

#### [Service definition](/add-services/_index.md)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
mariadb:
  type: mariadb:{{% latest "mariadb" %}}
  disk: 256
```

#### [App configuration](/create-apps/_index.md)

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
# The example below shows simplified configuration leveraging a default service
# (identified from the relationship name) and a default endpoint.
# See the Application reference for all options for defining relationships and endpoints.
relationships:
  mariadb:
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
# The example below shows configuration with an explicitly set service name and endpoint.
# See the Application reference for all options for defining relationships and endpoints.
# Note that legacy definition of the relationship is still supported.
# More information: https://docs.platform.sh/create-apps/app-reference/single-runtime-image.html#relationships
relationships:
  mariadb:
    service: mariadb
    endpoint: mysql
```

{{< /codetabs >}}

### OracleMySQL example

#### [Service definition](/add-services)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
oraclemysql:
  type: oracle-mysql:{{% latest "oracle-mysql" %}}
  disk: 256
```

#### [App configuration](/create-apps)

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
# The example below shows simplified configuration leveraging a default service
# (identified from the relationship name) and a default endpoint.
# See the Application reference for all options for defining relationships and endpoints.
relationships:
  oraclemysql:
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
# The example below shows configuration with an explicitly set service name and endpoint.
# See the Application reference for all options for defining relationships and endpoints.
# Note that legacy definition of the relationship is still supported.
# More information: https://docs.platform.sh/create-apps/app-reference/single-runtime-image.html#relationships
relationships:
  oraclemysql:
    service: oraclemysql
    endpoint: mysql
```
{{< /codetabs >}}

### Use in app

To use the configured service in your app,
add a configuration file similar to the following to your project.

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
{{% vendor/cli %}} relationships
```

The result is the complete [information for all relationships](#relationship-reference) with an additional `url` property.
Use the `url` property as your connection.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed.
So your apps should only rely on the `PLATFORM_RELATIONSHIPS` environment variable directly rather than hard coding any values.

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
# The name of the service container. Must be unique within a project.
mariadb:
  type: mariadb:{{% latest "mariadb" %}}
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

## Relationship reference

Example information available through the [`{{% vendor/prefix %}}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables)
or by running `{{% vendor/cli %}} relationships`.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed. So your apps should only rely on the `PLATFORM_RELATIONSHIPS` environment variable directly rather than hard coding any values.

### MariaDB reference

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

### Oracle MySQL reference

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

## Access the service directly

You can access the service using the {{< vendor/name >}} CLI by running `{{< vendor/cli >}} sql`.

You can also access it from you app container via [SSH](../../development/ssh/_index.md).
From your [relationship data](#relationship-reference), you need: `host`, `port`, `user`, `path`.
Then run the following command:

```bash
mysql -h {{< variable "HOST" >}} -P {{< variable "PORT" >}} -u {{< variable "USER" >}} {{< variable "PATH" >}}
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

### Restrict access to database replicas only

{{< partial "banners/replicas/body.md" >}}

Your main database lives on one of the three nodes provided on Grid HA and {{% names/dedicated-gen-3 %}}.
The two other nodes can each accommodate a replica of your main database.

For security reasons, you can grant your app access to a replica instead of your main database.
To do so, when defining the relationship between your app and database,
make sure you do the following:

1. Use the [explicit endpoint syntax](/create-apps/app-reference/single-runtime-image.html#relationships).
2. Add the `-replica` suffix to the name of the endpoint you want to use.

This results in the following configuration:

```yaml {configFile="app"}
relationships:
  {{% variable "RELATIONSHIP_NAME" %}}:
    service: {{% variable "SERVICE_NAME" %}}
    endpoint: {{% variable "ENDPOINT_NAME" %}}-replica
```

For example, if you define a `mariadb` database as follows:

```yaml {configFile="services"}
mariadb:
  type: mariadb:{{% latest "mariadb" %}}
  disk: 2048
    configuration:
      schemas:
        - main
    endpoints:
      admin:
        default_schema: main
        privileges:
          main: admin
      reporter:
        privileges:
          main: ro
```

To create a replica of the `mariadb` database and allow your app to connect to it
through the `admin` endpoint with admin permissions,
use the following configuration:

```yaml {configFile="app"}
relationships:
  mariadb:
    service: mariadb
    endpoint: admin-replica
```

To create a replica of the `mariadb` database and allow your app to connect to it
through the `reporter` endpoint with read-only permissions instead,
use the following configuration:

```yaml {configFile="app"}
relationships:
  mariadb:
    service: mariadb
    endpoint: reporter-replica
```

### Grant access to the main database and its replicas

{{< partial "banners/replicas/body.md" >}}

Your main database lives on one of the three nodes provided on Grid HA and {{% names/dedicated-gen-3 %}}.
The two other nodes can each accommodate a replica of your main database.

You may want to grant access to both your main database and its replicas.
To do so, when defining the relationship between your app and database,
make sure you do the following:

1. Use the [explicit endpoint syntax](/create-apps/app-reference/single-runtime-image.html#relationships).
2. Add the `-all` suffix to the name of the endpoint you want to use.

This results in the following configuration,
which creates a replica on each of the secondary nodes:

```yaml {configFile="app"}
relationships:
  {{% variable "RELATIONSHIP_NAME" %}}:
    service: {{% variable "SERVICE_NAME" %}}
    endpoint: {{% variable "ENDPOINT_NAME" %}}-all
```

For example, if you define a `mariadb` database as follows:

```yaml {configFile="services"}
mariadb:
  type: mariadb:{{% latest "mariadb" %}}
  disk: 2048
  configuration:
    schemas:
      - main
  endpoints:
    admin:
      default_schema: main
      privileges:
        main: admin
    reporter:
      privileges:
        main: ro
```

To allow your app to connect to your main database and both its replicas
through the `admin` endpoint with admin permissions,
use the following configuration:

```yaml {configFile="app"}
relationships:
  mariadb:
    service: mariadb
    endpoint: admin-all
```

To allow your app to connect to your main database and both its replicas
through the `reporter` endpoint with read-only permissions,
use the following configuration:

```yaml {configFile="app"}
relationships:
  mariadb:
    service: mariadb
    endpoint: reporter-all
```

## Multiple databases

With version `10.0` or later, you can define multiple databases.

To do so, define multiple `schemas` in your [service configuration](#configuration-options).

You can also specify multiple `endpoints` for [permissions](#define-permissions).
If neither `schemas` nor `endpoints` is included, it's equivalent to the following default:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
mariadb:
  type: mariadb:{{% latest "mariadb" %}}
  disk: 2048
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
# The name of the service container. Must be unique within a project.
mariadb:
  type: mariadb:{{% latest "mariadb" %}}
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

```yaml {configFile="app"}
name: myapp

[...]

# Relationships enable an app container's access to a service.
relationships:
  # Note that legacy definition of the relationship is still supported.
  # More information: https://docs.platform.sh/create-apps/app-reference/single-runtime-image.html#relationships
  database:
    service: mariadb
    endpoint: admin
  reports:
    service: mariadb
    endpoint: reporter
  imports:
    service: mariadb
    endpoint: importer
```

These relationships are then available in the [`{{< vendor/prefix >}}_RELATIONSHIPS` environment variable](#relationship-reference).
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
| `innodb_adaptive_hash_index`          | `integer` | `0` in version 10.5+ and `1` before that                     | Enable/Disable InnoDB Hash Index. See the [MariaDB documentation](https://mariadb.com/kb/en/innodb-system-variables/#innodb_adaptive_hash_index).                                     |
| `max_heap_table_size`                 | `integer` | `32`                                                         | The maximum size for user-created MEMORY tables in MB. Can be from `1` to `4096`.                                                                                                     |
| `table_definition_cache`              | `integer` | `400`                                                        | The number of table definitions that can be cached. See the [MariaDB documentation](https://mariadb.com/kb/en/server-system-variables/#table_definition_cache).                       |
| `table_open_cache`                    | `integer` | `400`                                                        | The maximum number of open tables cached in one table cache instance. See the [MariaDB documentation](https://mariadb.com/kb/en/server-system-variables/#table_open_cache).           |
| `wsrep_sync_wait`                     | `integer` | `0` (Disabled)                                               | Ensure execution of statements in fully synced nodes. See the [MariaDB documentation](https://mariadb.com/kb/en/galera-cluster-system-variables/#wsrep_sync_wait).                    |

An example of setting these properties:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
mariadb:
  type: mariadb:{{% latest "mariadb" %}}
  disk: 2048
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

{{% note theme="info" %}}
MariaDB configuration properties like [`max_connections`](https://mariadb.com/docs/server/ref/mdb/system-variables/max_connections/) and [`innodb_buffer_pool_size`](https://mariadb.com/kb/en/innodb-buffer-pool/#innodb_buffer_pool_size) are not directly configurable from `configuration.properties` in your services configuration.
They can, however, be set indirectly, which can be useful for solving `Too many connection` errors.
See [the troubleshooting documentation](/add-services/mysql/troubleshoot#too-many-connections) for more details.
{{% /note %}}

## Password generation

When you connect your app to a database,
an empty password is generated for the database by default.
This can cause issues with your app.

To generate real passwords for your database,
define custom endpoints in your [service configuration](#1-configure-the-service).
For each custom endpoint you create,
you get an automatically generated password,
similarly to when you create [multiple databases](#multiple-databases).
Note that you can't customize these automatically generated passwords.

After your custom endpoints are exposed as relationships in your [app configuration](../../create-apps/_index.md),
you can retrieve the password for each endpoint
through the `{{% vendor/prefix %}}_RELATIONSHIPS` [environment variable](../../development/variables/use-variables.md#use-provided-variables)
 within your [application containers](/development/variables/use-variables.md#access-variables-in-your-app).
The password value changes automatically over time, to avoid downtime its value has to be read dynamically by your app.
Globally speaking, having passwords hard-coded into your codebase can cause security issues and should be avoided.

When you switch from the default configuration with an empty password to custom endpoints,
make sure your service name remains unchanged.
Failure to do so results in the creation of a new service,
which removes any existing data from your database.

## Storage Engine

It's best to use the InnoDB storage engine wherever possible.
MyISAM is only properly supported in non-Dedicated environments.
In Dedicated environments, there is no replication of MyISAM tables.

If MyISAM tables have been inadvertently created or imported in a Dedicated environment
(if you see `ENGINE=MyISAM` in the response to `SHOW CREATE TABLE EXISTING_TABLE`),
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

In non-Dedicated environments, there is no on-site primary/replica supports.
In Dedicated environments, it's provided automatically as part of the default configuration.

In rare cases (such as for certain backup purposes),
you can also enable [remote replication](./mysql-replication.md) to your own replica data.
The replica isn't available to your application.

## Troubleshoot

If you run into issues, [troubleshoot MySQL](./troubleshoot.md).
