---
title: "Configure TYPO3 for Platform.sh"
sidebarTitle: "Configure"
weight: -100
toc: false
description: |
    Review the basics of what makes up a Platform.sh project, including its three principle configuration files and how to define them for TYPO3.
---

{{< guides/config-desc name="TYPO3" >}}

## Requests configuration: `routes.yaml`

{{< guides/config-routes template="typo3" name="TYPO3" >}}

## Service configuration: `services.yaml`

The `services.yaml` file lists the pre-packaged services you need for your application to run. You pick the major version of the service, and Platform.sh updates the patch version periodically so that you always get the newest version when you deploy.

We recommend the latest [MariaDB](/configuration/services/mysql.md) version for TYPO3, although you can also use Oracle MySQL or [PostgreSQL](/configuration/services/postgresql.md) if you prefer.  We also strongly recommend using [Redis](/configuration/services/redis.md) for TYPO3 caching. Our TYPO3 template comes [pre-configured to use Redis](https://github.com/platformsh-templates/typo3#customizations) for caching.

You can add [other services](/configuration/services/_index.md) if desired, such as [Solr](/configuration/services/solr.md) or [Elasticsearch](/configuration/services/elasticsearch.md). You will need to configure TYPO3 to use those services as well once the service is enabled.

Each service entry has a name (`db` and `cache` in the example below), as well as a `type` that specifies the service and version to use.  Note that not all services support clean version upgrades, and none support downgrades.  If you want to try upgrading a service, confirm on its service page that it's supported and test on a branch before pushing to your `master` branch.

If a service stores persistent data then it will also have a `disk` key, which specifies the amount of storage to give it, in MB.

{{< readFile file="static/files/fetch/servicesyaml/typo3" highlight="yaml" >}}

## Application container: `.platform.app.yaml`

The `platform.app.yaml` file is the heart of your application. It has an [extensive set of options](/configuration/app/_index.md) that allow you to configure nearly any aspect of your application. Most of it is explained with comments inline.</p>

You can and likely will evolve this file over time as you build out your site.

The example `platform.app.yaml` file below will work for most TYPO3 instances.

Please note that it includes a relationship to a Redis service. This service will have to be defined in the `routes.yaml` file. You'll also notice that the command `php vendor/bin/typo3cms install:generatepackagestate` is run during the build phase. It will make sure all installed extensions are enabled and can be ommitted if you commit your own [`PackageStates.php`](https://docs.typo3.org/m/typo3/reference-coreapi/master/en-us/ExtensionArchitecture/ExtensionManagement/Index.html#package-manager) file.

```yaml
# This file describes an application. You can have multiple applications
# in the same project.
#
# See https://docs.platform.sh/configuration/app.html

# The name of this app. Must be unique within a project.
name: app

# The runtime the application uses.
type: php:7.4

runtime:
    # Enable the redis extension so TYPO3 can communicate with the Redis cache.
    extensions:
        - redis

# Composer build tasks run prior to build hook, which runs
# composer --no-ansi --no-interaction install --no-progress --prefer-dist --optimize-autoloader
# if composer.json is detected.
build:
    flavor: composer

# The relationships of the application with services or other applications.
# The left-hand side is the name of the relationship as it will be exposed
# to the application in the PLATFORM_RELATIONSHIPS variable. The right-hand
# side is in the form `<service name>:<endpoint name>`.
#
# NOTE: Be sure to update database and Redis configuration in `public/typo3conf/PlatformshConfiguration.php`
# if you rename the relationships here.
relationships:
    # MariaDB/MySQL will then be accessible to the app from 'database' relationship.
    # The service name `db` must match the top-level attribute in `.platform/services.yaml`.
    database: 'db:mysql'

    # Redis will then be accessible to the app from 'rediscache' relationship.
    # The service name `cache` must match the top-level attribute in `.platform/services.yaml`.
    rediscache: 'cache:redis'

# The configuration of app when it is exposed to the web.
web:
    # How the application container responds to incoming requests.
    locations:
        # All requests not otherwise specified follow these rules.
        '/':
            # The folder from which to serve static assets, for this location.
            # This is a filesystem path, relative to the application root.
            root: 'public'

            # Redirect any incoming request to TYPO3's front controller.
            passthru: '/index.php'

            # File to consider first when serving requests for a directory.
            index:
                - 'index.php'

            # Deny access to all static files, except those specifically allowed below.
            allow: false

            # Rules for specific URI patterns.
            rules:
                # Allow access to common static files.
                '\.(jpe?g|png|gif|svgz?|css|js|map|ico|bmp|eot|woff2?|otf|ttf)$':
                    allow: true
                '^/robots\.txt$':
                    allow: true
                '^/sitemap\.xml$':
                    allow: true

        # Default Storage location where TYPO3 expects media resources to be located.
        # Writable at runtime with the mount `public/fileadmin`.
        '/fileadmin':
            root: 'public/fileadmin'
            # Do not execute PHP scripts from the writeable mount.
            scripts: false
            allow: true
            passthru: '/index.php'

        # Directory for temporary files that should be publicly available (e.g. generated images).
        # Writable at runtime with the mount `publi/typo3temp`.
        '/typo3temp/assets':
            root: 'public/typo3temp/assets'
            # Do not execute PHP scripts from the writeable mount.
            scripts: false
            allow: true
            passthru: '/index.php'

        # Local TYPO3 installation settings.
        '/typo3conf/LocalConfiguration.php':
            allow: false

        # Additional TYPO3 installation settings.
        '/typo3conf/AdditionalConfiguration.php':
            allow: false

# The size of the persistent disk of the application (in MB).
disk: 2048

# The 'mounts' describe writable, persistent filesystem mounts in the application.
mounts:
    # Directory for temporary files. It contains subdirectories (see below) for
    # temporary files of extensions and TYPO3 components.
    "public/typo3temp":
        source: local
        source_path: "typo3temp"
    # Default Storage location where TYPO3 expects media resources to be located.
    "public/fileadmin":
        source: local
        source_path: "fileadmin"
    # Contains system files, like caches, logs, sessions
    "var":
        source: local
        source_path: "var"

# The hooks that will be performed when the package is deployed.
hooks:
    # The build hook runs after Composer to finish preparing up your code.
    # No services are available but the disk is writeable.
    build: |
        # Exit hook immediately if a command exits with a non-zero status.
        set -e

        # Generates the `PackageStates.php` file from the `composer.json` configuration
        php vendor/bin/typo3cms install:generatepackagestate

    # The deploy hook runs after your application has been deployed and started.
    # Code cannot be modified at this point but the database is available.
    # The site is not accepting requests while this script runs so keep it
    # fast.
    deploy: |
        # Exit hook immediately if a command exits with a non-zero status.
        set -e

crons:
     # Run TYPO3's Scheduler tasks every 5 minutes.
    typo3:
        spec: "*/5 * * * *"
        cmd: "vendor/bin/typo3 scheduler:run"
```

{{< guide-buttons next="Customize TYPO3" >}}
