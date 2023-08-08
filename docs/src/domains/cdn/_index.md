---
title: "Content delivery networks (CDNs)"
sidebarTitle: "Content delivery networks"
weight: 3
description: Improve performance for distributed end-users of your website with a content delivery network (CDN).
layout: single
---

Using a CDN speeds up the delivery of your site's content to its users.
The CDN deploys edge servers at many locations around the world.
These edge servers behave like local caches to nearby users.
Bringing content closer to users helps enhance your site's perceived performance
and so can improve user engagement and retention.

Fastly is the recommended CDN for Platform.sh projects.
By default, Dedicated projects include a [Fastly CDN managed by Platform.sh](./managed-fastly.md).
Self-service Grid plans don't include a CDN by default, but you can set up one at any time,
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
the edge server makes a request to the Platform.sh server to pull and cache the resource.

For this process to be successful,
set an `X-Forwarded-Host` header to forward the original `Host` header value to the Platform.sh server.
Use your root domain as the value of your `X-Forwarded-Host` header,
for example: `example.com`.

To ensure your app handles the `X-Forwarded-Host` header,
you might need to adjust your app configuration.
For more information on how to set up an `X-Forwarded-Host` HTTP header,
see your CDN provider's official documentation.

## Disable the Platform.sh router cache

When you use a CDN, the Platform.sh router [HTTP caching](../../define-routes/cache.md) becomes redundant.
To disable it, change your cache configuration for the routes behind a CDN to the following:

```yaml {location=".platform/routes.yaml"}
"https://{default}/":
   type: upstream
   upstream: "app:http"
   cache:
       # Disable the HTTP cache on this route. It's handled by the CDN instead.
       enabled: false
```

## Configure your CDN to support high SLA

{{< premium-features/tiered "Enterprise and Elite" >}}

If your plan includes high SLA, configure your CDN so that Platform.sh can perform automated monitoring using NodePing.
To do so, [add all NodePing IP addresses](https://nodeping.com/faq.html#ip-addresses) to your CDN's allowlist.

If you want Platform.sh to limit checks to one or more of the following regions, [contact Support](../../overview/get-support.md):

- North America
- Europe
- East Asia / Oceania

## Prevent direct access to your Platform.sh server

When you use a CDN, you might want to prevent direct access to your Platform.sh server for security purposes.

### HTTP basic authentication

You can restrict access to your site's environments through HTTP basic authentication.
To access a restricted environment, users need to enter credentials through their browser.
By default, child environments inherit access settings configured on their parent environment.

To enable HTTP basic authentication,
follow these steps:

1. Generate a strong password.
2. Set up the authentication using [HTTP access control](../../environments/http-access-control.md#use-a-username-and-password).
3. Share your credentials with your CDN provider.

### Allow and deny IP addresses

You can secure your site's environments by allowing and denying IP addresses.
By default, child environments inherit the access settings configured on their parent environment.

Note that allowing and denying IP addresses means you have to update your configuration
when your CDN provider updates their IP addresses.

To allow and deny IP addresses, follow these steps:

1.  Set up your CDN.

2.  Get your CDN provider's current IP ranges:
    - [Fastly](https://docs.fastly.com/en/guides/accessing-fastlys-ip-ranges) 
    - [CloudFlare](https://www.cloudflare.com/ips/)

3.  To allow only these IPs on an environment,
   set up [HTTP access control](../../environments/http-access-control.md#filter-ip-addresses).

### Client-authenticated TLS

If your CDN provider supports it,
you can secure your site through [client-authenticated TLS](../../define-routes/https.md#enable-client-authenticated-tls).

To enable client-authenticated TLS, follow these steps:

1.  Obtain an Origin Certificate Authority (CA) certificate from your CDN provider.

2.  Check that the CA certificate is a `.crt` file.
   If the file is a `.pem` file, rename it to `cdn.crt`.

3.  Add the `cdn.crt` file to your Git repository.

4.  Change your routing configuration for the routes behind a CDN to the following:

    ```yaml {location=".platform/routes.yaml"}
    https://{default}:
        tls:
            client_authentication: "require"
            client_certificate_authorities:
                - !include
                  type: string
                  path: cdn.crt
    ```

The procedure can vary depending on your CDN.
Contact your CDN provider for specific assistance.

Note that client-authenticated TLS is a mutual authentication process.
It allows your CDN to check that it's communicating with your Platform.sh server
and vice versa.
So in addition to the CA certificate supplied by your CDN provider,
you need to [create your own TLS certificate](../../define-routes/https.md).