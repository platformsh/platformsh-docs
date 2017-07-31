---
search:
    keywords: ['.platform.app.yaml']
---

# Configure your Application

You control your application and the way it will be built and deployed on Platform.sh via a single configuration file, `.platform.app.yaml`, located at the root of your application folder inside your Git repository.

The `.platform.app.yaml` file is extremely flexible.  Depending on your needs it could be less than 10 lines long or over 100.  The only required keys are `name`, `type`, `disk`, and at least one "instance definition", either a `web` or `worker` block.  All others are optional.

Your application code can generate one or more application instances. Web instances can be accessed from the outside world, while workers cannot and just run a persistent background process. Otherwise they are very similar.

Different configuration properties can be applied to individual web and worker instances, or globally to all of them.  In the most typical case, with one web instance and no workers, it's common to just list each of the configuration directives below as a top-level property.  However, they can also be specified within the `web` or `worker` blocks to apply to just those instances.

The following properties apply only at the global level, and cannot be replicated inside an instance definition.

* [`name`](/configuration/app/name.md) *(required)* - Sets the unique name of the application container.
* [`type`](/configuration/app/type.md) *(required)* - Sets the container base image to use, including application language.
* [`timezone`](/configuration/app/timezone.md) - Sets the timezone of cron tasks in application container.
* [`build`, `dependencies`, and `hooks`](/configuration/app/build.md) - Control how the application gets compiled.  Note that this compilation happens before the application is copied into different instances, so any steps here will apply to all web and worker instances.
* [`cron`](/configuration/app/cron.md) - Defines scheduled tasks for the application.  Cron tasks will, technically, run as part of the web instance regardless of how many workers are defined.

The following properties can be set at the top level of the `.platform.app.yaml` file and apply to all application instances, or set within a given instance definition and apply just to that one.  If set in both places then the instance-specific one will take precidence, and completely replace the global one.  That is, if you want to make a change to just one sub-property of one of the following keys you need to replicate the entire block.

* [`size`](/configuration/app/size.md) - Sets an explicit sizing hint for the application.
* [`relationships`](/configuration/app/relationships.md) - Defines connections to other services and applications.
* [`access`](/configuration/app/access.md) - Restricts SSH access with more granularity than the UI.
* [`disk` and `mount`](/configuration/app/storage.md) *(required)* - Defines writeable file directories for the application.
* [`variables`](/configuration/app/variables.md) - Sets environment variables that control application behavior.

The `.platform.app.yaml` file needs at least one of the following to define an instance, but may define both.

* [`web`](/configuration/app/web.md) - Controls how the web application is served.
* [`worker`](/configuration/app/web.md) - Defines alternate copies of the application to run as background processes.

## Available resources

Each web or worker instance is its own running container, which takes its own resources.  The `size` key allows some control over how many resources each container gets and if omitted the system will select one of a few fixed sizes for each container automatically.  All application and service containers are given resources out of a common pool defined by your plan size.  That means the more containers you define, the fewer resources each one will get and you may need to increase your plan size.

## Example configuration

An example of a minimalist `.platform.app.yaml` file for PHP, heavily commented, is below:

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

## Upgrading from previous versions of the configuration file.

Although we make an effort to always maintain backward compatibility in the `.platform.app.yaml` format, we do from time to time [upgrade the file](/configuration/app/upgrading.md) and encourage you to upgrade as well.
