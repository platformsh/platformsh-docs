---
title: "FAQ"
weight: 200
description: |
    Troubleshoot issue you might encounter using [Laravel](https://laravel.com/), a PHP framework on {{% vendor/name %}}.
---

## How can I access my application logs?

To display the application log file (`/var/log/app.log` file), run the following command:

```bash
{{% vendor/cli %}} log app --tail
```

All the log messages generated by your app are sent to this `/var/log/app.log` file.
This includes language errors such as PHP errors, warnings, notices,
as well as uncaught exceptions.

The file also contains your application logs if you log on `stderr`.
This log doesn't include the default `laravel.log` located in `/storage`.

{{% note %}}

{{% vendor/name %}} manages the `app.log` file for you.
This is to prevent disks from getting filled and using very fast local drives instead of slower network disks.
Make sure your apps always output their logs to `stderr`.

{{% /note %}}

With Laravel, you can change your logging configuration to use `memory` and stream `php://stderr`.
In your `config/logging.php` file, add or update the following configuration:

```php {location="config/logging.php"}
'memory' => [
    'driver' => 'monolog',
    'handler' => Monolog\Handler\StreamHandler::class,
    'with' => [
        'stream' => 'php://stderr',
    ],
    'processors' => [
        // Simple syntax...
        Monolog\Processor\MemoryUsageProcessor::class,

        // With options...
        [
           'processor' => Monolog\Processor\PsrLogMessageProcessor::class,
           'with' => ['removeUsedContextFields' => true],
       ],
    ],
],
```

{{< note theme="warning" title="Warning">}}

If you log deprecations, make sure you **also** log them on `stderr`.

{{< /note >}}

## What's this "`Oops! An Error Occurred`" message about?

The `Oops! An Error Occurred` message comes from your app and is automatically generated based on the Laravel error template.

### The server returned a "`500 Internal Server Error`"

If your app's working as expected locally but you see the previous error message on {{% vendor/name %}},
it usually means you have a configuration error or a missing dependency.

To fix this issue, search your application logs.
They likely contain an error message describing the root cause:

```bash
{{% vendor/cli %}} logs all
  [app] [14-Aug-2024 10:52:27 UTC] [critical] Uncaught PHP Exception Exception: [...]
  [app]
  [php.access] {{ now.Year }}-08-14T10:52:27Z GET 500 2.386 ms 2048 kB 419.11% /
  [access] 78.247.136.119 - - [14/Aug/{{ now.Year }}:10:52:27 +0000] "GET / HTTP/1.1" 500 843 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
```

If the error occurs on a preview environment,
or on the main environment of a non-production project,
you can also enable Laravel's dev/debug mode to inspect the cause of the error
via the `APP_DEBUG` [environment variable](/get-started/stacks/laravel/environment-variables.md) in your
`.environment` file or via [{{% vendor/cli %}} console](/development/variables.md):

```bash
# Enable debug mode
export APP_DEBUG=1
# Disable debug mode
export APP_DEBUG=0
```

## Other issues

For other issues unrelated to Laravel, see [Troubleshoot development](/development/troubleshoot.html).

{{< guide-buttons previous="Back" >}}
