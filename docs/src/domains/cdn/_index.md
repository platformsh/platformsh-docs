---
title: "Configure a content delivery network (CDN)"
sidebarTitle: "Content delivery networks"
weight: 3
description: Improve performance for distributed end-users of your website with a content delivery network (CDN).
layout: single
---
 
Using a CDN speeds up the delivery of your site's content to its users.
The CDN deploys servers at many locations around the world, known as Points of Presence (PoPs).
Each PoP accommodates an edge server that behaves like a local cache to nearby users.
Bringing content closer to users helps enhance your site's perceived performance,
and can therefore improve user engagement and retention.
 
By default, Dedicated plans include a [Fastly](./fastly.md) CDN managed by Platform.sh.
Self-Service Grid plans don't include a CDN by default, but you can set up one at any time.

## Before you begin

You need:

- An up-and-running Platform.sh project
- A CDN such as [Fastly](./fastly.md) or [Cloudflare](./cloudflare.md)

## Check your DDoS protection

All sites hosted by Platform.sh live on infrastructure provided by major cloud providers.
By default, you therefore benefit from the powerful DDoS protection services these cloud providers offer.
In most cases, it's enough to keep your site safe from DDoS attacks when using a CDN.

Note that Enterprise and Elite projects on Platform.sh also include a Web Application Firewall (WAF).
However, depending on your needs, you can [install your own WAF](../../security/waf.md) 
and add security measures not included in your plan.  

## Create a CNAME record for your domain name

To start routing client traffic through your CDN,
create a `CNAME` record for your domain name through your DNS provider.
For more information, see you DNS provider's official documentation.

Note that `CNAME` records can't point to apex domains.
However, most CDN providers offer [workarounds](../steps/dns.md#handling-apex-domains). 
For example, Fastly offers [Anycast options](https://docs.fastly.com/en/guides/using-fastly-with-apex-domains), 
while Cloudflare favors [`CNAME` flattening](https://developers.cloudflare.com/dns/additional-options/cname-flattening/).

## Set up TLS certificates

By default, Dedicated plans include two CDN TLS certificates, an apex and a wildcard one.
This allows for encryption of all traffic between your users and your app. 

You can also provide your own third-party CDN TLS certificate.
To do so, in your app's `private` directory,
place the certificate, the unencrypted private key, 
and the necessary certificate chain supplied by your TLS provider. 
This way, they are stored in a secure location. 
To add the TLS certificate to your CDN configuration, 
[create a support ticket](../../overview/get-support.md#create-a-support-ticket).

Note that if you need an Extended Validation TLS certificate, you can get it from any TLS provider. 
To add it to your CDN configuration, [create a support ticket](../../overview/get-support.md#create-a-support-ticket).

## Set up Host header forwarding

When a HTTP request is made to a website, the client adds a `Host` header to the request. 
The value of this header is the domain name the request is made to. 
When a server hosts multiple websites, 
it can therefore use the `Host` header to identify which domain to access to handle the request.

When using a CDN, the value of the `Host` header points to the CDN itself. 
To allow the CDN edge server to redirect the request to the Platform.sh origin server,
set up an `X-Forwarded-Host` HTTP header. 
Use your root domain as the value of your `X-Forwarded-Host` header, 
for example: `example.com`.
For more information on how to set up an `X-Forwarded-Host` HTTP header, 
see your CDN official documentation.

## Disable the Platform.sh router cache
 
When using a CDN, the Platform.sh router's [HTTP cache](../../define-routes/cache.md) becomes redundant.
To disable it, change your cache configuration to the following:
 
```yaml {location=".platform/routes.yaml"}
"https://{default}/":
   type: upstream
   upstream: "app:http"
   cache:
       # Disable the HTTP cache on this route. It's handled by the CDN instead.
       enabled: false
```
 
## Prevent direct access to your Platform.sh origin
 
When using a CDN, there are three ways to secure your Platform.sh origin:
 
- **Password-protected HTTP Authentication**.
- **Allowing and denying IP addresses**.
- **Client-authenticated TLS**.
 
### Password-protected HTTP authentication
 
If your CDN provider supports it, you can restrict access to your site 
through password-protected authentication at environment-level.
To access a restricted environment, users then need to enter credentials through their browser.
Note that, by default, children environments inherit access settings configured on their parent environment.

To enable password-protected HTTP authentication, 
follow these steps:
 
1. To ensure your CDN supports password-protected HTTP authentication, 
   check its official documentation.
2. Generate a strong password.
3. Set up the authentication using [HTTP access control](../../environments/http-access-control.md#use-a-username-and-password).
4. Share your password with your CDN provider.

When password-protected HTTP authentication is enabled,
your CDN adds a custom header to the origin request.
This custom header features a base64-encoded `username:password` combination based on the credentials you provided.
For example, if you set `Aladdin:OpenSesame` as `username:password`, 
it is encoded as a more secure combination similar to `Authorization: Basic QWxhZGRpbjpPcGVuU2VzYW1l`.
 
### Allow and deny IP addresses
 
You can secure your site by allowing and denying IP addresses at environment-level.
By default, children environments inherit access settings configured on their parent environment.
 
Note that allowing and denying IP addresses means you have to update your configuration 
when your CDN provider updates their IP addresses.
 
To allow and deny IP addresses, follow these steps:
 
1. Set up your CDN.
2. Get your CDN provider's current IP ranges:
   - [Fastly](https://docs.fastly.com/en/guides/accessing-fastlys-ip-ranges) 
   - [CloudFlare](https://www.cloudflare.com/ips/)
 
3. To allow only these IPs on an environment, 
   set up [HTTP access control](../../environments/http-access-control.md#filter-ip-addresses).
 
### Client-authenticated TLS
 
If your CDN provider supports it, 
you can secure your site through [client-authenticated TLS](../../define-routes/https.md#client-authenticated-tls).

To enable client-authenticated TLS, follow these steps:
 
1. Download the Origin Certificate Authority (CA) certificate from your CDN provider:
   - [Fastly](https://docs.fastly.com/products/waf-tuning-plus-package#authenticated-tls-to-origin)
   - [CloudFlare](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/set-up/#zone-level--cloudflare-certificate).
2. Check that the CA certificate is a `.crt` file.
   If your CDN provider sends you a `.pem` file, rename it to `cdn.crt`.
3. Add the `cdn.crt` file to your Git repository.
4. Change your routing configuration to the following:

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
It allows your CDN to check that it is communicating with your Platform.sh origin server
and vice versa.
Therefore, on top of the CA certificate supplied by your CDN provider,
you need to [create your own TLS certificate](../../define-routes/https.md#lets-encrypt).