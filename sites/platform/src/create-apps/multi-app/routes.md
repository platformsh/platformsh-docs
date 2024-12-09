---
title: Define routes for your multiple apps
sidebarTitle: Define routes
weight: 20
description: Learn about the many ways you can define routes between your apps.
banner:
   title: Feature availability
   type: tiered-feature
   body: This page applies to Grid and {{% names/dedicated-gen-3 %}} projects. To ensure you have enough resources to support multiple apps, you need at least a [{{< partial "plans/multiapp-plan-name" >}} plan](/administration/pricing/_index.md#multiple-apps-in-a-single-project). To set up multiple apps on {{% names/dedicated-gen-2 %}} environments, [contact Sales](https://platform.sh/contact/).
---

When you set up a project containing multiple applications,
all of your apps are served by a single [router for the project](/define-routes/_index.md).
Each of your apps must have a `name` that's unique within the project.
To define specific routes for one of your apps, use this `name`.

There are various ways you can define routes for multiple app projects.

![Diagram of a project containing multiple apps](/images/config-diagrams/multiple-app.png "0.5")

In this project, you have a CMS app, two frontend apps (one using Symfony and another using Gatsby),
and a Mercure Rocks server app, defined as follows:

```yaml {configFile="apps"}
admin:
  type: nodejs:16
  source:
    root: admin
  ...
api:
  type: php:8.2
  source:
    root: api
  ...
gatsby:
  type: nodejs:18
  source:
    root: gatsby
  ...
mercure:
  type: golang:1.18
  source:
    root: mercure/.config
  ...
```

{{< note >}}

You don't need to define a route for each app in the repository.
If an app isn't specified, then it isn't accessible to the web.
One good example of defining an app with no route is when you [use Git submodules](/create-apps/multi-app/project-structure.html#split-your-code-source-into-multiple-git-submodule-repositories) and want to [use a source operation to update your submodules](/development/submodules.html#update-submodules).

You can also achieve the same thing by defining the app as a [`worker`](/create-apps/app-reference/single-runtime-image.md#workers).

{{< /note >}}

Depending on your needs, you could configure the router container
[using subdomains](#define-routes-using-subdomains) or using [subdirectories](#define-routes-using-subdirectories).

### Define routes using subdomains

You could define routes for your apps as follows:

```yaml {configFile="routes"}
"https://mercure.{default}/":
  type: upstream
  upstream: "mercure:http"
"https://{default}/":
  type: upstream
  upstream: "api:http"
```

So if your default domain is `example.com`, that means:

- `https://mercure.example.com/` is served by your Mercure Rocks app (`mercure`).
- `https://example.com/` is served by your Symfony frontend app (`api`).

{{< note >}}

Using a subdomain might [double your network traffic](https://nickolinger.com/blog/2021-08-04-you-dont-need-that-cors-request/),
so consider using a path like `https://{default}/api` instead.

{{< /note >}}

### Define routes using subdirectories

Alternatively, you could define your routes as follows:

```yaml {configFile="routes"}
"https://{default}/":
  type: upstream
  upstream: "api:http"
"https://{default}/admin":
    type: upstream
    upstream: "admin:http"
```

Then you would need to configure each app's `web.locations` property to match these paths:

```yaml {configFile="apps"}
api:
  type: php:8.2
  source:
    root: api
  ...
  web:
    locations:
      "/":
        passthru: "/index.php"
        root: "public"
        index:
          - index.php
admin:
  type: nodejs:16
  source:
    root: admin
  ...
  web:
    locations:
      '/admin':
        passthru: '/admin/index.html'
        root: 'build'
        index:
          - 'index.html'
```

So if your default domain is `example.com`, that means:

- `https://example.com/` is served by your Symfony frontend app (`api`).
- `https://example.com/admin` is served by your Admin app (`admin`).

Note that in this example, for the configuration of your `admin` app,
you need to add the URL suffix `/admin` as both an index in the `web.locations` and a value for the `passhtru` setting.

For a complete example, [go to this project on GitHub](https://github.com/platformsh-templates/bigfoot-multiapp/tree/submodules-root-subfolders-applications).
