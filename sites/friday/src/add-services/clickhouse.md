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

- 23.8

{{% vendor/name %}} plans on supporting long-term support ClickHouse versions in priority.

## Relationship reference

After you've defined a relationship between your service and app containers, {{% vendor/name %}} automatically generates corresponding environment variables within your application container.

Here is an example of information you can retrieve through these [`{{< vendor/prefix >}}_RELATIONSHIPS` environment variables](/development/variables/_index.md#service-specific-variables),
or by running `{{< vendor/cli >}} ssh env`.

```bash
CLICKHOUSE_USERNAME=main
CLICKHOUSE_SCHEME=clickhouse
CLICKHOUSE_SERVICE=clickhouse
CLICKHOUSE_FRAGMENT=
CLICKHOUSE_EPOCH=0
CLICKHOUSE_IP=123.456.78.90
CLICKHOUSE_INSTANCE_IPS=['123.456.78.90']
CLICKHOUSE_HOSTNAME=azertyuiopqsdfghjklm.clickhouse.service._.eu-1.{{< vendor/urlraw "hostname" >}}
CLICKHOUSE_PORT=9000
CLICKHOUSE_CLUSTER=azertyuiop-main-afdwftq
CLICKHOUSE_HOST=clickhouse.internal
CLICKHOUSE_REL=clickhouse
CLICKHOUSE_PATH=main
CLICKHOUSE_QUERY={'is_master': True}
CLICKHOUSE_PASSWORD=ChangeMe
CLICKHOUSE_TYPE=clickhouse:23
CLICKHOUSE_PUBLIC=false
CLICKHOUSE_HOST_MAPPED=false
```

{{% note %}}
For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables)
to gather service information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_CLICKHOUSE_HOST=="$(echo $RELATIONSHIPS_JSON | jq -r '.clickhouse[0].host')"
```

The structure of the `PLATFORM_RELATIONSHIP` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal.
{{% /note %}}

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
With this definition, the application container (``<APP_NAME>``) now has access to the service via the corresponding [`{{< vendor/prefix >}}_RELATIONSHIPS` environment variables](/development/variables/_index.md#service-specific-variables).

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
With this definition, the application container (``<APP_NAME>``) now has access to the service via the corresponding [`{{< vendor/prefix >}}_RELATIONSHIPS` environment variables](/development/variables/_index.md#service-specific-variables).

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
