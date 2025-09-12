---
title: HTTP metrics
description: Understand HTTP metrics
---

The HTTP metrics dashboard provides {{< vendor/name >}} users with network-related metrics.
Those insights are designed to help them better understand the state of their
applications.

{{< note theme="info" title="No CDN data">}}

It should be noted that the data being fed to the HTTP metrics dashboard **does not include CDN**.

{{< /note >}}

## Grid support

HTTP Metrics is only supported on Grid environments. **There is no support for Dedicated environments.**

## Accessing the dashboard

Those metrics can be accessed by clicking the **HTTP metrics** tab on the environment page within the console.

The HTTP metrics dashboard can help you:

- Verify if there were any recent spikes in error responses
- Check bandwidth consumption to determine if there were any service interruptions
- Identify specific URLs causing site-wide issues
- Prioritize performance optimization (see [integrate observability](/increase-observability/integrate-observability.md))

## HTTP requests status graph

The **HTTP requests** graph provides an aggregated view of the health of HTTP
requests made to the application. It reflects the status responses
(e.g. 1XX, 2XX, 3XX, 4XX, 5XX) of HTTP requests across a defined time frame.

This graph helps identify surge of error responses or periods of elevated
request activity.

## Bandwidth usage graph

The **Bandwidth** graph displays the data transfer volume. It represents
incoming (data the app receives) and outgoing (data the app sends) bandwidth
usage over time.

This graph helps identify bandwidth bottlenecks, optimize resource allocation,
and track bandwidth usage.


## Top 10 most impactful URLs

The **Top 10 URL Impact** graph and list pinpoint high-traffic or resource-intensive
URLs for targeted optimization or investigation. It showcases the evolution over
time of the top-10 most impactful URLs during a given time frame.

This graph helps identify potential trouble spots, understand user behavior, and
prioritize areas for optimization.

{{< note >}}
For security and privacy reasons, all URLs undergo the following sanitization measures:
- All query parameters (`?param=value`) are sanitized to prevent leakage of sensitive information.
- URLs exceeding 2048 characters are truncated to adhere to security best practices.
- Specific sensitive URL paths are proactively scrubbed and anonymized.
{{< /note >}}

## Limits
Note that the following data retention limits apply when using the HTTP metrics dashboard:

- **8-hour retention** for standard customers (without Observability Suite).
- **24-hour retention** for Observability Suite customers (Enterprise and Elite tiers).

For more information about the different tiers for standard and Observability Suite customers, visit the [Pricing page](https://upsun.com/pricing/).
