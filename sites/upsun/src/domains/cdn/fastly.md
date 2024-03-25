---
title: "Set up your Fastly CDN"
sidebarTitle: "Fastly setup"
weight: 1
description: Learn how to configure your Fastly CDN.
---
 
You can [use a CDN](./_index.md) to deliver your site's content to users more quickly.

To set up a Fastly CDN with your own Fastly subscription,
follow the instructions on this page.

## Before you begin

You need:

- An up-and-running {{% vendor/name %}} project
- A [Fastly](https://www.fastly.com/) CDN subscription

{{% disable-cache CDN="Fastly" %}}

## 2. Set up your Fastly CDN

To properly configure your Fastly CDN,
see the Fastly official documentation on [how to get started](https://docs.fastly.com/en/guides/getting-started#_basics).
Then set up a [custom domain](../steps/_index.md).
To get the [DNS challenge to succeed](../troubleshoot.md#ownership-verification),
have your CDN point to your [project's target URL](../../domains/steps/_index.md#1-get-the-target-for-your-project).

## 3. Handle apex domains

To start routing client traffic through Fastly,
[create `CNAME` records for your domain names](../../domains/steps/dns.md)
through your DNS provider.
`CNAME` records can't point to apex domains.
As a workaround, Fastly offers [Anycast options](https://docs.fastly.com/en/guides/using-fastly-with-apex-domains).

## 4. Optional: Protect your site from on-path attacks

An on-path attack occurs when a hacker intercepts
or modifies the communication between a client and a server.
This can lead to sensitive data leaks.
To prevent such attacks, make sure all communication with your site is encrypted through HTTPS
and can't be downgraded to HTTP.

To do so, enable HTTP strict transport security (HSTS).
HSTS forces clients to always communicate with your site over HTTPS.

You can [enable HSTS](https://docs.fastly.com/en/guides/enabling-hsts-through-fastly#forcing-tls-and-enabling-hsts)
in your Fastly account.
All HTTP requests are then automatically redirected to HTTPS.