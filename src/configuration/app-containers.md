---
search:
    keywords: ['.platform.app.yaml']
---

# Configure your Application

You control your application and the way it will be built and deployed on Platform.sh via a single configuration file, `.platform.app.yaml`, located at the root of your application folder inside your Git repository.

An example of a minimalist `.platform.app.yaml` file for PHP is below:

```yaml
# .platform.app.yaml

# The name of this application, which must be unique within a project.
name: 'app'

# The type key specifies the language and version for your application.
type: 'php:7.0'

# On PHP, there are multiple build flavors available. Pretty much everyone
# except Drupal 7 users will want the composer flavor.
build:
  flavor: composer

# The relationships of the application with services or other applications.
# The left-hand side is the name of the relationship as it will be exposed
# to the application in the PLATFORM_RELATIONSHIPS variable. The right-hand
# side is in the form `<service name>:<endpoint name>`.
relationships:
    database: 'mysqldb:mysql'

# The hooks that will be triggered when the package is deployed.
hooks:
    # Build hooks can modify the application files on disk but not access any services like databases.
    build: |
      rm web/app_dev.php
    # Deploy hooks can access services but the file system is now read-only.
    deploy: |
      app/console --env=prod cache:clear


# The size of the persistent disk of the application (in MB).
disk: 2048

# The 'mounts' describe writable, persistent filesystem mounts in the application.
# The keys are directory paths relative to the application root. The values are
# strings such as 'shared:files/NAME' where NAME is just a unique name for the mount.
mounts:
    '/web/files': 'shared:files/web-files'

# The configuration of the application when it is exposed to the web.
web:
    locations:
        '/':
            # The public directory of the application relative to its root.
            root: 'web'
            # The front-controller script which determines where to send
            # non-static requests.
            passthru: '/app.php'
        # Allow uploaded files to be served, but do not run scripts.
        # Missing files get mapped to the front controller above.
        '/files':
            root: 'web/files'
            scripts: false
            allow: true
            passthru: '/app.php'
```

> **Note**
> This configuration file is specific to one application. If you have multiple
> applications inside your Git repository (such as a RESTful web service and a
> front-end, or a main web site and a blog), you need `.platform.app.yaml`
> at the root of each application. See the [Multi-app](/configuration/app/multi-app.md) documentation.

The `.platform.app.yaml` file is extremely flexible.  Depending on your needs it could be less than 10 lines long or over 100.  The only required keys are `name`, `type`, `disk`, and a minimal `web` block.  All others are optional.

The basic properties are described on their own pages.

* [`name`](/configuration/app/name.php) (required) - Sets the unique name of the application container.
* [`type`](/configuration/app/type.php) (required) - Sets the container base image to use, including application language.
* [`relationships`](/configuration/app/name.php) - Defines connections to other services and applications.
* [`access`](/configuration/app/access.php) - Restricts SSH access with more granularity than the UI.
* [`disk` and `mount`](/configuration/app/storage.php) (required) - Defines writeable file directories for the application.
* [`build`, `dependencies`, and `hooks`](/configuration/app/build.php) - Control how the application gets compiled.
* [`web`](/configuration/app/web.php) (required) - Controls how the application is served.
* [`cron`](/configuration/app/cron.php) - Defines scheduled tasks for the application.

## Upgrading from previous versions of the configuration file.

Although we make an effort to always maintain backward compatibility in the `.platform.app.yaml` format, we do from time to time [upgrade the file](/configuration/app/upgrading.md) and encourage you to upgrade as well.
