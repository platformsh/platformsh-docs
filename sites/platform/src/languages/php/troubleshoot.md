---
title: Troubleshoot PHP
sidebarTitle: Troubleshoot
description: Learn how to troubleshoot common issues in PHP.
---

{{% composable/disclaimer %}}

For more general information, see how to [troubleshoot development](/development/troubleshoot.md).

## Previously successful PHP builds now fail {#build-failure-security-blocking}

When building a PHP app, Upsun runs `composer install`, which by default runs the latest available Composer version.

Composer version 2.9 introduces an Automatic Security Blocking feature, which is enabled by default and does the following: 
- If a dependency in the project has a known vulnerability, Composer fails the installation/update. 
- If a dependency is abandoned, Composer can optionally fail the installation. 

If advisories were published after the most recent PHP app deployment, the build might fail, even if the PHP dependencies have not changed.

**In this scenario, the best practice is to upgrade the affected dependencies** to maintain a strong security posture and address vulnerabilities. However, you can configure the level of blocking by using the `.dependencies.php.config.audit.*` keys described in the [Configure security blocking](/languages/php/_index.md#configure-security-blocking) section of the PHP topic.

**Important: Upsun advises against disabling security blocking.** However, as a last resort, the feature can be disabled as a workaround while you fix issues with dependencies.  

```yaml {configFile="app"}
applications:
# The app's name, which must be unique within the project.
myapp:
  type: 'php:{{% latest "php" %}}'
  <snip>
  dependencies:
    php:
      config:
        audit:
          block-insecure: false
```      

## Server reached `max_children`

If the server is receiving more concurrent requests than it has PHP processes allocated,
you encounter a message like the following:

```text {location="/var/log/app.log", no-copy="true"}
WARNING: [pool web] server reached max_children setting (2), consider raising it
```

This means some requests have to wait until another finishes.
{{% vendor/name %}} sets the number of workers based on the available memory of your container
and the estimated average memory size of each process.

You have two ways to increase the number of workers:

- Adjust the [worker sizing hints](/languages/php/fpm.md) for your project.
- Upgrade your {{% vendor/name %}} plan to get more computing resources.

## Execution timeout

If your PHP app can't handle the amount of traffic or is slow,
you encounter a message like the following:

```text {location="/var/log/app.log", no-copy="true"}
WARNING: [pool web] child 120, script '/app/public/index.php' (request: "GET /index.php") execution timed out (358.009855 sec), terminating
```

This means your PHP process is running longer than allowed.
You can adjust the `max_execution_time` value in `php.ini`. See also `request_terminate_timeout` in the [App reference](/create-apps/app-reference/single-runtime-image.md#runtime).

The most common causes of a timeout are an infinite loop (which is a bug that you should fix)
or the work itself requires a long time to complete.
For the latter case, you should consider putting the task into a background job.

The following command identifies the 20 slowest requests in the past hour,
which can provide an indication of what code paths to investigate.

```bash
grep $(date +%Y-%m-%dT%H --date='-1 hours') /var/log/php.access.log | sort -k 4 -r -n | head -20
```

If you see that the processing time of certain requests is slow (such as taking longer than 1000&nbsp;ms),
you should consider a continuous observability solution like [Blackfire](/increase-observability/integrate-observability/blackfire.md)
to monitor your app and help you improve the performance issue.

Otherwise, you may check if the following options are applicable:

- Find the most visited pages and see if they can be cached and/or put behind a CDN.
  Refer to [how caching works](/define-routes/cache.md).
- Upgrade your {{% vendor/name %}} plan to get more computing resources.

## Troubleshoot a crashed PHP process

If your PHP process crashed with a segmentation fault,
you encounter a message like the following:

```text {location="/var/log/app.log", no-copy="true"}
WARNING: [pool web] child 112 exited on signal 11 (SIGSEGV) after 7.405936 seconds from start
```

Either a PHP extension is hitting a segmentation fault or your PHP app code is crashing.
Review recent changes in your app and try to find the root cause.
You might want to use a tool such as [Xdebug](/languages/php/xdebug.md) for quicker troubleshooting.

## Troubleshoot a killed PHP process

If your PHP process is killed by the kernel,
you encounter a message like the following:

```text {location="/var/log/app.log", no-copy="true"}
WARNING: [pool web] child 429 exited on signal 9 (SIGKILL) after 50.938617 seconds from start
```

That means the memory usage of your container exceeds the limit allowed on your plan, so the kernel kills the offending process.
To solve this issue, try the following approaches:

- Check if the memory usage of your app is as expected and try to optimize it.
- Use [sizing hints](/languages/php/fpm.md) to reduce the amount of PHP workers, which reduces the memory footprint.
- Upgrade your {{% vendor/name %}} plan to get more computing resources.

## Restart PHP processes stuck during a build or deployment

If your [build or deployment is running longer than expected](/development/troubleshoot.md#stuck-build-or-deployment),
it might be because of a PHP process getting stuck.

To restart your PHP processes, run the following command in your app container:

```bash
pkill -f php-fpm
```

## Resource temporarily unavailable

If all PHP workers are busy,
you encounter a message like the following:

```text {location="/var/log/error.log", no-copy="true"}
connect() to unix:/run/app.sock failed (11: Resource temporarily unavailable)
```

This can be because too many requests are coming in at once
or the requests are taking too long to be processed (such as with calls to external third-party servers without timeouts).

To address the issue, you can:

- Lower the memory consumption of each request so that the amount of PHP workers gets automatically raised.
  This can be customized with the `runtime.sizing_hints.request_memory` key in your `{{< vendor/configfile "app" >}}` file.
  For more details, consult [PHP-FPM sizing](/languages/php/fpm.md).
- Add a [CDN](/domains/cdn/_index.md).
- Set up [HTTP caching](/learn/bestpractices/http-caching.md).
- Follow the global [performance tuning recommendations](/languages/php/tuning.md).
- Remove stale plugins and extensions when using a CMS.
- Upgrade the container size to get more resources.
