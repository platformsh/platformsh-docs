# MariaDB/MySQL (Database service)

MariaDB is a MySQL-compatible relational database system. Its XtraDB storage engine is equivalent to MySQL with InnoDB.

See the [MariaDB documentation](https://mariadb.org/learn/) or [MySQL documentation](https://dev.mysql.com/doc/refman/5.5/en/) for more information.

## Supported versions

* 10.0
* 10.1
* 10.2

> **note**
>
> Downgrades of MariaDB are not supported. MariaDB will update its own datafiles to a new version automatically but cannot downgrade them. If you want to experiment with a later version without committing to it use a non-master environment.

### Deprecated versions

The following versions are available but are not receiving security updates from upstream, so their use is not recommended. They will be removed at some point in the future.

* 5.5

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md#platformsh-provided-variables):

{% codesnippet "https://examples.docs.platform.sh/relationships/mysql", language="json" %}{% endcodesnippet %}

## Usage example

In your `.platform/services.yaml`:

```yaml
mydatabase:
    type: mysql:10.2
    disk: 1024
```

Note that the minimum disk size for mysql is 256MB.

In your `.platform.app.yaml`:

```yaml
relationships:
    database: "mydatabase:mysql"
```

You can then use the service in a configuration file of your application with something like:

{% codetabs name="PHP", type="php" -%}
<?php
// This assumes a fictional application with an array named $settings.
$relationships = getenv('PLATFORM_RELATIONSHIPS');
if ($relationships) {
	$relationships = json_decode(base64_decode($relationships), TRUE);

	// For a relationship named 'database' referring to one endpoint.
	if (!empty($relationships['database'])) {
		foreach ($relationships['database'] as $endpoint) {
			$settings['database_driver'] = 'pdo_' . $endpoint['scheme'];
			$settings['database_host'] = $endpoint['host'];
			$settings['database_name'] = $endpoint['path'];
			$settings['database_port'] = $endpoint['port'];
			$settings['database_user'] = $endpoint['username'];
			$settings['database_password'] = $endpoint['password'];
			break;
		}
	}
}
{%- language name="Python", type="py" -%}
import os
import json
import base64

relationships = os.getenv('PLATFORM_RELATIONSHIPS')
if relationships:
    relationships = json.loads(base64.b64decode(relationships).decode('utf-8'))
    db_settings = relationships['database'][0]
    DATABASES = {
        "default": {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': db_settings['path'],
            'USER': db_settings['username'],
            'PASSWORD': db_settings['password'],
            'HOST': db_settings['host'],
            'PORT': db_settings['port'],
        }
    }
{%- language name="Go", type="go" -%}
// Using the Platform.sh Go helper library: https://github.com/platformsh/gohelper

dbString, err := pi.SqlDsn("database")
if (err != nil) {
  panic(err)
}

db, err := sql.Open("mysql", dbString)
if (err != nil) {
  panic(err)
}
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
platform sql < my_database_snapshot.sql
```

That will run the database snapshot against the SQL database on Platform.sh.  That will work for any SQL file, so the usual caveats about importing an SQL dump apply (e.g., it's best to run against an empty database).  As with exporting, you can also specify a specific environment to use and a specific database relationship to use, if there are multiple.

```bash
platform sql --relationship database -e master < my_database_snapshot.sql
```

> **note**
> Importing a database snapshot is a destructive operation. It will overwrite data already in your database.
> Taking a snapshot or a database export before doing so is strongly recommended.

## Troubleshooting

### definer/invoker of view lack rights to use them

There is a single MySQL user, so you can not use "DEFINER" Access Control mechanism for Stored Programs and Views.

When creating a VIEW, you may need to explicitly set the SECURITY parameter to INVOKER, e.g...

```
CREATE OR REPLACE SQL SECURITY INVOKER 
VIEW `view_name` AS 
SELECT 
```

### MySQL server has gone away

Errors such as "PDO Exception 'MySQL server has gone away'" are usually simply the result of exhausting your existing diskspace. Be sure you have sufficient space allocated to the service in [.platform/services.yaml](/configuration/services.md).

The current disk usage can be checked using the CLI command `platform db:size`. Because of issues with the way InnoDB reports its size, this can out by up to 20%. As table space can grow rapidly, *it is usually advisable to make your database mount size twice the size reported by the `db:size` command*.

You are encouraged to add a [low-disk warning notification](/administration/integrations/notifications.html#low-disk-warning) to proactively warn of low disk space before it becomes an issue.

### Worker timeout

Another possible cause of "MySQL server has gone away" errors is a server timeout.  MySQL has a built-in timeout for idle connections, which defaults to 10 minutes.  Most typical web connections end long before that is ever approached, but it's possible that a long-running worker may idle and not need the database for longer than the timeout.  In that case the same "server has gone away" message may appear.

If that's the case, the best way to handle it is to wrap your connection logic in code that detects a "server has gone away" exception and tries to re-establish the connection.

Alternatively, if your worker is idle for too long it can self-terminate.  Platform.sh will automatically restart the worker process, and the new process can establish its own new database connection.
