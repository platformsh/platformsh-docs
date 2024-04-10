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

- High availability of service isn't supported.
- You can only configure single-node ClickHouse clusters.

{{% /note %}}

## Supported versions

- 23.8

{{% vendor/name %}} plans on supporting long-term support ClickHouse versions in priority.

{{% relationship-ref-intro %}}

{{< codetabs >}}
+++
title= Service environment variables
+++

{{% service-values-change %}}

```bash
CLICKHOUSEDATABASE_USERNAME=main
CLICKHOUSEDATABASE_FRAGMENT=
CLICKHOUSEDATABASE_IP=123.456.78.90
CLICKHOUSEDATABASE_CLUSTER=azertyuiop-main-afdwftq
CLICKHOUSEDATABASE_HOST=clickhousedatabase.internal
CLICKHOUSEDATABASE_PATH=main
CLICKHOUSEDATABASE_QUERY={'is_master': True}
CLICKHOUSEDATABASE_PASSWORD=ChangeMe
CLICKHOUSEDATABASE_PORT=9000
CLICKHOUSEDATABASE_HOST_MAPPED=false
CLICKHOUSEDATABASE_SERVICE=clickhouse
CLICKHOUSEDATABASE_HOSTNAME=azertyuiopqsdfghjklm.clickhouse.service._.eu-1.{{< vendor/urlraw "hostname" >}}
CLICKHOUSEDATABASE_EPOCH=0
CLICKHOUSEDATABASE_REL=clickhouse
CLICKHOUSEDATABASE_SCHEME=clickhouse
CLICKHOUSEDATABASE_TYPE=clickhouse:23
CLICKHOUSEDATABASE_PUBLIC=false
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal:

```json
{
      "username": "main",
      "fragment": null,
      "ip": "123.456.78.90",
      "cluster": "azertyuiop-main-afdwftq",
      "host": "clickhousedatabase.internal",
      "path": "main",
      "query": {
        "is_master": true
      },
      "password": "ChangeMe",
      "port": 9000,
      "host_mapped": false,
      "service": "clickhouse",
      "hostname": "azertyuiopqsdfghjklm.clickhouse.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
      "epoch": 0,
      "rel": "clickhouse",
      "scheme": "clickhouse",
      "type": "clickhouse:23",
      "public": false
    }
```

Here is an example of how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information
in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_CLICKHOUSE_HOST=="$(echo $RELATIONSHIPS_JSON | jq -r '.clickhousedatabase[0].host')"
```

{{< /codetabs >}}

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
With this definition, the application container (``<APP_NAME>``) now has access to the service via the corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

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
With this definition, the application container (``<APP_NAME>``) now has access to the service via the corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

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
            clickhousedatabase: "clickhouse:clickhouse"
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
            clickhousedatabase: "clickhouse:clickhouse-http"
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

