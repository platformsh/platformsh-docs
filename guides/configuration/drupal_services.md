# .platform/services.yaml

Create a ``.platform`` folder at the root of your Git repository.

Inside this folder, create a ``services.yaml`` file.

Open this file and paste this content:

```yaml
mysql:
    type: mysql:5.5
    disk: 2048
```

This will deploy a mysql database available for your Drupal site.
