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
            <td>{{< image-versions image="influxdb" status="supported" environment="grid" >}}</td>
            <td>{{< image-versions image="influxdb" status="supported" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="influxdb" status="supported" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

{{% image-versions-legacy "influxdb" %}}

## Deprecated versions

The following versions are still available in your projects,
but they're at their end of life and are no longer receiving security updates from upstream.

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
            <td>{{< image-versions image="influxdb" status="deprecated" environment="grid" >}}</td>
            <td>{{< image-versions image="influxdb" status="deprecated" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="influxdb" status="deprecated" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

To ensure your project remains stable in the future,
switch to a [supported version](#supported-versions).
See more information on [how to upgrade to version 2.3 or later](#upgrade-to-version-23-or-later).

{{% relationship-ref-intro %}}

{{% service-values-change %}}

```yaml
    {
      "host": "influxdb27.internal",
      "hostname": "3xqrvge7ohuvzhjcityyphqcja.influxdb27.service._.ca-1.{{< vendor/urlraw "hostname" >}}",
      "cluster": "jqwcjci6jmwpw-main-bvxea6i",
      "service": "influxdb27",
      "type": "influxdb:2.7",
      "rel": "influxdb",
      "scheme": "http",
      "username": "admin",
      "password": "ChangeMe",
      "port": 8086,
      "path": null,
      "query": {
        "org": "main",
        "bucket": "main",
        "api_token": "d85b1219ee8cef8f84d33216257e44d51ddd52e89ae7acbd5ab1d01d320e2f7f"
      },
      "fragment": null,
      "public": false,
      "host_mapped": false,
      "ip": "169.254.99.35"
    }
```

## Usage example

{{% endpoint-description type="influxdb" /%}}

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}
# Relationships enable an app container's access to a service.
relationships:
    influxtimedb: "timedb:influxdb"
{{< /snippet >}}
{{< snippet name="timedb" config="service" placeholder="true" >}}
    type: influxdb:{{% latest "influxdb" %}}
    disk: 256
{{< /snippet >}}
```

{{% v2connect2app serviceName="timedb" relationship="influxtimedb" var="INFLUX_HOST"%}}

```bash {location="myapp/.environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo ${{< vendor/prefix >}}_RELATIONSHIPS | base64 --decode)

# Set environment variables for common InfluxDB credentials.
export INFLUX_USER=$(echo $RELATIONSHIPS_JSON | jq -r ".influxtimedb[0].username")
export INFLUX_HOST=$(echo $RELATIONSHIPS_JSON | jq -r ".influxtimedb[0].host")
export INFLUX_ORG=$(echo $RELATIONSHIPS_JSON | jq -r ".influxtimedb[0].query.org")
export INFLUX_TOKEN=$(echo $RELATIONSHIPS_JSON | jq -r ".influxtimedb[0].query.api_token")
export INFLUX_BUCKET=$(echo $RELATIONSHIPS_JSON | jq -r ".influxtimedb[0].query.bucket")
```

{{< /v2connect2app >}}

## Export data

To export your data from InfluxDB, follow these steps:

1. Install and set up the [`influx` CLI](https://docs.influxdata.com/influxdb/cloud/tools/influx-cli/).
2. Connect to your InfluxDB service with the [{{% vendor/name %}} CLI](../administration/cli/_index.md):

   ```bash
   {{% vendor/cli %}} tunnel:single
   ```

   This opens an SSH tunnel to your InfluxDB service on your current environment and produces output like the following:

   ```bash
   SSH tunnel opened to influxdb at: http://127.0.0.1:30000
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
or `user` values available in the [`{{< vendor/prefix >}}_RELATIONSHIPS` environment variable](../development/variables/use-variables.md#use-provided-variables).

If so, to ensure your upgrade is successful, make the following changes to your connection logic:

- Rename the `user` key to `username`.
- Move the `org`, `bucket` and  `api_token` keys so they're contained in a dictionary under the `query` key.

If you're relying on any other attributes connecting to InfluxDB, they remain accessible as top-level keys from the [`{{< vendor/prefix >}}_RELATIONSHIPS` environment variable](../development/variables/use-variables.md#use-provided-variables), aside from those addressed above:

```yaml
    {
      "host": "influxdb27.internal",
      "hostname": "3xqrvge7ohuvzhjcityyphqcja.influxdb27.service._.ca-1.{{< vendor/urlraw "hostname" >}}",
      "cluster": "jqwcjci6jmwpw-main-bvxea6i",
      "service": "influxdb27",
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
        "api_token": "d85b1219ee8cef8f84d33216257e44d51ddd52e89ae7acbd5ab1d01d320e2f7f"
      },
      "fragment": null,
      "public": false,
      "host_mapped": false,
      "ip": "169.254.99.35"
    }
```

### From a 1.x version

From version 2.3 onward, InfluxDB includes an upgrade utility that can convert databases from previous versions to version 2.3 or later.

To upgrade from a 1.x version to 2.3 or later,
change the service version in your `{{< vendor/configfile "services" >}}` file and push your project.
Any existing data you had in your 1.x system is automatically upgraded for you into the 2.3+ system.

{{< note >}}

During an upgrade from a 1.x version to a 2.3 version or later,
a new admin password and a new admin API token are automatically generated.
Previous credentials can't be retained.

You can retrieve your new credentials through the [`{{< vendor/prefix >}}_RELATIONSHIPS` environment variable](../development/variables/use-variables.md#use-provided-variables) or by running `{{< vendor/cli >}} relationships`.

{{< /note >}}
