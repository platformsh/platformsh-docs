---
title: "Configuration"
sidebarTitle: "Configuration"
weight: -110
description: |
    Understand how to configure Symfony.
---

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

## Cron Jobs

**Cron jobs** allow you to run scheduled tasks at specified times or intervals.
To get feedback when something goes wrong, prefix the command with ``croncape``. ``croncape`` will send an email to the address defined by the ``MAILTO`` environment variable.
Don't forget to set it first via the following command:

````bash
symfony var:create -y --level=project --name=env:MAILTO --value=sysadmin@example.com
````

{{< note title="Tip">}}
If you want to run a command in a cron hook for specific environment types, check the ``PLATFORM_ENVIRONMENT_TYPE`` environment variable:

```yaml {location=".platform.app.yaml"}

crons:
    snapshot:
        spec: 0 5 * * *
        cmd: |
            # only run for the production environment, aka main branch
            if [ "$PLATFORM_ENVIRONMENT_TYPE" = "production" ]; then
                croncape symfony ... --no-wait
            fi
```
{{< /note >}}

{{< note >}}
To ensure better reliability, by default ``croncape`` sends its emails using ``project-id@cron.noreply.platformsh.site`` as the sender address (``project-id+branch@cron.noreply.platformsh.site`` for non-main environments) and the provided :ref:`Platform.sh SMTP <email-env-vars>` service; even if you define your own ``MAILER_*`` environment variables.

If you wish to use a custom SMTP and/or use a custom sender address you need to follow these steps:

1. Define the sender address by defining the ``MAILFROM`` environment variable;
1. Define the environment variables required to use your own email service, refers to the [TODO email](#email-env-vars) documentation to check their names.
   Please note that only SMTP connections are supported;
1. Disable the provided SMTP service using ``symfony cloud:env:info enable_smtp false``

{{< /note >}}


## Workers

**Workers** (or consumers) are a great way to off-load processing in the background to make a website as snap as possible. Implementing workers in Symfony is made easy thanks to the [TODO Messenger component](#messenger-component) </doc/current/components/messenger.html>`.
This is why deploying workers is a first-class use-case with Platform.sh.

To deploy a worker, add an entry under the ``workers`` section:

```yaml {location=".platform.app.yaml"}
workers:
    mails:
        commands:
            start: symfony console messenger:consume --time-limit=60 --memory-limit=128M
```

On Platform.sh, worker containers run the exact same code as the web container.
The container image is built only once, and then deployed multiple times in its own container along the web one.
The *build* hook and dependencies may not vary but as these containers are independent they can be customized the same way using common properties (default values are the one defined for the main container).

The ``commands.start`` key is required and specifies the command to use to launch the application worker.
If the command specified by the ``start`` key terminates it will be restarted automatically.

Follow this link to get more info on [Workers](../../../create-apps/app-reference.html#workers).

{{< note title="Tip">}}
Running the [symfony-deploy](#symfony-deploy) command before starting your worker is not necessary anymore, Platform.sh takes care of running it automatically.
{{< /note >}}

{{< note title="Caution">}}
Web and worker containers do not share mounts targets.
Sharing files between those containers using the filesystem is not possible.
Every data sharing needs to be done using services.
{{< /note >}}

