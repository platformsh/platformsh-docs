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

## Authentication

All requests require a short-lived OAuth2 access token passed as a Bearer token.
You can access data only for projects listed in your token's claims.

To get an access token:

1. In the [Console](https://console.upsun.com), create an API token. For details, refer to [Create an API token](/administration/cli/api-tokens.md#2-create-an-api-token) in the product docs.

2. Exchange it for an access token (valid for 15 minutes):

   ```bash
   curl -u platform-api-user: \
     -d 'grant_type=api_token&api_token={{< variable "API_TOKEN" >}}' \
     https://auth.api.platform.sh/oauth2/token
   ```

   Use the `access_token` value from the response as the Bearer token in your requests.

## Query message history

Retrieve a log of email events for a project:

```bash
curl "https://sendgrid.pltfrm.sh/api/v1/sendgrid/messages/get/platformsh-auth/{{< variable "PROJECT_ID" >}}" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "accept: application/json" | jq '.'
```

Example filtering by a specific month:

```bash
curl "https://sendgrid.pltfrm.sh/api/v1/sendgrid/messages/get/platformsh-auth/{{< variable "PROJECT_ID" >}}?from_date={{< variable "FROM_DATE" "YYYY-MM-DD" >}}&to_date={{< variable "TO_DATE" "YYYY-MM-DD" >}}&limit=50" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "accept: application/json" | jq '.'
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
curl "https://sendgrid.pltfrm.sh/api/v1/sendgrid/messages/email/platformsh-auth/{{< variable "PROJECT_ID" >}}?email=user@example.com&email=other@example.com" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "accept: application/json" | jq '.'
```

### Filter by event type

Retrieve events of a specific type by passing `event_type` as a path segment in the URL.

Example filtering by `bounce` events:

```bash
curl "https://sendgrid.pltfrm.sh/api/v1/sendgrid/messages/bounce/platformsh-auth/{{< variable "PROJECT_ID" >}}" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "accept: application/json" | jq '.'
```

#### Parameters

| Parameter    | Description |
|--------------|-------------|
| `event_type` | One of `processed`, `delivered`, `bounce`, `deferred`, `dropped`, `spamreport`, `open`, `click`. |

The `limit`, `offset`, `from_date`, and `to_date` parameters from the [previous section](#parameters) also apply.

## View delivery statistics

Retrieve aggregated daily delivery statistics for a project. This endpoint provides high-level metrics compatible with common visualization tools.

```bash
curl "https://sendgrid.pltfrm.sh/api/v1/sendgrid/stats/platformsh-auth/{{< variable "PROJECT_ID" >}}" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "accept: application/json" | jq '.'
```

Example narrowing the range to a specific month:

```bash
curl "https://sendgrid.pltfrm.sh/api/v1/sendgrid/stats/platformsh-auth/{{< variable "PROJECT_ID" >}}?start_date={{< variable "START_DATE" "YYYY-MM-DD" >}}&end_date={{< variable "END_DATE" "YYYY-MM-DD" >}}" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "accept: application/json" | jq '.'
```

### Parameters

| Parameter    | Default     | Description |
|--------------|-------------|-------------|
| `start_date` | 30 days ago | Start of the date range (`YYYY-MM-DD`). |
| `end_date`   | Today       | End of the date range (`YYYY-MM-DD`). |

## Manage suppression lists

Suppression lists prevent sending to addresses that have bounced or blocked your emails.

### Bounces

The bouncelist contains addresses that have hard-bounced. The system automatically suppresses further sending attempts to these addresses.

#### List bounced addresses

```bash
curl "https://sendgrid.pltfrm.sh/api/v1/sendgrid/bouncelist/platformsh-auth/{{< variable "PROJECT_ID" >}}" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "accept: application/json" | jq '.'
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `limit`   | `50`    | Number of records to return. |

#### Remove from bouncelist

Only remove an address after confirming it is now valid. Returns `204 No Content` on success.

```bash
curl -X DELETE "https://sendgrid.pltfrm.sh/api/v1/sendgrid/bouncelist/platformsh-auth/{{< variable "PROJECT_ID" >}}" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "content-type: application/json" \
  -d '{"email": "user@example.com"}'
```

### Blocks

The blocklist prevents sending to addresses that have previously blocked your emails or marked them as spam, protecting your sender reputation.

#### List blocked addresses

```bash
curl "https://sendgrid.pltfrm.sh/api/v1/sendgrid/blocklist/platformsh-auth/{{< variable "PROJECT_ID" >}}" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "accept: application/json" | jq '.'
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `limit`   | `50`    | Number of records to return. |

#### Remove from blocklist

Removes an address to resume sending. Returns `204 No Content` on success.

```bash
curl -X DELETE "https://sendgrid.pltfrm.sh/api/v1/sendgrid/blocklist/platformsh-auth/{{< variable "PROJECT_ID" >}}" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "content-type: application/json" \
  -d '{"email": "user@example.com"}'
```

{{% note theme="warning" %}}

Removing an address from a suppression list doesn't guarantee future delivery.
If the underlying issue (invalid address, spam complaint) isn't resolved,
the address is likely to be suppressed again.

{{% /note %}}
