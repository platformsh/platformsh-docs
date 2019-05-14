# Influx DB (Database service)

InfluxDB is a time series database optimized for high-write-volume use cases such as logs, sensor data, and real-time analytics.  It exposes an HTTP API for client interaction.

See the [InfluxDB documentation](https://docs.influxdata.com/influxdb/v1.2/) for more information.

<html>
   <head>
      <title>InfluxDB Supported Versions</title>
      <script type = "text/javascript" src = "/scripts/images/helpers.js" ></script>
   </head>
   <body>
   <h2>Supported versions</h2>
   <div id = 'influxdbSupported'></div>
   <script>
   makeList(json, "services", "influxdb", "supported", "influxdbSupported");
   </script>
   </body>
</html>

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md#platformsh-provided-variables):

{% codesnippet "https://examples.docs.platform.sh/relationships/influxdb", language="json" %}{% endcodesnippet %}

## Usage example

In your `.platform/services.yaml`:

```yaml
influx:
    type: influxdb:1.3
    disk: 1024
```

In your `.platform.app.yaml`:

```yaml
relationships:
    timedb: "influx:influxdb"
```

You can then use the service in a configuration file of your application with something like:

```php
<?php
<?php
// This assumes a fictional application with an array named $settings.
if (getenv('PLATFORM_RELATIONSHIPS')) {
	$relationships = json_decode(base64_decode($relationships), TRUE);

	// For a relationship named 'timedb' referring to one endpoint.
	if (!empty($relationships['timedb'])) {
		foreach ($relationships['timedb'] as $endpoint) {
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

That will open an SSH tunnel to all services on your current environment, and produce output something like the following:

```text
SSH tunnel opened on port 30000 to relationship: timedb
```

The port may vary in your case.  Then, simply run InfluxDB's export commands as desired.

```bash
influx_inspect export -compress
```
