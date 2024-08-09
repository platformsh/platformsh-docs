---
title: "Additional resources"
sidebarTitle: "Next steps"
weight: -70
description: |
    Upgrading, adding modules, and further development of your site.
---

## Adding plugins and themes without Composer

As previously mentioned, Composer is strongly recommended,
but it's possible to use some non-Composer plugins and themes in your site,
provided that they don't require write access at runtime.
In your build hook, include:

```yaml {configFile="app"}
hooks:
  build: |
    rsync -a plugins/* wordpress/wp-content/plugins/
```

Here, you can commit plugins to the repository in a `plugins` subdirectory,
which are placed into the WordPress installation during the build.
It's assumed that these packages stick to best practices and don't write to the file system at runtime and when enabling them.
You can get around this issue by defining a [mount](/create-apps/app-reference/single-runtime-image.md#mounts) where a plugin requires write access,
but you need to remember that the contents at that mount location are wiped when deployment begins,
so you need to copy and re-copy accordingly.

## Adding public plugins and themes via Composer

Adding a plugin or theme from WPPackagist is the same as downloading a package through Composer:

```bash
# Plugin
$ composer require wpackagist-plugin/cache-control
# Theme
$ composer require wpackagist-theme/neve
```

This updates your `composer.json` and `composer.lock` files.
Once you push the change to {{% vendor/name %}}, the package is downloaded during the WordPress build.
All that's left is to sign in to the administration dashboard on your deployed site
and enable plugins and themes from the Plugins and Appearance settings, respectively.

## Set up a WooCommerce site

{{% vendor/name %}} maintains a [WooCommerce template](https://github.com/platformsh-templates/wordpress-woocommerce)
that you can deploy quickly from the button in its README,
but using Composer you can quickly install WooCommerce yourself:

```bash
composer require woocommerce/woocommerce
```

Push those changes on a new environment and configure your store through the administration panel.

## Adding private plugins and themes via Composer

If your plugins aren't accessible from WPPackagist or Packagist, but are still valid packages,
you can use them in your project by defining local `repositories` for them in your `composer.json` file.

```json
"repositories":[
    {
       "type":"composer",
       "url":"https://wpackagist.org"
    },
    {
      "type": "path",
      "url": "custom/themes/*",
      "options": {
        "symlink": false
        }
    },
    {
      "type": "path",
      "url": "custom/plugins/*",
      "options": {
        "symlink": false
        }
    }
]
```

In the snippet above, other packages can still be downloaded from WPPackagist,
but now two custom `path` repositories have been defined from `/custom/[themes|plugins]` locally.
Adding packages from these sources then only requires `composer require author/custom_plugin`
to ensure that the plugin at `/custom/plugin/author/custom_plugin` is installed by {{% vendor/name %}} when WordPress is built.

## Updating WordPress, plugins, and themes

Your WordPress site is fully managed by Composer,
which means so are updates to WordPress core itself.
Run `composer update` periodically to get new versions of WordPress core, as well as any plugins or themes your have installed.
Commit the resulting changes to your `composer.lock` file and push again to {{% vendor/name %}}.

The [Composer documentation](https://getcomposer.org/doc/) has more information on options to update individual modules or perform other tasks.

Note that updating modules or core through the WordPress UI isn't possible, as the file system is read-only.
All updates should be done through Composer to update the lock file, and then push to Git.

## Local development with Lando

{{% guides/lando repo="wordpress-composer" %}}

{{< guide-buttons type="last" >}}
