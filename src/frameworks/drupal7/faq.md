# Drupal Frequently Asked Questions (FAQ)

## How should I name my make files?

In order for Platform to automatically detect your make file, you need
to call it **project.make**.

You can also have a **specific make file for Drupal core** called
**project-core.make**

## When I push changes to a make file, does Platform.sh run the update?

After a push, Platform.sh will rebuild your environment and download all
the modules that are in your make file.

If an update function (hook_update) needs to run, you'll have to
manually trigger it by going to `/update.php` or use the
deployment hooks to automatically run the updates.

## How can I provide a robots.txt file in production?

If using the `drupal` build mode with a Drush make file, place your `robots.txt` file in your application root, as a sibling of `.platform.app.yaml`.  It will get moved to the appropriate location automatically by the build process.  For all other cases just include the file in your web root normally.

On non-production environments Platform.sh automatically blocks web crawlers using the [X-Robots-Tag header](/administration/web/configure-environment.html#x-robots-tag).  You can disable that per-environment if needed.

## I'm getting a PDO Exception 'MySQL server has gone away'

Normally, this means there is a problem with the MySQL server container
and you may need to increase the storage available to MySQL to resolve
the issue. Ballooning MySQL storage can be caused by a number of items:

1)  A large number of watchdog entries being captured. Fix the errors
    being generated or disable database logging.
2)  Cron should run at regular intervals to ensure cache
    tables get cleared out.
3)  If you're using Drupal Commerce Core < 1.10, you may have an
    [extremely large cache_form
    table](https://www.drupal.org/node/2057073). Upgrade to Commerce
    Core 1.10 to resolve.

## Why do I get "MySQL cannot connect to the database server"?

If you are having a problem connecting to the database server, you will
need force a re-deployment of the database container. To do so, you can
edit the service definition to add or remove a small amount of storage and
then push.

## Can I use the name of the session cookie for caching?

For Drupal sites, the name of the session cookie is based on a hash of the
domain name. This means that it will actually be consistent for a specific
website and can safely be used as a fixed value.

## How can I rebuild the site registry?

During the migration process, one or more modules may have changed
location. This could result in a WSOD (white screen of death), any
number of errors (fatal or otherwise), or just a plain broken site. To
remedy this situation, the [registry will need to be
rebuilt](https://www.drupal.org/project/registry_rebuild). To rebuild
the Drupal registry on your Platform.sh instance, you will need to do
the following:

First, SSH into your web container.

```bash
$ ssh [SSH-URL]
```

Second, execute the following commands to download, tweak, and run the
registry rebuild.

```bash
$ drush dl registry_rebuild-7.x-2.3 --destination=/app/tmp
$ sed -i 's/, define_drupal_root()/, '"'"'\/app\/public'"'"'/' /app/tmp/registry_rebuild/registry_rebuild.php
$ cd /app/public
$ php ../tmp/registry_rebuild/registry_rebuild.php
```

## Can I use Backup & Migrate?


The [Backup & Migrate module](https://www.drupal.org/project/backup_migrate) is a Drupal module that provides automated scheduled dumps of a Drupal site's content.  It does so in the form of an SQL dump and/or `tar.gz` archived copy of your site's file directory, which can then be optionally uploaded to a remote storage service.

In general B&M is not necessary when running on Platform.sh.  Platform.sh's [Snapshot](/administration/snapshot-and-restore.md) functionality offers a faster, more robust and easier to restore backup, and for [exporting data](/tutorials/exporting.md) using the Platform.sh CLI is just as effective.

If, however, you find it necessary to still run B&M be aware that its resource requirements can be quite high.  B&M requires a great deal of memory in order to create a snapshot, over and above Drupal's memory requirements.  It is possible for B&M to create a snapshot in the system's temp folder, then PHP runs out of memory before it can complete sending the backup to a 3rd party or cleaning up the temp file.  In the latter case, a full temp disk can result in other, seemingly unrelated issues such as an inability to upload files.

If you find B&M failing or the temp directory filling up mysteriously, try increasing the PHP memory limit to account for B&M's needs.  For example, add the following to `.platform.app.yaml`:

```yaml
variables:
    php:
        memory_limit: 512M
```

If that is still insufficient, your site may simply be too large to work effectively with B&M.  We recommend setting up [automated scheduled snapshots](/administration/snapshot-and-restore.md#automated-snapshots) instead.
