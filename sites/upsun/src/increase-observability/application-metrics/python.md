---
title: Continuous profiling for Python
sidebarTitle: "Python continuous profiler"
description: Configure and use the Python continuous profiler.
weight: 30
---

{{< partial "continuous-profiling-sellable/body.md" >}}

{{< vendor/name >}} [Continuous Profiler](./cont-prof.md) is powered by [Blackfire](../../../increase-observability/application-metrics/blackfire.md).
It is available directly from the [Console](/administration/web/_index.md), under the **Profiling** tab of your environments.

The PHP continuous profiling is currently made across 4 dimensions:
- **CPU Time**:  Time spent running on the CPU
- **Wall-time**: Elapsed time per function call
- **Heap Live Size**: Number of bytes allocated that are not yet garbage collected
- **Allocated Memory**: Number of bytes allocated in memory
- **Allocations**: Time spent running on the CPU

The default sampling frequency is 100 Hz. This means the Python continuous profiler is
collecting information 100 times per second.

## Prerequisites

{{< vendor/name >}} Continuous Profiler requires [`Python >=3.7.0`](/languages/python/_index.md).

## Installation

The [Blackfire Continuous Profiler Python library](https://github.com/blackfireio/python-continuous-profiling) is included by default in all
Python images matching its requirements. There is no installation required.

## Python continuous profiler API

The Python profiler API (`profiler`) can be initiated with the following options:

- `application_name`: the application name.
- `period`: specifies the length at which to collect CPU profiles. The default is 45 seconds.
- `upload_timeout`: observability data upload timeout. The default is 10 seconds.
- `labels`: a dict containing the custom labels specific to the profile payload that is sent.

The Python continuous profiler API has two functions:

``` python
def start():
def stop():
```

| Function               | Description |
| ---------------------- | ----------- |
| `def start():`         | The `start` function starts the continuous profiler probe. </br>It collects profiling information in the background and periodically uploads it to the Blackfire Agent until the ``stop`` function is called. |
| `def stop():`          |Stops the continuous profiling probe. |

## Example

Here is an example of how you can initiate the Python `profiler` on a basic app:

1. Create `example.py` with the following code:

   ``` python
   def foo():
     import time
     time.sleep(1.0)

   profiler = Profiler(application_name="my-python-app", labels={'my-extra-label': 'data'})
   profiler.start()
   foo()
   profiler.stop()
   ```

2. Run the app:

   ``` bash
   python example.py
   ```
