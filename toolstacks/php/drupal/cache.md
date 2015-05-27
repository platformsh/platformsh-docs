Adding Entity Cache and Authcache
=================================

You can further improve the perfomance of your site by adding the
[Entity Cache](https://www.drupal.org/project/entitycache) and
[Authcache](https://www.drupal.org/project/authcache) modules to your
project.

Requirements
------------

If you are using a make file, you can add those lines to your
`project.make`:

``` {.sourceCode .ini}
projects[entitycache][version] = 1.2
projects[authcache][version] = 2.0-beta3
```

If your project uses Drupal Commerce, you can also add the [Commerce
Entity Cache](https://www.drupal.org/project/commerce_entitycache) and
[Commerce Authcache](https://www.drupal.org/project/commerce_authcache)
modules:

``` {.sourceCode .ini}
projects[commerce_entitycache][version] = 1.1
projects[commerce_authcache][version] = 1.x-dev
```

> -   drush\_make\_files

Configuration
-------------

### Variables

The advantage to using environment variables is that these won't be used
on your local build using Platform CLI where you might not have Redis
installed.

Add the following environment variables on Platform UI.

`drupal:cache_backends`

Add the cache backends for Authcache

```bash
[
   "sites/all/modules/redis/redis.autoload.inc",
   "sites/all/modules/authcache/authcache.cache.inc",
   "sites/all/modules/authcache/modules/authcache_builtin/authcache_builtin.cache.inc"
]
```

### settings.php

If you prefer to commit these variables to your `settings.php`, here are
the lines to add:

``` {.sourceCode .php}
$conf['cache_backends'][] = 'sites/all/modules/authcache/authcache.cache.inc';
$conf['cache_backends'][] = 'sites/all/modules/authcache/modules/authcache_builtin/authcache_builtin.cache.inc';
```
