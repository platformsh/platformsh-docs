---
title: "App runtime timezone"
sidebarTitle: "Runtime timezone"
---

All Platform.sh containers default to running in UTC time.
In most cases, it's best to leave all timezones in UTC and store user data with an associated timezone instead.
But it's possible to set different timezones for specific app runtimes.

The way to set a different timezone for a specific app depends on the given runtime:

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

Setting the application {{< variable "TIMEZONE" >}} only affects the application itself, not system operations such as log files.
You can set a different timezone for crons to run in the [app configuration](./app-reference.md).
You can also set the [timezone for a project](../administration/web/configure-project.md#general), but it doesn't affect the timezone for the app runtime.
