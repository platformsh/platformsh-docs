---
title: "InfluxDB (Database service)"
weight: -80
description: |
  InfluxDB is a time series database optimized for high-write-volume use cases such as logs, sensor data, and real-time analytics.
sidebarTitle: "InfluxDB"
---

{{% description %}}

It exposes an HTTP API for client interaction. See the [InfluxDB documentation](https://docs.influxdata.com/influxdb) for more information.

## Supported versions

{{% major-minor-versions-note configMinor="true" %}}

{{< image-versions image="influxdb" status="supported" environment="grid" >}}

{{% image-versions-legacy "influxdb" %}}

## Deprecated versions

The following versions are still available in your projects,
but they're at their end of life and are no longer receiving security updates from upstream.

{{< image-versions image="influxdb" status="deprecated" environment="grid" >}}

To ensure your project remains stable in the future,
switch to a [supported version](#supported-versions).
See more information on [how to upgrade to version 2.3 or later](#upgrade-to-version-23-or-later).

{{% relationship-ref-intro %}}

{{< codetabs >}}
+++
title= Service environment variables
+++

{{% service-values-change %}}

```bash
INFLUXDBDATABASE_HOST=influxdbdatabase.internal
INFLUXDBDATABASE_HOSTNAME=azertyuiopqsdfghjklm.influxdb.service._.eu-1.{{< vendor/urlraw "hostname" >}}
INFLUXDBDATABASE_CLUSTER=azertyuiopqsdf-main-bvxea6i
INFLUXDBDATABASE_SERVICE=influxdb
INFLUXDBDATABASE_TYPE=influxdb:{{< latest "influxdb" >}}
INFLUXDBDATABASE_REL=influxdb
INFLUXDBDATABASE_SCHEME=http
INFLUXDBDATABASE_USERNAME=admin
INFLUXDBDATABASE_PASSWORD=ChangeMe
INFLUXDBDATABASE_PORT=8086
INFLUXDBDATABASE_PATH=
INFLUXDBDATABASE_QUERY={'org': 'main', 'bucket': 'main', 'api_token': 'azertyuiopqsdfghjklm1234567890'}
INFLUXDBDATABASE_FRAGMENT=
INFLUXDBDATABASE_PUBLIC=false
INFLUXDBDATABASE_HOST_MAPPED=false
INFLUXDBDATABASE_IP=123.456.78.90
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal.

```json
    {
      "host": "influxdbdatabase.internal",
      "hostname": "azertyuiopqsdfghjklm.influxdb.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
      "cluster": "azertyuiopqsdf-main-bvxea6i",
      "service": "influxdb",
      "type": "influxdb:{{< latest "influxdb" >}}",
      "rel": "influxdb",
      "scheme": "http",
      "username": "admin",
      "password": "ChangeMe",
      "port": 8086,
      "path": null,
      "query": {
        "org": "main",
        "bucket": "main",
        "api_token": "azertyuiopqsdfghjklm1234567890"
      },
      "fragment": null,
      "public": false,
      "host_mapped": false,
      "ip": "123.456.78.90"
    }
```

Example on how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_INFLUXDB_HOST=="$(echo $RELATIONSHIPS_JSON | jq -r '.influxdbdatabase[0].host')"
```

{{< /codetabs >}}

## Usage example

{{% endpoint-description type="influxdb" /%}}

```yaml {configFile="app"}
{{% snippet name="myapp" config="app" root="myapp"  %}}
# Relationships enable an app container's access to a service.
relationships:
    influxdbdatabase: "influxdb:influxdb"
{{% /snippet %}}
{{% snippet name="influxdb" config="service" placeholder="true"  %}}
    type: influxdb:{{% latest "influxdb" %}}
{{% /snippet %}}
```

{{% v2connect2app serviceName="influxdb" relationship="influxdbdatabase" var="INFLUX_HOST"%}}

```bash {location="myapp/.environment"}
# Set environment variables for common InfluxDB credentials.
# For more information, please visit {{< vendor/urlraw "docs" >}}/development/variables.html#service-specific-variables.
export INFLUX_USER=${INFLUXDBDATABASE_USERNAME}
export INFLUX_HOST=${INFLUXDBDATABASE_HOST}
export INFLUX_ORG=$(echo $INFLUXDBDATABASE_QUERY | jq -r ".org")
export INFLUX_TOKEN=$(echo $INFLUXDBDATABASE_QUERY | jq -r ".api_token")
export INFLUX_BUCKET=$(echo $INFLUXDBDATABASE_QUERY | jq -r ".bucket")
```

{{% /v2connect2app %}}

## Export data

To export your data from InfluxDB, follow these steps:

1. Install and set up the [`influx` CLI](https://docs.influxdata.com/influxdb/cloud/tools/influx-cli/).
2. Connect to your InfluxDB service with the [{{% vendor/name %}} CLI](../administration/cli/_index.md):

   ```bash
   {{% vendor/cli %}} tunnel:single
   ```

   This opens an SSH tunnel to your InfluxDB service on your current environment and produces output like the following:

   ```bash
   SSH tunnel opened to influxdbdatabase at: http://127.0.0.1:30000
   ```

3. Get the username, password and token from the [relationship](#relationship-reference) by running the following command:

   ```bash
   {{% vendor/cli %}} relationships -P {{<variable "RELATIONSHIP_NAME" >}}
   ```

4. Adapt and run [InfluxDB's CLI export command](https://docs.influxdata.com/influxdb/v2.3/reference/cli/influx/backup/).

    ``` bash
    influx backup --host {{< variable "URL_FROM_STEP_2" >}} --token {{< variable "API_TOKEN_FROM_STEP_3" >}}
    ```

## Upgrade to version 2.3 or later

### From a previous 2.x version

From version 2.3 onward, the structure of relationships changes.

If you're using a prior 2.x version, your app might currently rely on pulling the `bucket`, `org`, `api_token`,
or `user` values available in the [`{{< vendor/prefix >}}_RELATIONSHIPS` environment variable](#relationship-reference).

If so, to ensure your upgrade is successful, make the following changes to your connection logic:

- Rename the `user` key to `username`.
- Move the `org`, `bucket` and `api_token` keys so they're contained in a dictionary under the `query` key.

If you're relying on any other attributes connecting to InfluxDB, they remain accessible as environment variable from the [service environment variable](#relationship-reference), aside from those addressed above:

### From a 1.x version

From version 2.3 onward, InfluxDB includes an upgrade utility that can convert databases from previous versions to version 2.3 or later.

To upgrade from a 1.x version to 2.3 or later,
change the service version in your `{{< vendor/configfile "services" >}}` file and push your project.
Any existing data you had in your 1.x system is automatically upgraded for you into the 2.3+ system.

{{< note >}}

During an upgrade from a 1.x version to a 2.3 version or later,
a new admin password and a new admin API token are automatically generated.
Previous credentials can't be retained.

You can retrieve your new credentials through the [service environment variables](development/variables.html#service-specific-variables).

{{< /note >}}
