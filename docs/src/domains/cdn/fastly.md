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
Self-Service Grid plans don't automatically include a Fastly CDN, 
but you can set up one at any time.

## Get a DNS TXT record

To use a Fastly CDN included in a Dedicated plan, 
you need to [request a DNS TXT record from support](../../overview/get-support.md#create-a-support-ticket) before going live.
To add this DNS TXT record to your domain settings,
contact your domain registrar.

{{% disable-cache CDN="Fastly" %}}

## Connect Fastly to an origin server

To allow Fastly to start caching your content,
you need to connect it to an origin server.  

To do so, follow these steps:

1. [Enable TLS](./_index.md#set-up-tls-certificates) for the backend connection to Platform.sh.
2. Configure your DNS to point your domain at Fastly.
   For more information, see your DNS provider's official documentation.
3. Add your default Platform.sh branch as [a host on Fastly](https://docs.fastly.com/en/guides/working-with-hosts).

## Force TLS and enable HSTS

To ensure that all communication between Fastly and your Platform.sh origin server remains secure,
you can [force TLS and enabling HSTS](https://docs.fastly.com/en/guides/enabling-hsts-through-fastly#forcing-tls-and-enabling-hsts).
All HTTP requests are then automatically redirected to HTTPS.

## Anycast

To start routing client traffic through Fastly,
you can [create a `CNAME` record for your domain name](../../domains/steps/dns.md#why-cname-records) 
through your DNS provider.

However, `CNAME` records can't point to apex domains.
As a workaround, Fastly offers [Anycast options](https://docs.fastly.com/en/guides/using-fastly-with-apex-domains).

To use Anycast IP addresses on a {{% names/dedicated-gen-2 %}} production environment,
[open a support ticket](../../overview/get-support.md#create-a-support-ticket).
