---
title: Structure
weight: 2
description: "Learn about how your {{% vendor/name %}} environments are structured and which files control that structure."
---

{{< note version="1" >}}

This page describes how things work on Grid projects.
[{{% names/dedicated-gen-3 %}}](/dedicated-gen-3/_index.md) projects are similar,
but they run on dedicated hosts and each container is replicated three times.

For {{% names/dedicated-gen-2 %}} projects, read about how [{{% names/dedicated-gen-2 %}} projects are structured](/dedicated-gen-2/overview/_index.md).

{{< /note >}}

Each environment you deploy on {{% vendor/name %}} is built as a set of containers.
Each container is an isolated instance with specific resources.

Each environment has 2 to 4 types of containers, all usually configured from your `{{< vendor/configfile "app" >}}` file.

- One [*router*](#router)
- One or more [*app* containers](#apps)
- Zero or more [*service* containers](#services)
- Zero or more [*worker* containers](#workers)


If you have two app containers, two services (a database and a search engine), and a worker,
requests to your environment might look something like this:

![A user request goes to the router, which sends it to either a Node.js app or a Python app. Each app communicates separately with the database and search services and sends responses to the user. The Node.js app triggers actions in a worker, which communicates separately with the database.](/images/config-diagrams/structure-diagram.png)

If you have only one app container, your repository might look like this:

```text
project
├── .git
├── {{< vendor/configdir >}}
│   └── {{< vendor/configfile "app" "strip" >}}
└── <YOUR_APP_FILES>
```

## Router

Each environment always has exactly one router.

This router maps incoming requests to the appropriate app container
and provides basic caching of responses, unless configured otherwise.

The router is configured in a `{{< vendor/configfile "routes" >}}` file.
If you don't include configuration, a single [default route is deployed](/define-routes/_index.md#default-route-definition).

Read more about how to [define routes](/define-routes/_index.md).

## Apps

You always need at least one app container, but you can have more.

App containers run the code you provide via your Git repository.
They handle requests from the outside world and can communicate with other containers within the environment.
Each app container is built from a specific language image with a given version for the language.

To configure your apps, you usually create a single `{{< vendor/configfile "app" >}}` file
and place it in the repository root.

Read more about how to [configure apps](/create-apps/_index.md).

## Services

You don't need any service containers, but you can add them as you like.

Service containers run predefined code for specific purposes, such as a database or search service.
You don't need to add their code yourself, just set up how your apps communicate with them.

Service containers are configured by the `{{< vendor/configfile "services" >}}` file.

Read more about how to [add services](/add-services/_index.md).

## Workers

You don't need any worker containers, but you can add them as you like.

Worker containers are copies of an app containers
that have no access to the outside world and can have a different start command.
They're useful for continually running background processes.

Read more about how to [work with workers](/create-apps/workers.md).
