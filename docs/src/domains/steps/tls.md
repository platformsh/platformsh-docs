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

The use of HA or EV certificates is the main reason why you may wish to use a third-party issuer rather than the default certificate.
If you use wildcard routes, you need a custom certificate.

### Add a custom certificate

You can add a custom certificate by using the [command line interface](../../administration/cli/_index.md) or in the [Console](/administration/web/_index.md).

Your certificate has to use the "PKCS#1" format and start with `BEGIN RSA PRIVATE KEY`. If it doesn't, see [how to change the private key format](#how-to-change-the-private-key-format)

To add your custom certificate:

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

You can optionally include intermediate SSL certificates by adding `--chain` {{<variable "PATH_TO_FILE" >}} for each one.

<--->

---
title=In the Console
file=none
highlight=false
---

1. Open the [Console](https://console.platform.sh)
2. Click the tile of the project you want to access where you want to add a certificate.
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

If something isn't working see the [troubleshooting guide](/domains/troubleshoot.md) for common issues.
If that doesn't help, [contact support](../../overview/get-support.md).

### How to change the private key format

Your certificate's private key has to be in PKCS#1 style, and start with `BEGIN RSA PRIVATE KEY`.
If it starts with `BEGIN PRIVATE KEY`, it's PKCS#8 and bundled with the identifier for key type.

To convert the RSA key from PKCS#8 to PKCS#1, run:

```bash
openTLS rsa -in private.key -out private.rsa.key
```
