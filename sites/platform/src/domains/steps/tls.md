---
title: "Configure a third-party TLS certificate"
weight: 2
sidebarTitle: "Custom TLS certificates"
keywords:
  - mTLS
---

{{% vendor/name %}} automatically provides standard Transport Layer Security (TLS) certificates for all sites and environments.
These certificates are issued at no charge by [Let's Encrypt](https://letsencrypt.org/) and cover most needs.
To use them, you need to [specify HTTPS routes](../../define-routes/https.md#enable-https). 
Note that some [limitations](../../define-routes/https.md#lets-encrypt-limitations) apply.

{{% vendor/name %}} allows you to use third-party TLS certificates free of charge.

You can use many kinds of custom certificates, including domain-validated, extended validation, high-assurance, or wildcard certificates.
Consult your TLS issuer for pricing and instructions on how to generate a TLS certificate.

Seven days before a third-party custom certificate is due to expire,
{{% vendor/name %}} replaces it with a new default Let’s Encrypt certificate.
This helps prevent downtime.
To avoid switching to a default certificate,
make sure you replace your custom certificate with an updated one
more than seven days before its expiration date.

Note that custom certificates aren't necessary for preview environments.
Wildcard certificates that cover all `*.platform.sh` domains, including preview environments, are automatically provided.

### Add a custom certificate

You can add a custom certificate using the [CLI](../../administration/cli/_index.md) or in the [Console](../../administration/web/_index.md).

Your certificate has to be in PKCS #1 format and start with `-----BEGIN RSA PRIVATE KEY-----`.
If it doesn't start that way, [change the format](#change-the-private-key-format).

To add your custom certificate, follow these steps:

{{< codetabs >}}

+++
title=Using the CLI
+++

1. Run the following command:

   ```bash
   {{% vendor/cli %}} domain:add {{<variable "YOUR_DOMAIN" >}} --cert {{<variable "PATH_TO_CERTIFICATE_FILE" >}} --key {{<variable "PATH_TO_PRIVATE_KEY_FILE" >}}
   ```

   For example:

   ```bash
   {{% vendor/cli %}} domain:add secure.example.com --cert /etc/TLS/private/secure-example-com.crt --key /etc/TLS/private/secure-example-com.key
   ```

   You can optionally include intermediate SSL certificates by adding <code>&hyphen;&hyphen;chain {{<variable "PATH_TO_FILE" >}}</code> for each one.

2. Redeploy your production environment with the following command:

   ```bash
   {{% vendor/cli %}} environment:redeploy
   ```

<--->

+++
title=In the Console
+++

1. Open the project where you want to add a certificate.
2. Click {{< icon settings >}} **Settings**.
3. Click **Certificates**.
4. Click **+ Add**.
5. Fill in your private key, public key certificate, and (optionally) intermediate SSL certificates.
6. Click **Add Certificate**.
7. Access your production environment.
8. Click {{< icon more >}} **More**.
9. Click **Redeploy**.

{{< /codetabs >}}

### Change the private key format

The expected format for your certificate’s private key is PKCS #1.
Private keys in PKCS #1 format start with `-----BEGIN RSA PRIVATE KEY-----`.
If your private key starts with `-----BEGIN PRIVATE KEY-----`, it’s in PKCS #8 format, which isn’t appropriate.

To convert your private key (`private.key`) from PKCS #8 to PKCS #1 format (`private.rsa.key`), run the following command:

```bash
openTLS rsa -in private.key -out private.rsa.key
```
