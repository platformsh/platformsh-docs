# PostgreSQL (Database service)

PostgreSQL is a high-performance, standards-compliant relational SQL database.

See the [PostgreSQL documentation](https://www.postgresql.org/docs/9.6/static/index.html) for more information.

## Supported versions

* 9.3
* 9.6

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/administration/variables.md#platformsh-provided-variables):

```json
{
    "database": [
        {
            "username": "main",
            "password": "main",
            "host": "248.0.65.196",
            "query": {
                "is_master": true
            },
            "path": "main",
            "scheme": "pgsql",
            "port": 5432
        }
    ]
}
```

## Usage example

In your `.platform/services.yaml` add:

```yaml
mydatabase:
    type: postgresql:9.6
    disk: 1024
```

Add a relationship to the service in your ``.platform.app.yaml``:

```yaml
relationships:
    database: "mydatabase:postgresql"
```

For PHP, in your `.platform.app.yaml` add:

```yaml
runtime:
    extensions:
        - pdo_pgsql
```

You can then use the service in a configuration file of your application with something like:



{% codetabs name="PHP", type="php" -%}
<?php
// This assumes a fictional application with an array named $settings.
if (getenv('PLATFORM_RELATIONSHIPS')) {
	$relationships = json_decode(base64_decode($relationships), TRUE);

	// For a relationship named 'database' referring to one endpoint.
	if (!empty($relationships['database'])) {
		foreach ($relationships['database'] as $endpoint) {
			$settings['database_driver'] = 'pdo_' . $endpoint['scheme'];
			$settings['database_host'] = $endpoint['host'];
			$settings['database_name'] = $endpoint['path'];
			$settings['database_port'] = $endpoint['port'];
			$settings['database_user'] = $endpoint['user'];
			$settings['database_password'] = $endpoint['password'];
			break;
		}
	}
}
{%- language name="Python", type="py" -%}
relationships = os.getenv('PLATFORM_RELATIONSHIPS')
if relationships:
    relationships = json.loads(base64.b64decode(relationships).decode('utf-8'))
    db_settings = relationships['database'][0]
    DATABASES = {
        "default": {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': db_settings['path'],
            'USER': db_settings['username'],
            'PASSWORD': db_settings['password'],
            'HOST': db_settings['host'],
            'PORT': db_settings['port'],
        }
    }
{%- language name="NodeJS", type="js" -%}
// Using the Platform.sh JS helper library: https://github.com/platformsh/platformsh-nodejs-helper

var config = require("platformsh").config();

if (config.relationships != null) {
  var db = config.relationships.first_db[0]

  const connObj = {
      user: database.username,
      database: database.path,
      password: database.password,
      host: database.host
  };

  const pg = require('pg');

  pg.connectAsync(connObj)...;
}

{%- language name="Go", type="go" -%}
// Using the Platform.sh Go helper library: https://github.com/platformsh/gohelper

dbString, err := pi.SqlDsn("database")
if (err != nil) {
  panic(err)
}

db, err := sql.Open("postgres", dbString)
if (err != nil) {
  panic(err)
}
{%- endcodetabs %}

## Exporting data

The easiest way to download all data in a PostgreSQL instance is with the Platform CLI.  If you have a single SQL database, the following command will export all data using the `pg_dump` command to a local file:

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

## Extensions

Platform.sh supports a number of PostgreSQL extensions.  To enable them, list them under the `configuration.extensions` key in your `services.yaml` file, like so:

```yaml
postgresql:
    type: "postgresql:9.6"
    disk: 1025
    configuration:
        extensions:
            - pg_trgm
            - hstore
```

In this case you will have `pg_trgm` installed, providing functions to determine the similarity of text based on trigram matching, and `hstore` providing a key-value store.

### Available extensions

The following is the extensive list of supported extensions. Note that you cannot currently add custom 
extensions not listed here.

* **adminpack**       - File and log manipulation routines, used by pgAdmin
* **btree_gist**      - B-Tree indexing using GiST (Generalised Search Tree)
* **chkpass**         - An auto-encrypted password datatype
* **cube**            - Multidimensional-cube datatype (GiST indexing example)
* **dblink**          - Functions to return results from a remote database
* **earthdistance**   - Operator for computing the distance (in miles) between two points on the earth's surface
* **fuzzystrmatch**   - Levenshtein, metaphone, and soundex fuzzy string matching
* **hstore**          - Store (key, value) pairs
* **intagg**          - Integer aggregator/enumerator
* **_int**            - Index support for arrays of int4, using GiST (benchmark needs the libdbd-pg-perl package)
* **isn**             - type extensions for ISBN, ISSN, ISMN, EAN13 product numbers
* **lo**              - Large Object maintenance
* **ltree**           - Tree-like data structures
* **oid2name**        - Maps OIDs to table names
* **pageinspect**     - Inspection of database pages
* **passwordcheck**   - Simple password strength checker
* **pg_buffercache**  - Real time queries on the shared buffer cache
* **pg_freespacemap** - Displays the contents of the free space map (FSM)
* **pg_trgm**         - Determine the similarity of text based on trigram matching
* **pg_standby**      - Create a warm stand-by server
* **pgbench**         - TPC-B like benchmark
* **pgcrypto**        - Cryptographic functions
* **pgrowlocks**      - A function to return row locking information
* **pgstattuple**     - Returns the percentage of dead tuples in a table; this indicates whether a vacuum is required.
* ** postgis**        - A GIS geographic data library
* **postgresql_fdw**  - foreign data wrapper for PostgreSQL
* **seg**             - Confidence-interval datatype (GiST indexing example)
* **sepgsql**         - mandatory access control (MAC) based on SELinux
* **spi**             - PostgreSQL Server Programming Interface
* **tablefunc**       - examples of functions returning tables
* **uuid-ossp**       - UUID generation functions
* **vacuumlo**        - Remove orphaned large objects


## Notes

### Could not find driver

If you see this error: ``Fatal error: Uncaught exception 'PDOException' with message 'could not find driver'``, this means you are missing the ``pdo_pgsql`` PHP extension. You simply need to enable it in your ``.platform.app.yaml`` (see above).

## Upgrading

Although PostgreSQL includes the `pg_upgrade` command for direct migration of data between versions, the process for using it requires both the old and new versions to be installed side by side, and sometimes requires user intervention. For that reason, we don't support transparent updates from one PostgreSQL version to another (such as from 9.3 to 9.6). Accordingly, upgrading between major versions of PostgreSQL requires a manual dump and restore of the data.

To minimize the downtime associated with such upgrades, we suggest the following process:

1. Create a development environment that you can use to test the upgrade process.
2. Create a new service for the new PostgreSQL version (alongside the existing one), and point your application container's existing relationship at the new service.
3. Add a new relationship to expose the service running the older PostgreSQL version
4. Add a [deploy hook](#example-deploy-hook) that migrates the data from the old service to the new one. This prevents the application from loading and modifying the database during the migration.
5. Make a Git commit with these changes, and push it into the development environment that you're testing with.
6. In the development environment, review `/var/log/deploy.log` to confirm that the migration was successful, inspect the database, and test your application as needed to confirm that the migration was successful and that the application works with the new PostgreSQL version.
7. When you're ready to upgrade the database on your master environment, start off by triggering a fresh snapshot of the master environment's data. This will give you the ability to roll back the upgrade process in case something goes wrong.
8. Push the same commit from step 5 into your project's master branch. This will carry out the migration in your production environment.
9. Finally, push out another commit that removes the old database service and the deploy hook used for migration, which is no longer needed now that the upgrade process is finished.

**Note**
If your database is too large to duplicate within your plan size, we'd suggest temporarily raising your plan limits. Charges are prorated, so you'll only be billed for a single day of increased usage. However, you can also use a development environment to perform the migration:
1. Put your master environment's application into maintenance mode, if possible, to prevent it from trying to read from or write to the database during the migration.
2. Create an up-to-date copy of your database by cloning a development environment from master.
3. Rename the master environment's postgresql service, and switch the version to 9.6. Renaming ensures that the service's storage is reset, which is necessary to avoid exposing the 9.6 server to incompatible data from version 9.3.
4. Open an SSH session in your master environment, with agent forwarding enabled (so you can SSH from master to your development environment).
5. Now, use SSH to run `pg_dump` on the development environment, and pipe the data from SSH into a `pg_restore` command running in the master environment. You can use the [sample deploy hook](#example-deploy-hook) below as a starting point. You'll need to create a .pgpass file on the development environment, and also wrap the `pg_dump` invocation in a call to `ssh`.

### Example deploy hook

Here's a sample deploy hook that you can use to implement the migration between versions:

```yaml
hooks:
    deploy: |
        OLD_RELATIONSHIP_NAME=postgresql_9.3.internal
        NEW_RELATIONSHIP_NAME=postgresql_9.6.internal
        export PGPASSFILE=/tmp/pgpass/.pgpass
        mkdir -p /tmp/pgpass
        chmod -R go-rwx /tmp/pgpass
        cat > $PGPASSFILE <<EOF
        $OLD_RELATIONSHIP_NAME:5432:main:main:main
        $NEW_RELATIONSHIP_NAME:5432:main:main:main
        EOF
        chmod go-rwx $PGPASSFILE

        pg_dump \
            --format custom \
            --host=$OLD_RELATIONSHIP_NAME \
            --port=5432 \
            --dbname=main \
            --username=main \
            --no-password \
        | pg_restore \
            --format custom \
            --no-owner \
            --no-privileges \
            --host=$NEW_RELATIONSHIP_NAME \
            --port=5432 \
            --dbname=main \
            --username=main \
            --no-password

        rm -r /tmp/pgpass
```
