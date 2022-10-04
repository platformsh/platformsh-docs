---
title: "Going Live - Troubleshooting"
weight: 4
description: |
  If your site still does not resolve (after waiting for the DNS updates to propagate), follow these steps before contacting support.
sidebarTitle: "Troubleshooting"
---

{{% description %}}

## Verify DNS

On the command line using macOS, Linux or the Linux subsystem for Windows, type:
`host www.{{< variable "YOUR_DOMAIN" >}}`.

The response where `www.{{< variable "YOUR_DOMAIN" >}}` is `example.com` should be something like:

```text
www.{{<variable "YOUR_DOMAIN" >}} is an alias for main-t2xxqeifuhpzg.eu.platform.sh.
main-t2xxqeifuhpzg.eu.platform.sh has address 192.0.2.1
```

If it isn't, either:

1. Your DNS server isn't correctly configured or the DNS configuration didn't propagate yet. Try and remove your local DNS cache.
2. Try to set the DNS server of your computer to the Google public DNS server (`8.8.8.8` and `8.8.4.4`) to see if the issue is with the DNS server you are using.
3. Run `ping www.{{< variable "YOUR_DOMAIN" >}}`.
   If the result is different from what you got from the `host www.{{< variable "YOUR_DOMAIN" >}}`,
   IP-overrides could be leftover [from testing](checklist.md#2-test-your-site).

## Verify SSL

On the command line using macOS, Linux or the Linux subsystem for Windows,
type: `curl -I -v  https://www.{{< variable "YOUR_DOMAIN" >}}`.

The response should be long. Look for error messages.
They're usually explicit enough.
Often the problem is with a mismatch between the certificate and the domain name.

## Verify your application

On the command line type `platform logs app` and see there are no clear anomalies there.
Do the same with `platform logs error`.

## Use ASCII for the domain

Platform.sh expects an ASCII representation of your domain.
To use an internationalized domain name, convert your IDN domain to ASCII.
Use a tool such as the [conversion tool provided by Verisign](https://www.verisign.com/en_US/channel-resources/domain-registry-products/idn/idn-conversion-tool/index.xhtml).

## Something still wrong?

{{% troubleshoot %}}

If your website is still not working as expected, [contact support](/overview/get-support.md)
