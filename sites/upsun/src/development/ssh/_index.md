---
title: Connect securely with SSH
weight: 12
description: Keep your project and apps safe by connecting with SSH when you're interacting with your deployed environments or using the {{% vendor/name %}} CLI.
layout: single
keywords:
- 2fa
- twofactor
- two factor
- mfa
- multifactor authentication
sidebarTitle: Connect with SSH
---

When you interact with a deployed environment, you need to guard your connection against unauthorized access.
Use Secure Shell (SSH) to provide a secure channel.

You can securely log in to your deployed app to troubleshoot and read logs.
And create a tunnel to export data through.
And interact with your project through the CLI.
All secured through SSH.

## Connect to apps

To connect to an app securely with SSH, follow two steps.

### 1. Authenticate with the CLI

To authenticate with the CLI:

1. Install the [{{% vendor/name %}} CLI](/administration/cli/_index.md).
2. Run `{{% vendor/cli %}} login`.
3. In the open browser window, log in with your {{% vendor/name %}} account credentials.
   (This webpage is encrypted with [HTTPS](/define-routes/https.md), making it secure.)
4. Authorize the CLI to use your account.

A certificate gets stored in your local SSH configuration.
The certificate is automatically cycled every hour for a new certificate as long as your session is active.

If you are inactive for an extended period,
your certificate expires and you are asked to login again the next time you use a command that requires authentication.

You are now ready to run CLI commands and connect to an environment.

### 2. Connect to an app with SSH

To access an app in a given environment via the CLI, run the following command:

```bash
{{% vendor/cli %}} ssh --project {{< variable "PROJECT_ID" >}} --environment {{< variable "ENVIRONMENT_NAME" >}} --app {{< variable "APPLICATION_NAME" >}}
```

Replace each of <code>{{< variable "PROJECT_ID" >}}</code>, <code>{{< variable "ENVIRONMENT_NAME" >}}</code>, and <code>{{< variable "APPLICATION_NAME" >}}</code> with the values you want to access.
To find these values in the Console,
navigate to the environment you want to access and click **SSH** in the top right-hand corner.

Alternatively, just run `{{% vendor/cli %}} ssh` and select the values from each list presented to you.

Once you've connected, you get a welcome message detailing which environment you're connected to.

Now you can interact with the environment as you want.
Note that your app's file system is read-only,
except for any [mounts you've defined](/create-apps/app-reference/single-runtime-image.md#mounts).

## Connect to services

To connect to a service, you need the [service credentials](../../add-services/_index.md#connect-to-a-service).
Then you can connect either with a [direct tunnel](#use-a-direct-tunnel) or a [tunnel in your app](#use-an-app-tunnel).

### Use a direct tunnel

To open SSH tunnels for all of your services, run the following command:

```bash
{{% vendor/cli %}} tunnel:open
```

You get output similar to the following:

```bash
SSH tunnel opened to database at: http://127.0.0.1:30000

Logs are written to: ~/.{{% vendor/cli %}}/tunnels.log

List tunnels with: {{% vendor/cli %}} tunnels
View tunnel details with: {{% vendor/cli %}} tunnel:info
Close tunnels with: {{% vendor/cli %}} tunnel:close

Save encoded tunnel details to the PLATFORM_RELATIONSHIPS variable using:
  export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
```

Use the returned host (in this case `http://127.0.0.1:30000`) for your connection
and fill in the details with the rest of your [service credentials](../../add-services/_index.md#connect-to-a-service).

The `tunnel:open` command connects all relationships defined in your [app configuration](../../create-apps/_index.md).

To open only one connection when you have multiple relationships defined, run `tunnel:single`.
By default, this opens a tunnel at `http://127.0.0.1:30000`.
You can specify the port for the connection using the `--port` flag.

### Use an app tunnel

Many database applications (such as MySQL Workbench) support establishing their own SSH tunnel.
You need to use [SSH keys](./ssh-keys.md) for authentication.
Consult the documentation for your application for how to enter SSH credentials.

#### Get SSH connection details

To get the host and username for connections, follow these steps:

{{< codetabs >}}

+++
title=Using the CLI
+++

Run the following command:

```bash
{{% vendor/cli %}} ssh --pipe --project {{< variable "PROJECT_ID" >}}
```

You get output similar to the following:

```bash
jyu7waly36ncj-main-7rqtwti--app@ssh.us.{{< vendor/urlraw "host" >}}
```

<--->

+++
title=In the Console
+++

1. Navigate to the environment you want to connect to.
2. Click **SSH** in the top right-hand corner.
3. You get output similar to the following:</br>
   `jyu7waly36ncj-main-7rqtwti--app@ssh.us.{{< vendor/urlraw "host" >}}`

{{< /codetabs >}}

The host is everything after the `@` and the username is what's before it.
In this case, the host is `ssh.us.{{< vendor/urlraw "host" >}}` and the username is `jyu7waly36ncj-main-7rqtwti--app`.
The host is the same for the entire project, while the username varies by environment.

To connect to a service, fill in the details with the rest of your [service credentials](../../add-services/_index.md#connect-to-a-service).

## Alternative authentication methods

There are three basic ways to authenticate with {{% vendor/name %}}:

* [Through the CLI](#1-authenticate-with-the-cli)
  * The fastest and easiest method.
  * Supports multifactor authentication.
  * Automatically generates new certificates to keep your connection safe.
  * Necessary when using the CLI and when your organization has multifactor authentication set up.
* [Using SSH keys](./ssh-keys.md)
  * Requires more setup on your part.
  * Represents only a single authentication method.
  * Requires you to regularly change the keys to maintain security.
  * Useful for checking out code as part of an automated process.
* [Using API tokens](../../administration/cli/api-tokens.md)
  * Good for letting automation tools use the CLI.
  * Requires you to regularly change the tokens to maintain security.

## SSH into an MFA-protected environment

For enhanced security, as an organization owner or admin user,
you can [enforce Multi-Factor Authentication (MFA) within your organization](/administration/mfa.md#enforce-mfa-within-your-organization).

As a project contributor, if you haven't enabled MFA on your user account and SSH into an environment that is protected by MFA,
you get an error message. See how you can [troubleshoot that error message](/development/ssh/troubleshoot-ssh.md#mfa-related-error-message).