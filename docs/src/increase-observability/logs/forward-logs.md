---
title: Forward logs
description: Send your logs to a third-party service for further analysis.
observabilitySuite: true
---

You might use a service to analyze logs from various parts of your fleet.
You might want to consolidate all your logs in one place that everyone has access to
without needing to grant them access to each project individually.

In such cases, forward your logs from Platform.sh to a third-party service.
You can use a [service with an integration](#use-a-log-forwarding-integration)
or any service that supports a [syslog endpoint](#forward-to-a-syslog-endpoint).

Log forwarding is available for Grid and {{% names/dedicated-gen-3 %}} projects.
It requires systemd containers, which are enabled once you add the Observability Suite.
For {{% names/dedicated-gen-2 %}} projects, see how to [log remotely with `rsyslog`](../../dedicated-gen-2/architecture/options.md#remote-logging).

## Use a log forwarding integration

Certain services have a specific integration for forwarding logs.
If your third-party service isn't supported, you can forward to a [syslog endpoint](#forward-to-a-syslog-endpoint).

### Integrated third-party services

Integrations exist for the following third-party services to enable log forwarding:

* [New Relic](https://newrelic.com/)
* [Splunk](https://www.splunk.com/)
* [Sumo Logic](https://www.sumologic.com/)

### Enable a log forwarding integration

To enable log forwarding in a project, you need to be a [project admin](../../administration/users.md).

Enable log forwarding for a specific project by following the steps for your selected service.

{{< codetabs >}}
---
title=New Relic
highlight=false
file=none
---

1. Get an API key from New Relic.
   You need a [license key](https://docs.newrelic.com/docs/apis/intro-apis/new-relic-api-keys/#license-key).
   Your New Relic organization likely has one, but you can create one by following the New Relic docs.
2. Choose an API endpoint.
   You can use the U.S. endpoint `https://log-api.newrelic.com/log/v1`
   or the EU endpoint `https://log-api.eu.newrelic.com/log/v1`.
3. Create the integration with the following command:

   <div class="highlight"><pre tabindex="0" class="chroma"><code class="language-bash" data-lang="bash"><span class="line"><span class="cl">platform project:curl /integrations -X POST -d <span class="s1">'{ "type":"newrelic", "url":"{{< variable "API_ENDPOINT" >}}", "license_key": "{{% variable "LICENSE_KEY" %}}" }'</span></span></span></code></pre></div>

View your logs in the **Logs** dashboard.

<--->
---
title=Splunk
highlight=false
file=none
---

1. In Splunk, get an Event Collector token on [Splunk Platform](https://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector#Create_an_Event_Collector_token_on_Splunk_Cloud_Platform)
   or [Splunk Enterprise](https://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector#Create_an_Event_Collector_token_on_Splunk_Enterprise).
2. Determine your host, which is the Splunk instance that's collecting data.
3. Choose an index name.
4. Create the integration with the following command:

   <div class="highlight"><pre tabindex="0" class="chroma"><code class="language-bash" data-lang="bash"><span class="line"><span class="cl">platform project:curl /integrations -X POST -d <span class="s1">'{ "type":"splunk", "url":"https://http-inputs.{{< variable "HOST" >}}.splunkcloud.com/services/collector/event", "index":"{{< variable "HOST" >}}", "token":"{{< variable "TOKEN" >}}" }'</span></span></span></code></pre></div>

View your logs in the **Apps->Search & Reporting** dashboard.
Filter by the index name to find the relevant events.

<--->
---
title=Sumo Logic
highlight=false
file=none
---

1. In Sumo Logic, [configure an HTTP source](https://help-opensource.sumologic.com/docs/send-data/hosted-collectors/http-source/logs-metrics/#configure-an-httplogs-and-metrics-source).
   Make sure to copy the Source Category and collector URL.
2. Create the integration with the following command:

   <div class="highlight"><pre tabindex="0" class="chroma"><code class="language-bash" data-lang="bash"><span class="line"><span class="cl">platform project:curl /integrations -X POST -d <span class="s1">'{ "type":"sumologic", "url":"{{< variable "COLLECTOR_URL" >}}", "category":"{{< variable "SOURCE_CATEGORY" >}}" }'</span></span></span></code></pre></div>

View your logs in the **Log Search** tab.

{{< /codetabs >}}

Logs start getting forwarded automatically after the integration has been resolved,
which can take up to an hour.

## Forward to a syslog endpoint

Syslog is a standard for message logging.
Many third-party services offer endpoints for ingesting syslog events.
You can forward your Platform.sh logs to any of those endpoints.

To enable this forwarding, run a command like the following:

```bash
platform project:curl /integrations -X POST --data '{ "type":"syslog", "host":"{{< variable "INGESTION_HOST" >}}", "port":"{{< variable "INGESTION_HOST_PORT" >}}" }'
```

`type`, `host`, and `port` are the only properties required for all endpoints.
The following table shows the other available properties:

| Property         | Type      | Default    | Description |
| -------- --------| --------- | ---------- | ----------- |
| `protocol`       | `string`  | `tls`      | The network protocol to use in the connection. Can be one of `tls`, `tcp`, or `udp`. Defaults to `tls`. |
| `facility`       | `string`  | `1` (user) | A [syslog facility code](https://en.wikipedia.org/wiki/Syslog#Facility) to attach with each log to identify the source. Can be a number from 0 to 23. |
| `message_format` | `string`  | `rfc5424`  | The standard to use for the message format. Can be `rfc5424` or `rfc3164`. |
| `auth_token`     | `string`  |            | The token to authenticate with the given service. |
| `auth_mode`      | `string`  |            | The mode for authentication with the given service. Can be `prefix` or `structured_data`. |
| `tls_verify`     | `boolean` | `true`     | Whether to verify Transport Layer Security (TLS) certification when using the TLS protocol. |

Place any property you want inside the `data` object of the cURL request.
This should let you connect to any service that has syslog endpoints.

Once you've added the service, logs start getting forwarded automatically after the integration has been resolved,
which can take up to an hour.
