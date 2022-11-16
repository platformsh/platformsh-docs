---
title: "InfluxDB (Database service)"
weight: 3
description: |
  InfluxDB is a time series database optimized for high-write-volume use cases such as logs, sensor data, and real-time analytics.
sidebarTitle: "InfluxDB"
---

{{% description %}}

It exposes an HTTP API for client interaction. See the [InfluxDB documentation](https://docs.influxdata.com/influxdb) for more information.

## Supported versions

| Grid | {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|------|-------------------------------|------------------------------ |
|  {{< image-versions image="influxdb" status="supported" environment="grid" >}} | {{< image-versions image="influxdb" status="supported" environment="dedicated-gen-3" >}} | {{< image-versions image="influxdb" status="supported" environment="dedicated-gen-2" >}} |

{{% image-versions-legacy "influxdb" %}}

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](../development/variables/use-variables.md#use-platformsh-provided-variables):

{{< relationship "influxdb" >}}

## Usage example

{{% endpoint-description type="influxdb" /%}}

{{< codetabs >}}

---
title=PHP
file=static/files/fetch/examples/php/influxdb
highlight=php
---

{{< /codetabs >}}

## Exporting data

To export your data from InfluxDB, follow these steps:

1. Install and configure the [`influx` CLI](https://docs.influxdata.com/influxdb/cloud/tools/influx-cli/).
2. Connect to your InfluxDB service with the [Platform.sh CLI](../administration/cli/_index.md):

   ```bash
   platform tunnel:open
   ```

   That command opens an SSH tunnel to all services on your current environment and produces output like:

   ```bash
   SSH tunnel opened on port 30000 to relationship: influxdb
   ```

3. Get the username and password [for your service](../development/variables/use-variables.md#access-variables-in-a-shell) with `echo $PLATFORM_RELATIONSHIPS | base64 --decode`.
4. Run InfluxDB's CLI export command and [adapt it as desired](https://docs.influxdata.com/influxdb/v2.3/reference/cli/influx/backup/).

   ``` bash
   influx backup --host http://localhost:30000
   ```
