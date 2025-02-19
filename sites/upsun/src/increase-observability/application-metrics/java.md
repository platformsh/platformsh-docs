---
title: Continuous profiling for Java
sidebarTitle: "Java continuous profiler"
description: Configure and use the Java continuous profiler.
weight: 30
---

{{< vendor/name >}} [Continuous Profiler](/increase-observability/application-metrics/cont-prof.md) is powered by [Blackfire](../../../increase-observability/application-metrics/blackfire.md).
It is available directly the [Console](/administration/web/_index.md), under the **Profiling** tab of your environments.

The Java continuous profiling is currently made across 3 dimensions:
- **CPU Time**:  Time spent running on the CPU
- **Allocations**: Time spent running on the CPU
- **Allocated Memory**: Number of bytes allocated

The default sampling frequency is 100 Hz. This means the Java continuous profiler is
collecting information 100 times per second.

## Prerequisites

{{< vendor/name >}} Continuous Profiler requires [`Java >= 17`](/languages/java.md).

## Configuration

The Java continuous profiler is enabled by default without configuration.
