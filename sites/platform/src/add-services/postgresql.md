---
title: "PostgreSQL (Database service)"
weight: -10
sidebarTitle: "PostgreSQL"
---

PostgreSQL is a high-performance, standards-compliant relational SQL database.

See the [PostgreSQL documentation](https://www.postgresql.org/docs/9.6/index.html) for more information.

## Use a framework

If you use one of the following frameworks, follow its guide:

- [Hibernate](../guides/hibernate/deploy.md#postgresql)
- [Jakarta EE](../guides/jakarta/deploy.md#postgresql)
- [Spring](../guides/spring/postgresql.md)

## Supported versions

<table>
    <thead>
        <tr>
            <th>Grid</th>
            <th>Dedicated Gen 3</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="postgresql" status="supported" environment="grid" >}}</td>
            <td>{{< image-versions image="postgresql" status="supported" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="postgresql" status="supported" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

\* No High-Availability on {{% names/dedicated-gen-2 %}}.

{{< note >}}

You can't upgrade to PostgreSQL 12 with the `postgis` extension enabled.
For more details, see how to [upgrade to PostgreSQL 12 with `postgis`](#upgrade-to-postgresql-12-with-the-postgis-extension).

{{< /note >}}

### Deprecated versions

The following versions are [deprecated](/glossary.html#deprecated-versions).
They're available, but they aren't receiving security updates from upstream and aren't guaranteed to work.
They'll be removed in the future,
so migrate to one of the [supported versions](#supported-versions).

<table>
    <thead>
        <tr>
            <th>Grid</th>
            <th>Dedicated Gen 3</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="postgresql" status="deprecated" environment="grid" >}}</td>
            <td>{{< image-versions image="postgresql" status="deprecated" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="postgresql" status="deprecated" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

## Relationship reference

Example information available through the [`{{% vendor/prefix %}}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables)
or by running `{{% vendor/cli %}} relationships`.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed.
So your apps should only rely on the `{{% vendor/prefix %}}_RELATIONSHIPS` environment variable directly rather than hard coding any values.

```json
{
  "username": "main",
  "scheme": "pgsql",
  "service": "postgresql",
  "fragment": null,
  "ip": "123.456.78.90",
  "hostname": "azertyuiopqsdfghjklm.postgresql.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
  "port": 5432,
  "cluster": "azertyuiopqsdf-main-afdwftq",
  "host": "postgresql.internal",
  "rel": "postgresql",
  "path": "main",
  "query": {
    "is_master": true
  },
  "password": "ChangeMe",
  "type": "postgresql:{{% latest "postgresql" %}}",
  "public": false,
  "host_mapped": false
}
```

## Usage example

### 1. Configure the service

To define the service, use the `postgresql` type:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
  type: postgresql:<VERSION>
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

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<SERVICE_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

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
    endpoint: postgresql
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<RELATIONSHIP_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< /codetabs >}}

For PHP, enable the [extension](/languages/php/extensions) for the service:

```yaml {configFile="app"}
# PHP extensions.
runtime:
  extensions:
    - pdo_pgsql
```

### Example configuration

### [Service definition](/add-services.html)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
postgresql:
  type: postgresql:{{% latest "postgresql" %}}
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
  postgresql:
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
  postgresql:
    service: postgresql
    endpoint: postgresql
```

{{< /codetabs >}}

### Use in app

To use the configured service in your app, add a configuration file similar to the following to your project.

<!-- Version 1: Codetabs using config reader + examples.docs.platform.sh -->
{{< codetabs >}}

+++
title=Go
file=static/files/fetch/examples/golang/postgresql
highlight=go
+++

<--->

+++
title=Java
file=static/files/fetch/examples/java/postgresql
highlight=java
+++

<--->

+++
title=Node.js
file=static/files/fetch/examples/nodejs/postgresql
highlight=js
+++

<--->

+++
title=PHP
file=static/files/fetch/examples/php/postgresql
highlight=php
+++

<--->

+++
title=Python
file=static/files/fetch/examples/python/postgresql
highlight=python
+++

{{< /codetabs >}}

## Access the service directly

Access the service using the {{< vendor/name >}} CLI by running `{{< vendor/cli >}} sql`.

You can also access it from your app container via [SSH](../development/ssh/_index.md).
From your [relationship data](#relationship-reference), you need: `username`, `host`, and `port`.
Then run the following command:

```bash
psql -U {{< variable "USERNAME" >}} -h {{< variable "HOST" >}} -p {{< variable "PORT" >}}
```

Using the values from the [example](#relationship-reference), that would be:

```bash
psql -U main -h postgresql.internal -p 5432
```

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed. So your apps should only rely on the `{{< vendor/prefix >}}_RELATIONSHIPS` environment variable directly rather than hard coding any values.

## Exporting data

The easiest way to download all data in a PostgreSQL instance is with the {{< vendor/name >}} CLI. If you have a single SQL database, the following command exports all data using the `pg_dump` command to a local file:

```bash
{{% vendor/cli %}} db:dump
```

If you have multiple SQL databases it prompts you which one to export. You can also specify one by relationship name explicitly:

```bash
{{% vendor/cli %}} db:dump --relationship postgresql
```

By default the file is uncompressed. If you want to compress it, use the `--gzip` (`-z`) option:

```bash
{{% vendor/cli %}} db:dump --gzip
```

You can use the `--stdout` option to pipe the result to another command. For example, if you want to create a bzip2-compressed file, you can run:

```bash
{{% vendor/cli %}} db:dump --stdout | bzip2 > dump.sql.bz2
```

It is also possible to generate the dump locally if you have the `pg_dump` command installed with `{{% vendor/cli %}} tunnel:single`. The command will first ask for the service and then will provide a prompt for the URI string that you can use. For example:

```bash
pg_dump -d postgresql://REPLACE_URI_FROM_OUTPUT -f dump.sql
```

## Importing data

Make sure that the imported file contains objects with cleared ownership and `IF EXISTS` clauses. For example, you can create a DB dump with following parameters:

```bash
pg_dump --no-owner --clean --if-exists
```

The easiest way to load data into a database is to pipe an SQL dump through the `{{% vendor/cli %}} sql` command, like so:

```bash
{{% vendor/cli %}} sql < my_database_backup.sql
```

That runs the database backup against the SQL database on {{% vendor/name %}}.
That works for any SQL file, so the usual caveats about importing an SQL dump apply
(for example, it's best to run against an empty database).
As with exporting, you can also specify a specific environment to use and a specific database relationship to use, if there are multiple.

```bash
{{% vendor/cli %}} sql --relationship postgresql -e {{< variable "BRANCH_NAME" >}} < my_database_backup.sql
```

{{< note >}}
Importing a database backup is a destructive operation. It overwrites data already in your database.
Taking a backup or a database export before doing so is strongly recommended.
{{< /note >}}

## Sanitizing data

To ensure people who review code changes can't access personally identifiable information stored in your database,
[sanitize your preview environments](../development/sanitize-db/postgresql.md).

## Multiple databases

If you are using version `10`, `11`, `12`, `13`, or later of this service,
it's possible to define multiple databases as well as multiple users with different permissions.
To do so requires defining multiple endpoints.
Under the `configuration` key of your service there are two additional keys:

* `databases`:  This is a YAML array listing the databases that should be created. If not specified, a single database named `main` is created.

  Note that removing a schema from the list of `schemas` on further deployments results in **the deletion of the schema.**
* `endpoints`: This is a nested YAML object defining different credentials. Each endpoint may have access to one or more schemas (databases), and may have different levels of permission for each. The valid permission levels are:
  * `ro`: Using this endpoint only `SELECT` queries are allowed.
  * `rw`: Using this endpoint `SELECT` queries as well as `INSERT`/`UPDATE`/`DELETE` queries are allowed.
  * `admin`: Using this endpoint all queries are allowed, including DDL queries (`CREATE TABLE`, `DROP TABLE`, etc.).

Consider the following illustrative example:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
postgresql:
  type: "postgresql:{{% latest "postgresql" %}}"
  disk: 2048
  configuration:
    databases:
      - main
      - legacy
    endpoints:
      admin:
        privileges:
          main: admin
          legacy: admin
      reporter:
        default_database: main
        privileges:
          main: ro
      importer:
        default_database: legacy
        privileges:
          legacy: rw
```

This example creates a single PostgreSQL service named `postgresql`. The server has two databases, `main` and `legacy` with three endpoints created.

* `admin`: has full access to both databases.
* `reporter`: has `SELECT` query access to the `main` database, but no access to `legacy`.
* `importer`: has `SELECT`/`INSERT`/`UPDATE`/`DELETE` access (but not DDL access) to the `legacy` database. It doesn't have access to `main`.

If a given endpoint has access to multiple databases you should also specify which is listed by default in the relationships array. If one isn't specified, the `path` property of the relationship is `null`. While that may be acceptable for an application that knows the name of the database it's connecting to, automated tools like the {{% vendor/name %}} CLI can't access the database on that relationship. For that reason, defining the `default_database` property is always recommended.

Once these endpoints are defined, you need to expose them to your application as a relationship. Continuing with the above example, your `relationships` in `{{< vendor/configfile "app" >}}` might look like:

```yaml {configFile="app"}
relationships:
  # Please note: Legacy definition of the relationship is still supported:
  # More information: https://docs.platform.sh/create-apps/app-reference/single-runtime-image.html#relationships
  database:
    service: postgresql
    endpoint: admin
  reports:
    service: postgresql
    endpoint: reporter
  imports:
    service: postgresql
    endpoint: importer
```

Each database is accessible to your application through the `database`, `reports`, and `imports` relationships.
They'll be available in the `{{< vendor/prefix >}}_RELATIONSHIPS` environment variable and all have the same structure documented above, but with different credentials. You can use those to connect to the appropriate database with the specified restrictions using whatever the SQL access tools are for your language and application.

A service configuration without the `configuration` block defined is equivalent to the following default values:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
postgresql:
  type: "postgresql:{{% latest "postgresql" %}}"
  disk: 2048
  configuration:
    databases:
      - main
    endpoints:
      postgresql:
        default_database: main
        privileges:
          main: admin
```

If you do not define `database` but `endpoints` are defined, then the single database `main` is created with the following assumed configuration:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
postgresql:
  type: "postgresql:{{% latest "postgresql" %}}"
  disk: 2048
  configuration:
    databases:
      - main
    endpoints: <your configuration>
```

Alternatively, if you define multiple databases but no endpoints, a single user `main` is created with `admin` access to each of your databases, equivalent to the configuration below:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
postgresql:
  type: "postgresql:{{% latest "postgresql" %}}"
  disk: 2048
  configuration:
    databases:
      - firstdb
      - seconddb
      - thirddb
    endpoints:
      main:
        firstdb: admin
        seconddb: admin
        thirddb: admin
```

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
through the `{{< vendor/prefix >}}_RELATIONSHIPS` [environment variable](../../development/variables/use-variables.md#use-provided-variables)
within your [application containers](/development/variables/use-variables.md#access-variables-in-your-app).
The password value changes automatically over time, to avoid downtime its value has to be read dynamically by your app.
Globally speaking, having passwords hard-coded into your codebase can cause security issues and should be avoided.

When you switch from the default configuration with an empty password to custom endpoints,
make sure your service name remains unchanged.
Failure to do so results in the creation of a new service,
which removes any existing data from your database.

## Restrict access to database replicas only

{{< partial "banners/replicas/body.md" >}}

For security reasons, you can grant your app access to replicas instead of your actual database.
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

For example, if you define a `postgresql` database as follows:

```yaml {configFile="services"}
postgresql:
  type: "postgresql:16"
  disk: 2048
  configuration:
    databases:
      - main
      - legacy
    endpoints:
      admin:
        privileges:
          main: admin
          legacy: admin
      reporter:
        default_database: main
        privileges:
          main: ro
```

To create a replica of the `postgresql` database and allow your app to connect to it
through the `admin` endpoint with admin permissions,
use the following configuration:

```yaml {configFile="app"}
relationships:
  postgresql:
    service: postgresql
    endpoint: admin-replica
```

To create a replica of the `postgresql` database and allow your app to connect to it
through the `reporter` endpoint with read-only permissions instead,
use the following configuration:

```yaml {configFile="app"}
relationships:
  postgresql:
    service: postgresql
    endpoint: reporter-replica
```

## Service timezone

To change the timezone for the current session, run `SET TIME ZONE {{< variable "TIMEZONE" >}};`.

## Extensions

{{% vendor/name %}} supports a number of PostgreSQL extensions. To enable them, list them under the `configuration.extensions` key in your `{{< vendor/configfile "services" >}}` file, like so:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
postgresql:
  type: "postgresql:{{% latest "postgresql" %}}"
  disk: 2048
  configuration:
    extensions:
      - pg_trgm
      - hstore
```

In this case, you have `pg_trgm` installed, providing functions to determine the similarity of text based on trigram matching, and `hstore` providing a key-value store.

### Available extensions

The following is the extensive list of supported extensions. Note that you can't currently add custom
extensions not listed here.

* `address_standardizer` - Used to parse an address into constituent elements. Generally used to support geocoding address normalization step.
* `address_standardizer_data_us` - For standardizing addresses based on US dataset example
* `adminpack` - administrative functions for PostgreSQL
* `autoinc` - functions for auto-incrementing fields
* `bloom` - bloom access method - signature file based index (requires 9.6 or higher)
* `btree_gin` - support for indexing common data types in GIN
* `btree_gist` - support for indexing common data types in GiST
* `chkpass` - data type for auto-encrypted passwords
* `citext` - data type for case-insensitive character strings
* `cube` - data type for multidimensional cubes
* `dblink` - connect to other PostgreSQL databases from within a database
* `dict_int` - text search dictionary template for integers
* `dict_xsyn` - text search dictionary template for extended synonym processing
* `earthdistance` - calculate great-circle distances on the surface of the Earth
* `file_fdw` - foreign-data wrapper for flat file access
* `fuzzystrmatch` - determine similarities and distance between strings
* `hstore` - data type for storing sets of (key, value) pairs
* `insert_username` - functions for tracking who changed a table
* `intagg` - integer aggregator and enumerator (obsolete)
* `intarray` - functions, operators, and index support for 1-D arrays of integers
* `isn` - data types for international product numbering standards
* `lo` - Large Object maintenance
* `ltree` - data type for hierarchical tree-like structures
* `moddatetime` - functions for tracking last modification time
* `pageinspect` - inspect the contents of database pages at a low level
* `pg_buffercache` - examine the shared buffer cache
* `pg_freespacemap` - examine the free space map (FSM)
* `pg_prewarm` - prewarm relation data (requires 9.6 or higher)
* `pg_stat_statements` - track execution statistics of all SQL statements executed
* `pg_trgm` - text similarity measurement and index searching based on trigrams
* `pg_visibility` - examine the visibility map (VM) and page-level visibility info (requires 9.6 or higher)
* `pgcrypto` - cryptographic functions
* `pgrouting` - pgRouting Extension (requires 9.6 or higher)
* `pgrowlocks` - show row-level locking information
* `pgstattuple` - show tuple-level statistics
* `plpgsql` - PL/pgSQL procedural language
* `postgis` - PostGIS geometry, geography, and raster spatial types and functions
* `postgis_sfcgal` - PostGIS SFCGAL functions
* `postgis_tiger_geocoder` - PostGIS tiger geocoder and reverse geocoder
* `postgis_topology` - PostGIS topology spatial types and functions
* `postgres_fdw` - foreign-data wrapper for remote PostgreSQL servers
* `refint` - functions for implementing referential integrity (obsolete)
* `seg` - data type for representing line segments or floating-point intervals
* `sslinfo` - information about SSL certificates
* `tablefunc` - functions that manipulate whole tables, including `crosstab`
* `tcn` - Triggered change notifications
* `timetravel` - functions for implementing time travel
* `tsearch2` - compatibility package for pre-8.3 text search functions (obsolete, only available for 9.6 and 9.3)
* `tsm_system_rows` - TABLESAMPLE method which accepts number of rows as a limit (requires 9.6 or higher)
* `tsm_system_time` - TABLESAMPLE method which accepts time in milliseconds as a limit (requires 9.6 or higher)
* `unaccent` - text search dictionary that removes accents
* `uuid-ossp` - generate universally unique identifiers (UUIDs)
* `vector` - Open-source [vector](https://github.com/pgvector/pgvector) similarity search for PostgreSQL 11+
* `xml2` - XPath querying and XSLT

{{< note >}}

You can't upgrade to PostgreSQL 12 with the `postgis` extension enabled.
For more details, see how to [upgrade to PostgreSQL 12 with `postgis`](#upgrade-to-postgresql-12-with-the-postgis-extension).

{{< /note >}}

## Notes

### Could not find driver

If you see this error: `Fatal error: Uncaught exception 'PDOException' with message 'could not find driver'`, this means you are missing the `pdo_pgsql` PHP extension. You need to enable it in your `{{< vendor/configfile "app" >}}` ([see above](#1-configure-the-service)).

## Upgrading

PostgreSQL 10 and later include an upgrade utility that can convert databases from previous versions to version 10 or later. If you upgrade your service from a previous version of PostgreSQL to version 10 or above, it upgrades automatically.

The utility can't upgrade PostgreSQL 9 versions, so upgrades from PostgreSQL 9.3 to 9.6 aren't supported. Upgrade straight to version 11 instead.

{{< note >}}

Make sure you first test your migration on a separate branch.

Also, be sure to take a backup of your production environment **before** you merge this change.

{{< /note >}}

{{< note theme="warning" title="Warning">}}

Downgrading isn't supported. If you need to downgrade, dump to SQL, remove the service, recreate the service, and import your dump.

{{< /note >}}

### Upgrade to PostgreSQL 12 with the `postgis` extension

You can't upgrade to PostgreSQL 12 with the `postgis` extension enabled.
It involves a change to a major version that results in a failed deployment that requires support intervention to fix.
Upgrading from 12 to a higher version is possible.

If you need to upgrade to version 12, follow the same steps recommended for downgrading:

1. Dump the database.
2. Remove the service.
3. Create a new service with PostgreSQL 12.
4. Import the dump to that service.
