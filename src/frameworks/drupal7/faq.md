# Drupal Frequently Asked Questions (FAQ)

## How should I name my make files?

In order for Platform to automatically detect your make file, you need
to call it **project.make**.

You can also have a **specific make file for Drupal core** called
**project-core.make**

## When I push changes to a make file, does Platform.sh run the update?

After a push, Platform.sh will rebuild your environment and download all
the modules that are in your make file.

If an update function (hook_update) needs to run, you'll have to
manually trigger it by going to `/update.php` or use the
deployment hooks to automatically run the updates.

## How can I override the default robots.txt?

If your project is using a make file, you will end up with the default
`robots.txt` provided by Drupal.

On your Development environments, Platform.sh automatically overrides
your `robots.txt` file with:

```bash
User-agent: *
Disallow: /
```

You can customize the `robots.txt` by placing your own version at the
root of your repository.

To override the behavior of robots.txt for Development environments you would
currently need to use the API, contact our support for details.

## I'm getting a PDO Exception 'MySQL server has gone away'

Normally, this means there is a problem with the MySQL server container
and you may need to increase the storage available to MySQL to resolve
the issue. Ballooning MySQL storage can be caused by a number of items:

1)  A large number of watchdog entries being captured. Fix the errors
    being generated or disable database logging.
2)  Cron should run at regular intervals to ensure cache
    tables get cleared out.
3)  If you're using Drupal Commerce Core < 1.10, you may have an
    [extremely large cache_form
    table](https://www.drupal.org/node/2057073). Upgrade to Commerce
    Core 1.10 to resolve.

## Why do I get "MySQL cannot connect to the database server"?

If you are having a problem connecting to the database server, you will
need force a re-deployment of the database container. To do so, you can
edit the service definition to add or remove a small amount of storage and
then push.

## Can I use the name of the session cookie for caching?

For Drupal sites, the name of the session cookie is based on a hash of the
domain name. This means that it will actually be consistent for a specific
website and can safely be used as a fixed value.

# How can I rebuild the site registry?

During the migration process, one or more modules may have changed
location. This could result in a WSOD (white screen of death), any
number of errors (fatal or otherwise), or just a plain broken site. To
remedy this situation, the [registry will need to be
rebuilt](https://www.drupal.org/project/registry_rebuild). To rebuild
the Drupal registry on your Platform.sh instance, you will need to do
the following:

First, SSH into your web container.

```bash
$ ssh [SSH-URL]
```

Second, execute the following commands to download, tweak, and run the
registry rebuild.

```bash
$ drush dl registry_rebuild-7.x-2.3 --destination=/app/tmp
$ sed -i 's/, define_drupal_root()/, '"'"'\/app\/public'"'"'/' /app/tmp/registry_rebuild/registry_rebuild.php
$ cd /app/public
$ php ../tmp/registry_rebuild/registry_rebuild.php
```
