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

To make a PHP-based site run faster, the first step is to upgrade the PHP version.
Upgrading a PHP version might require changes on your app.
For more details and recommendation, see the [PHP migration guides](https://www.php.net/manual/en/migration81.php).

To change your PHP version, change the [`type` in your app configuration](../../create-apps/app-reference.md#example-configuration).
Before merging to production, test the change on a branch and make sure that your application is working as expected.

## Optimize the FPM worker count

PHP-FPM uses a fixed number of simultaneous worker processes to handle incoming requests.
If more simultaneous requests are received than the number of workers, then some requests wait until worker processes are available.

The default worker count is set to a conservative default value.
To determine and set the optimal value for your app, see [PHP-FPM sizing](./fpm.md).

## OPcache preloading

OPcache preloading loads selected files into shared memory, making their content (functions, classes) globally available for requests.
It also removes the need to include these files later.
When OPcache is correctly configured, it can result in significant improvements to both CPU and memory usage.

Caching should only be used on files where caching is meaningful.
Consult your frameworks's documentation to see
if there are recommendations for optimal preload configuration or ready-to-use preload scripts.

OPcache is only available on PHP 7.4+.
If you aren't using PHP 7.4, this is a good reason to upgrade.

Note that the only way to clear the preload cache is by [restarting PHP-FPM](#restart-php-fpm).

### Enable OPcache

To enable preloading add a variable that specifies a preload script:

```yaml {location=".platform.app.yaml"}
variables:
    php:
        opcache.preload: 'preload.php'
```

The `opcache.preload` value is a file path relative to the [app root](../../create-apps/app-reference.md#root-directory).
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

### Configure OPcache

OPcache needs to be tuned before production usage and can be configured [the same way as PHP](../php/_index.md#customize-the-php-settings).

{{< note >}}
On PHP 7.4+, let the application run for a while
before tuning OPcache itself
as the preload script may change the necessary configuration here.
{{< /note >}}

To get started with configuration, see how to:

- [Set the maximum amount of cached files](#set-the-maximum-amount-of-cached-files)
- [Set the memory consumption](#set-opcache-memory-consumption)

#### Set the maximum amount of cached files

`opcache.max_accelerated_files` is the maximum number of files that OPcache may cache at once.
If this is lower than the number of files in the application, the cache starts [thrashing](https://en.wikipedia.org/wiki/Thrashing_(computer_science)) and becomes less effective.

To set that option, you have to first determine roughly how many `.php` files your application has.
To do so, run this command from [your app root](../../create-apps/app-reference.md#root-directory):

```bash
find . -type f -name '*.php' | wc -l
```

Note that the returned valued is an approximation.
Some apps have PHP code in files that don't end in `.php` or files that are generated at runtime.

Set `opcache.max_accelerated_files` to a value slightly higher than the returned number.
PHP automatically rounds the value up to the next highest prime number.

#### Set the memory consumption

`opcache.memory_consumption` is the total memory that OPcache can use.
If the application's usage is larger than this, the cache starts thrashing and becomes less effective.

Determining an optimal `opcache.memory_consumption` requires executing code via a web request to get adequate statistics.
[`CacheTool`](https://github.com/gordalina/cachetool) is an open-source tool to help you get the statistics.

1. Connect via ssh using the [CLI](../../development/cli/_index.md) with: `platform ssh`.
2. Change to the `/tmp` directory with `cd /tmp` (or any other non-web-accessible writable directory).
3. Download CacheTool with `curl -sLO https://github.com/gordalina/cachetool/releases/latest/download/cachetool.phar`.
4. Make CacheTool executable with `chmod +x cachetool.phar`.
5. Run CacheTool to check the OPcache status for FastCGI commands.

   ```bash
   php cachetool.phar opcache:status --fcgi=$SOCKET
   ```

  The `--fcgi=$SOCKET` option ensures the PHP-FPM process on the server connects through the right socket.

The most important values from the `CacheTool` output are:

- `Memory used`,
- `Memory free`,
- `Oom restarts` (out of memory restarts).
  If the value is different than 0, you don't have enough memory allocated to OPcache.

In this example, the OPcache is using about half of the 64 MB given to it by default, which is fine.
If `Memory free` is too low or `Oom Restarts` too high,
set a higher value for memory consumption.

Remember to remove the `cachetools.phar` file once you're done with it.

Add the numbers to your app configuration:

```yaml {location=".platform.app.yaml"}
variables:
    php:
        'opcache.max_accelerated_files': 22000
        'opcache.memory_consumption': 96
```

Note: The unit for the `opcache.memory_consumption` is megabytes.

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
you need to explicitly clear OPcache on deployment by [restarting PHP-FPM](#restart-php-fpm).

Note: If your application generates PHP code at runtime based on user configuration, you can't disable the timestamp validation.
Doing so would prevent updates to the generated code from being loaded.

### Restart PHP-FPM

To force a restart of PHP-FPM, you can run `pkill -f php-fpm` or `sv restart app`.
If you want to force a restart of PHP-FPM on every (re)deployment, add these commands to your [`deploy` hook](../../create-apps/hooks/hooks-comparison.md#deploy-hook).

## Optimize your code

To optimize your app, consider using a [profiler](../../increase-observability/integrate-observability/_index.md).
A profiler helps to determine what slow spots can be found and addressed and helps to improve performance.
