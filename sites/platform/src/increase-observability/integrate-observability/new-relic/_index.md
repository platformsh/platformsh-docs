---
title: "New Relic"
weight: 2
toc: false
sectionBefore: Third-party observability tools
description: |
  {{% vendor/name %}} supports New Relic application performance monitoring.
layout: single
---

{{% vendor/name %}} supports [New Relic application performance monitoring](https://newrelic.com/products/application-monitoring).

{{% version/specific %}}
## On a {{% names/dedicated-gen-2 %}} cluster

Open a [support ticket](/learn/overview/get-support.md) and let us know what your license key is.
Our support team will install it and let you know when it's complete.

## On a Grid plan or {{% names/dedicated-gen-3 %}} infrastructure

On Grid plans and {{% names/dedicated-gen-3 %}} infrastructure, configure your project.
<--->
{{% /version/specific %}}

The configuration for New Relic varies a bit by language.
See language-specific instructions:

- [Java](/increase-observability/integrate-observability/new-relic/java.md)
- [Node.js](/increase-observability/integrate-observability/new-relic/nodejs.md)
- [PHP](/increase-observability/integrate-observability/new-relic/php.md)

For more languages, see the [New Relic Documentation](https://docs.newrelic.com/docs/agents/).
Install the specific agent in the [build hook](/create-apps/hooks/_index.md).
