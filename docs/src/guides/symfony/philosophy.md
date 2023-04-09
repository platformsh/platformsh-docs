---
title: Philosophy
weight: -200
layout: single
description: |
    Understand the big picture of Symfony on Platform.sh.
---

The best way to host your Symfony projects is through Platform.sh, the **Official Symfony PaaS**.

Symfony provides a [tight integration](./integration) with Platform.sh,
based on conventions to reduce configuration and make developers more productive.

You can think of Platform.sh as being the hosting framework part of Symfony. 
It abstracts your project infrastructure and manages it for you: never install nor
configure services like a Web server, a MySQL database, or a Redis cache again.

Platform.sh is built on one main idea:
your server infrastructure is part of your app,
so it should be version controlled along with your app.

Every branch you push to your Git repository can come with bug fixes,
new features, **and** infrastructure changes.
Everything can then be tested as an independent deployment,
including the application code and all services with a copy of their data
(database entries, search index, user files, etc.).

It really is "What would my site look like if I merged these changes to production?".

The following sections introduce the main concepts
and describe how Symfony projects are deployed on Platform.sh.

## The basics

On Platform.sh, a **project** is linked to a Git repository.
A project is composed of one or more **apps**.
An app is a directory in your Git repository with a specific Platform.sh configuration
and dedicated HTTP endpoints (via the `.platform.app.yaml` file).

Projects are deployed in **environments**.
An environment is a standalone copy of your live app which can be used for testing,
Q&A, implementing new features, fixing bugs, etc.

Every project you deploy on Platform.sh is built as a *virtual cluster* containing a series of containers.
The main branch of your Git repository is always deployed as a production cluster.
Any other branch can be deployed as a production, staging, or development cluster.

There are three types of containers within your cluster,
all configured by files stored alongside your code:

- The [*router*](../../define-routes/_index.md), configured in `.platform/routes.yaml`,
  is a single Nginx process responsible for mapping incoming requests to an app container,
  and to optionally provide HTTP caching

- One or more [*apps*](../../create-apps/_index.md), configured via `.platform.app.yaml` files, holding the code of your project

- Some optional [*services*](../../add-services/_index.md), configured in `.platform/services.yaml`,
  like MySQL/MariaDB, Elasticsearch, Redis, or RabbitMQ.
  They come as optimized pre-built images

## The workflow

Every time you deploy a branch to Platform.sh, the code is *built* and then *deployed* on a new cluster.

The **build** process looks through the configuration files in your repository
and assembles the necessary containers; the Symfony integration comes with a
[default build hook](./integration#symfony-build) that fits most needs.

The **deploy** process makes those containers live, replacing the previous
versions, with no service downtime; the Symfony integration comes with a
[default deploy hook](./integration#symfony-deploy) that fits most needs.

### How your app is built

During the [build step](./integration#symfony-build),
dependencies specified in `.platform.app.yaml` are installed on application containers.

You can also customize the build step by providing a `build` hook composed of one or more shell commands
that help create your production code base.
That could be compiling TypeScript files, running some scripts,
rearranging files on disk, or whatever else you want.

Note that at this point all you have access to is the filesystem;
there are **no services or other databases available**.
Your live website is unaffected.

The default build step for Symfony removes development front controllers,
warms up the cache, compiles your assets, and more.

Once all of that is completed, the filesystem is frozen and a read-only container image is created.
That filesystem is the final build artifact.

### How your app is deployed

Before starting the [deployment](./integration#symfony-deploy) of your app,
Platform.sh pauses all incoming requests and holds them to avoid downtime.

Then, the current containers are stopped and the new ones are started.
Platform.sh then opens networking connections between the various containers,
as specified in the configuration files.
The connection information for each service is available as [environment variables](./environment-variables).

Similarly to the build step, you can define a [deploy hook](./integration.md#hooks) to prepare your app.
Your app has complete access to all services, but the filesystem where your code lives is now read-only.

The default deploy step for Symfony replaces the current cache with the newly warmed-up cache and,
for the web container, runs Doctrine migrations (if any), and more.

Finally, Platform.sh opens the floodgates and lets incoming requests through your newly deployed app.

## Get support

If you are facing an issue with Platform.sh,
submit a [Support ticket](https://console.platform.sh/-/users/~/tickets/open).

## What's next?

To get a feeling of what working with Symfony on Platform.sh entails,
jump to the [Get Started](./get-started) guide.