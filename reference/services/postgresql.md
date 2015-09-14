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
            @TODO.
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
  @TODO
}
```
