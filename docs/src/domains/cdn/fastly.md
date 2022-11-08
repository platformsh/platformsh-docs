---
title: "Fastly"
weight: 1
description: |
  In some cases you may want to opt to use a CDN such as Fastly rather than the Platform.sh router's cache. Using a CDN can offer a better time-to-first-byte for cached content across a wider geographic region at the cost of the CDN service.
aliases:
  - "/golive/steps/fastly.html"
---

{{% description %}}

A Fastly CDN is included for Dedicated projects.
Platform.sh doesn't offer an integrated CDN on self-service Grid projects at this time,
but it is a common choice for customers to self-configure.

Launching a Platform.sh site with Fastly in front of it is nearly the same as launching normally.
There are only a few notable differences.
Individual apps may have their own Fastly setup instructions or additional modules.
Consult the documentation for your app for specific details.

{{% disable-cache CDN="Fastly" %}}

## Set the Platform.sh domain on Fastly

Rather than create a DNS `CNAME` for your default Platform.sh branch (for instance `main-abcd123.abcdefgh1234567.eu.platformsh.site`),
[configure Fastly](https://docs.fastly.com/guides/basic-configuration/working-with-domains)
to respond to requests for your domain name and to treat the default Platform.sh branch as its backend server.
Be sure to enable TLS for the backend connection to Platform.sh.
Then configure your DNS to point your domain at Fastly instead.
See the [Fastly documentation](https://docs.fastly.com/guides/basic-configuration/connecting-to-origins) for further details.

## HTTP Redirect

From the Fastly interface under "Configure",
edit the configuration for your origin to enable the ["Force TLS and enable HSTS"](https://docs.fastly.com/en/guides/enabling-hsts-through-fastly).

Generally, Platform.sh recommends specifying only HTTPS routes in your `routes.yaml` file.
This results in all pages being served over SSL and any requests for an HTTP URL automatically redirected to HTTPS.
When Fastly has been added as an intermediary to your project, however, this automatic redirect fails.
Once a user visits your site with an HTTP request and is directed to Fastly,
Fastly continues to query Platform.sh using HTTPS (since that is how origin has been configured),
resulting in Platform.sh never detecting the HTTP request in the first place.
Enabling the "Force TLS and enable HSTS" option causes Fastly to do the same HTTP to HTTPS redirect as Platform.sh,
ensuring that all requests are over HTTPS end-to-end.

## DNS TXT records

If using the Fastly CDN that is included with a Platform.sh Enterprise subscription,
you need to obtain a DNS TXT record from your Customer Support Engineer prior to going live.
You need to enter that as a DNS TXT record with your domain registrar.
This step should be done well in advance of the actual go-live.

## Anycast

You have the option of using either a [`CNAME` or a set of Anycast IP addresses](https://docs.fastly.com/guides/basic-configuration/using-fastly-with-apex-domains).
Fastly prefers that you use the `CNAME` but either work.
If using the Anycast IP addresses on a {{% names/dedicated-gen-2 %}} production environment,
open a support ticket with the new A records to provide to our support team.
