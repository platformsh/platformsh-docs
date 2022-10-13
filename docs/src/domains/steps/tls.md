---
title: "Optional: Configure a third-party TLS certificate"
weight: 3
sidebarTitle: "Custom TLS"
---

Platform.sh automatically provides all production environments with standard TLS certificates issued by [Let's Encrypt](https://letsencrypt.org/).
No further action is required to use TLS-encrypted connections beyond [specifying HTTPS routes](../../define-routes/https.md).

Alternatively, you can provide your own third-party TLS certificate from the TLS issuer of your choice.
Consult your TLS issuer for instructions on how to generate an TLS certificate.

A custom certificate isn't necessary for development environments.
Platform.sh automatically provides wildcard certificates that cover all `*.platform.sh` domains, including development environments.

All kinds of certificates are supported including:

* domain-validated certificates,
* extended validation (EV) certificates,
* high-assurance (HA) certificates,
* wildcard certificates.

The main reasons to use a third-party issuer rather than the default certificate include using extended validation or high-assurance certificates.
If you use wildcard routes, you need a custom certificate.

### Add a custom certificate

You can add a custom certificate using the [CLI](../../administration/cli/_index.md) or in the [Console](../../administration/web/_index.md).

Your certificate has to use the "PKCS#1" format and start with `BEGIN RSA PRIVATE KEY`. If it doesn't, see [how to change the private key format](#how-to-change-the-private-key-format)

To add your custom certificate, follow these steps:

{{< codetabs >}}

---
title=Using the CLI
file=none
highlight=false
---

Run the following command:

<!-- This is in HTML to get the variable shortcode to work properly -->
<div class="highlight">
  <pre class="chroma"><code class="language-bash" data-lang="bash">platform domain:add -p {{<variable "PROJECT_ID" >}} {{<variable "DOMAIN" >}} --cert {{<variable "PATH_TO_CERTIFICATE_FILE" >}} --key {{<variable "PATH_TO_PRIVATE_KEY_FILE" >}}
</code></pre></div>

For example:

```bash
platform domain:add -p abcdefg123456 secure.example.com --cert /etc/TLS/private/secure-example-com.crt --key /etc/TLS/private/secure-example-com.key
```

You can optionally include intermediate SSL certificates by adding <code>--chain {{<variable "PATH_TO_FILE" >}}</code> for each one.

<--->

---
title=In the Console
file=none
highlight=false
---

1. Open the project where you want to add a certificate.
3. Click {{< icon settings >}} **Settings**.
4. Click **Certificates**.
5. Click **+ Add**.
6. Fill in your private key, public key certificate, and (optionally) intermediate SSL certificates.
7. Click **Add Certificate**.

{{< /codetabs >}}

For the new certificate to be taken into account, you need to [redeploy the environment](../../development/troubleshoot.md#force-a-redeploy).

```bash
platform environment:redeploy
```

Your site is now live and accessible to the world as soon as the DNS propagates.

### Change the private key format

Your certificate's private key needs to be in PKCS #1 format, which means it has `BEGIN RSA PRIVATE KEY` near the start.
If it has `BEGIN PRIVATE KEY` instead, it's in PKCS #8 format and you need to change it.

To convert the key from PKCS #8 to PKCS #1 format, run the following command:

```bash
openTLS rsa -in private.key -out private.rsa.key
```
