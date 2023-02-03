This example assumes that you have already [deployed a Django project on Platform.sh](/guides/django/deploy), where production data is already present in a PostgreSQL database.
It's assumed that database has the following service definition:

```yaml {location=".platform/services.yaml"}
db:
    type: postgresql:12
    disk: 1024
```

and the corresponding relationship definition:

```yaml {location=".platform.app.yaml"}
relationships:
    database: "db:postgresql"
```

It also assumes that there is a local copy of the project repository on your computer.
This can be done with the CLI command `platform get PROJECT_ID`, or by cloning an integrated source repository where `platform project:set-remote PROJECT_ID` has been run.

The steps below are presented for pip, Pipenv, and Poetry to run the built-in lightweight development server with `manage.py runserver`. 
If matching a production web server locally (Gunicorn, Daphne, etc.), [modify those commands accordingly](/languages/python/server).

Finally, this example mostly assumes that a Platform.sh is the primary remote for the project. 
When using source integrations, the steps will be identical in most cases and addressed otherwise.
