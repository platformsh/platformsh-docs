---
title: "Symfony Integration"
sidebarTitle: "Symfony Integration"
weight: -130
description: |
    Learn how to use the Symfony integration for a better Platform.sh experience.
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

When creating a new project via `symfony new`, use the `--cloud` flag to
automatically generates a sensible default configuration. On an existing
project, run `symfony project:init` instead.

```bash
symfony project:init
```

The main configuration files that are generated to automatically enable the
Symfony integration are the following: `.platform.app.yaml`,
`.platform/services.yaml`, `.platform/routes.yaml`, and `php.ini`.

The following sections explain the Symfony integration in mode details:

* [Extra tools](#tools);
* [Default build and deploy hook scripts](#hooks);
* [Additional infrastructure environment variables](./environment-variables#symfony-environment-variables);
* [Environment variables for all services](./environment-variables#service-environment-variables).

Additionally, it installs some helper scripts:

* [`symfony-build`](#symfony-build);
* [`symfony-deploy`](#symfony-deploy);
* [`php-ext-install`](#php-ext-install).

## Tools

The **configurator** (`curl -fs https://get.symfony.com/cloud/configurator |
bash`) is a script specially crafted for Platform.sh. It ensures
that projects are always using the most up-to-date version of some tools:

* [croncape](./crons#using-croncape) for cron feedback;
* [Symfony CLI](https://symfony.com/download);
* [Composer](https://getcomposer.org/download/).

## Hooks

The **hooks** section defines the scripts that Platform.sh runs at specific
times of an application lifecycle, build, deploy and post-deploy:

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

Each hook is executed as a single script, so they will be considered failed only if the final command fails. Starts the script with `set -e` to make them fail on the first failed command.

{{< /note >}}

Follow this link to get more info on [Hooks](../../../create-apps/hooks/hooks-comparison).

To better understand the big picture and how those steps articulate with each
other, we invite you to read about building the application and deploying the
application in the [What is
Platform.sh?](https://symfony.com/doc/current/cloud/intro.html) article.

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

## symfony-build

**symfony-build** is the script that builds a Symfony application in an
optimized way for Platform.sh (it should be used as the main build script in
the `build` hook).

It does the following:

* Remove the development frontend file (Symfony <4);
* Install PHP extensions via the [`php-ext-install` script](#php-ext-install);
* Install the application dependencies using Composer;
* Optimize the autoloader;
* Build the Symfony cache in an optimized way to limit the time it takes to deploy;
* Install the JavaScript dependencies via NPM or Yarn;
* Build the production assets using Encore.

You can override the flags used by Composer by using the `$COMPOSER_FLAGS`
environment variable:

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        set -x -e

        curl -s https://get.symfony.com/cloud/configurator | bash

        COMPOSER_FLAGS="--ignore-platform-reqs" symfony-build
```

When installing the dependencies, the script automatically detects if the
application is using NPM or Yarn.

You can disable the Javascript dependencies and asset building by setting
`NO_NPM` or `NO_YARN` to `1` depending on the package manager you are using.

You can customize Node/NPM/Yarn behaviors by prefixing the `symfony-build`
script with the following environment variables:

* ``NODE_VERSION``: Pinpoint the Node version that NVM is going to install;
  default is ``--lts``;
* ``YARN_FLAGS``: Flags to pass to ``yarn install``; no value by default.

## symfony-deploy

**symfony-deploy** should be used as the main deploy script in the `deploy`
hook. It only works if you are using the `symfony-build` script in your `build`
hook.

It does the following:

* Replace the Symfony cache with the one generated during the build hook;
* Migrate the database (when the Doctrine migration bundle is used).

## php-ext-install

**php-ext-install** is a script that you can use to compile and install PHP
extensions not provided out of the box by Platform.sh or when you need a
specific version of an extension. It's written specifically for Platform.sh to
ensure fast and reliable setup during the build step. It currently supports
three ways to fetch the sources from:

* From [PECL](https://pecl.php.net/): ``php-ext-install redis 5.3.2``

* From a URL: ``php-ext-install redis https://github.com/phpredis/phpredis/archive/5.3.2.tar.gz``

* From a Git repository: ``php-ext-install redis https://github.com/phpredis/phpredis.git 5.3.2``

To ensure your application can be built properly, it's recommended to run
``php-ext-install`` after the configurator but before
[symfony-build](#symfony-build):

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        set -x -e

        curl -s https://get.symfony.com/cloud/configurator | bash

        php-ext-install redis 5.3.2

        symfony-build
```

When installing [PECL](https://pecl.php.net/) PHP extensions, you can configure
them directly as *variables* instead:

```yaml {location=".platform.app.yaml"}
variables:
    php-ext:
        redis: 5.3.2
```

{{< note >}}

The source code is cached between builds and compilation is skipped if it has
already been done. Changing the source of downloads or the version will
invalidate this cache.

{{< /note >}}

## Advanced Node Configuration

If you need to use the Node installation setup by
[symfony-build](#symfony-build), you can use the following snippet:

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
