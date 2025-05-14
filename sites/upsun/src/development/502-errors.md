---
title: 502 error resolution guide
sidebarTitle: 502 error resolutions
weight: 16
description: Diagnose and resolve common 502 errors that may prevent your {{% vendor/name %}} app from starting or running correctly. 
---

{{< note >}}

If you'd like to learn more about troubleshooting your application, visit the [troubleshoot development](/development/troubleshoot/) page. 

{{< /note >}}

When deploying an application on {{% vendor/name %}}, it's essential that your app's startup process is correctly configured to ensure smooth operation. 

This guide provides a step-by-step approach to troubleshoot 500 errors related to your app not starting, crashing, or failing to connect to required services. 

### Step 1: Check logs for troubleshooting insights

You can start your troubleshooting process by looking into some of the logs listed below:

-   **Deploy logs**

These show what happened during build and deploy. You can view them by using the following command in terminal:

```bash
upsun log deploy
```
Deploy logs are especially helpful if you're running migrations or provisioning services - issues with database credentials, missing tables, or failed connections often appear here.

- **App logs**

The app log can be particularly useful for debugging your start command. To gain insight into what might be going wrong with your app in particular, use the following command in terminal:

```bash
upsun log app
```
This log often reveals stack traces, syntax errors, or missing dependencies that may be preventing the app from starting.

-   **All available logs**

To explore what other logs are available to help with troubleshooting, use the following command in terminal:

```bash
upsun log
```
### Step 2: Ensure your app's web start command is running

If you've configured a `web.command.start` in your `./upsun/config.yaml`, make sure:

-   It launches your app process reliably (e.g. `npm start`, `gunicorn` etc.)

-   It doesn't exit immediately or crash

-   **It binds to the port provided by the `PORT` [environment variable](/development/variables/use-variables.md#use-provided-variables)**

To confirm which port your app should bind to, run:

```bash
upsun ssh 'echo $PORT'
```
If your app is hardcoded to listen on a specific port like 3000 or 8000, it won't work --- it needs to use the dynamic port assigned by {{% vendor/name %}}. It should also be noted that **this command can only be run in a local session**, not in the app container (in a terminal session).

{{< note >}}

Please note that if the [$PORT](/development/variables/use-variables.html#use-provided-variables) is empty, you will need to check if `web.upstream.socket_family`is set to `tcp`. 

You may see a 502 error if your application isn’t [listening at the same place](/create-apps/app-reference/single-runtime-image.html#where-to-listen) that the runtime is sending requests.  

{{< /note >}}

### Step 3: Review recent activity

Use the Console or [CLI](/administration/cli/index) to inspect recent deploys and other operations:

-   In the **Console**, go to your environment view and **select an activity to review**.

-   Or, in the CLI:

```bash
upsun activity:log     # View the most recent log
upsun activity:list    # See a list of recent activities`
```
Look for failed steps, timeouts, or warnings.

### Step 4: SSH into the running container

If the logs aren't telling the full story, you can directly inspect your running environment with this command:

```bash
upsun ssh
```
This is especially useful for:

-   Viewing log files created by your app that aren't exposed via the `{{% vendor/name %}} log`
-   Checking if writable directories are correctly mounted
-   Testing internal service connections and inspecting the filesystem

{{< note title="Bonus step" theme="info" >}}

You can also manually run your `start` command to debug why your app might be failing. This is because some output about issues in standard output (`stdout`) don't always appear in the logs. 

{{< /note >}}

To confirm mount points are correctly defined and available, run:

```bash
upsun mount:list
```
This lists all writable mounts available in your environment and their paths.

### Step 5: Verify service connectivity

If your app uses [databases or other services](/add-services/index), make sure it can reach them from within the container with the command below:

```bash
ping database.internal
psql $DATABASE_URL
```
Make sure the services are defined in `.upsun/config.yaml`,`services`, the top level key and linked correctly in your app configuration.

## Further resources

- [Troubleshooting](/development/troubleshoot/)
- [Use variables](/development/variables/use-variables.md#use-provided-variables)
- [Add services](/add-services/index)
- [Using the CLI tool](/administration/cli/index)
