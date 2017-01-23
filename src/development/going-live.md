# Going Live

There's a few short steps to go through to launch a site into production on Platform.sh.

## Prerequisites

This page assumes you already have the following:

1) Your site is running and configured as you want it to be, on your master branch.  In particular, see the [Routes documentation](/configuration/routes.md). You will need your routes configured appropriately before you begin.
2) You have a domain name registered for your site with a Registrar of your choice. The registrar must allow you to use CNAMEs for your domain.  (Some registrars may call these Aliases or similar.)
3) If your domain is currently active elsewhere, the Time-To-Live (TTL) on your domain is set to the lowest possible value in order to minimize transition time.
4) You have the auto-generated domain for your master branch.  This is the domain you see in the Location bar after selecting "Access site" in the UI.  You can also retrieve this value from the command line by running `platform environment:url` to see a list of all URLs that Platform.sh will serve for the current environment.  Write this down.
5) Optional: If you want to guarantee that you have access to  your master environment before the domain name has switched over, use `ping` or any similar tool to determine the IP address of the master environment.  The IP address is not guaranteed stable but is unlikely to change during the course of the go-live process.

## Set your domain

First step is to [add your domain](/administration/web/configure-project.html#domains).

You can add multiple domains to point to your project. Each domain can have its own [SSL certificate](/development/going-live/ssl.md).

After you have added your domain, your Master environment will no longer be accessible at `<environment>-<project>.<region>.platform.sh`.

If you require access to the site before the domain name becomes active you can create a hosts file entry and point it to the IP address that resolves when you access your master project branch.

> **note**
> If you are on a Development plan, you cannot add a domain. You would need to upgrade your subscription to a production plan.


## Configure your DNS provider

Configure your DNS provider to point your domain to your Platform.sh Master environment.

The way to do so will vary somewhat depending on your registrar, but nearly all registrars should allow you to set a CNAME.  Some will call it an Alias or similar alternate name, but either way the intent is to say "this domain should always resolve to... this other domain".  Add a CNAME record from your desired domain (`example.com`) to the master environment hostname you wrote down earlier.

If you use multiple domain names for your site, such as `www.example.com` and `example.com`, you'll need to add a CNAME for each of them.

Note that depending on your registrar and the TTL you set, it could take anywhere from 15 minutes to 12 hours for the DNS change to fully propagate across the Internet.

## Example setup

For example, suppose your project ID is `abc123` in the US region, and you've registered `mysite.com`.  You want `www.mysite.com` to be the "real" site and `mysite.com` to redirect to it.

### Configure `routes.yaml`

First, configure your `routes.yaml` file like so:

```yaml
"http://www.{default}/":
  type: upstream
  upstream: "app:http"
"http://{default}/":
  type: redirect
  to: "http://www.{default}/"
```

That will result in two domains being created on Platform.sh: `master-def456-abc123.us.platform.sh` and `www---master-def456-abc123.us.platform.sh`.  The former will automatically redirect to the latter.  In the `routes.yaml` file, `{default}` will automatically be replaced with `master-def456-abc123.us.platform.sh`.  In domain prefixes (like `www`), the `.` will be replaced with `---`.

### Set your domain

Now, add a single domain to your Platform.sh project for `mysite.com`.  As soon as you do, Platform.sh will no longer serve `master-def456-abc123.us.platform.sh` at all.  Instead, `{default}` in `routes.yaml` will be replaced with `mysite.com` anywhere it appears when generating routes to respond to.

### Configure your DNS provider

On your DNS provider, you would create two CNAMEs:

`mysite.com` should be a CNAME to `www---master-def456-abc123.us.platform.sh`.
`www.mysite.com` should be a CNAME to `www---master-def456-abc123.us.platform.sh`.

(Yes, both point to the same place.)

### Result

Now, an incoming request for `mysite.com` will result in the following:

1) Your browser asks the DNS network for `mysite.com`'s DNS record.  It responds with "it's an alias for `www---master-def456-abc123.us.platform.sh`".
2) your browser asks the DNS network for `www---master-def456-abc123.us.platform.sh`'s DNS record.  It responds with "that's IP address 1.2.3.4".  (Or whatever the actual address is.)
3) Your browser sends a request to `1.2.3.4` for domain `mysite.com`.
4) Your router responds with an HTTP 301 redirect to `www.mysite.com`.
5) Your browser looks up `www.mysite.com` and, as above, gets an alias for `www---master-def456-abc123.us.platform.sh`, which is IP 1.2.3.4.
6) Your browser sends a request to `1.2.3.4` for domain `www.mysite.com`.  Your router passes the request through to your application which in turn responds with whatever it's supposed to do.

On subsequent requests, your browser will know to simply connect to `1.2.3.4` for domain `www.mysite.com` and skip the rest.  The entire process takes only a few milliseconds.

## Old Stuff, is it relevant?

Once you've checked with your registrar about where to change your DNS settings, add a CNAME record that references the Master environment's hostname: `<environment>-<project>.<region>.platform.sh`, in which `<environment>` is the **machine name** of the environment. The best way to find the machine name is to use `platform environment:info`.

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
