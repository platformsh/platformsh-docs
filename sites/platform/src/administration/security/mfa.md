---
title: Multi-Factor Authentication (MFA)
weight: 4
keywords: 
- 2fa
- twofactor
- two factor
- mfa
- multifactor authentication
description: Enhance your organizations' security with Multi-Factor Authentication (MFA).
---

Multi-Factor Authentication (MFA) enhances security by protecting both your organization and every user account that interacts with it
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
3. Click **Security**.
4. Click **Set up application**.
5. Follow the instructions for the chosen authentication app.
6. Click **Verify & save**.
7. Refresh your SSH credentials by running `{{% vendor/cli %}} login -f` in the CLI.

## Enforce MFA within your organization

{{< premium-features/tiered "Elite and Enterprise" >}}

As an **admin user**, to enable MFA, open a [support ticket](/learn/overview/get-support)
and request for MFA to be enforced within your organization.