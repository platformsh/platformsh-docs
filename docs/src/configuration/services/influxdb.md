---
title: "InfluxDB (Database service)"
weight: 3
description: |
  InfluxDB is a time series database optimized for high-write-volume use cases such as logs, sensor data, and real-time analytics.
sidebarTitle: "InfluxDB"
---

{{< description >}}

It exposes an HTTP API for client interaction. See the [InfluxDB documentation](https://docs.influxdata.com/influxdb) for more information.

## Supported versions

| **Grid** | **Dedicated** | **Dedicated Generation 3** |
|----------------------------------|---------------|---------------|
|  {{< image-versions image="influxdb" status="supported" environment="grid" >}} | {{< image-versions image="influxdb" status="supported" environment="dedicated" >}} | {{< image-versions image="influxdb" status="supported" environment="dedicated-gen-3" >}} |

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md#platformsh-provided-variables):

{{< relationship "influxdb" >}}

## Usage example

{{% endpoint-description type="influxdb" %}}

Service definition:

{{< readFile file="src/registry/images/examples/full/influxdb.services.yaml"  highlight="yaml" >}}

App configuration:

{{< readFile file="src/registry/images/examples/full/influxdb.app.yaml" highlight="yaml" >}}

{{% /endpoint-description %}}

```php
<?php
// This assumes a fictional application with an array named $settings.
if (getenv('PLATFORM_RELATIONSHIPS')) {
	$relationships = json_decode(base64_decode($relationships), TRUE);

	// For a relationship named 'influxtimedb' referring to one endpoint.
	if (!empty($relationships['influxtimedb'])) {
		foreach ($relationships['influxtimedb'] as $endpoint) {
			$settings['influxdb_host'] = $endpoint['host'];
			$settings['influxdb_port'] = $endpoint['port'];
			break;
		}
	}
}
```

## Exporting data

InfluxDB includes its own [export mechanism](https://docs.influxdata.com/influxdb/v1.2/tools/influx_inspect/).  To gain access to the server from your local machine open an SSH tunnel with the Platform.sh CLI:

```bash
platform tunnel:open
```

That opens an SSH tunnel to all services on your current environment and produce output like the following:

```bash
SSH tunnel opened on port 30000 to relationship: influxtimedb
```

The port may vary in your case.  Then, simply run InfluxDB's export commands as desired.

```bash
influx_inspect export -compress
```
