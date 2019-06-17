# Influx DB(Database service)

InfluxDB is a time series database optimized for high-write-volume use cases such as logs, sensor data, and real-time analytics.  It exposes an HTTP API for client interaction.

See the [InfluxDB documentation](https://docs.influxdata.com/influxdb/) for more information.

## Supported versions

<div id = "influxdbSupported"></div>

<script>
makeImagesList("services", "influxdb", "supported", "influxdbSupported");
</script>

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md#platformsh-provided-variables):

{% codesnippet "https://examples.docs.platform.sh/relationships/influxdb", language="json" %}{% endcodesnippet %}

## Usage example

In your `.platform/services.yaml`:

<div id="influxYAML"></div>

<script>
makeNewestServicesYaml("influxdb", "influx", "influxYAML", 1024);
</script>

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
