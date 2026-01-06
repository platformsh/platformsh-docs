---
title: Fastly WAF
description: "Find out about the offers you can choose from to subscribe to the Fastly Next-Gen Web Application Firewall (WAF) through {{% vendor/name %}}."
weight: 2
banner:
    type: tiered-feature
---

On top of the {{% vendor/name %}} Web Application Firewall (WAF),
you can subscribe to the Fastly Next-Gen Web Application Firewall (Next-Gen WAF) to further protect your app from security threats.

## Available offers

If you want to subscribe to the Fastly Next-Gen WAF through {{% vendor/name %}},
you can choose from two offers:

- If you subscribe to the **Basic** offer, your WAF is fully managed by {{% vendor/name %}}.
- If you subscribe to the **Basic configurable** offer, your WAF is fully managed by {{% vendor/name %}} too, but with additional flexibility and visibility provided.

To view a list of all the features included in each offer, see the following table.

{{< note theme="info" >}}

Links to the official [Fastly Next-Gen WAF documentation](https://docs.fastly.com/products/fastly-next-gen-waf) are provided for reference only.
The offers described on this page have been designed specifically for {{% vendor/name %}} customers.
Included features may present limitations compared to those advertised by Fastly to their direct customers.

{{< /note >}}

| Capability                                                                                                                                          | Basic offer     | Basic configurable offer          |
|-----------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------------------------------|
| Available modes                                                                                                                                     | Block mode only | Block, not blocking, off modes    |
| [Default attack signals](https://docs.fastly.com/signalsciences/using-signal-sciences/signals/using-system-signals/#attacks)                        | Yes             | Yes                               |
| [Default anomaly signals](https://docs.fastly.com/signalsciences/using-signal-sciences/signals/using-system-signals/#anomalies)                     | Yes             | Yes                               |
| [Virtual patching](https://www.fastly.com/documentation/guides/next-gen-waf/using-ngwaf/rules/working-with-templated-rules/#virtual-patching-rules) | No              | Yes, in block mode only           |
| [Default dashboards](https://docs.fastly.com/signalsciences/using-signal-sciences/web-interface/about-the-site-overview-page/)                      | No              | During quarterly business reviews |
| [Custom response codes](https://docs.fastly.com/signalsciences/using-signal-sciences/custom-response-codes/)                                        | No              | No                                |
| [Custom signals](https://docs.fastly.com/signalsciences/using-signal-sciences/signals/working-with-custom-signals/)                                 | No              | No                                |
| [Standard API & ATO signals](https://www.fastly.com/documentation/guides/next-gen-waf/using-ngwaf/rules/working-with-templated-rules/)              | No              | No                                |

To subscribe to a Fastly Next-Gen WAF offer through {{% vendor/name %}},
[contact Sales](https://upsun.com/contact-us/).

## Next-Gen WAF Tier Comparison

#### Basic 

- Block-only mode
- Default attack and anomaly signals enabled
- No virtual patching
- No default dashboards
- No custom signals, response codes, or API/ATO signals

This tier is best suited for baseline protection with minimal configuration requirements.

#### Basic Configurable 

- Block, not blocking, and off modes
- Default attack and anomaly signals enabled
- Virtual patching available in block mode
- Default dashboards reviewed during quarterly business reviews
- No custom signals, response codes, or API/ATO signals 

This tier is best for customers needing custom rules, CVE protection, per-project visibility, or log integration.

## How the Fastly Next-Gen WAF Works

The Fastly Next-Gen WAF evaluates incoming requests using a combination of signals, conditions, actions, and thresholds.

### Signals

Signals classify and tag requests based on observed patterns, such as:

- SQL injection attempts
- Cross-site scripting payloads
- Repeated 404 requests
- Known attack signatures

Signals are informational and are not inherently “good” or “bad”.

### Conditions

Conditions define where and when a rule applies. Examples include:

- Specific URL paths
- Request methods
- Geographic origin
- Presence of certain signals

### Actions

Actions define what happens when a rule matches (allow/log apply to the configurable offer):

- Block the request
- Allow the request
- Log the request for analysis

{{< note theme="info" >}}

The Basic Next-Gen WAF offer operates in block-only mode.

{{< /note >}}

### Thresholds

Thresholds define volume-based triggers. For example, block if more than `N` suspicious requests occur from the same IP within a defined time window to distinguish normal user behaviour from automated probing or attacks.

### Virtual Patching

Virtual patches are temporary WAF rules provided by Fastly to block known CVEs at the edge. They:

- Protect against specific, identified vulnerabilities
- Buy time while application dependencies are patched
- Do not replace proper application updates

{{< note theme="info" >}}

Virtual patching is available only in the Basic Configurable Next-Gen WAF tier.

{{< /note >}}

## Scope and Limitations

The Fastly Next-Gen WAF mitigates many common web-based attacks, including parts of the OWASP Top 10. However, it does not replace application-level security. The WAF does not automatically protect against:

- Weak authentication or password policies
- Insecure application design
- Business-logic flaws
- All bot or scraper traffic
- All DDoS attack types

Some attacks are mitigated at the CDN network layer, while others require identifiable patterns that can be enforced via WAF or rate-limiting rules.

{{< note theme="info" title="No automatic challenges">}}

{{% vendor/name %}}’s Fastly Next-Gen WAF does not provide automatic CAPTCHA or JavaScript challenges. Traffic is evaluated using rule-based signals, thresholds, and actions configured during onboarding or [via Support](/learn/overview/get-support.md).

{{< /note >}}

## Configuration and enablement

Fastly Next-Gen WAF features are not self-service. Enablement and configuration occur during customer onboarding, or via a [Support request](/learn/overview/get-support.md) after purchase.
