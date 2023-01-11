---
title: "Managed Fastly CDN"
sidebarTitle: "Managed Fastly CDN"
weight: 2
description: Bring your content closer to users with a Fastly CDN fully managed by Platform.sh. 
aliases:
 - "/golive/steps/fastly.html"
---

Instead of starting your own Fastly subscription and managing your CDN yourself,
you can take advantage of a Fastly CDN provided by Platform.sh.
For example, Dedicated projects include a managed Fastly CDN by default.
These CDNs are exclusively set up and managed by Platform.sh.
To modify any settings for a managed Fastly CDN,
[open a support ticket](https://console.platform.sh/-/users/~/tickets/open).

### Domain control validation
 
When you request for a new domain to be added to your Fastly service,
Platform.sh support provides you with a [`CNAME` record](../../domains/steps/dns.md) for domain control validation.
To add this `CNAME` record to your domain settings,
contact your DNS provider.

### Transport Layer Security (TLS) certificates
 
By default, Enterprise and Elite plans include two [TLS certificates](../../other/glossary.md#transport-layer-security-tls),
an apex and a wildcard one.
This allows for encryption of all traffic between your users and your app.
 
If you use a Fastly CDN provided by Platform.sh, 
you can provide your own third-party TLS certificates for an additional fee.
[Transfer each certificate](../../development/file-transfer.md),
its unencrypted private key, 
and the intermediate certificate to a non-web accessible [mount](../../create-apps/app-reference.md#mounts),
on an environment that only Platform.sh support and trusted users can access.
In this way, your private key can't be compromised.
 
Note that when you add your own third-party TLS certificates,
you are responsible for renewing them in due time.
Failure to do so may result in outages and compromised security for your site.
 
If you need an Extended Validation TLS certificate, 
you can get it from any TLS provider.
To add it to your CDN configuration, [create a support ticket](../../overview/get-support.md#create-a-support-ticket).