---
title: Troubleshoot development
sidebarTitle: Troubleshoot
weight: 16
description: See some common solutions to issues you might run into in development.
---

## Common tasks

### Force a redeploy

There are times where you might want to trigger a redeployment of your application,
such as to add custom TLS certificates.
A redeploy reuses your built app and services.

To trigger a redeploy, follow these steps:

{{< codetabs >}}

+++
title=In the Console
+++

- Select the project with the given environment.
- From the **Environment** menu, select the environment.
- Click {{< icon more >}} **More**.
- Click **Redeploy**.

<--->

+++
title=Using the CLI
+++

Run the following command:

```sh
{{% vendor/cli %}} redeploy
```

{{< /codetabs >}}

The redeploy takes place after any scheduled activities (either *Running* or *Pending*).

{{< note >}}

Despite the name, redeployment doesn't rerun the `deploy` hook, only the `post_deploy` hook.
Both your `build` and `deploy` hooks are tied to individual commits in code.
They're reused until another commit is pushed to the environment.
See [more about hooks](../create-apps/hooks/_index.md) and their reuse.

To rerun the `build` and `deploy` hooks, [manually trigger a build](#manually-trigger-builds).

{{< /note >}}

{{< note theme="info" title="Is there a way to redeploy the production environment without knowing its name?" >}}

It's often desirable that the production environment, like many other values, is not hardcoded into your external workflows and management scripts.
You can use the CLI, along with the [environment type distinction](/glossary.md#environment-type) to identify a production environment (assuming there is only one) and redeploy it in a single line.

To do so, run the following command:

```bash
{{% vendor/cli %}} redeploy -e $({{% vendor/cli %}} environment:list --type production --pipe)
```

{{< /note >}}

### Manually trigger builds

To increase performance and keep applications the same across environments,
{{% vendor/name %}} reuses built applications if its code and build time configuration (variables and such) remain the same.

There may be times where you want to force your application to be built again without changing its code,
for example to test an issue in a build hook or when external dependencies change.
To force a rebuild without changing the code,
use an [environment variable](/development/variables/set-variables.md#create-environment-specific-variables).

Assuming you want to do this for your `main` environment,
first create a `REBUILD_DATE` environment variable:

```bash
{{% vendor/cli %}} variable:create --environment main --level environment --prefix env --name REBUILD_DATE --value "$(date)" --visible-build true
```

This triggers a build right away to propagate the variable.
To force a rebuild at any time, update the variable with a new value:

```bash
{{% vendor/cli %}} variable:update --environment main --value "$(date)" "env:REBUILD_DATE"
```

This forces your application to be built even if no code has changed.

### Clear the build cache

You may find that you need to clear the build cache,
such as when it's grown too big or, in rare circumstances, when it's corrupted.
It may get corrupted when code is downloaded from a third-party language service like Packagist or npm
while that service is experiencing issues.

To clear the build cache, run the following command:

```sh
{{% vendor/cli %}} project:clear-build-cache
```

The next build for each environment is likely to take longer as the cache rebuilds.

## Access denied or permission denied

In most cases, issues accessing a project are caused by missing permissions for a given user.
For more information see how to [manage user permissions](../administration/users.md).

If you are using the CLI, make sure that [you are authenticated](../administration/cli/_index.md#2-authenticate).

If you are using SSH, see how to [troubleshoot SSH access](../development/ssh/troubleshoot-ssh.md).

## HTTP responses 502 Bad Gateway or 503 Service Unavailable

{{< note theme="tip" title="502 errors" version="1" >}}

For troubleshooting tips specifically for 502 errors, please head to the [502 errors resolution guide](/development/502-errors).

{{< /note >}}

If you encounter a **502 Bad Gateway** or **503 Service Unavailable** error while accessing your application, it typically indicates that your application is either crashing or unavailable. 

Below are the typical causes and potential solutions:

#### 1. Your app is listening at the wrong place
- **Solution**: Check your app's [upstream properties](/create-apps/app-reference/single-runtime-image.md#upstream).
- If your app is listening at a specific port, verify that it’s using the [`PORT` environment variable](/development/variables/use-variables.md#use-provided-variables) and ensure that it is listening at the correct port. 

#### 2. Configuration issues in `.upsun/config.yaml`
- **Solution**: Review your `.upsun/config.yaml` configuration.
- Look for any errors that might prevent a process from starting or cause issues with requests being forwarded properly.
- Check the `web.commands.start` entry or your `passthru` configuration for any misconfigurations.
- Check your logs to get a clearer picture of what is going on with your application.

#### 3. Excessive traffic to your application
- **Solution**: Check if the amount of traffic coming to your site exceeds your application's processing power.
- Consider whether [bots or automated traffic might be overwhelming your site](https://support.platform.sh/hc/en-us/community/posts/16439634723858).

#### 4. Slow code paths causing timeouts
- **Solution**: Check your application's code to ensure it is running efficiently.
- Use [observability tools](/increase-observability/application-metrics/_index.md) provided in your project for better insight into performance issues and potential bottlenecks.

#### 5. PHP process crashing due to segmentation fault
If your PHP process crashes due to a segmentation fault, you may encounter a message like the warning error detailed below. This indicates that either a PHP extension is causing the segmentation fault or there’s an issue in your PHP app code. 

```text {location="/var/log/app.log"}
WARNING: [pool web] child 112 exited on signal 11 (SIGSEGV) after 7.405936 seconds from start
```
- **Solution**: Review recent changes made to your app to identify potential causes.
- Consider using a debugging tool such as [Xdebug](/languages/php/xdebug.md) to help with quicker troubleshooting and identify the root cause of the crash.

#### 6. PHP process killed by kernel out-of-memory killer
If your PHP process is killed by the kernel, you may encounter a message like the warning error detailed below. This indicates that the memory usage of your container exceeded the allocated limit, causing the kernel to kill the offending process.

```text {location="/var/log/app.log"}
WARNING: [pool web] child 429 exited on signal 9 (SIGKILL) after 50.938617 seconds from start
```
- **Solution**: Check if the memory usage of your app is as expected and try to optimize it.
- Use [sizing hints](/languages/php/fpm.md) to reduce the number of PHP workers, which will help lower the memory footprint.
- Add [additional resources](/manage-resources.md) using the `upsun resources:set` command to allocate more memory.

{{< note >}}

For more troubleshooting tips specifically for PHP, please head to the [PHP troubleshoot page](/languages/php/troubleshoot.md).

{{< /note >}}

#### 7. Project created but not pushed 
- **Solution**: If a project is created but hasn’t been pushed, it can result in a 502 error. 
- Ensure that the project is properly pushed to the environment.

#### 8. Domain added to edge hostname but not the project
If you add a domain and point it to an edge hostname but haven’t added the domain to the project, it may cause a 502 error. Note that DNS services may catch this issue and provide their own 502 page.

**Solution**: If you have added a domain, ensure that you have added the domain to the project and also make sure that it is pointing to the correct edge hostname.

#### 9. Mistyped edge hostname 
If there’s a typo in the edge hostname or if you attempt to request a site while it’s still coming up, you may encounter a 502 error like the one detailed in the example below. It will specify that there is no route known for the url you have provided.

  - Example:
    ```bash
    url=https://pr-662-mendzpy-4wqljznn6rjno.ca-1.platformsh.site/
    response=$(curl -s -o /dev/null -I -X GET -w "%{http_code}" ${ALLOW_INSECURE:+--insecure} "${url//http:/https:}")
    Error: Response from environment was something other than 200. Response returned was 502
    ```

- **Solution**: Review your edge hostname to ensure that it has been typed correctly. Also, ensure that your site has fully loaded up before requesting it. 

#### 10. `command.start` is failing 
If the `command.start` entry is failing, it can result in a 502 error.

- **Solution**: Comment out the `command:` and `start` lines in your `config.yaml`, then deploy. After deployment, SSH into the environment and copy-paste the command into the terminal to retrieve logs for further debugging.

## Site outage

If you can't access some part of your project, whether it's the live site, development environment, or Console,
check the [{{% vendor/name %}} status page](https://status.platform.sh/).
There you can see planned maintenance and subscribe to updates for any potential outages.

If the status is operational, [contact support](/learn/overview/get-support.md).

## Command not found

When you've added a command line tool (such as [Drush](/glossary.md#drush)),
you might encounter an error like the following:

```bash
-bash: drush: command not found
```

If you see this, add the command you want to run to your path
with a [`.environment` file script](/development/variables/set-variables.md#set-variables-via-script).

As a Linux or Unix-like operating system user (MacOS included),
to be able to run your scripts directly and quickly get past this error
you may need to run the `chmod +x {{< variable "YOUR_SCRIPT_FILE_NAME" >}}` command.

However, regardless of which operating system you're using,
it's best if you **don't rely on scripts having execute permissions**.
Instead, call the app/shell/runtime directly passing your script file to that executable.

## Missing commits

If you push code to {{% vendor/name %}} without the full Git history, sometimes commits are missing.
This can happen if you're pushing code from an external CI/CD pipeline, such as a GitHub action.
Such pipelines often do only shallow clones by default.

In such cases, your build might fail with an internal error.
Or you might see an error like `unexpected disconnect while reading sideband packet`.

To avoid the error, make sure you do a full clone of the repository before pushing code.
For example, for the [Checkout GitHub action](https://github.com/actions/checkout),
set `fetch-depth: 0` to clone the full history.
For GitLab, set clones to have a limit of `0` either in [repository settings](https://docs.gitlab.com/ee/ci/pipelines/settings.html#limit-the-number-of-changes-fetched-during-clone)
or using the [`GIT_DEPTH` variable](https://docs.gitlab.com/ee/user/project/repository/monorepos/index.html#shallow-cloning).

## Large JSON file upload failing

When trying to upload a large JSON file to your API, you might see a 400 response code (`Malformed request`).

{{% vendor/name %}} enforces a 10&nbsp;MB limit on files with the `application/json` `Content-Type` header.
To send large files, use the `multipart/form-data` header instead:

```bash
curl -XPOST 'https://example.com/graphql' --header 'Content-Type: multipart/form-data' --form file=large_file.json
```

## Databases

For MySQL specific errors, see how to [troubleshoot MySQL](../add-services/mysql/troubleshoot.md).

### Permission error creating a database

If you try to use a user to create a database, you get an error saying `permission denied to create database`.
The database is created for you and can be found in the `"SERVICE_NAME"_"PATH"` [service environment variable](/development/variables/_index.md#service-environment-variables),
or in the `path` key of the `PLATFORM_RELATIONSHIPS` [environment variable](/development/variables/use-variables.md#use-provided-variables).

## Storage

If you're having trouble with storage, see how to [troubleshoot mounts](../create-apps/troubleshoot-mounts.md) and [disks](../create-apps/troubleshoot-disks.md).

### Can't write to file system

If you attempt to write to disk outside a `build` hook, you may encounter a `read-only file system` error.
Except where you define it, the file system is all read-only, with code changes necessary through git.
This gives you benefits like repeatable deployments, consistent backups, and traceability.

To generate anything you need later, [write to disk during a `build` hook](/create-apps/app-reference/single-runtime-image.md#writable-directories-during-build).
Or [declare mounts](/create-apps/app-reference/single-runtime-image.md#mounts),
which are writable even during and after deploy.
They can be used for your data: file uploads, logs, and temporary files.

### {{% vendor/name %}} push fails due to lack of disk space

You might see the following message when attempting to run `{{% vendor/cli %}} push`:
`There isn't enough free space to complete the push`

This usually indicates that large files are present in the repository (where they shouldn't be).
Make sure that the paths for files like media files, dependencies, and databases are set to be ignored in your `.gitignore` file.

If large files are already in the repository, the open-source tool [bfg-repo-cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
can help in cleaning up the repository by purging older commits, removing unnecessary files, and more.

If none of these suggestions work, open a [support ticket](/learn/overview/get-support.md).

## Stuck build or deployment

If you see a build or deployment running longer than expected, it may be one of the following cases:

- The build is blocked by a process in your `build` hook.
- The deployment is blocked by a long-running process in your `deploy` hook.
- The deployment is blocked by a long-running cron job in the environment.
- The deployment is blocked by a long-running cron job in the parent environment.

To determine if your environment is being stuck in the build or the deployment, check your [activity log](../increase-observability/logs/access-logs.md#activity-logs).

If the activity has the result `success`, the build has completed successfully and the system is trying to deploy.
If the result is still `running`, the build is stuck.

In most regions, stuck builds terminate after one hour.

When a deployment is blocked, you should try the following:

1. Connect to your environment using [SSH](/development/ssh/_index.md).
2. Find any long-running cron jobs or deploy hooks on the environment by running `ps afx`.
3. Kill any long-running processes with `kill {{< variable "PID" >}}`.
  Replace `{{< variable "PID" >}}` with the process ID shown by `ps afx`.

If a `sync` of `activate` process is stuck, try the above on the parent environment.

Note that, for PHP apps,
you can [restart processes that get stuck during a build or deployment](../languages/php/troubleshoot.md#restart-php-processes-stuck-during-a-build-or-deployment)
from your app container.

## Slow or failing build or deployment

Builds can take long time or fail.
Most of the time, it's related to an application issue.
Here are a few tips that can help you find the exact cause.

### Check for errors in the logs

Invisible errors during the build and deploy phase can cause increased wait times, failed builds, and other problems.
Investigate [each log](../increase-observability/logs/access-logs.md#container-logs) and fix any errors you find.

### Build and deploy hooks

[`build` and `deploy` hooks](../create-apps/hooks/_index.md) can cause long build times.
If they run into issues, they can cause the build to fail or hang indefinitely.

`build` hooks can be tested in your local environment.
`deploy` hooks can be tested either locally
or by logging into the application over [SSH](/development/ssh/_index.md) and running them there.
Be careful not to test the scripts on production environments.

You can also test your hooks with these Linux commands to help debug issues:

```text
time {{< variable "YOUR_HOOK_COMMAND" >}} # Print execution time
strace -T {{< variable "YOUR_HOOK_COMMAND" >}} # Print a system call report
```

### Cron jobs

Containers can't be shutdown while long-running [cron jobs and scheduled tasks](/create-apps/app-reference/single-runtime-image.md#crons) are active.
That means long-running cron jobs block a container from being shut down to make way for a new deploy.

Make sure your custom cron jobs run quickly and properly.
Cron jobs may invoke other services in unexpected ways, which can increase execution time.

## Cache configuration

A common source of performance issues is a misconfigured cache.
The most common issue isn't allowing the right cookies as part of the router cache.

Some cookies, such as session cookies, need to be allowed.
Others, such as marketing and analytics cookies, usually shouldn't be part of the cache key.

See more about [router cache](../define-routes/cache.md)
and [cookie entry](../define-routes/cache.md#cookies).

Because the router cache follows cache headers from your app,
your app needs to send the correct `cache-control` header.

For static assets, set cache headers using the `expires` key in your [app configuration](/create-apps/app-reference/single-runtime-image.md#locations).

## Language-specific troubleshooting

For language-specific troubleshooting for your apps:

- [PHP](../languages/php/troubleshoot.md)
- [Node JS](../languages/nodejs/debug.md)
