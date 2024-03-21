---
title: "App reference"
weight: 4
description: See all of the options for controlling your apps and how they're built and deployed on {{% vendor/name %}}.
---

{{% description %}}

Configuration is all done in a `{{< vendor/configfile "app" >}}` file,
located at the root of your Git repository.

See a [comprehensive example](../_index.md#comprehensive-example) of a configuration in a `{{< vendor/configfile "app" >}}` file.

## Primary application properties

All application configuration takes place in a `{{< vendor/configfile "app" >}}` file, with each application configured under a unique key beneath the top-level `applications` key.
For example, it is possible to deploy two application containers - one JavaScript and the other Python - for the frontend and backend components of a deployed site.

In this case, the unified `{{< vendor/configfile "app" >}}` file would look like:
{{< codetabs >}}
+++
title=Built-in image
+++
This example applies if you set your runtime using [built-in image (``type:``)](/create-apps/app-reference/images/builtin-image.md)

```yaml {configFile="app"}
applications:
    frontend:
        type: 'nodejs:{{% latest "nodejs" %}}'
        # Additional frontend configuration
    backend:
        type: 'python:{{% latest "python" %}}'
        # Additional backend configuration
```

<--->
+++
title=Composable image
+++
This example applies if you set your runtime using [Composable image (``stack:``)](/create-apps/app-reference/images/composable-image.md)

```yaml {configFile="app"}
applications:
    frontend:
        stack: [ "nodejs@{{% latest nodejs %}}" ]
        # Additional frontend configuration
    backend:
        stack: [ "python@{{% latest python %}}" ]
        # Additional backend configuration
```

{{< /codetabs >}}

The following table presents all properties available at the level just below the unique application name (`frontend` and `backend` above).

The column _Set in instance?_ defines whether the given property can be overridden within a `web` or `workers` instance.
To override any part of a property, you have to provide the entire property.


| Name               | Type                                                | Required | Set in instance? | Description                                                                                                                                                                                                                                                    |
| ------------------ | --------------------------------------------------- | -------- | ---------------- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`             | `string`                                            | Yes      | No               | A unique name for the app. Must be lowercase alphanumeric characters. Changing the name destroys data associated with the app.                                                                                                                                 |
| `type`             | A [type](#types)                                    | Yes      | No               | The base image to use with a specific app language. Format: `runtime:version`.                                                                                                                                                                                 |
| `relationships`    | A dictionary of [relationships](#relationships)     |          | Yes              | Connections to other services and apps.                                                                                                                                                                                                                        |
| `mounts`           | A dictionary of [mounts](#mounts)                   |          | Yes              | Directories that are writable even after the app is built. Allocated disk for mounts is defined with a separate resource configuration call using `{{% vendor/cli %}} resources:set`.                                                                          |
| `web`              | A [web instance](#web)                              |          | N/A              | How the web application is served.                                                                                                                                                                                                                             |
| `workers`          | A [worker instance](#workers)                       |          | N/A              | Alternate copies of the application to run as background processes.                                                                                                                                                                                            |
| `timezone`         | `string`                                            |          | No               | The timezone for crons to run. Format: a [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Defaults to `UTC`, which is the timezone used for all logs no matter the value here. See also [app runtime timezones](/create-apps/timezone.md) |
| `access`           | An [access dictionary](#access)                     |          | Yes              | Access control for roles accessing app environments.                                                                                                                                                                                                           |
| `variables`        | A [variables dictionary](#variables)                |          | Yes              | Variables to control the environment.                                                                                                                                                                                                                          |
| `firewall`         | A [firewall dictionary](#firewall)                  |          | Yes              | Outbound firewall rules for the application.                                                                                                                                                                                                                   |
| `build`            | A [build dictionary](#build)                        |          | No               | What happens when the app is built.                                                                                                                                                                                                                            |
| `dependencies`     | A [dependencies dictionary](#dependencies)          |          | No               | What global dependencies to install before the `build` hook is run.                                                                                                                                                                                            |
| `hooks`            | A [hooks dictionary](#hooks)                        |          | No               | What commands run at different stages in the build and deploy process.                                                                                                                                                                                         |
| `crons`            | A [cron dictionary](#crons)                         |          | No               | Scheduled tasks for the app.                                                                                                                                                                                                                                   |
| `source`           | A [source dictionary](#source)                      |          | No               | Information on the app's source code and operations that can be run on it.                                                                                                                                                                                     |
| `runtime`          | A [runtime dictionary](#runtime)                    |          | No               | Customizations to your PHP or Lisp runtime.                                                                                                                                                                                                                    |
| `additional_hosts` | An [additional hosts dictionary](#additional-hosts) |          | Yes              | Maps of hostnames to IP addresses.                                                                                                                                                                                                                             |
