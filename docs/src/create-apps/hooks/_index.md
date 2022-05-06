---
title: Use build and deploy hooks
description: Add custom scripts at different stages in the build and deploy process.
layout: single
---

As your application goes through the [build and deploy process](../../overview/build-deploy.md),
you might want to run custom commands.
These might include compiling the app, setting the configuration for services based on variables, and rebuilding search indexes.
Do these tasks using one of [three hooks](./hooks-comparison.md).

The following example goes through each of these scenarios for the [Gatsby Drupal template](https://github.com/platformsh-templates/gatsby-drupal).
This template uses [Drupal](https://www.drupal.org/) as the headless CMS backend
and [Gatsby](https://www.gatsbyjs.com/) for the frontend.
To get the code ready, you need to run a few commands.
The example commands are somewhat simplified, but you can find them all in the [GitHub repository](https://github.com/platformsh-templates/gatsby-drupal).

In this case, you have [two applications](../multi-app.md) and so two [`.platform.app.yaml` configuration files](../_index.md).
Each file is in the folder for that application.
You run two hooks in the file for Drupal and one hook in the file for Gatsby.

## Compile extension

For this template to work, it needs a [PHP extension for Redis](https://github.com/phpredis/phpredis).
This includes getting the up-to-date code for the extension and then compiling it.

This action needs to write to disk and doesn't need any relationships with other services.
This makes it perfect for a `build` hook.

The exact details of the extension aren't so important to the hook,
so create a bash script file to handle it for you.

1. Copy the [script from the template](https://github.com/platformsh-templates/gatsby-drupal/blob/master/drupal/install-redis.sh)
   into a file called `install-redis.sh`.
   Note that hooks are executed using the dash shell, not the bash shell used by SSH logins.
1. Create a `build` hook in your [app configuration](../app-reference.md):

   ```yaml {location="drupal/.platform.app.yaml"}
   hooks:
       build: |
           set -e
   ```

   There are two parts to the hook so far:

     * The `|` means the lines that follow can contain a series of commands.
       They aren't interpreted as new YAML properties.
     * Adding `set -e` means that the hook fails if _any_ of the commands in it fails.
       Without this setting, the hook fails only if its _final_ command fails.

       If a `build` hook fails for any reason, the build is aborted and the deploy doesn't happen.
       Note that this only works for `build` hooks.
       If other hooks fail, the deploy still happens.
1. Call your script from the `build` hook:

   ```yaml {location="drupal/.platform.app.yaml"}
   hooks:
       build: |
           set -e
           bash install-redis.sh 4.3.0
   ```

   This call includes the version of the Redis extension to compile.

Now the extension is compiled every time the Drupal app is built.

## Configure Drush

The template uses [Drush](https://www.drush.org/latest/) to handle routine tasks.
For its configuration, Drush needs the URL of the site.
That means the configuration can't be done in the `build` hook.
During the `build` hook, the site isn't yet deployed and so there is no URL to use in the configuration.
(The [`PLATFORM_ROUTES` variable](../../development/variables/use-variables.md#use-platformsh-provided-variables) isn't available.)

Add the configuration during the `deploy` hook.
This way you can access the URL before the site accepts requests (unlike in the `post_deploy` hook).

1. Set a [mount](../app-reference.md#mounts).
   Unlike in the `build` hook, in the `deploy` hook the system is generally read-only.
   So create a mount where you can write the Drush configuration:

   ```yaml {location="drupal/.platform.app.yaml"}
   mounts:
        '/.drush':
            source: local
            source_path: 'drush'
   ```

1. Add a `deploy` hook that writes the Drush configuration:

   ```yaml {location="drupal/.platform.app.yaml"}
   hooks:
       deploy: |
           set -e
           php ./drush/platformsh_generate_drush_yml.php
   ```

   The creation of the configuration is handled by a [PHP script](https://github.com/platformsh-templates/gatsby-drupal/blob/master/drupal/drush/platformsh_generate_drush_yml.php).

## Prepare site for requests

Now that you have Drush configured, use it to get your site ready to handle requests.
Because these steps should be done before the site accepts request, they should be in the `deploy` hook.

1. Move to the right directory.
   Each hook starts in the [app root](../app-reference.md#root-directory).
   To run commands from a different directory, such as the document root for your site,
   you need to change directories:

   ```yaml {location="drupal/.platform.app.yaml"}
   hooks:
       deploy: |
           set -e
           php ./drush/platformsh_generate_drush_yml.php
           cd web
   ```

2. Rebuild the cache and update the database.
   To ensure your new deployment uses only the latest data,
   run the Drush commands to [rebuild the cache](https://www.drush.org/latest/commands/cache_rebuild/)
   and [update the database](https://www.drush.org/latest/commands/updatedb/):

   ```yaml {location="drupal/.platform.app.yaml"}
   hooks:
       deploy: |
           set -e
           php ./drush/platformsh_generate_drush_yml.php
           cd web
           drush -y cache-rebuild
           drush -y updatedb
   ```

## Get data from Drupal to Gatsby

Gatsby is a static site generator.
Ordinarily, you would generate the files in a `build` hook.
In this case, you first need to get data from Drupal to Gatsby.

This means you need to wait until Drupal is accepting requests.
So the `post_deploy` hook is the perfect place to build your Gatsby site.

You can also redeploy the site every time content changes in Drupal.
On redeploys, only the `post_deploy` hook runs,
meaning the Drupal build is reused and Gatsby is built again.
So you don't have to rebuild Drupal but you still get fresh content.

1. Set a relationship with Drupal.

   ```yaml {location="gatsby/.platform.app.yaml"}
   relationships:
       drupal: 'drupal:http'
   ```

1. Set [mounts](../app-reference.md#mounts).
   Like the [`deploy` hook](#configure-drush), the `post_deploy` hook has a read-only file system.
   Create mounts for your Gatsby files:

   ```yaml {location="gatsby/.platform.app.yaml"}
   mounts:
       '/.cache':
           source: local
           source_path: cache
       '/.config':
           source: local
           source_path: config
       'public':
           source: local
           source_path: public
   ```

1. Add a `post_deploy` hook that builds the Gatsby site:

   ```yaml {location="gatsby/.platform.app.yaml"}
   hooks:
       post_deploy: npm run build
   ```

## Final hooks

You can find the complete [Drupal configuration](https://github.com/platformsh-templates/gatsby-drupal/blob/master/drupal/.platform.app.yaml)
and [Gatsby configuration](https://github.com/platformsh-templates/gatsby-drupal/blob/master/gatsby/.platform.app.yaml)
on GitHub.
The following shows only the parts necessary for the hooks.

### Drupal

```yaml {location="druupal/.platform.app.yaml"}
# The name of this app. Must be unique within the project.
name: 'drupal'

# The runtime the application uses.
type: 'php:7.4'

dependencies:
    php:
        composer/composer: '^2'

# The relationships of the application with services or other applications.
relationships:
    database: 'db:mysql'
    redis: 'cache:redis'

# The hooks executed at various points in the lifecycle of the application.
hooks:
    # The build hook runs after Composer to finish preparing your code.
    build: |
        set -e
        bash install-redis.sh 4.3.0
    # The deploy hook runs after your application has been deployed and started,
    # but before it starts accepting requests
    deploy: |
        set -e
        php ./drush/platformsh_generate_drush_yml.php
        cd web
        drush -y cache-rebuild
        drush -y updatedb
        drush -y config-import

# The size of the persistent disk of the application (in MB).
disk: 2048

# The 'mounts' describe writable, persistent filesystem mounts in the application.
mounts:
    '/.drush':
        source: local
        source_path: 'drush'
```

### Gatsby

```yaml {location="gatsby/.platform.app.yaml"}
# The name of this application, which must be unique within the project.
name: 'gatsby'

# The type key specifies the language and version for your application.
type: 'nodejs:14'

relationships:
    drupal: 'drupal:http'

# The hooks that will be triggered when the package is deployed.
hooks:
    # Gatsby's build is delayed to the post_deploy hook, when Drupal is available for requests.
    post_deploy: npm run build

# The size of the persistent disk of the application (in MB).
disk: 1024

mounts:
    '/.cache':
        source: local
        source_path: cache
    '/.config':
        source: local
        source_path: config
    'public':
        source: local
        source_path: public
```
