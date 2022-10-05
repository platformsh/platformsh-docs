---
title: Forward logs
description: Send your logs to a third-party service for further analysis.
observabilitySuite: true
---

You might use a service to analyze logs from various parts of your fleet.
You might want to consolidate all your logs in one place that everyone has access to
without needing to grant them access to each project individually.

In such cases, forward your logs from Platform.sh to a supported third-party service.

Log forwarding is available for Grid and {{% names/dedicated-gen-3 %}} projects.

## Supported third-party services

Integrations exist for the following third-party services to enable log forwarding:

* [New Relic](https://newrelic.com/)
* [Splunk](https://www.splunk.com/)
* [Sumo Logic](https://www.sumologic.com/)

## Supported languages and services

The following table presents the languages and services that support logs in a format that can be forwarded:

| Languages                           | Services                             |
| ----------------------------------- | ------------------------------------ |
| {{< log-forwarding runtime=true >}} | {{< log-forwarding runtime=false >}} |

## Enable log forwarding

To enable log forwarding in a project, you need to be a [project admin](../../administration/users.md).

Enable log forwarding for a specific project by following the steps for your [selected third-party service](#supported-third-party-services).

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
   You can use the US endpoint `https://log-api.newrelic.com/log/v1`
   or the EU endpoint `https://log-api.eu.newrelic.com/log/v1`.
3. Create the integration with the following command:

   <div class="highlight"><pre tabindex="0" class="chroma"><code class="language-bash" data-lang="bash"><span class="line"><span class="cl">platform p:curl /integrations -X POST -d <span class="s1">'{ "type":"newrelic", "url":"{{< variable "API_ENDPOINT" >}}", "license_key": "{{% variable "LICENSE_KEY" %}}" }'</span></span></span></code></pre></div>

View your logs in the **Logs** dashboard.

<--->
---
title=Splunk
highlight=false
file=none
---

1. In Splunk, get an Event Collector token on [Splunk Platform](https://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector#Create_an_Event_Collector_token_on_Splunk_Cloud_Platform)
   or [Splunk Enterprise](https://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector#Create_an_Event_Collector_token_on_Splunk_Enterprise).
2. Determine your host. That is the Splunk instance that is collecting data.
3. Choose an index name.
4. Create the integration with the following command:

   <div class="highlight"><pre tabindex="0" class="chroma"><code class="language-bash" data-lang="bash"><span class="line"><span class="cl">platform p:curl /integrations -X POST -d <span class="s1">'{ "type":"splunk", "url":"https://http-inputs.{{< variable "HOST" >}}.splunkcloud.com/services/collector/event", "index":"{{< variable "HOST" >}}", "token":"{{< variable "TOKEN" >}}" }'</span></span></span></code></pre></div>

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

   <div class="highlight"><pre tabindex="0" class="chroma"><code class="language-bash" data-lang="bash"><span class="line"><span class="cl">platform p:curl /integrations -X POST -d <span class="s1">'{ "type":"sumologic", "url":"{{< variable "COLLECTOR_URL" >}}", "category":"{{< variable "SOURCE_CATEGORY" >}}" }'</span></span></span></code></pre></div>

View your logs in the **Log Search** tab.

{{< /codetabs >}}

Logs start getting forwarded automatically after the integration has been resolved,
which can take up to an hour.
