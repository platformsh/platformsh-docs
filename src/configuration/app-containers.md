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


## Build dependencies

The `dependencies` allow you to specify dependencies that your
application might need during the build process.

Platform.sh supports pulling any dependencies for the following
languages:

* PHP
* Python
* Ruby
* Node.js
* Java (with integrated Maven and Ant support)

Those dependencies are independent of the eventual dependencies of your
application and are available in the `PATH` during the build process
and in the runtime environment of your application.

You can specify those dependencies as shown below:

```yaml
dependencies:
  php:
    drush/drush: '6.4.0'
  python:
    behave: '*'
  ruby:
    sass: '3.4.7'
  nodejs:
    grunt-cli: '~0.1.13'
```

## Hooks

The `hooks` let you define shell commands to run during the build and deployment processes.

They can be executed at various points in the lifecycle of the application (build/deploy).

Possible hooks are below:

-   **build**: We run a build hook before your application has been
    packaged. No other services are accessible at this time since the
    application has not been deployed yet.
-   **deploy**: We run a deploy hook after your application has been
    deployed and started. You can access other services at this stage
    (MySQL, Solr, Redis, etc.). The disk where the application lives is read-only at this point.

Each hook is executed as a single script, so they will be considered failed only if the final command in them fails. To cause them to fail on the first failed command, add `set -e` to the beginning of the hook.

The `home` directory for each hook is the application root. If your scripts need to be run from the doc root of your application, you will need to `cd` to it first; e.g.: `cd web`.

After a Git push, you can see the results of the `deploy` hook in the `/var/log/deploy.log` file when logged in to the environment via SSH. It contains the log of the execution of the deployment hook. For example:

```bash
[2014-07-03 10:03:51.100476] Launching hook 'cd public ; drush -y updatedb'.

My_custom_profile  7001  Update 7001: Enable the Platform module.
Do you wish to run all pending updates? (y/n): y
Performed update: my_custom_profile_update_7001
'all' cache was cleared.
Finished performing updates.
```

### [Example] Compile SASS files using Grunt

As a good example of combining dependencies and hooks, you can compile your SASS files using Grunt. The `|` character tells YAML that the following lines should be read as a single string, which allows us to run multiple commands or even use bash syntax for conditionals, as in the second example.

Your `.platform.app.yaml` file should include:

```yaml
dependencies:
  ruby:
    sass: '3.4.7'
  nodejs:
    grunt-cli: '~0.1.13'

hooks:
  build: |
    cd public/profiles/project_name/themes/custom/theme_name
    npm install
    grunt
```

This requires the `package.json` and `Gruntfile.js` files to be correctly setup in the theme folder.

### [Example] Trigger deploy hook on a specific environment

To trigger a deploy hook only on a specific environment/branch, use the following environment variable: `$PLATFORM_BRANCH` which you should put in an `if/then` statement.

Your `.platform.app.yaml` file should include:

```yaml
hooks:
  deploy: |
    if [ "$PLATFORM_BRANCH" = master ]; then
      # Use Drush to disable the Devel module on the Master environment.
      drush dis devel -y
    else
      # Use Drush to enable the Devel module on other environments.
      drush en devel -y
      # Sanitize your database and get rid of sensitive information from Master environment.
      drush -y sql-sanitize --sanitize-email=user_%uid@example.com --sanitize-password=custompassword
    fi
    drush -y updatedb
```

## Runtime

The `.platform.app.yaml` file also supports a `runtime` key that allows selected customizations to the language runtime. As those possibilities vary by language, please see the appropriate language documentation.

* [PHP](/languages/php.md)

## Top level document roots

Platform.sh requires that the document root not be at the root of the project.  It is important for security that
private file mounts are not web-accessible.

## Upgrading from previous versions of the configuration file.

Although we make an effort to always maintain backward compatibility in the `.platform.app.yaml` format, we do from time to time [upgrade the file](/configuration/app/upgrading.md) and encourage you to upgrade as well.
