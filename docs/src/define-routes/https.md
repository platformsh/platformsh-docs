---
title: HTTPS
---

## Let's Encrypt

All environments on Platform.sh support both HTTP and HTTPS automatically.
Production TLS certificates are provided by [Let's Encrypt](https://letsencrypt.org/).
You may alternatively [provide your own TLS certificate from a third-party issuer](../domains/steps/tls.md) of your choice at no charge from us.

The Let’s Encrypt TLS Certificates are:

- valid for 90 days
- automatically renewed 28 days before expiration

If a renewal is available and needed, the environment is automatically redeployed to renew the certificate.
As no code changes are made, the build image is reused and build books are not run.
The deploy and post-deploy hook are run during this process.
During the redeploy, security and system upgrades are automatically applied to your containers when required.
That means that most of the time renewals take a few seconds *unless* upgrades are available for your containers.
In those cases, containers are rebooted and the process takes a little longer.

{{< note >}}
TLS certificates are often still called SSL certificates.
TLS is a newer encryption system that has replaced SSL, but the name SSL is still widely recognized.
In practice, they mean the same thing today, but TLS is the more correct term.
{{</ note >}}

### Limits

{{% lets_encrypt_limitations %}}

If you need more hostnames than that, obtain additional certificates or a wildcard certificate from a [third-party issuer](../domains/steps/tls.md).
Alternatively, consider splitting your project up into multiple Platform.sh projects.

## Using HTTPS

Platform.sh recommends using HTTPS requests for all sites exclusively.
Doing so provides better security, access to certain features that web browsers only permit over HTTPS,
and access to HTTP/2 connections on all sites, which can greatly improve performance.

How HTTPS redirection is handled depends on the routes you have defined.
Platform.sh recommends specifying all HTTPS routes in your `routes.yaml` file.
That results in all pages being served over TLS, and any requests for an HTTP URL are automatically redirected to HTTPS.

```yaml
"https://{default}/":
    type: upstream
    upstream: "app:http"

"https://www.{default}/":
    type: redirect
    to: "https://{default}/"
```

Specifying only HTTP routes results in duplicate HTTPS routes being created automatically,
allowing the site to be served from both HTTP and HTTPS without redirects.

Although Platform.sh doesn't recommend it, you can also redirect HTTPS requests to HTTP explicitly to serve the site over HTTP only.
The use cases for this configuration are few.

```yaml
"http://{default}/":
    type: upstream
    upstream: "app:http"

"http://www.{default}/":
    type: redirect
    to: "http://{default}/"

"https://{default}/":
    type: redirect
    to: "http://{default}/"

"https://www.{default}/":
    type: redirect
    to: "http://{default}/"
```

More complex routing logic is also possible if the situation calls for it.

## TLS configuration

Optionally, it's possible to further refine how secure TLS connections are handled on your cluster via the `tls` route property.

```yaml
https://{default}/:
    type: upstream
    upstream: app:http
    tls:
        # ...
```

### `min_version`

Setting a minimum version of TLS makes the server automatically reject any connections using an older version of TLS.
Rejecting older versions with known security vulnerabilities is necessary for some security compliance processes.

```yaml
tls:
    min_version: TLSv1.3
```

The above configuration results in requests using older TLS versions to be rejected.
Legal values are `TLSv1.2` and `TLSv1.3`.
TLS versions older than 1.2 aren't supported by Platform.sh and are rejected regardless of the setting here.

Note that if multiple routes for the same domain have different `min_version`s specified,
the highest specified is used for the whole domain.

### `strict_transport_security`

HTTP Strict Transport Security (HSTS) is a mechanism for telling browsers to use HTTPS exclusively with a particular website.
You can toggle it on for your site at the router level without having to touch your application, and configure its behavior from `routes.yaml`.

```yaml
tls:
    strict_transport_security:
        enabled: true
        include_subdomains: true
        preload: true
```

There are three sub-properties for the `strict_transport_security` property:

* `enabled`: Can be `true`, `false`, or `null`.
  Defaults to `null`.
  If `false`, the other properties are ignored.
* `include_subdomains`: Can be `true` or `false`.
  Defaults to `false`.
  If `true`, browsers are instructed to apply HSTS restrictions to all subdomains as well.
* `preload`: Can be `true` or `false`.
  Defaults to `false`.
  If `true`, Google and others may add your site to a lookup reference of sites that should only ever be connected to over HTTPS. 
  Many, although not all, browsers consult this list before connecting to a site over HTTP and switch to HTTPS if instructed.
  Although not part of the HSTS specification, it is supported by most browsers.

If enabled, the `Strict-Transport-Security` header is always be sent with a lifetime of 1 year.
The [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) has more detailed information on HSTS.

Note: If multiple routes for the same domain specify different HSTS settings, the entire domain still uses a shared configuration.
Specifically, if any route on the domain has `strict_transport_security.enabled` set to `false`, HSTS is disabled for the whole domain.
Otherwise, it's enabled for the whole domain if at least one such route has `enabled` set to `true`.
As this logic may be tricky to configure correctly,
it's strongly recommend to pick a single configuration for the whole domain and adding it on only a single route.

### Client authenticated TLS

In some non-browser applications (such as mobile applications, IoT devices, or other restricted-client-list use cases),
it's beneficial to restrict access to selected devices using TLS.
This process is known as client-authenticated TLS, and functions effectively as a more secure alternative to HTTP Basic Auth.

By default, any valid TLS cert issued by one of the common certificate issuing authorities is accepted.
Alternatively, you can restrict access to TLS certs issued by just those certificate authorities you specify, including a custom authority.
(The latter is generally only applicable if you are building a mass-market IoT device or similar.)
To do so, set `client_authentication` required and then provide a list of the certificates of the certificate authorities you wish to allow.

```yaml
tls:
    client_authentication: "require"
    client_certificate_authorities:
        - !include
            type: string
            path: root-ca1.crt
        - !include
            type: string
            path: root-ca2.crt
```

In this case, the certificate files are resolved relative to the `.platform` directory.
Alternatively, the certificates can be specified inline in the file:

```yaml
tls:
    client_authentication: "require"
    client_certificate_authorities:
        - |
            -----BEGIN CERTIFICATE-----
            ### Several lines of random characters here ###
            -----END CERTIFICATE-----
        - |
            -----BEGIN CERTIFICATE-----
            ### Several lines of different random characters here ###
            -----END CERTIFICATE-----
```

## Troubleshooting

For easier troubleshooting, feel free to use [the certificate checker tool](https://certcheck.pltfrm.sh/).
This tool assists in finding out where your domain is pointing to and provides some generic guidance.
It also assists when a CDN (Fastly, Cloudflare, ...) is used.
It's good practice to check both the apex and the `www` domain to ensure that both point to the cluster.

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

The renewal may fail because of the 64 character limit Let's Encrypt places on URLs.
If you have a branch with a long name, the environment URL is over this limit and the certificate is rejected.
Shortening the branch name to fewer than 20 characters should solve the issue.

Generated URLs have the following pattern:

```bash
<PLATFORM_ENVIRONMENT>-<PLATFORM_PROJECT>.<REGION>.platformsh.site
```

If you have a default domain and include it as an absolute URL, it's added to the start of your URL.
See [URLs in non-Production environments](./_index.md#urls-in-non-production-environments).

```bash
<DEFAULT_DOMAIN>.<PLATFORM_ENVIRONMENT>-<PLATFORM_PROJECT>.<REGION>.platformsh.site
```

* `DEFAULT_DOMAIN` = however many characters your default domain is
* `PLATFORM_ENVIRONMENT` = `PLATFORM_BRANCH` + 7 character hash
* `PLATFORM_PROJECT` = 13 characters
* `REGION` = 2 to 4 characters, depending on the region
* `platformsh.site` = 15 characters
* extra characters (`.` & `-`) = 4 to 5 characters, depending on if you have a default domain

This leaves you with 21 to 23 characters for your branch name (`PLATFORM_BRANCH`) without going over the 64 character limit,
depending on the region.
Since this pattern for generated URLs should remain similar even if it may change slightly,
your branch names should be no more than 20 characters.

### DNS Challenge

To provide a valid SSL-certificate,
Let's Encrypt needs to make sure that the requester is entitled to receive the SSL-certificate it asked for
(usually through the presence of a specific token on the DNS zone of that domain).

This ownership verification is achieved through the so called _Challenge_ step,
more background information can be found in the [Let's Encrypt Documentation](https://letsencrypt.org/docs/challenge-types/).

If you include them in your [routes definition](./_index.md),
Platform.sh checks that both the `example.platform.sh` and `www.example.platform.sh` domains are pointing to your project.
The certificate also encompasses both these domains.
Make sure that both your apex domain and it's `www` subdomain are pointing to your project,
more information can be found in out go live [step-by-step guide](../domains/steps/_index.md).

Sometimes, that verification fails, which results in the following error-message:
`Couldn't complete challenge [HTTP01: pending | DNS01: pending | TLSALPN01: pending]`

For the DNS challenge to work, domains and subdomains should point directly to your Platform.sh cluster (unless using a [CDN](../domains/cdn/_index.md)).
Otherwise, you see the following error:

```text
  E: Error validating domain www.some-example.platform.sh: Couldn't complete challenge [HTTP01: pending | DNS01: pending | TLSALPN01: pending]
  Unable to validate domains www.some-example.platform.sh, will retry in the background.
```
or

```text
  W: Failed to verify the challenge at the gateway for the domain 'www.some-example.platform.sh'
  E: Error validating domain www.some-example.platform.sh: Couldn't complete challenge [HTTP01: There was a problem with a DNS query during identifier validation]
```

Make sure that both the apex domain and it's `www` subdomain are both pointing to the cluster.
Note that DNS changes can take up to 24-48 hours to propagate.
See the [step-by-step guide](../domains/steps/_index.md) for more information.
If you have waited the 24-48 hours, properly configured the subdomain, and are still seeing an error of this type,
[redeploying](../development/troubleshoot.md#force-a-redeploy) the impacted environment usually solves the issue.

Also make sure that no conflicting DNS records exist for the domain.
For example, a conflicting AAAA (IPv6) DNS record usually results in a `[HTTP01: The client lacks sufficient authorization]` error.

If the certificate generation issue persists,
you could also verify if an outage is currently ongoing on [with Let's Encrypt](https://letsencrypt.status.io/).
If that isn't the case, please open a support ticket.
