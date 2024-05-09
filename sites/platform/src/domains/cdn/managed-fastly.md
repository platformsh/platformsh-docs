---
title: "Managed Fastly CDN"
sidebarTitle: "Managed Fastly CDN"
weight: 2
description: Bring your content closer to users with a Fastly CDN fully managed by {{% vendor/name %}}.
banner:
    type: tiered-feature
keywords:
  - mTLS
---

Instead of starting your own Fastly subscription and [managing your CDN yourself](./fastly.md),
you can take advantage of a Fastly CDN provided by {{% vendor/name %}}.
For example, Dedicated projects include a managed Fastly CDN by default.
These CDNs are exclusively set up and managed by {{% vendor/name %}}.

To modify any settings for a managed Fastly CDN,
open a [support ticket](/learn/overview/get-support).
To add a managed Fastly CDN to your project,
[contact sales](https://platform.sh/contact/).

### Domain control validation

When you request for a new domain to be added to your Fastly service,
{{% vendor/name %}} support provides you with a [`CNAME` record](../../domains/steps/dns.md) for [domain control validation](../troubleshoot.md#ownership-verification).
To add this `CNAME` record to your domain settings,
see how to [configure your DNS provider](../steps/_index.md#2-configure-your-dns-provider).

### Transport Layer Security (TLS) certificates

By default, Enterprise and Elite plans include two [TLS certificates](/glossary.md#transport-layer-security-tls),
an apex and a wildcard one.
This allows for encryption of all traffic between your users and your app.

If you use a Fastly CDN provided by {{% vendor/name %}},
you can provide your own third-party TLS certificates for an additional fee.

To do so, if you don't have one,
set up a [mount](/create-apps/app-reference/single-runtime-image.md#mounts) that isn't accessible to the web.
Use an environment with access limited to {{% vendor/name %}} support and trusted users.
[Transfer](../../development/file-transfer.md) each certificate, its unencrypted private key,
and the intermediate certificate to the mount.
To notify {{% vendor/name %}} that a certificate is to be added to your CDN configuration,
open a [support ticket](/learn/overview/get-support).

If you need an Extended Validation TLS certificate,
you can get it from any TLS provider.
To add it to your CDN configuration, open a [support ticket](/learn/overview/get-support).

Note that when you add your own third-party TLS certificates,
you are responsible for renewing them in due time.
Failure to do so may result in outages and compromised security for your site.

### Retrieve your Fastly API token

The API token for your managed Fastly CDN is stored in the `FASTLY_API_TOKEN` environment variable.

This variable is usually set in the `/master/settings/variables` folder of your project,
and you can access it [from a shell](/development/variables/use-variables.md#access-variables-in-a-shell)
or directly [in your app](/development/variables/use-variables.md#access-variables-in-your-app).

{{% note %}}

Older projects may not have the `FASTLY_API_TOKEN` environment variable set.</br>
In this case, the Fastly API token is stored in a text file called `fastly_tokens.txt` on the server,
typically located at `/mnt/shared/fastly_tokens.txt`.

{{% /note %}}