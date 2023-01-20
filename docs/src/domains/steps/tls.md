---
title: "Configure a third-party TLS certificate"
weight: 3
sidebarTitle: "Custom TLS certificates"
---

{{% tls-introduction %}}

You can use many kinds of custom certificates, including domain-validated, extended validation, high-assurance, or wildcard certificates.

Platform.sh allows you to use third-party TLS certificates free of charge.
Consult your TLS issuer for pricing and instructions on how to generate a TLS certificate.

Seven days before a third-party custom certificate is due to expire,
Platform.sh replaces it with a new default Let’s Encrypt certificate.
This helps prevent downtime.
To avoid switching to a default certificate,
make sure you replace your custom certificate with an updated one
more than seven days before its expiration date.

Note that custom certificates aren't necessary for development environments.
Wildcard certificates that cover all `*.platform.sh` domains, including development environments, are automatically provided.

### Add a custom certificate

You can add a custom certificate using the [CLI](../../administration/cli/_index.md) or in the [Console](../../administration/web/_index.md).

Your certificate has to be in PKCS #1 format and start with `-----BEGIN RSA PRIVATE KEY-----`.
If it doesn't start that way, [change the format](#change-the-private-key-format).

To add your custom certificate, follow these steps:

{{< codetabs >}}

+++
title=Using the CLI
file=none
highlight=false
+++

1. Run the following command:

   ```bash
   platform domain:add {{<variable "YOUR_DOMAIN" >}} --cert {{<variable "PATH_TO_CERTIFICATE_FILE" >}} --key {{<variable "PATH_TO_PRIVATE_KEY_FILE" >}}
   ```

   For example:

   ```bash
   platform domain:add secure.example.com --cert /etc/TLS/private/secure-example-com.crt --key /etc/TLS/private/secure-example-com.key
   ```

   You can optionally include intermediate SSL certificates by adding <code>&hyphen;&hyphen;chain {{<variable "PATH_TO_FILE" >}}</code> for each one.

2. Redeploy your production environment with the following command:

   ```bash
   platform environment:redeploy
   ```

<--->

+++
title=In the Console
file=none
highlight=false
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
