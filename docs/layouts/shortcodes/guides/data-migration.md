## Data migration

If you are moving an existing site to Platform.sh, then in addition to code you also need to migrate your data.
That means your database and your files.

### Importing the database

First, obtain a database dump from your current site.
If you are using MySQL/MariaDB, then the [`mysqldump` command](https://mariadb.com/kb/en/mysqldump/) is all you need.
Save your dump file as `database.sql`.
(Or any name, really, as long as it's the same as you use below.)

{{ .Inner | .Page.RenderString }}

Next, import the database into your Platform.sh site.
The easiest way to do so is with the Platform.sh CLI.

```bash
platform sql -e production < database.sql
```

That connects to the database service on the `production` environment, through an SSH tunnel, and runs the SQL import.

### Importing files

You first need to download your files from your current hosting environment, whatever that is.
The easiest way is likely with `rsync`, but consult your old host's documentation.
This guide assumes that you have already downloaded {{ if .Get "WordPress" }}
all of your uploaded files to your local `wordpress/wp-content/uploads` directory
{{ else }}
all of your user files to your local `files/user` directory and your public files to `files/public`
{{ end }}, but adjust accordingly for their actual locations.

The `platform mount:upload` command provides a straightforward way to upload an entire directory to your site at once.
Under the hood, it uses an SSH tunnel and `rsync`, so it is as efficient as possible.
(There is also a `platform mount:download` command you can use to download files later.)
Run the following from your local Git repository root
(modifying the `--source` path if needed
and setting `<BRANCH_NAME>` to the branch you are using).

{{ if .Get "WordPress" }}
```bash
platform mount:upload -e <BRANCH_NAME> --mount wordpress/wp-content/uploads --source ./wordpress/wp-content/uploads
```
{{ else }}
```bash
$ platform mount:upload -e <BRANCH_NAME> --mount src/main/resources/files/user --source ./files/user
$ platform mount:upload -e <BRANCH_NAME> --mount src/main/resources/files/public --source ./files/public
```
{{ end }}

Note that `rsync` is picky about its trailing slashes, so be sure to include those.

Your files and database are now loaded onto your Platform.sh production environment.
When you make a new branch environment off of it,
all of your data will be fully cloned to that new environment
so you can test with your complete dataset without impacting production.
