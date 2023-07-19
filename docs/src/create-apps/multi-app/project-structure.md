---
title: Project structure
sidebarTitle: Project structure
weight: 10
description: Explore possible structure of your code depending on the way you want to manage your config files
---

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
Each has its own [`.platform.app.yaml` file](/create-apps/_index.md),
which defines the configuration for that app.
The directory with the `.platform.app.yaml` file acts as the root directory for that app.

For example, if you have a API Platform backend with a Symfony API, a Mercure Rocks server and a Gatsby frontend, you could organize the repository like this:

```txt
├── .platform
│   └── routes.yaml
├── admin
│   ├── .platform.app.yaml  <- API Platform Admin app configuration
│   └── ...                 <- API Platform Admin app code
├── api
│   ├── .platform.app.yaml  <- Bigfoot app configuration
│   └── ...                 <- Bigfoot app code
├── gatsby
│   ├── .platform.app.yaml  <- Gatsby app configuration
│   └── ...                 <- Gatsby app code
└── mercure
   ├── .platform.app.yaml  <- Mercure Rocks app configuration
   └── ...                 <- Mercure Rocks app code
```

The `.platform` directory is outside of all the apps and defines all routes and any services.

Each `.platform.app.yaml` file defines a single app container,
with its configuration relative to the directory with the file.
The apps can talk to each other through relationships defined in their configuration.
If you change the code for only one app, the build image for the other can be reused.

### Nested directories

When code bases are separate, changes to one app don't necessarily mean that another is rebuilt.
You might have a situation where one app depends on another, but the second doesn't depend on the first.
In such cases, you can nest the dependency so the parent gets rebuilt on changes to it or its children,
but the child is only rebuilt on changes to itself.

For example, you might have a Python app that runs a script that requires Java code to be up to date.
But the Java app doesn't require updating when the Python app is updated.
In that case, you can nest the Java app within the Python app:

```txt
├── .platform
│   └── routes.yaml
├── languagetool
│   ├── .platform.app.yaml  <- Java app configuration
│   └── main.java           <- Java app code
├── main.py                 <- Python app code
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

You can design your source code in 2 ways:
- Group your app config files within the top repo
- Embed app config files into submodule repositories

{{< codetabs >}}
+++
title=Grouped config files
+++

In this setup, your app configuration has to be in the top repository, not in a submodule.
In this case, and any other case where you want the configuration to be separate from the code,
you need to specify the code root in the configuration file.

So your [project repository](https://github.com/platformsh-templates/bigfoot-multiapp/tree/multiapp-submodules-subfolders) might look like this:

```text
├── .platform
│   ├── routes.yaml
│   └── services.yaml
├── admin
│   ├── .platform.app.yaml  <- API Platform Admin app configuration
│   └── admin-submodule
│       └── ...             <- API Platform Admin code from submodule
├── api
│   ├── .platform.app.yaml  <- Bigfoot app configuration
│   └── api-submodule
│       └── ...             <- Bigfoot code from submodule
├── gatsby
│   ├── .platform.app.yaml  <- Gatsby app configuration
│   └── gatsby-submodule
│       └── ...             <- Gatsby code from submodule
└── mercure
│   ├── .platform.app.yaml  <- Mercure Rocks app configuration
│   └── mercure-submodule
│       └── ...             <- Mercure Rocks code from submodule
└── .gitmodules
```

Your `.gitmodules` file would define all submodules:

```txt {location=".gitmodules"}
[submodule "admin-submodule"]
	path = admin/admin-submodule
	url = https://github.com/platformsh-templates/bigfoot-multiapp-admin.git
	branch = without-platform-app-yaml
[submodule "api-submodule"]
	path = api/api-submodule
	url = https://github.com/platformsh-templates/bigfoot-multiapp-api.git
	branch = without-platform-app-yaml
[submodule "gatsby-submodule"]
	path = gatsby/gatsby-submodule
	url = https://github.com/platformsh-templates/bigfoot-multiapp-gatsby.git
	branch = without-platform-app-yaml
[submodule "mercure-submodule"]
	path = mercure/mercure-submodule
	url = https://github.com/platformsh-templates/bigfoot-multiapp-mercure.git
	branch = without-platform-app-yaml
```

So the app configuration files would be outside the directory of the app.
So you need to [change the `source.root` key](#change-source-root-of-your-app) to define it for each of your 4 apps.

{{< note >}}
You can also use [Unified App configuration](/create-apps/multi-app.html#unified-app-configuration) in this setup
{{< /note >}}

<--->
+++
title=Embedded config files
+++

In this setup, your app configuration are in each of the submodule repositories.

So your [project repository](https://github.com/platformsh-templates/bigfoot-multiapp/tree/submodules-root-app-yaml) might look like this:

```text
├── .platform
│   ├── routes.yaml
│   └── services.yaml
├── @admin
│   ├── .platform.app.yaml  <- API Platform Admin app configuration
│   └── ...                 <- API Platform Admin code from submodule
├── @api
│   ├── .platform.app.yaml  <- Bigfoot app configuration
│   └── ...                 <- Bigfoot code from submodule
├── @gatsby
│   ├── .platform.app.yaml  <- Gatsby app configuration
│   └── ...                 <- Gatsby code from submodule
├── @mercure
│   ├── .platform.app.yaml  <- Mercure Rocks app configuration
│   └── ...                 <- Mercure Rocks code from submodule
└── .gitmodules
```

Your `.gitmodules` file would define all submodules:

```txt {location=".gitmodules"}
[submodule "admin"]
	path = admin
	url = https://github.com/platformsh-templates/bigfoot-multiapp-admin.git
	branch = with-platform-app-yaml
[submodule "api"]
	path = api
	url = https://github.com/platformsh-templates/bigfoot-multiapp-api.git
	branch = with-platform-app-yaml
[submodule "gatsby"]
	path = gatsby
	url = https://github.com/platformsh-templates/bigfoot-multiapp-gatsby.git
	branch = with-platform-app-yaml
[submodule "mercure"]
	path = mercure
	url = https://github.com/platformsh-templates/bigfoot-multiapp-mercure.git
	branch = with-platform-app-yaml
```

So the app configuration files would be inside the directory of the app.

{{< /codetabs >}}

### Change source root of your app
When your source code is not at the same level as your `.platform.app.yaml` file, you need to add a new `source.root` key in your settings to define its root directory.
For example, for `admin` app from above, in the [Grouped config files setup](#configuration-separate-from-code-git-submodules), we could include the following:

```yaml {location="admin/.platform.app.yaml"}
source:
    root: admin/admin-submodule
```

The `source.root` path is relative to the repository root.
Now the `admin` app treats the `admin/admin-submodule` directory as its root when building.

If `source.root` isn't specified, it defaults to the same directory as the `.platform.app.yaml` file itself.

### Unified app configuration

Rather than defining configuration for each app separately, you can also do it all within a single file.
Create an `applications.yaml` file within the `.platform` directory and define each app as a key.
Since your code lives in a different directory,
define the root directory for each app with the `source.root` for that app.

For example, if you have code for a Go API app (`api`) and code for two PHP apps (`main` and `admin`),
you could organize the repository like this:

```txt
├── .platform
│   ├── applications.yaml  <- Unified app configuration
│   └── routes.yaml
├── api-app
│   └── ...                 <- Go API app code
└── main-app
    └── ...                  <- PHP main and admin app code
```

You could then configure this into three apps as in the following configuration:

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
    type: php:8.2
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
To build multiple apps from the repository root, set `source.root` to `/`.

This allows you to control all your apps in one place and even build multiple apps from the same source code.

## Routes

All of your apps are served by a single [router for the project](/define-routes/_index.md).
Each of your apps must have a `name` that's unique within the project.
Use the `name` to define the specific routes for that app.

### Routes example

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

#### Using subdomains per application

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

#### Using subdirectories per application

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

## Relationships

By default, your apps can't communicate with one another.
To enable connections, define a relationship to another app using the `http` endpoint.

You can't define circular relationships.
If `app1` has a relationship to `app2`, then `app2` can't have a relationship to `app1`.
If you need data to go both ways, consider coordinating through a shared data store,
like a database or [RabbitMQ server](/add-services/rabbitmq.md).

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
The specific URL is always available through the [`PLATFORM_RELATIONSHIPS` variable](/development/variables/use-variables.md#use-platformsh-provided-variables):

```bash
echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq '.api[0].host'
api.internal
```
