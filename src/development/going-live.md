# Going Live

There's a few short steps to go through to launch a site into production on Platform.sh.

## Prerequisites

This page assumes you already have the following:

1. Your site is running and configured as you want it to be, on your master branch.  In particular, see the [Routes documentation](/configuration/routes.md). You will need your routes configured appropriately before you begin.
2. You have a domain name registered for your site with a Registrar of your choice. The registrar must allow you to use CNAMEs for your domain.  (Some registrars may call these Aliases or similar.)
3. If your domain is currently active elsewhere, the Time-To-Live (TTL) on your domain is set to the lowest possible value in order to minimize transition time.
4. You have the auto-generated domain for your master branch.  This is the domain you see in the Location bar after selecting "Access site" in the UI.  You can also retrieve this value from the command line by running `platform environment:url` to see a list of all URLs that Platform.sh will serve for the current environment.  Write this down.
5. Optional: If you want to guarantee that you have access to  your master environment before the domain name has switched over, use `ping` or any similar tool to determine the IP address of the master environment.  The IP address is not guaranteed stable but is unlikely to change during the course of the go-live process.
6. Optional: If you want to use an SSL certificate to encrypt your production site (you do), you can obtain one from any number of 3rd party SSL issuers.  Platform.sh does not charge anything to use SSL in production, although at this time we do not issue our own certificates.

## Set your domain

First step is to [add your domain](/administration/web/configure-project.html#domains).

You can add multiple domains to point to your project. Each domain can have its own [SSL certificate](/development/going-live/ssl.md).

After you have added your domain, your Master environment will no longer be accessible at `<environment>-<project>.<region>.platform.sh`.

If you require access to the site before the domain name becomes active you can create a hosts file entry and point it to the IP address that resolves when you access your master project branch.

> **note**
> If you are on a Development plan, you cannot add a domain. You would need to upgrade your subscription to a production plan.


## Configure your DNS provider

Configure your DNS provider to point your domain to your Platform.sh Master environment.

The way to do so will vary somewhat depending on your registrar, but nearly all registrars should allow you to set a CNAME.  Some will call it an Alias or similar alternate name, but either way the intent is to say "this domain should always resolve to... this other domain".  Add a CNAME record from your desired domain (`www.example.com`) to the master environment hostname you wrote down earlier.

If you have multiple domains you want to be served by the same application you will need to add a CNAME record for each of them.

Note that depending on your registrar and the TTL you set, it could take anywhere from 15 minutes to 12 hours for the DNS change to fully propagate across the Internet.

### Apex domains

One of the challenges of using a cloud hosting service like Amazon Web Services (AWS) Elastic Cloud (EC2) is that you need to point your DNS to a CNAME. The problem is the DNS RFC (RFC1033) requires the "zone apex" (sometimes called the "root domain" or "naked domain") to be an "A Record," not a CNAME. Some DNS providers allow you to do so anyway while others do not. Some provide an alternative means of registering an indirect apex domain.

In other words, with many DNS providers:

----------------- ------------------- ------ ----------------------------------------------
you can do this   `www.domain.tld`    CNAME  `<environment>-<project>.<region>.platform.sh`
you can't do this `domain.tld`        CNAME  `<environment>-<project>.<region>.platform.sh`
----------------- ------------------- ------ ----------------------------------------------

However, using an A Record is not possible as the IP address of the server may change from time to time, especially with frequent redeployments as in Platform.sh's case.

Many DNS providers offer workarounds for apex domains pointing to non-IP addresses.  Such records include:

* ACNAME at [CloudFlare](https://www.cloudflare.com/)
* ANAME at [easyDNS](https://www.easydns.com/)
* ANAME at [DNS Made Easy](http://www.dnsmadeeasy.com/)
* ALIAS at [DNSimple](https://dnsimple.com/)
* @ records at [PairNIC.com](https://www.pairnic.com/)
* ALIAS at [PointDNS](https://pointhq.com/)

These ALIAS/CNAME/ANAME records resolves on request the IP address of the destination record and serves it as if it would be the IP address for the apex domain requested. If the IP address for the destination
changes, the IP address for the mapped domain changes automatically as well.

Platform.sh recommends ensuring that your DNS Provider supports dynamic apex domains before registering your domain name with them.  If you are using a DNS Provider that does not support dynamic apex domains then you will be unable to use `example.com` with Platform.sh, and will need to use only `www.example.com` (or similar) instead.

## SSL in Production

Platform.sh fully supports using SSL certificate in production and strongly encourages all of our customers to do so.  We do not charge for SSL support.  We do not at this time issue our own SSL certificates but you can "bring your own" from the SSL issuer of your choice.  Please consult your SSL issuer for instructions on how to generate an SSL certificate.

A BYO-certificate is not necessary for development environments.  Platform.sh provides wildcard certificates that covers all *.platform.sh domains, including development environments.

Platform.sh supports all kinds of certificates including domain-validated certificates, extended validation (EV) certificates, high-assurance certificates and wildcard certificates.

> **note**
> Private key should be in the old style, which means it should begin with BEGIN RSA PRIVATE KEY. If it starts with BEGIN PRIVATE KEY that means it is bundled with the identifier for key type. To convert it to the old style RSA key:
> openssl rsa -in private.key -out private.rsa.key

### Use the Platform.sh Web Interface to add the certificate

You can also add your certificate via the Platform.sh [Web Interface](/administration/web.md). Just go to the [project configuration page](/administration/web/configure-project.md) in the web interface and click on Domains. If you already have a domain, you can edit the domain and then click on the Add SSL certificate button. You can then add your private key, public key certificate and optional certificate chain.

![UI configuration for SSL](/images/ui-ssl.png)

### Use the Platform.sh CLI to add the certificate

Example:
```bash
platform domain:add secure.example.com --cert=/etc/ssl/private/secure-example-com.crt --key=/etc/ssl/private/secure-example-com.key
```

See `platform help domain:add` for more information.


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

`mysite.com` should be a redirect to `master-def456-abc123.us.platform.sh`.
`www.mysite.com` should be a CNAME to `master-def456-abc123.us.platform.sh`.

(Yes, both point to the same place.)  See the note above regarding how different registrars handle dynamic apex domains.

### Result

Now, an incoming request for `mysite.com` will result in the following:

1) Your browser asks the DNS network for `mysite.com`'s DNS record.  It responds with "it's an alias for `www---master-def456-abc123.us.platform.sh`".
2) your browser asks the DNS network for `www---master-def456-abc123.us.platform.sh`'s DNS record.  It responds with "that's IP address 1.2.3.4".  (Or whatever the actual address is.)
3) Your browser sends a request to `1.2.3.4` for domain `mysite.com`.
4) Your router responds with an HTTP 301 redirect to `www.mysite.com`.
5) Your browser looks up `www.mysite.com` and, as above, gets an alias for `www---master-def456-abc123.us.platform.sh`, which is IP 1.2.3.4.
6) Your browser sends a request to `1.2.3.4` for domain `www.mysite.com`.  Your router passes the request through to your application which in turn responds with whatever it's supposed to do.

On subsequent requests, your browser will know to simply connect to `1.2.3.4` for domain `www.mysite.com` and skip the rest.  The entire process takes only a few milliseconds.
