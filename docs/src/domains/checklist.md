---
title: "Pre-Launch Checklist"
weight: 1
description: |
  Before you can take your site live there are a few preparation steps to take.
sidebarTitle: "Pre-Launch Checklist"
---

{{% description %}}

## 1. Register a domain name with a supported provider

Before you go live, you need a domain name registered with the registrar of your choice.
Verify your registrar supports [Canonical Name (`CNAME`) records for apex domains](./steps/dns.md#handling-apex-domains).
Some registrars may call these `ALIAS` or `ANAME` records.

See [what an apex domain is](./steps/dns.md#what-is-an-apex-domain).

## 2. Test your site

Make sure your site is running and configured as you want it to be, on your production branch.
In particular, see the [Routes documentation](../define-routes/_index.md).

If you turned on HTTP access control during development, [turn it off before launch](../administration/web/configure-environment.md#http-access-control).

If your production environment is on a {{% names/dedicated-gen-2 %}} instance, ensure that:

* Your code is up-to-date in both your `staging` and `production` branches. Those are mirrored to the {{% names/dedicated-gen-2 %}} instances.
* Your data on the {{% names/dedicated-gen-2 %}} production instance is up-to-date and ready to launch.

### Test the domain locally

You can test your site's behavior before going live by locally pointing your domain
to the IP addresses for your project's production environment.
This can be particularly useful to check that a CMS is properly set up.

To change where the domain points on your computer, choose one of the following methods:

{{< codetabs >}}

---
title=In your browser
file=none
highlight=false
---

1. Get the IP addresses of your project's production environment by running `dig +short $(platform environment:info edge_hostname)`.
2. Download a suitable browser extension:

    * [Firefox LiveHosts add-on](https://addons.mozilla.org/en-US/firefox/addon/livehosts/)
    * [Chrome LiveHosts extension](https://chrome.google.com/webstore/detail/livehosts/hdpoplemgeaioijkmoebnnjcilfjnjdi)

3. In the browser extension, map your domain name to the IP addresses.

<--->

---
title=On macOS and Linux
file=none
highlight=false
---

1. Get the IP addresses of your project's production environment by running `dig +short $(platform environment:info edge_hostname)`.
2. Copy all IP addresses (usually 1-3) that are returned.
3. Open the `/etc/hosts` file with admin privileges using your favorite text editor.
4. Add the IP and (sub)domains to override to that file.
5. Save and close the file.

After adding these lines the file looks something like:

<!-- This is in HTML to get the variable shortcode to work properly -->
<div class="highlight" location="/etc/hosts"><pre tabindex="0" class="chroma"><code class="language-yaml" data-lang="yaml"><span class="cl">##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1	localhost
255.255.255.255	broadcasthost
::1             localhost
{{<variable "IP_ADDRESS" >}}      {{<variable "YOUR_DOMAIN" >}}
{{<variable "IP_ADDRESS" >}}      www.{{<variable "YOUR_DOMAIN" >}}
</span></code></pre></div>

For example, if your IP address is `192.0.2.1` and you added both the `example.com` domain and the `www.example.com` subdomain the bottom of the file looks like:

```yaml {location="/etc/hosts"}
...
192.0.2.1      example.com
192.0.2.1      www.example.com
```

<--->

---
title=On Windows
file=none
highlight=false
---

1. Get the IP's of your project's production environment by running `dig +short $(platform environment:info edge_hostname)`.
2. Copy all IP addresses (usually 1-3) that are returned.
3. Open the `c:\Windows\System32\Drivers\etc\hosts` file with admin privileges using your favorite text editor.
4. Add the IP and (sub)domains to override to that file.
5. Save and close the file.

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
{{<variable "IP_ADDRESS" >}}         {{<variable "YOUR_DOMAIN" >}}
{{<variable "IP_ADDRESS" >}}         www.{{<variable "YOUR_DOMAIN" >}}
</code></pre></div>

For example, if your IP address is `192.0.2.1` and you added both the `example.com` domain and the `www.example.com` subdomain the bottom of the file looks like:

```yaml {location="c:\Windows\System32\Drivers\etc\hosts"}
...
192.0.2.1      example.com
192.0.2.1      www.example.com
```

{{< /codetabs >}}

Once your tests are over, don't forget to delete the entries you added.

## 3. Optional: Obtain a third-party TLS certificate

Platform.sh automatically provides TLS certificates for all sites and environments.
These certificates are issued at no charge by [Let's Encrypt](https://letsencrypt.org/).
In most cases, this is sufficient and no further action is necessary, though see the [limits](../define-routes/https.md#limits).

If you want to use a third-party certificate, ensure it's purchased and active before going live.
See how to add a [third-party TLS certificate to your site](./steps/tls.md).

## 4. Optional: configure your CDN

If you are using a CDN, either one included with an Enterprise plan or one you provide for a self-service Grid project,
ensure that your CDN account is registered and configured in advance.

## What's next

After you've completed the above steps, it's time to [go live](./steps/_index.md).
