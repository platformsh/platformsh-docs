# Troubleshooting

<!-- toc -->


## HTTP 502 response

If you receive HTTP 502 responses from your site, it means that your site is running out of workers, or the application process is crashing.  Here are the typical causes:

* The amount of traffic coming to your site exceeds the processing power of your application.
* Certain code path(s) in your application are too slow.
* PHP process is crashing because of segmentaion fault.
* PHP process is killed by the kernel out-of-memory killer.

### Too much traffic or slow application

If your PHP application is not able to handle the amount of traffic or it is slow, you should see log lines from `/var/log/app.log` like any of the below:

```
WARNING: [pool web] server reached max_children setting (2), consider raising it
WARNING: [pool web] child 120, script '/app/public/index.php' (request: "GET /index.php") execution timed out (358.009855 sec), terminating
```

When you see exection timed out, that means your application is probably having a infinite loop or the work itself requires a long time to complete. For the latter case, you should consider putting the task into a background job.

When you see server reached max_children settings, the web traffic exceeded the capacity that your application can handle. You can use the below example [Platform.sh CLI](/overview/cli.md) command to find the top 20 slowest requests in the last hour.

```
platform ssh "grep $(date +%Y-%m-%dT%H --date='-1 hours') /var/log/php.access.log | sort -k 4 -r -n | head -20"
```

If you see that the processing time of certain requests is slow (e.g. taking more than 1000ms), you may wish to consider using a profiler like [Blackfire](/administration/integrations/blackfire.md) to debug the performance issue.

Otherwise, you may check if the following options are applicable:

* Find the most visited pages and see if they can be cached and/or put behind a CDN.  You may refer to [how caching works](/configuration/routes/cache.md).
* Upgrade your subscription on Platform.sh to get more computing resources. To do so, log into your [account](https://accounts.platform.sh) and edit the project subscription.

### PHP process is crashed

If your PHP process is crashed by segmentation fault, you should see log lines in `/var/log/app.log` like below:

```
WARNING: [pool web] child 112 exited on signal 11 (SIGSEGV) after 7.405936 seconds from start
```

This is complicated, either a PHP extension is hitting segmentation fault or your PHP application code is crashing. You should review recent changes in your application and try to find the cause of it, probably with the help of XDebug.

### PHP process is killed

If your PHP process is killed by the kernel, you should see log lines in `/var/log/app.log` like below:

```
WARNING: [pool web] child 429 exited on signal 9 (SIGKILL) after 50.938617 seconds from start
```

The memory usage of your container exceeds the limit, the kernel thus kills the offending process. You should try the following:

* Check if the memory usage of your application is expected and try to optimize it.
* Use [sizing hints](https://docs.platform.sh/languages/php.html#php-worker-sizing-hints) to reduce the amount of PHP workers which reduces the memory footprint.
* Upgrade your subscription on Platform.sh to get more computing resources. To do so, log into your [account](https://accounts.platform.sh) and edit the project subscription.


## MySQL lock wait timeout

If you receive MySQL error messages like this:

```
SQLSTATE[HY000]: General error: 1205 Lock wait timeout exceeded;
```

This means a process running in your application acquired a lock from MySQL for a long period of time.  That is typically caused by one of the following:

* There are multiple places acquiring locks in different order. For example, code path 1 first locks record A and then locks record B.  Code path 2, in contrast, first locks record B and then locks record A.
* There is a long running background process executed by your application that holds the lock until it ends.

If you're using [MariaDB 10.0](/configuration/services/mysql.md), you can use SQL query `SHOW FULL PROCESSLIST \G` to list DB queries waiting for locks.  Find output like the following, and start debugging.

```
< skipped >
Command: Query
Time: ...
State: Waiting for table metadata lock
Info: SELECT ...
< skipped >
```

To find active background processes, run `ps aufx` on your application container.

Also, please make sure that locks are acquired in a pre-defined order and released as soon as possible.


## "Read-only file system" error

Everything will be read-only, except the writable [mounts](/configuration/app-containers.md#mounts) you declare.  Writable mounts are there for your data: for file uploads, logs and temporary files. Not for your code.  In order to change code on Platform.sh you have to go through Git.

This is what gives you all of the benefits of having repeatable deployments, consistent backups, traceability, and the magically fast creation of new staging/dev environments.

In Platform.sh, you cannot just "hack production".  It is a constraint, but it is a good constraint.

During the [build phase](/overview/how-it-works.md#building-the-application) of your application, the main filesystem is writable.  So you can do whatever you want (e.g. compile code or generate anything you need).  But during and after the [deploy phase](/overview/how-it-works.md#deploying-the-application), the main filesystem will be read-only.


## "File not found" in Drupal

If you see a bare "File not found" error when accessing your Drupal site with a browser, this means that you've pushed your code as a vanilla project but no *index.php* has been found.

Make sure your repository contains an *index.php* file in the [web location root](/configuration/app-containers.md#locations), or that your Drush make files are properly named.
