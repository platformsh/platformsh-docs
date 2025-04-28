---
title: 500 error resolution guide
sidebarTitle: 500 error resolutions
weight: 16
description: Diagnose and resolve common 500 errors that may prevent your {{% vendor/name %}} app from starting or running correctly. 
---

{{< note >}}

If you'd like to learn more about troubleshooting your application, visit the [troubleshoot development](/development/troubleshoot/) page. 

{{< /note >}}

When deploying an application on {{% vendor/name %}}, it's essential that your app's startup process is correctly configured to ensure smooth operation. 

This guide provides a step-by-step approach to troubleshoot 500 errors related to your app not starting, crashing, or failing to connect to required services. 

### Step 1: Ensure your app's web start command is running

If you've configured a `web.command.start` in your `./upsun/config.yaml`, make sure:

-   It launches your app process reliably (e.g. `npm start`, `gunicorn` etc.)

-   It doesn't exit immediately or crash

-   **It binds to the port provided by the `PORT` [environment variable](/development/variables/use-variables.md#use-provided-variables)**

To confirm which port your app should bind to, run:

```bash
upsun ssh 'echo $PORT'
```

If your app is hardcoded to listen on a specific port like 3000 or 8000, it won't work --- it needs to use the dynamic port assigned by {{% vendor/name %}}.

To debug your start command, check the app log:

```bash
upsun log app
```
This often reveals stack traces, syntax errors, or missing dependencies that may be preventing the app from starting.

### Step 2: Check logs for troubleshooting insights

Beyond `app.log`, these additional logs are often helpful:

-   **Deploy logs**
These show what happened during build and deploy. You can view them by using the following command in terminal:

```bash
upsun log deploy
```
Deploy logs are especially helpful if you're running migrations or provisioning services - issues with database credentials, missing tables, or failed connections often appear here.

-   **All available logs**
To explore what's available, use the following command in terminal:

```bash
upsun log
```

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
Make sure the services are defined in `.platform/services.yaml` and linked correctly in your app configuration.

## Further resources

### Documentation

- [Troubleshooting](/development/troubleshoot/)
- [Use variables](/development/variables/use-variables.md#use-provided-variables)
- [Add services](/add-services/index)
- [Using the CLI tool](/administration/cli/index)
