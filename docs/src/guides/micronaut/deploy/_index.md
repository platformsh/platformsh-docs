---
title: "How to Deploy Micronaut on Platform.sh"
sidebarTitle: "Get started"
weight: -110
layout: single
toc: false
description: |
    Create a Platform.sh account, download a few tools, and prepare to deploy Micronaut.
---

[Micronaut](https://micronaut.io/) is an open-source, JVM-based framework for building full-stack, modular, easily testable microservice and serverless applications.

Unlike reflection-based IoC frameworks that load and cache reflection data for every single field, method, and constructor in your code, with Micronaut, your application startup time and memory consumption are not bound to the size of your codebase.

Micronaut's cloud support is built right in, including support for common discovery services, distributed tracing tools, and cloud runtimes.

Going through the steps below you will have two options:

1. You already have a [Micronaut](https://micronaut.io/) site your are trying to deploy. In this case, you will able to go through each step to make the recommended changes to your repository to prepare it for Platform.sh.
2. You have no code at this point. In this case, Platform.sh maintains a ready-made [Micronaut template](https://micronaut.io/launch/) that you will be able to deploy very quickly. The steps below will then hopefully help to clarify why the modifications have been made to a base Micronaut project.

## Tools

{{< guides/tools >}}

## Sign up for Platform.sh and initialize your project

{{< guides/signup name="Micronaut" template="micronaut" >}}

{{< /guides/signup >}}

{{< guide-buttons next="Configure repository" type="first" >}}
