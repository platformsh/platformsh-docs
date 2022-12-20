---
title: "Configure your Fastly CDN"
sidebarTitle: "Fastly"
weight: 1
description: |
aliases:
  - "/golive/steps/fastly.html"
---

You can [use a CDN](./_index.md) to deliver your site's content to users more quickly.

By default, a Fastly CDN is included in Dedicated projects.
Self-service Grid plans don't automatically include a Fastly CDN, 
but you can set up one at any time.

## Before you begin

You need:

- An up-and-running Platform.sh project
- Self-service Grid plans: a [Fastly](https://www.fastly.com/) CDN subscription

{{% disable-cache CDN="Fastly" %}}

## 2. Dedicated: Get a DNS TXT record

To use a Fastly CDN included in a Dedicated plan, 
before going live you need to [request a DNS TXT record from support](../../overview/get-support.md#create-a-support-ticket).
To add this DNS TXT record to your domain settings,
contact your domain registrar.

## 3. Set up your Fastly CDN

To properly configure your Fastly CDN, 
see the Fastly official documentation on [how to get started](https://docs.fastly.com/en/guides/getting-started#_basics).

## 4. Handle apex domains

To start routing client traffic through Fastly,
[create `CNAME` records for your domain names](../../domains/steps/dns.md#why-cname-records) 
through your DNS provider.

`CNAME` records can't point to apex domains.
As a workaround, Fastly offers [Anycast options](https://docs.fastly.com/en/guides/using-fastly-with-apex-domains).

To use Anycast IP addresses on a {{% names/dedicated-gen-2 %}} production environment,
[open a support ticket](../../overview/get-support.md#create-a-support-ticket).

## 5. Optional: Protect your site from on-path attacks

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
