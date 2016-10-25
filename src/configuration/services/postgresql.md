# PostgreSQL (Database service)

Transactional data storage  and the world's most advanced open source database.

## Supported versions

* 9.3
* 9.6

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/environment-variables.md):

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

In your `.platform/services.yaml` add:

```yaml
mydatabase:
    type: postgresql:9.3
    disk: 1024
```

Add a relationship to the service in your ``.platform.app.yaml``:

```yaml
relationships:
    database: "mydatabase:postgresql"
```

For PHP, in your `.platform.app.yaml` add:

```yaml
runtime:
    extensions:
        - pdo_pgsql
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
  $container->setParameter('database_driver', 'pdo_' . $endpoint['scheme']);
  $container->setParameter('database_host', $endpoint['host']);
  $container->setParameter('database_port', $endpoint['port']);
  $container->setParameter('database_name', $endpoint['path']);
  $container->setParameter('database_user', $endpoint['username']);
  $container->setParameter('database_password', $endpoint['password']);
  $container->setParameter('database_path', '');
}
```

## Upgrading

PostgreSQL does not support direct migration from one significant version to another without extensive user intervention. For that reason we do not support transparent updates from one PostgreSQL version to another (such as from 9.3 to 9.6).  In order to upgrade the service version, we recommend the following process:

* Create a new service for the new PostgreSQL version
* If possible, set your site to maintenance mode or read-only mode to avoid further database writes
* Using `pg_dumpall` to take a snapshot of the old data
* Import that data into the new service
* Modify the relationships block in `.platform.app.yaml` to use the new service name and redeploy

That will allow for a "fresh install" of the new PostgreSQL version with existing data.

## Notes

### Could not find driver

If you see this error: ``Fatal error: Uncaught exception 'PDOException' with message 'could not find driver'``,
this means you are missing the ``pdo_pgsql`` PHP extension. You simply need to enable it in your ``.platform.app.yaml``
(see above).
