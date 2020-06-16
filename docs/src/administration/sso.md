---
title: "Single sign-on (SSO)"
weight: 4
description: |
  Platform.sh allows you to set up mandatory SSO with a third-party identity provider (IdP) for all your users.
tier:
  - Elite
  - Enterprise
---

{{< description >}}

Your SSO provider can be enabled for a specific email domain, for example `@example.com`. Every user with a matching email address will have to log in or register on Platform.sh using your SSO provider. Such users will not be able to use an alternative provider, or register a password, or change their email address.

## Mitigation controls

If you deactivate a user on your identity provider, they will not be able to log in or register on Platform.sh.

If the user is already logged in to Platform.sh, they will be automatically deactivated after their access token has expired (generally after 1 hour).

A deactivated user will no longer be able to use SSH, Git, or other Platform.sh APIs.

## Service users

If you have a service user with an email address under your SSO domain, e.g. `machine-user@example.com`, you can allow that user so that they will not be required to authenticate through your identity provider.

Please open a support ticket if you need to allow a user.

## SSO providers

### Google

{{< tiered-feature "Enterprise" >}}

Enforce your users to authenticate with your OpenID Connect provider. Please open a support ticket to enable SSO with your OpenID Connect provider.

### OpenId Connect

{{< tiered-feature "Elite" >}}

Enforce your users to authenticate with Google. Please open a support ticket to enable Google SSO.
