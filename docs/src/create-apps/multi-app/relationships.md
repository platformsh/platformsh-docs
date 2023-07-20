---
title: Define relationships between your multiple apps
sidebarTitle: Define relationships
weight: 30
description: Find out how relationships are managed between your apps.
banner:
   title: Feature availability
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

You have two apps, `main` and `api`, and `main` needs data from `api`.

In your app configuration for `main`, define a relationship to `api`:

```yaml {location="main/.platform.app.yaml"}
relationships:
    api: "api:http"
```

Once they're both built, `main` can access `api` at the following URL: `http://api.internal`.
The specific URL is always available through the [`PLATFORM_RELATIONSHIPS` variable](/development/variables/use-variables.md#use-platformsh-provided-variables):

```bash
$ echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq '.api[0].host'
api.internal
```