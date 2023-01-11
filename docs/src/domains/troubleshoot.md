---
title: "Going Live - Troubleshooting"
weight: 4
description: |
  If your site doesn't resolve after you've made DNS changes, check potential solutions to common issues.
sidebarTitle: "Troubleshooting"
---

{{% description %}}

## Verify DNS

On the command line using macOS, Linux, or the Windows Subsystem for Linux, run the following command:

```bash
host www.{{< variable "YOUR_DOMAIN" >}}
```

If your domain is `example.com`, the response should be something like the following:

```text
www.example.com is an alias for main-abcd123.abcdefgh1234567.eu.platformsh.site.
main-abcd123.abcdefgh1234567.eu.platformsh.site has address 192.0.2.1
```

If it isn't, try the following steps:

- Your DNS server might not be correctly configured or the old DNS records are still cached.
  Try removing your local DNS cache.
- Set your computer's DNS server to Google Public DNS (`8.8.8.8` and `8.8.4.4`)
  to see if the issue is with the DNS server you are using.
- Run `ping www.{{< variable "YOUR_DOMAIN" >}}`.
  If the result is different from what you got from running `host www.{{< variable "YOUR_DOMAIN" >}}`,
  you might need to remove your test settings.

## Verify SSL

For troubleshooting, feel free to use [the certificate checker tool](https://certcheck.pltfrm.sh/).
This tool assists in finding out where your domain is pointing to and provides some generic guidance.
It also assists when a CDN (Fastly, Cloudflare, ...) is used.
It's good practice to check both the apex and the `www` domain to ensure that both point to your project.

For more in-depth investigations, on the command line using macOS, Linux, or the Windows Subsystem for Linux, run the following command:

```bash
curl -I -v  https://www.{{< variable "YOUR_DOMAIN" >}}
```

The response should be long. Look for error messages.
They're usually explicit enough.
Often the problem is caused by a mismatch between the certificate and the domain name or an expired [custom certificate](steps/tls.md).

### Error provisioning certificates

You may encounter Let's Encrypt certificates failing to provision after the build hook has completed:

```bash
Provisioning certificates
  Validating 1 new domain
  E: Error provisioning the new certificate, will retry in the background.
  (Next refresh will be at 2022-02-13 14:29:22.860563+00:00.)
  Environment certificates
W: Missing certificate for domain a-new-and-really-awesome-feature-abc1234-defghijk56789.eu3.platformsh.site
```

The renewal may fail because of the 64-character limit Let's Encrypt places on URLs.
If you have a branch with a long name, the environment URL is over this limit and the certificate is rejected.
Shortening the branch name to fewer than 20 characters should solve the issue.

Generated URLs for environments have the following pattern:

```bash
{{<variable "ENVIRONMENT" >}}-{{<variable "PROJECT_ID" >}}.{{<variable "REGION" >}}.platformsh.site
```

If you have a [default domain](../define-routes/_index.md#default) set up, the generated URL has the following pattern:

```bash
{{<variable "YOUR_DOMAIN" >}}.{{<variable "ENVIRONMENT" >}}-{{<variable "PROJECT_ID" >}}.{{<variable "REGION" >}}.platformsh.site
```

The generated URLs consist of:

- `{{<variable "YOUR_DOMAIN" >}}` = the amount of characters your domain has
- `{{<variable "ENVIRONMENT" >}}` = `{{<variable "BRANCH_NAME" >}}` + 7 character hash
- `{{<variable "PROJECT_ID" >}}` = 13 characters
- `{{<variable "REGION" >}}` = 2 to 4 characters, depending on the region
- `platformsh.site` = 15 characters
- extra characters like `.` and `-` = 4 to 5 characters, depending on if you have a default domain

This leaves you with 21 to 23 characters for your branch name (`{{<variable "BRANCH_NAME" >}}`) without going over the 64-character limit,
depending on the region.
Since this pattern for generated URLs should remain similar even if it may change slightly,
your branch names should be no more than 20 characters.

### DNS Challenge

To provide a valid SSL-certificate,
Let's Encrypt needs to ensure that the requester is entitled to receive the SSL-certificate it asked for
(usually through the presence of a specific token on the DNS zone of that domain).

This ownership verification is achieved through the so-called [_Challenge_ step](https://letsencrypt.org/docs/challenge-types/).

The certificate request is generated based on your [routes definition](../define-routes/_index.md).
If you want your site to be available with `example.com` and its `www.example.com` subdomain, make sure both are defined in your routes.
Platform.sh checks that all the routes you defined are pointing to your project, if that's not the case, the verification fails, which results in the following error-message:

```text
Couldn't complete challenge [HTTP01: pending | DNS01: pending | TLSALPN01: pending]
```

For the DNS challenge to complete, domains and subdomains must point directly to your Platform.sh project (unless using a [CDN](../domains/cdn/_index.md)).
Otherwise, you see the following error:

```text
  E: Error validating domain www.example.com: Couldn't complete challenge [HTTP01: pending | DNS01: pending | TLSALPN01: pending]
  Unable to validate domains www.example.com, will retry in the background.
```

or

```text
  W: Failed to verify the challenge at the gateway for the domain 'www.some-example.example.com'
  E: Error validating domain www.example.com: Couldn't complete challenge [HTTP01: There was a problem with a DNS query during identifier validation]
```

Make sure that the [apex domain](../other/glossary.md#apex-domain) and its `www` subdomain are both pointing to your project.
Note that it can take anywhere from 15 minutes to 72 hours for DNS changes to be taken into account.
See the [step-by-step guide](../domains/steps/_index.md) for more information.

If you have waited a couple of hours, properly configured the subdomain, and are still seeing an error of this type,
[redeploying](../development/troubleshoot.md#force-a-redeploy) the impacted environment usually solves the issue.

Also make sure that no conflicting DNS records exist for the domain.
For example, a conflicting AAAA (IPv6) DNS record usually results in a `[HTTP01: The client lacks sufficient authorization]` error.

If the certificate generation issue persists,
you could also verify if an outage is currently ongoing on [with Let's Encrypt](https://letsencrypt.status.io/).
If that isn't the case, [contact support](../overview/get-support.md).

## Verify your application

On the command line type `platform logs app` and see there are no clear anomalies there.
Do the same with `platform logs error`.

## Use ASCII for the domain

Platform.sh expects an ASCII representation of your domain.
To use an internationalized domain name, convert your IDN domain to ASCII.
Use a tool such as the [conversion tool provided by Verisign](https://www.verisign.com/en_US/channel-resources/domain-registry-products/idn/idn-conversion-tool/index.xhtml).

## Something still wrong?

{{% troubleshoot %}}

If your website is still not working as expected, [contact support](../overview/get-support.md).
