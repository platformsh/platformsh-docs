---
title: Continuous profiling for Go
sidebarTitle: "Go continuous profiler"
description: Configure and use the Go continuous profiler.
weight: 30
---

{{< partial "continuous-profiling-sellable/body.md" >}}

## Continuous profiling on {{% vendor/name %}}

{{< vendor/name >}} [Continuous Profiler](./cont-prof.md) is powered by [Blackfire](../../../increase-observability/application-metrics/blackfire.md).
It is available directly from the Console under the `Profiling` tab of your environments.

The GO continuous profiling is currently made across 6 dimensions:
- **Allocations**: Number of objects allocated
- **Allocated Memory**: Number of bytes allocated
- **CPU**: Time spent running on the CPU
- **Goroutines**: Number of goroutines (both on-CPU and off-CPU)
- **Heap Live Objects**: Number of objects allocated that are not yet garbage collected
- **Heap Live Size**: Number of bytes allocated that are not yet garbage collected

The default sampling frequency is 100 Hz. This means the Go continuous profiler is
collecting information 100 times per second.

## Prerequisites

{{< vendor/name >}} Continuous Profiler requires [`Go >=1.18`](/languages/go.md).

## Installation

Get the [Blackfire Continuous Profiler Go library](https://github.com/blackfireio/go-continuous-profiling):

```bash
go get github.com/blackfireio/go-continuous-profiling
```

## Go continuous profiler API

The Go continuous profiler API has two functions:

```go
func Start(opts ...Option) error {}
func Stop() {}
```

### `func Start(opts ...Option) error`

`Start` starts the continuous profiler probe. It collects profiling information and uploads
it to the Blackfire Agent periodically.

```go
profiler.Start(
       profiler.WithCPUDuration(3 * time.Second),
       profiler.WithCPUProfileRate(1000),
       profiler.WithProfileTypes(profiler.CPUProfile, profiler.HeapProfile, profiler.GoroutineProfile),
       profiler.WithLabels({
            "key1": "value1",
            "key2": "value2",
       }),
       profiler.WithUploadTimeout(5 * time.Second),
)
defer profiler.Stop()
```

The `Start` function accepts the following options:

- `WithCPUDuration`: specifies the length at which to collect CPU profiles.
The default is 45 seconds. Can also be set via the environment variable `BLACKFIRE_CONPROF_CPU_DURATION`.

- `WithCPUProfileRate`: sets the CPU profiling rate in Hz (number of samples per second).
The default is defined by the Go runtime as 100 Hz. Can also be set via the environment
variable `BLACKFIRE_CONPROF_CPU_PROFILERATE`.

- `WithProfileTypes`: sets the profiler types. Multiple profile types can be set (`profiler.CPUProfile`, `profiler.HeapProfile`, `profiler.GoroutineProfile`).
The default is `Profiler.CPUProfile`.

- `WithLabels`: sets custom labels specific to the profile payload that is sent.

- `WithUploadTimeout`: sets the upload timeout of the message that is sent to the Blackfire Agent.
The default is 10 seconds. Can also be set via the environment variable `BLACKFIRE_CONPROF_UPLOAD_TIMEOUT`.

{{% note theme="info" title="Note:" %}}
If the same parameter is set by both an environment variable and a `Start` call, the explicit
parameter in the `Start` call takes precedence.
{{% /note %}}

There is also some additional configuration that can be done using environment variables:

- `BLACKFIRE_LOG_FILE`: Sets the log file. The default is logging to `stderr`.

- `BLACKFIRE_LOG_LEVEL`: Sets the log level. The default is logging only errors.

### `func Stop()`

Stops the continuous profiling probe.


## An example application

1. Get the Blackfire Continuous Profiler Go library

```bash
go get github.com/blackfireio/go-continuous-profiling
```

2. Save the following code as `main.go` and run as follows:

```bash
go run main.go
```

```go
package main

import (
	"crypto/md5"
	"encoding/hex"
	"io"
	"time"

	profiler "github.com/blackfireio/go-continuous-profiling"
)

func doSomethingCpuIntensive() {
	md5Hash := func(s string) string {
		h := md5.New()
		io.WriteString(h, s)
		return hex.EncodeToString(h.Sum(nil))
	}
	for i := 0; i < 1_000_000; i++ {
		md5Hash("UpsunIsCoolAndSoAreYou")
	}
}

func main() {
	err := profiler.Start(
		profiler.WithAppName("my-app"),
	)
	if err != nil {
		panic("Error while starting Profiler")
	}
	defer profiler.Stop()

	for i := 0; i < 15; i++ {
		doSomethingCpuIntensive()

		time.Sleep(1 * time.Second)
	}
}
```
