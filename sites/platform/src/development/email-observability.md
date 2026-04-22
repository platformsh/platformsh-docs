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

1. [Create an API token](/administration/cli/api-tokens.md) in the {{% vendor/name %}} Console.
2. Exchange it for an access token (valid for 15 minutes):

   ```bash
   curl -u platform-api-user: \
     -d 'grant_type=api_token&api_token={{< variable "API_TOKEN" >}}' \
     https://auth.api.platform.sh/oauth2/token
   ```

   Use the `access_token` value from the response as the Bearer token in your requests.

## Query message history

Retrieve a log of delivery events for a project:

```bash
curl "https://sendgrid.pltfrm.sh/api/v1/sendgrid/messages/get/platformsh-auth/{{< variable "PROJECT_ID" >}}" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "accept: application/json" | jq '.'
```

Filter by date range using `from_date` and `to_date` (format: `YYYY-MM-DD`):

```bash
curl "https://sendgrid.pltfrm.sh/api/v1/sendgrid/messages/get/platformsh-auth/{{< variable "PROJECT_ID" >}}?from_date=2025-01-01&to_date=2025-01-31&limit=50" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "accept: application/json" | jq '.'
```

### Filter by recipient

Retrieve events for one or more specific email addresses:

```bash
curl "https://sendgrid.pltfrm.sh/api/v1/sendgrid/messages/email/platformsh-auth/{{< variable "PROJECT_ID" >}}?email=user@example.com&email=other@example.com" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "accept: application/json" | jq '.'
```

### Filter by event type

Retrieve events of a specific type.
Supported values: `processed`, `delivered`, `bounce`, `deferred`, `dropped`, `spamreport`, `open`, `click`.

Example `bounce` event type:

```bash
curl "https://sendgrid.pltfrm.sh/api/v1/sendgrid/messages/bounce/platformsh-auth/{{< variable "PROJECT_ID" >}}" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "accept: application/json" | jq '.'
```

## View delivery statistics

Retrieve aggregated daily statistics for a project. Defaults to the last 30 days.

```bash
curl "https://sendgrid.pltfrm.sh/api/v1/sendgrid/stats/platformsh-auth/{{< variable "PROJECT_ID" >}}" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "accept: application/json" | jq '.'
```

Use `start_date` and `end_date` to narrow the range (format: `YYYY-MM-DD`):

```bash
curl "https://sendgrid.pltfrm.sh/api/v1/sendgrid/stats/platformsh-auth/{{< variable "PROJECT_ID" >}}?start_date=2025-01-01&end_date=2025-01-31" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "accept: application/json" | jq '.'
```

## Manage suppression lists

Suppression lists prevent sending to addresses that have bounced or blocked your emails.

### Bounces

List addresses that have hard-bounced:

```bash
curl "https://sendgrid.pltfrm.sh/api/v1/sendgrid/bouncelist/platformsh-auth/{{< variable "PROJECT_ID" >}}" \/{{< variable "PROJECT_ID" >}}" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "accept: application/json" | jq '.'
```

Remove an address from the bounce list only after confirming the address is valid:

```bash
curl -X DELETE "https://sendgrid.pltfrm.sh/api/v1/sendgrid/bouncelist/platformsh-auth/{{< variable "PROJECT_ID" >}}" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "content-type: application/json" \
  -d '{"email": "user@example.com"}'
```

### Blocks

List addresses that have blocked your emails or marked them as spam:

```bash
curl "https://sendgrid.pltfrm.sh/api/v1/sendgrid/blocklist/platformsh-auth/{{< variable "PROJECT_ID" >}}" \
  -H "Authorization: Bearer {{< variable "ACCESS_TOKEN" >}}" \
  -H "accept: application/json" | jq '.'
```

Remove an address from the block list to resume sending:

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
