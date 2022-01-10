---
title: "Pre-Launch Checklist"
weight: 1
description: |
  Before you can take your site live there are a few preparation steps to take.
sidebarTitle: "Pre-Launch Checklist"
---

{{< description >}}

## 1. Register a domain name with a supported provider

You have a domain name registered for your site with a Registrar of your choice.
The registrar must allow you to use CNAMEs for your domain.
(Some registrars may call these Aliases or similar.).
If your domain is currently active elsewhere,
the Time-To-Live (TTL) on your domain is set to the lowest possible value in order to minimize transition time.

{{< note >}}

You will not be able to use a `A` record.
Verify your DNS provider supports CNAMES.
(If it does not you will want to run away from it anyway).
Also you will be much happier if it supports Apex domains (more in the next chapter).

{{< /note >}}

## 2. Test your site!

Make sure your site is running and configured as you want it to be, on your production branch.
In particular, see the [Routes documentation](/configuration/routes/_index.md).
You will need your routes configured appropriately before you begin.
Make sure you have turned off [basic-authentication](/administration/web/configure-environment.md) if it was turned on during development.

If your production environment is on a Dedicated instance,
ensure that the code is up to date in both your `staging` and `production` branches,
as those are what will be mirrored to the Dedicated instances.
Also ensure that the data on the production instance is up to date and ready to launch.

## 3. Optionally obtain a 3rd party TLS certificate

Platform.sh automatically provides TLS certificates for all sites issued by [Let's Encrypt](https://letsencrypt.org/) at no charge.
[In most cases](../configuration/routes/https.md#limitations), this is sufficient and no further action is necessary.
However, if you want to use a [third-party TLS certificate](./steps/tls.md) to encrypt your production site,
you can obtain one from any number of 3rd party TLS issuers.
Platform.sh does not charge for using a 3rd party TLS certificate, although the issuer may.

Platform.sh supports all kinds of certificates including domain-validated certificates,
extended validation (EV) certificates, high-assurance certificates and wildcard certificates.
The use of HA or EV certificates is the main reason why you may wish to use a third party issuer rather than the default certificate.
You will also need a custom certificate if you use wildcard routes, as Let's Encrypt does not support wildcard certificates.

If you do wish to use a 3rd party certificate, ensure it is purchased and active prior to going live.

## 4. Optionally configure your CDN

If you are using a CDN, either one included with an Enterprise plan or one you provide for a self-service Grid project,
ensure that your CDN account is registered and configured in advance.
That includes setting the upstream on your CDN to point to the Platform.sh production instance.

* For a Grid-based project, that's the domain connected to your production branch.
  Run `platform environment:info edge_hostname` to get the domain name to use.
* For a Dedicated project, the upstream to use is provided by your Platform.sh onboarding representative.

Consult your CDN's documentation for how to set the CDN's upstream address.

For Enterprise plans you may need to obtain a DNS TXT record from your Platform.sh support representative by opening a ticket.
Consult the documentation for your CDN provider and our own [CDN guide](/domains/cdn/_index.md).

---

* Domain name is registered?
* Your DNS TTL is set as low as possible?
* Your code and data is tested and ready to launch on your production branch?
* Your custom TLS certificate is purchased, if you're using one?
* Your CDN is configured to serve from Platform.sh, if you're using one?

**Time to [Go Live](/domains/quick-start.md).**