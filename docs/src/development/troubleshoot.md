---
title: Troubleshoot development
sidebarTitle: Troubleshoot
weight: 16
description: See some common solutions to issues you might run into in development.
---

## Common tasks

### Force a redeploy

There are times where you might want to trigger a redeployment of your application,
such as to update environment access for a new developer or add custom TLS certificates.
A redeploy reuses your built app and services.

To trigger a redeploy, follow these steps:

{{< codetabs >}}

---
title=In the Console
file=none
highlight=false
---

- Select the project with the given environment.
- From the **Environment** menu, select the environment.
- Click {{< icon more >}} **More**.
- Click **Redeploy**.

<--->

---
title=Using the CLI
file=none
highlight=false
---

Run the following command:

```sh
platform redeploy
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

### Manually trigger builds

To increase performance and keep applications the same across environments,
Platform.sh reuses built applications if its code and build time configuration (variables and such) remain the same.

There may be times where you want to force your application to be built again without changing its code,
for example to test an issue in a build hook or when external dependencies change.
To force a rebuild without changing the code,
use an [environment variable](./variables/set-variables.md#create-environment-specific-variables).

Assuming you want to do this for your `main` environment,
first create a `REBUILD_DATE` environment variable:

```bash
platform variable:create -l environment -e main --prefix env: --name REBUILD_DATE --value "$(date)" --visible-build true
```

This triggers a build right away to propagate the variable.
To force a rebuild at any time, update the variable with a new value:

```bash
platform variable:update -e main --value "$(date)" "env:REBUILD_DATE"
```

This forces your application to be built even if no code has changed.

### Clear the build cache

You may find that you need to clear the build cache,
such as when it's grown too big or, in rare circumstances, when it's corrupted.
It may get corrupted when code is downloaded from a third-party language service like Packagist or npm
while that service is experiencing issues.

To clear the build cache, run the following command:

```sh
platform project:clear-build-cache -p <PROJECT_ID>
```

The next build for each environment is likely to take longer as the cache rebuilds.

## Access denied or permission denied

In most cases, issues accessing a project are caused by missing permissions for a given user.
For more information see how to [manage user permissions](../administration/users.md).

If you are using the CLI, make sure that [you are authenticated](../administration/cli/_index.md#2-authenticate).

If you are using SSH, see how to [troubleshoot SSH access](../development/ssh/troubleshoot-ssh.md).

## HTTP responses 502 Bad Gateway or 503 Service Unavailable

If you see these errors when accessing your application,
it indicates your application is crashing or unavailable.

Typical causes and potential solutions include:

* Your app is listening at the wrong place.
  * Check your app's [upstream properties](../create-apps/app-reference.md#upstream).
  * If your app listening at a port, make sure it's using the [`PORT` environment variable](./variables/use-variables.md#use-platformsh-provided-variables).
* Your `.platform.app.yaml` configuration has an error and a process isn't starting
  or requests can't be forwarded to it correctly.
  * Check your `web.commands.start` entry or your `passthru` configuration.
* The amount of traffic coming to your site exceeds the processing power of your application.
  * You may want to [check if bots are overwhelming your site](https://community.platform.sh/t/diagnosing-and-resolving-issues-with-excessive-bot-access/792).
  * Alternatively, you may need to [increase your plan size](../administration/pricing/_index.md).
* Certain code paths in your application are too slow and timing out.
  * Check your code is running smoothly.
  * Consider adding an [observability solution](../increase-observability/integrate-observability/_index.md) to get a better view of your application.
* A PHP process is crashing because of a segmentation fault.
  * See [how to deal with crashed processes](../languages/php/troubleshoot.md#php-process-crashed).
* A PHP process is killed by the kernel out-of-memory killer.
  * See [how to deal with killed processes](../languages/php/troubleshoot.md#php-process-is-killed).

## Site outage

If you can't access some part of your project, whether it's the live site, development environment, or Console,
check the [Platform.sh status page](https://status.platform.sh/).
There you can see planned maintenance and subscribe to updates for any potential outages.

If the status is operational, [contact support](../overview/get-support.md).

## Command not found

When you've added a command line tool (such as [Drush](../other/glossary.md#drush)),
you might encounter an error like the following:

```bash
-bash: <COMMAND_NAME>: command not found
```

If you see this, add the command to your path with a [`.environment` file script](./variables/set-variables.md#set-variables-via-script).

## Missing commits

If you push code to Platform.sh without the full Git history, sometimes commits are missing.
This can happen if you're pushing code from an external CI/CD pipeline, such as a GitHub action.
Such pipelines often do only shallow clones by default.

In such cases, your build might fail with an internal error.
Or you might see an error like `unexpected disconnect while reading sideband packet`.

To avoid the error, make sure you do a full clone of the repository before pushing code.
For example, for the [Checkout GitHub action](https://github.com/actions/checkout),
set `fetch-depth: 0` to clone the full history.
For GitLab, set clones to have a limit of `0` either in [repository settings](https://docs.gitlab.com/ee/ci/pipelines/settings.html#limit-the-number-of-changes-fetched-during-clone)
or using the [`GIT_DEPTH` variable](https://docs.gitlab.com/ee/ci/large_repositories/index.html#shallow-cloning).

## Large JSON file upload failing

When trying to upload a large JSON file to your API, you might see a 400 response code (`Malformed request`).

Platform.sh enforces a 10&nbsp;MB limit on files with the `application/json` `Content-Type` header.
To send large files, use the `multipart/form-data` header instead:

```bash
$ curl -XPOST 'https://example.com/graphql' --header 'Content-Type: multipart/form-data' -F file=large_file.json
```

## Databases

For MySQL specific errors, see how to [troubleshoot MySQL](../add-services/mysql/troubleshoot.md).

### Permission error creating a database

If you try to use a user to create a database, you get an error saying `permission denied to create database`.
The database is created for you
and can be found in the `path` key of the `$PLATFORM_RELATIONSHIPS` [environment variable](./variables/use-variables.md#use-platformsh-provided-variables).

## Storage

If you're having trouble with storage, see how to [troubleshoot mounts](../create-apps/troubleshoot-mounts.md) and [disks](../create-apps/troubleshoot-disks.md).

### Can't write to file system

If you attempt to write to disk outside a `build` hook, you may encounter a `read-only file system` error.
Except where you define it, the file system is all read-only, with code changes necessary through git.
This gives you benefits like repeatable deployments, consistent backups, and traceability.

To generate anything you need later, [write to disk during a `build` hook](../create-apps/app-reference.md#writable-directories-during-build).
Or [declare mounts](../create-apps/app-reference.md#mounts),
which are writable even during and after deploy.
They can be used for your data: file uploads, logs, and temporary files.

### Git push fails due to lack of disk space

You might see the following message when attempting to run `git push`:
`There isn't enough free space to complete the push`

This usually indicates that large files are present in the repository (where they shouldn't be).
Make sure that the paths for files like media files, dependencies, and databases are set to be ignored in your `.gitignore` file.

If large files are already in the repository, the open-source tool [bfg-repo-cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
can assist in cleaning up the repository by purging older commits, removing unnecessary files, and more.

If none of these suggestions work, create a [support ticket](https://console.platform.sh/-/users/~/tickets/open).

## Stuck build or deployment

If you see a build or deployment running longer than expected, it may be one of the following cases:

* The build is blocked by a process in your `build` hook.
* The deployment is blocked by a long running process in your `deploy` hook.
* The deployment is blocked by a long running cron job in the environment.
* The deployment is blocked by a long running cron job in the parent environment.

To determine if your environment is being stuck in the build or the deployment, check your [activity log](../increase-observability/logs/access-logs.md#activity-logs).

If the activity has the result `success`, the build has completed successfully and the system is trying to deploy.
If the result is still `running`, the build is stuck.

In most regions, stuck builds terminate after one hour.
To have the build killed in [legacy regions](./regions.md#legacy-regions), create a [support ticket](https://console.platform.sh/-/users/~/tickets/open).

When a _deployment_ is blocked, you should try the following:

1. Connect to your environment using [SSH](./ssh/_index.md).
2. Find any long-running cron jobs or deploy hooks on the environment by running `ps afx`.
3. Kill any long running processes with `kill <PID>`.
  Replace `<PID>` with the process ID shown by `ps afx`.

If a `sync` of `activate` process is stuck, try the above on the parent environment.

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
or by logging into the application over [SSH](./ssh/_index.md) and running them there.
Be careful not to test the scripts on production environments.

You can also test your hooks with these Linux commands to help debug issues:

```text
time $cmd # Print execution time
strace -T $cmd # Print a system call report
```

### Cron jobs

Containers can't be shutdown while long-running [cron jobs and scheduled tasks](../create-apps/app-reference.md#crons) are active.
That means long-running cron jobs block a container from being shut down to make way for a new deploy.

Make sure your custom cron jobs run quickly and properly.
Cron jobs may invoke other services in unexpected ways, which can increase execution time.

## Language-specific troubleshooting

For language-specific troubleshooting for your apps:

- [PHP](../languages/php/troubleshoot.md)
- [Node JS](../languages/nodejs/debug.md)
