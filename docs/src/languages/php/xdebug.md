---
title: "Using Xdebug"
weight: 6
sidebarTitle: "Xdebug"
---

[Xdebug](https://xdebug.org/) is a real-time debugger extension for PHP.
While usually used for local development, it can also be helpful for debugging aberrant behavior on the server.
It's available on Platform.sh Grid instances running PHP 7.2 and higher.

As configured on Platform.sh, it avoids any runtime overhead for non-debug requests, even in production, and only allows connections via SSH tunnels to avoid any security issues.

Note Xdebug runs only on your app containers.
So you can't use it for [worker containers](../../create-apps/workers.md).

## Before you begin

You need to have:

- PHP 7.2+ on your project
- The Platform.sh [CLI](../../administration/cli/_index.md)
- A Xdebug-compatible IDE installed on your machine

    For setup instructions, consult your IDE's Xdebug documentation.
  Optionally, you can use [PHPStorm](https://www.jetbrains.com/phpstorm/), for which detailed instructions are provided.

## 1. Set up Xdebug

Xdebug runs as a second PHP-FPM process used only for debugging requests, leaving the normal process unaffected.

To enable Xdebug, add the following to your [app configuration](../../create-apps/app-reference.md):

```yaml {location=".platform.app.yaml"}
runtime:
    xdebug:
        idekey: PHPSTORM
```

The `idekey` value can be any arbitrary alphanumeric string.

When that key is defined, Platform.sh starts a second PHP-FPM process on the container that's identically configured but also has Xdebug enabled.
Only incoming requests that have an Xdebug cookie or query parameter set are forwarded to the debug PHP-FPM process.
All other requests are directed to the normal PHP-FPM process and thus have no performance impact.

If you have enabled the [router cache](../../define-routes/cache.md),
you need to explicitly add the Xdebug cookie (`XDEBUG_SESSION`) to the cookie allowlist.
Depending on the cookies already listed, the result should look similar to the following:

```yaml {location=".platform/routes.yaml"}
"https://{default}/":
    # ...
    cache:
        enabled: true
        cookies: ['/^SS?ESS/', 'XDEBUG_SESSION']
```

Xdebug has several configuration options available.
They can be set the same way as any other [PHP setting](./_index.md#php-settings).
For a full list of available options, consult the [Xdebug documentation](https://xdebug.org/docs/).

## 2. Use Xdebug

### Open a tunnel

From a local checkout of your app,
run `platform environment:xdebug` (or just `platform xdebug`) to open an SSH tunnel to the server.
That SSH tunnel allows your IDE and the server to communicate debug information securely.

By default, Xdebug operates on port `9003`.
Generally, it's best to configure your IDE to use that port.
To use an alternate port, use the `--port` flag.

To close the tunnel and terminate the debug connection, press <kbd>Ctrl</kbd> + <kbd>C</kbd>.

{{< note title="On {{% names/dedicated-gen-3 %}}" >}}
Note that because you have several virtual machines running but your tunnel is connected to only one of them,
your requests don't always reach the same host.
{{< /note >}}

### Install an Xdebug helper

While Xdebug can be triggered from the browser by adding a special query parameter, the preferred way is to use a browser plugin helper.
Helpers are available for [Firefox](https://addons.mozilla.org/en-US/firefox/addon/xdebug-helper-for-firefox/)
and [Chrome](https://chrome.google.com/webstore/detail/xdebug-helper/eadndfjplgieldjbigjakmdgkmoaaaoc).
Their respective plugin pages document how to trigger them when needed.

## 3. Optional: Use PHPStorm

The configuration for Xdebug is slightly different for each IDE.
The configuration instructions are for PHPStorm/IntelliJ due to its popularity in the PHP ecosystem.

### 1. Configure Xdebug

In your PHPStorm Settings window, go to **Languages & Frameworks** > **PHP** > **Debug**.

Ensure that the **Debug port** is set to the expected value (`9003`, or whatever you want to use in the `--port` flag)
and that **Can accept external connections** is checked.
Other settings are at your discretion.

![Xdebug configuration screen](/images/xdebug/xdebug-settings.png "0.6")

### 2. Configure a server

In your PHPStorm Settings window, go to **Languages & Frameworks** > **PHP** > **Servers**.

Add a new server for your Platform.sh environment.
The **Host** should be the hostname of the environment on Platform.sh you are debugging.
The **Port** should always be `443` and the **Debugger** set to `Xdebug`.
Ensure that **Use path mappings** is selected,
which makes available a tree of your project with a column to configure the remote path that it should map to.

This page lets you define what remote paths on the server correspond to what path on your local machine.
In the majority of cases you can just define [your app root](../../create-apps/app-reference.md#root-directory)
to map to `app`, as in the example below.

![PHP server configuration](/images/xdebug/xdebug-servers.png "0.6")

{{< note >}}
It may be easier to allow the debug process to connect once, allow it to fail,
and then select **Configure server mappings**.
That pre-populates most of the fields in this page and only requires you to set the `app` root mapping.
{{< /note >}}

### 3. Listen for connections

Toggle on PHPStorm's Xdebug listener.
Either select **Run** > **Start listening for PHP debug connections** from the menu
or click the ![Listen for connections](/images/xdebug/xdebug-phpstorm-not-listening.png "0.025-inline") button in the toolbar.

To disable PHPStorm's listener, either select **Run** > **Stop listening for PHP debug connections** from the menu or toggle the ![Stop listening for connections](/images/xdebug/xdebug-phpstorm-listening.png "0.025-inline") icon in the toolbar.

### 4. Start debugging

While in listen mode, start the `platform xdebug` tunnel.
Use the Xdebug helper plugin for your browser to enable debugging.
Set a break point in your app, then load a page in your browser.
The request should pause at the break point and allow you to examine the running app.
