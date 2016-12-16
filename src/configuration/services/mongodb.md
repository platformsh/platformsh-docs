# MongoDB (Database service)

MongoDB is a cross-platform document-oriented database.

See the [MongoDB documentation](https://docs.mongodb.com/manual/) for more information.

## Supported versions

* 3.0

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/environment-variables.md):

```json
{
  "database": [
    {
      "username": "main",
      "password": "main",
      "host": "248.0.81.46",
      "query": {
        "is_master": true
      },
      "path": "main",
      "scheme": "mongodb",
      "port": 27017
    }
  ]
}
```

## Usage example

In your `.platform/services.yaml`:

```yaml
mydatabase:
    type: mongodb:3.0
    disk: 1024
```

In your `.platform.app.yaml`:

```yaml
relationships:
    database: "mydatabase:mongodb"
```

You can then use the service in a configuration file of your application with something like:

```php
<?php
$relationships = getenv('PLATFORM_RELATIONSHIPS');
if (!$relationships) {
  return;
}

$relationships = json_decode(base64_decode($relationships), TRUE);

foreach ($relationships['database'] as $endpoint) {
  if (empty($endpoint['query']['is_master'])) {
    continue;
  }
  $container->setParameter('mongodb_server', $endpoint['scheme'] . '://' . $endpoint['host'] . ':' . $endpoint['port']);
  $container->setParameter('database_name', $endpoint['path']);
  $container->setParameter('database_user', $endpoint['username']);
  $container->setParameter('database_password', $endpoint['password']);
}
```

## Exporting data

The most straightforward way to export data from a MongoDB database is to open an SSH tunnel to it and simply export the data directly using MongoDB's tools.  First, open an SSH tunnel with the Platform.sh CLI:

```bash
platform tunnel:open
```

That will open an SSH tunnel to all services on your current environment, and produce output something like the following:

```text
SSH tunnel opened on port 30000 to relationship: mongodb
SSH tunnel opened on port 30001 to relationship: redis
```

The port may vary in your case.  Then, simply connect to that port locally using `mongodump` (or your favorite MongoDB tools) to export all data in that server:

```bash
mongodbump --port 30000
```
