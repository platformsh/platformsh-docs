---
title: "How to Deploy Quarkus on Platform.sh"
sidebarTitle: "Get started"
weight: -110
layout: single
toc: false
description: |
    Create a Platform.sh account, download a few tools, and prepare to deploy Quarkus.
---

Quarkus is, in its own words, a cloud-native, (Linux) container-first framework for writing Java applications. 

This guide assumes you are using the well-supported Quarkus. Going through the steps below you will have two options:

## Tools

{{< guides/tools >}}

## Sign up for Platform.sh and initialize your project

{{< guides/signup name="Quarkus" template="quarkus" >}}

```bash
$ composer create-project drupal/core-recommended <PROJECT_NAME>
$ cd <PROJECT_NAME>
$ git init
$ git add . && git commit -m "Init Quarkus from upstream."
```

{{< /guides/signup >}}

{{< guide-buttons next="Configure repository" type="first" >}}
