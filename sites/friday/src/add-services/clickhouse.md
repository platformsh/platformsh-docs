---
title: "ClickHouse"
weight: -110
description: 
---

ClickHouse is a high-performance column-oriented, distributed, OLAP (Online Analytical Processing) database.</br>
It allows you to generate real-time analytical data reports using SQL queries.</br>
For more information, see the [ClickHouse documentation](https://ClickHouse.com/docs).

{{% note %}} 

{{% vendor/name %}} supports ClickHouse with the following limitations:

- High availibility of service isn't supported.
- You can only configure single-node ClickHouse clusters.

{{% /note %}} 

## Supported versions

- 23.12

Each version represents a rolling release of the latest yearly version available from the upstream.
The latest compatible feature and maintenance versions are applied automatically.

## Relationship reference

Example information available through the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables)
or by running `{{< vendor/cli >}} relationships`.

```yaml
{
      "username": "main",
      "fragment": null,
      "ip": "169.254.143.42",
      "cluster": "s7vj2hgh6nwsk-main-bvxea6i",
      "host": "clickhouse.internal",
      "path": "main",
      "query": {
        "is_master": true
      },
      "password": "63f06c05a632f9e66be25b51cde5c573",
      "port": 9000,
      "host_mapped": false,
      "service": "clickhouse",
      "hostname": "oid3uu43xj2iujgwvplpo6ytme.clickhouse.service._.eu-3.platformsh.site",
      "epoch": 0,
      "instance_ips": [
        "247.95.64.160"
      ],
      "rel": "clickhouse",
      "scheme": "clickhouse",
      "type": "clickhouse:23",
      "public": false
    }
```

## Usage example

### 1. Configure the service

To define the service, use the `clickhouse` type:

```yaml {configFile="app"}
services:
    # The name of the service container. Must be unique within a project.
    <SERVICE_NAME>:
        type: clickhouse:<VERSION>
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost. Back up your data before changing the service.

### 2. Add the relationship

To define the relationship, use one of the following endpoints.

#### `clickhouse` endpoint

The `clickhouse` endpoint allows you to use the Native Protocol port (also known as ClickHouse TCP protocol).
This protocol is used by ClickHouse apps and processes such as `clickhouse-server`, `clickhouse-client`, and native ClickHouse tools. It is also used for inter-server communication for distributed queries.

Use the following configuration:

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    <APP_NAME>:
        # Relationships enable access from this app to a given service.
        relationships:
            <RELATIONSHIP_NAME>: "<SERVICE_NAME>:clickhouse"

services:
    # The name of the service container. Must be unique within a project.
    <SERVICE_NAME>:
        type: clickhouse:<VERSION>
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, but it’s best if they’re distinct.
With this definition, the application container (``<APP_NAME>``) now has access to the service via the relationship ``<RELATIONSHIP_NAME>``.

#### `clickhouse-http` endpoint

The `clickhouse-http` endpoint allows you to use the HTTP API Port for HTTP requests.
This protocol is used by [JDBC](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/), [ODBC](https://learn.microsoft.com/en-us/sql/odbc/microsoft-open-database-connectivity-odbc?view=sql-server-ver16), and web interfaces.

Use the following configuration:

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    <APP_NAME>:
        # Relationships enable access from this app to a given service.
        relationships:
            <RELATIONSHIP_NAME>: "<SERVICE_NAME>:clickhouse-http"

services:
    # The name of the service container. Must be unique within a project.
    <SERVICE_NAME>:
        type: clickhouse:<VERSION>
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, but it’s best if they’re distinct.
With this definition, the application container (``<APP_NAME>``) now has access to the service via the relationship ``<RELATIONSHIP_NAME>``.

### Example configuration

{{< codetabs >}}

+++
title= With ``clickhouse`` endpoint
+++

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    myapp:
        # The location of the application's code.
        source:
            root: "myapp"
        # Relationships enable an app container's access to a service.
        relationships:
            clickhouse: "clickhouse:clickhouse"
services:
    # The name of the service container. Must be unique within a project.
    type: clickhouse:23
```

<--->

+++
title= With ``clickhouse-http`` endpoint
+++

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    myapp:
        # The location of the application's code.
        source:
            root: "myapp"
        # Relationships enable an app container's access to a service.
        relationships:
            clickhouse: "clickhouse:clickhouse-http"
services:
    # The name of the service container. Must be unique within a project.
    type: clickhouse:23
```

{{< /codetabs >}}

## Multiple databases

You can configure multiple databases, much like [with PostgreSQL](/add-services/postgresql.md#multiple-databases).
To do so, you can use a configuration similar to the following:

```yaml {configFile="app"}
# Complete list of all available properties: https://docs.upsun.com/create-apps/app-reference.html
applications:
  myapp:
    relationships:
      clickhouse-admin: "clickhouse:admin"
      clickhouse-reporter: "clickhouse:reporter"
      clickhouse-importer: "clickhouse:importer"

services:
  clickhouse:
    type: clickhouse:23
    configuration:
      databases:
        - main
        - legacy
      endpoints:
        admin:
          port: 9000 # binary port
          privileges:
            main: admin
            legacy: admin
        reporter:
          default_database: main
          port: 8123 # http port
          privileges:
            main: ro
        importer:
          default_database: legacy
          port: 9000 # binary port
          privileges:
            legacy: rw
```

