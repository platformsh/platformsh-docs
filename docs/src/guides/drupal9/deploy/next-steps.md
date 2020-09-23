---
title: "Additional resources"
sidebarTitle: "Next steps"
weight: -70
toc: false
---

## Adding modules and themes

3rd party modules and themes can be installed and managed using Composer.  All packages on Drupal.org are registered with Drupal's own Packagist clone.  It should be included in the `composer.json` that comes with Drupal, but in case it isn't you can add the following block to the file:

```json
"repositories": [
    {
        "type": "composer",
        "url": "https://packages.drupal.org/8"
    }
]
```

(Drupal 8 and 9 share the same remote package repository.)

Once that's there, you can install any module or theme with the following command:

```bash
composer require drupal/devel
```

Replace `devel` with the name of the module or theme you're installing.  Do *not* commit the `web/modules/contrib` directory to Git.  The build process will re-download the correct version for you based on the `composer.json` and `composer.lock` files, which should be committed to Git.

## Custom modules and themes

Site-specific custom modules and themes can be written directly in the `web/modules/custom` and `web/themes/custom` directories.  They should be committed to Git as normal.

## Updating Drupal core and modules

Drupal is fully managed via Composer, which means so are updates to Drupal core itself.  Run `composer update` periodically to get new versions of both Drupal core and any modules or themes you have installed via Composer.  Commit the resulting changes to your `composer.lock` file and push again.

The [Composer documentation](https://getcomposer.org/doc/) has more information on options to update individual modules or perform other tasks.

Note that updating modules or core through the Drupal UI is not possible, as the file system is read-only.  All updates should be done through composer to update the lock file, and then pushed to Git.

{{< guide-buttons type="last" >}}
