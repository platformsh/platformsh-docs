---
title: Relationships
sidebarTitle: Relationships
weight: 30
description: Explore how relationships are managed between your apps.
---

By default, your apps can't communicate with one another.
To enable connections, define a relationship to another app using the `http` endpoint.

You can't define circular relationships.
If `app1` has a relationship to `app2`, then `app2` can't have a relationship to `app1`.
If you need data to go both ways, consider coordinating through a shared data store,
like a database or [RabbitMQ server](/add-services/rabbitmq.md).

Relationships between apps use HTTP, not HTTPS.
This is still secure because they're internal and not exposed to the outside world.

## Relationships example

Assume you have 2 applications, `main` and `api`.
`main` needs data from `api`.

In your app configuration for `main`, define a relationship to `api`:

```yaml {location="main/.platform.app.yaml"}
relationships:
    api: "api:http"
```

Once they're both built, `main` can now access `api` at the URL `http://api.internal`.
The specific URL is always available through the [`PLATFORM_RELATIONSHIPS` variable](/development/variables/use-variables.md#use-platformsh-provided-variables):

```bash
$ echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq '.api[0].host'
api.internal
```
