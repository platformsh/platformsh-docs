# .platform.app.yaml

Create a ``.platform.app.yaml`` file at the root of your Git repository.

Open this file and paste this content:

```yaml
name: php
type: php
build:
    flavor: drupal
access:
    ssh: contributor
relationships:
    database: "mysql:mysql"
web:
    document_root: "/"
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

We are also supposing that your Drupal codebase is at the root of your Git repository. If it's not the case, you can change the ``document_root`` to the proper folder where your Drupal files are located.