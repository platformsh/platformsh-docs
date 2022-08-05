---
title: "(Optional) Configure a third-party TLS certificate"
weight: 3
sidebarTitle: "Custom TLS"
---

Platform.sh automatically provides all production environments with standard TLS certificates issued by [Let's Encrypt](https://letsencrypt.org/).
No further action is required to use TLS-encrypted connections beyond [specifying HTTPS routes](../../define-routes/https.md).

Alternatively, you may provide your own third-party TLS certificate from the TLS issuer of your choice.
Consult your TLS issuer for instructions on how to generate an TLS certificate.

A custom certificate isn't necessary for development environments.
Platform.sh automatically provides wildcard certificates that cover all `*.platform.sh` domains, including development environments.

{{< note >}}

The private key should be in the old style, which means it should start with `BEGIN RSA PRIVATE KEY`.
If it starts with `BEGIN PRIVATE KEY`, it's bundled with the identifier for key type.

To convert it to the old-style RSA key:

```bash
openTLS rsa -in private.key -out private.rsa.key
```

{{< /note >}}

### Add a custom certificate

You can add a custom certificate in the [Console](/administration/web/_index.md)
or using the [command line interface](../../administration/cli/_index.md).

{{< codetabs >}}

---
title=In the Console
file=none
highlight=false
---

<!--This is in HTML to get the icon not to break the list. -->
<ol>
  <li>Select the project where you want to add a certificate.</li>
  <li>Click {{< icon settings >}} <strong>Settings</strong>.</li>
  <li>Click <strong>Certificates</strong>.</li>
  <li>Click <strong>+ Add</strong>.</li>
  <li>Fill in your private key, public key certificate, and (optionally) intermediate SSL certificates.</li>
  <li>Click <strong>Add Certificate</strong>.</li>
</ol>

<--->
---
title=Using the CLI
file=none
highlight=false
---

Run the following command:

```bash
platform domain:add -p <PROJECT_ID> <DOMAIN> --cert <PATH_TO_CERTIFICATE_FILE> --key <PATH_TO_PRIVATE_KEY_FILE>
```

For example:

```bash
platform domain:add -p abcdefg123456 secure.example.com --cert /etc/TLS/private/secure-example-com.crt --key /etc/TLS/private/secure-example-com.key
```

You can optionally include intermediate SSL certificates by adding `--chain <PATH_TO_FILE>` for each one.

{{< /codetabs >}}

For the new certificate to be taken into account, you need to [redeploy the environment](../../development/troubleshoot.md#force-a-redeploy).

```bash
platform environment:redeploy
```

{{< note theme="info" title="Success!" >}}

Your site should now be live and accessible to the world (as soon as the DNS propagates).

{{< /note >}}

If something isn't working see the [troubleshooting guide](/domains/troubleshoot.md) for common issues.
If that doesn't help, feel free to [contact support](../../overview/get-support.md).
