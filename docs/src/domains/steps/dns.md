---
title: "DNS management and Apex domains"
weight: 1
description: "Platform.sh expects you to use a CNAME for all DNS records. But that doesn't work with some DNS registrars."
sidebarTitle: "DNS and CNAMEs"
---

{{% description %}}

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

## Why are CNAME records problematic?

The DNS specification was originally published in 1987 in [RFC 1034](https://tools.ietf.org/html/rfc1034) and [RFC 1035](https://tools.ietf.org/html/rfc1035), long before name-based HTTP hosting became prevalent.
Those RFCs plus the many follow-ups to clarify and expand on it are vague on the behavior of CNAME, but it's generally understood that an apex domain like `example.com` can't be used as an alias for another hostname (CNAME record) but can only point to an IP-address (A record).
That creates a problem if you want to use an apex domain with any container-based managed hosting service like Platform.sh, because of the point above.

There's a [detailed thread](https://serverfault.com/questions/613829/why-cant-a-cname-record-be-used-at-the-apex-aka-root-of-a-domain) on the subject that provides more technical detail.

## What is an Apex domain

TODO add explanation
https://www.rfc-editor.org/rfc/rfc7719
and
https://platformsh.slack.com/archives/C02EQLVQ8QZ/p1664529313669029

For example if {{<variable "YOUR_DOMAIN" >}} is `example.com`, your APEX domain is `example.com`.
Some registrars only allow A-records for your APEX domain name `example.com`.
That means that `example.com` can only point to an IP address like `192.0.2.1` and can't point to another domain (or subdomain) like `www.example.com`.

## Where should the CNAME point to?

You can access the CNAME target from your terminal by using the [CLI](/administration/cli/_index.md) command:

```bash

platform environment:info edge_hostname
```

## Handling Apex domains

There are a number of ways of handling the CNAME-on-Apex limitation of DNS.

{{< codetabs >}}

---
title=Use custom records
file=none
highlight=false
---

Many DNS providers have found a way around the CNAME-on-Apex limitation and offer custom, non-standard records (sometimes called `ANAME` or `ALIAS`) that you can manage like a CNAME.
These non-standard records do an internal lookup behind the scenes and respond to DNS lookups as if they were `A` records.
As these are non-standard their behavior (and quality) can vary, and not all DNS registrars offer such a feature.

If you want your site to be accessible with `https://`{{<variable "YOUR_DOMAIN" >}} and not only `https://www.`{{<variable "YOUR_DOMAIN" >}} this is the best way to do so.

Examples of such workaround records include:

<!-- vale Platform.condescending = NO -->
* CNAME Flattening at [CloudFlare](https://www.cloudflare.com/)
* ANAME at [easyDNS](https://www.easydns.com/), [DNS Made Easy](http://www.dnsmadeeasy.com/), or [Name.com](https://www.name.com/)
* ALIAS at [DNSimple](https://dnsimple.com/) or [ClouDNS](https://www.cloudns.net/)
<!-- vale Platform.condescending = YES -->

Make sure that your registrar supports dynamic apex domains before registering your domain name with them.
If you are using a registrar that does not support dynamic apex domains then you aren't able to use {{<variable "YOUR_DOMAIN" >}} with Platform.sh, and can only use a subdomain like `www.`{{<variable "YOUR_DOMAIN" >}}.


<--->

---
title=Use domain forwarding
file=none
highlight=false
---

If you are willing to make the `www.` version of your site the canonical version (which is recommended), some registrars may provide a domain redirect feature—also known as domain forwarding—from the apex domain {{<variable "YOUR_DOMAIN" >}} to `www.`{{<variable "YOUR_DOMAIN" >}}.
Before looking to change registrars, check whether your current provider supports both domain forwarding for the Apex *and* the DNS CNAME record to Platform.sh for the `www.` at the same time.
The following DNS providers are known to support both apex forwarding and advanced DNS configurations simultaneously:

- [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/385/2237/how-to-redirect-a-url-for-a-domain/)

<--->

---
title=Use a `www` redirection service
file=none
highlight=false
---

If your preferred registrar doesn't support either custom records or the apex domain forwarding options above, free services such as [WWWizer](http://wwwizer.com/) allow blind redirects and allow you to use a CNAME record to Platform.sh for `www.`{{<variable "YOUR_DOMAIN" >}} and an `A` record to their service at `{{<variable "YOUR_DOMAIN" >}}`, which in turn sends a redirect.

{{< note >}}
If using a redirection service, you must ensure that `http://`{{<variable "YOUR_DOMAIN" >}} redirects to `http://www.`{{<variable "YOUR_DOMAIN" >}}, not to `https://www.`{{<variable "YOUR_DOMAIN" >}}. A HTTP URL redirects to a HTTP URL, not to an HTTPS URL.
Platform.sh automatically redirects that request to HTTPS itself. Trying to change the protocol and domain in the same redirect causes issues for Let's Encrypt and prevents the TLS certificate from being issued correctly.
The extra redirect adds only a millisecond or two to the first page load only, and is imperceptible to most humans.
{{< /note >}}

<--->

---
title=Use A records
file=none
highlight=false
---

Using A records is _strongly discouraged_ and should only be used as a last resort.
If you absolutely can't use a registrar that supports aliases or a redirection service, it's possible to use `A` records with Platform.sh.

This process has a few limitations:

* If the IPs change, your configuration needs to be manually updated. Until then some requests are lost.
* Directly pointing at the edge routers bypasses their load-balancing functionality. Should one of them go offline for maintenance (as happens periodically for upgrades) approximately 1/3 of requests to your site are sent to the offline router and are lost, making the site appear offline.

See the [Public IP](/development/regions.md) list for the 3 Inbound addresses for your region. In your DNS provider, configure 3 separate A records for your domain, one for each of those IP addresses. Incoming requests pick one of those IPs at random to use for that request (the so-called DNS round-robin).

{{< /codetabs >}}
