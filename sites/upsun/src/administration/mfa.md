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

When MFA is enforced within an organization, every project contributor must [enable MFA for their user account](#for-your-user-account) to run Git commands, SSH into an environment, and connect through the {{% vendor/name %}} API (to trigger a Console or CLI action for example).

## Enable MFA

### For your user account

{{< note theme="warning" title="Warning">}}

Enabling MFA for your user account is mandatory for:

- Organization owners or admin users to [enforce MFA within a whole organization](#within-your-organization)
- Project contributors to access an organization that enforces MFA in the Console,
  and to establish successful connections to environments within that organization via SSH or the {{% vendor/name %}} API

{{< /note >}}

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

### Within your organization

{{< note theme="info" title="Access permissions">}}

As an organization owner or admin user, you are authorized to enable MFA within your organization.
However, you **must** [enable MFA for your user account](#for-your-user-account) prior to enforcing it within the whole organization.

{{< /note >}}

To enable MFA within your organization, follow these steps:

1. In the Console, open the user menu (your name or profile picture).
2. Click **Settings**.
3. Click **Security**.
4. In the **MFA required** area, set the **Enable** toggle on.

Under **User security settings**, you can view which users in your organization have [activated MFA for their user accounts](#for-your-user-account).

#### Send reminders

You can send email reminders to user who haven't enabled MFA for their user account yet.
To do so, follow these steps:

1. In the Console, open the user menu (your name or profile picture).
2. Click **Settings**.
3. Click **Security**.
4. In the **User security settings** area, find the user you want to send a reminder to.
5. Click **{{< icon more >}} More** next to that user.
6. Select **Remind**.</br>
   An email is sent to the user with instructions on how to enable MFA for their user account.

{{< note >}}

You can send reminders to multiple users at once.
To do so, in the **User security settings** user list,
select the desired users by checking the boxes in front of their names.
Click **Remind** at the top of the list to trigger the reminder emails.

{{< /note >}}

## Troubleshoot MFA-related error messages

As a project contributor, if you SSH into an environment that is protected by MFA but haven't enabled MFA for your user account,
you get error messages such as the following:

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