---
title: HTTPS
---

{{% tls-introduction %}}

The default Let’s Encrypt TLS Certificates are:

- valid for 90 days
- automatically renewed 28 days before expiration

When a new certificate is required, your environment is automatically redeployed to renew the certificate.
During the redeployment,
required security and system upgrades are applied to your containers
and only [the `deploy` and `post-deploy` hooks are run](../create-apps/hooks/hooks-comparison.md).
Certificate renewals take seconds unless upgrades are available for your containers.
In this case, containers are rebooted and the process takes longer.

If you don't want to use the default certificates,
configure your own [third-party TLS certificates](../domains/steps/tls.md).

### Limits

{{% lets_encrypt_limitations %}}

If you need more hostnames than that, obtain additional certificates or a wildcard certificate from a [third-party issuer](../domains/steps/tls.md).
Alternatively, consider splitting your project up into multiple Platform.sh projects.

## Using HTTPS

How HTTPS redirection is handled depends on the routes you have defined.
To serve all pages over TLS and automatically redirect requests from HTTP to HTTPS,
use a routing configuration similar to the following:

```yaml {location=".platform/routes.yaml"}
"https://{default}/":
    type: upstream
    upstream: "app:http"

"https://www.{default}/":
    type: redirect
    to: "https://{default}/"
```

All traffic to your domain is sent to your app.
The `www` subdomain redirects to the [default domain](../define-routes/_index.md#default).
This also includes redirecting requests from HTTP to HTTPS.

For more information, see how to [define routes](../define-routes/_index.md).

## Using HTTP only

Using only HTTPS provides enhanced security for your site.
When you use HTTPS, you can also access features that most web browsers only support over HTTPS,  
such as HTTP/2 connections, which can improve performance.

If you have no other choice, you can serve your site over HTTP only.
To do so, redirect HTTPS requests to HTTP using a configuration similar to the following:

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

When you only define HTTP routes, duplicate HTTPS routes are created automatically.
This allows your site to be served from both HTTP and HTTPS without redirects.

## TLS configuration

Optionally, you can specify how secure TLS connections are handled via the `tls` route property.

```yaml {location=".platform/routes.yaml"}
https://{default}/:
    type: upstream
    upstream: app:http
    tls:
        # ...
```

For troubleshooting SSL issues, see the [recommendations](../domains/troubleshoot.md#verify-ssl).

### `min_version`

Setting a minimum version of TLS makes the server automatically reject any connections using an older version of TLS.
Rejecting older versions with known security vulnerabilities is necessary for some security compliance processes.

```yaml {location=".platform/routes.yaml"}
tls:
    min_version: TLSv1.3
```

The above configuration results in requests using older TLS versions to be rejected.
Legal values are `TLSv1.2` and `TLSv1.3`.
TLS versions older than 1.2 aren't supported and are rejected regardless of the setting here.

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

| Name | Type | Default | Possible values | Description |
|------|------|---------|-----------------|-------------|
| `enabled` | `boolean` | `null` | `true`, `false`, or `null` | If enabled, the `Strict-Transport-Security` header is always sent with a lifetime of 1 year. The [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) has more detailed information on HSTS. If `false`, the other properties are ignored. |
| `include_subdomains` | `boolean` | `false` | `true` or `false` | Whether browsers should apply HSTS restrictions to all subdomains. |
| `preload` | `boolean` | `false` | `true` or `false` | The HSTS preloaded list is a list of websites that should only be connected to over HTTPS. Many browsers consult this list before connecting to a site. Setting `preload` to `true` gives the option for your website to be added to that list. Note that this list isn't part of the HSTS specification but is supported by most browsers. |

Note: If multiple routes for the same domain specify different HSTS settings, the entire domain uses a shared configuration.
Specifically, if any route on the domain has `strict_transport_security.enabled` set to `false`, HSTS is disabled for the whole domain.
Otherwise, it's enabled for the whole domain if at least one such route has `enabled` set to `true`.
As this logic can be tricky to configure correctly,
pick a single configuration for the whole domain and add it on only a single route.

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
