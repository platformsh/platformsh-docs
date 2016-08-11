# Drupal Frequently Asked Questions (FAQ)

## How can I import configuration on production?

If you don't want to do so manually, include the following lines in your deploy hook in `.platformsh.app.yaml`:

```yaml
drush -y updatedb
drush -y config-import
```

That will automatically run `update.php` and import configuration on every new deploy.

The above configuration is included by default if you used our Drupal 8 example repository or created a project through the UI.

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

## Why do I get "MySQL cannot connect to the database server"?

If you are having a problem connecting to the database server, you will
need force a re-deployment of the database container. To do so, you can
edit the service definition to add or remove a small amount of storage and
then push.

## Can I use the name of the session cookie for caching?

For Drupal sites, the name of the session cookie is based on a hash of the 
domain name. This means that it will actually be consistent for a specific 
website and can safely be used as a fixed value.
