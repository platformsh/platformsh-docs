---
title: Define relationships between your multiple apps
sidebarTitle: Define relationships
weight: 30
description: Find out how relationships are managed between your apps.
banner:
   title: Feature availability
   type: tiered-feature
   body: This page applies to Grid and {{% names/dedicated-gen-3 %}} projects. To ensure you have enough resources to support multiple apps, you need at least a [{{< partial "plans/multiapp-plan-name" >}} plan](/administration/pricing/_index.md#multiple-apps-in-a-single-project). To set up multiple apps on {{% names/dedicated-gen-2 %}} environments, [contact Sales](https://platform.sh/contact/).
---

When you set up a project containing multiple applications,
by default your apps can't communicate with each other.
To enable connections, define relationships between apps using the `http` endpoint.

You can't define circular relationships.
If `app1` has a relationship to `app2`, then `app2` can't have a relationship to `app1`.
If you need data to go both ways, consider coordinating through a shared data store,
like a database or [RabbitMQ server](/add-services/rabbitmq.md).

Relationships between apps use HTTP, not HTTPS.
This is still secure because they're internal and not exposed to the outside world.

## Relationships example

You have two apps, `app1` and `app2`, and `app1` needs data from `app2`.

In your app configuration for `app1`, define a relationship to `app2`:

```yaml {configFile="app"}
applications:
  app1:
    relationships:
      api:
        service: "app2"
        endpoint: "http"
```

Once they're both built, `app1` can access `app2` at the following URL: `http://api.internal`.</br>
The specific URL is always available through the [service environment variables](/development/variables/_index.md#service-environment-variables),
or through the [`{{% vendor/prefix %}}_RELATIONSHIPS` variable](/development/variables/use-variables.md#use-provided-variables):

{{< codetabs >}}
+++
title= Service environment variables
+++

```bash {location="Terminal on app1 container"}
$ echo $API_HOST
api.internal
```

<--->

+++
title= `{{% vendor/prefix %}}_RELATIONSHIPS` environment variable
+++
It uses the `jq` library, which is included in all app containers for this purpose.

```bash {location="Terminal on app1 container"}
$ echo ${{% vendor/prefix %}}_RELATIONSHIPS | base64 --decode | jq '.api[0].host'
api.internal
```

{{< /codetabs >}}
