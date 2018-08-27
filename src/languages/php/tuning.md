# Performance tuning PHP

Once your application is up and running it still needs to be kept fast.  Platform.sh offers a wide degree of flexibility in how PHP behaves, but that does mean you may need to take a few steps to ensure your site is running optimally.

The following recommendations are guidelines only.  They're also listed in approximately the order we recommend investigating them, although your mileage may vary.

## Upgrade to PHP 7.1+

There is very little purpose to trying to optimize a PHP application on PHP 5.  PHP 7 is generally twice as fast and uses half as much memory as PHP 5, making it unquestionably the first step to take when trying to make a PHP-based site run faster.

To change your PHP version, simply change the `type` key in your `.platform.app.yaml` to the desired PHP version.  As always, test it on a branch first before merging to `master`.

## Ensure that the router cache is properly configured

Although not PHP-specific, a common source of performance issues is a misconfigured cache.  The most common issue is not whitelisting session cookies, which results in a site with any cookies at all, including from analytics tools, never being cached.  See the [router cache](/configuration/routes/cache.md) documentation, and the [cookie entry](/configuration/routes/cache.md#cookies) specifically.

You will also need to ensure that your application is sending the correct `cache-control` header.  The router cache will obey whatever cache headers your application sends, so send it good ones.

Static assets cache headers are set using the `expires` key in `.platform.app.yaml`.  See the [`web.locations`](/configuration/app/web.md#locations) documentation for more details.

## Optimize the FPM worker count

PHP-FPM reserves a fixed number of simultaneous worker processes to handle incoming requests.  If more simultaneous requests are received than the number of workers then some requests will wait.  The default worker count is deliberately set rather conservative but can be improved in many cases.  See the [PHP-FPM sizing](/languages/php/fpm.md) page for how to determine and set a more optimal value.

If your `/var/log/app.log` file contains a lot of entries like 

```
WARNING: [pool web] server reached max_children setting (2), consider raising it
```

That means your worker count is too low.  If you have already set an optimal worker size and still see that message frequently consider upgrading your project resources.

## Configure opcache

PHP 5.5 and later include an opcache that is enabled at all times, as it should be.  It may still need to be tuned, however.  The opcache can be configured using `php.ini` values, which in this case are best set using the `variables` block in `.platform.app.yaml`.

The most important values to set are 

* `opcache.max_accelerated_files`: The max number of files that the opcache may cache at once.  If this is lower than the number of files in the application it will begin thrashing and become less effective.
* `opcache.memory_consumption`: The total memory that the opcache may use.  If the application is larger than this the cache will start thrashing and become less effective.

To determine how many files you have, run this command from the root of your application:

```bash
find . -type f -name '*.php' | wc -l
```

That will report the number of files in your file tree that end in `.php`.  That may not be perfectly accurate (some applications have PHP code in files that don't end in `.php`, it may not catch generated files that haven't been generated yet, etc.) but it's a reasonable approximation.  Set the `opcache.max_accelerated_files` option to a value slightly higher than this.  Note that PHP will automatically round the value you specify up to the next highest prime number, for reasons long lost to the sands of time.

Determining an optimal `opcache.memory_consumption` is a bit harder, unfortunately, as it requires executing code via a web request to get adequate statistics.  Fortunately there is a command line tool that will handle most of that.

Change to the `/tmp` directory (or any other non-web-accessible writeable directory) and install [`CacheTool`](https://github.com/gordalina/cachetool).  It has a large number of commands and options but we're only interested in the opcache status for FastCGI command.  The really short version of downloading and using it would be:

```bash
cd /tmp
curl -sO http://gordalina.github.io/cachetool/downloads/cachetool.phar
php cachetool.phar opcache:status --fcgi=$SOCKET
```

The `--fcgi=$SOCKET` option tells the command how to connect to the PHP-FPM process on the server through the Platform.sh-defined socket.  That command will output something similar to the following:

```bash
+----------------------+---------------------------------+
| Name                 | Value                           |
+----------------------+---------------------------------+
| Enabled              | Yes                             |
| Cache full           | No                              |
| Restart pending      | No                              |
| Restart in progress  | No                              |
| Memory used          | 29.65 MiB                       |
| Memory free          | 34.35 MiB                       |
| Memory wasted (%)    | 0 b (0%)                        |
+----------------------+---------------------------------+
| Cached scripts       | 1528                            |
| Cached keys          | 2609                            |
| Max cached keys      | 32531                           |
| Start time           | Mon, 18 Jun 2018 18:19:32 +0000 |
| Last restart time    | Never                           |
| Oom restarts         | 0                               |
| Hash restarts        | 0                               |
| Manual restarts      | 0                               |
| Hits                 | 8554                            |
| Misses               | 1594                            |
| Blacklist misses (%) | 0 (0%)                          |
| Opcache hit rate     | 84.29247142294                  |
+----------------------+---------------------------------+
```

The most important values for now are the `Memory used`, `Memory free`, and `Oom restarts` (Out Of Memory Restarts).  If the `Oom restarts` number is high (meaning more than a handful) it means you don't have enough memory allocated to the opcache.  In this example the opcache is using about half of the 64 MB given to it by default, which is fine.  If `Memory free` is too low or `Oom Restarts` too high, set a higher value for the memory consumption.

Remember to remove the `cachetools.phar` file once you're done with it.

Your `.platform.app.yaml` file will end up including a block similar to:

```yaml
variables:
    php:
        'opcache.max_accelerated_files': 22000
        'opcache.memory_consumtion': 96
```

(Memory consumption is set in megabytes.)

## Optimize your code

It's also possible that your own code is doing more work than it needs to.  Profiling and optimizing a PHP application is a much larger topic than will fit here, but Platform.sh recommends enabling [Blackfire.io](/administration/integrations/blackfire.md) on your project to determine what slow spots can be found and addressed.

