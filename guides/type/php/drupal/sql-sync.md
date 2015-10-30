# Synchronize Databases and Files with the Platform CLI

Given the Drush aliases shown above, you can now use a normal Drush
command to synchronize my local database with the data from my Master
environment online:

```bash
$ drush sql-sync @mysite.master @mysite._local
```

In the same style, use Drush to grab the uploaded files from the files
directory and pull them into your local environment:

```bash
$ drush rsync @mysite.staging:%files @mysite._local:%files
```

> **note**

> Never commit the files that are in your `files` directory to the Git
> repository. Git is only meant for code, not *data*, and files that are
> managed by your Drupal site are considered data.

## SQL-sync troubleshooting tips

Drush 7 has problems with SQL-syncing Drupal 7 sites. If you see error
below:

```bash
Starting to dump database on Source. [ok]
Directory /app exists, but is not writable. Please check directory permissions. [error]
Unable to create backup directory /app/drush-backups/main. [error]
Database dump saved to /tmp/main_20150206_091052.sql.gz [success]
sql-dump failed.
```

Then you should downgrade to Drush version 6.\* to make sql-sync work:

```bash
$ composer global require 'drush/drush:6.*'
```

Or you can use a simple workaround by adding "--source-dump=" to make the latest Drush work:

```bash
$ drush sql-sync @mysite.master @mysite._local --source-dump=/app/tmp/db.sql.gz
```
