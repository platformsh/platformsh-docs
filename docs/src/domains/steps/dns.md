---
title: "DNS management and Apex domains"
weight: 1
description: "Platform.sh expects you to use a CNAME for all DNS records.  However, that is problematic with some DNS registrars."
sidebarTitle: "DNS and CNAMEs"
---

{{< description >}}

## Why CNAMEs?

Platform.sh is a cloud hosting provider.  That means each individual "site" is not its own computer but a set of containers running on one or more virtual machines, which are themselves running on any number of physical computers, all of which are shared with other customers running the same configuration.  An entire region of projects runs behind our dedicated, high-performance edge routers, which are responsible for mapping incoming requests to the particular container on a particular host that is appropriate.

All of that logic is quite robust and fast, but it does require that incoming requests all get sent first to the edge routers.  While the [IP addresses of the edge routers](/development/regions.md) are fairly stable, they are not guaranteed to never change.  We also may add or remove routers to help scale the region, or take them offline one at a time for upgrades and maintenance.  It is therefore critical that inbound requests always know what the IPs are of the edge routers at the time of the request.

All of Platform.sh's "edge hostnames" (the auto-generated URLs in the form `<branch>-<hash>-<project_id>.<region>.platformsh.site`) are DNS records we control that resolve to the IP addresses of the edge routers for that region.  If an edge router is updated, taken out of rotation, etc. then those domains will update quickly and automatically with no further action required.

An A record pointed at the same IP addresses would need to be updated manually every time an edge router changes or is temporarily offline.  That means every time Platform.sh is doing routine maintenance or upgrades on the edge routers there's a significant potential for a site to experience a partial outage if a request comes in for an offline edge router.

We don't want that.  You don't want that.  Using a CNAME DNS record pointing at the "edge hostname" will avoid that problem, as it will be updated almost immediately should our edge router configuration change.

## Why are CNAME records problematic?

The DNS specification was originally published in 1987 in [RFC 1034](https://tools.ietf.org/html/rfc1034) and [RFC 1035](https://tools.ietf.org/html/rfc1035), long before name-based HTTP hosting became prevalent.  Those RFCs plus the many follow-ups to clarify and expand on it are somewhat vague on the behavior of CNAME, but it's generally understood that an apex domain (`example.com`) may not be used as an alias in a CNAME record.  That creates a problem if you want to use an apex domain with any container-based managed hosting service like Platform.sh, because of the point above.

There's a [detailed thread](https://serverfault.com/questions/613829/why-cant-a-cname-record-be-used-at-the-apex-aka-root-of-a-domain) on the subject that provides more technical detail.

## Where should the CNAME point to?

You can access the CNAME target from your terminal by using the CLI and the command:

```bash
platform environment:info edge_hostname
```

## Handling Apex domains

There are a number of ways of handling the CNAME-on-Apex limitation of DNS.

### Using a DNS provider with custom records

Many DNS providers have found a way around the CNAME-on-Apex limitation.  Some DNS registrars now offer custom, non-standard records (sometimes called `ANAME` or `ALIAS`) that you can manage like a CNAME but will do their own internal lookup behind the scenes and then respond to DNS lookups as if they were an `A` record.  As these are non-standard their behavior (and quality) can vary, and not all DNS registrars offer such a feature.

If you want your site to be accessible with `https://example.com` and not only `https://www.example.com` this is the best way to do so.  Examples of such workaround records include:

 * CNAME Flattening at [CloudFlare](https://www.cloudflare.com/)
 * ANAME at [easyDNS](https://www.easydns.com/), [DNS Made Easy](http://www.dnsmadeeasy.com/), or [Name.com](https://www.name.com/)
 * ALIAS at [DNSimple](https://dnsimple.com/) or [Cloudns](https://www.cloudns.net/)

Platform.sh recommends ensuring that your DNS Provider supports dynamic apex domains before registering your domain name with them.  If you are using a DNS Provider that does not support dynamic apex domains then you will be unable to use `example.com` with Platform.sh, and will need to use only `www.example.com` (or similar) instead.

### (Alternate) Using a DNS provider with apex domain forwarding

If you are willing to make the `www.` version of your site the canonical version (which is recommended), some registrars or DNS providers may provide a domain redirect feature—also known as domain forwarding—from the apex domain `example.com` to `www.example.com`.  Before looking to change registrars, check whether your current provider supports both domain forwarding for the Apex *and* the DNS CNAME record to Platform.sh for the `www.` at the same time.  The following DNS providers are known to support both apex forwarding and advanced DNS configurations simultaneously:

* [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/385/2237/how-do-i-set-up-a-url-redirect-for-a-domain)

### (Alternate) Using a www redirection service

If your preferred registrar/DNS provider doesn't support either custom records or the apex domain forwarding options above, free services such as [WWWizer](http://wwwizer.com/) allow blind redirects and allow you to use a CNAME record to Platform.sh for `www.example.com` and an `A` record to their service at `example.com`, which will in turn send a redirect.

{{< note >}}
If using a redirection service, you must ensure that `http://example.com/` redirects to `http://www.example.com/`, not to `https://www.example.com/`.  (That is, the HTTP URL redirects to an HTTP URL, not to an HTTPS URL.)  Platform.sh will automatically redirect that request to the HTTPS itself.  Trying to change the protocol and domain in the same redirect will cause issues for Let's Encrypt and prevent the TLS certificate from being issued correctly.  The extra redirect adds only a millisecond or two to the first pageload only, and is imperceptible to most humans.
{{< /note >}}

### (Alternate) Using A records

If you absolutely cannot use a DNS provider that supports aliases or a redirection service, it is possible to use `A` records with Platform.sh.  They will result in a sub-optimal experience, however.

This process has a few limitations:

* Should we ever need to change one of those IPs your configuration will need to be manually updated.  Until it is some requests will be lost.
* Directly pointing at the edge routers bypasses their load-balancing functionality.  Should one of them go offline for maintenance (as happens periodically for upgrades) approximately 1/3 of requests to your site will go to the offline router and be lost, making the site appear offline.

{{< note theme=info title="none" >}}
For that reason using A records is _strongly discouraged_ and should only be used as a last resort.
{{< /note >}}

See the [Public IP](/development/regions.md) list for the 3 Inbound addresses for your region.  In your DNS provider, configure 3 separate A records for your domain, one for each of those IP addresses.  Incoming requests will then pick one of those IPs at random to use for that request (the so-called DNS round-robin).
