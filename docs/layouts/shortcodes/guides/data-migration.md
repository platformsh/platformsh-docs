{{ $isWordPress := .Get "WordPress" }}
{{ $isSymfony := .Get "Symfony" }}
## Migrate your data

If you are moving an existing site to Platform.sh, then in addition to code you also need to migrate your data.
That means your database and your files.

### Import the database

First, obtain a database dump from your current site,
such as using the [`mysqldump` command for MariaDB](https://mariadb.com/kb/en/mysqldump/).

{{ .Inner | .Page.RenderString }}

Next, import the database into your Platform.sh site by running the following command:

{{ if $isSymfony }}
```bash
symfony sql < dump.sql
```
{{ else }}
```bash
platform sql < dump.sql
```
{{ end }}

That connects to the database service through an SSH tunnel and imports the SQL.

### Import files

First, download your files from your current hosting environment.
The easiest way is likely with rsync, but consult your host's documentation.

This guide assumes that you have already downloaded {{ if $isWordPress }}
all of your uploaded files to your local `wordpress/wp-content/uploads` directory
{{ else if $isSymfony }}
all of your public files to your local `public/var` directory
{{ else }}
all of your user files to your local `files/user` directory and your public files to `files/public`
{{ end }}, but adjust accordingly for their actual locations.

Next, upload your files to your mounts
using the `{{ if $isSymfony }}symfony{{ else }}platform{{ end }} mount:upload` command.
Run the following command from your local Git repository root,
modifying the `--source` path if needed.

{{ if $isWordPress }}
```bash
platform mount:upload --mount wordpress/wp-content/uploads --source ./wordpress/wp-content/uploads
```
{{ else if $isSymfony}}
```bash
symfony mount:upload --mount public/var --source ./public/var
```
{{ else }}
```bash
$ platform mount:upload --mount src/main/resources/files/user --source ./files/user
$ platform mount:upload --mount src/main/resources/files/public --source ./files/public
```
{{ end }}


This uses an SSH tunnel and rsync to upload your files as efficiently as possible.
Note that rsync is picky about its trailing slashes, so be sure to include those.

You've now added your files and database to your Platform.sh environment.
When you make a new branch environment off of it,
all of your data is fully cloned to that new environment
so you can test with your complete dataset without impacting production.
