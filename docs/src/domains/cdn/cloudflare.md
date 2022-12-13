---
title: "Configure your Cloudflare CDN"
weight: 2
sidebarTitle: "Cloudflare"
toc: false
aliases:
  - "/golive/steps/cloudflare.html"
---

You can [use a CDN](./_index.md) to deliver your site's content to users more quickly.

By default, a [Fastly CDN](fastly.md) is included in Dedicated projects,
but you can use a Cloudflare CDN instead, depending on your needs.
Self-Service Grid plans don't automatically include a CDN, 
but you can set up one at any time.

{{% disable-cache CDN="Cloudflare" %}}

## Enable Full (strict) SSL

For enhanced security, you can enforce HTTPS communication between your visitors and Cloudflare,
and between Cloudflare and your Platform.sh origin server.   

To do so, from your Cloudflare account, [enable Full (strict) SSL]https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full/.
All HTTP requests are then automatically redirected to HTTPS.

## Renew your TLS certificates

When you need to renew your TLS certificates,
Let's Encrypt expects the `.well-known` endpoint on all domains added.
However, this endpoint isn't present on domains pointing to Cloudflare,
which causes the renewal of TLS certificates to fail.

To ensure that the renewal of your TLS certificates works,
you can do the following:

- Remove all domains pointing to Cloudflare from your Platform.sh project before the renewal process.
- Go to your Cloudflare Console and follow these steps:

  1. Go to **SSL/TLS**>**Edge Certificates** and turn off **Always Use HTTPS**.
  2. [Create a page rule](https://support.cloudflare.com/hc/en-us/articles/218411427-Understanding-and-configuring-Cloudflare-Page-Rules-Page-Rules-Tutorial-#h_38Gq7mduJiXIjpVLxp3q19) for `/.well-known/acme-challenge/` with **SSL** set to **off**.
  3. Create a second page rule for `*` that turns **Always Use HTTPS** back on.

## Use Fastly CNAME flattening

To start routing client traffic through Fastly,
you need to [create `CNAME` records for your domain names](../../domains/steps/dns.md#why-cname-records) 
through your DNS provider.

However, `CNAME` records can't point to apex domains.
As a workaround, Cloudflare offers [`CNAME` flattening](https://developers.cloudflare.com/dns/additional-options/cname-flattening/).

