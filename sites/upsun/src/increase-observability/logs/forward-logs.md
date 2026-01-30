---
title: Forward {{% vendor/name %}} and Blackfire logs
description: Send your {{% vendor/name %}} and Blackfire logs to a third-party service for further analysis.
weight: 10
banner:
    type: observability-suite
---
<!-- vale off -->
You might use a service to analyze logs from various parts of your fleet.
You might want to consolidate all your logs in one place that everyone has access to
without needing to grant them access to each project individually.

In such cases, forward your logs from {{% vendor/name %}} and Blackfire to a third-party service.
You can use a [service with an integration](#use-a-log-forwarding-integration)
or any service that supports a [syslog endpoint](#forward-to-a-syslog-endpoint) or [HTTP endpoint](#forward-to-an-http-endpoint).


{{% version/specific %}}
Log forwarding is available for Grid projects.
For {{% names/dedicated-gen-2 %}} projects, see how to [log remotely with `rsyslog`](../../dedicated-gen-2/architecture/options.md#remote-logging).
<--->
{{% /version/specific %}}
To enable log forwarding in a project, you need to be a [project admin](../../administration/users.md).
For pricing information for real-time logs forwarding, refer to the **Observability and performance monitoring** section of the [Upsun pricing page](https://upsun.com/pricing/).

### Which logs are forwarded?
When log forwarding is enabled, {{% vendor/name %}} forwards logs sent to journald.

By default, {{% vendor/name %}} sends the following logs to journald:
- `stdout` and `stderr` logs from your application<br>
   Note: You can configure your application to use syslog to send these (or additional) messages to journald.
- MariaDB/MySQL slow query logs
- Redis logs (all except command-level operations and low-level internals)

Logs in files are not forwarded to journald.

## Use a log forwarding integration

Certain services have a specific integration for forwarding logs.
If your third-party service isn't supported, you can forward to a [syslog endpoint](#forward-to-a-syslog-endpoint).

### Integrated third-party services

{{% vendor/name %}} supports forwarding logs not only to custom remote syslog endpoints but also directly to a set of
popular third‑party log management and observability services. These integrations allow you to centralize logs from
applications, services, and infrastructure into your existing monitoring stack:

- **[Sumo Logic](https://www.sumologic.com/)** – Cloud-based log management and analytics.
- **[New Relic](https://newrelic.com/)** – Unified observability platform with logs and metrics.
- **[Splunk](https://www.splunk.com/)** – Searchable log platform for monitoring and operational intelligence.
- **[Datadog](https://www.datadoghq.com/)** – Observability suite with log collection and processing.
- **[Loggly](https://www.loggly.com/)** – Cloud-native log monitoring, aggregation, and alerting.
- **[LogDNA (Mezmo)](https://www.mezmo.com/)** – Centralized log management and analysis in real time.
- **[Papertrail](https://www.papertrail.com/)** – Real-time log aggregation via syslog.
- **[Logz.io](https://logz.io/)** – ELK-based log analytics and monitoring.

### Enable a log forwarding integration

#### Using the CLI

To enable log forwarding for a specific project using the [Upsun CLI](/administration/cli/_index.md),
follow the steps for your selected service.

{{< codetabs >}}
+++
title=New Relic
+++

1. Get an API key from New Relic.
   You need a [license key](https://docs.newrelic.com/docs/apis/intro-apis/new-relic-api-keys/#license-key).
   Your New Relic organization likely has one, but you can create one by following the New Relic docs.
2. Choose an API endpoint.
   You can use the U.S. endpoint `https://log-api.newrelic.com/log/v1`
   or the EU endpoint `https://log-api.eu.newrelic.com/log/v1`.
3. Create the integration with the following command:

   ```bash
   {{% vendor/cli %}} integration:add --type newrelic --url {{< variable "API_ENDPOINT" >}} --license-key {{% variable "LICENSE_KEY" %}}
   ```

View your logs in the **Logs** dashboard.

<--->
+++
title=Splunk
+++

1. In Splunk, get an Event Collector token on [Splunk Platform](https://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector#Create_an_Event_Collector_token_on_Splunk_Cloud_Platform)
   or [Splunk Enterprise](https://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector#Create_an_Event_Collector_token_on_Splunk_Enterprise).
2. Determine your host, which is the Splunk instance that's collecting data.
3. Choose an index name.
4. Create the integration with the following command:

   ```bash
   {{% vendor/cli %}} integration:add --type splunk --url https://http-inputs.{{< variable "HOST" >}}.splunkcloud.com/services/collector/event --index {{< variable "INDEX" >}} --token {{< variable "TOKEN" >}}
   ```

View your logs in the **Apps->Search & Reporting** dashboard.
Filter by the index name to find the relevant events.

<--->
+++
title=Sumo Logic
+++

1. In Sumo Logic, [configure an HTTP source](https://www.sumologic.com/help/docs/send-data/hosted-collectors/http-source/logs-metrics/#configure-an-httplogs-and-metrics-source).
   Make sure to copy the Source Category and collector URL.
2. Create the integration with the following command:

   ```bash
   {{% vendor/cli %}} integration:add --type sumologic --url {{< variable "COLLECTOR_URL" >}} --category {{< variable "SOURCE_CATEGORY" >}}
   ```

View your logs in the **Log Search** tab.

{{< /codetabs >}}

To start forwarding logs, [trigger a redeploy](../../development/troubleshoot.md#force-a-redeploy).

#### In the Console

To enable log forwarding for a specific project from the Console,
follow these steps:

1. Navigate to your project.
2. Click {{< icon settings >}} **Settings**.
3. Click **Integrations**.
4. Click **Add Integration**.
5. Select the integration you want to enable.
6. In the **Configure your integration** window,
   specify your configuration options.
7. Click **Add Integration**.
   The new integration overview is displayed,
   and you can view your logs in the **Activity** section.

## Forward to a syslog endpoint

Syslog is a standard protocol for transferring log messages.
Many third-party services offer endpoints for ingesting syslog events.
You can forward your {{% vendor/name %}} and Blackfire logs to any of those endpoints.

{{< codetabs >}}
+++
title=Using the CLI
+++

To enable log forwarding to a syslog endpoint,
run a command similar to the following:

```bash
{{% vendor/cli %}} integration:add --type syslog --syslog-host {{< variable "INGESTION_HOST" >}} --syslog-port {{< variable "INGESTION_HOST_PORT" >}}
```

`type`, `syslog-host`, and `syslog-port` are the only properties required for all endpoints.
The following table shows the other available properties:

| Property         | Type      | Default    | Description                                                                                                                                           |
|------------------|-----------|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| `auth-token`     | `string`  |            | The token to authenticate with the given service.                                                                                                     |
| `auth-mode`      | `string`  | `prefix`   | The mode for authentication with the given service. Can be `prefix` or `structured_data`. Defaults to `prefix`.                                       |
| `facility`       | `string`  | `1` (user) | A [syslog facility code](https://en.wikipedia.org/wiki/Syslog#Facility) to attach with each log to identify the source. Can be a number from 0 to 23. |
| `message-format` | `string`  | `rfc5424`  | The standard to use for the message format. Can be `rfc5424` or `rfc3164`.                                                                            |
| `protocol`       | `string`  | `tls`      | The network protocol to use in the connection. Can be one of `tls`, `tcp`, or `udp`. Defaults to `tls`.                                               |
| `verify-tls`     | `boolean` | `true`     | Whether to verify Transport Layer Security (TLS) certification when using the TLS protocol.                                                           |

To include a property, add it as a flag, for example `--protocol tcp`.
This should let you connect to any service that has syslog endpoints.

To start forwarding logs, once you've added the service [trigger a redeploy](../../development/troubleshoot.md#force-a-redeploy).

<--->
+++
title=In the Console
+++

To enable log forwarding to a syslog endpoint for a specific project using the [{{% vendor/name %}} CLI](../../administration/cli/_index.md),
follow these steps:

1. Navigate to your project.
2. Click {{< icon settings >}} **Settings**.
3. Click **Integrations**.
4. Click **Add Integration**.
5. Select the syslog integration.
6. In the **Configure your integration** window,
   specify your configuration options.
7. Click **Add Integration**.
   The new integration overview is displayed,
   and you can view your logs in the **Activity** section.

{{< /codetabs >}}

## Forward to an HTTP endpoint

Some third-party services, such as [Elasticsearch](../../add-services/elasticsearch.md) and [OpenSearch](../../add-services/opensearch.md),
support ingesting log messages through an HTTP endpoint.
You can use HTTP forwarding to forward {{% vendor/name %}} and Blackfire logs to such third-party services.

HTTP forwarding makes a `POST` HTTP request with an `application/json` body while forwarding the log messages to the endpoint.

As an example, to forward logs to Elasticsearch using HTTP log forwarding, run the following command:

```
{{% vendor/cli %}} integration:add --type httplog --url "https://{{< variable "ELASTICSEARCH_URL" >}}/{{< variable "INDEX_NAME" >}}/_doc" --header "Authorization: Basic <basic_auth_token>" --header "Content-Type: application/json"
```

`type` and `url` are the only properties required for all endpoints.
Optionally, you can use the `headers` property to pass additional headers in the HTTP requests.

Note that if your endpoint URL includes a `PORT`, that can also be included in the `--url` flag:

```
{{% vendor/cli %}} integration:add --type httplog --url "https://{{< variable "ELASTICSEARCH_URL" >}}:{{< variable "PORT" >}}/{{< variable "INDEX_NAME" >}}/_doc" --header "Authorization: Basic <basic_auth_token>" --header "Content-Type: application/json"
```

Once you've [added the service](../../add-services/_index.md),
to start forwarding logs [trigger a redeploy](../../development/troubleshoot.md#force-a-redeploy).

### Excluding services from HTTP log forwarding

All log forwarding integrations support an `excluded_services` property. This allows you to prevent logs from specific applications or services (including workers) from being forwarded to an external logging provider.

This is useful for reducing noise, limiting log volume, or excluding non-critical services. The exclusion list is defined at the project level and applies to all environments.

#### Supported integrations

The `excluded_services` property is supported by all log forwarder types, including:

- Syslog
- Sumologic
- Splunk
- HTTP log forwarding
- New Relic
- OTLP

#### Excluding apps or services

By default, logs from all apps and services are forwarded. To exclude specific services, define them using `excluded_services`:

```yaml {configFile="app"}
logs_forwarders:
  - type: httplog
    endpoint: https://logs.example.com
    excluded_services:
      - cache
      - debug-worker
```
In this example, logs from the `cache` service and the `debug-worker` worker are not forwarded.

{{< note theme="note" >}}
Note that the same exclusion list applies to all environments. If a listed app or service does not exist in an environment, it is silently ignored. No error is raised.
{{< /note >}}

{{< note theme="info>}}
`excluded_services` removes the specified apps or services from log forwarding while all other apps and services continue to forward logs as normal. Note that these exclusions apply globally across environments.
{{< /note >}}

### Naming consistency

When defining exclusions, you can list:

- Apps (for example - `app`, `api`)
- Services (for example - `cache`, `database`)
- Workers (for example - `debug-worker`)

Make sure to use the `service` or `app` name **exactly as defined in your project configuration**.

#### Including services explicitly

You can optionally define an `included_services` list to control exactly which services are forwarded. If `included_services` is set, only the listed services are forwarded.

```yaml {configFile="app"}
logs_forwarders:
  - type: syslog
    host: syslog.example.com
    included_services:
      - app
      - api
```
#### Combining include and exclude rules

You can use both `included_services` and `excluded_services` together. The following rules apply:
- If `included_services` is not set, all services are included by default
- If `included_services` is set, only those services are included
- `excluded_services` always removes services from the active set

```yaml {configFile="app"}
logs_forwarders:
  - type: syslog
    host: syslog.example.com
    included_services:
      - app
      - api
      - worker
      - cache
    excluded_services:
      - cache
```
Result: logs from `app`, `api`, and `worker` are forwarded.

{{< note theme="info" >}}
Note that a service cannot appear in both lists. Configurations that include the same service in both lists are invalid.
{{< /note >}}

## Log levels

Your app may output logs with distinct severity levels.
But as {{% vendor/name %}} only reads logs from `stdout`,
this distinction is lost and everything gets logged at `INFO` level.

To preserve the original log level, use a language-specific syslog module/package for logging.

The following example code snippets show how logs can be written to Syslog:

{{< codetabs >}}

+++
title=PHP
+++

```php
openlog("", LOG_PID, LOG_LOCAL0);
syslog(LOG_INFO, "Operation started");
syslog(LOG_ERR, "Operation failed");
closelog();
```

<--->
+++
title=Python
+++

Using the logging module:

```python
import logging
import logging.handlers

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.handlers.SysLogHandler(address="/dev/log")
logger.addHandler(handler)

logger.info("Operation started")
logger.error("Operation failed")
```

Using the Syslog module:

```python
import syslog

syslog.openlog(logoption=syslog.LOG_PID, facility=syslog.LOG_LOCAL0)
syslog.syslog(syslog.LOG_INFO, "Operation started")
syslog.syslog(syslog.LOG_ERR, "Operation failed")
syslog.closelog()
```

<--->
+++
title=Go
+++

Using the log package:

```go
package main

import (
	"log"
	"log/syslog"
)

func main() {
	logger, err := syslog.NewLogger(syslog.LOG_LOCAL0|syslog.LOG_INFO, log.LstdFlags)
	if err != nil {
		panic(err)
	}

	logger.Println("Operation started...")
	logger.Fatalln("Operation failed")
}

```

Using the Syslog package:

```go
package main

import (
	"fmt"
	"log"
	"log/syslog"
)

func main() {
	syslogWriter, err := syslog.Dial("", "", syslog.LOG_LOCAL0|syslog.LOG_INFO, "")
	if err != nil {
		log.Fatal(err)
	}
	defer syslogWriter.Close()

	fmt.Fprintf(syslogWriter, "Operation has started")
	syslogWriter.Err("Operation failed")
}
```

{{< /codetabs >}}
<!-- vale on -->