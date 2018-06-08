# Health Notifications

Platform.sh can notify you when various events happen on your project, in any environment.  At this time the only notification provided is a low disk space warning, but others may be added in the future.

> **Note**
>
> Remember that you must have `admin` access to a project in order to add or modify an integration.  See [User administration](/administration/users.md) for more details.

## Available notifications

### Low-disk warning

If any notifications are configured, Platform.sh will monitor disk space usage on all applications and services in your cluster.

* If and when available disk space drops below 20%, a warning notification is generated.
* If and when available disk space drops below 10%, a critical notification is generated.
* If and when available disk space goes back above 20% after previously having been lower, an all-clear notification is generated.

Notifications are generated every 5 minutes, so there may be a brief delay between when the threshold is crossed and when the notification is triggered.

## Configuring notifications

Health notifications can be set up via the [Platform.sh CLI](/development/cli.html), through a number of different channels.

### Email notifications

A notification can trigger an email to be sent, from an address of your choosing to one or more addresses of your choosing.

To do so, register a `health.email` integration as follows:

```bash
platform integration:add --type health.email --from-address you@example.com --recipients them@example.com --recipients others@example.com
```

The `from-address` is whatever address you want the email to appear to be from.  You must specify one or more `recipients`, each as its own switch.  It is completely fine to use the same address for both `from-address` and `recipients`.

### Slack notifications

A notification can trigger a message to be sent to a Slack bot.  First, create a new custom "[bot user](https://api.slack.com/bot-users)" for your Slack group and configure the channels you wish it to live in.  Note the API Token provided by Slack.

Then register that Slack bot with Platform.sh using a `health.slack` integration:

```bash
platform integration:add --type health.slack --token YOUR_API_TOKEN --channel '#channelname'
```

That will trigger the corresponding bot to post a notification to the `#channelname` channel in your Slack group.

### PagerDuty notifications

A notification can trigger a message to be sent via PagerDuty, if you are using that service.  First, create a new PagerDuty "[integration](https://www.pagerduty.com/integrations/)" using the v2 API.  Copy the routing key it provides.

Now register a `health.pagerduty` integration as follows:


```bash
platform integration:add --type health.pagerduty --routing-key YOUR_ROUTING_KEY
```

Any notification will now trigger an alert in PagerDuty.
