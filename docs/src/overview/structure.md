---
title: Structure
weight: 1
description: Learn about how your Platform.sh environments are structured and which files control that structure.
---

{{< note >}}

This page describes how things work on Grid projects.
[Dedicated Gen 3](../dedicated-gen-3/overview.md) projects are similar,
but they run on dedicated virtual machines and each container is replicated three times.

For Dedicated projects, read about how [Dedicated projects are structured](../dedicated/overview/_index.md)

{{< /note >}}

Each environment you deploy on Platform.sh is built as a set of containers.
Each container is an isolated instance with specific resources.

Each environment has 2 to 4 types of containers:

* One [*router*](#router) (configured in a `.platform/routes.yaml` file)
* One or more [*app* containers](#apps) (configured in `.platform.app.yaml` files)
* Zero or more [*service* containers](#services) (configured in a `.platform/services.yaml` file)
* Zero or more [*worker* containers](#workers) (configured in the files for apps)

If you have two app containers, two services (a database and a search engine), and a worker,
requests to your environment might look something like this:

![A user request goes to the router, which sends it to either a Node.js app or a Python app. Each app communicates separately with the database and search services and sends responses to the user. The Node.js app triggers actions in a worker, which communicates separately with the database.](/images/config-diagrams/structure-diagram.png)

If you have only one app container, your repository might look like this:

```text
project
├── .git
├── .platform
│   ├── routes.yaml
│   └── services.yaml
├── .platform.app.yaml
└── <YOUR_APP_FILES>
```

## Router

Each environment always has exactly one router.

This router maps incoming requests to the appropriate app container
and provides basic caching of responses, unless configured otherwise.

The router is configured in a `.platform/routes.yaml` file.
If you don't include configuration, a single [default route is deployed](../define-routes/_index.md#default-route-definition).

Read more about how to [define routes](../define-routes/_index.md).

## Apps

You always need at least one app container, but you can have more.

App containers run the code you provide via your Git repository.
They handle requests from the outside world and can communicate with other containers within the environment.
Each app container is built from a specific language image with a given version for the language.

To configure your apps, you usually create one `.platform.app.yaml` file for each app container.
A basic app generally has only one such file placed in the repository root.

Read more about how to [configure apps](../create-apps/_index.md).

## Services

You don't need any service containers, but you can add them as you like.

Service containers run predefined code for specific purposes, such as a database or search service.
You don't need to add their code yourself, just set up how your apps communicate with them.

Service containers are configured by the `.platform/services.yaml` file.

Read more about how to [add services](../add-services/_index.md).

## Workers

You don't need any worker containers, but you can add them as you like.

Worker containers are copies of an app containers
that have no access to the outside world and can have a different start command.
They're useful for continually running background processes.

Read more about how to [work with workers](../create-apps/workers.md).
