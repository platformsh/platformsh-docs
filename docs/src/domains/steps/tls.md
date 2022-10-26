---
title: "Configure a third-party TLS certificate"
weight: 3
sidebarTitle: "Custom TLS"
---

Platform.sh automatically provides all production and development environments with standard TLS certificates issued by [Let's Encrypt](https://letsencrypt.org/).
Let's Encrypt certificates don't support wildcard routes,
  so you need a custom certificate if you want to use these.
No further action is required to use TLS-encrypted connections beyond [specifying HTTPS routes](../../define-routes/https.md).

You can also provide your own third-party TLS certificate from the issuer of your choice.
Platform.sh doesn't charge for using a third-party TLS certificate, although the issuer may.
Consult your TLS issuer for instructions on how to generate an TLS certificate.

You can use many kinds of certificates, including domain-validated, extended validation, high-assurance, and wildcard certificates.
The main reasons to use a third-party issuer rather than the default certificate include using extended validation or high-assurance certificates.

A custom certificate isn't necessary for development environments.

If you are using a third-party certificate, seven days before it expires
Platform.sh issues a Let's Encrypt certificate and replaces the custom certificate with it to avoid interruption in service.
If you wish to continue using the custom certificate,
replace it with an updated certificate more than seven days before it expires.

### Add a custom certificate

You can add a custom certificate using the [CLI](../../administration/cli/_index.md) or in the [Console](../../administration/web/_index.md).

Your certificate has to use the "PKCS#1" format and start with `-----BEGIN RSA PRIVATE KEY-----`.
If it doesn't start that way, [change the format](#change-the-private-key-format).

To add your custom certificate, follow these steps:

{{< codetabs >}}

---
title=Using the CLI
file=none
highlight=false
---

1. Add the certificate with the following command:

    <!-- This is in HTML to get the variable shortcode to work properly -->
    <div class="highlight"><pre class="chroma"><code class="language-bash" data-lang="bash">platform domain:add {{<variable "DOMAIN" >}} --cert {{<variable "PATH_TO_CERTIFICATE_FILE" >}} --key {{<variable "PATH_TO_PRIVATE_KEY_FILE" >}}</code></pre></div>

    For example:

    ```bash
    platform domain:add secure.example.com --cert /etc/TLS/private/secure-example-com.crt --key /etc/TLS/private/secure-example-com.key
    ```

    You can optionally include intermediate SSL certificates by adding <code>--chain {{<variable "PATH_TO_FILE" >}}</code> for each one.

2. Redeploy your production environment with the following command:

    ```bash
    platform environment:redeploy
    ```

<--->

---
title=In the Console
file=none
highlight=false
---

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

Your certificate's private key needs to be in PKCS #1 format, which means it starts with `-----BEGIN RSA PRIVATE KEY-----`.
If it has `-----BEGIN PRIVATE KEY-----` instead, it's in PKCS #8 format and you need to change it.

To convert the private key from PKCS #8 to PKCS #1 format, run the following command:

```bash
openTLS rsa -in {{<variable "PATH_TO_PRIVATE_KEY_FILE" >}}.key -out {{<variable "PATH_TO_PRIVATE_KEY_FILE" >}}.rsa.key
```
