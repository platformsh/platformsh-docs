# Backup & Migrate module

The [Backup & Migrate module](https://www.drupal.org/project/backup_migrate) is a Drupal module that provides automated scheduled dumps of a Drupal site's content.  It does so in the form of an SQL dump and/or `tar.gz` archived copy of your site's file directory, which can then be optionally uploaded to a remote storage service.

In general B&M is not necessary when running on Platform.sh.  Platform.sh's [Snapshot](/administration/snapshot-and-restore.md) functionality offers a faster, more robust and easier to restore backup, and for [exporting data](/tutorials/exporting.md) using the Platform.sh CLI is just as effective.

If, however, you find it necessary to still run B&M be aware that its resource requirements can be quite high.  B&M requires a great deal of memory in order to create a snapshot, over and above Drupal's memory requirements.  It is possible for B&M to create a snapshot in the system's temp folder, then PHP runs out of memory before it can complete sending the backup to a 3rd party or cleaning up the temp file.  In the latter case, a full temp disk can result in other, seemingly unrelated issues such as an inability to upload files.

If you find B&M failing or the temp directory filling up mysteriously, try increasing the PHP memory limit to account for B&M's needs.  For example, add the following to `.platform.app.yaml`:

```yaml
variables:
    php:
        memory_limit: 512MB
```

If that is still insufficient, your site may simply be too large to work effectively with B&M.  We recommend setting up [automated scheduled snapshots](/administration/snapshot-and-restore.md#automated-snapshots) instead.
