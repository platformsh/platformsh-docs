# Using Docksal for local development

[Docksal](https://docksal.io) is a container-based local development toolchain that plays nicely with Platform.sh.  It is maintained by the community but is a viable option for most Platform.sh projects.

See the [Docksal documentation](https://docs.docksal.io/) for installing and setting up Docksal on your system.

Docksal will ask you to create a `.docksal` directory in your application root, which functions similarly to the `.platform.app.yaml` file. It is safe to check this directory into your Git repository as Platform.sh will simply ignore it.

## Using Platform.sh CLI within Docksal

To start using the Platform.sh CLI within your docksal project. The `SECRET_PLATFORM_CLI_TOKEN` will need to be set. This will allow for you to interact with your Platform.sh account without the need to download anything locally.

```bash
fin config set --env=local SECRET_PLATFORM_CLI_TOKEN=XXX
```

## Initializing a Platform.sh project

To start using Docksal within a project from scratch. The configuration will need to initialized. This can be done by running the `fin config generate` option and specifing the `docroot` flag.

```bash
fin config generate --docroot=web
fin start
```

## Customizing a Platform.sh project

If your application is one of those with a specific setup available from Docksal, you can use that directly in your `.docksal/docksal.yml` file.  It can be customized further as needed for your application, and some customizations are specific to certain applications.

## Downloading data from Platform.sh into Docksal

In most cases downloading data from Platform.sh and loading it into your project is straightforward.  If you have a single MySQL database then the following two commands, run from your application root, will download a compressed database snapshot and load it into the local Docksal database container. Using the backup will give you a quicker download.

```bash
fin platform db:dump --gzip -f /tmp/database.sql.gz
fin exec 'mysql -u user -puser default /tmp/database.sql.gz'
```

Rsync can download user files easily and efficiently.  See the [exporting tutorial](/tutorials/exporting.md) for information on how to use rsync.
