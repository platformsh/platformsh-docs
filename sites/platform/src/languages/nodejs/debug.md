---
title: "Debugging"
weight: 1
---

{{% composable/disclaimer %}}

Effectively debugging web apps takes effort,
especially when an HTTP request goes through multiple layers before reaching your web app.
Follow the steps below to debug a specific app.

You can choose to debug in an environment deployed to {{% vendor/name %}}
or with your app running locally but connected to deployed services.
In either case, make sure to debug in a preview environment.

For more general information, see how to [troubleshoot development](/development/troubleshoot).

## 1. Create a new environment

Start by creating a new environment completely isolated from production but with the same data for debugging:

```bash
{{% vendor/cli %}} branch debug-branch
```

## 2. Get access

{{< codetabs >}}

+++
title=Remote
+++

Access your app container via [SSH](../../development/ssh/_index.md):

```bash
{{% vendor/cli %}} ssh
```

<--->

+++
title=Local
+++

To access deployed apps and services, open tunnels to everything your app has relationships with:

```bash
{{% vendor/cli %}} tunnel:open
```

In the same terminal, set the relevant environment variables:

```bash
export PLATFORM_RELATIONSHIPS="$({{% vendor/cli %}} tunnel:info --encode)"
export PORT=8888
```

{{< /codetabs >}}


## 3. Run your app in inspect mode

{{< codetabs >}}

+++
title=Remote
+++

Stop the current process and restart it in inspect mode:

```bash
sv stop app
node --inspect <START_FILE>
```

<--->

+++
title=Local
+++

In the same terminal as the previous step, run the following command:

```bash
node --inspect <START_FILE>
```

{{< /codetabs >}}


Replace `<START_FILE>` with the file defined for [your app's `start` command](./_index.md#4-start-your-app).

You get output something like this:

```bash
Debugger listening on ws://127.0.0.1:9229/10701e5d-d627-4180-a967-d47a924c93c0
For help, see: https://nodejs.org/en/docs/inspector
Listening on port 8888
```

## 4. (If debugging remotely) Forward the debugger port locally

In another terminal, create an SSH tunnel that forwards to the 9229 port:

```bash
ssh -N -L 9229:localhost:9229 $({{% vendor/cli %}} ssh --pipe)
```

## 5. Connect the debugger

You can now connect the debugger as if you were debugging a local application.
See examples with some common tools:

{{< codetabs >}}

+++
title=Using Chrome developer tools
+++

Go to `chrome://inspect`.
Find your running app under the `Remote Target` list.
Click **inspect** to start the debugger.

<--->

+++
title=Using Visual Studio Code
+++

Use the `Node.js: Attach` debugger option.

If you haven't created the option:

1. On the **Run and Debug** tab, click `create a launch.json file`.
2. Select `Node.js` as the environment.
3. In the `configurations` array, start IntelliSense (usually <kbd>ctrl</kbd>+<kbd>space</kbd>).
4. Select `Node.js: Attach`.
5. Make sure the port is the same as in [step 4 above](#4-if-debugging-remotely-forward-the-debugger-port-locally).

Once you have the option:

In the **Run and Debug** tab, select `Attach` from the menu and click **Start Debugging** (the green arrow).

See more on [Node.js debugging in Visual Studio Code](https://code.visualstudio.com/docs/nodejs/nodejs-debugging).

{{< /codetabs >}}

Now when you load the site at your deployed URL (if debugging remote) or localhost (if debugging locally),
the local debugger you've attached is called.

Set breakpoints:

{{< codetabs >}}

+++
title=Remote
+++

In the JavaScript files from your remote site:
On the **Run and Debug** tab under **Loaded Scripts** find `Attach: Remote Process` > `/app`.

<--->

+++
title=Local
+++

Directly in your source files.

{{< /codetabs >}}


## Other issues

### pm2 process manager blocks other processes

If you're using the [`pm2` process manager](https://github.com/unitech/pm2) to start your app from a script,
you might find it daemonizes itself and blocks other processes (such as backups) by constantly respawning.
This may happen even if you use the `--no-daemon` flag.

Instead of using a script, call `pm2 start` directly in your [`start` command](./_index.md#4-start-your-app).
