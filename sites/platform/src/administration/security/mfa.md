---
title: Multifactor Authentication (MFA)
weight: 4
keywords: 
- 2fa
- twofactor
- two factor
- mfa
- multifactor authentication
description: Enhance your organizations' security with Multifactor Authentication (MFA).
---

Multifactor Authentication (MFA) enhances security by protecting both your organization and every user account that interacts with it
through SSH or the {{% vendor/name %}} API.

When MFA is enforced within an organization, every project contributor **must** enable MFA on their user account so they can run Git commands,
SSH into an environment, or trigger actions through the {{% vendor/name %}} API.

## Enable MFA on your user account

To access an organization that enforces MFA or any of its projects,
you **must** enable MFA on your user account.
Failure to do so results in forbidden access to the organization from the Console or API,
and an [error message](/development/ssh/troubleshoot-ssh.md#mfa-related-error-message) when trying to SSH into its environments.

To enable MFA on your user account, follow these steps:

1. In the Console, open the user menu (your name or profile picture).
2. Click **My profile**
4. Click **Authentication settings**.
5. Follow the instructions for the chosen authentication app.
6. Click **Verify & save**.
7. Refresh your SSH credentials by running `{{% vendor/cli %}} login -f` in the CLI.

## Enforce MFA within your organization

{{< premium-features/tiered "Elite and Enterprise" >}}

TO enable MFA within your organization, follow these steps:

1. In the Console, open the organization dropdown menu on the leftmost navigation.
2. In the expanded navigation on the right hand side, click **Security**. This will take you to the **User security settings** view.
3. In the **MFA required** area, set the **Enable** toggle on.

{{% note %}}
Under **User security settings**, you can view which users in your organization have [activated MFA for their user accounts](#enable-mfa-on-your-user-account).
{{% /note %}}

### Send email reminders

You can send email reminders to users who haven't enabled MFA on their user account yet. To do so, follow these steps:

1. In the Console, open the organization dropdown menu on the leftmost navigation.
2. In the expanded navigation on the right hand side, click **Security**. This will take you to the **User security settings** view.
3. In the **User security settings** area, find the user you want to send a reminder to.
4. Click **{{< icon more >}} More** next to that user.
5. Select **Remind**.</br>
   An email is sent to the user with instructions on how to enable MFA on their user account.

{{< note >}}

You can send reminders to multiple users at once.</br>
To do so, in the **User security settings** user list,
select the desired users by checking the boxes in front of their names.
Click **Remind** at the top of the list to trigger the reminder emails.

{{< /note >}}
