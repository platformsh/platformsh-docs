---
title: Choose a project structure
weight: 10
description: Explore possible structures you can apply to your code depending on how you want to manage your configuration files.
banner:
   title: Feature availability
   body: This page applies to Grid and {{% names/dedicated-gen-3 %}} projects. To ensure you have enough resources to support multiple apps, you need at least a [{{< partial "plans/multiapp-plan-name" >}} plan](/administration/pricing/_index.md#multiple-apps-in-a-single-project). To set up multiple apps on {{% names/dedicated-gen-2 %}} environments, [contact Sales](https://platform.sh/contact/).
---

How you structure a project with multiple apps depends on how your code is organized
and what you want to accomplish.
For example, there are various ways you could set up the following multiple apps:

![Diagram of a project containing multiple apps](/images/config-diagrams/multiple-app.png "0.5")

Here are some example use cases and potential ways to organize the project:

| Use case                                                                                | Structure                                                                                      |
|-----------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| Separate basic apps that are worked on together.                                         | [Separate code in one repository](#separate-code-bases-in-one-repository)                      |
| One app depends on code from another app.                                                | [Nested directories](#nested-directories)                                                      |
| You want to keep configuration separately from the code, such as through Git submodules. | [Configuration separate from code](#split-your-code-source-into-multiple-repositories)           |
| You want multiple apps from the same source code.                                        | [Unified app configuration](#unified-app-configuration)                                        |
| You want to control all apps in a single location.                                       | [Unified app configuration](#unified-app-configuration)                                        |

## Separate code bases in one repository

If your project consists of a separate code base for each app,
the most straightforward approach is to put each code base in a separate directory within your repository, and use a [Unified configuration app](#unified-app-configuration).

Each app is defined into `.platform/applications.yaml` configuration file.
The directory `.platform` containing the `applications.yaml` file is at the root directory of the main app.

For example, if you have an API Platform backend with a Symfony API, a Mercure Rocks server and a Gatsby frontend, you could organize your repository like this:

```txt
├── .platform
│   ├── applications.yaml
│   ├── routes.yaml
│   └── services.yaml
├── admin
│   └── ...                 <- API Platform Admin app code
├── api
│   └── ...                 <- Bigfoot app code
├── gatsby
│   └── ...                 <- Gatsby app code
└── mercure
    └── ...                 <- Mercure Rocks app code
```

Note that the `.platform` directory is located at the root, separate from all your apps.
It contains all needed configuration files for routing, services and behavior of each of your app.

Each first level node in this ``applications.yaml`` file defines a single app container,
with its configuration relative to the directory containing the app (``source.root`` definition).
The apps can communicate with each other through [relationships defined in their configuration](./relationships.md).

When you make changes to the code of one of your apps, the build image for your other apps can still be reused.

## Nested directories

When code bases are separate, changes to one app don't necessarily mean that the other apps in the project get rebuilt.
You might have a situation where `main` app depends on `languagetool` app, but `languagetool` doesn't depend on `main`.

In such cases, you can nest the dependency so the parent (`main`) gets rebuilt on changes to it or its children,
but the child (`languagetool`) is only rebuilt on changes to itself.

For example, you might have a Python app (`main`) that runs a script that requires Java code to be up to date.
But the Java app (`languagetool`) doesn't require updating when the Python app (`main`) is updated.
In that case, you can nest the Java app within the Python app:

```txt
├── .platform
│   ├── applications.yaml
│   └── routes.yaml
├── languagetool
│   └── main.java           <- Java app code
└── main.py                 <- Python app code
```

The Python app's code base includes all of the files at the top level (excluding the `.platform` directory)
*and* all of the files within the `languagetool` directory.
The Java app's code base includes only the files within the `languagetool` directory.

In that case, your `applications.yaml` file must contain 2 entries, one for the `main` app and second one for `languagetool` app.

{{< note >}}
  `languagetool` app needs to define an additional [`source.root` setting](/create-apps/app-reference.html#root-directory) as code base is not at the root directory level, but inside `languagetool/` directory.
{{< /note >}}

```yaml
# .platform/applications.yaml
main:
  type: 'python:3.11'
  ...
languagetool:
  type: 'java:17'
  source:
    root: 'languagetool'
  ...
```

## Project structures relying on Git submodules

If you have different teams working on different code with different processes,
you might want each app to have its own repository.
Then you can build them together in another repository using [Git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

In such cases, you can either [split your code source into multiple repositories](#split-your-code-source-into-multiple-repositories)
or keep your [app configurations and code separate](#separate-code-bases-in-one-repository).

### Split your code source into multiple repositories

In this setup, your apps are kept separate from the top application.
Each app has its own [Git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules) directory,
where each app configuration remain in ``.platform/applications.yaml``.
So your [project repository](https://github.com/platformsh-templates/bigfoot-multiapp/tree/submodules-root-app-yaml) might look like this:

```text
├── .platform
│   ├── applications.yaml
│   ├── routes.yaml
│   └── services.yaml
├── @admin      <-- API Platform Admin submodule
├── @api        <-- Bigfoot submodule
├── @gatsby     <-- Gatsby submodule
├── @mercure    <-- Mercure rocks submodule
└── .gitmodules
```

Your `.gitmodules` file would define all the submodules:

```txt {location=".gitmodules"}
[submodule "admin"]
	path = admin
	url = https://github.com/platformsh-templates/bigfoot-multiapp-admin.git
[submodule "api"]
	path = api
	url = https://github.com/platformsh-templates/bigfoot-multiapp-api.git
[submodule "gatsby"]
	path = gatsby
	url = https://github.com/platformsh-templates/bigfoot-multiapp-gatsby.git
[submodule "mercure"]
	path = mercure
	url = https://github.com/platformsh-templates/bigfoot-multiapp-mercure.git
```

{{< note >}}

In this case, and any other case where your app configuration files are kept outside of the app directory,
make sure you [change the source root](#change-the-source-root-of-your-app) for each of your apps.

{{< /note >}}

#### Change the source root of your app

when using [Unified app configuration](#unified-app-configuration) or when your source code is not at the same level as your `.platform.app.yaml` file,
add a new `source.root` key in your settings to define its root directory.

To change the source root of the `admin` app in the [app configuration separate from code](#separate-code-bases-in-one-repository) example project, you could add the following configuration:

```yaml {location=".platform/applications.yaml"}
source:
    root: admin
```

The `source.root` path is relative to the repository root.
In this example, the `admin` app now treats the `admin` directory as its root when building.

If `source.root` isn't specified, it defaults to the same directory as the `.platform.app.yaml` file itself.

## Unified app configuration

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
