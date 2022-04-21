---
title: "Review"
weight: 5
description: |
  Take a moment to review the getting started steps, and check out additional resources as you learn more about Platform.sh
---

Congrats on completing the first Getting Started guide for Platform.sh - **Let's Git Started**.

Within this section of the documentation ([docs.platform.sh/gettingstarted](/getstarted/_index.md)), there are many more guides that cover additional topics in depth that will help you in your work on the platform.
Take a look at the sidebar and move on to those topics to learn more.

That said, this first guide is the most important. 
It gives you an overview of the most important pieces of DevOps that Platform.sh can help solve:

1. Development environment orchestration
1. Infrastructure provisioning
1. Data inheritance and staging environment requirements

With this knowledge, you can explore the rest of the documentation to continue experimenting with Platform.sh, and deploy more complex applications. 

Here are a few useful pages to explore now you've completed this guide:

**Platform.sh basics**

- [More on project structure](/overview/structure.md)
- [The build-deploy pipeline in detail](/overview/build-deploy.md)
- [Environment configuration](/overview/environments/_index.md)
- [Project administration](/overview/projects/_index.md)
- [Getting support](/overview/get-support.md)

**Configuration: routes, applications, and services**

- [YAML configuration basics](/configuration/yaml.md)
- [Defining routes](/configuration/routes/_index.md)
- [Adding services](/configuration/services/_index.md)
- [Creating applications](/configuration/app/_index.md)
- [Available runtime languages](/languages/_index.md)

## Next topics

If you'd like to continue with these guides, you can find them in the sidebar or in the links below.

### Troubleshoot & customize

**Let's Git started** covers the basics of Platform.sh: configuration, branching, merging, environment variables, and data. 
Once you start thinking about deploying applications more complicated than a "Hello world" example, you'll need a few more tools to do so. 

The [**Troubleshoot and customize**](/getstarted/developing/_index.md) guide includes a few topics that will help you interact with and customize your projects.

* [**Interacting with your projects**](/getstarted/developing/interaction/_index.md)

  If something goes wrong, you'll need to be able to investigate.
  This guide in part covers using the Platform.sh CLI to troubleshoot failed deployments via logs. 
  It also covers the other tool you'll use to manage projects: the management console. 
  At the end, you'll make some basic modifications to projects directly using the Platform.sh API.

* [**Scheduling tasks**]() (Crons and workers)


* [**Multi-app environments**](/getstarted/developing/multi-apps/_index.md)

  **Let's Git started** focused on deploying a single application with a single service to Platform.sh.
  While many production websites work this way - albeit with more complicated codebases - many more rely on a **microservice** or **decoupled architecture** to separate responsibilities across multiple applications.

  On Platform.sh, your repository can act as a **monorepo** of multiple application containers that deploy to the same project _and_ environment alongside each other. 
  This implementation allows you to retrieve custom API and client URLs from the environment (via `PLATFORM_ROUTES`), connect those containers, and then retain that relationship across development environments.

* [**Performance: metrics**]() (when release and API endpoints available)
* [**Performance: Blackfire.io**]() (use Blackfire 101 series text)

### Notifications and fleets

**Let's Git started** covers deploying a single project to Platform.sh.
In production, however, there's a bit more required to truly depend on Platform.sh for your sites. 

* [**Events, hooks, and notifications**](/getstarted/fleets-and-activities/activities/_index.md)

  Despite all of the assurances described in **Let's Git started**, things happen. 
  A feature makes it past QA, or resources get unexpectedly over-consumed during a spike in traffic. 
  Being notified that events and activities are going wrong (or completing successfully) is key in production web development. 

  Aside from providing the Continuous Delivery (CD) component of DevOps, Platform.sh's API also provides a flexible platform for transforming activities on your projects, environments, and containers into notifications you and your team can respond to. 

* [**Teams and organizations**]()

* [**Managing many projects**](/getstarted/fleets-and-activities/activities/_index.md)

  Many businesses do not rely on a single application running smoothly, but many. 
  SaaS products, agencies, and other organizations encounter the same DevOps problems described in **Let's Git started** for every site they manage. 
  Enforcing standards of developer access, sharing common codebases, and scheduling and managing updates across this **Fleet** of applications becomes its own orchestration challenge that will usually requires in-house tooling to control.

  Platform.sh makes deployment deterministic and repeatable for single projects, and fleets of projects alike. 
  It's API can be adapted to initialize, sync, and update thousands of websites with many of the same calls you've already encountered so far.

## Framework guides

If you're looking to take what you've learned to deploy or migrate a specific framework on Platform.sh, there are a number of framework-specific guides available for you.

- [Drupal 9](/guides/drupal9/_index.md)
- [Gatsby](/guides/gatsby/_index.md)
- [Hibernate](/guides/hibernate/_index.md)
- [Ibexa DXP](/guides/ibexa/_index.md)
- [Jakarta](/guides/jakarta/_index.md)
- [Laravel](/guides/laravel/_index.md)
- [Micronaut](/guides/micronaut/_index.md)
- [Quarkus](/guides/quarkus/_index.md)
- [Spring](/guides/spring/_index.md)
- [Strapi](/guides/strapi/_index.md)
- [Symfony](/guides/symfony/_index.md)
- [TYPO3](/guides/typo3/_index.md)
- [WordPress](/guides/wordpress/_index.md)

## Examples

Just like you began with a simple "Hello world" repository to create your first project, Platform.sh maintains a number of framework templates that you can start from.
Find the language you're interested in deploying, select a framework, and click the **Deploy on Platform.sh** button to try one out.

### C#/.NET Core

View the [C#/.NET Core documentation](/languages/dotnet.md).

{{< repolist lang="dotnet" >}}

### Go

View the [Go documentation](/languages/go.md).

{{< repolist lang="golang" >}}

### Java

View the [Java documentation](/languages/java/_index.md).

{{< repolist lang="java" >}}

### Lisp

View the [Lisp documentation](/languages/lisp.md).

{{< repolist lang="lisp" >}}

### Node.js

View the [Node.js documentation](/languages/nodejs/_index.md).

{{< repolist lang="nodejs" >}}

### PHP

View the [PHP documentation](/languages/php/_index.md).

{{< repolist lang="php" >}}

### Python

View the [Python documentation](/languages/python/_index.md).

{{< repolist lang="python" >}}

### Ruby

View the [Ruby documentation](/languages/ruby.md).

{{< repolist lang="ruby" >}}

