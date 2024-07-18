---
title: Continuous profiling for Rust
sidebarTitle: "Rust continuous profiler"
description: Configure and use the Rust continuous profiler.
weight: 30
---

{{< vendor/name >}} [Continuous Profiler](./cont-prof.md) is powered by [Blackfire](../../../increase-observability/application-metrics/blackfire.md).
It is available directly the [Console](/administration/web/_index.md), under the **Profiling** tab of your environments.

The Rust continuous profiling is currently made across 3 dimensions:
- **CPU Time**:  Time spent running on the CPU
- **Allocated Memory**: Number of bytes allocated in memory
- **Allocations**: Time spent running on the CPU

The default sampling frequency is 100 Hz. This means the Rust continuous profiler is
collecting information 100 times per second. The allocated memory sampling frequency is 524288 Hz.

## Installation

The Blackfire Continuous Profiler Rust library is included by default in all
Rust images. There is no installation required nor minimal Rust version needed.

## Configuration

The Rust continuous profiler is enabled by default without configuration.

It is recommended to build your Rust application in [debug mode](https://doc.rust-lang.org/book/ch14-01-release-profiles.html) to benefit from comprehensive stacktrace and information that could be obfuscated and collapsed otherwise.

```shell
$ cargo build
```
