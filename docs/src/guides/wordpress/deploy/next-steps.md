---
title: "Additional resources"
sidebarTitle: "Next steps"
weight: -70
toc: false
description: |
    Upgrading, adding modules, and further development of your site.
---

## Adding plugins and themes without Composer

As previously mentioned, Composer is strongly recommended, but it is possible to use some non-Composer plugins and themes in your site, provided that they do not require write access at runtime. In your build hook, include:

```yaml
hooks:
    build: |
        rsync -a plugins/* wordpress/wp-content/plugins/
```

Here, you can commit plugins to the repository in a `plugins` subdirectory, which will then be placed into the WordPress installation during the build. 

## Adding public plugins and themes via Composer

Adding a plugin or theme from WPPackagist is the same as downloading a package through Composer:

```bash
# Plugin
$ composer require wpackagist-plugin/cache-control
# Theme
$ composer require wpackagist-theme/neve
```

This will update your `composer.json` and `composer.lock` files, and once you push the change to Platform.sh the package will be downloaded during WordPress's build. All that is left is to sign in to the administration dashboard on your deployed site and enable plugins and themes from the Plugins and Appearance settings, respectively. 

## Adding private plugins and themes via Composer

If your plugins are not accessible from WPPackagist or packagist, but are still valid packages, you can use them in your project by defining local `repositories` for them in your `composer.json` file. 

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

In the snippet above, other packages can still be downloaded from WPPackagist, but now two custom `path` repositories have been defined from `/custom/[themes|plugins]` locally. Adding packages from these sources then only require `composer require author/custom_plugin` to ensure that the plugin at `/custom/plugin/author/custom_plugin` is installed by Platform.sh when WordPress is built. 

## Updating WordPress, plugins, and themes

Your WordPress site is fully managed by Composer, which means so are updates to WordPress core itself. Run `composer update` periodically to get new versions of WordPress core, as well as any plugins or themes your have installed. Commit the resulting changes to your `composer.lock` file and push again to Platform.sh 

The [Composer documentation](https://getcomposer.org/doc/) has more information on options to update individual modules or perform other tasks.

Note that updating modules or core through the WordPress UI is not possible, as the file system is read-only.  All updates should be done through Composer to update the lock file, and then push to Git.

{{< guide-buttons type="last" >}}