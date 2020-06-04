---
title: "SSO"
weight: 4
description: |
  Platform.sh allows you to set up SSO with a third-party identity provider (IdP) to enforce your users to authenticate with a specific method.
sidebarTitle: "Single sign-on (SSO)"
tier:
  - Elite
  - Enterprise
---

{{< description >}}

Once SSO is enabled with your domain `@example.com`, every user with an `@example.com` email will have to authenticate through your SSO method. That user will not be able to login or register with a password or via a federated login.

## Mitigation controls

If you deactivate a SSO user on your identity provider, the user will not be able to login or register on Platform.sh.

If the user is already logged in, he will be deactivated after his access token has expired (generally after 1 hour), and will be logged out of Platform.sh.

A deactivated user will not be able to use SSH nor Git anymore.

## Service users

If you have a service user with an email address under your SSO domain `machine-user@example.com`, you can whitelist that user so that they will not be required to authenticate through your SSO method. 

Whitelisted users are only allowed to login or register with a password or via a federated login (Google, GitHub, Bitbucket).

Please open a support ticket if you need to whitelist a user.