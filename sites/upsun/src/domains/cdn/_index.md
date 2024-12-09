---
title: "Content delivery networks (CDNs)"
sidebarTitle: "Content delivery networks"
weight: 3
description: Improve performance for distributed end-users of your website with a content delivery network (CDN).
layout: single
keywords:
    - mTLS support
---

Using a CDN speeds up the delivery of your site's content to its users.
The CDN deploys edge servers at many locations around the world.
These edge servers behave like local caches to nearby users.
Bringing content closer to users helps enhance your site's perceived performance
and so can improve user engagement and retention.

Fastly is the recommended CDN for {{% vendor/name %}} projects.
Self-service projects don't include a CDN by default, but you can set up one at any time,
such as [Fastly](./fastly.md) or [Cloudflare](./cloudflare.md).

## DNS records

To start routing client traffic through your CDN, [set up a custom domain](../steps/_index.md).

If you use `CNAME` records for your custom domain, these records [can't point to apex domains](../steps/dns.md).
But most CDN providers offer workarounds.
For example, Fastly offers [Anycast options](./fastly.md#3-handle-apex-domains)
and Cloudflare offers [`CNAME` flattening](./cloudflare.md#3-handle-apex-domains).

## Host header forwarding

When an HTTP request is made to a website, the client adds a `Host` header to the request.
The value of this header is the domain name the request is made to.
When a server hosts multiple websites, like what a CDN does,
it can use the `Host` header to identify which domain to access to handle the request.

When a request is made from a client to fetch a resource on a CDN edge server,
the `Host` header value is rewritten to point to the CDN.
If the requested resource isn't cached on the edge server,
the edge server makes a request to the {{% vendor/name %}} server to pull and cache the resource.

For this process to be successful,
set an `X-Forwarded-Host` header to forward the original `Host` header value to the {{% vendor/name %}} server.
Use your root domain as the value of your `X-Forwarded-Host` header,
for example: `example.com`.

To ensure your app handles the `X-Forwarded-Host` header,
you might need to adjust your app configuration.
For more information on how to set up an `X-Forwarded-Host` HTTP header,
see your CDN provider's official documentation.

## Disable the router cache

When you use a CDN, the {{% vendor/name %}} router [HTTP caching](../../define-routes/cache.md) becomes redundant.
To disable it, change your cache configuration for the routes behind a CDN to the following:

```yaml {configFile="routes"}
routes:
  "https://{default}/":
    type: upstream
    upstream: "myapp:http"
    cache:
      # Disable the HTTP cache on this route. It's handled by the CDN instead.
      enabled: false
```

## Prevent direct access to your server

When you use a CDN, you might want to prevent direct access to your {{% vendor/name %}} server for security purposes.

### IP filtering and HTTP auth

While using password or IP based authentication might be possible, it is insecure, and unreliable. There are many scenarios in which the implementation can fail, and the security features circumvented.

Furthermore, IP based filtering will usually be impossible due to the fact that most CDNs use the `x-forwarded` HTTP header, which your project origin will use as the visitor IP address.

Both methods are highly insecure, and we highly recommend against them.

### Enable mTLS

If your CDN provider supports it,
you can secure your site through [mTLS](../../define-routes/https.md#enable-mtls).

To enable mTLS, follow these steps:

1.  Obtain an Origin Certificate Authority (CA) certificate from your CDN provider.

2.  Check that the CA certificate is a `.crt` file.
   If the file is a `.pem` file, rename it to `cdn.crt`.

3.  Add the `cdn.crt` file to your Git repository.

4.  Change your routing configuration for the routes behind a CDN to the following:

    ```yaml {configFile="routes"}
    routes:
      "https://{default}":
        tls:
          client_authentication: "require"
          client_certificate_authorities:
            - !include
              type: string
              path: cdn.crt
    ```

The procedure can vary depending on your CDN.
Contact your CDN provider for specific assistance.

Note that mTLS is a mutual authentication process.
It allows your CDN to check that it's communicating with your {{% vendor/name %}} server
and vice versa.
So in addition to the CA certificate supplied by your CDN provider,
you need to [create your own TLS certificate](../../define-routes/https.md).
