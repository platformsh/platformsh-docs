# Content Delivery Network

Platform.sh Enterprise contracts come complete with a managed content delivery network (CDN).  Our experience has shown that effective caching can mean a huge difference in the perceived performance of an application by its users, and that placing the caches closer to your users (wherever they may be) is the best solution currently available.

We have partnerships with a variety of CDN vendors depending on your application’s needs.  Our recommended CDN provider is Fastly, or a split-configuration with Fastly serving dynamic HTML content and CloudFront serving static assets being a more cost efficient setup.

## DNS management

The distributed nature of most CDNs means that for proper functioning, any domains that you intend to make use of the CDN will be required to use CNAME records for pointing the DNS entries.  Pointing the root domain (example.com) at a CNAME record is not possible for all DNS hosts, so you will need to confirm this functionality or migrate to a new DNS host.  CloudFlare has a [more detailed writeup](https://blog.cloudflare.com/introducing-cname-flattening-rfc-compliant-cnames-at-a-domains-root/) of the challenges of root CNAMEs.

In the event that you and your team choose a pure Fastly solution, this is negated by their providing a set of Anycast IP addresses for you.  This allows you to create A records for your root domain that will point to Fastly’s CDN.

## Initial setup

Initial setup of the CDN takes place as part of your onboarding.  After the application is stood up on its Enterprise hardware we can begin the collaborative process of provisioning the CDN and configuring DNS and caching setup. We provide CDN services for both staging and production.

## Cache configuration

Depending on which CDN is decided as part of the pre-sales analysis, there may be varying levels of flexibility with regard to caching and ongoing cache invalidation.  This should be discussed between your sales representative and senior technical members of your team if there are concerns with CDN configuration and functionality.

If using Fastly as a CDN, it is possible to provide either custom VCL snippets or a full custom VCL file.  Platform.sh will grant customers access to do so upon request.  However, be aware that downtime caused by custom VCL configuration will not be covered by the SLA, just as application code in your repository is not covered by the SLA.

## Global Application Cache (Dual-CDN)

A common configuration we recommend is to split CDN traffic between Fastly for dynamic content and CloudFront for static content, branded as our Global Application Cache.  Fastly offers far greater flexibility while CloudFront offers a better cost-per-megabyte.  However, this configuration requires application-level changes to ensure generated asset URLs point to the CloudFront CDN.  While Platform.sh provides recommendations for major applications on how to configure them accordingly, doing so is the customer's responsibility.

The basic procedure to take advantage of the Global Application Cache requires some application development on your end in order to serve assets (and only assets) from a different subdomain (assets.example.com) whereas your site’s HTML will be served from www.example.com. This method gains you the flexibility of Fastly for your dynamic content but maintains our favorable cost relationship with CloudFront to serve the often heavier static assets.  Take into account that you typically don’t want to serve your HTML over the asset CDN subdomain.  This is a built in feature of some open source software, such as the Drupal CDN module, but requires planning on the part of your application development team if your framework doesn’t support this natively.

The default bandwidth limits included in your Enterprise plan are 100GB for the dynamic bandwidth (Fastly) and 1TB for assets (CloudFront).  This is more than enough to serve most applications in our experience, but obviously this is heavily dependent on traffic and content of your application.

## TLS encryption

Security and the related topic of encryption of data are fundamental principles here at Platform.sh, and as such we provide TLS certificates in the default Enterprise package.  This allows for encryption of all traffic between your users and your application.  By default we will provision a shared certificate with the chosen CDN vendor.  If you opt for the Global Application Cache, we will provision certificates for both the site subdomain (www) and the asset/CDN subdomain.  We use wildcard certificates to secure production, staging, and any other subdomains simultaneously.  If your needs Extended Validation SSL certificates you will need to provide your own from an issuer of your choice that we can install for you.

## Web Application Firewall & Anti-DDoS

For projects running on an AWS region, AWS Shield Standard is already included by default for  DDoS prevention. Customers are welcome to put their own WAF in front of the Enterprise cluster or add other security measures not included in the offering.
