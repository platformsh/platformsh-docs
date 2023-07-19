---
title: Routes
sidebarTitle: Routes
weight: 20
description: There is many way to defined your routes between your apps, explore all of your possibilities.
---

All of your apps are served by a single [router for the project](/define-routes/_index.md).
Each of your apps must have a `name` that's unique within the project.
Use the `name` to define the specific routes for that app.

## Routes example

Assume you have an app for a CMS and another app for the frontend defined as follows:

```yaml {location=".platform/applications.yaml"}
-   name: cms
    type: php:8.2
    source:
        root: drupal
    ...

-   name: frontend
    type: nodejs:16
    source:
        root: react
    ...
```

You don't need to define a route for each app in the repository.
If an app isn't specified, then it isn't accessible to the web.
You can achieve the same thing by defining the app as  [`worker`](../app-reference.md#workers).

Below are two approaches to configuring the Router container: using subdomains, and using subdirectories.

### Using subdomains per application

You can define routes for your apps as follows:

```yaml {location=".platform/routes.yaml"}
"https://api.{default}/":
    type: upstream
    upstream: "cms:http"
"https://{default}/":
    type: upstream
    upstream: "frontend:http"
```

So if your default domain is `example.com`, that means:

* `https://api.example.com/` is served by your CMS app.
* `https://example.com/` is served by your frontend app.

{{< note >}}
Be aware that using a subdomain might [double your network traffic](https://nickolinger.com/blog/2021-08-04-you-dont-need-that-cors-request/),
so consider using a path like `https://{default}/api` instead.
{{< /note >}}

### Using subdirectories per application

Using the same example, you could also define your routes as follows:

```yaml {location=".platform/routes.yaml"}
"https://{default}/":
    type: upstream
    upstream: "frontend:http"
"https://{default}/api":
    type: upstream
    upstream: "cms:http"
```

Then you need to configure each app `web.locations` to match these paths:

```yaml {location=".platform/applications.yaml"}
-   name: cms
    type: php:8.1
    source:
        root: drupal
    ...
    web:
        locations:
            "/api":
                passthru: "/api/index.php"
                root: "public"
                index:
                    - index.php

-   name: frontend
    type: nodejs:16
    source:
        root: react
    ...
    web:
        locations:
            "/":
                passthru: "/index.js"
                root: "build"
                index:
                    - index.js
```

So if your default domain is `example.com`, that means:

* `https://example.com/` is served by your frontend app.
* `https://example.com/api` is served by your CMS app.

{{< note >}}
Please notice that for `cms` app configuration, we need to repeat the url suffix `/api` as an index in the `web.locations` and in the url of the `passhtru` settings.
{{< /note >}}
