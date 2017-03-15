# Influx DB(Database service)

InfluxDB is a time series database optimized for high-write-volume use cases such as logs, sensor data, and real-time analytics.  It exposes a HTTP API for client interaction.

See the [InfluxDB documentation](https://docs.influxdata.com/influxdb/v1.2/) for more information.

## Supported versions

* 1.2

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md#platformsh-provided-variables):

```json
{
   "servicename" : [
      {
         "scheme" : "http",
         "ip" : "246.0.161.240",
         "host" : "influx.internal",
         "port" : 8086
      }
   ]
}
```

## Usage example

In your `.platform/services.yaml`:

```yaml
influx:
    type: influxdb:1.2
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
$relationships = getenv('PLATFORM_RELATIONSHIPS');
if (!$relationships) {
  return;
}

$relationships = json_decode(base64_decode($relationships), TRUE);

foreach ($relationships['timedb'] as $endpoint) {
  $continer->setParameter('influx_host', $endpoint['host']);
  $continer->setParameter('influx_port', $endpoint['port']);
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
