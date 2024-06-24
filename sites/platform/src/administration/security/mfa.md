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
banner: 
    type: tiered-feature
---

To enhance security, you can [enforce MFA within your organization](#within-your-organization).
This provides an extra layer of protection for connections made through both SSH and the {{% vendor/name %}} API.

When MFA is enforced, every project contributor must [enable MFA for their user account](#for-your-user-account) to run Git commands, SSH into an environment, and connect to the organization through the {{% vendor/name %}} API (for example, to trigger a Console or CLI action).

## Enable MFA

### Within your organization

As an **admin user**, to enable MFA, open a [support ticket](/learn/overview/get-support)
and request for MFA over SSH and API to be enforced within your organization.

### For your user account

As a project contributor, you **must** enable MFA for your user account so you can:

- Access an organization that enforces MFA in the Console
- Successfully connect to environments in that organization via SSH or the {{% vendor/name %}} API

To enable MFA for your user account, follow these steps:

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

## Troubleshoot MFA-related error messages

If you haven't enabled MFA for your user account and try to SSH into an environment that is protected by MFA,
you get an error message similar to the following ones:

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

To solve this, [enable MFA for your user account](#for-your-user-account).

Alternatively, open the Console and select the desired organization.
Follow the instructions so you can effectively access its contents.