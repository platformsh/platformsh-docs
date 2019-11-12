# Content Delivery Networks

Platform.sh Enterprise plans (both Grid and Dedicated) include a Fastly CDN account by default, which will be managed by Platform.sh.  Our experience has shown that effective caching can mean a huge difference in the perceived performance of an application by its users, and that placing the caches closer to your users (wherever they may be) is the best solution currently available.

Self-Service Grid plans do not include a CDN by default, but you are welcome to configure one yourself.  See our [guidelines](/bestpractices/http-caching.md) for when and if to use a CDN for HTTP caching.

We have partnerships with a variety of CDN vendors depending on your application’s needs.  Our recommended CDN provider is [Fastly](/golive/cdn/fastly.md), or a split-configuration with Fastly serving dynamic HTML content and CloudFront serving static assets being a more cost efficient setup, the "[Global Application Cache](/golive/cdn/gac.md)".

## DNS management

The distributed nature of most CDNs means that for proper functioning, any domains that you intend to make use of the CDN will be required to use CNAME records for pointing the DNS entries.  Pointing the root domain (example.com) at a CNAME record is not possible for all DNS hosts, so you will need to confirm this functionality or migrate to a new DNS host.  CloudFlare has a [more detailed writeup](https://blog.cloudflare.com/introducing-cname-flattening-rfc-compliant-cnames-at-a-domains-root/) of the challenges of root CNAMEs.

In the event that you and your team choose a pure Fastly solution, this is negated by their providing a set of Anycast IP addresses for you.  This allows you to create A records for your root domain that will point to Fastly’s CDN.

## Initial setup

For Enterprise-Dedicated plans, CDN setup is handled by Platform.sh as part of your onboarding.  After the application is stood up on its Dedicated VMs we can begin the collaborative process of provisioning the CDN and configuring DNS and caching setup. We provide CDN services for both staging and production.

For self-service Grid plans, the setup can be done at any time by the customer.

## Cache configuration

Depending on which CDN is decided as part of the pre-sales analysis, there may be varying levels of flexibility with regard to caching and ongoing cache invalidation.  This should be discussed between your sales representative and senior technical members of your team if there are concerns with CDN configuration and functionality.

If using Fastly as a CDN, it is possible to provide either custom VCL snippets or a full custom VCL file.  Platform.sh will grant customers access to do so upon request.  However, be aware that downtime caused by custom VCL configuration will not be covered by the SLA, just as application code in your repository is not covered by the SLA.

## TLS encryption

Security and the related topic of encryption of data are fundamental principles here at Platform.sh, and as such we provide TLS certificates in the default Enterprise-Dedicated package.  This allows for encryption of all traffic between your users and your application.  By default we will provision a shared certificate with the chosen CDN vendor.  If you opt for the Global Application Cache, we will provision certificates for both the site subdomain (www) and the asset/CDN subdomain.  We use wildcard certificates to secure production, staging, and any other subdomains simultaneously.  If your needs Extended Validation SSL certificates you will need to provide your own from an issuer of your choice that we can install for you.

## Web Application Firewall & Anti-DDoS

All Platform.sh-hosted sites, either Grid or Dedicated, live on infrastructure provided by major cloud vendors.  These vendors include their own Level 3 DDoS protection that is sufficient for the vast majority of cases.

Customers are welcome to put their own WAF in front of a Dedicated cluster or add other security measures not included in the offering.

## The router cache

When using a CDN the Platform.sh router's HTTP cache becomes redundant.  In most cases it's best to disable it outright.  Modify your route in `.platform/routes.yaml` like so to disable the cache:

```yaml
"https://{default}/":
    type: upstream
    upstream: "app:http"
    cache:
        # Disable the HTTP cache on this route. It will be handled by the CDN instead.
        enabled: false
```
