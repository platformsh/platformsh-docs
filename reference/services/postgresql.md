# PostgreSQL

PostgreSQL is one of the world's most advanced open source database.

## Supported versions

* 9.3 (default)

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](reference/environment-variables.md):

```bash
{
    "database": [
        {
            "username": "main",
            "password": "main",
            "host": "248.0.65.196",
            "query": {
                "is_master": true
            },
            "path": "main",
            "scheme": "pgsql",
            "port": 5432
        }
    ]
}
```

## Usage example

In your ``.platform/services.yaml``:

```yaml
mydatabase:
    type: postgresql:9.3
    disk: 1024
```

In your ``.platform.app.yaml``:

```yaml
runtime:
    extensions:
        - pdo_pgsql

relationships:
    database: "mydatabase:postgresql"
```

You can them use the service in a configuration file of your application with something like:

```php
<?php
$relationships = getenv("PLATFORM_RELATIONSHIPS");
if (!$relationships) {
  return;
}

$relationships = json_decode(base64_decode($relationships), TRUE);

foreach ($relationships['database'] as $endpoint) {
  $container->setParameter('database_driver', 'pdo_' . $endpoint['scheme']);
  $container->setParameter('database_host', $endpoint['host']);
  $container->setParameter('database_port', $endpoint['port']);
  $container->setParameter('database_name', $endpoint['path']);
  $container->setParameter('database_user', $endpoint['username']);
  $container->setParameter('database_password', $endpoint['password']);
  $container->setParameter('database_path', '');
}
```

## Notes

### Could not find driver

If you see this error: ``Fatal error: Uncaught exception 'PDOException' with message 'could not find driver'``, 
this means you are missing the ``pdo_pgsql`` PHP extension. You simply need to enable it in your ``.platform.app.yaml``
(see above).
