---
title: "Timezones"
description: Learn more about the different timezones on Platform.sh and when you can customize them.
---

On Platform.sh, there are several timezones that can affect the behavior of your app.

| Timezone             | Description                                  |Customizable  |
|----------------------|----------------------------------------------|--------------|
| Container timezone   | The timezone for all Platform.sh containers. |No            |
| App runtime timezone | The app runtime timezone only affects your app itself. <BR>You can [set an app runtime timezone](#set-an-app-runtime-timezone) if you don't want your app runtime to use the container timezone.                 | Yes         |
| Cron timezone        | The cron timezone only affects your cron jobs. <BR>You can [set a cron timezone](#set-a-cron-timezone) if you don't want your crons to run in the app runtime timezone (or the container timezone if no app runtime timezone is set on your project).                          | Yes         |
| Log timezone         | The timezone for all Platform.sh logs.       | No           |

{{< note >}}

All of these timezones default in UTC.
In most cases, it’s best to avoid setting customized app runtime and cron timezones.
You can store user data with an associated timezone instead.

{{< /note >}}

Each Platform.sh project also has a **project timezone** that only affects [automated backups](../environments/backup.md#use-automated-backups).
By default, the project timezone is based on the [region](../development/regions.md) where your project is hosted.
You can [change it from the Console](../projects/change-project-timezone.md) at any time.

## Set an app runtime timezone

{{< codetabs >}}

+++
title=PHP
+++

Add the following to your app configuration:

```yaml {location=".platform.app.yaml"}
variables:
    php:
        "date.timezone": "Europe/Paris"
```

<--->

+++
title=Node.js
+++

Start the server with <code>env TZ='{{% variable "TIMEZONE" %}}' node server.js</code>.

<--->

+++
title=Python
+++

Start the server with <code>env TZ='{{% variable "TIMEZONE" %}}' python server.py</code>.

<--->

+++
title=Java
+++

- Start the server with <code>env TZ='{{% variable "TIMEZONE" %}}' java -jar ...</code> OR.
- Set the Java virtual machine argument `user.timezone`.
  This Java virtual machine argument takes precedence over the environment variable TZ.
  For example, you can use the flag `-D` when running the application:
  `java -jar -D user.timezone=GMT` or `java -jar -D user.timezone="Asia/Kolkata"`

{{< /codetabs >}}

## Set a cron timezone

You can set a specific timezone for your crons so they don't run in your app runtime timezone (or container timezone if no app runtime timezone is set on your project).
To do so, [set the `timezone` top-level property](../create-apps/app-reference.md#top-level-properties) in your app configuration.