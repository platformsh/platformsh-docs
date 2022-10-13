---
title: "DNS management and apex domains"
weight: 1
description: See why CNAME records are used and what to do if your DNS registrar doesn't support them for apex domains.
sidebarTitle: "DNS and CNAMEs"
---

Platform.sh expects you to use CNAME records for most DNS records.
But that doesn't work with some DNS registrars.
Learn why they're recommended and what else you can do.

## Why CNAME records are problematic

The DNS specification was originally published in 1987, long before name-based HTTP hosting became prevalent.
In the multiple RFCs that were written regarding CNAME records, the description of their behavior is rather vague.

It's generally understood that a CNAME record for an apex domain like `example.com`:

- Can only point to an IP address like `192.0.2.1` (an A record).
- Can't be used as an alias for another hostname like `www.example.com` (a CNAME record).

The CNAME limitation (point 2) is especially problematic if you want to use an apex domain with any container-based managed hosting service like Platform.sh.

Many registrars allow CNAME records for apex domains.
If yours doesn't, several solutions exist [to bypass that limitation](#handling-apex-domains).

More information can be found in:

* [RFC 1034](https://tools.ietf.org/html/rfc1034)
* [RFC 1035](https://tools.ietf.org/html/rfc1035)
* [Detailed thread on serverfault.com](https://serverfault.com/questions/613829/why-cant-a-CNAME-record-be-used-at-the-apex-aka-root-of-a-domain).

## Where CNAME records should point

You can access the CNAME target from your terminal by using the [CLI](/administration/cli/_index.md) command:

```bash
platform environment:info edge_hostname
```

## What an Apex domain is

An apex domain is a domain name that doesn't include a subdomain.

For example, `example.com` is an apex domain and `www.example.com` is a subdomain.

## Handling Apex domains

Some registrars don't allow CNAME records for [apex domains](#what-is-an-apex-domain).
This is one of the [limitations to CNAME records](#why-CNAME-records-are-problematic).

That means that `example.com` can only point to an IP address like `192.0.2.1` (A record) and can't point to another domain (or subdomain) like `www.example.com` (CNAME record).

Check your registrar's documentation to make sure that CNAME records on apex domains are supported.
If your registrar supports them, follow the [guide to using such records](../steps/_index.md).
If your registrar doesn't support them, there are a number of ways to handle the limitation.

The recommended approach is to use custom records.

If you are using a registrar that doesn't support either CNAME record on apex domains or custom records, then you aren't able to directly use {{<variable "YOUR_DOMAIN" >}} with Platform.sh, and can only use a subdomain like `www.`{{<variable "YOUR_DOMAIN" >}}.

{{< codetabs >}}

---
title=Use custom records
file=none
highlight=false
---

Some DNS providers offer custom, non-standard records (sometimes `ANAME` or `ALIAS` records) that you can manage like CNAME records.
These nonstandard records make an internal lookup behind the scenes and respond to DNS lookups as if they were `A` records.
As these are nonstandard, their behavior (and quality) can vary and not all DNS registrars offer such a feature.

If you want your site to be accessible at a URL like `https://example.com` and not only `https://www.example.com`,
this is the best way to do so.

Configure your domain name to point to your project using custom records:

1. Get your [target](_index.md#1-get-the-cname-target-of-your-project).
2. Open your registrar's domain management system.
3. Check your provider's documentation to find out how to add or edit DNS records.
4. Add a CNAME record pointing from `www.`{{<variable "YOUR_DOMAIN" >}} to the target.
5. Add an ANAME/ALIAS record pointing from {{<variable "YOUR_DOMAIN" >}} to the target.

Examples of such workaround records and providers include:

<!-- vale Platform.condescending = NO -->
* CNAME flattening at [CloudFlare](https://developers.cloudflare.com/dns/additional-options/cname-flattening)
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

Domain forwarding redirects all requests from {{<variable "YOUR_DOMAIN" >}} to `www.`{{<variable "YOUR_DOMAIN" >}}.

If you make the `www.` version of your site the default (canonical) version, some registrars provide a domain redirect feature (domain forwarding).

Configure your domain name to point to your project using domain forwarding:

1. Make sure that you configure your routes to [use the `www` subdomain as upstream](../../define-routes/_index.md).
2. Get your [target](_index.md#1-get-the-cname-target-of-your-project).
3. Open your registrar's domain management system.
4. Check your provider's documentation to find out how to set up the forwarding of the apex domain to the `www.` subdomain.
5. Add a CNAME record pointing from `www.`{{<variable "YOUR_DOMAIN" >}} to the target.
6. Add a record forwarding requests from {{<variable "YOUR_DOMAIN" >}} to `www.`{{<variable "YOUR_DOMAIN" >}}.


The following DNS providers are known to support both domain forwarding and advanced DNS configurations:

* [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/385/2237/how-to-redirect-a-url-for-a-domain/)

<--->

---
title=Use a `www` redirection service
file=none
highlight=false
---

If your registrar doesn't support custom records or domain forwarding you can consider using a redirection service.

A redirection service uses an A record to redirect all requests
from {{<variable "YOUR_DOMAIN" >}} to `www.`{{<variable "YOUR_DOMAIN" >}}.

One such redirection service is [[WWWizer](http://wwwizer.com/naked-domain-redirect).

Configure your domain name to point to your project using a redirection service:

1. Make sure that you configure your routes to [use the `www` subdomain as upstream](../../define-routes/_index.md).
2. Get your [target](_index.md#1-get-the-cname-target-of-your-project).
3. Open your registrar's domain management system.
4. Check your provider's documentation to find out how to add or edit DNS records.
5. Add a CNAME record pointing from `www.`{{<variable "YOUR_DOMAIN" >}} to the target.
6. Add an A record pointing from {{<variable "YOUR_DOMAIN" >}} to the redirection service. For WWWizer that's the IP `174.129.25.170`.

You must ensure that your redirects use the same protocol:
`http://`{{<variable "YOUR_DOMAIN" >}} redirects to `http://www.`{{<variable "YOUR_DOMAIN" >}}, not to `https://www.`{{<variable "YOUR_DOMAIN" >}}.
Redirects from `http` to `https` are handled automatically.
Trying to change the protocol and domain in the same redirect causes issues for Let's Encrypt and prevents the TLS certificate from being issued correctly.

The extra redirect adds a few milliseconds to the first page load.

<--->

---
title=Use A records
file=none
highlight=false
---

If your registrar doesn't support custom records, domain forwarding, or a redirection service you can consider using A records.

Using A records is _strongly discouraged_ and [should only be used as a last resort](#why-cname-records).

Using A records has limitations:

* If the IPs change, you need to manually update your configuration.
  Until you do, some requests are lost.
* Directly pointing at the edge routers bypasses their load-balancing functionality.
  Should one of them go offline for maintenance (as happens periodically for upgrades),
  about 1/3 of requests to your site are sent to the offline router and are lost, making the site appear offline.

Configure your domain name to point to your project using A records:

1. Get the IP's of your project's production environment by running `dig +short $(platform environment:info edge_hostname)`.
2. Copy all IP addresses (usually 1-3) that are returned.
3. Open your registrar's domain management system.
4. Check your provider's documentation to find out how to add or edit DNS records.
5. Add separate A records pointing from {{<variable "YOUR_DOMAIN" >}} to each of the IP addresses from Step 1.
    Incoming DNS lookups pick one of those IPs at random to use for the given request (known as round-robin DNS).

{{< /codetabs >}}

## Why CNAME records?

Each site on Platform.sh is made up of a set of containers.
Platform.sh runs routers for each region to map incoming requests to the appropriate container.

The IP addresses for the routers in [each region](../../development/regions.md) are fairly stable.
They can change in two cases:

* To up- or downscale a region.
  Routers are added or removed.
* For upgrades and maintenance.
  Routers are taken offline, one at a time, to apply the changes.

For inbound requests to be forwarded to the right container, the requests need to know the IPs of the routers at the time of the request.
Since the IPs of the routers can change, "edge hostnames" are used as aliases.
Edge hostnames dynamically resolve to the IP addresses of the edge routers for a given region.
They are auto-generated URLs in the form `<branch>-<hash>-<project_id>.<region>.platformsh.site`.

For example, when a router is updated the edge hostnames are updated accordingly.
If your apex domain and your `www` subdomain point to these edge hostnames, you don't need to do anything.
If you are using A records instead of these edge hostnames, the IP addresses aren't updated automatically: the incoming requests can be forwarded to an offline router. This means that your website can appear temporarily offline unless you manually update your A records.

Using a CNAME DNS record pointing at the "edge hostname" avoids that problem, as it updates almost immediately should the edge router configuration change.

## Example of an incoming request to your app

With the assumptions that:

* Your registrar allows CNAME records and you have them configured for your apex domain.
* All caches are empty.
* Your router redirects your apex domain to the `www` subdomain, as specified in your [routes definition](../../define-routes/_index.md).

An incoming request to `example.com` is handled in the following way:

1. Your browser asks a DNS root server for the DNS record for `example.com`.
   The DNS root server responds with the CNAME for `main-def456-abc123.eu-2.platformsh.site`,
   which itself resolves to an A record with an IP address, for example `192.0.2.1`.
2. Your browser sends a request to `192.0.2.1` for the domain `example.com`.
3. Your router responds with an HTTP 301 redirect to `www.example.com`.
4. Your browser looks up `www.example.com` and, as in step 1, receives an alias for `main-def456-abc123.eu-2.platformsh.site`, which resolves to the IP address `192.0.2.1`.
5. Your browser sends a request to `192.0.2.1` for the domain `www.example.com`.
   Your router passes the request to your app, which responds as you have configured it to.

On subsequent requests, your browser knows to connect to `192.0.2.1` for the domain `example.com` and skips the rest.
The entire process takes only a few milliseconds.
