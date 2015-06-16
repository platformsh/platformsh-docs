# Using Redis with Drupal 7.x

There are two options for using Redis with Drupal on Platform.sh, you
can either use the [PhpRedis](https://github.com/nicolasff/phpredis)
extension or the [Predis](http://github.com/nrk/predis) library.

## Requirements

You will need to add the [Redis](https://www.drupal.org/project/redis)
module to your project.

If you are using a make file, you can add those lines to your
`project.make`:

```ini
projects[redis][version] = 7.x-2.12
```

To use the Predis library also add it to your make file:

```ini
libraries[predis][download][type] = get
libraries[predis][download][url] = http://github.com/nrk/predis/archive/v0.8.7.tar.gz
libraries[predis][directory_name] = predis
libraries[predis][destination] = libraries
```

> -   drush_make_files

To use the PhpRedis extension you will need to add it to your
.platform.app.yaml file.

```yaml
# Additional extensions
runtime:
    extensions:
        - redis
```

> -   application_configuration

## Configuration

To make use of the Redis cache you will need to set some Drupal
variables. You can either do this in your `settings.php` file or by
setting Platform Variables directly via the UI.

### Via the Web Interface

The advantage of using environment variables is that these won't be used
in your local build where you might not have Redis installed.

Add the following environment variables using the Platform UI. Note, if
you set a directory in the make file you will need to alter the
variables to match.

`drupal:cache_backends`

```bash
[
   "sites/all/modules/redis/redis.autoload.inc"
]
```

> **note**
> Remember to tick the JSON Value box.

> **note**
> Use the actual path to your Redis module in case it is in a different location. For example: `sites/all/modules/contrib/redis`.

`drupal:lock_inc`

```bash
sites/all/modules/redis/redis.lock.inc
```

`drupal:redis_client_host`

```bash
redis.internal
```

`drupal:redis_client_interface`

```bash
Predis
```

Or

```bash
PhpRedis
```

`drupal:cache_default_class`

```bash
Redis_Cache
```

`drupal:cache_class_cache_form`

```bash
DrupalDatabaseCache
```

> **note**
> Currently, you need to commit some code to rebuild your environment so that the new variables are properly added to your `settings.local.php`. This will be fixed soon.

### Via settings.php

If you prefer to commit these variables directly to your `settings.php`,
here are the lines to add:

```php
$conf['redis_client_interface'] = 'Predis';
```

Or

```php
$conf['redis_client_interface'] = 'PhpRedis';
```

```php
$conf['redis_client_host']      = 'redis.internal';
$conf['lock_inc']               = 'sites/all/modules/redis/redis.lock.inc';
$conf['cache_backends'][]       = 'sites/all/modules/redis/redis.autoload.inc';
$conf['cache_default_class']    = 'Redis_Cache';
$conf['cache_class_cache_form'] = 'DrupalDatabaseCache';
```
