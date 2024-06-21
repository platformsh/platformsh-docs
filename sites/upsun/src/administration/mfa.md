---
title: Multi-Factor Authentication (MFA)
weight: 4
keywords: 
- 2fa
- twofactor
- two factor
- mfa
- multifactor authentication
description: Enhance security within your organization by enforcing MFA over SSH and the {{% vendor/name %}} API.
---

{{< partial "user-mgt-sellable/body.md" >}}

To enhance security, you can [enforce MFA within your organization](#within-your-organization).
This provides an extra layer of protection for connections made through both SSH and the {{% vendor/name %}} API.

When MFA is enforced within an organization, every project contributor must [enable MFA on their user account](#on-your-user-account) to perform the following actions:

- Run Git commands
- SSH in an environment
- Connect through the {{% vendor/name %}} API, to trigger a Console or CLI action for example

## Enable MFA

### Within your organization

As an admin user, to enable MFA, follow these steps:

1. In the Console, open the user menu (your name or profile picture).
2. Click **My profile**
3. Click **Security**.
4. 
5. 

### On your user account

To establish a successful connection to an environment within an organization that enforces MFA,
you need to enable MFA on your user account.

Otherwise, connection attempts will result in error messages such as the following ones:

```bash
Error: The service doesn't exist or you do not have access to it.
Service: abcdefg123456-main-bvxea6i--app
User: {{< variable "USER NAME" >}} ({{< variable "USER ID" >}})
```

```bash
Error: Access denied
Service: abcdefg123456-main-bvxea6i--app
User: {{< variable "USER NAME" >}} ({{< variable "USER ID" >}})
Parameters: {"amr":["mfa","sso:acme"]}
Detail: Additional authentication is required:
	 - Multi-factor authentication (MFA)
	 - Single sign-on (SSO), provider: "acme"
```

To enable MFA on your user account, follow these steps:

{{< codetabs >}}
+++
title=Using the CLI
+++

Log in using the browser by running `{{% vendor/cli %}} login`.

<--->

+++
title=In the Console
+++

1. In the Console, open the user menu (your name or profile picture).
2. Click **My profile**
3. Click **Security**.
4. Click **Set up application**.
5. Follow the instructions for the chosen authentication app.
6. Click **Verify & save**.
7. Refresh your SSH credentials by running `{{% vendor/cli %}} login -f` in the CLI.

{{< /codetabs >}}

