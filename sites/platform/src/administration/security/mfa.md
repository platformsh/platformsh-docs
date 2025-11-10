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
1. Click **My profile**.
1. On the **Authentication Settings** tab, click **Set up application**.
1. Follow the instructions for the chosen authentication app.
1. Click **Verify & save**.
1. Refresh your SSH credentials by running `{{% vendor/cli %}} login -f` in the CLI.

## Enforce MFA within your organization

{{< premium-features/tiered "Elite and Enterprise" >}}

Prerequisites:
- You must be an **organization owner** or **admin user**.
- You must first [enable MFA on _your own_ user account](#enable-mfa-on-your-user-account) as described above. 

To enforce MFA within your organization, follow these steps:

1. In the Console, select an organization from the organization menu in the upper left of the page.
1. Click the organization name again, and from the expanded menu, click **Security**. 

   On the **Security** tab, in the **User security settings** section, you can see which users in your organization have [activated MFA for their user accounts](#enable-mfa-on-your-user-account).

1. In the **MFA required** section, click the **Enable MFA** toggle to the on position.


### Send email reminders

To send email reminders to users who haven't enabled MFA on their account:

1. In the Console, select an organization from the organization menu in the upper left of the page.
2. Click the organization name again, and from the expanded menu, click **Security**. 
3. On the **Security** tab, in the **User security settings** section, complete the steps below based on the action you want to take.<br><br>

   - To send an email reminder to an individual user, click **{{< icon more >}} More** beside the user's name and then click **Remind**.</br>

   - To send an email reminder to multiple users at once, select the checkbox beside the names of the users you want to remind. To remind _all_ of the users who do not have MFA enabled, select the **Name** checkbox at the top of the list. Then, near the **Name** checkbox, click **Remind**.

An email is sent to the user with instructions on how to enable MFA on their user account.
