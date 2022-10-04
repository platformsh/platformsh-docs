---
title: "DNS management and Apex domains"
weight: 1
description: "Platform.sh expects you to use a CNAME for all DNS records. But that doesn't work with some DNS registrars."
sidebarTitle: "DNS and CNAMEs"
---

{{% description %}}

## Why are CNAME records problematic?

The DNS specification was originally published in 1987, long before name-based HTTP hosting became prevalent.
In the multiple RFCs that were written regarding CNAMES, the description of the behavior of CNAME records is rather vague.

It's generally understood that a CNAME record for an apex domain like `example.com`:

* Can only point to an IP-address like `192.0.2.1` (A record).
* Can't be used as an alias for another hostname like `www.example.com` (CNAME record). That is problematic if you want to use an apex domain with any container-based managed hosting service like Platform.sh.

More information can be found in:

* [RFC 1034](https://tools.ietf.org/html/rfc1034)
* [RFC 1035](https://tools.ietf.org/html/rfc1035)
* [Detailed thread on serverfault.com](https://serverfault.com/questions/613829/why-cant-a-cname-record-be-used-at-the-apex-aka-root-of-a-domain).

## Where should CNAME records point to?

You can access the CNAME target from your terminal by using the [CLI](/administration/cli/_index.md) command:

```bash
platform environment:info edge_hostname
```

## What is an Apex domain?

An apex domain is a domain name that doesn't include a subdomain.
For example if {{<variable "YOUR_DOMAIN" >}} is `example.com`:

* Your apex domain is `example.com`
* `www.example.com` is the `www` subdomain of your apex domain.

More about DNS terminology can be found in [RFC 7719](https://www.rfc-editor.org/rfc/rfc7719).

## Handling Apex domains

Some registrars only allow A records for apex domains.
This is the so-called [CNAME-on-apex-domain-limitation](#why-are-cname-records-problematic).

That means that `example.com` can only point to an IP address like `192.0.2.1` (A record) and can't point to another domain (or subdomain) like `www.example.com` (CNAME record).

Make sure that your registrar supports CNAME (or similar dynamic redirect) records on apex domains before registering your domain name with them.

If you are using a registrar that doesn't support dynamic apex domains then you aren't able to directly use {{<variable "YOUR_DOMAIN" >}} with Platform.sh, and can only use a subdomain like `www.`{{<variable "YOUR_DOMAIN" >}}.

There are a number of ways of handling the CNAME-on-apex-domain-limitation.
The recommended approach is to use custom records.

{{< codetabs >}}

---
title=Use custom records
file=none
highlight=false
---

Some DNS providers offer custom, non-standard records (sometimes called `ANAME` or `ALIAS`) that you can manage like a CNAME.
These non-standard records do an internal lookup behind the scenes and respond to DNS lookups as if they were `A` records.
As these are nonstandard, their behavior (and quality) can vary and not all DNS registrars offer such a feature.

If you want your site to be accessible with `https://`{{<variable "YOUR_DOMAIN" >}} and not only `https://www.`{{<variable "YOUR_DOMAIN" >}},
this is the best way to do so.

Check your provider's documentation to find out how to set up these DNS records.

Examples of such workaround records and providers include:

<!-- vale Platform.condescending = NO -->
* CNAME Flattening at [CloudFlare](https://developers.cloudflare.com/dns/additional-options/cname-flattening)
* ANAME at [easyDNS](https://easydns.com/features/aname-root-domain-alias/), [DNS Made Easy](https://support.dnsmadeeasy.com/support/solutions/articles/47001001412-aname-records), or [Name.com](https://www.name.com/support/articles/115010493967-adding-an-aname-alias-record)
* ALIAS at [DNSimple](https://support.dnsimple.com/articles/alias-record/) or [ClouDNS](https://www.cloudns.net/wiki/article/18/)
<!-- vale Platform.condescending = YES -->

<--->

---
title=Use domain forwarding
file=none
highlight=false
---

If you are willing to make the `www.` version of your site the default (canonical) version, some registrars provide a domain redirect feature (domain forwarding).

This will redirect all requests from {{<variable "YOUR_DOMAIN" >}} to `www.`{{<variable "YOUR_DOMAIN" >}}.
Make sure to configure [your routes accordingly](../../define-routes/_index.md).

Check your provider's documentation to find out how to set up the forwarding of the apex domain to the `www.` subdomain.

The following DNS providers are known to support both apex forwarding and advanced DNS configurations simultaneously:

* [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/385/2237/how-to-redirect-a-url-for-a-domain/)

<--->

---
title=Use a `www` redirection service
file=none
highlight=false
---

A redirection service uses an A-record to redirect all requests
from {{<variable "YOUR_DOMAIN" >}} to `www.`{{<variable "YOUR_DOMAIN" >}}.

Examples of such redirection services:
* [WWWizer](http://wwwizer.com/naked-domain-redirect)

Use a `www` redirection service if your preferred registrar doesn't support either:

* Custom records
* Apex domain forwarding options

Check your provider's documentation to find out how to set up these DNS records.

To use a redirection service you need to:

* Create an A-record pointing from {{<variable "YOUR_DOMAIN" >}} to the redirection service. For WWWizer that's the IP `174.129.25.170`.
* In your registrar's domain management system, create an CNAME record that points from `www.`{{<variable "YOUR_DOMAIN" >}} to your [CNAME target](_index.md#1-get-the-cname-target-of-your-project).

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

Using A records is _strongly discouraged_ and should only be used as a last resort.

Using A-records has limitations:

* If the IPs change, you need to manually update your configuration.
  Until then some requests are lost.
* Directly pointing at the edge routers bypasses their load-balancing functionality. Should one of them go offline for maintenance (as happens periodically for upgrades) approximately 1/3 of requests to your site are sent to the offline router and are lost, making the site appear offline.

Find the 3 Inbound addresses for your region in the [public IP addresses list](../../development/regions.md#public-ip-addresses).
With your DNS provider, configure 3 separate A records for your domain, one for each of those IP addresses.
Check your provider's documentation to find out how to set up these DNS records.
Incoming DNS lookups pick one of those IPs at random to use for the given request (known as round-robin DNS).

{{< /codetabs >}}

## Why CNAME records?

Platform.sh is a cloud hosting provider.
Each individual hosted "site" is a set of containers running on one or more virtual machines,
which are themselves running on any number of physical computers, all of which are shared with other customers running the same configuration.
An entire region of projects runs behind dedicated, high-performance edge routers,
which are responsible for mapping incoming requests to the particular container on a particular host that is appropriate.

That logic requires incoming requests to get sent to the edge routers first.
While the [IP addresses of the edge routers](/development/regions.md) are fairly stable, they aren't guaranteed to never change.
To help scale a region, routers can be added or removed.
For upgrades and maintenance, routers can get taken offline one at a time.
It's therefore critical that inbound requests always know what the IPs are of the edge routers at the time of the request.

The Platform.sh "edge hostnames" are DNS records that resolve to the IP addresses of the edge routers for that region.
They are auto-generated URLs in the form `<branch>-<hash>-<project_id>.<region>.platformsh.site`.

If an edge router is updated, taken out of rotation, etc. then those domains are updated automatically with no action required from you.

An A record pointed at the same IP addresses needs to be updated manually every time an edge router changes or is temporarily offline.
That means every time Platform.sh is doing routine maintenance or upgrades on the edge routers there's a significant potential for a site to experience a partial outage if a request comes in for an offline edge router.

An A record pointed at the same IP addresses needs to be updated manually by you every time an edge router changes or is temporarily offline.

That means every time Platform.sh is doing routine maintenance or upgrades on the edge routers there's a significant potential for a site to experience a partial outage if a request comes in for an offline edge router.

Using a CNAME DNS record pointing at the "edge hostname" avoids that problem, as it updates almost immediately should our edge router configuration change.

## Example incoming request to your app

With the assumptions that:

* your apex domain allows CNAME records,
* all caches are empty,
* your router redirects the apex domain to the `www` subdomain, as specified in your [routes definition](../../define-routes/_index.md)

An incoming request where {{<variable "YOUR_DOMAIN" >}} is `example.com` results in the following:

1. Your browser asks the DNS root servers for `example.com`'s DNS record.
   The DNS root server responds with the CNAME for `main-def456-abc123.eu-2.platformsh.site`,
   which itself resolves to the A record (IP address) `192.0.2.1`.
2. Your browser sends a request to `192.0.2.1` for domain `example.com`.
3. Your router responds with an HTTP 301 redirect to `www.example.com`.
4. Your browser looks up `www.example.com` and, as in step 1, receives an alias for `main-def456-abc123.eu-2.platformsh.site`, which resolves to the IP address `192.0.2.1`.
5. Your browser sends a request to `192.0.2.1` for the domain `www.example.com`.
  Your router passes the request to your app, which responds as you have set.

On subsequent requests, your browser knows to connect to `192.0.2.1` for the domain `example.com` and skips the rest.
The entire process takes only a few milliseconds.
