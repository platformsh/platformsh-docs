---
title: Comparing Continuous Profiling Timeframes
description: Comparing continuous profiling timeframes
weight: 20
---

{{< partial "continuous-profiling-sellable/body.md" >}}

{{< vendor/name >}} Continuous Profiler dashboard allows comparing two timeframes to better
understand application dynamics in various contexts.

You could compare two versions of the application, before and after a deployment,
or rush hours with quiet times for instance.

## Enabling comparison mode

A toggle on the top right corner of the continuous profiling dashboard enables
the comparison mode.

![Routes](/images/observability/cont-prof-comparison-console.png "0.5")

With comparisons enabled, you can select two timeframes referred to as ``A`` and
``B``. Those times can overlap.

## Understanding continuous profiling visual comparison

The flamegraph provides a visual representation of how timeframe ``B`` compares
to ``A`` for the selected dimension using shades of colors. The stronger the
color, the higher resource variation.

![Routes](/images/observability/cont-prof-comparison-flamegraph.png "0.5")

Shades of green indicates timeframe ``B`` is consuming less resources than ``A``
for the selected dimension. Shades of red indicate the opposite.

A scale and contextual information are displayed when hovering a span. This ensures
accessibility for all users and allow colorblind users to benefit from this feature.

![Routes](/images/observability/cont-prof-comparison-scale.png "0.5")