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

Going through the steps below you will have two options:

1. You already have a [Quarkus](https://github.com/drupal/recommended-project/tree/9.0.x) site your are trying to deploy. In this case, you will able to go through each step to make the recommended changes to your repository to prepare it for Platform.sh.
2. You have no code at this point. In this case, Platform.sh maintains a ready-made [Quarkus template](https://github.com/platformsh-templates/quarkus) that you will be able to deploy very quickly. The steps below will then hopefully help to clarify why the modifications have been made to a base Quarkus project.

## Tools

{{< guides/tools >}}

## Sign up for Platform.sh and initialize your project

{{< guides/signup name="Quarkus" template="quarkus" >}}

{{< /guides/signup >}}

{{< guide-buttons next="Configure repository" type="first" >}}
