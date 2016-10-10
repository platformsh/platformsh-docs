# Migrating an existing Drupal 7 site to Platform.sh

Once you've setup the code for your site as a Platform.sh project, you will need to upload your existing database and files directories as well to complete the site.

## Import database

### With Drush (preferred)

You can use *drush aliases* to import your existing local database into
Platform.

The aliases here are examples. Use the CLI's `platform drush-aliases` command to find your own aliases.

```bash
drush @platform._local sql-dump > backup_database.sql
```

You can also sanitize your database prior to import it into Platform.sh by
running:

```bash
drush @platform._local sql-sanitize
```

When you're ready, export your local database and then import it into
your remote Platform.sh environment.

```bash
drush @platform._local sql-dump > local_database.sql
drush @platform.master sql-cli < local_database.sql
```

When the process completes, you can visit the URL of your development
environment and test that the database has been properly imported.

### Without Drush

Export your database in an SQL file or in a compressed file.

Copy it via SSH to the remote environment on Platform into the
`/app/tmp` folder which is writable:

```bash
scp database.sql [SSH-URL]:/app/tmp
```

Log in to the environment via SSH and import the database:

```bash
ssh [SSH-URL]
web@[PROJECT-ID]-master--php:~$ mysql -h database.internal main < tmp/database.sql
```

## Import files

### With Drush

You can use [*Drush site aliases*](http://docs.drush.org/en/master/usage/#site-aliases) to import your existing local files.

```bash
$ drush rsync @platform._local:%files @platform.master:%files
You will destroy data from [SSH-URL]:././sites/default/files and replace with data from ~/Sites/platform/sites/default/files/
Do you really want to continue? (y/n): y
```

> **note**
> Drush will verify that you are copying and overwriting the proper "files" folders, so double-check that information before you type `y` to continue.

This step may take some time, but when the process completes, you can
visit the URL of your `master` environment and test that the files
have properly been imported.

### Without Drush

Go to your "files" folder on your local machine and synchronize them to
your remote Platform environment:

```bash
$ rsync -r files/. [SSH-URL]:public/sites/default/files/
```

Note that the path in URL may vary depending on what your `.platform.app.yaml` file specifies as the root path and files mount.

#### Directly from server to platform.sh
If the files folder is too large to fit on your computer, you can transfer them directly from server to server. If you have a firewall between the origin server and platform.sh, you can use agent-forwarding to enable a direct connection:
```bash
$ ssh -A -t [USER]@[ORIGIN-SERVER] ssh -A -t [SSH-URL]
$ rsync -a --delete [USER]@[ORIGIN-SERVER]:/var/www/drupal/sites/default/files/ public/sites/default/files
```

> **note**
> If you are using a Mac OS computer, you might experience issues where files with non-ascii characters in them don't work after transfer because Mac OS X uses decomposed form (like "a + ¨ = ä", a form known as NFD), not the usual composed form ("ä", a form known as NFC used everywhere else). One workaround is to use the direct server-to-server transfer method mentioned above.
