---
title: Continuous profiling for PHP
sidebarTitle: "PHP continuous profiler"
description: Configure and use the PHP continuous profiler.
weight: 30
---

## Continuous profiling on {{% vendor/name %}}

{{< vendor/name >}} [Continuous Profiler](./cont-prof.md) is powered by [Blackfire](../../../increase-observability/application-metrics/blackfire.md).
It is available directly from the Console under the `Profiling` tab of your environments.

The PHP continuous profiling is currently made accross 4 dimensions:
- **CPU Time**:  Time spent running on the CPU
- **Wall-time**: Elapsed time per function call
- **Allocated Memory**: Number of bytes allocated in memory
- **Allocations**: Time spent running on the CPU

The default sampling frequency is 100 Hz. This means the PHP continuous profiler is
collecting information 100 times per second.

## Prerequisites

{{< vendor/name >}} Continuous Profiler requires [`PHP >=8.2`](/languages/php.md).

## Installation

The Blackfire Continuous Profiler PHP library is included by default in all
PHP images matching its requirements. There is no installation required.

## Configuration

The PHP continuous profiler is enabled by default without configuration.

Optionnaly, you could override the following environment variables:

- `DD_PROFILING_ENABLED=true`: force the PHP continuous profiler activation/deactivation
- `DD_PROFILING_LOG_LEVEL=off`: control the PHP contiunous profiler log level

