# MariaDB/MySQL (Database service)

Platform.sh supports both MariaDB and Oracle MySQL.  While there are some differences at the application level for developers, they function nearly identically from an infrastructure point of view.

See the [MariaDB documentation](https://mariadb.org/learn/) or [MySQL documentation](https://dev.mysql.com/doc/refman/8.0/en/) for more information.

## Supported versions

The service types `mariadb` and `mysql` both refer to MariaDB for compatibility reasons. The service type `oracle-mysql` refers to MySQL as released by Oracle, Inc. Other than the type, MySQL and MariaDB are otherwise identical and the rest of this page refers to both equally.

* mariadb:10.0
* mariadb:10.1
* mariadb:10.2


* mysql:10.0
* mysql:10.1
* mysql:10.2


* oracle-mysql:5.7
* oracle-mysql:8.0

> **note**
>
> Downgrades of MySQL or MariaDB are not supported. Both will update their own datafiles to a new version automatically but cannot downgrade them. If you want to experiment with a later version without committing to it use a non-master environment.

### Deprecated versions

The following versions are available but are not receiving security updates from upstream, so their use is not recommended. They will be removed at some point in the future.

* mysql:5.5

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md#platformsh-provided-variables):

{% codesnippet "https://examples.docs.platform.sh/relationships/mysql", language="json" %}{% endcodesnippet %}

## Usage example

For MariaDB your `.platform/services.yaml` can use the `mysql` service type:

```yaml
mydatabase:
    type: mysql:10.2
    disk: 1024
```

or the `mariadb` service type.

```yaml
mymariadatabase:
    type: mariadb:10.2
    disk: 1024
```

Oracle-mysql uses the `oracle-mysql` service type:

```yaml
myoracledatabase:
    type: oracle-mysql:8.0
    disk: 1024
```

Note that the minimum disk size for `mysql`/`oracle-mysql` is 256MB.

Despite these service type differences, MariaDB and Oracle MySQL both use the `mysql` endpoint in their configuration.

For MariaDB, the endpoint does not change whether you used the `mysql` service type:

```yaml
relationships:
    database: "mydatabase:mysql"
```

or the `mariadb` service type:

```yaml
relationships:
    database: "mymariadatabase:mysql"
```

The same goes for using the `oracle-mysql` service type as well.

```yaml
relationships:
    database: "myoracledatabase:mysql"
```

You can then use the service in a configuration file of your application with something like:

{% codetabs name="Go", type="go", url="https://examples.docs.platform.sh/golang/mysql" -%}

{%- language name="Java", type="java", url="https://examples.docs.platform.sh/java/mysql" -%}

{%- language name="Node.js", type="js", url="https://examples.docs.platform.sh/nodejs/mysql" -%}

{%- language name="PHP", type="php", url="https://examples.docs.platform.sh/php/mysql" -%}

{%- language name="Python", type="py", url="https://examples.docs.platform.sh/python/mysql" -%}

{%- endcodetabs %}

> **note**
> MySQL schema names can not use system reserved namespace. (mysql, information_schema, etc)

## Multiple databases

If you are using version `10.0` or later of this service it is possible to define multiple databases as well as multiple users with different permissions.  To do so requires defining multiple endpoints.  Under the `configuration` key of your service there are two additional keys:

* `schemas`:  This is a YAML array listing the databases that should be created.  If not specified, a single database named `main` will be created.
* `endpoints`: This is a nested YAML array defining different credentials.  Each endpoint may have access to one or more schemas (databases), and may have different levels of permission on each.  The valid permission levels are:
  * `ro`: Using this endpoint only SELECT queries are allowed.
  * `rw`: Using this endpoint SELECT queries as well INSERT/UPDATE/DELETE queries are allowed.
  * `admin`: Using this endpoint all queries are allowed, including DDL queries (CREATE TABLE, DROP TABLE, etc.).

Consider the following illustrative example:

```yaml
mysqldb:
    type: mysql:10.0
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

This example creates a single MySQL/MariaDB service named `mysqldb`.  That server will have two databases, `main` and `legacy`.  There will be three endpoints created.  The first, named `admin`, will have full access to both databases.  The second, `reporter`, will have SELECT query access to the `main` DB but no access to `legacy` at all.  The `importer` user will have SELECT/INSERT/UPDATE/DELETE access (but not DDL access) to the `legacy` database but no access to `main`.

If a given endpoint has access to multiple databases you should also specify which will be listed by default in the relationships array.  If one isn't specified the `path` property of the relationship will be null.  While that may be acceptable for an application that knows the name of the database to connect to, it would mean that automated tools such as the Platform CLI will not be able to access the database on that relationship. For that reason the `default_schema` property is always recommended.

Once those endpoints are defined, you need to expose them to your application as a relationship.  Continuing with our example, this would be a possible corresponding block from `.platform.app.yaml`:

```yaml
relationships:
    database: "mysqldb:admin"
    reports: "mysqldb:reporter"
    imports: "mysqldb:importer"
```

This block defines three relationships, `database`, `reports`, and `imports`.  They'll be available in the `PLATFORM_RELATIONSHIPS` environment variable and all have the same structure documented above, but with different credentials.  You can use those to connect to the appropriate database with the specified restrictions using whatever the SQL access tools are for your language and application.

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

## Adjusting MariaDB configuration

For version 10.2 and later, a select few MariaDB configuration properties from the `my.cnf` file are available for adjustment.

At this time, only the `max_allowed_packet` size is available, and defaults to `16` (in MB).  Legal values are from `1` to `100`.

```yaml
mysqldb:
    type: mysql:10.2
    disk: 2048
    configuration:
        properties:
            max_allowed_packet: 64
```

The above code will increase the maximum allowed packet size (the size of a query or response) to 64 MB.  However, increasing the size of the maximum packet will also automatically decrease the `max_connections` value.  The number of connections allowed will depend on the packet size and the memory available to the service.  In most cases leaving this value at the default is recommended.

## Access your MariaDB service

Assuming your MariaDB relationship is named `database`, the host name and port number obtained from `PLATFORM_RELATIONSHIPS` would be `database.internal` and `3306`. Open an [SSH session](/development/ssh.md) and run the MySQL command line client.

```bash
mysql -h database.internal -P 3306 -u user main
```

Outside the application container, you can use Platform CLI `platform sql`.

## Exporting data

The easiest way to download all data in a MariaDB instance is with the Platform.sh CLI.  If you have a single SQL database, the following command will export all data using the `mysqldump` command to a local file:

```bash
platform db:dump
```

If you have multiple SQL databases it will prompt you which one to export. You can also specify one by relationship name explicitly:

```bash
platform db:dump --relationship database
```

By default the file will be uncompressed. If you want to compress it, use the `--gzip` (`-z`) option:

```bash
platform db:dump --gzip
```

You can use the `--stdout` option to pipe the result to another command. For example, if you want to create a bzip2-compressed file, you can run:

```bash
platform db:dump --stdout | bzip2 > dump.sql.bz2
```

## Importing data

The easiest way to load data into a database is to pipe an SQL dump through the `platform sql` command, like so:

```bash
platform sql < my_database_backup.sql
```

That will run the database backup against the SQL database on Platform.sh.  That will work for any SQL file, so the usual caveats about importing an SQL dump apply (e.g., it's best to run against an empty database).  As with exporting, you can also specify a specific environment to use and a specific database relationship to use, if there are multiple.

```bash
platform sql --relationship database -e master < my_database_backup.sql
```

> **note**
> Importing a database backup is a destructive operation. It will overwrite data already in your database.
> Taking a backup or a database export before doing so is strongly recommended.

## Troubleshooting

* [MySQL lock wait timeout](/development/troubleshoot.md#mysql-lock-wait-timeout)
* [definer/invoker of view lack rights to use them](/development/troubleshoot.md#mysql-definerinvoker-of-view-lack-rights-to-use-them)
* [MySQL server has gone away](/development/troubleshoot.html#mysql-server-has-gone-away)
