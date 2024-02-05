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

- 23

{{% note %}} 

Each version represents a rolling release of the latest yearly version available from the upstream.
The latest compatible feature and maintenance versions are applied automatically.

{{% /note %}} 

## Relationship reference

Example information available through the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables)
or by running `{{< vendor/cli >}} relationships`.

```yaml
{
      "username": "main",
      "fragment": null,
      "ip": "169.254.143.42",
      "cluster": "s7vj2hgh6nwsk-main-bvxea6i",
      "host": "ClickHouse.internal",
      "path": "main",
      "query": {
        "is_master": true
      },
      "password": "63f06c05a632f9e66be25b51cde5c573",
      "port": 9000,
      "host_mapped": false,
      "service": "ClickHouse",
      "hostname": "oid3uu43xj2iujgwvplpo6ytme.ClickHouse.service._.eu-3.platformsh.site",
      "epoch": 0,
      "instance_ips": [
        "247.95.64.160"
      ],
      "rel": "ClickHouse",
      "scheme": "ClickHouse",
      "type": "ClickHouse:23",
      "public": false
    }
```

## Usage example

### 1. Configure the service

To define the service, use the `ClickHouse` type:

```yaml {configFile="app"}
services:
    # The name of the service container. Must be unique within a project.
    <SERVICE_NAME>:
        type: ClickHouse:<VERSION>
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost. Back up your data before changing the service.

### 2. Add the relationship

To define the relationship, use one of the following endpoints.

#### `ClickHouse` endpoint

The `ClickHouse` endpoint allows you to use the Native Protocol port (also known as ClickHouse TCP protocol).
This protocol is used by ClickHouse apps and processes such as `ClickHouse-server`, `ClickHouse-client`, and native ClickHouse tools. It is also used for inter-server communication for distributed queries.

Use the following configuration:

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    <APP_NAME>:
        # Relationships enable access from this app to a given service.
        relationships:
            <RELATIONSHIP_NAME>: "<SERVICE_NAME>:ClickHouse"

services:
    # The name of the service container. Must be unique within a project.
    <SERVICE_NAME>:
        type: ClickHouse:<VERSION>
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, but it’s best if they’re distinct.
With this definition, the application container (``<APP_NAME>``) now has access to the service via the relationship ``<RELATIONSHIP_NAME>``.

#### `ClickHouse-http` endpoint

The `ClickHouse-http` endpoint allows you to use the HTTP API Port for HTTP requests.
This protocol is used by [JDBC](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/), [ODBC](https://learn.microsoft.com/en-us/sql/odbc/microsoft-open-database-connectivity-odbc?view=sql-server-ver16), and web interfaces.

Use the following configuration:

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    <APP_NAME>:
        # Relationships enable access from this app to a given service.
        relationships:
            <RELATIONSHIP_NAME>: "<SERVICE_NAME>:ClickHouse-http"

services:
    # The name of the service container. Must be unique within a project.
    <SERVICE_NAME>:
        type: ClickHouse:<VERSION>
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, but it’s best if they’re distinct.
With this definition, the application container (``<APP_NAME>``) now has access to the service via the relationship ``<RELATIONSHIP_NAME>``.

### Example configuration

{{< codetabs >}}

+++
title= With ``ClickHouse`` endpoint
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
            ClickHouse: "ClickHouse:ClickHouse"
services:
    # The name of the service container. Must be unique within a project.
    type: ClickHouse:23
```

<--->

+++
title= With ``ClickHouse-http`` endpoint
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
            ClickHouse: "ClickHouse:ClickHouse-http"
services:
    # The name of the service container. Must be unique within a project.
    type: ClickHouse:23
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
      ClickHouse-admin: "ClickHouse:admin"
      ClickHouse-reporter: "ClickHouse:reporter"
      ClickHouse-importer: "ClickHouse:importer"

services:
  ClickHouse:
    type: ClickHouse:23
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

