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

# The size of the persistent disk of the application (in MB).
disk: 2048

# The 'mounts' describe writable, persistent filesystem mounts in the application.
# The keys are directory paths relative to the application root. The values are
# strings such as 'shared:files/NAME' where NAME is just a unique name for the mount.
mounts:
    '/web/files': 'shared:files/web-files'

# The hooks that will be triggered when the package is deployed.
hooks:
    # Build hooks can modify the application files on disk but not access any services like databases.
    build: |
      rm web/app_dev.php
    # Deploy hooks can access services but the file system is now read-only.
    deploy: |
      app/console --env=prod cache:clear
```

> **Note**
> This configuration file is specific to one application. If you have multiple
> applications inside your Git repository (such as a RESTful web service and a
> front-end, or a main web site and a blog), you need `.platform.app.yaml`
> at the root of each application. See the [Multi-app](/configuration/app/multi-app.md) documentation.

The `.platform.app.yaml` file is extremely flexible.  Depending on your needs it could be less than 10 lines long or over 100.  The only required keys are `name`, `type`, `disk`, and a minimal `web` block.  All others are optional.
 
 The basic properties are described below, and other blocks are described in their own pages. 

## Name

The `name` is the unique identifier of the application. Platform.sh supports multiple applications within a project, so each application must have a **unique name** within a project. The name may only be composed of lower case alpha-numeric characters (a-z0-9).

> **Warning**
> Changing the `name` of your application after it has been deployed will destroy all storage volumes and result in the loss of all persistent data.  This is typically a Very Bad Thing to do. It could be useful under certain circumstances in the early stages of development but you almost certainly don't want to change it on a live project.

This name is used in the `.platform/routes.yaml` file to define the HTTP upstream (by default `php:http`).  For instance, if you called your application `app` you will need to use `app:http` in the upstream field.

You can also use this name in multi-application relationships.

## Type

The `type` key defines the base container image that will be used to run the application.  There is a separate base container image for each primary language for the application, often in multiple versions.  Supported languages include:

* [`php`](/languages/php.md)
* [`hhvm`](/languages/php.md)
* [`nodejs`](/languages/nodejs.md)
* [`python`](/languages/python.md)
* [`ruby`](/languages/ruby.md)
* [`golang`](/languages/go.md)

See the appropriate language page for all available versions.

**Example**

```yaml
type: php:7.1
```

## Runtime

The `.platform.app.yaml` file also supports a `runtime` key that allows selected customizations to the language runtime. As those possibilities vary by language, please see the appropriate language documentation.

* [PHP](/languages/php.md)


## Upgrading from previous versions of the configuration file.

Although we make an effort to always maintain backward compatibility in the `.platform.app.yaml` format, we do from time to time [upgrade the file](/configuration/app/upgrading.md) and encourage you to upgrade as well.
