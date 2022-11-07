---
title: Connect securely with SSH
weight: 12
description: Keep your project and apps safe by connecting with SSH when you're interacting with your deployed environments or using the Platform.sh CLI.
layout: single
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

### 1. Authenticate with the Platform.sh CLI

To authenticate with the CLI:

1. Install the [Platform.sh CLI](/administration/cli/_index.md).
1. Run `platform login`.
1. In the open browser window, log in with your Platform.sh account credentials.
   (This webpage is encrypted with HTTPS [HTTP over TLS], making it secure.)
1. Authorize the CLI to use your account.

A certificate gets stored in your local SSH configuration.
The certificate is automatically cycled every hour for a new certificate as long as your session is active.

If you are inactive for an extended period,
your certificate expires and you are asked to login again the next time you use a command that requires authentication.

You are now ready to run CLI commands and connect to an environment.

### 2. Connect to an app with SSH

To access an app in a given environment via the CLI, run the following command:

```bash
platform ssh -p <PROJECT_ID> -e <ENVIRONMENT_NAME> -A <APPLICATION_NAME>
```

Replace each of `<PROJECT_ID>`, `<ENVIRONMENT_NAME>`, and `<APPLICATION_NAME>` with the values you want to access.

Alternatively, just run `platform ssh` and select the values from each list presented to you.

Once you've connected, you get a response like this:

```bash
   ___ _      _    __
  | _ \ |__ _| |_ / _|___ _ _ _ __
  |  _/ / _` |  _|  _/ _ \ '_| '  \
  |_| |_\__,_|\__|_| \___/_| |_|_|_|

 Welcome to Platform.

 This is environment main
 of project wk5fqz6qoo123.

web@wk5fqz6qoo123-main--php:~$
```

Now you can interact with the environment as you want.

## Connect to services

To connect to a service, you need the [service credentials](../../add-services/_index.md#1-obtain-service-credentials).
Then you can connect either with a [direct tunnel](#use-a-direct-tunnel) or a [tunnel in your app](#use-an-app-tunnel).

### Use a direct tunnel

To open SSH tunnels for all of your services, use the Platform.sh CLI:

```bash
$ platform tunnel:open
SSH tunnel opened to database at: http://127.0.0.1:30000

Logs are written to: ~/.platformsh/tunnels.log

List tunnels with: platform tunnels
View tunnel details with: platform tunnel:info
Close tunnels with: platform tunnel:close

Save encoded tunnel details to the PLATFORM_RELATIONSHIPS variable using:
  export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
```

Use the returned host (in this case `http://127.0.0.1:30000`) for your connection
and fill in the details with the rest of your [service credentials](../../add-services/_index.md#1-obtain-service-credentials).

The `tunnel:open` command connects all relationships defined in your [app configuration](../../create-apps/_index.md).
To open only one connection when you have multiple relationships defined, run `tunnel:single`.

### Use an app tunnel

Many database applications (such as MySQL Workbench) support establishing their own SSH tunnel.
You need to use [SSH keys](./ssh-keys.md) for authentication.
Consult the documentation for your application for how to enter SSH credentials.

#### Get SSH connection details

To get the host and username for connections, run the following command
(replacing `<PROJECT_ID>` and `<ENVIRONMENT_NAME>` with appropriate values):

```bash
$ platform ssh --pipe -p <PROJECT_ID> -e <ENVIRONMENT_NAME>
jyu7waly36ncj-main-7rqtwti--app@ssh.us.platform.sh
```

The host is everything after the `@` and the username is what's before it.
In this case, the host is `ssh.us.platform.sh` and the username is `jyu7waly36ncj-main-7rqtwti--app`.
The host is the same for the entire project, while the username varies by environment.

To connect to a service, fill in the details with the rest of your [service credentials](../../add-services/_index.md#1-obtain-service-credentials).

## Alternative authentication methods

There are three basic ways to authenticate with Platform.sh:

* [Through the CLI](#1-authenticate-with-the-platformsh-cli)
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

## Multifactor authentication (MFA) over SSH

{{< premium-features/tiered "Enterprise and Elite" >}}

To enhance security, Enterprise and Elite customers can enforce MFA over SSH within their organization.
When this is enabled, every project contributor within your organization must enable MFA in their account
to run Git commands or to SSH in an environment.
To enable this feature, open a support ticket and request for MFA over SSH to be enforced within your organization.

If you have trouble accessing an environment with MFA enabled, see how to [add a second factor](./troubleshoot-ssh.md#add-a-second-authentication-factor).
