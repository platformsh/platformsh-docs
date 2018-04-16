# Troubleshooting

<!-- toc -->

## Force a redeploy

There are times where you might want to trigger a redeployment of your application. That can be done with the following command:

```sh
platform redeploy
```

Do not trigger a redeploy if there are builds in a "Pending" state, as these will block deployment. Wait for those builds to complete.


## HTTP responses "502 bad gateway" or "503 service unavailable"

If you receive these HTTP responses from your site, it suggests that your site is running out of workers or the application process is crashing.  Here are the typical causes:

* The amount of traffic coming to your site exceeds the processing power of your application.
* Certain code path(s) in your application are too slow.
* A PHP process is crashing because of a segmentation fault.
* A PHP process is killed by the kernel out-of-memory killer.

### Too much traffic or a slow application

If your PHP application is not able to handle the amount of traffic or it is slow, you should see log lines from `/var/log/app.log` like any of the below:

```
WARNING: [pool web] server reached max_children setting (2), consider raising it
WARNING: [pool web] child 120, script '/app/public/index.php' (request: "GET /index.php") execution timed out (358.009855 sec), terminating
```

When you see "execution timed out", that means your application is probably having a infinite loop or the work itself requires a long time to complete. For the latter case, you should consider putting the task into a background job.

When you see "server reached max_children setting", the web traffic exceeded the capacity that your application can handle. You can use the below example [Platform.sh CLI](/overview/cli.md) command to find the top 20 slowest requests in the last hour.

```
platform ssh "grep $(date +%Y-%m-%dT%H --date='-1 hours') /var/log/php.access.log | sort -k 4 -r -n | head -20"
```

If you see that the processing time of certain requests is slow (e.g. taking more than 1000ms), you may wish to consider using a profiler like [Blackfire](/administration/integrations/blackfire.md) to debug the performance issue.

Otherwise, you may check if the following options are applicable:

* Find the most visited pages and see if they can be cached and/or put behind a CDN.  You may refer to [how caching works](/configuration/routes/cache.md).
* Upgrade your subscription on Platform.sh to get more computing resources. To do so, log into your [account](https://accounts.platform.sh) and edit the project subscription.

### PHP process crashed

If your PHP process crashed with a segmentation fault, you should see log lines in `/var/log/app.log` like below:

```
WARNING: [pool web] child 112 exited on signal 11 (SIGSEGV) after 7.405936 seconds from start
```

This is complicated, either a PHP extension is hitting a segmentation fault or your PHP application code is crashing. You should review recent changes in your application and try to find the cause of it, probably with the help of XDebug.

### PHP process is killed

If your PHP process is killed by the kernel, you should see log lines in `/var/log/app.log` like this:

```
WARNING: [pool web] child 429 exited on signal 9 (SIGKILL) after 50.938617 seconds from start
```

The memory usage of your container exceeds the limit, the kernel thus kills the offending process. You should try the following:

* Check if the memory usage of your application is expected and try to optimize it.
* Use [sizing hints](https://docs.platform.sh/languages/php.html#php-worker-sizing-hints) to reduce the amount of PHP workers which reduces the memory footprint.
* Upgrade your subscription on Platform.sh to get more computing resources. To do so, log into your [account](https://accounts.platform.sh) and edit the project.

## Low disk space

If you suspect you are running low on disk space in your application container, the easiest way to check it is to log in using `platform ssh` and run the `df` command.  `df` has numerous options to tweak its output, but for just checking the available writeable space the most direct option is: `df -h -x tmpfs -x squashfs | grep -v /run/shared`

That will show only the writeable mounts on the system, similar to:

```
Filesystem                                                       Size  Used Avail Use% Mounted on
/dev/mapper/platform-syd7waxqy4n5q--master--7rqtwti----app       2.0G   37M  1.9G   2% /app/tmp
/dev/mapper/platform-tmp--syd7waxqy4n5q--master--7rqtwti----app  3.9G   42M  3.8G   2% /tmp
```

* The first entry shows the storage device that is shared by all of your disk mounts.  Only one path will be shown under `Mounted on` but the disk space reported is common to all defined mounts in a single pool.  In this example, there are 2 GB of total disk allocated to the app container of which only 2% (37 MB) has been used total by all defined mounts.
* The second entry is the operating system temp directory, which is always the same size.  While you can write to this directory files there are not guaranteed to persist and may be deleted on deploy.

For a MariaDB database, the command `platform db:size` will give approximate disk usage as reported by MariaDB.  However, be aware that due to the way MySQL/MariaDB store and pack data this number is not always accurate, and may be off by as much as 10 percentage points.

```
+--------------+--------+
| Property     | Value  |
+--------------+--------+
| max          | 2048MB |
| used         | 189MB  |
| percent_used | 9%     |
+--------------+--------+
```

For the most reliable disk usage warnings, we strongly recommend all customers enable [Health notifications](/administration/integrations/notifications.md) on all projects.  That will provide you with a push-notification through your choice of channel when the available disk space on any service drops too low.


## MySQL lock wait timeout

If you receive MySQL error messages like this:

```
SQLSTATE[HY000]: General error: 1205 Lock wait timeout exceeded;
```

This means a process running in your application acquired a lock from MySQL for a long period of time.  That is typically caused by one of the following:

* There are multiple places acquiring locks in different order. For example, code path 1 first locks record A and then locks record B.  Code path 2, in contrast, first locks record B and then locks record A.
* There is a long running background process executed by your application that holds the lock until it ends.

If you're using [MariaDB 10+](/configuration/services/mysql.md), you can use the SQL query `SHOW FULL PROCESSLIST \G` to list DB queries waiting for locks.  Find output like the following, and start debugging.

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

During the [build phase](/overview/build-deploy.md#building-the-application) of your application, the main filesystem is writable.  So you can do whatever you want (e.g. compile code or generate anything you need).  But during and after the [deploy phase](/overview/build-deploy.md#deploying-the-application), the main filesystem will be read-only.

## RootNotFoundException from the CLI

If you check out a project via Git directly and not using the `platform get` command, you may end up with the CLI unable to determine what project it's in.  If you run a CLI command from within the project directory you've checked out but get an error like this:

```
[RootNotFoundException] Project root not found. This can only be run from inside a project directory.
```

Then the CLI hasn't been able to determine the project to use.  To fix that, run:

```
platform project:set-remote <project_id>
```

where `<project_id>` is the random-character ID of the project.  That can be found by running `platform projects` from the command line to list all accessible projects.  Alternatively, it can be found in the UI after the `platform get` command shown or in the URL of the UI or project domain.

## "File not found" in Drupal

If you see a bare "File not found" error when accessing your Drupal site with a browser, this means that you've pushed your code as a vanilla project but no *index.php* has been found.

Make sure your repository contains an *index.php* file in the [web location root](/configuration/app-containers.md#locations), or that your [Drush](/frameworks/drupal7/drush.md) make files are properly named.


## Stuck build or deployment

If you see a build or deployment running longer than expected, that may be one of the following cases:

1. The build is blocked by a process in your build hook.
2. The deployment is blocked by a long running process in your deploy hook.
3. The deployment is blocked by a long running cron job in the environment.
4. The deployment is blocked by a long running cron job in the parent environment.

To determine if your environment is being stuck in the build or the deployment, you can look at the build log available on the UI.  If you see a line similar to the following:

```
Re-deploying environment w6ikvtghgyuty-drupal8-b3dsina.
```

It means the build has completed successfully and the system is trying to deploy.  If that line never appears then it means the build is stuck.

For a blocked _build_ (when you don't find the `Re-deployment environment ...` line), create a [support ticket](https://platform.sh/support) to have the build killed.  In some regions the build will self-terminate after one hour.  In other regions (US and EU) the build will need to be killed by our support team.

When a _deployment_ is blocked, you should try the following:

1. Use [SSH](/development/access-site.md) to connect to your environment. Find any long-running cron jobs on the environment by running `ps afx`. Once you have identified the long running process on the environment, kill it with `kill <PID>`. PID stands for the process id showned by `ps afx`.
2. If you're performing "Sync", "Merge", or "Activate" on an environment and the process is stuck, use [SSH](/development/access-site.md) to connect to the parent environment and identify any long running cron jobs with `ps afx`. Kill the job(s) if you see any.

## Slow or failing build or deployment

Builds that take long time or fail is a common problem. Most of the time it's related to an application issue and they can be hard to troubleshoot without guidance.

Here are a few tips that can help you solve the issues you are experiencing.

### Check for errors in the logs

Invisible errors during the build and deploy phase can cause increased wait times, failed builds and other problems. Investigating each log and fixing errors is essential.

Related documentation: [Accessing logs](https://docs.platform.sh/development/logs.html#accessing-logs)

### Check php.access.log

If you are using PHP, the php.access.log contains the page executions by PHP-FPM. It also includes the execution time and peak memory usage of each request. This can be used to find pages and scripts that use too much memory or time to finish.

Show 10 slowest page loads in the last 1000 requests: `tail -n 1000 php.access.log | sort -n -k 4 | tail`

### Build and deploy hooks

Hooks are frequently the cause of long build time. If they run into problem they can cause the build to fail or hang indefinitely.

The build hook can be tested in your local environment.  Because the deployed environment on Platform.sh is read-only the build hooks cannot be rerun there.

Deploy hooks can be tested either locally or by logging into the application over SSH and running them there.  They should execute safely but be aware that depending on what your scripts are doing they may have an adverse impact on the running application (e.g., flushing all caches).

Furthermore, you can test your hooks with these Linux commands to help figure out any problems:

```
time $cmd # Print execution time
strace -T $cmd # Print a system call report
```

Related documentation: [Build and deploy hooks](https://docs.platform.sh/configuration/app/build.html#hooks)

### Cron jobs

Containers cannot be shutdown while long-running tasks are active.  That means long-running cron jobs will block a container from being shut down to make way for a new deploy.

For that reason, make sure your custom cron jobs execution times are low and that they are running properly.  Be aware that cron jobs may invoke other services in unexpected ways, which can increase execution time.

**note**
Drupal's `drush core-cron` run installed module's cron task. Those can be, for example; evicting invalid cache, updating database records, regenerating assets. Be sure to frequently benchmark the `drush core-cron` command in all your environments, as it is a common source of performance issues.

Related documentation: [Cron and scheduled tasks](https://docs.platform.sh/configuration/app/cron.html#cron-jobs)
