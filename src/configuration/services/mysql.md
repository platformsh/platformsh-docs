# MariaDB/MySQL (Database service)

Transactional data storage. Based on MariaDB, supporting the XtraDB storage
engine (equivalent to MySQL with InnoDB).

## Supported versions

* 5.5
* 10.0

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/environment-variables.md):

```json
{
  "database": [
    {
      "host": "database.internal",
      "ip": "246.0.97.91",
      "password": "",
      "path": "main",
      "port": 3306,
      "query": {
          "is_master": true
      },
      "scheme": "mysql",
      "username": "user"
    }
  ]
}
```

## Usage example

In your `.platform/services.yaml`:

```yaml
mydatabase:
    type: mysql:10.0
    disk: 1024
```

In your `.platform.app.yaml`:

```yaml
relationships:
    database: "mydatabase:mysql"
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
  $container->setParameter('database_driver', 'pdo_' . $endpoint['scheme']);
  $container->setParameter('database_host', $endpoint['host']);
  $container->setParameter('database_port', $endpoint['port']);
  $container->setParameter('database_name', $endpoint['path']);
  $container->setParameter('database_user', $endpoint['username']);
  $container->setParameter('database_password', $endpoint['password']);
  $container->setParameter('database_path', '');
}
```

**notes**
1. There is a single MySQL user, so you can not use "DEFINER" Access Control mechanism for Stored Programs and Views.
2. MySQL Errors such as "PDO Exception 'MySQL server has gone away'" are usually simply the result of exhausting your existing diskspace. Be sure you have sufficient space allocated to the service in [.platform/services.yaml](/configuration/services.md).


## Access your MariaDB service

Assuming your MariaDB relationship is named `database`, you can access it by connecting
to a host named `database.internal` using the MySQL command line client.

```bash
mysql -h database.internal -u user main
```

Outside the application container, you can use Platform CLI `platform sql`.
