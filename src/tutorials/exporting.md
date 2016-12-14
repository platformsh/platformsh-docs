# Exporting data

Platform.sh aims to be a great host, but we never want to lock you in to our service. Your code and your data belong to you, and you should always be able to download your entire site's dataset for local development, backup, or to "take your data elsewhere".

## Downloading code

Your application's code is maintained in Git.  Because Git is a distributed system it is trivial to download your entire code history with a simple `git clone` or `platform get` command.

## Downloading files

Your application runs on a read-only file system, so it cannot be edited.  That means there's nothing to download from most of it that isn't already in your Git repository.

The only files to download are from any writeable file mounts you may have defined in your `.platform.app.yaml` file.  The easiest way to download those is using the `rsync` tool.  For instance, suppose you have a mounts section that defines one web-accessible directory and one non-web-accessible directory:

```yaml
mounts:
    '/web/uploads': 'shared:files/uploads'
    '/private': 'shared:files/private'
```

First, get the SSH URL of your application and environment:

```bash
platform ???
```

Then, use `rsync` to download each directory.  Note that the trailing slash on the remote path means `rsync` will copy just the files inside the specified directory, not the directory itself, .

```bash
rsync -az [SSH-URL]:/app/private/ ./private/
rsync -az [SSH-URL]:/app/web/uploads ./uploads/
```

See the [`rsync` documentation]() for more details on how to adjust the download process.

## Download data from services

The mechanism for downloading from each service (such as your database) varies.  For services designed to hold non-persistent information (such as Redis or Solr) it's generally not necessary to download data as it can be rebuilt off of the primary data store.

To download data from persistent services ([MySQL](/configuration/services/mysql.md), [PostgreSQL](/configuration/services/postgresql.md), or [MongoDB](/configuration/services/mongodb.md)), see each service's page for instructions.
