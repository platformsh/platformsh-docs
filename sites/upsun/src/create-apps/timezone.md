---
title: "Timezones"
description: Learn more about the different timezones on {{% vendor/name %}} and when you can customize them.
---

On {{% vendor/name %}}, there are several timezones you might want to keep in mind.
All timezones default to UTC time.
You can customize some of them, but in most cases,
it's best if you leave them in UTC
and store user data with an associated timezone instead.

The different timezones on {{% vendor/name %}} are the following:

| Timezone             | Description                                  |Customizable  |
|----------------------|----------------------------------------------|--------------|
| Container timezone   | The timezone for all {{% vendor/name %}} containers (UTC). |No            |
| App runtime timezone | [Set an app runtime timezone](#set-an-app-runtime-timezone) if you want your app runtime to use a specific timezone instead of the container timezone.<BR>The app runtime timezone only affects your app itself.                | Yes         |
| Cron timezone        | [Set a cron timezone](#set-a-cron-timezone) if you want your crons to run in a specific timezone instead of the app runtime timezone (or instead of the container timezone if no app runtime timezone is set on your project). <BR>The cron timezone only affects your cron jobs.                          | Yes         |
| Log timezone         | The timezone for all {{% vendor/name %}} logs (UTC).      | No           |

{{< note >}}

Each {{% vendor/name %}} project also has a **project timezone** that only affects [automated backups](/environments/backup#automated-backups).
By default, the project timezone is based on the [region](../development/regions.md) where your project is hosted.
You can [change it from the Console](../projects/change-project-timezone.md) at any time.

{{< /note >}}

## Set an app runtime timezone

How you can set an app runtime timezone depends on your actual app runtime:

{{< codetabs >}}

+++
title=PHP
+++

Add the following to your app configuration:

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}
variables:
  php:
    "date.timezone": "Europe/Paris"
{{< /snippet >}}
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
To do so, [set the `timezone` top-level property](/create-apps/app-reference/single-runtime-image#primary-application-properties) in your app configuration.
