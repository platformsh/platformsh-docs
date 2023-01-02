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
By default, Dedicated projects include a [Fastly](./fastly.md) CDN managed by Platform.sh.
Self-service Grid plans don't include a CDN by default, but you can set up one at any time.

## CNAME records

To start routing client traffic through your CDN,
create `CNAME` records for your domain names through your DNS provider.
For more information, see you DNS provider's official documentation.

Note that `CNAME` records can't point to apex domains,
but most CDN providers offer [workarounds](../steps/dns.md#handling-apex-domains).

## DDoS protection

In a distributed denial of service (DDoS) attack, 
an attacker floods a server with fake requests.
The resources hosted by that server become inaccessible to real users.

All sites hosted by Platform.sh live on infrastructure provided by major cloud providers.
By default, you benefit from the powerful DDoS protection services these cloud providers offer.
In most cases, these protection services are enough to keep your site safe from DDoS attacks,
including when you use a CDN.

Enterprise and Elite projects on Platform.sh also include a [web application firewall (WAF)](../../security/waf.md). 
Depending on your needs, you can install your own WAF and add security measures not included in your plan.  

## Third-party TLS certificates

Dedicated plans include two [transport layer security (TLS) certificates](../../other/glossary.md#transport-layer-security-tls), 
an apex and a wildcard one.
This allows for encryption of all traffic between your users and your app. 

If you want to, you can also provide your own third-party TLS certificate.
[Transfer your certificate](../../development/file-transfer.md), 
its unencrypted private key and the intermediate certificate to a non-web accessible [mount](../../create-apps/app-reference.md#mounts), 
on an environment that only Platform.sh support and trusted users can access.
In this way, your private key can't be compromised.
To add the TLS certificate to your CDN configuration, 
[create a support ticket](../../overview/get-support.md#create-a-support-ticket).

Note that when you add your own third-party TLS certificate,
you are responsible for renewing them in due time.
Failure to do so may result in outages and compromised security for your site.

If you need an Extended Validation TLS certificate, you can get it from any TLS provider. 
To add it to your CDN configuration, [create a support ticket](../../overview/get-support.md#create-a-support-ticket).

## Host header forwarding

When a HTTP request is made to a website, the client adds a `Host` header to the request. 
The value of this header is the domain name the request is made to. 
When a server hosts multiple websites, like what a CDN does,
it can use the `Host` header to identify which domain to access to handle the request.

When a request is made from a client for an object on a CDN edge server, 
the `Host` header value is rewritten to point to the CDN. 
If the object isn't cached on the edge server, 
the edge server makes a request to the Platform.sh server to pull and cache the object.

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
 
## Prevent direct access to your Platform.sh server
 
When you use a CDN, there are three ways to prevent direct access to your Platform.sh server:
 
- HTTP basic authentication
- Allowing and denying IP addresses
- Client-authenticated TLS
 
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
you can secure your site through [client-authenticated TLS](../../define-routes/https.md#client-authenticated-tls).

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
you need to [create your own TLS certificate](../../define-routes/https.md#lets-encrypt).