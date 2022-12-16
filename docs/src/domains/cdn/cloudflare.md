---
title: "Configure your Cloudflare CDN"
weight: 2
sidebarTitle: "Cloudflare"
toc: false
aliases:
  - "/golive/steps/cloudflare.html"
---

You can [use a CDN](./_index.md) to deliver your site's content to users more quickly.

## Before you begin

You need:

- An up-and-running Platform.sh project
- A [Cloudflare](https://www.cloudflare.com/) CDN subscription 

{{% disable-cache CDN="Cloudflare" %}}

## 2. Set up your Cloudflare CDN

To properly configure your Cloudflare CDN, 
see the Cloudflare official documentation on [how to get started](https://developers.cloudflare.com/cache/get-started/).

## 3. Handle apex domains

To start routing client traffic through Cloudflare,
you need to [create `CNAME` records for your domain names](../../domains/steps/dns.md#why-cname-records) 
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
or between Cloudflare and your Platform.sh server is then encrypted through HTTPS.
In addition, Cloudflare checks that your Platform.sh server's [TLS certificate](../../other/glossary.md#transport-layer-security-tls) 
was issued by a trusted certificate authority.
This confirms the client is truly communicating with your Platform.sh server.

For enhanced security, make sure your HTTPS connections can't be downgraded to HTTP.
To do so, in your Cloudflare account,
[enable HTTP strict transport security (HSTS)](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/http-strict-transport-security/).

## 5. Let's Encrypt users: Renew your TLS certificates

To secure connections and prevent data leaks,
authenticate your Platform.sh server with a [transport layer security (TL
S) certificate](../../other/glossary.md#transport-layer-security-tls).

TLS certificates are provided by trusted certificate authorities (CA) such as Let's Encrypt.
If you use TLS certificates provided by Let's Encrypt,
you need to renew them [every 90 days](https://letsencrypt.org/docs/faq/#what-is-the-lifetime-for-let-s-encrypt-certificates-for-how-long-are-they-valid). 

To ensure such renewals succeed, remove all domains pointing to Cloudflare from your Platform.sh project 
before the renewal process starts.

Alternatively, go to your Cloudflare account and follow these steps:

1. Go to **SSL/TLS**>**Edge Certificates** and turn off **Always Use HTTPS**.
2. [Create a page rule](https://support.cloudflare.com/hc/en-us/articles/218411427-Understanding-and-configuring-Cloudflare-Page-Rules-Page-Rules-Tutorial-#h_38Gq7mduJiXIjpVLxp3q19) 
   for `/.well-known/acme-challenge/` with **SSL** set to **off**.
3. Create a second page rule for `*` that turns **Always Use HTTPS** back on.
