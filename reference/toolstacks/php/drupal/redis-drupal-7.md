# Using Redis with Drupal 7.x

There are two options for using Redis with Drupal on Platform.sh, you
can either use the [PhpRedis](https://github.com/nicolasff/phpredis)
extension or the [Predis](http://github.com/nrk/predis) library.  PhpRedis
requires a PHP extension (which we provide) and should therefore be faster in
most situations. Predis is written entirely in PHP and so would require no PHP
extension to install locally, but at the cost of some performance.

If you are unsure which to use, we recommend using PhpRedis.

## Requirements

### Add a redis service

First you need to create a redis service.  In your `.platform/services.yaml` file,
add or uncomment the following:

```yaml
rediscache:
    type: redis:3.0
```

That will create a service named `rediscache`, of type `redis`, specifically version `3.0`.

### Expose the Redis service to your application

In your `.platform.app.yaml` file, we now need to open a connection to the new 
Redis service.  Under the `relationships` section, add the following:

```yaml
relationships:
    redis: "rediscache:redis"
```

The key (left side) is the name that will be exposed to the application in the PLATFORM_RELATIONSHIPS
variable.  The right hand side is the name of the service we specified above (`rediscache`) and
the type of endpoint (`redis`).  If you named the service something different above, change `rediscache`
to that.

### Add the Redis PHP extension

If you're using PhpRedis you will need to enable the PHP Redis extension.  In your `.platform.app.yaml` file,
add the following right after the `type` block:

```yaml
# Additional extensions
runtime:
    extensions:
        - redis
```

(Skip this part if using Predis.)

### Add the Drupal module

You will need to add the [Redis](https://www.drupal.org/project/redis)
module to your project.

If you are using Drush Make, you can add these lines to your `project.make` file:

```ini
projects[redis][version] = 3.12
```

To use the Predis library, also add it to your make file:

```ini
libraries[predis][download][type] = get
libraries[predis][download][url] = https://github.com/nrk/predis/archive/v1.0.3.tar.gz
libraries[predis][directory_name] = predis
libraries[predis][destination] = libraries
```

## Configuration

To make use of the Redis cache you will need to set some Drupal
variables. You can either do this in your `settings.php` file or by
setting Platform Variables directly via the UI.

### Via the Web Interface

The advantage of using environment variables is that these won't be used
in your local build where you might not have Redis installed.

Add the following environment variables using the Platform.sh Web Interface. Note, if
you set a directory in the make file you will need to alter the
variables to match.

`drupal:cache_backends`

```bash
[
   "sites/all/modules/contrib/redis/redis.autoload.inc"
]
```

> **note**
> Remember to tick the JSON Value box.

> **note**
> Use the actual path to your Redis module in case it is in a different location. For example: `sites/all/modules/redis`. The
> location used above is the default when using Drush.

`drupal:redis_client_host`

```bash
redis.internal
```

`drupal:cache_default_class`

```bash
Redis_Cache
```

`drupal:cache_class_cache_form`

```bash
DrupalDatabaseCache
```

And finally, set the client interface to either `PhpRedis` or `Predis`.

`drupal:redis_client_interface`

```bash
PhpRedis
```

Or

```bash
Predis
```


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

Then (after the settings.local.php include):

```php
if (!empty($_ENV['PLATFORM_RELATIONSHIPS'])) {
  $relationships = json_decode(base64_decode($_ENV['PLATFORM_RELATIONSHIPS']), TRUE);
  $conf['redis_client_host'] = $relationships['redis'][0]['host'];
  $conf['redis_client_port'] = $relationships['redis'][0]['port'];
  $conf['redis_client_interface'] = 'PhpRedis';
  $conf['cache_backends'][]       = 'sites/all/modules/redis/redis.autoload.inc';
  $conf['cache_default_class']    = 'Redis_Cache';
  // The 'cache_form' bin must be assigned to non-volatile storage.
  $conf['cache_class_cache_form'] = 'DrupalDatabaseCache';
}
```

### Verifying redis is running
Run this command in a SSH session in your environment `redis-cli -h redis.internal info`. You should run it before you push all this new code to your repository.

This should give you a baseline of activity on your Redis installation. There should be very little memory allocated to the Redis cache.

After you push this code, you should run the command and notice that allocated memory will start jumping.

> **note**
> If you use Domain Access and Redis, ensure that your Redis settings (particularly `$conf['cache_backends']`)
> are included before the Domain Access `settings.inc` file - see
> [this Drupal.org issue](https://www.drupal.org/node/2008486#comment-7782941) for more information.
