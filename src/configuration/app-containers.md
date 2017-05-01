---
search:
    keywords: ['.platform.app.yaml']
---

# Configure your Application

<!-- toc -->

You control your application and the way it will be built and deployed on
Platform.sh via a single configuration file, `.platform.app.yaml`, located at
the root of your application folder inside your Git repository.

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

## Name

The `name` is the unique identifier of the application. Platform.sh supports multiple applications within a project, so each application must have a **unique name** within a project. The name may only be composed of lower case alpha-numeric characters (a-z0-9).  *Be advised that changing the `name` of your application after it has been deployed will destroy all storage volumes, and thus is typically a Very Bad Thing to do.* It could be useful under certain circumstances in the early stages of development but you almost certainly don't want to change it on a live project.

This name is used in the `.platform/routes.yaml` file to define the HTTP upstream (by default `php:http`).  For instance, if you called your application `app` you will need to use `app:http` in the upstream field.

You can also use this name in multi-application relationships.

> **Note**
> Changing the name of an application is the same as deleting it and replacing
> it. Your application's data (static files) will be deleted.
>
> If you change the name, you should think about updating your other
> configuration files. This includes `.platform/routes.yaml` and any other
> `.platform.app.yaml` files you have in a multi-application project.

## Type

The `type` defines what language will run your application.

The `type` can be one of the following:

* [`php`](/languages/php.md)
* [`hhvm`](/languages/php.md)
* [`nodejs`](/languages/nodejs.md)
* [`python`](/languages/python.md)
* [`ruby`](/languages/ruby.md)

followed by a version.  See the appropriate language page for all available versions.

**Example**

```yaml
type: php:5.6
```

## Build

The `build` defines what happens when building the application.

Its only property is `flavor`, which specifies a default set of build tasks to run. Flavors are language-specific.

* PHP (`composer` by default)
  * `composer` will run `composer --no-ansi --no-interaction install --no-progress --prefer-dist --optimize-autoloader` if a `composer.json` file is detected.
  * `drupal` will run `drush make` automatically in one of a few different ways.  See the [Drupal 7](/frameworks/drupal7.md) documentation for more details. We recommend only using this build mode for Drupal 7.
* Node.js (`default` by default)
  * `default` will run `npm prune --userconfig .npmrc && npm install --userconfig .npmrc` if a `package.json` file is detected. Note that this also allows you to provide a custom `.npmrc` file in the root of your application (as a sibling of the `.platform.app.yaml` file.)

In all languages you can also specify a flavor of `none` (which is the default for any language other than PHP and Node.js); as the name suggests it will take no action at all. That is useful when you want complete control over your build steps, such as to run a custom composer command or use an alternate Node.js package manager.

**Example**

```yaml
build:
    flavor: composer
```

## Runtime

The `.platform.app.yaml` file also supports a `runtime` key that allows selected customizations to the language runtime. As those possibilities vary by language, please see the appropriate language documentation.

* [PHP](/languages/php.md)

## Top level document roots

Platform.sh requires that the document root not be at the root of the project.  It is important for security that
private file mounts are not web-accessible.

## Upgrading from previous versions of the configuration file.

Although we make an effort to always maintain backward compatibility in the `.platform.app.yaml` format, we do from time to time [upgrade the file](/configuration/app/upgrading.md) and encourage you to upgrade as well.
