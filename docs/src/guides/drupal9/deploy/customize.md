---
title: "Customize Drupal 9 for Platform.sh"
sidebarTitle: "Customize"
weight: -90
toc: false
---

Now that Platform.sh is ready for your Drupal site, it's time to make your Drupal site ready for Platform.sh.  There are a number of additional steps that are either required or recommended, depending on how well you want to optimize your site.

## Install the Config Reader

{{< guides/config-reader-php >}}

## `settings.php`

`settings.php` is the main Drupal environment-configuration file.  In a stock Drupal installation it contains the database credentials, various other settings, and an enormouns amount of comments.

In the Drupal 9 template, the [`settings.php`](https://github.com/platformsh-templates/drupal9/blob/master/web/sites/default/settings.php) file is mostly replaced with a stub that contains only the most basic configuration and then includes a `settings.platformsh.php` and `settings.local.php` file, if they exist.  The latter is a common Drupal pattern, and the `settings.local.php` file should never be committed to Git.  It contains configuration that is specific to your local development environment, such as a local dev database.

The `settings.platformsh.php` file contains glue code that configures Drupal based on the information available in Platform.sh's environment variables.  That includes the database credentials as well as Redis caching, file system paths, etc.

The file itself is a bit long, but reasonably self-explanatory.

{{< github repo="platformsh-templates/drupal9" file="web/sites/default/settings.platformsh.php" lang="php" >}}

**Include settings.platformsh.php here**

If you add additional services to your application, such as Solr, Elasticsearch, or RabbitMQ, you would add configuration for those services to the `settings.platformsh.php` file as well.

## `.environment`

Platform.sh runs `source .environment` in the application root when a project starts, and when logging into the environment over SSH.  That gives you a place to do extra environment variable setup prior to the application running, including modifying the system `$PATH` and other shell level customizations.

For Drupal, a small [`.environment`](https://github.com/platformsh-templates/drupal9/blob/master/.environment) file modifies the `$PATH` to include the `vendor/bin` directory, where command line tools like Drush or Drupal Console are stored.  While this step is optional, the Drupal cron task assumes it has run so that the `drush` command is always available.

{{< github repo="platformsh-templates/drupal9" file=".environment" lang="bash" >}}

## Drush configuration

Drush requires a YAML file that declares what its URL is.  That value will vary depending on the branch you're on, so cannot be included in a static file.  Instead, the `drush` directory includes a [short script](https://github.com/platformsh-templates/drupal9/blob/master/drush/platformsh_generate_drush_yml.php) that generate that file on each deploy, writing it to `.drush/drush.yml`.  That allows drush to run successfully on Platform.sh, such as to run cron tasks.

The script contents are not especially interesting.  For the most part, you can download it from the template, place it in a `drush` directory in your project so they can be called from the deploy hook, and then forget about it.

{{< guide-buttons next="Deploy Drupal 9" >}}
