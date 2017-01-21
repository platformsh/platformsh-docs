# Going Live

Here are the steps you need to follow when your site is ready to go
live.

## 1 - Domains

First step is to [add your domain](/administration/web/configure-project.html#domains).

You can add multiple domains to point to your project. Each domain can
have its own SSL certificate.

After you have added your domain, your Master environment will no longer
be accessible at `master-<project_id>.<cluster>.platform.sh`.

If you require access to the site, you can create a hosts file entry and
point it to the IP address that resolves when you access your master
project branch.

> **note**
> If you are on a Development plan, you cannot add a domain. You would need to upgrade your subscription to a production plan.

## 2 - Routes

You can configure the routes of your project directly within the
Web Interface or within your `.platform/routes.yaml` file.

### Single hostname

If you want your site to only be available at `http://mydomain.com` and
have `http://www.mydomain.com` redirect to `http://mydomain.com`, you
need define your `routes.yaml` as follow:

```yaml
"http://{default}/":
    type: upstream
    upstream: "app:http"

"http://www.{default}/":
    type: redirect
    to: "http://{default}/"
```

### Multiple hostnames

If you want your site to be available at both `http://mydomain.com` and
`http://www.mydomain.com`, you need to define one upstream for each
hostname.

Here would be an example of your `routes.yaml` for the
`http://mydomain.com` URL:

```yaml
"http://{default}/":
    type: upstream
    upstream: "app:http"

"http://www.{default}/":
    type: upstream
    upstream: "app:http"
```

> **note**
> You can test those routes on your development environments with:
> * `http://[branch]-[project-id].[region].platform.sh`
> * `http://www-[branch]-[project-id].[region].platform.sh`


### Wildcard domains

To configure a wildcard domain (*.mydomain.com):

- Add your domain to your project (in form of mydomain.com).
- Add a route to your master branch serving `http://*.mydomain.com` with the upstream app:http.


## 3 - DNS

Configure your DNS provider to point your domain to your
[Platform.sh](https://platform.sh) Master environment.

Once you've checked with your registrar about where to change your DNS
settings, add a CNAME record that references the Master environment's
hostname: `<environment>-<project>.<region>.platform.sh` in which
`<environment>` is the **machine name** of the environment. The best way
to find the machine name is to use `platform environment:info`.

If you use multiple hostnames for your site, you need to add a CNAME
record for each of them. For example:
`master-k4ywtmwigmmgc.eu.platform.sh` and
`www-master-k4ywtmwigmmgc.eu.platform.sh`.

Note: This will **not** work for an apex (or "naked") domain. In that
case, you need to use a DNS provider that supports forwarding DNS
queries (such as the [CNAME with ALIAS record from
Dyn](https://help.dyn.com/standard-dns/), or the ANAME
record on [DNS Made
Easy](http://www.dnsmadeeasy.com/services/anamerecords/)). Many other
providers also offer work arounds to accomplish this goal. The most common is
to add a CNAME record for the `www` host on the domain and then use the
DNS provider's redirection service to redirect the apex over to the
`www` version of the domain. Check with your DNS provider to see how
they support this.

### Naked domain (without www)

The www portion of your domain is a subdomain. In fact, any part of your
domain that precedes domain.tld can be called a subdomain, not just
“obvious” subdomains like shop.domain.tld.

One of the challenges of using a cloud hosting service like Amazon Web
Services (AWS) Elastic Cloud (EC2) is that you need to point your DNS to
a CNAME. The problem is the DNS RFC (RFC1033) requires the "zone apex"
(sometimes called the "root domain" or "naked domain") to be an "A
Record," not a CNAME. This means that with most DNS providers you can
setup a subdomain CNAME to point to EC2, but you cannot setup your root
domain as a CNAME to point to EC2.

In other words, with most DNS providers:

  ----------------- ------------------- ------ ----------------------------------------------
  you can do this   `www.domain.tld`    CNAME  `<environment>-<project>.<region>.platform.sh`
  you can't do this `domain.tld`        CNAME  `<environment>-<project>.<region>.platform.sh`
  ----------------- ------------------- ------ ----------------------------------------------

You also cannot reliably point your root A Record to an IP address
within the cloud providers network since they reserve the right to
reallocate the IP address dedicated to your instance.

Some DNS hosts provide a way to get CNAME-like functionality at the zone
apex using a custom record type. Such records include:

-   ALIAS at [DNSimple](https://dnsimple.com/)
-   ANAME at [DNS Made Easy](http://www.dnsmadeeasy.com/)
-   ANAME at [easyDNS](https://www.easydns.com/)
-   ACNAME at [CloudFlare](https://www.cloudflare.com/)
-   ALIAS at [PointDNS](https://pointhq.com/)

These ALIAS/CNAME/ANAME records resolves on request the IP address of
the destination record and serves it as if it would be the IP address
for the apex domain requested. If the IP address for the destination
changes, the IP address for the mapped domain changes automatically as
well.
