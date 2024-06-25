---
title: Continuous profiling for Node.js
sidebarTitle: "Node.js continuous profiler"
description: Configure and use the NodeJS continuous profiler.
weight: 30
---

{{< partial "continuous-profiling-sellable/body.md" >}}

## Continuous profiling on {{% vendor/name %}}

{{< vendor/name >}} Continuous Profiling is powered by [Blackfire](../../../increase-observability/application-metrics/blackfire.md).
It is available directly from the Console under the `Profiling` tab of your environments.

The Node.js continuous profiling is currently made across 3 dimensions:
- **CPU Time**:  Time spent running on the CPU
- **Wall-time**: Elapsed time per function call
- **Heap**: Memory allocation and reserved space over time

The default sampling frequency is 100 Hz. This means the Node.js continuous profiler is
collecting information 100 times per second.

## Prerequisites

{{< vendor/name >}} Continuous Profiler requires [`Node.js >= 16.0.0`](/languages/nodejs/_index.md).

## Installation

Get the [Blackfire Continuous Profiler NodeJS library](https://github.com/blackfireio/node-continuous-profiling/):

```shell
npm install @blackfireio/node-tracing
```

```js
const Blackfire = require('@blackfireio/node-tracing');
```

## NodeJS continuous profiler API

The NodeJS continuous profiler API has two functions:

```js
function start(config) {}
function stop() {}
```

### `function start(config) {}`

The `start` function starts the continuous profiler probe.
It collects profiling information in the background and periodically uploads it to the Blackfire Agent until the `stop` function is called.

```js
const Blackfire = require('@blackfireio/node-tracing');
Blackfire.start({
   appName: 'my-app'
});
// your application...
// If needed, you can stop profiling before cpuDuration
// Blackfire.stop();
```

The `start` function accepts an object as a parameter with the following keys:

- `appName`: name of the application

- `durationMillis`: time in milliseconds for which to collect profile (default: 45_000)

- `cpuProfileRate`: average sampling frequency in Hz. (default: 100)

- `labels`: Labels to add to the profile. (default: {})

- `uploadTimeoutMillis`: Timeout in milliseconds for the upload request (default: 10000)

### `function stop() {}`

Stops the continuous profiling probe.

## An example application

1. Get the Continuous Profiler NodeJS library

```shell
npm install express @blackfireio/node-tracing
```

2. Create `index.js` with the following code

```js
const Blackfire = require('@blackfireio/node-tracing');
const express = require('express')
const crypto = require("crypto");
const app = express()
const port = 3000

app.get('/', (req, res) => {
   const salt = crypto.randomBytes(128).toString("base64");
   const hash = crypto.pbkdf2Sync("this is my password", salt, 10000, 512, "sha512");

   res.send('Hello World!');
})


app.listen(port, () => {
   console.log(`Example app listening on port ${port}`)
   Blackfire.start({appName: 'blackfire-example'});
})
```

3. Run the Node.js server

```bash
node index.js