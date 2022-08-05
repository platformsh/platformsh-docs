---
title: "Drupal Frequently Asked Questions (FAQ)"
sidebarTitle: "FAQ"
weight: -40
---

## How can I import configuration on production?

If you don't want to do so manually, include the following lines in your deploy hook in `.platformsh.app.yaml`:

```yaml
drush -y updatedb
drush -y config-import
```

That will automatically run `update.php` and import configuration on every new deploy.

The above configuration is included by default if you used our Drupal example repository or created a project through the Console.

## I'm getting a PDO Exception 'MySQL server has gone away'

Normally, this means there is a problem with the MySQL server container and you may need to increase the storage available to MySQL to resolve the issue. Ballooning MySQL storage can be caused by a number of items:

1. A large number of watchdog entries being captured.  Examine the watchdog logs and resolve the errors reported.
2. Cron should run at regular intervals to ensure cache tables get cleared out.
3. You are using database caching.  That is not recommended, primarily because it can balloon the size of the database.  We recommend [Redis caching](/guides/drupal9/redis.md) for all Drupal sites.

## Why do I get "MySQL cannot connect to the database server"?

If you are having a problem connecting to the database server, you will need force a redeployment of the database container. To do so, you can edit the service definition to add or remove a small amount of storage and then push.

## Can I use the name of the session cookie for caching?

For Drupal sites, the name of the session cookie is based on a hash of the domain name. This means that it will actually be consistent for a specific website and can safely be used as a fixed value.

## Why do I see "File not found"?

If you see a bare "File not found" error when accessing your Drupal site with a browser,
you've pushed your code as a vanilla project but no `index.php` has been found.

Make sure your repository contains an `index.php` file in the [web location root](../../create-apps/app-reference.md#locations).
