---
title: Monitor email delivery
weight: 10
sidebarTitle: Monitor email delivery
description: Query delivery logs, statistics, and suppression lists for emails sent from your {{% vendor/name %}} environments.
---

{{% vendor/name %}} provides an email observability API that lets you inspect the delivery history
and health of emails sent from your projects.
You can use it to diagnose delivery failures, review bounce and block lists, and pull aggregated sending statistics.

This API sits on top of the SendGrid infrastructure used by {{% vendor/name %}}'s
[built-in SMTP proxy](/development/email.md).
It doesn't provide direct access to SendGrid — all data is scoped to the projects your token is authorized for.

## Before you begin

- Authenticate the {{% vendor/name %}} CLI to your account by running `{{% vendor/cli %}} login` or `{{% vendor/cli %}}`.
- Find your project ID, used in place of `{{< variable "PROJECT_ID" >}}` in the commands below. To find it, run `{{% vendor/cli %}} project:info id`.

## Query message history

Retrieve a log of email events for a project:

```bash
curl "https://platform.sendgrid.pltfrm.sh/api/v1/self/messages/get/{{< variable "PROJECT_ID" >}}" \
  -H "$({{% vendor/cli %}} auth:token -WH)" \
  -H "accept: application/json" -s | jq '.'
```

Example filtering by a specific month:

```bash
curl "https://platform.sendgrid.pltfrm.sh/api/v1/self/messages/get/{{< variable "PROJECT_ID" >}}?from_date={{< variable "FROM_DATE" "YYYY-MM-DD" >}}&to_date={{< variable "TO_DATE" "YYYY-MM-DD" >}}&limit=50" \
  -H "$({{% vendor/cli %}} auth:token -WH)" \
  -H "accept: application/json" -s | jq '.'
```

### Parameters

| Parameter   | Default | Description |
|-------------|---------|-------------|
| `limit`     | `30`    | Number of records to return. |
| `offset`    | `0`     | Number of records to skip for pagination. |
| `from_date` | —       | Start date filter (`YYYY-MM-DD`). |
| `to_date`   | —       | End date filter (`YYYY-MM-DD` or `YYYY-MM-DD HH:MM:SS`). |

### Filter by recipient

Retrieve events for one or more specific email addresses:

```bash
curl "https://platform.sendgrid.pltfrm.sh/api/v1/self/messages/email/{{< variable "PROJECT_ID" >}}?email=user@example.com&email=other@example.com" \
  -H "$({{% vendor/cli %}} auth:token -WH)" \
  -H "accept: application/json" -s | jq '.'
```

### Filter by event type

Retrieve events of a specific type by passing `event_type` as a path segment in the URL.

Example filtering by `bounce` events:

```bash
curl "https://platform.sendgrid.pltfrm.sh/api/v1/self/messages/bounce/{{< variable "PROJECT_ID" >}}" \
  -H "$({{% vendor/cli %}} auth:token -WH)" \
  -H "accept: application/json" -s | jq '.'
```

#### Parameters

| Parameter    | Description |
|--------------|-------------|
| `event_type` | One of `processed`, `delivered`, `bounce`, `deferred`, `dropped`, `spamreport`, `open`, `click`. |

The `limit`, `offset`, `from_date`, and `to_date` parameters from the [previous section](#parameters) also apply.

## View delivery statistics

Retrieve aggregated daily delivery statistics for a project. This endpoint provides high-level metrics compatible with common visualization tools.

```bash
curl "https://platform.sendgrid.pltfrm.sh/api/v1/self/stats/{{< variable "PROJECT_ID" >}}" \
  -H "$({{% vendor/cli %}} auth:token -WH)" \
  -H "accept: application/json" -s | jq '.'
```

Example narrowing the range to a specific month:

```bash
curl "https://platform.sendgrid.pltfrm.sh/api/v1/self/stats/{{< variable "PROJECT_ID" >}}?start_date={{< variable "START_DATE" "YYYY-MM-DD" >}}&end_date={{< variable "END_DATE" "YYYY-MM-DD" >}}" \
  -H "$({{% vendor/cli %}} auth:token -WH)" \
  -H "accept: application/json" -s | jq '.'
```

### Parameters

| Parameter    | Default     | Description |
|--------------|-------------|-------------|
| `start_date` | 30 days ago | Start of the date range (`YYYY-MM-DD`). |
| `end_date`   | Today       | End of the date range (`YYYY-MM-DD`). |

## Manage suppression lists

Suppression lists prevent sending to addresses that have bounced or blocked your emails.

### Bounces

The bounce list contains addresses that have hard-bounced. The system automatically suppresses further sending attempts to these addresses.

<!-- vale off -->
#### List bounced addresses

```bash
curl "https://platform.sendgrid.pltfrm.sh/api/v1/self/bouncelist/{{< variable "PROJECT_ID" >}}" \
  -H "$({{% vendor/cli %}} auth:token -WH)" \
  -H "accept: application/json" -s | jq '.'
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `limit`   | `50`    | Number of records to return. |

#### Remove from bounce list

Only remove an address after confirming it is now valid. Returns `204 No Content` on success.

```bash
curl -X DELETE "https://platform.sendgrid.pltfrm.sh/api/v1/self/bouncelist/{{< variable "PROJECT_ID" >}}" \
  -H "$({{% vendor/cli %}} auth:token -WH)" \
  -H "accept: application/json" -s | jq '.' \
  -d '{"email": "user@example.com"}'
```
<!-- vale on -->
### Blocks

The blocklist prevents sending to addresses that have previously blocked your emails or marked them as spam, protecting your sender reputation.

#### List blocked addresses

```bash
curl "https://platform.sendgrid.pltfrm.sh/api/v1/self/blocklist/{{< variable "PROJECT_ID" >}}" \
  -H "$({{% vendor/cli %}} auth:token -WH)" \
  -H "accept: application/json" -s | jq '.'
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `limit`   | `50`    | Number of records to return. |

#### Remove from blocklist

Removes an address to resume sending. Returns `204 No Content` on success.

```bash
curl -X DELETE "platform.sendgrid.pltfrm.sh/api/v1/self/blocklist/{{< variable "PROJECT_ID" >}}" \
  -H "$({{% vendor/cli %}} auth:token -WH)" \
  -H "accept: application/json" -s | jq '.' \
  -d '{"email": "user@example.com"}'
```

{{% note theme="warning" %}}

Removing an address from a suppression list doesn't guarantee future delivery.
If the underlying issue (invalid address, spam complaint) isn't resolved,
the address is likely to be suppressed again.

{{% /note %}}
