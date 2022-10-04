---
title: "Single sign-on (SSO)"
weight: 4
description: |
  Platform.sh allows you to set up mandatory SSO with a third-party identity provider (IdP) for all your users.
tier:
  - Elite
  - Enterprise
---

{{% description %}}

Your SSO provider can be enabled for a specific email domain, for example `@example.com`. Every user with a matching email address needs to log in or register on Platform.sh using your SSO provider. Such users can't use an alternative provider, or register a password, or change their email address.

## Mitigation controls

If you deactivate a user on your identity provider, they can't log in or register on Platform.sh.

If the user is already logged in to Platform.sh, they are automatically deactivated after their access token has expired (generally after 1 hour).

A deactivated user can no longer use SSH, Git, or other Platform.sh APIs.

## Service users

If you have a service user with an email address under your SSO domain, such as `machine-user@example.com`, you can exclude that user from the SSO enforcement rule so they aren't required to authenticate through your identity provider.

Please open a support ticket if you need to exclude a service user.

## SSO providers

### Google

{{< premium-features/tiered "Enterprise" >}}

Enforce your users to authenticate with Google. Please open a support ticket to enable Google SSO.

#### Issue with re-authenticating every 15 minutes

If your organization has Google SSO enabled on Platform.sh, you may be required to re-authenticate with Google every 15 minutes. This happens when Platform.sh doesn't possess a valid refresh token from your Google account. 

To resolve that, you need to:

1. Go to [https://myaccount.google.com/permissions](https://myaccount.google.com/permissions) and revoke the access from the `Platform.sh` application that has `Access given to auth.api.platform.sh`.
2. Go to [https://auth.api.platform.sh/auth/authorize/google?prompt=consent](https://auth.api.platform.sh/auth/authorize/google?prompt=consent) for the system to obtain a valid refresh token for your Google account.

### OpenId Connect

{{< premium-features/tiered "Elite" >}}

Enforce your users to authenticate with your OpenID Connect provider. Please open a support ticket to enable SSO with your OpenID Connect provider.
