---
title: "Configure DNS"
weight: 3
toc: false
aliases:
  - "/gettingstarted/going-live/configure-dns.html"
---

The next step is to configure your DNS provider to point to the domain of your production environment on Platform.sh.

{{< asciinema src="videos/asciinema/cname-target.cast" >}}

You can access the `CNAME` target from your terminal by using the CLI and the command:

```bash
platform environment:info edge_hostname
```

If your registrar supports `CNAME` records for apex domains (such as `example.com`),
add a `CNAME` record from your desired domain (and it's `www` subdomain) to the value returned.
If your registrar doesn't support this or you want to know more, see more on [DNS and apex domains](../../../domains/steps/dns.md)

If your application is going to serve multiple domains, you need to add a `CNAME` record for each of them.

You can find out more information about using an apex domain and `CNAME` records
in the [Going Live documentation](/domains/steps/dns.md).

Depending on your registrar and the TTL you set for the domain,
it may take up to 72 hours for the DNS change to fully propagate across the Internet.

{{< guide-buttons next="I have configured my DNS provider">}}
