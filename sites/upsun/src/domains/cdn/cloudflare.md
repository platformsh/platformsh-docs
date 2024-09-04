---
title: "Set up your Cloudflare CDN"
weight: 3
sidebarTitle: "Cloudflare setup"
description: Learn how to configure your Cloudflare CDN.
---

You can [use a CDN](./_index.md) to deliver your site's content to users more quickly.

## Before you begin

You need:

- An up-and-running {{% vendor/name %}} project
- A [Cloudflare](https://www.cloudflare.com/) CDN subscription

{{% disable-cache CDN="Cloudflare" %}}

## 2. Set up your Cloudflare CDN

To properly configure your Cloudflare CDN,
see the Cloudflare official documentation on [how to get started](https://developers.cloudflare.com/cache/get-started/).
Then set up a [custom domain](../steps/_index.md).
To get the [DNS challenge to succeed](../troubleshoot.md#ownership-verification),
have your CDN point to your [project's target URL](../../domains/steps/_index.md#1-get-the-target-for-your-project).

## 3. Handle apex domains

To start routing client traffic through Cloudflare,
you need to [create `CNAME` records for your domain names](../../domains/steps/dns.md) 
through your DNS provider.

But `CNAME` records can't point to apex domains.
As a workaround, Cloudflare offers [`HTTPS` records](https://developers.cloudflare.com/dns/manage-dns-records/reference/dns-record-types/#svcb-and-https) and [`CNAME` flattening](https://developers.cloudflare.com/dns/additional-options/cname-flattening/).

## 4. Mitigate security risks

Like all networks exposed to the internet, your origin server may become the target of security attacks.
The best way to protect your site from threats like on-path attacks, spoofing attacks, or credential stuffing,
is to [configure mutual TLS (mTLS)](https://community.platform.sh/t/configure-mutual-tls-with-cloudflare-and-platform-sh/761).

[mTLS](https://www.cloudflare.com/en-gb/learning/access-management/what-is-mutual-tls/) not only has both parties in a connection authenticate each other
through the TLS protocol.
It also ensures that requests can't be sent directly to the origin server ({{% vendor/name %}}).
Instead, requests must transit through Cloudflare first.

{{< note >}}
mTLS is only compatible with environments where you have attached domains you own, meaning:

- Your production environment
- Each preview environment where you have [attached a custom domain](/domains/steps/custom-domains-preview-environments)

Therefore, mTLS is **not** compatible with preview environments created by a [source code integration](/integrations/source/_index.md).
{{< /note >}}

If you can't use mTLS, you can still take the following measures to protect your site from on-path attacks:

1. [Enable full strict SSL/TLS encryption](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/).</br>
   Any communication between a client and Cloudflare or between Cloudflare and your {{% vendor/name %}} server is then encrypted through HTTPS.
   In addition, Cloudflare checks that your {{% vendor/name %}} server's [TLS certificate](/glossary.md#transport-layer-security-tls) 
   was issued by a trusted certificate authority.
   This confirms the client is truly communicating with your {{% vendor/name %}} server.

2. [Enable HTTP strict transport security (HSTS)](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/http-strict-transport-security/).</br>
   This ensures that your HTTPS connections can't be downgraded to HTTP.
