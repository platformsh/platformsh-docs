---
title: "DNS management and apex domains"
weight: 1
description: See why `CNAME` records are used and what to do if your DNS registrar doesn't support them for apex domains.
sidebarTitle: "DNS and apex domains"
---

Platform.sh expects you to use `CNAME` records on your [apex domain](../../other/glossary.md#apex-domain).
But that doesn't work with some DNS registrars.
Learn why they're recommended and what else you can do.

## Why `CNAME` records?

Each site on Platform.sh is made up of a set of containers.
Platform.sh runs routers for each region to map incoming requests to the appropriate container.
For inbound requests to be forwarded to the right container, the requests need to know the IPs of the routers at the time of the request.
The IP addresses for the routers in [each region](../../development/regions.md) are fairly stable but can change in two cases:

* To up- or downscale a region.
  Routers are added or removed.
* For upgrades and maintenance.
  Routers are taken offline, one at a time, to apply the changes.

The edge hostname's destination IP addresses are updated automatically should they change.

If a router is being upgraded and its IP changed, two possibilities arise:

* Your apex domain points to the edge hostname using `CNAME`/`ANAME` or `ALIAS` records. The IP addresses for the routers are updated automatically. You don't need to do anything. Your website remains online.
* Your apex domain points to your project's region using `A` records.
  The IP addresses for the routers aren't updated automatically.
  Your website appears temporarily offline until you manually update your `A` records or the router is back from maintenance.

The edge hostname can be [retrieved through the CLI or the Console](./_index.md#2-get-the-target-for-your-project).

## Why `CNAME` records are problematic

The DNS specification was originally published in 1987, long before name-based HTTP hosting became prevalent.
In the multiple RFCs that were written regarding `CNAME` records, the description of their behavior is rather vague.

It's generally understood that a `CNAME` record for an apex domain like `example.com`:

* Can only point to an IP address like `192.0.2.1` (an `A` record).
* Can't be used as an alias for another hostname like `www.example.com` (a `CNAME` record).

The `CNAME` record limitation is especially problematic if you want to use an apex domain with any container-based managed hosting service like Platform.sh.

Many registrars allow `CNAME` records for apex domains.
If yours doesn't, several solutions exist [to bypass that limitation](#handling-apex-domains).

## Handling Apex domains

Some DNS providers (usually your registrar) don't allow `CNAME` records for [apex domains](../../other/glossary.md#apex-domain).
This is one of the [limitations to `CNAME` records](#why-cname-records-are-problematic).

Check your registrar's documentation to make sure that `CNAME` records on apex domains are supported.
If your registrar supports them, follow the [guide to using such records](../steps/_index.md).
If your registrar doesn't support them, there are a number of ways to handle the limitation.

The recommended approach is to use custom records.

{{< codetabs >}}

---
title=Use custom records
file=none
highlight=false
---

Some DNS providers offer custom, non-standard records (sometimes `ANAME` or `ALIAS` records) that you can manage like `CNAME` records.
These nonstandard records make an internal lookup behind the scenes and respond to DNS lookups as if they were `A` records.
As these are nonstandard, their behavior (and quality) can vary and not all DNS registrars offer such a feature.

If you want your site to be accessible at a URL like `https://example.com` and not only `https://www.example.com`,
this is the best way to do so.

To configure your domain name to point to your project using custom records, follow the instructions on [how to set up a custom domain](./_index.md).
When you come to configuring your DNS provider, replace the suggested `CNAME` record with the custom record pointing from your domain to the target.

Examples of such workaround records and providers include:

<!-- vale Platform.condescending = NO -->
* `CNAME` flattening at [CloudFlare](https://developers.cloudflare.com/dns/additional-options/cname-flattening)
* `ANAME` records at [easyDNS](https://easydns.com/features/aname-root-domain-alias/),
  [DNS Made Easy](https://support.dnsmadeeasy.com/support/solutions/articles/47001001412-aname-records),
  and [Name.com](https://www.name.com/support/articles/115010493967-adding-an-aname-alias-record)
* `ALIAS` records at [DNSimple](https://support.dnsimple.com/articles/alias-record/)
  and [ClouDNS](https://www.cloudns.net/wiki/article/18/)
<!-- vale Platform.condescending = YES -->

<--->

---
title=Use domain forwarding
file=none
highlight=false
---

If your registrar doesn't support custom records, you can consider using domain forwarding.

If your domain is `example.com`, domain forwarding redirects all requests from `example.com` to `www.example.com`.

To configure your domain name to point to your project using domain forwarding:

1. Make the `www.` version of your site the default (canonical) version and configure your app and routes to [use the `www` subdomain as upstream](../../define-routes/_index.md).
2. Follow the instructions on [how to set up a custom domain](./_index.md).
   When you come to configuring your DNS provider, replace the suggested `CNAME` record with a record forwarding requests from {{<variable "YOUR_DOMAIN" >}} to `www.`{{<variable "YOUR_DOMAIN" >}}.

The following DNS providers are known to support both domain forwarding and advanced DNS configurations:

* [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/385/2237/how-to-redirect-a-url-for-a-domain/)

<--->

---
title=Use a `www` redirection service
file=none
highlight=false
---

If your registrar doesn't support custom records or domain forwarding you can consider using a redirection service.

If your domain is `example.com`, a redirection service uses an `A` record to redirect all requests
from `example.com` to `www.example.com`.

One such redirection service is [WWWizer](http://wwwizer.com/naked-domain-redirect).

To configure your domain name to point to your project using a redirection service:

1. Make the `www.` version of your site the default (canonical) version and configure your app and routes to [use the `www` subdomain as upstream](../../define-routes/_index.md).
2. Follow the instructions on [how to set up a custom domain](./_index.md).
   When you come to configuring your DNS provider, replace the suggested `CNAME` record with
   an `A` record pointing from your domain to the redirection service.
   For WWWizer, that's the IP `174.129.25.170`.
3. Ensure that your redirects use the same protocol:
   `http://example.com` redirects to `http://www.example.com`, not to `https://www.example.com`.
   Redirects from `http` to `https` are handled automatically.
   Trying to change the protocol and domain in the same redirect causes issues for Let's Encrypt
   and prevents the TLS certificate from being issued correctly.

The extra redirect adds a few milliseconds to the first page load.

<--->

---
title=Use `A` records
file=none
highlight=false
---

If your registrar doesn't support custom records or domain forwarding and you can't use a redirection service, consider using `A` records.

Using `A` records is _strongly discouraged_ and [should only be used as a last resort](#why-cname-records).

Using `A` records has several limitations:

* If the IPs change, you need to manually update your configuration.
  Until you do, the site can appear offline because requests are lost.
* Directly pointing at the edge routers bypasses their load-balancing functionality.
  Should one of them go offline for maintenance (as happens periodically for upgrades),
  about 1/3 of requests to your site are sent to the offline router and are lost, making the site appear offline.

To configure your domain name to point to your project using `A` records:

1. Get the IP addresses of your project's production environment by running `dig +short $(platform environment:info edge_hostname)`.
2. Follow the instructions on [how to set up a custom domain](./_index.md).
   When you come to configuring your DNS provider, replace the suggested `CNAME` record
   with separate `A` records pointing from your domain to each of the IP addresses from step 1.
   Incoming DNS lookups pick one of those IP addresses at random to use for the given request (known as round-robin DNS).

{{< /codetabs >}}
