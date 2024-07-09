---
title: "Single Sign-On (SSO)"
weight: 4
description: |
  {{% vendor/name %}} allows you to set up mandatory SSO with a third-party identity provider (IdP) for all your users.
banner: 
    type: tiered-feature
---

{{% description %}}

Your SSO provider can be enabled for a specific email domain, for example `@example.com`. Every user with a matching email address needs to log in or register on {{% vendor/name %}} using your SSO provider. Such users can't use an alternative provider, or register a password, or change their email address.

## Mitigation controls

If you deactivate a user on your identity provider, they can't log in or register on {{% vendor/name %}}.

If the user is already logged in to {{% vendor/name %}}, they are automatically deactivated after their access token has expired (generally after 1 hour).

A deactivated user can no longer use SSH, Git, or other {{% vendor/name %}} APIs.

## Service users

If you have a service user with an email address under your SSO domain, such as `machine-user@example.com`, you can exclude that user from the SSO enforcement rule so they aren't required to authenticate through your identity provider.

Please open a [support ticket](/learn/overview/get-support) if you need to exclude a service user.

## SSO providers

### Google

{{< premium-features/tiered "Enterprise" >}}

Enforce your users to authenticate with Google. Please open a [support ticket](/learn/overview/get-support) to enable Google SSO.

#### Issue with re-authenticating every 15 minutes

If your organization has Google SSO enabled on {{% vendor/name %}}, you may be required to re-authenticate with Google every 15 minutes. This happens when {{% vendor/name %}} doesn't possess a valid refresh token from your Google account. 

To resolve that, you need to:

1. Go to [https://myaccount.google.com/permissions](https://myaccount.google.com/permissions) and revoke the access from the `{{% vendor/name %}}` application that has `Access given to auth.api.platform.sh`.
2. Go to [https://auth.api.platform.sh/auth/authorize/google?prompt=consent](https://auth.api.platform.sh/auth/authorize/google?prompt=consent) for the system to obtain a valid refresh token for your Google account.

### OpenId Connect

{{< premium-features/tiered "Elite" >}}

Enforce your users to authenticate with your OpenID Connect provider,
such as Okta, Azure Active Directory or Ping Identity. 
To enable SSO with your OpenID Connect provider,
[contact Support](https://console.platform.sh/-/users/~/tickets). 
