---
title: Cancel an activity
description: See how to cancel running or pending activities in an environment.
---

If you have a stuck activity or you pushed a change you know doesn't work,
you can cancel a running or pending activity on an environment.
This works for activities such as builds, cron jobs, and source operations.

You can cancel activities using the [CLI](../administration/cli/_index.md)
or in the [Console](../administration/web/_index.md).

{{< codetabs >}}
+++
title=Using the CLI
+++

Run the following command:

```bash
{{% vendor/cli %}} activity:cancel
```

If you have more than one running or pending activity, choose which activity to cancel.

You can also cancel a specific activity by specifying its ID:

```bash
{{% vendor/cli %}} activity:cancel {{< variable "ACTIVITY_ID" >}}
```

Get the ID from the [activity log](../increase-observability/logs/access-logs.md#activity-logs).

<--->
+++
title=In the Console
+++

1. Open the environment where you want to cancel an activity.
2. In the [activity log](../increase-observability/logs/access-logs.md#activity-logs),
   click {{< icon more >}} **More** next to the activity you want to cancel.
3. Click **Cancel**.

{{< /codetabs >}}

## Non-cancellable activities

An activity can finish in between when you load the Console and when you click **Cancel**.
For example, when the activity is a [source operation](../create-apps/source-operations.md)
and the related build hook has already completed.
In such cases, you get a message that the activity can't be cancelled.
