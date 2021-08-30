---
title: "Deploy WordPress"
sidebarTitle: "Deploy"
weight: -80
toc: false
description: |
    Now that your site is ready, push it to Platform.sh and import your data.
---

## Deployment

{{< guides/deployment >}}

## Data migration

If you are moving an existing site to Platform.sh, then in addition to code you will also need to migrate your data.

### Importing the database

First, obtain a database dump from your current site.  If you are using MySQL/MariaDB, then the [`mysqldump` command](https://mariadb.com/kb/en/mysqldump/) is all you need.  Save your dump file as `database.sql`.  (Or any name, really, as long as it's the same as you use below.)

Next, import the database into your Platform.sh site.  The easiest way to do so is with the Platform.sh CLI.

```bash
$ platform sql -e master < database.sql
```

That will connect to the database service on the `master` environment, through an SSH tunnel, and run the SQL import.

### Importing files

You will first need to download your files from your current hosting environment, whatever that is. The easiest way is likely with `rsync`, but consult your old host's documentation. For this guide, we'll assume that you have already downloaded all of your uploaded files to your local `wordpress/wp-content/uploads` directory. If you have them in a different directory, adjust the following commands accordingly.

The `platform mount:upload` command provides a straightforward way to upload an entire directory to your site at once. Under the hood it uses an SSH tunnel and `rsync`, so it will be as efficient as possible. (There is also a `platform mount:download` command you can use to download files later.) Run the following from your local Git repository root (modifying the `--source` path if needed).

```bash
$ platform mount:upload -e master --mount wordpress/wp-content/uploads --source ./wordpress/wp-content/uploads
```

Note that `rsync` is picky about its trailing slashes, so be sure to include those.

Your files and database are now loaded onto your Platform.sh production environment.  When you make a new branch environment off of it, all of your data will be fully cloned to that new environment so you can test with your complete dataset without impacting production.

Go forth and Deploy (even on Friday)!

{{< guide-buttons next="More resources" >}}