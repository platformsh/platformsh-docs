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

- 24.3
- 23.8

{{% vendor/name %}} plans on supporting long-term support ClickHouse versions in priority.

## Relationship reference

For each service [defined via a relationship](#usage-example) to your application,
{{% vendor/name %}} automatically generates corresponding environment variables within your application container,
in the ``$<RELATIONSHIP-NAME>_<SERVICE-PROPERTY>`` format.

Here is example information available through the [service environment variables](/development/variables/_index.md#service-environment-variables) themselves,
or through the [``PLATFORM_RELATIONSHIPS`` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< codetabs >}}
+++
title= Service environment variables
+++

You can obtain the complete list of available service environment variables in your app container by running ``{{% vendor/cli %}} ssh env``.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed. So your apps should only rely on the [service environment variables](/development/variables/_index.md#service-environment-variables) directly rather than hard coding any values.

```bash
CLICKHOUSE_USERNAME=main
CLICKHOUSE_FRAGMENT=
CLICKHOUSE_IP=123.456.78.90
CLICKHOUSE_CLUSTER=azertyuiop-main-afdwftq
CLICKHOUSE_HOST=clickhouse.internal
CLICKHOUSE_PATH=main
CLICKHOUSE_QUERY={'is_master': True}
CLICKHOUSE_PASSWORD=ChangeMe
CLICKHOUSE_PORT=9000
CLICKHOUSE_HOST_MAPPED=false
CLICKHOUSE_SERVICE=clickhouse
CLICKHOUSE_HOSTNAME=azertyuiopqsdfghjklm.clickhouse.service._.eu-1.{{< vendor/urlraw "hostname" >}}
CLICKHOUSE_EPOCH=0
CLICKHOUSE_REL=clickhouse
CLICKHOUSE_SCHEME=https/http
CLICKHOUSE_TYPE=clickhouse:24.3
CLICKHOUSE_PUBLIC=false
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
  "host": "clickhouse.internal",
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
  "scheme": "https",
  "type": "clickhouse:24.3",
  "public": false
}
```

Here is an example of how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.html#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_CLICKHOUSE_HOST=="$(echo $RELATIONSHIPS_JSON | jq -r '.clickhouse[0].host')"
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

### 2. Define the relationship

To define the relationship, use one of the following endpoints.

#### `clickhouse` endpoint

The `clickhouse` endpoint allows you to use the Native Protocol port (also known as ClickHouse TCP protocol).
This protocol is used by ClickHouse apps and processes such as `clickhouse-server`, `clickhouse-client`, and native ClickHouse tools. It is also used for inter-server communication for distributed queries.

Use the following configuration:

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      <SERVICE_NAME>:
```
You can define ``<SERVICE_NAME>`` as you like.
<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      <RELATIONSHIP_NAME>:
        service: <SERVICE_NAME>
        endpoint: clickhouse
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, but it's best if they're distinct.
With this definition, the application container (``<APP_NAME>``) now has access to the service via the corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).
{{< /codetabs >}}

#### `clickhouse-http` endpoint

The `clickhouse-http` endpoint allows you to use the HTTP API Port for HTTP requests.
This protocol is used by [JDBC](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/), [ODBC](https://learn.microsoft.com/en-us/sql/odbc/microsoft-open-database-connectivity-odbc?view=sql-server-ver16), and web interfaces.

Use the following configuration:

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      <RELATIONSHIP_NAME>:
        service: <SERVICE_NAME>
        endpoint: clickhouse-http
services:
  # The name of the service container. Must be unique within a project.
  <SERVICE_NAME>:
      type: clickhouse:<VERSION>
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

With this definition, the application container (``<APP_NAME>``) now has access to the service via the corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

### Example configuration

{{< codetabs >}}

+++
title= With ``clickhouse`` default endpoint
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # The location of the application's code.
    source:
      root: "/"
    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      clickhouse:
services:
  # The name of the service container. Must be unique within a project.
  clickhouse:
    type: clickhouse:24
```

<--->

+++
title= With ``clickhouse`` explicit endpoint
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # The location of the application's code.
    source:
      root: "/"
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      clickhouse:
        service: clickhouse
        endpoint: clickhouse
services:
  # The name of the service container. Must be unique within a project.
  clickhouse:
    type: clickhouse:24.3
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
      root: "/"
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      clickhouse:
        service: clickhouse
        endpoint: clickhouse-http
services:
  # The name of the service container. Must be unique within a project.
  clickhouse:
    type: clickhouse:24.3
```

If you want to change the ``clickhouse`` endpoint to ``clickhouse-http``, you need to use explicit endpoint definition as it defaults to ``clickhouse`` endpoint when using default endpoint (aka. {{% variable "SERVICE_NAME" %}} as relationship definition).

{{< /codetabs >}}

## Multiple databases

You can configure multiple databases, much like [with PostgreSQL](/add-services/postgresql.md#multiple-databases).
To do so, you can use a configuration similar to the following:

```yaml {configFile="app"}
# Complete list of all available properties: https://docs.upsun.com/create-apps/app-reference.html
applications:
  myapp:
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with explicitly set service names and endpoints.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      clickhouse-admin:
        service: clickhouse
        endpoint: admin
      clickhouse-reporter:
        service: clickhouse
        endpoint: reporter
      clickhouse-importer:
        service: clickhouse
        endpoint: importer
services:
  clickhouse:
    type: clickhouse:24.3
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
