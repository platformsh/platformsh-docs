---
title: "Health notifications"
weight: -1
description: |
  {{< vendor/name >}} can notify you when various events happen on your project, in any environment. At this time the only notification provided is a low disk space warning, but others may be added in the future.
---

{{% description %}}

To add or modify an integration for a project, you need to be a [project admin](../administration/users.md#project-roles).

## Default low-disk email notifications

When you create a new project,
{{< vendor/name >}} creates a default [low-disk email notification](#low-disk-warning) for all [project admins](../administration/users.md#project-roles).

## Available notifications

### Low-disk warning

{{< vendor/name >}} monitors disk space usage on all applications and services in your cluster.

* When available disk space drops below 20% or 4&nbsp;GB, whichever is smaller, a warning notification is generated.
* When available disk space drops below 10% or 2&nbsp;GB, whichever is smaller, a critical notification is generated.
* When available disk space returns above 20% or 4&nbsp;GB, whichever is smaller, an all-clear notification is generated.

Notifications are generated every 5 minutes, so there may be a brief delay between when the threshold is crossed and when the notification is triggered.

## Configuring notifications

Health notifications can be set up via the [{{< vendor/name >}} CLI](/administration/cli/_index.md), through a number of different channels.

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

The default `from-address` points to the "{{< vendor/name >}} Bot".

You can also configure a custom `--from-address`. The `--from-address` is whatever address you want the email to appear to be from. It is completely fine to use the same email address for both `from-address` and `recipients`. Note that depending on the configuration of the recipient mail server (including SPF and DKIM DNS entries) when using a custom `from-address`, the email can be marked as spam or lost.

### Slack notifications

A notification can trigger a message to be sent to a Slack bot.
First, create a new custom "[bot user](https://api.slack.com/bot-users)" for your Slack group and configure the channels you wish it to live in.
Note the API token is the "Bot User OAuth Access Token" provided by Slack.

Then register that Slack bot with {{< vendor/name >}} using a `health.slack` integration:

```bash
platform integration:add --type health.slack --token YOUR_API_TOKEN --channel '#channelname'
```

That will trigger the corresponding bot to post a notification to the `#channelname` channel in your Slack group.

### PagerDuty notifications

A notification can trigger a message to be sent via PagerDuty, if you are using that service.
First, create a new PagerDuty "[integration](https://support.pagerduty.com/docs/services-and-integrations)" that uses the Events API v2.
Copy the "Integration Key" as known as the "routing key" for the integration.

Now register a `health.pagerduty` integration as follows:


```bash
platform integration:add --type health.pagerduty --routing-key YOUR_ROUTING_KEY
```

Any notification will now trigger an alert in PagerDuty.


## Validate the integration

You can then verify that your integration is functioning properly [using the CLI](/integrations/overview.md#validate-integrations) command

```bash
platform integration:validate
```
