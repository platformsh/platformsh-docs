---
title: "Content delivery networks (CDNs)"
sidebarTitle: "Content delivery networks"
weight: 3
description: Improve performance for distributed end-users of your website with a content delivery network (CDN).
layout: single
---

Effective caching can mean a huge difference in the perceived performance of an app by its users.
Placing the caches closer to your users (wherever they may be) is the best solution currently available.

Dedicated plans include a Fastly CDN account by default, which is managed by Platform.sh.

Self-Service Grid plans don't include a CDN by default, but you are welcome to configure one yourself.
See our [guidelines](../../bestpractices/http-caching.md) for when and if to use a CDN for HTTP caching.

Our recommended CDN provider is [Fastly](./fastly.md).

## DNS management

The distributed nature of most CDNs means that for proper functioning,
any domains that you intend to make use of the CDN are required to use `CNAME` records for DNS entries.
Not all DNS registrars support pointing from an apex domain such as `example.com` to a hostname with a `CNAME` record.
Ideally, your registrar supports [`CNAME` records for apex domains](../steps/dns.md#handling-apex-domains).

CDNs have different methods to overcome this issue.
CloudFlare uses [`CNAME` flattening](https://blog.cloudflare.com/introducing-cname-flattening-rfc-compliant-cnames-at-a-domains-root/).
Fastly provides a set of Anycast IP addresses so you can [create A records for your root domain pointing to Fastly’s CDN](https://docs.fastly.com/en/guides/using-fastly-with-apex-domains).

## Initial setup

For Dedicated plans, a CDN is set up automatically for both Staging and Production environments as part of your onboarding.

For self-service Grid plans, the setup can be done at any time by the customer.

## Cache configuration

Depending on which CDN is decided as part of the pre-sales analysis,
there may be varying levels of flexibility with regard to caching and ongoing cache invalidation.
This should be discussed between your sales representative and senior technical members of your team
if there are concerns with CDN configuration and functionality.

If using Fastly as a CDN, you can provide custom VCL snippets or a full custom VCL file through a [support ticket](../../overview/get-support.md).
Be aware that downtime caused by custom VCL configuration isn't covered by the SLA,
just as app code in your repository isn't covered by the SLA.

## TLS encryption

Security and the related topic of encryption of data are fundamental principles at Platform.sh,
and so Dedicated packages include TLS certificates by default.
This allows for encryption of all traffic between your users and your app.
By default, a shared certificate is provisioned with the chosen CDN vendor.
If you opt for the Global Application Cache, certificates are provisioned for both the site subdomain (`www`) and the asset/CDN subdomain.
Wildcard certificates are used to secure Production and Staging environments and any other subdomains simultaneously.
If you need Extended Validation TLS certificates,
you need to provide your own from an issuer of your choice that can then be installed for you.

If you need to provide your own TLS certificate, place the certificate, the unencrypted private key,
and the necessary certificate chain supplied by your TLS provider in your app's `private` directory (not web accessible),
and then open a ticket to let our team know to install it.

Dedicated plans support a single TLS certificate on the origin.
Support for multiple certificates is offered only through a CDN such as CloudFront or Fastly.
Self-signed certificates can optionally be used on the origin for development purposes or for enabling TLS between the CDN and origin.

All TLS certificates used with CloudFront MUST be 2048 bit certificates.
Larger sizes don't work.

## Host Header forwarding

The `Host` HTTP header tells the server what domain name is being requested,
which may vary when multiple domains are served from the same server or through the same proxy, as is the case with a CDN.
But the CDN can't use the production domain name to reach Platform.sh, as that domain already routes to the CDN.
So it uses the origin name provided by Platform.sh.

To ensure your TLS certificates are valid for both requests from clients to the CDN and from the CDN to the server on Platform.sh,
you need to take two additional steps:

1. Configure your CDN to set the `X-Forwarded-Host` HTTP header to your domain, for example: `example.com`.
   That allows the request from the CDN to Platform.sh to still carry the original requested domain.
   The specific way to do so varies by the CDN.
2. Ensure your app can read from the `X-Forwarded-Host` header should it need the Host information.
   Many popular apps already do so,
   but if you have a custom app make sure that it checks for that header
   and uses it instead of `Host` as appropriate.

## Web Application Firewall & Anti-DDoS

All Platform.sh-hosted sites, either Grid or Dedicated, live on infrastructure provided by major cloud vendors.
These vendors include their own Level 3 DDoS protection that is sufficient for the majority of cases.

Customers are welcome to put their own WAF in front of a Dedicated cluster or add other security measures not included in the offering.

## The router cache

When using a CDN the Platform.sh router's HTTP cache becomes redundant.
In most cases it's best to disable it outright.
Modify your route like so to disable the cache:

```yaml {location=".platform/routes.yaml"}
"https://{default}/":
    type: upstream
    upstream: "app:http"
    cache:
        # Disable the HTTP cache on this route. It's handled by the CDN instead.
        enabled: false
```

## Preventing direct access

When using a CDN, you might not want users to access your Platform.sh origin directly.
There are three ways to secure your origin:

- **Password protected HTTP Authentication**: Restrict access to your project with the [HTTP access control](../../environments/http-access-control.md).
- **Allowing and denying IP addresses**: If your CDN doesn't support adding headers to the request to origin, you can allow the IP addresses of your CDN.
- **Client-authenticated TLS**.

### Password protected HTTP authentication

This approach applies the same username and password to your production and all development environments.
You can have developers enter credentials through their browser,
or override the access control setting for each child environment.

To use password protected HTTP Authentication:

1. Consult your CDN's documentation to ensure it supports that feature.
2. Generate a password of sufficient strength.
3. Password protect your project using [HTTP access control](../../environments/http-access-control.md).
4. Share the password with your CDN provider.
5. Make sure the CDN adds a header to authenticate correctly to your origin by adding a custom header to the origin request with the base64 encoded `username:password` you chose in step 2.
   For example: `Aladdin:OpenSesame` would become `Authorization: Basic QWxhZGRpbjpPcGVuU2VzYW1l`.

### Allowing and denying IP addresses

This approach applies the same IP restrictions to your production and all development environments.
To remove it from development environments, you need to disable it on each environment
or else create a single child of the default environment where it is disabled
and them make all development branches off of that environment.

You also have to update your configuration when your CDN updates their IP addresses.

To allow and deny IP addresses:

1. Set up your CDN.
2. Get the IP range for your CDN provider:

    - [CloudFlare](https://www.cloudflare.com/ips/)
    - [Fastly](https://docs.fastly.com/en/guides/accessing-fastlys-ip-ranges)

3. Allow only these IPs for your project using [HTTP access control](../../environments/http-access-control.md#filter-ip-addresses).

### Client-authenticated TLS

If your CDN offers this option, an alternative way of securing the connection is [client-authenticated TLS](../../define-routes/https.md#client-authenticated-tls).
Note: Remember to permit your developers to access the origin by creating your own certificate
or else they can't access the project URL directly.

To activate authenticated TLS follow the following steps:

1. Download the certificate from your CDN provider:
    - [CloudFlare](https://developers.cloudflare.com/ssl/static/authenticated_origin_pull_ca.pem).
      Using client-authenticated TLS with Cloudflare is the recommended approach.
      It avoids the possibility that an attacker could make a Cloudflare account to bypass your origin restriction.
      Use the authenticated origin pull method to secure your origin.
    - [Fastly](https://docs.fastly.com/products/waf-tuning-plus-package#authenticated-tls-to-origin)

2. Make sure you have a `.crt` file.
   If you have a `.pem` file, rename it to `cdn.crt`.
3. Add the `cdn.crt` file to your Git repository
4. Add the relevant configuration:

   ```yaml {location=".platform/routes.yaml"}
   https://{default}:
       tls:
           client_authentication: "require"
           client_certificate_authorities:
               - !include
                 type: string
                 path: cdn.crt
   ```

These steps are generally similar but can vary for different CDN providers.
Contact your CDN provider's support for specific assistance.
