---
title: "Performance tuning"
weight: 3
---

Once your application is up and running it still needs to be kept fast.
Platform.sh offers a wide degree of flexibility in how PHP behaves,
but that does mean you may need to take a few steps to ensure your site is running optimally.

The following recommendations are guidelines only.
They're also listed in approximately the order to investigate them.

## Upgrade to PHP 8

When trying to make a PHP-based site run faster, the first step is to upgrade the PHP version.

For instance, PHP 7 is around twice as fast and uses half as much memory as PHP 5.

Upgrading a PHP version might require changes on your app.
For more details and recommendation, see the [PHP migration guides](https://www.php.net/manual/en/migration81.php).

To change your PHP version, change the [`type` in your app configuration](../../create-apps/app-reference.md#example-configuration).
Before merging to production, test the change on a branch and make sure that your application is working as expected.

## Ensure that the router cache is properly configured

A common source of performance issues is a misconfigured cache.
The most common issue is not allowing the right cookies as part of the router cache.

Some cookies, such as session cookies, need to be allowed,
whereas others, such as marketing and analytics cookies,
usually shouldn't be allowed to be part of the cache key.

See more about [router cache](../../define-routes/cache.md)
and [cookie entry](../../define-routes/cache.md#cookies).

You also need to ensure that your application is sending the correct `cache-control` header.
The router cache obeys whatever cache headers your application sends,
so send it good ones.

Static assets cache headers are set using the `expires` key in `.platform.app.yaml`.
See the [`web.locations` documentation](../../create-apps/app-reference.md#locations) for more details.

## Optimize the FPM worker count

PHP-FPM uses a fixed number of simultaneous worker processes to handle incoming requests.
If more simultaneous requests are received than the number of workers, then some requests wait until worker processes are available.

The default worker count is set to a conservative default value.
To determine and set the optimal value for your app, see [PHP-FPM sizing](./fpm.md).

## OPcache preloading

OPcache preloading loads selected files into shared memory bypassing the need to include or autoload these files later.
It can result in significant improvements to both CPU and memory usage if your application supports it.

It's available on PHP 7.4+.
If you aren't using PHP 7.4, this is a good reason to upgrade.
Consult your application's documentation to see
if they have any recommendations for an optimal preload configuration.

Note that the only way to clear the preload cache is by restarting PHP-FPM. 
<!-- TODO: Check that is true since we state otherwise below -->
PHP-FPM isn't restarted on every deployment automatically,
so you might want to add that in a [`deploy` hook](../../create-apps/hooks/hooks-comparison.md#deploy-hook),
such as by including `pkill -f php-fpm` or `sv restart app`.

### Enable OPcache

<!-- TODO: Redo structure to follow howto -->
To enable preloading, add a `php.ini` value that specifies a preload script:

```yaml {location=".platform.app.yaml"}
variables:
    php:
        opcache.preload: 'preload.php'
```

The `opcache.preload` value is a file path relative to the application root (where `.platform.app.yaml` is).
It may be any PHP script that calls `opcache_compile_file()`.
The following example preloads all `.php` files in the `vendor` directory (and subdirectories):

```php {location="preload.php"}
<?php
$directory = new RecursiveDirectoryIterator(getenv('PLATFORM_APP_DIR') . '/vendor');
$iterator = new RecursiveIteratorIterator($directory);
$regex = new RegexIterator($iterator, '/^.+\.php$/i', RecursiveRegexIterator::GET_MATCH);

foreach ($regex as $key => $file) {
    // This is the important part!
    opcache_compile_file($file[0]);
}
```

If you have [disabled OPcache timestamp validation](#disable-opcache-timestamp-validation),
you need to clear the OPcache explicitly on deployment (which can be done by restarting PHP-FPM).

{{< note >}}
Preloading all `.php` files may not be optimal for your application, and may even introduce errors. Your application framework may provide recommendations or a pre-made preload script to use instead. Determining an optimal preloading strategy is the user's responsibility.
{{< /note >}}

### Configure OPcache

OPcache can be configured using the `variables` block in `.platform.app.yaml` (recommended approach) or using `php.ini` values.
OPcache needs to be tuned before production usage.

{{< note >}}

<!-- Is this still relevant? -->
If using OPcache preloading on PHP 7.4 or later,
configure that first and let the application run for a while
before tuning the OPcache itself
as the preload script may change the necessary configuration here.

{{< /note >}}

The most important values to set are:

- `opcache.max_accelerated_files`:
  The max number of files that OPcache may cache at once.
  If this is lower than the number of files in the application,
  it starts thrashing and becomes less effective.
- `opcache.memory_consumption`:
  The total memory that OPcache may use.
  If the application is larger than this,
  the cache starts thrashing and becomes less effective.

### Set `opcache.max_accelerated_files`

To set that option, you have to first determine roughly how many `.php` files your application has.

To do so, run this command from [your app root](../../create-apps/app-reference.md#root-directory):

```bash
find . -type f -name '*.php' | wc -l
```

Note that the returned valued is an approximation.
Some apps have PHP code in files that don't end in `.php` or files that are generated at runtime.

Set `opcache.max_accelerated_files` to a value slightly higher than the returned number.
PHP automatically rounds the value up to the next highest prime number.

### Set `opcache.memory_consumption`

Determining an optimal `opcache.memory_consumption` requires executing code via a web request to get adequate statistics.
[`CacheTool`](https://github.com/gordalina/cachetool) is an open-source tool to help you get the statistics.

<!-- TODO check what is expected to be done here -->
1. Connect via ssh
2. Change to the `/tmp` directory (or any other non-web-accessible writable directory)
3. Install `CacheTool`
4. Check the OPcache status for FastCGI commands.

   ```bash
   php cachetool.phar opcache:status --fcgi=$SOCKET
   \```

The really short version of downloading and using it would be:

```bash
cd /tmp
curl -sLO https://github.com/gordalina/cachetool/releases/latest/download/cachetool.phar
chmod +x cachetool.phar
php cachetool.phar opcache:status --fcgi=$SOCKET
```

The `--fcgi=$SOCKET` option ensures the PHP-FPM process on the server connects through the socket defined by Platform.sh.
That command outputs something similar to:

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

The most important values for now are:

- `Memory used`,
- `Memory free`,
- `Oom restarts` (Out Of Memory Restarts). If the `Oom restarts` number is high (meaning more than a handful),
it means you don't have enough memory allocated to the OPcache.

In this example, the OPcache is using about half of the 64 MB given to it by default, which is fine.
If `Memory free` is too low or `Oom Restarts` too high,
set a higher value for memory consumption.

Remember to remove the `cachetools.phar` file once you're done with it.

Your `.platform.app.yaml` file should include a block similar to:

```yaml {location=".platform.app.yaml"}
variables:
    php:
        'opcache.max_accelerated_files': 22000
        'opcache.memory_consumption': 96
```

Memory consumption is set in megabytes.

### Disable OPcache timestamp validation

By default, OPcache checks that the cached version of a file is always up to date.
This means that every time a cached file is used, OPcache compares it to the file on disk.
If that file has changed, it gets reloaded and recached.

If you know your code isn't going to change outside of a new deploy,
you can disable that check and get a small performance improvement.

Timestamp validation can be disabled by adding the following to your app configuration:

```yaml {location=".platform.app.yaml"}
variables:
    php:
        'opcache.validate_timestamps': 0
```

When you have disabled OPcache timestamp validation,
you need to explicitly clear OPcache on deployment by restarting PHP-FPM.

Note: If your application generates PHP code at runtime based on user configuration, you can't disable the timestamp validation.
Doing so would prevent updates to the generated code from being loaded.

## Optimize your code

It's possible that your app is doing more work than it needs to.
To profile and optimize your PHP app, consider using [Blackfire](../../increase-observability/integrate-observability/blackfire.md).
It can determine what slow spots can be found and addressed.

The web agency [Pixelant](https://www.pixelant.net/) has published a [log analyzer tool for Platform.sh](https://github.com/pixelant/platformsh-analytics).

This tool works only for PHP scripts,
but offers good visualizations and insights into the operation of your site.

It suggests where to further optimize your configuration
and provides guidance on when to increase your plan size.

Note that this tool is maintained by a 3rd party, not by Platform.sh.
