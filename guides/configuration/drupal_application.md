# .platform.app.yaml

Create a ``.platform.app.yaml`` file at the root of your Git repository.

Open this file and paste this content:

```yaml
name: app

type: php:5.6
build:
    flavor: drupal
access:
    ssh: contributor
relationships:
    database: "mysql:mysql"
web:
    locations:
        "/":
            root: "public"
            passthru: "/index.php"
disk: 2048
mounts:
    "/public/sites/default/files": "shared:files/files"
    "/tmp": "shared:files/tmp"
    "/private": "shared:files/private"
crons:
    drupal:
        spec: "*/20 * * * *"
        cmd: "cd public ; drush core-cron"
```

In this example, we are only using the ``mysql`` service. You can use more services (redis, solr...) if you need.

This example presumes that your Drupal codebase is in the "public" directory of your repository. If it's not the case, you can change the ``root`` to the proper folder where your Drupal files are located. Note that putting your Drupal webroot at the root of the repository is not supported.
