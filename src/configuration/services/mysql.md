# MariaDB/MySQL (Database service)

MariaDB is a MySQL-compatible relational database system. Its XtraDB storage engine is equivalent to MySQL with InnoDB.

See the [MariaDB documentation](https://mariadb.org/learn/) or [MySQL documentation](https://dev.mysql.com/doc/refman/5.5/en/) for more information.

## Supported versions

* 5.5
* 10.0
* 10.1
* 10.2

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md#platformsh-provided-variables):

```json
{
  "database": [
    {
      "host": "database.internal",
      "ip": "246.0.97.91",
      "password": "",
      "path": "main",
      "port": 3306,
      "query": {
          "is_master": true
      },
      "scheme": "mysql",
      "username": "user"
    }
  ]
}
```

## Usage example

In your `.platform/services.yaml`:

```yaml
mydatabase:
    type: mysql:10.0
    disk: 1024
```

In your `.platform.app.yaml`:

```yaml
relationships:
    database: "mydatabase:mysql"
```

You can then use the service in a configuration file of your application with something like:

{% codetabs name="PHP", type="php" -%}
<?php
$relationships = getenv("PLATFORM_RELATIONSHIPS");
if (!$relationships) {
  return;
}

$relationships = json_decode(base64_decode($relationships), TRUE);

foreach ($relationships['database'] as $endpoint) {
  if (empty($endpoint['query']['is_master'])) {
    continue;
  }
  $container->setParameter('database_driver', 'pdo_' . $endpoint['scheme']);
  $container->setParameter('database_host', $endpoint['host']);
  $container->setParameter('database_port', $endpoint['port']);
  $container->setParameter('database_name', $endpoint['path']);
  $container->setParameter('database_user', $endpoint['username']);
  $container->setParameter('database_password', $endpoint['password']);
  $container->setParameter('database_path', '');
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

**notes**
1. There is a single MySQL user, so you can not use "DEFINER" Access Control mechanism for Stored Programs and Views.
2. MySQL Errors such as "PDO Exception 'MySQL server has gone away'" are usually simply the result of exhausting your existing diskspace. Be sure you have sufficient space allocated to the service in [.platform/services.yaml](/configuration/services.md).


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
                privileges:
                    legacy: rw
```

This example creates a single MySQL/MariaDB service named `mysqldb`.  That server will have two databases, `main` and `legacy`.  There will be three endpoints created.  The first, named `admin`, will have full access to both databases.  The second, `reporter`, will have SELECT query access to the `main` DB but no access to `legacy` at all.  The `importer` user will have SELECT/INSERT/UPDATE/DELETE access (but not DDL access) to the `legacy` database but no access to `main`.

If a given endpoint has access to multiple databases you should also specify which will be listed by default in the relationships array.  If one isn't specified the `path` property of the relationship will be null.  If there is only one database listed it will be used and `default_schema` is unnecessary.

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
