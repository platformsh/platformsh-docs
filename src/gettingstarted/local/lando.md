# Using Lando for local development

[Lando](https://github.com/lando/lando) is a container-based local development toolchain that plays nicely with Platform.sh.  It is maintained by a 3rd party but is a viable option for most Platform.sh projects.

See the [Lando documentation](https://docs.lndo.io/) for installing and setting up Lando on your system.

Lando will ask you to create a `.lando.yml` file in your application root, which functions similarly to the `.platform.app.yaml` file.  (Note the different file extension.)  It is safe to check this file into your Git repository as Platform.sh will simply ignore it.

If your application is one of those with a specific "recipe" available from Lando, you can use that directly in your `.lando.yml` file.  It can be customized further as needed for your application, and some customizations are specific to certain applications.

In particular, we recommend:

```yaml
# Name the application the same as in your .platform.app.yaml.
name: app
# Use the recipe appropriate for your application.
recipe: drupal8

# The following additional build step will install the Platform CLI
# in the application container.
services:
  appserver:
    build:
      - "curl -sS https://platform.sh/cli/installer | php"

# The following entry creates a `lando platform` command that will run
# any Platform CLI command from inside the container if desired. 
tooling:
  platform:
    service: appserver
    description: Run Platform CLI commands
    cmd:
      - /var/www/.platformsh/bin/platform
    options:
      passthrough: true

config:
  # Lando defaults to Apache. Switch to nginx to match Platform.sh.
  via: nginx
  
  # Set the webroot to match your .platform.app.yaml.
  webroot: web
  
  # Lando defaults to the latest MySQL release, but Platform.sh uses MariaDB.
  # Specify the version to match what's in services.yaml.
  database: mariadb:10.1
  
  # If you are providing a custom php.ini configuration for Platform.sh, specifying 
  # the same file here will allow the one file to drive both environments. 
  conf:
    php: php.ini
```

## Downloading data from Platform.sh into Lando

In most cases downloading data from Platform.sh and loading it into Lando is straightforward.  If you have a single MySQL database then the following two commands, run from your application root, will download a compressed database snapshot and load it into the local Lando database container (and give you a cheap backup of the database in the process).

```bash
platform db:dump -f database.sql.gz
lando db-import database.sql.gz
```

Rsync can download user files easily and efficiently.  See the [exporting tutorial](/tutorials/exporting.md) for information on how to use rsync.
