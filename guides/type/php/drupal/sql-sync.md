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

## Alternative SQL sync methods

Drush `sql-sync` changed in version 7, such that it now always saves a file on
the source by default. As the Platform.sh source is read-only, it will show
an error message (`Unable to create backup directory`).

You have several options to avoid this error:

 * Use `sql-sync` specifying a temporary directory for the file on the source. This may be easier on a slower or less reliable connection, but it could fill up the temporary directory.

  ```
  drush sql-sync @mysite.master @mysite._local --source-dump=/app/tmp/db.sql.gz
  ```

 * Stream the SQL dump directly (handy for smaller databases):

  ```
  drush @mysite.remote sql-dump | drush @mysite._local sqlc
  ```

 * Make an SQL dump locally, and then import from it:

  ```
  drush @mysite.remote sql-dump > dump.sql
  drush @mysite._local sqlc < dump.sql
  ```
