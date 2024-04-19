---
title: HTTP metrics
description: Understand HTTP metrics
---

The HTTP metrics dashboard provides {{< vendor/name >}} users with network-related metrics.
Those insights are designed to help them better understand the state of their
applications.

Those metrics can be accessed by clicking the **HTTP metrics** tab on the
environment page within the console.

The HTTP metrics dashboard can help you:
- Verify if there were any recent spikes in error responses
- Check bandwidth consumption to determine if there were any service interruptions
- Identify specific URLs causing site-wide issues
- Prioritize performance optimization (see [application metrics](../application-metrics/_index.md))


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
