---
title: Use build and deploy hooks
description: Add custom scripts at different stages in the build and deploy process.
layout: single
---

As your app goes through the [build and deploy process](/learn/overview/build-deploy.md),
you might want to run custom commands.
These might include compiling the app, setting the configuration for services based on variables, and rebuilding search indexes.
Do these tasks using one of [three hooks](./hooks-comparison.md).

The following example goes through each of these hooks for a multi-app project

- Next.js acts as the frontend container, `client`
- Drupal serves data as the backend container, `api`

Configuration for [both applications](../multi-app/_index.md) resides in a single [`{{< vendor/configfile "app" >}}` configuration file](../_index.md).
Be sure to notice the `source.root` property for each.
## Build dependencies

The Next.js app uses Yarn for dependencies, which need to be installed.
Installing dependencies requires writing to disk and doesn't need any relationships with other services.
This makes it perfect for a `build` hook.

In this case, the app has two sets of dependencies:

* For the main app
* For a script to test connections between the apps

Create your `build` hook to install them all:

1. Create a `build` hook in your [app configuration](/create-apps/app-reference/single-runtime-image.md):

   ```yaml {configFile="app"}
   applications:
     client:
       source:
         root: client
       hooks:
         build: |
           set -e
   ```

   The hook has two parts so far:

   * The `|` means the lines that follow can contain a series of commands.
     They aren't interpreted as new YAML properties.
   * Adding `set -e` means that the hook fails if _any_ of the commands in it fails.
     Without this setting, the hook fails only if its _final_ command fails.

     If a `build` hook fails for any reason, the build is aborted and the deploy doesn't happen.
     Note that this only works for `build` hooks.
     If other hooks fail, the deploy still happens.
2. Install your top-level dependencies inside this `build` hook:

   ```yaml {configFile="app"}
   applications:
     client:
       source:
         root: client
       hooks:
         build: |
           set -e
           yarn --frozen-lockfile
   ```

   This installs all the dependencies for the main app.

## Configure Drush and Drupal

The example uses [Drush](https://www.drush.org/latest/) to handle routine tasks.
For its configuration, Drush needs the URL of the site.
That means the configuration can't be done in the `build` hook.
During the `build` hook, the site isn't yet deployed and so there is no URL to use in the configuration.
(The [`PLATFORM_ROUTES` variable](../../development/variables/use-variables.md#use-provided-variables) isn't available.)

Add the configuration during the `deploy` hook.
This way you can access the URL before the site accepts requests (unlike in the `post_deploy` hook).

The script also prepares your environment to handle requests,
such as by [rebuilding the cache](https://www.drush.org/latest/commands/cache_rebuild/)
and [updating the database](https://www.drush.org/latest/commands/updatedb/).
Because these steps should be done before the site accepts request, they should be in the `deploy` hook.

All of this configuration and preparation can be handled in a bash script.

<!-- @todo: this context is not so simple to disentangle, so leaving for now -->
1. Copy the [preparation script from the Platform.sh template](https://github.com/platformsh-templates/nextjs-drupal/blob/master/api/platformsh-scripts/hooks.deploy.sh)
   into a file called `hooks.deploy.sh` in a `api/platformsh-scripts` directory.
   Note that hooks are executed using the dash shell, not the bash shell used by SSH logins.
2. Copy the [Drush configuration script from the template](https://github.com/platformsh-templates/nextjs-drupal/blob/master/api/drush/platformsh_generate_drush_yml.php)
   into a `drush/platformsh_generate_drush_yml.php` file.
3. Set a [mount](/create-apps/app-reference/single-runtime-image.md#mounts).
   Unlike in the `build` hook, in the `deploy` hook the system is generally read-only.
   So create a mount where you can write the Drush configuration:

   ```yaml {configFile="app"}
   applications:
     api:
       source:
         root: api

       mounts:
         /.drush:
           source: storage
           source_path: 'drush'
   ```

4. Add a `deploy` hook that runs the preparation script:

   ```yaml {configFile="app"}
   applications:
     api:
       source:
         root: api

       mounts:
         /.drush:
           source: storage
           source_path: 'drush'

       hooks:
         deploy: !include
           type: string
           path: platformsh-scripts/hooks.deploy.sh
   ```

   This `!include` syntax tells the hook to process the script as if it were included in the YAML file directly.
   This helps with longer and more complicated scripts.

## Get data from Drupal to Next.js

This Next.js app generates a static site.
Often, you would generate the site for Next.js in a `build` hook.
In this case, you first need to get data from Drupal to Next.js.

This means you need to wait until Drupal is accepting requests
and there is a relationship between the two apps.
So the `post_deploy` hook is the perfect place to build your Next.js site.

You can also redeploy the site every time content changes in Drupal.
On redeploys, only the `post_deploy` hook runs,
meaning the Drupal build is reused and Next.js is built again.
So you don't have to rebuild Drupal but you still get fresh content.

1. Set a relationship for Next.js with Drupal.
   This allows the Next.js app to make requests and receive data from the Drupal app.

   ```yaml {configFile="app"}
   applications:
     client:
       source:
         root: client

       relationships:
         api:
           service: 'api'
           endpoint: 'http'
   ```

2. Set [mounts](/create-apps/app-reference/single-runtime-image.md#mounts).
   Like the [`deploy` hook](#configure-drush-and-drupal), the `post_deploy` hook has a read-only file system.
   Create mounts for your Next.js files:

   ```yaml {configFile="app"}
   applications:
     client:
       source:
         root: client

       mounts:
         /.cache:
           source: tmp
           source_path: 'cache'
         /.next:
           source: storage
           source_path: 'next'
         /.pm2:
           source: storage
           source_path: 'pm2'
         deploy:
           source: storage
           service: files
           source_path: deploy
   ```

3. Add a `post_deploy` hook that first tests the connection between the apps:

   ```yaml {configFile="app"}
   applications:
     client:
       source:
         root: client
       hooks:
         post_deploy: |
           . deploy/platformsh.environment
           cd platformsh-scripts/test && yarn debug
   ```

   Note that you could add `set -e` here, but even if the job fails, the build/deployment itself can still be counted as successful.

4. Then build the Next.js site:

   ```yaml {configFile="app"}
   applications:
     client:
       source:
         root: client
       hooks:
         post_deploy: |
           . deploy/platformsh.environment
           cd platformsh-scripts/test && yarn debug
           cd $PLATFORM_APP_DIR && yarn build
   ```

   The `$PLATFORM_APP_DIR` variable represents the app root and can always get you back there.

## Final hooks

```yaml {configFile="app"}
applications:
  api:
    # The runtime the app uses.
    type: 'php:{{% latest "php" %}}'

    dependencies:
      php:
        composer/composer: '^2'

    # The relationships of the app with services or other apps.
    relationships:
      database:
        service: 'db'
        endpoint: 'mysql'
      redis:
        service: 'cache'
        endpoint: 'redis'

    # The hooks executed at various points in the lifecycle of the app.
    hooks:
      deploy: !include
      type: string
      path: platformsh-scripts/hooks.deploy.sh

    # The 'mounts' describe writable, persistent filesystem mounts in the app.
    mounts:
      /.drush:
        source: storage
        source_path: 'drush'
      /drush-backups:
        source: storage
        source_path: 'drush-backups'
      deploy:
        source: service
        service: files
        source_path: deploy
  client:
    # The type key specifies the language and version for your app.
    type: 'nodejs:{{% latest "nodejs" %}}'

    dependencies:
      nodejs:
        yarn: "1.22.17"
        pm2: "5.2.0"

    build:
      flavor: none

    relationships:
      api:
        service: 'api'
        endpoint: 'http'

    # The hooks that are triggered when the package is deployed.
    hooks:
      build: |
        set -e
        yarn --frozen-lockfile # Install dependencies for the main app
        cd platformsh-scripts/test
        yarn --frozen-lockfile # Install dependencies for the testing script
      # Next.js's build is delayed to the post_deploy hook, when Drupal is available for requests.
      post_deploy: |
        . deploy/platformsh.environment
        cd platformsh-scripts/test && yarn debug
        cd $PLATFORM_APP_DIR && yarn build

    mounts:
        /.cache:
            source: tmp
            source_path: 'cache'
        /.next:
            source: storage
            source_path: 'next'
        /.pm2:
            source: storage
            source_path: 'pm2'
        deploy:
            source: storage
            service: files
            source_path: deploy
```
