---
title: Multiple apps in a single project
sidebarTitle: Multiple apps
description: Create multiple apps within a single project, such as a CMS backend connected to a frontend to display it.
---

You might have multiple apps that are closely related.
For example, you might have a CMS backend for your content or other APIs and a frontend to display it all.
In such cases, you can create multiple apps within a single project so they can share data.

Note that to have enough resources to support multiple apps, you need at least a [{{< partial "plans/multiapp-plan-name" >}} plan](../administration/pricing/_index.md#multiple-apps-in-a-single-project).

{{< note >}}

This page applies to Grid and {{% names/dedicated-gen-3 %}} projects.
To set up multiple apps in {{% names/dedicated-gen-2 %}} environments, contact your sales representative.

{{< /note >}}

No matter how many apps you have in one project, they're all served by a single [router for the project](#routes).
To let your apps talk to one another, create [relationships among them](#relationships).
Each app separately defines its relationships to [services](../add-services/_index.md).
So apps can share services or have their own.

![A diagram showing the router directing traffic form the default domain to one app with services and traffic to the API at the domain to a different app with no services](/images/config-diagrams/multiple-applications.png "0.5")

## Project structure

How you structure a project with multiple apps depends on how your code is organized
and what you want to accomplish.

The following table presents some example use cases and potential ways to organize the project:

| Use case | Structure |
| -------- | --------- |
| Separate basic apps that are worked on together | [Separate code in one repository](#separate-code-bases-in-one-repository) |
| One app depends on code from another app | [Nested directories](#nested-directories) |
| You want to keep configuration separately from the code, such as through Git submodules | [Configuration separate from code](#configuration-separate-from-code-git-submodules) |
| You want multiple apps from the same source code | [Unified app configuration](#unified-app-configuration) |
| You want to control all apps in a single location | [Unified app configuration](#unified-app-configuration) |

### Separate code bases in one repository

If your project consists of a discrete code base for each app,
the most straightforward approach is to put each code base in a separate directory within your repository.
Each has its own [`.platform.app.yaml` file](../create-apps/_index.md),
which defines the configuration for that app.
The directory with the `.platform.app.yaml` file acts as the root directory for that app.

For example, if you have a Drupal backend with a React frontend, you could organize the repository like this:

```txt
├── drupal
│   ├── .platform.app.yaml  <- Drupal app configuration
│   └── ...                 <- Drupal app code
├── .platform
│   └── routes.yaml
└── react
   ├── .platform.app.yaml  <- React app configuration
   └── ...                 <- React app code
```

Each `.platform.app.yaml` file defines a single app container,
with its configuration relative to the directory with the file.
The apps can talk to each other through relationships defined in their configuration.
If you change the code for only one app, the build image for the other can be reused.

The `.platform` directory is outside of all the apps and defines all routes and any services.

### Nested directories

When code bases are separate, changes to one app don't necessarily mean that another is rebuilt.
You might have a situation where one app depends on another, but the second doesn't depend on the first.
In such cases, you can nest the dependency so the parent gets rebuilt on changes to it or its children,
but the child is only rebuilt on changes to itself.

For example, you might have a Python app that runs a script that requires Java code to be up to date.
But the Java app doesn't require updating when the Python app is updated.
In that case, you can nest the Java app within the Python app:

```txt
├── languagetool
│   ├── .platform.app.yaml  <- Java app configuration
│   └── main.java           <- Java app code
├── main.py                 <- Python app code
├── .platform
│   └── routes.yaml
└── .platform.app.yaml      <- Python app configuration
```

The Python app's code base includes all of the files at the top level (excluding the `.platform` directory)
*and* all of the files within the `languagetool` directory.
The Java app's code base includes only files within the `languagetool` directory.

### Configuration separate from code (Git submodules)

You can also keep your app configuration completely separate from the code.
For example, if you have different teams working on different code with different processes,
you might want each app to have its own repository.
Then you can build them together in another repository using [Git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

In this setup, your app configuration has to be in the top repository, not in a submodule.
In this case, and any other case where you want the configuration to be separate from the code,
you need to specify the code root in the configuration file.

So your project repository might look like this:

```text
├── app1
│   ├── .platform.app.yaml  <- App 1 configuration
│   └── app1-submodule
|       └── ...             <- App 1 code from submodule
├── app2
│   ├── .platform.app.yaml  <- App 2 configuration
│   └── app2-submodule
|       └── ...             <- App 2 code from submodule
└── .gitmodules
└── .platform
    └── routes.yaml
```

Your `.gitmodules` file would define both submodules:

```txt {location=".gitmodules"}
[submodule "app1"]
    path = app1/app1-submodule
    url = https://github.com/your-org/app1
[submodule "app2"]
    path = app2/app2-submodule
    url = https://github.com/your-org/app2
```

So the app configuration files would be outside the directory of the app.
Then in each `.platform.app.yaml` file, specify a `source.root` key to define its root directory.
For example, for `app1`, it could include the following:

```yaml {location="app1/.platform.app.yaml"}
source:
    root: app1/app1-submodule
```

The `source.root` path is relative to the repository root.
Now the `app1` app treats the `app1/app1-submodule` directory as its root when building.
You could do the same for `app2`.

If `source.root` isn't specified, it defaults to the same directory as the file itself.

### Unified app configuration

Rather than defining configuration for each app separately, you can also do it all within a single file.
Create an `applications.yaml` file within the `.platform` directory and define each app as a key.
Since your code lives in a different directory,
define the root directory for each app with the `source.root` for that app.

For example, the following configuration defines three apps:

```yaml {location=".platform/applications.yaml"}
-   name: api
    type: golang:1.18
    source:
        root: api-app
    hooks:
        build: |
            go build -o bin/app
    web:
        commands:
            start: ./bin/app
        locations:
            /:
                allow: false
                passthru: true

-   name: main
    type: php:8.1
    source:
        root: main-app
    web:
        locations:
            "/":
                root: "web"
                passthru: "/index.php"

-   name: admin
    type: php:8.1
    source:
        root: main-app
    web:
        locations:
            "/":
                root: "web"
                passthru: "/admin.php"
```

The `api` app is built from the `api-app` directory.
Both the `main` and `admin` apps are built from the `main-app` directory,
but they have different configurations for how they serve the files.

This allows you to control all your apps in one place and even build multiple apps from the same source code.

## Routes

All of your apps are served by a single [router for the project](../define-routes/_index.md).
Each of your apps must have a `name` that's unique within the project.
Use the `name` to define the specific routes for that app.

### Routes example

Assume you have an app for a CMS and another app for the frontend defined as follows:

```yaml {location=".platform/applications.yaml"}
-   name: cms
    type: php:8.1
    source:
        root: drupal
    ...

-   name: frontend
    type: nodejs:16
    source:
        root: react
    ...
```

You could then define routes for your apps as follows:

```yaml {location=".platform/routes.yaml"}
"https://backend.{default}/":
    type: upstream
    upstream: "cms:http"
"https://{default}/":
    type: upstream
    upstream: "frontend:http"
```

So if your default domain is `example.com`, that means:

* `https://backend.example.com/` is served by your CMS app.
* `https://example.com/` is served by your frontend app.

You don't need to define a route for each app.
If an app isn't specified, then it isn't accessible to the web.
You can achieve the same thing by defining the app as  [`worker`](./app-reference.md#workers).

## Relationships

By default, your apps can't communicate with one another.
To enable connections, define a relationship to another app using the `http` endpoint.

You can't define circular relationships.
If `app1` has a relationship to `app2`, then `app2` can't have a relationship to `app1`.
If you need data to go both ways, consider coordinating through a shared data store,
like a database or [RabbitMQ server](../add-services/rabbitmq.md).

Relationships between apps use HTTP, not HTTPS.
This is still secure because they're internal and not exposed to the outside world.

### Relationships example

Assume you have 2 applications, `main` and `api`.
`main` needs data from `api`.

In your app configuration for `main`, define a relationship to `api`:

```yaml {location="main/.platform.app.yaml"}
relationships:
    api: "api:http"
```

Once they're both built, `main` can now access `api` at the URL `http://api.internal`.
The specific URL is always available through the [`PLATFORM_RELATIONSHIPS` variable](../development/variables/use-variables.md#use-platformsh-provided-variables):

```bash
$ echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq `.api[0].host`
api.internal
```
