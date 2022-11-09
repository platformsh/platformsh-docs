---
title: "Cloudflare configuration"
weight: 2
sidebarTitle: "Cloudflare"
toc: false
aliases:
  - "/golive/steps/cloudflare.html"
---

Verify your registrar supports [`CNAME` records for apex domains](../steps/dns.md#handling-apex-domains).
This solves the problem of being able to point an apex domain such as `example.com`
to a domain name (using a `CNAME` record) rather than an IP address (using an A record).
CloudFlare offers [`CNAME` flattening as an alternative](https://blog.cloudflare.com/introducing-cname-flattening-rfc-compliant-cnames-at-a-domains-root/).

To correctly point DNS to your Platform.sh project,
you need the [target for your Production environment](../../domains/steps/_index.md#2-get-the-target-for-your-project).

Assuming that you are using both a `www.` subdomain and the bare domain,
point both of those DNS entries to the same place.
Whether you choose the bare domain version or the `www` subdomain doesn't make any practical difference,
as they both reach Platform.sh and are handled correctly.

{{% disable-cache CDN="Cloudflare" %}}

## Enable "Full SSL" option in the Cloudflare admin

Cloudflare also makes it possible to use their free TLS/SSL service to secure your site via HTTPS,
while also being behind their CDN if you so choose.
If you decide to use Cloudflare's CDN functionality in addition to their DNS service,
you should be sure to choose the **Full SSL** option in the Cloudflare admin.

This means that traffic to your site is encrypted from the client (browser) to Cloudflare's servers using their certificate,
and also between Cloudflare's servers and your project hosting here at Platform.sh,
mostly like using your project's Let's Encrypt certificate.

```text
# Cloudflare's Full SSL option
          https                       https
User <---------------> Cloudflare <-------------> Platform.sh
```

The other option known as **Flexible SSL** causes issues if you intend to redirect all traffic to HTTPS.
The **Flexible SSL** option uses Cloudflare's TLS/SSL certificate to encrypt traffic between your users and the CDN,
but passes requests from the CDN back to your project at Platform.sh via HTTP.
This facilitates sites that don't have a TLS/SSL certificate beginning to offer their users a more secure experience,
by at the least eliminating the unencrypted attack vector on the "last mile" to the user's browser.

```text
# Cloudflare's Flexible SSL option
          https                       http
User <---------------> Cloudflare <-------------> Platform.sh
```

This causes all traffic from Cloudflare to your project to be redirected to HTTPS,
which sets off an endless loop as HTTPS traffic is presented as HTTP to your project no matter what.

In short: *Always use **Full SSL** unless you have a very clear reason to do otherwise*

## Let's Encrypt certificate renewal

Let's Encrypt expects the `.well-known` endpoint on all domains added.
You have 2 options:

* Remove all domains pointing to Cloudflare from your Platform.sh project
* Follow these steps in your Cloudflare Console:

  1. On the SSL page, turn off **Always Use HTTPS**.
  2. Create a page rule for `/.well-known/acme-challenge/` with SSL set to **off**.
  3. Create a second page rule for `*` that turns **Always Use HTTPS** back on.
