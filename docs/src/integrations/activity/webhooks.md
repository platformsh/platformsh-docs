---
title: "Webhooks"
description: |
  Webhooks allow you to host a script yourself externally that receives the same payload as an activity script and responds to the same events, but can be hosted on your own server in your own language.
layout: single
---

{{% description %}}

## Setup

```bash
platform integration:add --type=webhook --url={{<variable "URL_THAT_CAN_RECEIVE_JSON" >}}
```

The webhook URL receives a POST message for every "Activity" that's triggered,
the message contains complete information about the entire state of the project at that time.
In practice most of the message can be ignored but is available if needed.
The most commonly used values are documented below.

It's also possible to set the integration to only send certain activity types, or only activities on certain branches.
The CLI prompts you to specify which to include or exclude.
Leave at the default values to get all events on all environments in a project.

For testing purposes, you can use a service like [webhook.site](https://webhook.site/) and use the generated URL as `{{<variable "URL_THAT_CAN_RECEIVE_JSON" >}}`.

## Webhook schema

See the [activity script](/integrations/activity/reference.md) reference for a description of the webhook payload.

## Validate the integration

You can verify that your integration is functioning properly [using the CLI](/integrations/overview.md#validating-integrations) command

```bash
platform integration:validate
```
