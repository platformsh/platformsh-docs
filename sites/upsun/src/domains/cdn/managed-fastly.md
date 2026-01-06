---
title: "Managed Fastly CDN"
sidebarTitle: "Managed Fastly CDN"
weight: 2
description: Bring your content closer to users with a Fastly CDN fully managed by {{% vendor/name %}}.
keywords:
  - mTLS
---

Instead of starting your own Fastly subscription and [managing your CDN yourself](/domains/cdn/fastly.md),
you can take advantage of a Fastly CDN provided by {{% vendor/name %}}.
These CDNs are exclusively set up and managed by {{% vendor/name %}}.

To modify any settings for a managed Fastly CDN, open a [support ticket](/learn/overview/get-support.md).
To add a managed Fastly CDN to your project, [contact sales](https://upsun.com/contact-us/).

{{< note theme="Info" >}}
{{% vendor/name %}} does not write nor debug any custom VCL on Managed Fastly CDN services.
{{< /note >}}

{{< note theme="note" title="Monitor CDN metrics">}}

You can access a summary of your monthly traffic usage under the "Traffic this month" section at the Project level inside [Console](https://console.upsun.com/). This will help you monitor your monthly bandwidth and requests consumption. 

In this summary, you will find specific details about:

- **Origin Bandwidth:** Data transferred from origin servers (in TB).

- **Origin Requests:** Requests served by origin servers (in millions of requests).

- **CDN Bandwidth & CDN Requests:** Shown if you have Fastly CDN enabled.

This data is updated daily and will reflect your traffic usage throughout the billing period. 

{{< /note >}}

{{< note theme="info" title="Set up traffic alerts">}}

You can also set up consumption alerts for your resource usage. Click the Alert button in the "Traffic this month" block within [Console](https://console.upsun.com/) to configure usage thresholds. For more information, head to the [Pricing docs page](/administration/pricing.html).

{{< /note >}}

## How Managed Fastly works

{{% vendor/name %}}’s Managed Fastly CDN routes incoming traffic through the Fastly edge network before requests reach your application. This enables global caching, edge logic (VCL), performance optimisation, and optional security features.

The Fastly CDN must be provisioned and managed by {{% vendor/name %}}. Features such as the {{% vendor/name %}} Web Application Firewall (WAF), edge rate limiting, and image optimization depend on this managed integration and cannot be used with a customer-managed Fastly account.

Once enabled, Fastly operates as the first point of contact for all HTTP requests, allowing requests to be cached, filtered, transformed, or blocked entirely at the edge.

{{< note theme="info" title="Feature dependencies">}}

- The {{% vendor/name %}} WAF requires the {{% vendor/name %}} Managed Fastly CDN.
- Customers cannot attach the WAF to an existing third-party Fastly service.
- Advanced Fastly features such as virtual patching and per-project logging require a configurable Fastly workspace.

{{< /note >}}

### Domain control validation

When you request for a new domain to be added to your Fastly service,
{{% vendor/name %}} [support](/learn/overview/get-support.md) provides you with a [`CNAME` record](/domains/steps/dns.md) for [domain control validation](/domains/troubleshoot.md#ownership-verification).
To add this `CNAME` record to your domain settings,
see how to [configure your DNS provider](/domains/steps/_index.md#2-configure-your-dns-provider).

### Transport Layer Security (TLS) certificates

By default, two [TLS certificates](/glossary/_index.md#transport-layer-security-tls) are included: an apex and a wildcard one.
This allows for encryption of all traffic between your users and your app.

If you use a Fastly CDN provided by {{% vendor/name %}},
you can provide your own third-party TLS certificates for an additional fee.

To do so, if you don't have one,
set up a [mount](/create-apps/image-properties/mounts.md) that isn't accessible to the web.
Use an environment with access limited to {{% vendor/name %}} support and trusted users.
[Transfer](/development/file-transfer.md) each certificate, its unencrypted private key,
and the intermediate certificate to the mount.
To notify {{% vendor/name %}} that a certificate is to be added to your CDN configuration,
open a [support ticket](/learn/overview/get-support.md).

If you need an Extended Validation TLS certificate,
you can get it from any TLS provider.
To add it to your CDN configuration, open a [support ticket](/learn/overview/get-support.md).

Note that when you add your own third-party TLS certificates,
you are responsible for renewing them in due time.
Failure to do so may result in outages and compromised security for your site.

### Retrieve your Fastly API token

The API token for your managed Fastly CDN is stored in the `FASTLY_API_TOKEN` or the `FASTLY_KEY` environment variables.

This variable is usually set in the `/master/settings/variables` folder of your project,
and you can access it [from a shell](/development/variables/use-variables.md#access-variables-in-a-shell)
or directly [in your app](/development/variables/use-variables.md#access-variables-in-your-app).


## Dynamic ACL and rate limiting

For details about updating an access control list (ACL) and applying rate limiting, check out the [Working with {{% vendor/name %}} rate-limiting implementation](https://support.platform.sh/hc/en-us/articles/29528777071890-Upsun-Fastly-Rate-Limiting-How-it-works-how-to-tune-it) article in the Upsun Community.

## Edge-level rate limiting

{{% vendor/name %}} provides edge-level rate limiting through Fastly, allowing you to control how many requests a single IP address or network can make within a given time window.

Rate limiting is applied at the edge, before requests reach your application, helping to reduce load and mitigate abusive traffic patterns.

### What Edge-level rate limiting can do

- Protect sensitive endpoints such as `/login`, `/admin`, or checkout paths
- Limit request floods from a single IP or IP range
- Reduce application load during traffic spikes
- Enable {{% vendor/company_name %}} Support to better handle attacks or high-traffic events by throttling traffic at the edge

Edge-level rate limiting is available as a standalone add-on (without the WAF).
<!-- VERIFY: Is the first bullet below only for Fixed? If so, confirm the sentence above is correct (it's written to include only the info in the 2nd bullet). If both bullets apply to Flex, delete the sentence above and uncomment this content, which is copied from Fixed.
Edge-level rate limiting is:
- Included with all {{% vendor/company_name %}} Fastly Next-Gen WAF tiers 
- Available as a standalone add-on (without the WAF)
-->

### Configuration and defaults

There are no default rate-limiting rules applied automatically. Rate limiting is configured during onboarding, or by request via {{% vendor/name %}} [Support](/learn/overview/get-support.md).

Rules can be scoped by:

- Request path
- Request type
- IP address or network
- Custom thresholds and actions (block, allow, log)

### Limitations

Edge-level rate limiting is a rule-based control mechanism, not an automated bot-detection system. It does not:

- Identify bots automatically
- Present CAPTCHA or JavaScript challenges
- Provide AI-driven mitigation

For advanced bot and scraper protection, {{% vendor/name %}} offers separate third-party integrations.