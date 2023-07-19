---
title: Routes
sidebarTitle: Routes
weight: 20
description: There is many ways to defined your routes between your apps, explore all of your possibilities.
---

All of your apps are served by a single [router for the project](/define-routes/_index.md).
Each of your apps must have a `name` that's unique within the project.
Use the `name` to define the specific routes for that app.

Let's consider we want to define this multiple application:
![A diagram showing the router directing traffic form the default domain to one app with services and traffic to the API at the domain to a different app with no services](/images/config-diagrams/multiple-app.png "0.5")

## Routes example
Assume you have an app for a CMS, two apps for frontends (one using Symfony and another using Gatsby) and another for Mercure Rocks server, defined as follows:

```yaml {location=".platform/applications.yaml"}
- name: admin
  type: nodejs:16
  source:
    root: admin
  ...
- name: api
  type: php:8.2
  source:
    root: api
  ...
- name: gatsby
  type: nodejs:18
  source:
    root: gatsby
  ...
- name: mercure
  type: golang:1.18
  source:
    root: mercure/.config
  ...
```

{{< note >}}
You don't need to define a route for each app in the repository.
If an app isn't specified, then it isn't accessible to the web.
You can achieve the same thing by defining the app as  [`worker`](../app-reference.md#workers).
{{< /note >}}

Below are two approaches to configuring the Router container: using subdomains, and using subdirectories.

### Using subdomains per application

You can define routes for your apps as follows:

```yaml {location=".platform/routes.yaml"}
"https://mercure.{default}/":
    type: upstream
    upstream: "mercure:http"
"https://{default}/":
    type: upstream
    upstream: "api:http"
```

So if your default domain is `example.com`, that means:

* `https://mercure.example.com/` is served by your Mercure Rocks app (`mercure`).
* `https://example.com/` is served by your Symfony frontend app (`api`).

{{< note >}}
Be aware that using a subdomain might [double your network traffic](https://nickolinger.com/blog/2021-08-04-you-dont-need-that-cors-request/),
so consider using a path like `https://{default}/api` instead.
{{< /note >}}

### Using subdirectories per application

Using the same example, you could also define your routes as follows:

```yaml {location=".platform/routes.yaml"}
"https://{default}/":
    type: upstream
    upstream: "api:http"
"https://{default}/admin":
    type: upstream
    upstream: "admin:http"
```

Then you need to configure each app `web.locations` to match these paths:

```yaml {location=".platform/applications.yaml"}
-   name: api
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
- name: admin
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

* `https://example.com/` is served by your Symfony frontend app (`api`).
* `https://example.com/admin` is served by your Admin app (`admin`).

{{< note >}}
Please notice that for `admin` app configuration, we need to repeat the url suffix `/admin` as an index in the `web.locations` as in the value of the `passhtru` settings.
{{< /note >}}

Complete example can be found [here](https://github.com/platformsh-templates/bigfoot-multiapp/tree/submodules-root-subfolders-applications)
