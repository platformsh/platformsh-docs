---
title: "Set up your Cloudflare CDN"
weight: 3
sidebarTitle: "Cloudflare setup"
description: Learn how to configure your Cloudflare CDN.
---

You can [use a CDN](./_index.md) to deliver your site's content to users more quickly.

## Before you begin

You need:

- An up-and-running {{< vendor/name >}} project
- A [Cloudflare](https://www.cloudflare.com/) CDN subscription

{{% disable-cache CDN="Cloudflare" %}}

## 2. Set up your Cloudflare CDN

To properly configure your Cloudflare CDN,
see the Cloudflare official documentation on [how to get started](https://developers.cloudflare.com/cache/get-started/).
Then set up a [custom domain](../steps/_index.md).
To get the [DNS challenge to succeed](../troubleshoot.md#ownership-verification),
have your CDN point to your [project's target URL](../../domains/steps/_index.md#2-get-the-target-for-your-project).

## 3. Handle apex domains

To start routing client traffic through Cloudflare,
you need to [create `CNAME` records for your domain names](../../domains/steps/dns.md) 
through your DNS provider.

But `CNAME` records can't point to apex domains.
As a workaround, Cloudflare offers [`CNAME` flattening](https://developers.cloudflare.com/dns/additional-options/cname-flattening/).

## 4. Optional: Protect your site from on-path attacks

An on-path attack occurs when a hacker intercepts or modifies the communication between a client and a server.
This can lead to sensitive data leaks.
To prevent such attacks, make sure all communication with your site is encrypted through HTTPS
and can't be downgraded to HTTP.

To do so, [enable full strict SSL/TLS encryption](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/).
Any communication between a client and Cloudflare
or between Cloudflare and your {{< vendor/name >}} server is then encrypted through HTTPS.
In addition, Cloudflare checks that your {{< vendor/name >}} server's [TLS certificate](../../other/glossary.md#transport-layer-security-tls) 
was issued by a trusted certificate authority.
This confirms the client is truly communicating with your {{< vendor/name >}} server.

For enhanced security, make sure your HTTPS connections can't be downgraded to HTTP.
To do so, in your Cloudflare account,
[enable HTTP strict transport security (HSTS)](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/http-strict-transport-security/).
