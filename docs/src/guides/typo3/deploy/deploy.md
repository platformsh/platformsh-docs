---
title: "Deploy TYPO3"
sidebarTitle: "Deploy"
weight: -80
toc: false
description: |
    Now that your site is ready, push it to Platform.sh and import your data.
---

## Deployment

If you have been customizing your existing project as you go, now is the time to ensure all code is committed to Git and to `git push` to Platform.sh on the `master` branch.  That will cause Platform.sh to build your code, producing a read-only file system image of your application, and then deploy it into a running cluster of containers.

You can view the process from the Management Console; when it is done, click the URL shown in the Console to see your site.

## Post-install (new site)


You probably noticed the following lines of code in your `.platform.app.yaml` file during the deploy hook:

```yaml
    # The deploy hook runs after your application has been deployed and started.
    # Code cannot be modified at this point but the database is available.
    # The site is not accepting requests while this script runs so keep it
    # fast.
    deploy: |
        # Exit hook immediately if a command exits with a non-zero status.
        set -e

        # Set TYPO3 site defaults on first deploy.
        if [ ! -f var/platformsh.installed ]; then
            # Copy the created LocalConfiguration into the writable location.
            cp public/typo3conf/LocalConfiguration.FromSource.php var/LocalConfiguration.php

            # On first install, create an inital admin user with a default password.
            # *CHANGE THIS VALUE IMMEDIATELY AFTER INSTALLATION*
            php vendor/bin/typo3cms install:setup \
                --install-steps-config=src/SetupDatabase.yaml \
                --site-setup-type=no \
                --site-name="TYPO3 on Platform.sh" \
                --admin-user-name=admin \
                --admin-password=password \
                --skip-extension-setup \
                --no-interaction

            # Sets up all extensions that are marked as active in the system.
            php vendor/bin/typo3cms extension:setupactive || true

            # Create file that indicates first deploy and installation has been completed.
            touch var/platformsh.installed
        fi;
```

The template is designed to run the TYPO3 installer only on the first deploy by creating a placeholder `platformsh.installed` on the `var` mount. You should not remove this file unless you want the next deployment to run through the installer again.

Next, when the deploy hook ran through the installer, it set an intial username and password for the TYPO3 site, which you will want to update immediately. Visit `/typo3` on the generated url for the environment and login with those temporary `admin` credentials. Then click on the user icon in the top right of the page and go to User Settings > Password to update.

Lastly you will need to enable the `pixelant/pxa-lpeh` extension you added with Composer. From the Backend, click on the Extensions icon in the sidebar. Search for the extension and then `Activate` it.

## Data migration

If you are moving an existing site to Platform.sh, then in addition to code you will also need to migrate your data.  That means your database (generally [MySQL/MariaDB](/configuration/services/mysql.md), although [PostgreSQL](/configuration/services/postgresql.md) is also available) and your files.

### Importing the database

First, obtain a database dump from your current site.  If you are using MySQL/MariaDB, then the [`mysqldump` command](https://mariadb.com/kb/en/mysqldump/) is all you need.  Save your dump file as `database.sql`.  (Or any name, really, as long as it's the same as you use below.)

{{ note }}
Drupal has a number of database tables that are entirely useless when migrating, and you're better off excluding their data.

* If you're using a database cache backend then you can and should exclude all `cache_*` table data.  On Platform.sh we recommend using Redis anyway, and the template described on the previous pages uses Redis automatically.
* The `sessions` table's data can also be excluded.

While you can trim the data out of these tables post-migration, that is wasteful of both time and disk space, so it's better to exclude that data to begin with.
{{ /note }}

Next, import the database into your Platform.sh site.  The easiest way to do so is with the Platform.sh CLI.

```bash
$ platform sql -e master < database.sql
```

That will connect to the database service on the `master` environment, through an SSH tunnel, and run the SQL import.

### Importing files

You will first need to download your files from your current hosting environment, whatever that is.  The easiest way is likely with `rsync`, but consult your old host's documentation.  For this guide, we'll assume that you have already downloaded all of your user files to your local `web/sites/default/files` directory, and your public files to `public`.  If you have them in a different directory, ajust the following commands accordingly.

The `platform mount:upload` command provides a simple, straightforward way to upload an entire directory to your site at once.  Under the hood it uses an SSH tunnel and `rsync`, so it will be as efficient as possible.  (There is also a `platform mount:download` command you can use to download files later.)  Run the following from your local Git repository root (modifying the `--source` path if needed).

```bash
$ platform mount:upload -e mster --mount web/sites/default/files/ --source ./web/sites/default/files/
$ platform mount:upload -e master --mount private/ --source ./private/
```

Note that `rsync` is picky about its trailing slashes, so be sure to include those.

Your files and database are now loaded onto your Platform.sh production environment.  When you make a new branch environment off of it, all of your data will be fully cloned to that new environment so you can test with your complete dataset without impacting production.

Go forth and Deploy (even on Friday)!

{{< guide-buttons next="More resources" >}}
