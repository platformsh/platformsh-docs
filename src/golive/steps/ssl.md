# (Optional) Configure a third-party SSL certificate

Platform.sh automatically provides standard SSL certificates issued by [Let's Encrypt](https://letsencrypt.org/) to all production instances. No further action is required to use SSL-encrypted connections beyond [specifying HTTPS routes](/configuration/routes.md#HTTPS) in your `routes.yaml` file.

Alternatively, you may provide your own third party SSL certificate from the SSL issuer of your choice at no charge from us.  Please consult your SSL issuer for instructions on how to generate an SSL certificate.

A custom certificate is not necessary for development environments.  Platform.sh automatically provides wildcard certificates that cover all \*.platform.sh domains, including development environments.

> **note**
> The private key should be in the old style, which means it should start with BEGIN RSA PRIVATE KEY. If it starts with BEGIN PRIVATE KEY that means it is bundled with the identifier for key type. To convert it to the old-style RSA key:
> `openssl rsa -in private.key -out private.rsa.key`

### Adding a custom certificate through the web interface

You can add a custom certificate via the Platform.sh [Web Interface](/administration/web.md). Just go to the [project configuration page](/administration/web/configure-project.md) in the web interface and click on Domains. If you already have a domain, you can edit the domain and then click on the Add SSL certificate button. You can then add your private key, public key certificate and optional certificate chain.

![UI configuration for SSL](/images/ui-ssl.png)

### Adding a custom certificate through the CLI

Example:
```bash
platform domain:add secure.example.com --cert=/etc/ssl/private/secure-example-com.crt --key=/etc/ssl/private/secure-example-com.key
```

See `platform help domain:add` for more information.

---

> **Success!**
> Your site should now be live, and accessible to the world (as soon as the DNS propagates).

If something is not working see the [troubleshooting guide](/golive/troubleshoot.md) for common issues.  If that doesn't help feel feel free to contact support.
