# PostgreSQL (Database service)

Transactional data storage  and the world's most advanced open source database.

## Supported versions

* 9.3
* 9.6

## Usage example

In your `.platform/services.yaml` add:

```yaml
mydatabase:
    type: postgresql:9.6
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

(Or the equivalent for your application.)

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

## Notes

### Could not find driver

If you see this error: ``Fatal error: Uncaught exception 'PDOException' with message 'could not find driver'``,
this means you are missing the ``pdo_pgsql`` PHP extension. You simply need to enable it in your ``.platform.app.yaml``
(see above).

## Upgrading

Although PostgreSQL includes the `pg_upgrade` command for direct migration of data between versions, the process for using it requires both the old and new versions to be installed side by side, and sometimes requires user intervention. For that reason, we don't support transparent updates from one PostgreSQL version to another (such as from 9.3 to 9.6). Accordingly, upgrading between major versions of PostgreSQL requires a manual dump and restore of the data.

To minimize the downtime associated with such upgrades, we suggest the following process:

1. Create a development environment that you can use to test the upgrade process.
2. Create a new service for the new PostgreSQL version (alongside the existing one), and point your application container's existing relationship at the new service.
3. Add a new relationship to expose the service running the older PostgreSQL version
4. Add a deploy hook that migrates the data from the old service to the new one. This prevents the application from loading and modifying the database during the migration.
5. Make a Git commit with these changes, and push it into the development environment that you're testing with.
6. In the development environment, review `/var/log/deploy.log` to confirm that the migration was successful, inspect the database, and test your application as needed to confirm that the migration was successful and that the application works with the new PostgreSQL version.
7. When you're ready to upgrade the database on your master environment, start off by triggering a fresh snapshot of the master environment's data. This will give you the ability to roll back the upgrade process in case something goes wrong.
8. Push the same commit from step 5 into your project's master branch. This will carry out the migration in your production environment.
9. Finally, push out another commit that removes the old database service, which is no longer needed now that the upgrade process is finished.

### Example deploy hook

Here's a sample deploy hook that you can use to implement the migration between versions:
```yaml
hooks:
    deploy: |
        OLD_RELATIONSHIP_NAME=postgresql_9.3.internal
        NEW_RELATIONSHIP_NAME=postgresql_9.6.internal
        export PGPASSFILE=/tmp/pgpass/.pgpass
        mkdir -p /tmp/pgpass
        chmod -R go-rwx /tmp/pgpass
        cat > $PGPASSFILE <<EOF
        $OLD_RELATIONSHIP_NAME:5432:main:main:main
        $NEW_RELATIONSHIP_NAME:5432:main:main:main
        EOF
        chmod go-rwx $PGPASSFILE

        pg_dump \
            --format custom \
            --host=$OLD_RELATIONSHIP_NAME \
            --port=5432 \
            --dbname=main \
            --username=main \
            --no-password \
        | pg_restore \
            --format custom \
            --no-owner \
            --no-privileges \
            --host=$NEW_RELATIONSHIP_NAME \
            --port=5432 \
            --dbname=main \
            --username=main \
            --no-password

        rm -r /tmp/pgpass
```
