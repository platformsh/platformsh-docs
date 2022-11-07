---
title: "App runtime timezone"
sidebarTitle: "Runtime timezone"
---

All Platform.sh containers default to running in UTC time.
You can set a different timezone for crons to run in the [app configuration](./app-reference.md).
In most cases, it's best to leave all timezones in UTC and store user data with an associated timezone instead.
But it's possible to set different timezones for specific app runtimes.

The way to set a different timezone for a specific app depends on the given runtime:

{{< codetabs >}}

---
title=PHP
file=none
highlight=false
---

Add the following to your `.platform.app.yaml` file:

  ```yaml
  variables:
      php:
          "date.timezone": "Europe/Paris"
  ```

<--->

---
title=Node.js
file=none
highlight=false
---

Start the server with `env TZ='<timezone>' node server.js`.

<--->

---
title=Python
file=none
highlight=false
---

Start the server with `env TZ='<timezone>' python server.py`.

<--->

---
title=Java
file=none
highlight=false
---

* Start the server with `env TZ='<timezone>' java -jar ...` OR
* Set the Java virtual machine argument `user.timezone`.
  This Java virtual machine argument takes precedence over the environment variable TZ.
  For example, you can use the flag `-D` when running the application:
  `java -jar -D user.timezone=GMT` or `java -jar -D user.timezone="Asia/Kolkata"`

{{< /codetabs >}}

Setting the application timezone only affects the application itself, not system operations such as log files.

You can also set the [timezone for a project](../administration/web/configure-project.md#general), but it doesn't affect the timezone for the app runtime.
