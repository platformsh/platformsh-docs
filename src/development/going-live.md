# Going Live

Going live on platform.sh is a one or two step process.

1. If you are on a development plan. Change plans to a production plan. 
2. Configure your domain name to point to your Platform.sh master environment.

You can either use the Platform.sh UI or the CLI to configure your project for production. Let us now delve into some details.

<!-- toc -->

## Pre-Launch Checklist.

Before you  go live you should go through the following check-list.

### 1. Register a domain name with a supported provider
You have a domain name registered for your site with a Registrar of your choice. The registrar must allow you to use CNAMEs for your domain.  (Some registrars may call these Aliases or similar.). If your domain is currently active elsewhere, the Time-To-Live (TTL) on your domain is set to the lowest possible value in order to minimize transition time.

### 2. Note the target address (CNAME) for your DNS configuration
 You have the auto-generated domain for your master branch.  This is the domain you see in "Access site" in the UI.

 ![Master Access](/images/master-access.png)

You can also retrieve this value from the command line by running `platform environment:url` to see a list of all URLs that Platform.sh will serve for the current environment.  
 
 ![Platform Cli Master Url](/images/platform-cli-master-url.png)
 
Write this down. This is what you will be using as the target for the CNAME you will configure with your DNS provider. Note that what you will see there is the URL, so you will need to remove http:// or https:// to get the name of the environment. 


### 3. Test your site!
Make sure your site is running and configured as you want it to be, on your master branch.  In particular, see the [Routes documentation](/configuration/routes.md). You will need your routes configured appropriately before you begin.  Make sure you have turned off [basic-authentication](https://docs.platform.sh/administration/web/configure-environment.html) if it was turned on during development.

### 4.  Optionally configure SSL
Optional: If you want to use a 3rd party SSL certificate to encrypt your production site, you can obtain one from any number of 3rd party SSL issuers.  Platform.sh automatically provides SSL certificates for all sites issued by [Let's Encrypt](https://letsencrypt.org/) at no charge, and there is no charge for using a 3rd party SSL cert instead.

## Everything Fine? Let's Go Live. 

> The order of operations is not really important, but if you are migrating a site from an existing provider, you should first 
> configure the domain on the Platform.sh side, and only then switch DNS over.

### 1.1 Change your plan to a production plan

> If you are on a Development plan, you cannot add a domain. You would need to upgrade your subscription to a production plan.

Go to your account https://accounts.platform.sh/user  click on the small wheel next to you project's name and click on edit

![Edit Plan](/images/edit-plan.png)

And choose the plan you want, it will show you the monthly price you will be paying. 

![Edit Plan Choose](/images/edit-plan-choose.png)

You can find more information on pricing on the [pricing page](<https://platform.sh/pricing/). 

### 1.2 Set your domain in Platform.sh

This is a required step, it will tell the Platform.sh edge layer where to route requests for your web site.

First  [add your domain](/administration/web/configure-project.html#domains).

You can add multiple domains to point to your project. Each domain can have its own custom SSL certificate, or use the default one provided.

After you have added your domain, your Master environment will no longer be accessible at `<environment>-<project>.<region>.platform.sh`.

If you require access to the site before the domain name becomes active you can create a hosts file entry and point it to the IP address that resolves when you access your master project branch. 

To get the ip you can run `ping <environment>-<project>.<region>.platform.sh` (with the DNS name you noted in step 2 of the pre-launch check list). In OS X and Linux this will usually be the hosts file in `/etc/hosts` in Windows `c:\Windows\System32\Drivers\etc\hosts`. You will need to be a admin user to be able to change that file. So in OS X you will usually run something like `sudo vi /etc/hosts`. After adding the line the file will look something like:
  
![Hosts File](/images/hosts-file.png)

> **note**
> Do not put the IP address you see here, but the one you got from the ping command.
> **Remember to remove this entry after you have configured DNS!**

### 1.3 Choose and configure your DNS provider

Configure your DNS provider to point your domain to your Platform.sh Master environment domain name.

The way to do so will vary somewhat depending on your registrar, but nearly all registrars should allow you to set a CNAME.  Some will call it an Alias or similar alternate name, but either way the intent is to say "this domain should always resolve to... this other domain".  Add a CNAME record from your desired domain (`www.example.com`) to the master environment hostname you wrote down earlier.

If you have multiple domains you want to be served by the same application you will need to add a CNAME record for each of them. 

Note that depending on your registrar and the TTL you set, it could take anywhere from 15 minutes to 72 hours for the DNS change to fully propagate across the Internet.

### 1.4 Zone Apex / Naked Domain / Root Domain (the one without the www.)

The DNS RFC (RFC1033) requires the "zone apex" (sometimes called the "root domain" or "naked domain") to be an "A Record," not a CNAME. But many DNS providers have found a way around this limitation. If you want your site to be accessible with **https://example.com** and not only **https://www.example.com**  you *must* use a DNS provider that knows how to do that.

Many DNS providers offer workarounds for apex domains pointing to non-IP addresses.  Such records include:

* ACNAME at [CloudFlare](https://www.cloudflare.com/)
* ANAME at [easyDNS](https://www.easydns.com/)
* ANAME at [DNS Made Easy](http://www.dnsmadeeasy.com/)
* ALIAS at [DNSimple](https://dnsimple.com/)
* @ records at [PairNIC.com](https://www.pairnic.com/)
* ALIAS at [PointDNS](https://pointhq.com/)

These ALIAS/CNAME/ANAME records resolves on request the IP address of the destination record and serves it as if it would be the IP address for the apex domain requested. If the IP address for the destination changes, the IP address for the mapped domain changes automatically as well.

Platform.sh recommends ensuring that your DNS Provider supports dynamic apex domains before registering your domain name with them.  If you are using a DNS Provider that does not support dynamic apex domains then you will be unable to use `example.com` with Platform.sh, and will need to use only `www.example.com` (or similar) instead.

Although as a stop-gap measure configuring an  A Record to one of the public IPs of the region you are hosted in would work. It is highly unrecommended. The IP address of the server may change from time to time, especially with frequent redeployments as in Platform.sh's case which will break your site.

### 1.5 Optional: Configure a third-party SSL certificate

Platform.sh automatically provides standard SSL certificates issued by [Let's Encrypt](https://letsencrypt.org/) to all production instances. No further action is required to use SSL-encrypted connections beyond [specifying HTTPS routes](/configuration/routes.md#HTTPS) in your `routes.yaml` file. 

Alternatively, you may provide your own third party SSL certificate from the SSL issuer of your choice at no charge from us.  Please consult your SSL issuer for instructions on how to generate an SSL certificate.

Platform.sh supports all kinds of certificates including domain-validated certificates, extended validation (EV) certificates, high-assurance certificates and wildcard certificates.  The use of HA or EV certificates is the main reason why you may wish to use a third party issuer rather than the default certificate.  You will also need a custom certificate if you use wildcard routes, as Let's Encrypt does not support wildcard certificates.

A custom certificate is not necessary for development environments.  Platform.sh automatically provides wildcard certificates that cover all \*.platform.sh domains, including development environments.

> **note**
> The private key should be in the old style, which means it should start with BEGIN RSA PRIVATE KEY. If it starts with BEGIN PRIVATE KEY that means it is bundled with the identifier for key type. To convert it to the old-style RSA key:
> openssl rsa -in private.key -out private.rsa.key

#### Use the Platform.sh Web Interface to add a custom certificate

You can add a custom certificate via the Platform.sh [Web Interface](/administration/web.md). Just go to the [project configuration page](/administration/web/configure-project.md) in the web interface and click on Domains. If you already have a domain, you can edit the domain and then click on the Add SSL certificate button. You can then add your private key, public key certificate and optional certificate chain.

![UI configuration for SSL](/images/ui-ssl.png)

#### Use the Platform.sh CLI to add the certificate

Example:
```bash
platform domain:add secure.example.com --cert=/etc/ssl/private/secure-example-com.crt --key=/etc/ssl/private/secure-example-com.key
```

See `platform help domain:add` for more information.

## Initial Troubleshooting

You did all of the above and when you visit your website at https://www.example.com (or whatever your real domain name) something is wrong? Here are some simple self-help steps you can do.

### 1. Verify DNS
On the command line with OS X or Linux (or using the Linux subsystem for Windows) type `host www.example.com`:

The response should be something like
```
www.example.com is an alias for master-t2xxqeifuhpzg.eu.platform.sh.
master-t2xxqeifuhpzg.eu.platform.sh has address 54.76.136.188
```
If this is fine, jump to step 2.

1. If it is not either you have not configured correctly your DNS server, or the DNS configuration did not propagate yet. As a first step you can try and remove your local DNS cache. 
2. You can also try to set your DNS server to the Google public DNS server (8.8.8.8/8.8.4.4) to see if the issue is with the DNS server you are using.
3. Try to run `ping www.example.com` (with you own domain name) if the result is different from what you got form the `host www.example.com` you might want to verify your `/etc/hosts` file (or its windows equivalent), you might have left there an entry from testing.

### 2. Verify SSL

On the command line with OS X or Linux (or using the Linux subsystem for Windows) type `curl -I -v  https://example.com` (again using your own domain):

The response should be long. Look for error messages. They are usually explicit enough. Often the problem will be with a mismatch between the certificate and the domain name.

### 3. Verify your application

On the command line type `platform logs app` and see there are no clear anomalies there. Do the same with `platform logs error`

### Something still wrong ? [Contact support](overview/getting-help.md)

We are here to help. Please include as much detail as possible (we will be able to provide quicker help). 

## Example setup

In this short section we will give you a  very simple, typical example. More involved use-cases (such as site with many domains or multiple applications are simply variations on this).

Suppose your project ID is `abc123` in the US region, and you've registered `mysite.com`.  You want `www.mysite.com` to be the "real" site and `mysite.com` to redirect to it.

### Configure `routes.yaml`

First, configure your `routes.yaml` file like so:

```yaml
"https://www.{default}/":
  type: upstream
  upstream: "app:http"

"https://{default}/":
  type: redirect
  to: "https://www.{default}/"
```

That will result in two domains being created on Platform.sh: `master-def456-abc123.us.platform.sh` and `www---master-def456-abc123.us.platform.sh`.  The former will automatically redirect to the latter.  In the `routes.yaml` file, `{default}` will automatically be replaced with `master-def456-abc123.us.platform.sh`.  In domain prefixes (like `www`), the `.` will be replaced with `---`.

### Set your domain

Now, add a single domain to your Platform.sh project for `mysite.com`.  

Using the CLI type:

```platform domain:add mysite.com```
```platform domain:add www.mysite.com```

You can also you the UI for that.

As soon as you do, Platform.sh will no longer serve `master-def456-abc123.us.platform.sh` at all.  Instead, `{default}` in `routes.yaml` will be replaced with `mysite.com` anywhere it appears when generating routes to respond to. 

### Configure your DNS provider

On your DNS provider, you would create two CNAMEs:

`mysite.com` should be an ALIAS/CNAME/ANAME  to `master-def456-abc123.us.platform.sh`.
`www.mysite.com` should be a CNAME to `master-def456-abc123.us.platform.sh`.

>  Both point to the same name see the note above regarding how different registrars handle dynamic apex domains.

### Result

So you would understand what is happening under the hood.

An incoming request for `mysite.com` will result in the following:

1) Your browser asks the DNS network for `mysite.com`'s DNS A record (the IP address of this host).  It responds with "it's an alias for `www---master-def456-abc123.us.platform.sh`" (the CNAME) which itself resolves to the A record with IP address "1.2.3.4"  (Or whatever the actual address is). By default DNS requests by browsers are recursive, so there is no performance penalty for using CNAMEs.
3) Your browser sends a request to `1.2.3.4` for domain `mysite.com`.
4) Your router responds with an HTTP 301 redirect to `www.mysite.com` (because in our `routes.yaml` we defined such a redirect).
5) Your browser looks up `www.mysite.com` and, as above, gets an alias for `www---master-def456-abc123.us.platform.sh`, which is IP 1.2.3.4.
6) Your browser sends a request to `1.2.3.4` for domain `www.mysite.com`.  Your router passes the request through to your application which in turn responds with whatever it's supposed to do.

On subsequent requests, your browser will know to simply connect to `1.2.3.4` for domain `www.mysite.com` and skip the rest.  The entire process takes only a few milliseconds.
