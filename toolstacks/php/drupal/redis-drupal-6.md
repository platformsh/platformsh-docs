# Using Redis with Drupal 6.x

While there are two options for using Redis on Drupal 7, please use PhpRedis for your Redis library as it is already installed via a .platform.app.yaml setting.

## Requirements

You will need to add the [Redis](https://www.drupal.org/project/redis)
module to your project. Please use only the 7.x-2.x branch. Despite the fact that you are on Drupal 6.x, this redis module will be what you need.

You will need to add the [Cache Backport](https://www.drupal.org/project/cache_backport) module. Please use any version including or after 6.x-1.0-rc4.

The Cache Backport module does not need to be enabled. Your settings.php configuration will do all the work.

### Via .platform.app.yaml
Change your .platform.app.yaml file to include 
````
runtime:
   extensions:
     - redis
````
        
That will introduce the redis namespace to your Drupal 6 instance.

### Via settings.php

Add these lines:
````
$conf['cache_inc'] = 'sites/all/modules/cache_backport/cache.inc';
$conf['redis_client_interface'] = 'PhpRedis'; // Uses the Redis extension configured in .platform.app.yaml
$conf['redis_client_host']      = 'redis.internal';  // Your Redis instance hostname.
$conf['cache_backends'][]       = 'sites/all/modules/redis/redis.autoload.inc';
$conf['cache_default_class']    = 'Redis_Cache';
````

### Verifying redis is running
Run this command in a SSH session in your environment `redis-cli -h redis.internal info`. You should run it before you push all this new code to your repository.

This should give you a baseline of activity on your Redis installation. There should be very little memory allocated to the Redis cache.

After you push this code, you should run the command and notice that allocated memory will start jumping.