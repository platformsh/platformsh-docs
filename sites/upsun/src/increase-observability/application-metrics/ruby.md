---
title: Continuous profiling for Ruby
sidebarTitle: "Ruby continuous profiler"
description: Configure and use the Ruby continuous profiler.
weight: 30
---

{{< vendor/name >}} [Continuous Profiler](./cont-prof.md) is powered by [Blackfire](../../../increase-observability/application-metrics/blackfire.md).
It is available directly the [Console](/administration/web/_index.md), under the **Profiling** tab of your environments.

The Ruby continuous profiling is currently made across 3 dimensions:
- **CPU Time**:  Time spent running on the CPU
- **Wall-time**: elapsed time per function call
- **Allocations**: Time spent running on the CPU

The default sampling frequency is 100 Hz. This means the Ruby continuous profiler is
collecting information 100 times per second.

## Prerequisites

{{< vendor/name >}} Continuous Profiler requires [`Ruby >= 2.5`](/languages/ruby.md).

## Installation

1. Add the `datadog` gem to your `Gemfile` or `gems.rb` file:

``` bash
gem 'datadog', '~> 2.0'
```

2. Install the gems running the `bundle install` command.

3. Add the ``ddprofrb exec`` command to your Ruby application start command:

``` bash
bundle exec ddprofrb exec ruby myrubyapp.rb
```

Rails example:
``` bash
bundle exec ddprofrb exec bin/rails s
```

Alternatively, start the profiler by adding the following code in your application's entry point if you can't start it using `ddprofrb exec`:

``` bash
require 'datadog/profiling/preload'
```
