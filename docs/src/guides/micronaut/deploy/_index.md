---
title: Deploy Micronaut on Platform.sh
sidebarTitle: Get started
weight: -110
layout: single
description: |
    Create a Platform.sh account, download a few tools, and prepare to deploy Micronaut.
---

[Micronaut](https://micronaut.io/) is an open-source, JVM-based framework for building full-stack, modular, testable microservice and serverless applications.

Unlike reflection-based IoC frameworks that load and cache reflection data for every single field, method, and constructor in your code, with Micronaut, your application startup time and memory consumption aren't bound to the size of your codebase.

Micronaut's cloud support is built right in, including support for common discovery services, distributed tracing tools, and cloud runtimes.

{{% guides/starting-point name="Micronaut" templateRepo=micronaut %}}

## Tools

{{% guides/tools %}}

## Sign up for Platform.sh and initialize your project

{{% guides/signup name="Micronaut" template="micronaut" /%}}

{{< guide-buttons next="Configure repository" type="first" >}}
