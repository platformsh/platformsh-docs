---
title: HTTPS
---

{{% tls-introduction %}}

The default Let’s Encrypt TLS Certificates are:

- valid for 90 days
- automatically renewed 28 days before expiration

When a new certificate is required, your environment is automatically redeployed to renew the certificate.
During the redeployment, if required security and system upgrades are applied to your containers and only [the `deploy` and `post-deploy` hooks are run](../create-apps/hooks/hooks-comparison.md).
Certificate renewals take a few seconds *unless* upgrades are available for your containers.
In this case, containers are rebooted and the process takes longer.

If you don't want to use Let's Encrypt, or prefer to use your own certificate, see how to add a [third-party TLS certificate to your site](../domains/steps/tls.md).

### Limits

{{% lets_encrypt_limitations %}}

If you need more hostnames than that, obtain additional certificates or a wildcard certificate from a [third-party issuer](../domains/steps/tls.md).
Alternatively, consider splitting your project up into multiple Platform.sh projects.

## Using HTTPS

How HTTPS redirection is handled depends on the routes you have defined.
To serve all pages over TLS and automatically redirect any requests from HTTP to HTTPS, you can use something along the lines of:

```yaml {location=".platform/routes.yaml"}
"https://{default}/":
    type: upstream
    upstream: "app:http"

"https://www.{default}/":
    type: redirect
    to: "https://{default}/"
```

All traffic to your domain is sent to your app. The `www` subdomain redirects to the default domain. This also includes redirecting requests from HTTP to HTTPS. It affects your [default domain](../define-routes/_index.md#default).

[See more example on routes configuration](../define-routes/_index.md).

## Using HTTP only

Platform.sh recommends using HTTPS requests for all sites exclusively (although both HTTP and HTTPS are supported).
Using only HTTPS provides better security and access to certain features that web browsers only permit over HTTPS such as HTTP/2 connections, which can greatly improve performance.

Although Platform.sh doesn't recommend it, you can redirect HTTPS requests to HTTP explicitly to serve the site over HTTP only.
The use cases for this configuration are few.

```yaml {location=".platform/routes.yaml"}
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

Specifying only HTTP routes results in duplicate HTTPS routes being created automatically,
allowing the site to be served from both HTTP and HTTPS without redirects.

More complex routing logic is also possible if the situation calls for it.

## TLS configuration

Optionally, it's possible to further refine how secure TLS connections are handled on your cluster via the `tls` route property.

```yaml {location=".platform/routes.yaml"}
https://{default}/:
    type: upstream
    upstream: app:http
    tls:
        # ...
```

### `min_version`

Setting a minimum version of TLS makes the server automatically reject any connections using an older version of TLS.
Rejecting older versions with known security vulnerabilities is necessary for some security compliance processes.

```yaml {location=".platform/routes.yaml"}
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

```yaml {location=".platform/routes.yaml"}
tls:
    strict_transport_security:
        enabled: true
        include_subdomains: true
        preload: true
```

The sub-properties of `strict_transport_security` are:

- `enabled`: Can be `true`, `false`, or `null`.
  Defaults to `null`.
  If `false`, the other properties are ignored.
- `include_subdomains`: Can be `true` or `false`.
  Defaults to `false`.
  If `true`, browsers are instructed to apply HSTS restrictions to all subdomains as well.
- `preload`: Can be `true` or `false`.
  Defaults to `false`.
  If `true`, Google and others may add your site to a lookup reference of sites that should only ever be connected to over HTTPS.
  Many, although not all, browsers consult this list before connecting to a site over HTTP and switch to HTTPS if instructed.
  Although not part of the HSTS specification, it's supported by most browsers.

If enabled, the `Strict-Transport-Security` header is always be sent with a lifetime of 1 year.
The [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) has more detailed information on HSTS.

Note: If multiple routes for the same domain specify different HSTS settings, the entire domain still uses a shared configuration.
Specifically, if any route on the domain has `strict_transport_security.enabled` set to `false`, HSTS is disabled for the whole domain.
Otherwise, it's enabled for the whole domain if at least one such route has `enabled` set to `true`.
As this logic may be tricky to configure correctly,
it's strongly recommended to pick a single configuration for the whole domain and adding it on only a single route.

### Client authenticated TLS

In some non-browser applications (such as mobile applications, IoT devices, or other restricted-client-list use cases),
it's beneficial to restrict access to selected devices using TLS.
This process is known as client-authenticated TLS, and functions effectively as a more secure alternative to HTTP Basic Auth.

By default, any valid TLS cert issued by one of the common certificate issuing authorities is accepted.
Alternatively, you can restrict access to TLS certs issued by just those certificate authorities you specify, including a custom authority.
(The latter is generally only applicable if you are building a mass-market IoT device or similar.)
To do so, set `client_authentication` required and then provide a list of the certificates of the certificate authorities you wish to allow.

```yaml {location=".platform/routes.yaml"}
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

```yaml {location=".platform/routes.yaml"}
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

See the [SSL troubleshooting page](../domains/troubleshoot.md#verify-ssl).
