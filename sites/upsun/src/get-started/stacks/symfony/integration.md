---
title: "Symfony integration"
weight: -130
description: |
    Learn how to use the Symfony integration for a better {{% vendor/name %}} experience.
---

Symfony has a special integration with {{% vendor/name %}} that makes it easier to use {{% vendor/name %}} for Symfony projects.

**When using the Symfony integration, you are contributing financially to the Symfony project.**

The Symfony integration is automatically enabled when:

- You run the `symfony new` command with the `--{{% vendor/cli %}}` option

- You run `symfony project:init --{{% vendor/cli %}}` on an existing project to automatically
  generate the {{% vendor/name %}} configuration

If you already have a {{% vendor/name %}} configuration without the Symfony
integration, enable it by adding the following configuration:

```yaml {configFile="app"}
applications:
  app:
    hooks:
      build: |
        set -x -e

        curl -fs https://get.symfony.com/cloud/configurator | bash

        # ...
```

The **configurator** enables the following integration:

- It installs some helper scripts that you can use as the [default build and deploy hook scripts](#hooks):
    - [`symfony-build`](#symfony-build)
    - [`symfony-deploy`](#symfony-deploy)
    - [`php-ext-install`](#php-ext-install)

- It adds some [extra tools](#tools)

- It defines [additional infrastructure environment
variables](./environment-variables#symfony-environment-variables) and
[environment variables for all
services](./environment-variables#service-environment-variables)

## Tools

The **configurator** (`curl -fs https://get.symfony.com/cloud/configurator | bash`) is a script specially crafted for {{% vendor/name %}}.
It ensures that projects are always using the latest version of the following tools:

- [croncape](./crons#use-croncape) for cron feedback
- [Symfony CLI](https://symfony.com/download)
- [Composer](https://getcomposer.org/download/)

## Hooks

The `hooks` section defines the scripts that {{% vendor/name %}} runs at specific times of an application lifecycle:

- The [build hook](/create-apps/hooks/hooks-comparison.md#build-hook) is run during the build process
- The [deploy hook](/create-apps/hooks/hooks-comparison.md#deploy-hook) is run during the deployment process
- The [post-deploy hook](/create-apps/hooks/hooks-comparison.md#post-deploy-hook) is run after the deploy hook,
  once the application container starts accepting connections

Here's the default `hooks` section optimized for Symfony projects:

```yaml {configFile="app"}
applications:
  app:
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

As each hook is executed as a single script, a hook is considered as failed only if the final command fails.
To have your hooks fail on the first failed command, start your scripts with `set -e`.

{{< /note >}}

For more information, see [Hooks](/create-apps/hooks/hooks-comparison).

To gain a better understanding of how hooks relate to each other when building and deploying an app,
see the [{{% vendor/name %}} philosophy](/learn/overview/philosophy.md).

{{< note title="Tip">}}

During the `deploy` or `post_deploy` hooks, you can execute actions for a specific environment type only.
To do so, in your `{{< vendor/configfile "app" >}}`file,
use the `PLATFORM_ENVIRONMENT_TYPE` [environment variable](/development/variables/_index.md)) in a condition:

```yaml {configFile="app"}
applications:
  myapp:
    hooks:
      deploy: |
        if [ "PLATFORM_ENVIRONMENT_TYPE" != "production" ]; then
          symfony console app:dev:anonymize
        fi
```

{{< /note >}}

### symfony-build

**symfony-build** is the script that builds a Symfony app in an optimized way for {{% vendor/name %}}.
Use it as the main build script in your `build` hook.

**symfony-build** performs the following actions:

- Removes the development frontend file (Symfony <4)
- Installs PHP extensions through the [`php-ext-install` script](#php-ext-install)
- Installs application dependencies using Composer
- Optimizes the autoloader
- Builds the Symfony cache in an optimized way to limit the time it takes to deploy
- Installs the JavaScript dependencies via npm or Yarn
- Builds the production assets using Encore

To override the flags used by Composer, use the `$COMPOSER_FLAGS` environment variable:

```yaml {configFile="app"}
applications:
  myapp:
    hooks:
      build: |
        set -x -e

        curl -s https://get.symfony.com/cloud/configurator | bash

        COMPOSER_FLAGS="--ignore-platform-reqs" symfony-build
```

When installing dependencies, the script automatically detects if the app is using npm or Yarn.

To disable the JavaScript dependencies and asset building,
set `NO_NPM` or `NO_YARN` to `1` depending on your package manager.

To customize Node/npm/Yarn behaviors,
prefix the `symfony-build` script with the following environment variables:

- `NODE_VERSION`:  to pinpoint the Node version that nvm is going to install.
  The default value is `--lts`.
- `YARN_FLAGS`: flags to pass to `yarn install`.
  There is no default value.

### symfony-deploy

Use **symfony-deploy** as the main deploy script in the `deploy` hook.
It only works if you're using the [`symfony-build` script](#symfony-build) in your `build` hook.

**symfony-deploy** performs the following actions:

- Replaces the Symfony cache with the cache generated during the build hook
- Migrates the database when the Doctrine migration bundle is used

### php-ext-install

You can use the **php-ext-install** script to compile and install PHP extensions
not provided out of the box by {{% vendor/name %}},
or when you need a specific version of an extension.
The script is written specifically for {{% vendor/name %}} to ensure fast and reliable setup during the build step.

**php-ext-install** currently supports three ways of fetching sources:

- From [PECL](https://pecl.php.net/): `php-ext-install redis 5.3.2`
- From a URL: `php-ext-install redis https://github.com/phpredis/phpredis/archive/5.3.2.tar.gz`
- From a Git repository: `php-ext-install redis https://github.com/phpredis/phpredis.git 5.3.2`

To ensure your app can be built properly, run `php-ext-install` after the [configurator](#tools)
but before [symfony-build](#symfony-build):

```yaml {configFile="app"}
applications:
  myapp:
    hooks:
      build: |
        set -x -e

        curl -s https://get.symfony.com/cloud/configurator | bash

        php-ext-install redis 5.3.2

        symfony-build
```

When installing [PECL](https://pecl.php.net/) PHP extensions, you can configure
them directly as *variables* instead:

```yaml {configFile="app"}
applications:
  myapp:
    variables:
      php-ext:
        redis: 5.3.2
```

{{< note >}}

The source code is cached between builds so compilation is skipped if it's already been done.
Changing the source of downloads or the version invalidates this cache.

{{< /note >}}

### Advanced Node configuration

If you need to use the Node installation setup by [symfony-build](#symfony-build),
use the following configuration:

```yaml {configFile="app"}
applications:
  myapp:
    hooks:
      build: |
        set -x -e

        curl -s https://get.symfony.com/cloud/configurator | bash

        symfony-build

        # Setup everything to use the Node installation
        unset NPM_CONFIG_PREFIX
        export NVM_DIR=${SPLATFORM_APP_DIR}/.nvm
        set +x && . "${NVM_DIR}/nvm.sh" use --lts && set -x
        # Starting from here, everything is setup to use the same Node
        yarn encore dev
```

If you want to use two different Node versions,
use the following configuration instead:

```yaml {configFile="app"}
applications:
  myapp:
    hooks:
      build: |
        set -x -e

        curl -s https://get.symfony.com/cloud/configurator | bash

        symfony-build

        cd web/js_app
        unset NPM_CONFIG_PREFIX
        export NVM_DIR=${PLATFORM_APP_DIR}/.nvm

        NODE_VERSION=8 yarn-install

        # Setup everything to use the Node installation
        set +x && . "${NVM_DIR}/nvm.sh" use 8 && set -x

        # Starting from here, everything is setup to use Node 8
        yarn build --environment=prod
```

{{< guide-buttons previous="Back" next="Configure environment variables" nextLink="/get-started/stacks/symfony/environment-variables.md" type="*" >}}
