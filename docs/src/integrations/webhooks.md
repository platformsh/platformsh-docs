---
title: "Generic webhook"
sidebarTitle: "Webhooks"
description: |
  This hook allows you to capture any push events on platform and POST a JSON message describing the activity to the url of your choice. You can use this to further automate your Platform.sh workflow.
---

{{< description >}}

## Setup

```bash
platform integration:add --type=webhook --url=A-URL-THAT-CAN-RECEIVE-THE-POSTED-JSON
```

The webhook URL will receive a POST message for every "Activity" that is triggered, and the message will contain complete information about the entire state of the project at that time.  In practice most of the message can be ignored but is available if needed.  The most commonly used values are documented below.

It's also possible to set the integration to only send certain activity types, or only activities on certain branches.  The CLI will prompt you to specify which to include or exclude.  Leave at the default values to get all events on all environments in a project.

## Webhook schema

See the [activity script]({{< relref "/integrations/activity-scripts/activity.md" >}}) reference for a description of the webhook payload.

## Validate the integration

You can then verify that your integration is functioning properly [using the CLI](/administration/integrations.html#validating-integrations) command

```bash
platform integration:validate
```
