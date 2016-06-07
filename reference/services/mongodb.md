# MongoDB (Database service)

MongoDB is a cross-platform document-oriented database. It's classified as a 
NoSQL database.

## Supported versions

* 3.0 (default)

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](reference/environment-variables.md):

```bash
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
$relationships = getenv("PLATFORM_RELATIONSHIPS");
if (!$relationships) {
  return;
}

$relationships = json_decode(base64_decode($relationships), TRUE);

foreach ($relationships['database'] as $endpoint) {
  if (empty($endpoint['query']['is_master'])) {
    continue;
  }
  $container->setParameter('mongodb_server', $endpoint['scheme'] . '://' $endpoint['host'] . ':' $endpoint['port']);
  $container->setParameter('database_name', $endpoint['path']);
  $container->setParameter('database_user', $endpoint['username']);
  $container->setParameter('database_password', $endpoint['password']);
}
```
