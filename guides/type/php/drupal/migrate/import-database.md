# Import database

### With Drush

You can use *drush aliases* to import your existing local database into
Platform.

Before playing with the aliases, you should backup your local database
using drush sql-dump.

```bash
$ drush @platform.local sql-dump > backup_database.sql
```

You can also sanitize your database prior to import it into Platform by
running:

```bash
$ drush @platform.local sql-sanitize
```

When you're ready, export your local database and then import it into
your remote Platform environment.

```bash
$ drush @platform.local sql-dump > local_database.sql
$ drush @platform.master sql-cli < local_database.sql
```

When the process completes, you can visit the URL of your development
environment and test that the database has been properly imported.

### Without Drush

Export your database in an SQL file or in a compressed file.

Copy it via SSH to the remote environment on Platform into the
`/app/tmp` folder which is writable:

```bash
$ scp database.sql [PROJECT-ID]-master@ssh.[REGION].platform.sh:/app/tmp
```

Log in to the environment via SSH and import the database:

```bash
$ ssh [PROJECT-ID]-master@ssh.[REGION].platform.sh
web@[PROJECT-ID]-master--php:~$ mysql -h database.internal main < tmp/database.sql
```

