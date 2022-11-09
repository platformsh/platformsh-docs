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

* Your DNS server might not be correctly configured or the old DNS records are still cached.
  Try removing your local DNS cache.
* Set your computer's DNS server to Google Public DNS (`8.8.8.8` and `8.8.4.4`)
  to see if the issue is with the DNS server you are using.
* Run `ping www.{{< variable "YOUR_DOMAIN" >}}`.
  If the result is different from what you got from running `host www.{{< variable "YOUR_DOMAIN" >}}`,
  you might need to remove your [test settings](./checklist.md#2-test-your-site).

## Verify SSL

On the command line using macOS, Linux, or the Windows Subsystem for Linux, run the following command:

```bash
curl -I -v  https://www.{{< variable "YOUR_DOMAIN" >}}
```

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

If your website is still not working as expected, [contact support](../overview/get-support.md).
