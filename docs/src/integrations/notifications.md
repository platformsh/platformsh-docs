---
title: "Health notifications"
weight: -1
description: |
  Platform.sh can notify you when various events happen on your project, in any environment. At this time the only notification provided is a low disk space warning, but others may be added in the future.
---

{{% description %}}

{{< note >}}
Remember that you must have `admin` access to a project in order to add or modify an integration.  See [User administration roles](/administration/users.md#user-roles) for more details.
{{< /note >}}

## Default low-disk email notifications

When you create a new project, Platform.sh creates a default [low-disk email notification](#low-disk-warning) for all [Project Admins](/administration/users.md#user-roles).

{{< note >}}
All projects created prior to 6 April 2020 that did not have any health notifications enabled had an email notification added for admin users.
{{< /note >}}

## Available notifications

### Low-disk warning

Platform.sh monitors disk space usage on all applications and services in your cluster.

* If and when available disk space drops below 20%, a warning notification is generated.
* If and when available disk space drops below 10%, a critical notification is generated.
* If and when available disk space goes back above 20% after previously having been lower, an all-clear notification is generated.

Notifications are generated every 5 minutes, so there may be a brief delay between when the threshold is crossed and when the notification is triggered.

## Configuring notifications

Health notifications can be set up via the [Platform.sh CLI](/administration/cli/_index.md), through a number of different channels.

### Email notifications

A notification can trigger an email to be sent, from an address of your choosing to one or more addresses of your choosing.

You can view an email notification by running `platform integration:get`.

```bash
platform integration:get
+--------------+---------------+
| Property     | Value         |
+--------------+---------------+
| id           | abcdefghijklm |
| type         | health.email  |
| role         |               |
| from_address |               |
| recipients   | - '#admins'   |
+--------------+---------------+
```

To edit the `recipients` that receive the default email notification, use the `integration:update` command.

```bash
platform integration:update abcdefghijklm --recipients you@example.com
```

The `recipients` field may be any valid email address, or one of the following special values.

* `#admins` maps to all project admins and up.
* `#viewers` maps to everyone with access to the project.

To add a new email notification, register a `health.email` integration as follows:

```bash
platform integration:add --type health.email --recipients them@example.com --recipients others@example.com
```

You must specify one or more `recipients`, each as its own switch.

The default `from-address` points to the "Platform.sh Bot".

You can also configure a custom `--from-address`. The `--from-address` is whatever address you want the email to appear to be from. It is completely fine to use the same email address for both `from-address` and `recipients`. Note that depending on the configuration of the recipient mail server (including SPF and DKIM DNS entries) when using a custom `from-address`, the email can be marked as spam or lost.


### Slack notifications

A notification can trigger a message to be sent to a Slack bot.  First, create a new custom "[bot user](https://api.slack.com/bot-users)" for your Slack group and configure the channels you wish it to live in.  Note the API token is the "Bot User OAuth Access Token" provided by Slack.

Then register that Slack bot with Platform.sh using a `health.slack` integration:

```bash
platform integration:add --type health.slack --token YOUR_API_TOKEN --channel '#channelname'
```

That will trigger the corresponding bot to post a notification to the `#channelname` channel in your Slack group.

### PagerDuty notifications

A notification can trigger a message to be sent via PagerDuty, if you are using that service.  First, create a new PagerDuty "[integration](https://support.pagerduty.com/docs/services-and-integrations)" that uses the Events API v2.  Copy the "Integration Key" as known as the "routing key" for the integration.

Now register a `health.pagerduty` integration as follows:


```bash
platform integration:add --type health.pagerduty --routing-key YOUR_ROUTING_KEY
```

Any notification will now trigger an alert in PagerDuty.

### Webhooks notifications

A notification can trigger a message to be sent to a web endpoint.

To do so, register a `health.webhook` integration as follows:

```bash
platform integration:add --type health.webhook --url=A-URL-THAT-CAN-RECEIVE-THE-POSTED-JSON
```

Any notification will now be posted to the `health.webhook` URL.

In order to let you verify that requests are coming from the integration, you can use the optional `shared-key` parameter which will add a `X-JWS-Signature` request header containing the JSON Web Token Signature in JWS Compact Serialization with Unencoded Detached Payload ([RFC7797](https://tools.ietf.org/html/rfc7797)).

```bash
platform integration:add --type health.webhook --url=A-URL-THAT-CAN-RECEIVE-THE-POSTED-JSON --shared-key JWS-SYMMETRIC-KEY
```

The signature is calculated using the given `shared-key` and the fixed header:

```json
{"alg":"HS256","b64":false,"crit":["b64"]}
```

A simplified example payload with the corresponding signature might look like the following snippet:

```bash
POST /health/notifications HTTP/1.0
Host: www.example.com
Content-Length: 1495
Content-Type: application/json
X-JWS-Signature: eyJhbGciOiJIUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..fYW9qrjShmEArV17Z1kH6yudoXzpBE3PzJXq_OqrIfM

{...request body...}
```

Signature verification is a 2 step process:

```python
# 1. Compute JWS Compact Serialization with Unencoded Detached Payload

from jwcrypto import jws, jwk

rfc7797_u_header = '{"alg":"HS256","b64":false,"crit":["b64"]}'
json_web_key = jwk.JWK(kty="oct", k="JWS-SYMMETRIC-KEY")

sig = jws.JWS(request.body())
sig.add_signature(json_web_key, protected=rfc7797_u_header)
sig.detach_payload()

# 2. Verify the signature

assert sig.serialize(compact=True) == request.headers["X-JWS-Signature"]
```

Please refer to the [JOSE Cookbook](https://github.com/ietf-jose/cookbook) for examples about protecting content using JavaScript Object Signing and Encryption (JOSE).

## Validate the integration

You can then verify that your integration is functioning properly [using the CLI](/integrations/overview.md#validating-integrations) command

```bash
$ platform integration:validate
```
