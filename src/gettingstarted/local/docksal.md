# Using Docksal for local development

[Docksal](https://docksal.io) is a container-based local development toolchain that plays nicely with Platform.sh.  It is maintained by the community but is a viable option for most Platform.sh projects.

See the [Docksal documentation](https://docs.docksal.io/) for installing and setting up Docksal on your system.

Docksal will ask you to create a `.docksal` directory in your application root, which functions similarly to the `.platform.app.yaml` file. It is safe to check this directory into your Git repository as Platform.sh will simply ignore it.

## Using Platform.sh CLI within Docksal

To start using the Platform.sh CLI within your docksal project. The `SECRET_PLATFORMSH_CLI_TOKEN` will need to be set. This will allow for you to interact with your Platform.sh account without the need to download anything locally.

```bash
fin config set --global SECRET_PLATFORMSH_CLI_TOKEN=XXX
```

## Pulling a Platform.sh project

If you do not have the Platform.sh cli tool installed locally that is ok as this has been installed within the Docksal CLI images. To use the tool and pull a project locally, make sure you have uploaded your SSH key to your Platform.sh account. Once that has been done and a `SECRET_PLATFORMSH_CLI_TOKEN` has been added using the above step. The following command can be ran. Replacing `PROJECT_ID` with the project id found within the Platform.sh dashboard and replacing `project_directory` with the name of the directory you'd like the project cloned into.

```bash
fin run-cli 'platform get PROJECT_ID -e master project_directory'
```

## Initializing a Platform.sh project

To start using Docksal within a project from scratch. The configuration will need to initialized. This can be done by running the `fin config generate` option and specifing the `docroot` flag.

```bash
fin config generate --docroot=web
fin start
```

## Customizing a Platform.sh project

By default docksal comes configured with a PHP 7.1 Container, a Web Container, and a Database Container. To change these the following variables can be added within your `.docksal/docksal.env` file.

```
# Apache Versions 2.2 / 2.4
#WEB_IMAGE='docksal/web:2.1-apache-2.2'
WEB_IMAGE='docksal/web:2.1-apache-2.4'

# MySQL Version: 5.6 / 5.7 / 8.0
#DB_IMAGE='docksal/db:1.2-mysql-5.6'
DB_IMAGE='docksal/db:1.2-mysql-5.7'
#DB_IMAGE='docksal/db:1.2-mysql-8.0'

# PHP Versions Available 5.6 / 7.0 / 7.1 / 7.2
#CLI_IMAGE='docksal/cli:2.4-php5.6'
#CLI_IMAGE='docksal/cli:2.4-php7.0'
CLI_IMAGE='docksal/cli:2.4-php7.1'
#CLI_IMAGE='docksal/cli:2.4-php7.2'
```

If your application is one of those with a specific setup available from Docksal, you can customize the `.docksal/docksal.yml` file within your project.  This is a docker-compose file and can be customized further as needed for your application, as some customizations are specific to certain applications.

## Downloading data from Platform.sh into Docksal

In most cases downloading data from Platform.sh and loading it into your project is straightforward.  If you have a single MySQL database then the following two commands, run from your application root, will download a compressed database snapshot and load it into the local Docksal database container. Using the backup will give you a quicker download.

```bash
fin platform db:dump --gzip -f /tmp/database.sql.gz
fin exec 'mysql -u user -puser default /tmp/database.sql.gz'
```

Rsync can download user files easily and efficiently.  See the [exporting tutorial](/tutorials/exporting.md) for information on how to use rsync.
