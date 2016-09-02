# Getting Started

## Drupal 8 and Composer

The recommended way to deploy Drupal 8 on Platform.sh is to use Composer. [Composer](https://getcomposer.org/) is the PHP package management suite, and is now supported by Drupal 8 (and Drupal 7 in a pinch). There is an unofficial but well-supported Composer flavor of Drupal 8 called [Drupal Composer](https://github.com/drupal-composer/drupal-project) that we recommend.  If you use the [Drupal 8 Example Repository](https://github.com/platformsh/platformsh-example-drupal8/) or select the Drupal 8 option when creating a new project from a template, that's what you will be using.

You can also create your own project directly from that repository and add the Platform.sh-specific configuration files.  Note that you will also need to add the Drupal.org Composer repositories to `composer.json` if you are not working from our template.

If you use Drupal Composer, note that any 3rd party modules, themes, or PHP libraries you install, as well as Drupal core itself, will not be checked into your repository.  They are specifically excluded from Git by a `.gitignore` file, as they will be re-downloaded when you run `composer install` or `composer update`.  Rather than downloading modules or themes using wget or FTP, you can add them using composer.  For example, to add the `devel` module you would run this command:

```
$ composer require drupal/devel
```

And then commit just the changes to `composer.json` and `composer.lock` to your repository.  That also means that to get a working copy of your site locally you will need to run `composer install` to download all of the necessary libraries and modules.

> **note**
> When using Composer, your docroot where most of Drupal lives will be called `web`, but the `vendor` directory will be outside of that directory in contrast to how a standard Drupal download .tar.gz file is organized.  The config export directory will also be outside of the web root.  This is normal, expected, and more secure.

### File organization

Your repository should be laid out as follows:

```
composer.json
composer.lock
config/
  sync/
    <this is where exported configuration will go> 
drush/
.git/
.gitignore
.platform/
  routes.yaml
  services.yaml
.platform.app.yaml
scripts/
web
  index.php
  ... (other Drupal core files)
  modules/
    contrib/
      <empty until composer runs>
    custom/
      <your custom modules here>
  themes/
    contrib/
      <empty until composer runs>
    custom/
      <your custom themes here>
  sites/
    default/
      settings.php
      settings.platformsh.php
```

### Changes to settings.php

Platform.sh exposes database configuration, as well as other configuration values such as a hash salt, to PHP as environment variables available either via `$_ENV` or `getenv()`.  That means you'll need to tell Drupal how to get that information.  Additionally, Drupal needs to be told where the config export directory is, where the private files directory is (which is outside of the web root), and so on.

The easiest way to access that information is via a small configuration add-on we provide.  See our recommended [settings.php file](https://github.com/platformsh/platformsh-example-drupal8/blob/master/web/sites/default/settings.php), which includes a file called [settings.platformsh.php](https://github.com/platformsh/platformsh-example-drupal8/blob/master/web/sites/default/settings.platformsh.php).  The latter maps all Platform.sh-provided environment values to Drupal settings, either the Drupal database array or the global `$settings` object.  If run on a non-Platform.sh server this file does nothing so it is safe to always include.

If you need to add additional Platform.sh-specific configuration, such as to enable a [Redis server](/frameworks/drupal8/redis.md) for caching, we recommend also putting it into `settings.platformsh.php`.


## Vanilla Drupal 8

If you prefer, Drupal 8 can also be installed "vanilla" from Drupal.org, with the entire site checked into the repository. While not recommended it is fully supported.  At the end of the day Platform.sh doesn't care where your files come from, just that you tell the system where they are!

You will still need to put the Drupal docroot in a subdirectory of your repository.  We recommend `web` for consistency but any directory name will do.

If using a vanilla Drupal install, your repository should look something like this:

```
.git/
.gitignore
config/
  sync/
.platform/
  routes.yaml
  services.yaml
.platform.app.yaml
web/
  index.php
  ... (other Drupal core files)
  core/
  modules/
  sites/
  sites/
    default/
      settings.php
      settings.platformsh.php
```

Note the `settings.php` and `settings.patformsh.php` files.  Both should be identical to the ones used for a Composer-based site.  Also note that the `config/sync` directory is still outside the docroot.  That is recommended for all Drupal installs generally, and is configured by the `settings.php` file.
