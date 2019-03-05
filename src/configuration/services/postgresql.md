# PostgreSQL (Database service)

PostgreSQL is a high-performance, standards-compliant relational SQL database.

See the [PostgreSQL documentation](https://www.postgresql.org/docs/9.6/index.html) for more information.

## Supported versions

* 9.6
* 10
* 11

### Deprecated versions

The following versions are available but are not receiving security updates from upstream, so their use is not recommended. They will be removed at some point in the future.

* 9.3

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md#platformsh-provided-variables):

{% codesnippet "https://examples.docs.platform.sh/relationships/postgresql", language="json" %}{% endcodesnippet %}

## Usage example

In your `.platform/services.yaml` add:

```yaml
mydatabase:
    type: postgresql:11
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


{% codetabs name="PHP", type="php", url="https://examples.docs.platform.sh/php/postgresql" -%}

{%- language name="Node.js", type="js", url="https://examples.docs.platform.sh/nodejs/postgresql" -%}

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
    type: "postgresql:11"
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

* **address_standardizer** - Used to parse an address into constituent elements. Generally used to support geocoding address normalization step.
* **address_standardizer_data_us** - Address Standardizer US dataset example
* **adminpack** - administrative functions for PostgreSQL
* **autoinc** - functions for autoincrementing fields
* **bloom** - bloom access method - signature file based index
* **btree_gin** - support for indexing common datatypes in GIN
* **btree_gist** - support for indexing common datatypes in GiST
* **chkpass** - data type for auto-encrypted passwords
* **citext** - data type for case-insensitive character strings
* **cube** - data type for multidimensional cubes
* **dblink** - connect to other PostgreSQL databases from within a database
* **dict_int** - text search dictionary template for integers
* **dict_xsyn** - text search dictionary template for extended synonym processing
* **earthdistance** - calculate great-circle distances on the surface of the Earth
* **file_fdw** - foreign-data wrapper for flat file access
* **fuzzystrmatch** - determine similarities and distance between strings
* **hstore** - data type for storing sets of (key, value) pairs
* **insert_username** - functions for tracking who changed a table
* **intagg** - integer aggregator and enumerator (obsolete)
* **intarray** - functions, operators, and index support for 1-D arrays of integers
* **isn** - data types for international product numbering standards
* **lo** - Large Object maintenance
* **ltree** - data type for hierarchical tree-like structures
* **moddatetime** - functions for tracking last modification time
* **pageinspect** - inspect the contents of database pages at a low level
* **pg_buffercache** - examine the shared buffer cache
* **pg_freespacemap** - examine the free space map (FSM)
* **pg_prewarm** - prewarm relation data
* **pg_stat_statements** - track execution statistics of all SQL statements executed
* **pg_trgm** - text similarity measurement and index searching based on trigrams
* **pg_visibility** - examine the visibility map (VM) and page-level visibility info
* **pgcrypto** - cryptographic functions
* **pgrouting** - pgRouting Extension
* **pgrowlocks** - show row-level locking information
* **pgstattuple** - show tuple-level statistics
* **plpgsql** - PL/pgSQL procedural language
* **postgis** - PostGIS geometry, geography, and raster spatial types and functions
* **postgis_sfcgal** - PostGIS SFCGAL functions
* **postgis_tiger_geocoder** - PostGIS tiger geocoder and reverse geocoder
* **postgis_topology** - PostGIS topology spatial types and functions
* **postgres_fdw** - foreign-data wrapper for remote PostgreSQL servers
* **refint** - functions for implementing referential integrity (obsolete)
* **seg** - data type for representing line segments or floating-point intervals
* **sslinfo** - information about SSL certificates
* **tablefunc** - functions that manipulate whole tables, including crosstab
* **tcn** - Triggered change notifications
* **timetravel** - functions for implementing time travel
* **tsearch2** - compatibility package for pre-8.3 text search functions
* **tsm_system_rows** - TABLESAMPLE method which accepts number of rows as a limit
* **tsm_system_time** - TABLESAMPLE method which accepts time in milliseconds as a limit
* **unaccent** - text search dictionary that removes accents
* **uuid-ossp** - generate universally unique identifiers (UUIDs)
* **xml2** - XPath querying and XSLT

## Notes

### Could not find driver

If you see this error: `Fatal error: Uncaught exception 'PDOException' with message 'could not find driver'`, this means you are missing the `pdo_pgsql` PHP extension. You simply need to enable it in your `.platform.app.yaml` (see above).

## Upgrading

PostgreSQL 10 and later include an upgrade utility that can convert databases from previous versions to version 10 or 11.  If you upgrade your service from a previous version of PostgreSQL to version 10 or above (by modifying the `services.yaml` file) the upgrader will run automatically.

The upgrader does not work to upgrade to PostgreSQL 9 versions, so upgrades from PostgreSQL 9.3 to 9.6 are not supported.  Upgrade straight to version 11 instead.

> Warning: Make sure you first test your migration on a separate branch
> Warning: be sure to take a snapshot of your master environment **before** you merge this change.

Downgrading is not supported. If you want, for whatever reason, to downgrade you should dump to SQL, remove the service, recreate the service, and import your dump.
