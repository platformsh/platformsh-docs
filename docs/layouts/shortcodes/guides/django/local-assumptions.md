## Assumptions

This example makes a few assumptions, which you may need to adjust for your own circumstances.

It assumes that you've already [deployed a Django project on Platform.sh](../deploy/_index.md)
that has production data in a PostgreSQL database.

It's assumed that database has the following service definition:

```yaml {location=".platform/services.yaml"}
db:
    type: postgresql:12
    disk: 1024
```

This is assumed to have the following relationship definition:

```yaml {location=".platform.app.yaml"}
relationships:
    database: "db:postgresql"
```

It's assumed you want to run a built-in lightweight development server with `manage.py runserver`. 
To match a production web server (such as Gunicorn or Daphne),
[modify those commands accordingly](../../../languages/python/server.md).

Finally, this example mostly assumes that a Platform.sh is the primary remote for the project. 
When using source integrations, the steps will be identical in most cases and addressed otherwise.
