---
title: "Clickhouse"
weight: -110
description: 
---

Clickhouse is a high-performance column-oriented, distributed, OLAP (Online Analytical Processing) database.</br>
It is open source and allows you to generate real-time analytical data reports using SQL queries.</br>
For more information, see the [Clickhouse documentation](https://clickhouse.com/docs).

{{% note %}} 

{{% vendor/name %}} supports Clickhouse with the following limitations:

- High availibility of service isn't supported.
- You can only configure single-node Clickhouse clusters.

{{% /note %}} 

## Supported versions

You can only specify the major version.
Each version represents a rolling release of the latest minor version available from the upstream.
The latest compatible minor version and patches are applied automatically.

{{< image-versions image="clickhouse" status="supported" environment="grid" >}}

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

To define the relationship, use one of the following endpoints:

- The `clickhouse` endpoint if you want to use the Native Protocol port (also known as ClickHouse TCP protocol).</br>
  This protocol is used by ClickHouse apps and processes such as `clickhouse-server`, `clickhouse-client`, and native ClickHouse tools. It is also used for inter-server communication for distributed queries.

- The `clickhouse-http` endpoint if you want to use the HTTP API Port for HTTP requests.</br>
  This protocol is used by [JDBC](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/), [ODBC](https://learn.microsoft.com/en-us/sql/odbc/microsoft-open-database-connectivity-odbc?view=sql-server-ver16), and web interfaces.

{{% note %}} 

Note on other ports.

{{% /note %}}

Here is an example configuration using the `clickhouse` endpoint:

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
    type: clickhouse:{{% latest "clickhouse" %}}
```

## Configuration options

You can configure your Clickhouse service in the [services configuration](#1-configure-the-service) with the following options:

| Name     | Type                  | Required | Description                                                         |
|----------|-----------------------|----------|---------------------------------------------------------------------|
| `schema` | An array of `string`s | No       | All databases to be created. Defaults to a single `main` database. |

Example configuration?