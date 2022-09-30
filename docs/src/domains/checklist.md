---
title: "Pre-Launch Checklist"
weight: 1
description: |
  Before you can take your site live there are a few preparation steps to take.
sidebarTitle: "Pre-Launch Checklist"
---

{{% description %}}

## 1. Check that your domain provider supports CNAME records on APEX domains

Before you go live, you need a domain name registered with the registrar of your choice.
That registrar must allow you to use a Canonical Name (CNAME) record for your APEX domain.
Some registrars may call these `ALIAS` or `ANAME`.

{{< note >}}

You can't use a `A` record.
Verify your Registrar supports CNAME for APEX domains.

{{< /note >}}

See more on [what an APEX domain is](/domains/steps/dns.md#what-is-an-apex-domain).

## 2. Test your site

If your production environment is on a Dedicated instance,
ensure that the code is up-to-date in both your `staging` and `production` branches,
as those are mirrored to the Dedicated instances.
Also ensure that the data on the production instance is up-to-date and ready to launch.

Make sure your site is running and configured as you want it to be, on your production branch.
In particular, see the [Routes documentation](../define-routes/_index.md).
If you turned on basic-authentication during development, make sure [to turn it off before launch](/administration/web/configure-environment.md).

You can test the behavior of the site before going live, by overriding the IP of that domain and make it point to the IP address for your project's production environment. This can be particularly useful to check that a CMS is properly set up.

To override that IP:
1. Get the CNAME target of your project's production environment, run `dig +short $(platform environment:info edge_hostname)`.
2.



{{< codetabs >}}

---
title=In your browser
file=none
highlight=false
---

Dynamically switch DNS IP addresses without modifying your hosts file with a browser extension:

* [Firefox LiveHosts add-on](https://addons.mozilla.org/en-US/firefox/addon/livehosts/)
* [Chrome LiveHosts extension](https://chrome.google.com/webstore/detail/livehosts/hdpoplemgeaioijkmoebnnjcilfjnjdi)

<--->

---
title=On macOS and Linux
file=none
highlight=false
---

1. With an admin account, open the `/etc/hosts` file with your favorite text editor.
2. Add the {{<variable "IP" >}} and `www.`{{< variable "YOUR_DOMAIN" >}} to that file.
3. Add the {{<variable "IP" >}} and {{< variable "YOUR_DOMAIN" >}} to that file.
4. Save and close the file.

After adding these lines the file looks something like:

<!-- This is in HTML to get the variable shortcode to work properly -->
<div class="highlight" location="/etc/hosts"><pre tabindex="0" class="chroma"><code class="language-yaml" data-lang="yaml">##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1	localhost
255.255.255.255	broadcasthost
::1             localhost
{{<variable "IP" >}}            www.{{<variable "YOUR_DOMAIN" >}}
{{<variable "IP" >}}            {{<variable "YOUR_DOMAIN" >}}
</code></pre></div>

Once the domain is live, don't forget to delete the entry you added.

<--->

---
title=On Windows
file=none
highlight=false
---

1. With an admin account, open the `c:\Windows\System32\Drivers\etc\hosts` file with your favorite text editor.
2. Add the {{<variable "IP" >}} and the `www.`{{<variable "YOUR_DOMAIN" >}} to that file.
3. Add the {{<variable "IP" >}} and {{<variable "YOUR_DOMAIN" >}} to that file.
4. Save and close the file.

After adding these lines the file looks something like:

<!-- This is in HTML to get the variable shortcode to work properly -->
<div class="highlight" location="c:\Windows\System32\Drivers\etc\hosts"><pre tabindex="0" class="chroma"><code class="language-yaml" data-lang="yaml"># Copyright (c) 1993-2009 Microsoft Corp.
#
# This is a sample HOSTS file used by Microsoft TCP/IP for Windows.
#
# This file contains the mappings of IP addresses to host names. Each
# entry should be kept on an individual line. The IP address should
# be placed in the first column followed by the corresponding host name.
# The IP address and the host name should be separated by at least one
# space.
#
# Additionally, comments (such as these) may be inserted on individual
# lines or following the machine name denoted by a '#' symbol.
#
# For example:
#
#      102.54.94.97     rhino.acme.com          # source server
#       38.25.63.10     x.acme.com              # x client host
# localhost name resolution is handled within DNS itself.
#  127.0.0.1       localhost
#  ::1             localhost
{{<variable "IP" >}}            www.{{<variable "YOUR_DOMAIN" >}}
{{<variable "IP" >}}            {{<variable "YOUR_DOMAIN" >}}
</code></pre></div>

Once the domain is live, don't forget to delete the entry you added.
  
{{< /codetabs >}}

## 3. Optional: Obtain a third-party TLS certificate

Platform.sh automatically provides TLS certificates for all sites and environments.
These certificates are issued by [Let's Encrypt](https://letsencrypt.org/) at no charge.
[In most cases](../define-routes/https.md#limits), this is sufficient and no further action is necessary.
If you want to use a [third-party TLS certificate](./steps/tls.md) to encrypt your production site,
you can obtain one from any third-party TLS issuers.
Platform.sh doesn't charge for using a third-party TLS certificate, although the issuer may.

If you do wish to use a third-party certificate, ensure it's purchased and active before going live.

## What's next

After you checked that:

* Your registrar allows CNAME on APEX domains,
* Your code and data are tested and ready to launch on your production environment,
* Your custom TLS certificate is purchased, if you're using one,

It's time to [go Live](/domains/steps/_index.md).
