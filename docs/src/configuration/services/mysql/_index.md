---
title: "MariaDB/MySQL (database service)"
weight: 7
sidebarTitle: "MariaDB/MySQL"
description: See how to configure a MariaDB/MySQL server to store your data.
layout: single
---

Platform.sh supports both MariaDB and Oracle MySQL to manage your relational databases.
Their infrastructure setup is is nearly identical, though they differ in some features.
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

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md#platformsh-provided-variables):

{{< relationship "mysql" >}}

## Usage example

For MariaDB your `.platform/services.yaml` use `mariadb` service type:

{{< readFile file="src/registry/images/examples/full/mariadb.services.yaml" highlight="yaml" >}}

Oracle-mysql uses the `oracle-mysql` service type:

{{< readFile file="src/registry/images/examples/full/oracle-mysql.services.yaml" highlight="yaml" >}}

Note that the minimum disk size for `mysql`/`oracle-mysql` is 256MB.

Despite these service type differences, MariaDB and Oracle MySQL both use the `mysql` endpoint in their configuration.

{{< endpoint-description "mariadb" "#multiple-databases" "databases" >}}

You can then use the service in a configuration file of your application with something like:

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

{{< note >}}

MySQL schema names can not use system reserved namespaces (such as `mysql`, `information_schema`).

{{< /note >}}

## Multiple databases

If you are using version `10.0` or later of this service,
it is possible to define multiple databases as well as multiple users with different permissions.
To do so requires defining multiple endpoints.
Under the `configuration` key of your service there are two additional keys:

* `schemas`:  This is a YAML array listing the databases that should be created.
  If not specified, a single database named `main` will be created.
* `endpoints`: This is a nested YAML array defining different credentials.
  Each endpoint may have access to one or more schemas (databases), and may have different levels of permission on each.
  The valid permission levels are:
  * `ro`: Using this endpoint only SELECT queries are allowed.
  * `rw`: Using this endpoint SELECT queries as well INSERT/UPDATE/DELETE queries are allowed.
  * `admin`: Using this endpoint all queries are allowed, including DDL queries (such as `CREATE TABLE`, `DROP TABLE`).

Consider the following illustrative example:

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

This example creates a single MySQL/MariaDB service named `mysqldb`.
That server will have two databases, `main` and `legacy`.
There will be three endpoints created
 The first, named `admin`, will have full access to both databases.
 The second, `reporter`, will have SELECT query access to the `main` DB but no access to `legacy` at all.
 The `importer` user will have SELECT/INSERT/UPDATE/DELETE access (but not DDL access) to the `legacy` database but no access to `main`.

If a given endpoint has access to multiple databases,
you should also specify which will be listed by default in the relationships array.
If one isn't specified the `path` property of the relationship will be null.
While that may be acceptable for an application that knows the name of the database to connect to,
it would mean that automated tools such as the Platform CLI will not be able to access the database on that relationship.
For that reason the `default_schema` property is always recommended.

Once those endpoints are defined, you need to expose them to your application as a relationship.
Continuing with our example, this would be a possible corresponding block from `.platform.app.yaml`:

```yaml
relationships:
    database: "db:admin"
    reports: "db:reporter"
    imports: "db:importer"
```

This block defines three relationships, `database`, `reports`, and `imports`. They'll be available in the `PLATFORM_RELATIONSHIPS` environment variable and all have the same structure documented above, but with different credentials. You can use those to connect to the appropriate database with the specified restrictions using whatever the SQL access tools are for your language and application.

If no `configuration` block is specified at all, it is equivalent to the following default:

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

If either schemas or endpoints are defined, then no default will be applied and you must specify the full configuration.

## Adjusting database configuration

For MariaDB 10.1 and later and Oracle MySQL 8.0 and later,
a select few configuration properties from the `my.cnf` file are available for adjustment.

### Packet and connection sizing

This value defaults to `16` (in MB). Legal values are from `1` to `100`.

```yaml
db:
    type: mariadb:10.5
    disk: 2048
    configuration:
        properties:
            max_allowed_packet: 64
```

The above code will increase the maximum allowed packet size (the size of a query or response) to 64 MB.
However, increasing the size of the maximum packet will also automatically decrease the `max_connections` value.
The number of connections allowed will depend on the packet size and the memory available to the service.
In most cases leaving this value at the default is recommended.

## Character encoding

For services created prior to February 2020, the default character set and collation is `latin1`,
which is the default in most MySQL/MariaDB.

For services created after February 2020, the default character set is `utf8mb4` and the default collation is `utf8mb4_unicode_ci`.

Both values can be adjusted at the server level in `services.yaml`:

```yaml
db:
    type: mariadb:10.5
    disk: 2048
    configuration:
        properties:
            default_charset: utf8mb4
            default_collation: utf8mb4_unicode_ci
```

Note that the effect of this setting is to set the character set and collation of any tables created once those properties are set.
Tables created prior to when those settings are changed will be unaffected by changes to the `services.yaml` configuration.
However, you can change your own table's character set and collation through `ALTER TABLE` commands.
For example:

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

We recommend using the InnoDB storage engine wherever possible.
MyISAM is only properly supported in Grid environments.
In dedicated cluster environments there is no replication of MyISAM tables.

If MyISAM tables have been inadvertently created or imported in a dedicated environment
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

## Access your MariaDB service

Assuming your MariaDB relationship is named `database`,
the host name and port number obtained from `PLATFORM_RELATIONSHIPS` would be `database.internal` and `3306`.
Open an [SSH session](/development/ssh/_index.md) and run the MySQL command line client.

```bash
mysql -h database.internal -P 3306 -u user main
```

If your database relationship has a password, you need to pass the `-p` switch and enter the password when prompted:

```bash
mysql -h database.internal -P 3306 -u user -p main
```

Outside the application container, you can use Platform CLI `platform sql`.

## Exporting data

The easiest way to download all data in a MariaDB instance is with the Platform.sh CLI.
If you have a single SQL database, the following command will export all data using the `mysqldump` command to a local file:

```bash
platform db:dump
```

If you have multiple SQL databases it will prompt you which one to export.
You can also specify one by relationship name explicitly:

```bash
platform db:dump --relationship database
```

By default the file will be uncompressed.
If you want to compress it, use the `--gzip` (`-z`) option:

```bash
platform db:dump --gzip
```

You can use the `--stdout` option to pipe the result to another command.
For example, if you want to create a bzip2-compressed file, you can run:

```bash
platform db:dump --stdout | bzip2 > dump.sql.bz2
```

## Importing data

The easiest way to load data into a database is to pipe an SQL dump through the `platform sql` command, like so:

```bash
platform sql < my_database_backup.sql
```

That runs the database backup against the SQL database on Platform.sh.
That works for any SQL file, so the usual caveats about importing an SQL dump apply
(for example, it's best to run against an empty database).
As with exporting, you can also specify a specific environment to use and a specific database relationship to use, if there are multiple.

```bash
platform sql --relationship database -e <BRANCH_NAME> < my_database_backup.sql
```

{{< note >}}

Importing a database backup is a destructive operation.
It overwrites data already in your database.
Taking a backup or a database export before doing so is strongly recommended.

{{< /note >}}

## Replication

On-site primary/replica support is not available on Grid plans.
On a Dedicated environment, it is provided automatically as part of the default configuration.

In abnormal cases you may also enable [remote replication](/guides/general/mysql-replication.md) to your own replica data.
This is an advanced configuration not appropriate for most circumstances
(and the replica will not be available to your application),
but may be useful for certain backup purposes.

## Troubleshoot

If you run into issues, [troubleshoot MySQL](./troubleshoot.md).