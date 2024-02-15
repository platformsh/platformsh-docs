---
title: "What is {{% vendor/name %}}?"
weight: -220
description: "Find out which problem {{% vendor/name %}} is trying to solve."
layout: single
---

{{% vendor/name %}} is a Platform-as-a-Service built especially for continuous deployment.
It allows you to host web applications on the cloud while making your development and testing workflows more productive.

If you're new to {{% vendor/name %}}, the [Philosophy](/learn/overview/philosophy.md), [Structure](/learn/overview/structure.md),
and [Build and Deploy](/learn/overview/build-deploy.md) pages cover all the basics to start on the right track.

The main requirement of {{% vendor/name %}} is that you use Git to manage your application code.
If you have a single-app project, you can configure it from a single `{{< vendor/configfile "app" >}}` file,
usually located at the root of your app folder in your Git repository.
[Multi-app projects](/create-apps/multi-app/_index.md) can be set up in various ways.

{{% vendor/name %}} is built on Debian, supports many different programming [languages](/languages.md) and environments,
and features recommended optimizations for several [featured frameworks](/get-started/_index.md).

Finally, you can also get tips for setting up your own [development workflow](/development/_index.md)
and [administrating](/administration/_index.md) your {{% vendor/name %}} account.

## Git Driven Infrastructure

As a Platform as a Service, or PaaS, {{% vendor/name %}} automatically manages everything your application needs to run.
That means you can, and should, view your infrastructure needs as part of your application and address them under version control.

### Infrastructure as code

{{% vendor/name %}} covers not only all of your hosting needs but also most of your DevOps needs. It is a single tool that covers the application life-cycle from development to production and scaling.

You only need to write your code, including a single or a few YAML files that specify your desired infrastructure, commit it to Git, and push.
You don't need to set up anything manually. The web server is already set up and configured, as is any database, search engine, or cache that you specify.

Every branch you push can be made a fully independent environment&mdash;complete with your application code, a copy of your database, a copy of your search index, a copy of your user files, everything.
Its automatically generated URL can be sent to stakeholders or automated CI systems.
It really is "what would my site look like if I merged this to production?" every time.

You can use these concepts to replicate a traditional development/staging/production workflow, or even to give every feature its own effective staging environment before merging to production (empowering you to use git-flow like methodologies even better). You could also have an intermediary integration branch for several other branches.

{{% vendor/name %}} respects the structure of branches. It's entirely up to you.

### Full stack management

Managing your full stack on {{% vendor/name %}} gives you the following unique features:

1. **Unified Environment:** All of your [services](/add-services/_index.md) (MySQL, Elasticsearch, MongoDB, etc.) are managed inside the cluster and included in the price, with no external single-points-of-failure. When you [back up an environment](/environments/backup.md), you get a fully consistent snapshot of your whole application.
2. **Multi-Services & Multi-App:** You can deploy [multiple applications](/create-apps/multi-app/_index.md) (for example, in a microservice-based architecture), using multiple data backends (MySQL, PostgreSQL, Redis, etc.) written in multiple frameworks (Drupal + NodeJS + Flask, for example) in multiple languages, all in the same cluster.
3. **Full Cluster Cloning Technology:** The full production cluster can be cloned in under a minute&mdash;including all of its data&mdash;to create on-the-fly, ephemeral [preview environments](/glossary/_index.md#preview-environment) that are a byte-level copy of production.
4. **Fail-Proof Deployments:** Every time you test a new feature, you also test the deployment process.
5. **Continuous Deployment from the Start:** Everything is build-oriented, with a consistent, repeatable build process, simplifying the process of keeping your application up-to-date and secure.
