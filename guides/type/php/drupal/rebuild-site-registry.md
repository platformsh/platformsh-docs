# Rebuild the site registry

During the migration process, one or more modules may have changed
location. This could result in a WSOD (white screen of death), any
number of errors (fatal or otherwise), or just a plain broken site. To
remedy this situation, the [registry will need to be
rebuilt](https://www.drupal.org/project/registry_rebuild). To rebuild
the Drupal registry on your Platform.sh instance, you will need to do
the following:

First, SSH into your web container.

```bash
$ ssh [PROJECT-ID]-master@ssh.[REGION].platform.sh
```

Second, execute the following commands to download, tweak, and run the
registry rebuild.

```bash
$ drush dl registry_rebuild --destination=/app/tmp
$ sed -i 's/, define_drupal_root()/, '"'"'\/app\/public'"'"'/' /app/tmp/registry_rebuild/registry_rebuild.php
$ cd /app/public
$ php ../tmp/registry_rebuild/registry_rebuild.php
```