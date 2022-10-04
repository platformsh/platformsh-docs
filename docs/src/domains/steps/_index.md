---
title: "Custom Domains - Step by step guide"
weight: 2
sidebarTitle: "Step by step guide"
description: |
    Find out how to take your application live on your own custom domain and replace the automatically generated URLs.
layout: single
---

{{% description %}}

## Before you begin

You need:

* A project that's ready to go live.
* A domain with access to its settings on its registrar's website.
* A registrar that allows CNAME records or [one of the alternatives](./dns.md).
* Optional: Have the [CLI](/administration/cli/_index.md) installed locally.

If you are planning to use several subdomains of the same domain on different projects,
see the additional information about [Subdomains](/domains/steps/subdomains.md) *before* you add your domain to Platform.sh.

Note: adding a domain disables the automatically generated URL for the production environment but doesn't modify the automatically generated URLs used for non-production environments.
The non-production URLs can't be customized.

## 1. Get the CNAME target of your project

The CNAME target is where your website is hosted within Platform.sh.
Your domain {{<variable "YOUR_DOMAIN" >}} needs to point to that target for your site to be live.

{{< codetabs >}}

---
title=Using the CLI
file=none
highlight=false
---

Get the target by running the following [CLI](/administration/cli/_index.md) command: `platform environment:info edge_hostname`

<--->

---
title=In the console
file=none
highlight=false
---

1. Access the [project overview](https://console.platform.sh)
2. Click the tile of the project you want to access
3. Access your production environment
4. Copy the automatically generated URL you use to access your website.

For example if the URL to access your production environment is `https://main-def456-abc123.eu-2.platformsh.site`,the target is `main-def456-abc123.eu-2.platformsh.site`.

{{< /codetabs >}}

## 2. Configure your DNS provider

Your DNS provider (usually your registrar) is where you manage your domain.
Most registrars offer similar functionalities regarding DNS zone configuration but use different terminology or configuration.
For example a few registrars require the use of `@` character to create a CNAME records on the APEX domain where most others registrars don't.
Don't hesitate to consult your registrar's documentation.

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
* `example.com` is a CNAME/ANAME/ALIAS record pointing to `main-def456-abc123.eu-2.platformsh.site`.

Both `www.example.com` and `example.com` point to the same target.
Redirects are handled by the [router you configure](../../define-routes/_index.md).

## 3. Set your domain in Platform.sh

{{< note >}}
If you are planning on using subdomains across multiple projects, [the setup differs slightly](subdomains.md).
{{< /note >}}

To add a custom domain, you need a [production environment](../../other/glossary.md#production-plan).
Production environment are available for standard (or higher) plans. Find more information on [pricing](https://platform.sh/pricing).

To upgrade your plan tier you must be an organization owner or have [the manage plans permission](../../administration/organizations.md#manage-your-organization-users)

Add a single domain to your project:

{{< codetabs >}}

---
title=Using the CLI
file=none
highlight=false
---

1. If you are on a development plan, you need to upgrade your tier:

    * On the tile of the project you want to upgrade, click **{{< icon more >}} More**.
    * Click **Edit plan**.
    * Change the plan to at least **Standard**.
    * Check the change to the monthly cost.
    * Click **Save**.

2. Add the custom domain, by running the following command:

    <!-- This is in HTML to get the variable shortcode to work properly -->
    <div class="highlight">
      <pre class="chroma"><code class="language-bash" data-lang="bash">platform domain:add {{<variable "YOUR_DOMAIN" >}}</code></pre>
    </div>

<--->

---
title=In the console
file=none
highlight=false
---

1. Select the project where you want to add a domain.
2. Click {{< icon settings >}} **Settings**.
3. Click **Domains**.
4. If needed, upgrade to a production plan:
    * Click **Upgrade plan**.
    * Change the plan to at least **Standard**.
    * Check the change to the monthly cost.
    * Click **Save**.
    * Click **Back to Plans**
5. Enter your domain into the **Domain** field.
6. Click **+ Add**.

{{< /codetabs >}}

## What's next

* [use a content delivery network (CDN)](/domains/cdn/_index.md)
* [use subdomains across multiple projects](subdomains.md)
* [use a custom TLS certificate](tls.md)