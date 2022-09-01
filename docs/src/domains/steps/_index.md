---
title: "Custom Domains - Step by step guide"
weight: 2
sidebarTitle: "Step by step guide"
description: |
  Once your project is ready for production, you can add a custom domain.
layout: single
---

{{% description %}}

{{< note >}}
If you are migrating a site from an existing provider,
configure the domain on your project before switching DNS over.
{{< /note >}}

## Before you begin

You need:

* A project that's ready to go live.
* A domain with access to its settings on its registrar's website.
* A registrar that allows CNAME records or [one of the alternatives](./dns.md).
* Optional: Have the [CLI](/administration/cli/_index.md) installed locally.

If you are planning to host multiple subdomains on different projects,
see the additional information about [Subdomains](/domains/steps/subdomains.md) *before* you add your domain to Platform.sh.

Note: adding a domain disables the automatically generated URL for the production environment but doesn't modify the automatically generated URLs used for non-production environments.
The non-production URLs can't be customized.

## 1. Change your plan tier

A production environment is required to add a custom domain.
Production environment are available for standard (or higher) plans.
If you are on a development plan, you need to upgrade your tier.

<<<<<<< HEAD
To upgrade your plan tier, you must be an organization owner or have [the manage plans permission](administration/organizations.md#manage-your-organization-users)

To upgrade your plan tier:

* On the tile of the project you want to upgrade, click **{{< icon more >}} More**.
* Click **Edit plan**.
* Change the plan to at least **Standard**.
* Check the change to the monthly cost.
* Click **Save**.

You can find more information on pricing on the [pricing page](https://platform.sh/pricing).

## 2. Get the CNAME target of your project

The CNAME target is where your website is hosted within Platform.sh.
Your domain {{<variable "YOUR_DOMAIN" >}} needs to point to that target for your site to be live.
=======
You can find more information on pricing on the [pricing page](https://platform.sh/pricing).

## 2. Configure your DNS provider

{{< note >}}
If you are serving the site through a CDN, configure your DNS provider to point at your CDN account.
The address or CNAME to set for that varies with the CDN provider.
Refer to their documentation or to the [CDN guide](/domains/cdn/_index.md).
{{< /note >}}

If you're not using a CDN, configure your domain name to point to your project:
>>>>>>> d979f30e (:memo: Apply recommendations from review)

{{< codetabs >}}

---
title=Using the CLI
file=none
highlight=false
---

<<<<<<< HEAD
Get the target by running the following [CLI](/administration/cli/_index.md) command: `platform environment:info edge_hostname`
=======
1. Sign in to your registrar's management system to configure your domain.
2. Set the time to live (TTL) on your domain to the lowest possible value to minimize transition time.
3. Get the CNAME target by running the [CLI](../../development/cli/_index.md) command `platform environment:info edge_hostname`.
4. Add a CNAME record from the `www` subdomain (`www.<YOUR_DOMAIN>`) to the value of the CNAME target.
  If you have multiple domains you want to be served by the same application you need to add a CNAME record for each of them.
  If you are planning to host multiple subdomains on different projects,
  see the additional information about [Subdomains](/domains/steps/subdomains.md) *before* you add your domain to Platform.sh.
5. Add a CNAME/ANAME/ALIAS from your apex domain (`<YOUR_DOMAIN>`) to the value of the CNAME target.
  Not all registrars allow these kinds of records.
  If yours doesn't, see [alternatives](../steps/dns.md).
6. Check that the domain and subdomain are working as expected.
7. Set the TTL value back to its previous value.
>>>>>>> d979f30e (:memo: Apply recommendations from review)

<--->

---
title=In the console
file=none
highlight=false
---

<<<<<<< HEAD
1. Access the [project overview](https://console.platform.sh)
2. Click the tile of the project you want to access
3. Access your production environment
4. Copy the automatically generated URL you use to access your website.

For example if the URL to access your production environment is `https://main-def456-abc123.eu-2.platformsh.site`,the target is `main-def456-abc123.eu-2.platformsh.site`.

{{< /codetabs >}}

## 3. Configure your DNS provider

Your DNS provider (usually your registrar) is where you manage your domain.
=======
1. Sign in to your registrar's management system to configure your domain.
2. Set the time to live (TTL) on your domain to the lowest possible value to minimize transition time.
3. Get the CNAME target by accessing your production environment and adapting the auto-generated URL you use to access your website.
  It's in the form `<branch>-<hash>-<project_id>.<region>.platformsh.site` minus the protocol (`https://`).
  For example if the URL to access your domain is `https://main-def456-abc123.eu-2.platformsh.site`, the CNAME target is `main-def456-abc123.eu-2.platformsh.site`.
4. Add a CNAME record from the `www` subdomain (`www.<YOUR_DOMAIN>`) to the value of the CNAME target.
  If you have multiple domains you want to be served by the same application you need to add a CNAME record for each of them.
  If you are planning to host multiple subdomains on different projects,
  see the additional information about [Subdomains](/domains/steps/subdomains.md) *before* you add your domain to Platform.sh.
5. Add a CNAME/ANAME/ALIAS from your apex domain (`<YOUR_DOMAIN>`) to the value of the CNAME target.
  Not all registrars allow these kinds of records.
  If yours doesn't, see [alternatives](../steps/dns.md).
6. Check that the domain and subdomain are working as expected.
7. Set the TTL value back to its previous value.

{{< /codetabs >}}

Note that depending on your registrar and the TTL you set on step 2,
it can take anywhere from 15 minutes to 72 hours for DNS changes to be taken into account.

Example where `<YOUR_DOMAIN>` is `mysite.com`:

- `www.mysite.com` is a CNAME to `main-def456-abc123.eu-2.platformsh.site`.
- `mysite.com` is an ALIAS/CNAME/ANAME  to `main-def456-abc123.eu-2.platformsh.site`.

Both `www.mysite.com` and `mysite.com` point to the same target. The app handles the [redirects](../../define-routes/_index.md).

## 3. Set your domain in Platform.sh

Add a single domain to your Platform.sh project for `<YOUR_DOMAIN>`:
>>>>>>> d979f30e (:memo: Apply recommendations from review)

{{< codetabs >}}

---
title=Not using a CDN
file=none
highlight=false
---

Configure your domain name to point to your project:

1. Open your registrar's domain management system.
2. Set the time to live (TTL) on your domain to the lowest possible value to minimize transition time.
3. Add a CNAME record from the `www` subdomain [pointing to the target](#2-get-the-cname-target-of-your-project).
4. Add a CNAME/ANAME/ALIAS from your apex domain [pointing to the target](#2-get-the-cname-target-of-your-project).
  Not all registrars allow these kinds of records.
  If yours doesn't, see [alternatives](./dns.md).
5. Optional: If you have multiple domains you want to be served by the same app you need to add a CNAME record for each of them.
6. Check that the domain and subdomain are working as expected.
7. Set the TTL value back to its previous value.

<--->

---
title=Using a CDN
file=none
highlight=false
---

For Enterprise plans you need to obtain a DNS TXT record from your Platform.sh support representative by [opening a ticket](/overview/get-support.md).

1. Open your CDN's management system.
2. Make your CDN [point to the Platform.sh CNAME target](#2-get-the-cname-target-of-your-project).
3. Get the CNAME target for your CDN.
4. Open your registrar’s domain management system.
5. Configure your DNS zone to point at your CDN's CNAME target.
The address or CNAME record to set for that varies with the CDN provider.
Refer to their documentation or to the [CDN guide](/domains/cdn/_index.md).

{{< /codetabs >}}

Note that depending on your registrar and the TTL you set,
it can take anywhere from 15 minutes to 72 hours for DNS changes to be taken into account.

So, if {{<variable "YOUR_DOMAIN" >}} is `example.com`:

* `www.example.com` is a CNAME record pointing to `main-def456-abc123.eu-2.platformsh.site`.
* `example.com` is a ALIAS/CNAME/ANAME record pointing to `main-def456-abc123.eu-2.platformsh.site`.

Both `www.example.com` and `example.com` point to the same target.
Redirects are handled by the [router you configure](../../define-routes/_index.md).

## 4. Set your domain in Platform.sh

Add a single domain to your project:

{{< codetabs >}}

---
title=Using the CLI
file=none
highlight=false
---

Run the following command:

<!-- This is in HTML to get the variable shortcode to work properly -->
<div class="highlight">
  <pre class="chroma"><code class="language-bash" data-lang="bash">platform domain:add -p {{<variable "PROJECT_ID" >}} {{<variable "YOUR_DOMAIN" >}}</code></pre>
</div>

Once the domain is live, don't forget to delete the entry you added.

<--->

---
title=In the console
file=none
highlight=false
---

* Select the project where you want to add a domain.
* Click {{< icon settings >}} **Settings**.
* Click **Domains**.
* Enter your domain into the **Domain** field.
* Click **+ Add**.

{{< /codetabs >}}

When a domain is added to your project,
the `{default}` in `routes.yaml` is replaced with {{<variable "YOUR_DOMAIN" >}} anywhere it appears when generating routes to respond to.
Access the original internal domain by running `platform environment:info edge_hostname`.

{{< note >}}
If you are planning on using subdomains across multiple projects, [the setup differs slightly](subdomains.md).
{{< /note >}}

## Result

With the assumption that all caches are empty, an incoming request where {{<variable "YOUR_DOMAIN" >}} is `example.com` results in the following:

1. Your browser asks the DNS root servers for `example.com`'s DNS A record (the IP address of this host).
   The DNS root server responds with "it's an alias for `main-def456-abc123.eu-2.platformsh.site`" (the CNAME),
   which itself resolves to an A record with an IP address, for example `192.0.2.1`.
   By default, DNS requests by browsers are recursive, so there is no performance penalty for using CNAME records.
2. Your browser sends a request to `192.0.2.1` for domain `example.com`.
3. Your router responds with an HTTP 301 redirect to `www.example.com` because that's that's what's specified in your [routes definition](../../define-routes/_index.md).
4. Your browser looks up `www.example.com` and, as in step 1, receives an alias for `main-def456-abc123.eu-2.platformsh.site`, which resolves to the IP address `192.0.2.1`.
5. Your browser sends a request to `192.0.2.1` for the domain `www.example.com`.
   Your router passes the request to your app, which responds as you have set.

On subsequent requests, your browser knows to connect to `192.0.2.1` for the domain `example.com` and skips the rest.
The entire process takes only a few milliseconds.

## What's next

* [use a content delivery network (CDN)](/domains/cdn/_index.md)
* [use subdomains across multiple projects](subdomains.md)
