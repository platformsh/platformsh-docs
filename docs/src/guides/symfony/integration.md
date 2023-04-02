---
title: "Symfony Integration"
sidebarTitle: "Symfony Integration"
weight: -130
description: |
    How to use the Symfony integration for a better Platform.sh experience.
---

Symfony has a special "integration" with Platform.sh that makes it easier to
use Platform.sh for Symfony projects.

To enable the Symfony integration, check that the following line is at the top
of the application build hook script:

```yaml {location=".platform.app.yaml"}
    hooks:
        build: |
            set -x -e

            curl -fs https://get.symfony.com/cloud/configurator | bash

            # ...
```

If not, we highly recommend that you are using it to unlock many features that
will make your life easier when deploying a Symfony project on Platform.sh.

If you don't have any Platform.sh configuration yet for your project, generate
a sensible default Platform.sh configuration from within the project's
directory:

```bash
symfony project:init
```

The command generates a default set of configuration files:
`.platform.app.yaml`, `.platform/services.yaml`, `.platform/routes.yaml`, and
`php.ini`, which automatically enable the Symfony integration.



FIXME: "Symfony integration" explaining what it is and what it brings
FIXME: If project started with a "standard" platform config, then build and deploy should be used instead?!

 * Exposes additional infrastructure [environment variables](./environment-variables#symfony-environment-variables);
 * Exposes [environment variables for all services](./environment-variables#service-environment-variables);


See an example Symfony project in the official [Symfony template repository](https://github.com/symfonycorp/platformsh-symfony-template), which you can use as a starting point for your own project.




Platform.sh configuration is made of several files that need to be stored along side the project's code. The main file, `.platform.app.yaml`, configures how the application is built and then deployed on Platform.sh.

When creating a new project via symfony new, use the `--cloud` flag to automatically generates a sensible default configuration. On an existing project, run `symfony init` instead.

{{< note title="Tip">}}
The generated files are based on [Open-Source templates](https://github.com/symfonycorp/cloud-templates).
{{< /note >}}

## Hooks

The **hooks** section defines the scripts that Platform.sh runs at specific times of an application lifecycle, build, deploy and post-deploy:

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        set -x -e

        curl -s https://get.symfony.com/cloud/configurator | bash
        symfony-build

    deploy: |
        set -x -e

        symfony-deploy
```

{{< note title="Warning" >}}
Each hook is executed as a single script, so they will be considered failed only if the final command fails. Starts the script with `set -e` to make them fail on the first failed command, this is the behavior of default templates.
{{< /note >}}

Follow this link to get more info on [Hooks](../../../create-apps/hooks/hooks-comparison).

To better understand the big picture and how those steps articulate with each other, we invite you to read about building the application and deploying the application in the [What is Platform.sh?](https://symfony.com/doc/current/cloud/intro.html) article.

{{< note title="Tip">}}
To execute some actions during the *deploy or post_deploy* hooks only for a specific environment type, the simplest way is to use the `PLATFORM_ENVIRONMENT_TYPE` environment variable in a condition:

```yaml {location=".platform.app.yaml"}
hooks:
    deploy: |
        if [ "PLATFORM_ENVIRONMENT_TYPE" != "production" ]; then
            symfony console app:dev:anonymize
        fi
```
{{< /note >}}




## Croncape
FIXME: Should be described as linked from the env var docs MAILFROM

## Configurator
The **configurator** is a script specially crafted for Platform.sh. It ensures that projects are always using the most up-to-date version of some tools:
- [croncape](https://github.com/symfonycorp/croncape)
- [Symfony CLI](https://symfony.com/download)
- [Composer](https://getcomposer.org/download/)

Additionally, it creates some helpers:
[`symfony-build`](#symfony-build),
[`symfony-start`](#symfony-start),
[`symfony-deploy`](#symfony-deploy),
[`symfony-database-migrate`](#symfony-database-migrate),
[`php-ext-install`](#php-ext-install), and [`yarn-install`](#yarn-install).

### symfony-build

**symfony-build** is the recipe to build a Symfony application the best way possible on Platform.sh.
It removes the development frontend file if needed, install the application dependencies using Composer (and Yarn, by running [yarn-install](#yarn-install)), optimize the autoloader,
build Symfony cache if possible and finally build the production assets using Encore.

Composer install is run using default flag values. If you need to override those flags, you can define them using the `$COMPOSER_FLAGS` environment variable:

````yaml {location=".platform.app.yaml"}
hooks:
    build: |
        set -x -e

        curl -s https://get.symfony.com/cloud/configurator | bash
        COMPOSER_FLAGS="--ignore-platform-reqs" symfony-build
````
One can also set `NO_YARN` to any value to disable all Yarn and assets automation during the symfony-build run.

### symfony-deploy
**symfony-deploy** is to be used each time a Symfony application is deployed.
Its purpose is to run the [symfony-start](#symfony-start) helper and when executed from the web container, restart FPM and run the [symfony-database-migrate](#symfony-database-migrate) helper.

### symfony-start
symfony-start is to be used each time a Symfony application starts in a new container. Its purpose is to move the Symfony cache built by [symfony-build](#symfony-build) to be used by the application or built the cache otherwise. It's automatically executed by [symfony-deploy](#symfony-deploy) and Platform.sh automatically runs it before starting (or restarting) workers.

### symfony-database-migrate

You usually don't need to worry about this helper. **symfony-database-migrate** purpose is to run database migrations.
By default, it will run your Doctrine migrations if ``doctrine/doctrine-migrations-bundle`` is installed.
If your application uses another migration system you can override ``/app/.global/bin/symfony-database-migrate`` during build time and [symfony-deploy](#symfony-deploy) will make use of it.
You can use this script at any moment if you need to run migrations manually or if you need to run them for workers.

### php-ext-install

**php-ext-install** is a script that you can use to compile and install PHP extensions not provided out of the box by Platform.sh.
It's written specifically for Platform.sh to ensure fast and reliable setup during the build step.
It currently supports three ways to fetch the sources from:

* From [PECL](https://pecl.php.net/): ``php-ext-install redis 5.3.2``

* From a URL: ``php-ext-install redis https://github.com/phpredis/phpredis/archive/5.3.2.tar.gz``

* From a Git repository: ``php-ext-install redis https://github.com/phpredis/phpredis.git 5.3.2``

To ensure your application can be built properly, it's recommended to run ``php-ext-install`` after the [configurator](#configurator) but before [symfony-build](#symfony-build):

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        set -x -e

        curl -s https://get.symfony.com/cloud/configurator | bash
        php-ext-install redis 5.3.2
        symfony-build
```

When installing [PECL](https://pecl.php.net/) PHP extensions, you can configure them directly as *variables* instead:

```yaml {location=".platform.app.yaml"}
variables:
    php-ext:
        redis: 5.3.2
```

{{< note >}}
Source code is cached between builds and compilation is skipped if it has already been done. Changing the source of downloads or the version will invalidate this cache.
{{< /note >}}

{{< note title="Tip">}}
When downloading the source code, the compression algorithm will be automatically detected. The usual algorithms used by [GNU tar](https://www.gnu.org/software/tar/) are supported.
{{< /note >}}

### yarn-install

**yarn-install** is a script that installs Node and Yarn the best way possible in a PHP container on Platform.sh.
Similarly to Composer install, you can customize Node setup and Yarn install behaviors using the following environment variables:

* ``NVM_DIR``: Directory used to install NVM and Node. Default value is ``/app/.nvm``.

* ``NODE_VERSION``: Pinpoint the Node version that NVM is going to install. Default is ``--lts``

* ``YARN_FLAGS``: Flags to pass to ``yarn install``. No value by default.

If you need to use the Node installation setup by [symfony-build](#symfony-build), you can use the following snippet:

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        set -x -e

        curl -s https://get.symfony.com/cloud/configurator | bash
        symfony-build

        # Setup everything to use the Node installation
        unset NPM_CONFIG_PREFIX
        export NVM_DIR=${SYMFONY_APP_DIR}/.nvm
        set +x && . "${NVM_DIR}/nvm.sh" use --lts && set -x
        # Starting from here, everything is setup to use the same Node
        yarn encore dev
```

Or if you want to use two different Node versions:

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        set -x -e

        curl -s https://get.symfony.com/cloud/configurator | bash
        symfony-build

        cd web/js_app
        unset NPM_CONFIG_PREFIX
        export NVM_DIR=${SYMFONY_APP_DIR}/.nvm

        NODE_VERSION=8 yarn-install

        # Setup everything to use the Node installation
        set +x && . "${NVM_DIR}/nvm.sh" use 8 && set -x

        # Starting from here, everything is setup to use Node 8
        yarn build --environment=prod
```
