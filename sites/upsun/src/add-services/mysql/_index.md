---
title: "MariaDB/MySQL (database service)"
weight: -60
sidebarTitle: "MariaDB/MySQL"
description: See how to configure a MariaDB/MySQL server to store your data.
layout: single
---

{{% vendor/name %}} supports both MariaDB and Oracle MySQL to manage your relational databases.
Their infrastructure setup is nearly identical, though they differ in some features.
See the [MariaDB documentation](https://mariadb.org/documentation/)
or the Oracle [MySQL Server documentation](https://dev.mysql.com/doc/refman/en/) for more information.

{{% note theme="info" title="MariaDB note" %}}
The [example](#mariadb-example) provided later in this topic is specific to using only a **primary** MariaDB database. For details about using read-only replicas to improve performance of read-heavy applications, see the [MariaDB read-only replication](/add-services/mysql/mysql-readonly-replication.md) topic.
{{% /note %}}


## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like.
When you deploy your app, you always get the latest available patches.

{{< note theme="info" title="" >}}
- Both `mariadb` and `mysql` service types use MariaDB.\
  They behave identically, so the information on this page applies to both of them.
- The service type `oracle-mysql` refers to MySQL as released by Oracle, Inc.
{{< /note >}}

| **`mariadb` / `mysql`** | **`oracle-mysql`** |
|-------------------------|--------------------|
|  {{< image-versions image="mariadb" status="supported" >}} | {{< image-versions image="oracle-mysql" status="supported" >}} |

{{% deprecated-versions %}}

| **`mariadb` / `mysql`** | **`oracle-mysql`** |
|-------------------------|--------------------|
|  {{< image-versions image="mariadb" status="deprecated" >}} | {{< image-versions image="oracle-mysql" status="deprecated" >}} |

### Upgrade, change, or downgrade a service

{{% note theme="caution" title="Caution" %}}
Upgrading and downgrading a service version or changing a service type are destructive processes that delete the existing service and its data. 

A best practice is to first back up your environment and export the data.  
{{% /note %}}

To prevent data loss after completing either of these actions, follow these steps:

1. [Back up your environment](/environments/backup.html#create-a-manual-backup). If you accidentally delete the wrong service or make an error in your `config.yaml` file and need to revert your entire environment, the backup enables you to do so. 
1. [Export the data](#exporting-data). Exporting the data to a portable file enables you to import it later. You cannot import data directly from a backup of your environment.  
1. Change the service type in your [service configuration](/add-services/_index.md):
    - **Upgrade:** Upgrade sequentially from one supported version to another (10.6 -> 10.11 -> 11.4),
and check that each upgrade commit translates into an actual deployment.   
    - **Change or downgrade:** Specify the new service type and the desired version.
1. [Import your data](#importing-data) into the new service.

## Relationship reference

For each service [defined via a relationship](#usage-example) to your application,
{{% vendor/name %}} automatically generates corresponding environment variables within your application container,
in the ``$<RELATIONSHIP-NAME>_<SERVICE-PROPERTY>`` format.

Here is example information available through the [service environment variables](/development/variables/_index.md#service-environment-variables) themselves,
or through the [``PLATFORM_RELATIONSHIPS`` environment variable](development/variables/use-variables.md#use-provided-variables).

### MariaDB reference

{{< codetabs >}}
+++
title= Service environment variables
+++

You can obtain the complete list of available service environment variables in your app container by running ``{{% vendor/cli %}} ssh env``.

Service connection details can change whenever your app restarts or redeploys. To keep your connection stable, use [service environment variables](/development/variables/_index.md#service-environment-variables) rather than hard-coding values.

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
export RELATIONSHIPS_JSON="$(echo "$PLATFORM_RELATIONSHIPS" | base64 --decode)"

# Set environment variables for individual credentials.
export APP_DATABASE_HOST="$(echo "$PLATFORM_RELATIONSHIPS" | base64 --decode | jq -r ".mariadb[0].host")"
```

{{< /codetabs >}}

### Oracle MySQL reference

{{< codetabs >}}
+++
title= Service environment variables
+++

You can obtain the complete list of available service environment variables in your app container by running ``{{% vendor/cli %}} ssh env``.

Service connection details can change whenever your app restarts or redeploys. **To keep your connection stable, use [service environment variables](/development/variables/_index.md#service-environment-variables) rather than hard-coding values.**

```bash
ORACLE_MYSQL_USERNAME=user
ORACLE_MYSQL_SCHEME=mysql
ORACLE_MYSQL_SERVICE=oracle-mysql
ORACLE_MYSQL_FRAGMENT=
ORACLE_MYSQL_IP=123.456.78.90
ORACLE_MYSQL_HOSTNAME=azertyuiopqsdfghjklm.oracle-mysql.service._.eu-1.{{< vendor/urlraw "hostname" >}}
ORACLE_MYSQL_PORT=3306
ORACLE_MYSQL_CLUSTER=azertyuiop-main-afdwftq
ORACLE_MYSQL_HOST=oraclemysql.internal
ORACLE_MYSQL_REL=mysql
ORACLE_MYSQL_PATH=main
ORACLE_MYSQL_QUERY={'is_master': True}
ORACLE_MYSQL_PASSWORD=
ORACLE_MYSQL_EPOCH=0
ORACLE_MYSQL_TYPE=oracle-mysql:{{< latest "oracle-mysql" >}}
ORACLE_MYSQL_PUBLIC=false
ORACLE_MYSQL_HOST_MAPPED=false
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
  "host": "oracle_mysql.internal",
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
export RELATIONSHIPS_JSON="$(echo "$PLATFORM_RELATIONSHIPS" | base64 --decode)"

# Set environment variables for individual credentials.
export APP_ORACLE_HOST="$(echo "$RELATIONSHIPS_JSON" | jq -r '.oraclemysql[0].host')"
```

{{< /codetabs >}}

## Usage example

Configure your service with at least 256 MB in disk space.

### 1. Configure the service

To define the service, use the ``mariadb`` or ``mysql`` type for MariaDB or the ``oracle-mysql`` type for Oracle MySQL :

```yaml {configFile="app"}
services:
  # The name of the service container. Must be unique within a project.
  <SERVICE_NAME>:
    type: mariadb:<VERSION>
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
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      <SERVICE_NAME>:
```

You can define ``<SERVICE_NAME>`` as you like, so long as it’s unique between all defined services and matches in both the application and services configuration.

The example above leverages [default endpoint](/create-apps/image-properties/relationships.md) configuration for relationships.
That is, it uses default endpoints behind-the-scenes,
providing a [relationship](/create-apps/image-properties/relationships.md) (the network address a service is accessible from) that is identical to the name of that service.

Depending on your needs, instead of default endpoint configuration, you can use [explicit endpoint configuration](/create-apps/image-properties/relationships.md).

With the above definition, the application container (``<APP_NAME>``) now has [access to the service](#use-in-app) via the relationship ``<SERVICE_NAME>`` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      <RELATIONSHIP_NAME>:
        service: <SERVICE_NAME>
        endpoint: mysql
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/image-properties/relationships.md) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/image-properties/relationships.md).

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<RELATIONSHIP_NAME>` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

{{< /codetabs >}}

### MariaDB example

{{% note theme="info" %}}
Use the steps and sample code below if your application will connect to a **primary** MariaDB database. For details about using read-only replicas to improve performance of read-heavy applications, see the [MariaDB read-only replication](/add-services/mysql/mysql-readonly-replication.md) topic.
{{% /note %}}

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      mariadb:
services:
  # The name of the service container. Must be unique within a project.
  mariadb:
    type: mariadb:{{% latest "mariadb" %}}
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      mariadb:
        service: mariadb
        endpoint: mysql
services:
# The name of the service container. Must be unique within a project.
  mariadb:
    type: mariadb:{{% latest "mariadb" %}}
```

{{< /codetabs >}}

### OracleMySQL example

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # The location of the application's code.
    relationships:
      oracle-mysql:
service:
  # The name of the service container. Must be unique within a project.
  oracle-mysql:
    type: oracle-mysql:{{% latest "oracle-mysql" %}}
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      oracle-mysql:
        service: oracle-mysql_service
        endpoint: mysql
service:
  # The name of the service container. Must be unique within a project.
  oracle-mysql_service:
    type: oracle-mysql:{{% latest "oracle-mysql" %}}
```

{{< /codetabs >}}


### Use in app

To use the configured service in your app, add a configuration file similar to the following to your project.

{{< codetabs >}}

+++
title=Using default endpoints
+++

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

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # The location of the application's code.
    source:
      root: "myapp"

    [...]

    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      mariadb:
        service: mariadb
        endpoint: mysql
service:
  mariadb:
    type: mariadb:{{% latest "mariadb" %}}
```

{{< /codetabs >}}


This configuration defines a single application (``myapp``), whose source code exists in the ``<PROJECT_ROOT>/myapp`` directory.
``myapp`` has access to the ``mariadb`` service, via a relationship whose name is [identical to the service name](#2-define-the-relationship)
(as per [default endpoint](/create-apps/image-properties/relationships.md) configuration for relationships).

From this, ``myapp`` can retrieve access credentials to the service through the [relationship environment variables](#relationship-reference).

```bash {location="myapp/.environment"}
# Set environment variables for individual credentials.
# For more information, please visit {{< vendor/urlraw "docs" >}}/development/variables.html#service-environment-variables.
export DB_CONNECTION="${MARIADB_SCHEME}"
export DB_USERNAME="${MARIADB_USERNAME}"
export DB_PASSWORD="${MARIADB_PASSWORD}"
export DB_HOST="${MARIADB_HOST}"
export DB_PORT="${MARIADB_PORT}"
export DB_DATABASE="${MARIADB_PATH}"

# Surface connection string variable for use in app.
export DATABASE_URL="${DB_CONNECTION}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
```

The above file — ``.environment`` in the ``myapp`` directory — is automatically sourced by {{% vendor/name %}} into the runtime environment, so that the variable ``MARIADB_URL`` can be used within the application to connect to the service.

Note that ``DATABASE_URL``, and all {{% vendor/name %}} [service environment variables](/development/variables/_index.md#service-environment-variables) like ``MARIADB_HOST``,
are environment-dependent.
Unlike the build produced for a given commit,
they can’t be reused across environments and only allow your app to connect to a single service instance on a single environment.

A file very similar to this is generated automatically for your when using the ``{{% vendor/cli %}} ify`` command to [migrate a codebase to {{% vendor/name %}}](/get-started/_index.md).

### Configure connections

There may be cases where you want to configure a database connection manually.

To get the URL to connect to the database, run the following command:

```bash
{{% vendor/cli %}} ssh env
```

The result is the complete [information for all relationships](#relationship-reference) with an additional `DATABASE_URL` property, defined on step [Use in app](#use-in-app).
<BR>Use the `DATABASE_URL` property as your connection.

You can obtain the complete list of available service environment variables in your app container by running ``{{% vendor/cli %}} ssh env``.

Service connection details can change whenever your app restarts or redeploys. **To keep your connection stable, use [service environment variables](/development/variables/_index.md#service-environment-variables) rather than hard-coding values.**

You can also see a guide on how to [convert the `{{< vendor/prefix >}}_RELATIONSHIPS` environment variable to a different form](https://support.platform.sh/hc/en-us/community/posts/16439596373010).

## Configuration options {#configuration-options}

You can configure your MySQL service in the [services configuration](../_index.md) with the following options:

| Name               | Type                       | Version                            | Description |
| ------------------ | -------------------------- | ---------------------------------- | ----------- |
| `schemas`          | `string` array     | 10.0+                              | All databases to be created. Defaults to a single `main` database. |
| `endpoints`        | An endpoints dictionary    | 10.0+                              | Endpoints with their permissions. See [multiple databases](#multiple-databases). |
| `properties`       | A properties dictionary    | MariaDB: 10.1+; Oracle MySQL: 8.0+ | Additional properties for the database. Equivalent to using a `my.cnf` file. See [property options](#configure-the-database). |
| `rotate_passwords` | A boolean                  | 10.3+                              | Defaults to `true`. When set to `false`, [password rotation](#password-rotation) is disabled. |

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
| `privileges`     | A permissions dictionary |          | For each defined schema, specifies the permissions of the endpoint. |

Available permissions:

| Name              | Type                | Description                                                                                                                                                                                                                                                                |
|-------------------|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Read-only         | `ro`                | Can select, create temporary tables, and see views.                                                                                                                                                                                                                        |
| Read-write        | `rw`                | In addition to read-only permissions, can also insert, update, delete, manage and execute events, execute routines, create and drop indexes, manage and execute triggers, and lock tables.                                                                                 |
| Admin             | `admin`             | In addition to read-write permissions, can also create, drop, and alter tables; create views; and create and alter routines.                                                                                                                                               |
| Replication       | `replication`       | For [replicating databases](/add-services/mysql/mysql-replication.md). In addition to read-only permissions, can also lock tables.                                                                                                                                         |
| Replication admin | `replication-admin` | For managing replicas across projects; can run statements such as SHOW REPLICA STATUS, CHANGE MASTER TO, START REPLICA, and so on (see this related [Dev Center article](https://devcenter.upsun.com/posts/connect-multiple-projects-applications-or-services-together/)). |

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

    # Relationships enable access from this app to a given service.
    # The example below shows configuration with explicitly set service names and endpoints.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
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

{{% note theme="info" %}}
MariaDB configuration properties like [`max_connections`](https://mariadb.com/docs/server/server-management/variables-and-modes/server-system-variables#max_connections) and [`innodb_buffer_pool_size`](https://mariadb.com/kb/en/innodb-buffer-pool/#innodb_buffer_pool_size) are not directly configurable from `configuration.properties` in your services configuration.
They can, however, be set indirectly, which can be useful for solving `Too many connection` errors.
See [the troubleshooting documentation](/add-services/mysql/troubleshoot.md#too-many-connections) for more details.
{{% /note %}}

## Password generation {#password-generation}

If your YAML file does not specify a `schema` and `endpoint` for the MariaDB or MySQL service, no password is generated. 

Because your database is isolated on a private network and cannot be seen from the internet, you can omit a password without compromising security. This simplifies your workflow by removing the need to manage credentials, while container isolation ensures that only your application can access the data.

If you prefer to have Upsun generate a password, you must define [`schemas` and custom `endpoints`](#1-configure-the-service) in the `services` configuration – see the example in the [multiple databases](#multiple-databases) section of this topic.
For each custom endpoint that you define, Upsun generates a password. Note that you cannot customize these generated passwords.

{{% note %}}
Make sure you don't change `services.<SERVICE_NAME>`. **Changing the service name creates a new service,
which removes existing data from your database.**
{{% /note %}}

After your custom endpoints are exposed as relationships in your [app configuration](../../create-apps/_index.md),
you can retrieve the password for each endpoint
through the `{{% vendor/prefix %}}_RELATIONSHIPS` [environment variable](../../development/variables/use-variables.md#use-provided-variables)
 within your [application containers](/development/variables/use-variables.md#access-variables-in-your-app).

Using this method to retrieve password credentials is considered a best practice: passwords change automatically (or [_rotate_](#password-rotation)) over time, and using incorrect passwords results in application downtime. **Avoid using hard-coded passwords in your application (and code base), which can cause security issues.**

## Password rotation {#password-rotation}

{{% note %}} 
For rotation to occur, you must define a `schema` and `endpoint` in your service configuration (see [Password generation](#password-generation) above); otherwise, no password is generated to be rotated.
{{% /note %}}

By default, password rotation is enabled (`rotate_passwords: true`), which enables {{% vendor/name %}} to automatically rotate MariaDB passwords during image updates or as defined by MariaDB lifetime settings. 

Specific scenarios might warrant disabling password rotation by [setting `rotate_passwords=false`](/add-services/mysql.md#configuration-options): for example, choosing to accommodate users who access a database via an SSH tunnel and provide a password in their request because they cannot retrieve the database credentials stored in the [service or `$PLATFORM_RELATIONSHIPS` MariaDB environment variables](#mariadb-reference).

Passwords do **not** rotate automatically when you reset this value to `true`.

{{% note title="Important" theme="warning" %}}
Disabling password rotation can jeopardize compliance with security certifications - make sure you weigh this risk alongside the convenience of SSH-tunneling access.
{{% /note %}}

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
you can also enable [remote replication](/add-services/mysql/mysql-replication.md) to your own replica data.
The replica isn't available to your application.

## Troubleshoot

If you run into issues, [troubleshoot MySQL](/add-services/mysql/troubleshoot.md).
