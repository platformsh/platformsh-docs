---
title: "How to Deploy Drupal 9 on Platform.sh"
sidebarTitle: "Get started"
weight: -110
layout: single
toc: false
description: |
    Create a Platform.sh account, download a few tools, and prepare to deploy Drupal.
---

Drupal is a flexible and extensible PHP-based CMS framework. To deploy Drupal 9 on Platform.sh, the recommended way is to use Composer, the PHP package management suite.

This guide assumes you are using the well-supported Composer flavor of Drupal 9. Going through the steps below you will have two options:

1. You already have a [Composer flavored Drupal 9](https://github.com/drupal/recommended-project/tree/9.0.x) site your are trying to deploy. In this case, you will able to go through each step to make the recommended changes to your repository to prepare it for Platform.sh.
2. You have no code at this point. In this case, Platform.sh maintains a ready-made [Drupal 9 template](https://github.com/platformsh-templates/drupal9) that you will be able to deploy very quickly. The steps below will then hopefully help to clarify why the modifications have been made to a base Drupal 9 project.

{{< note >}}
This guide is written for Drupal 9, but should apply almost exactly the same for later Drupal 8 releases (8.8 and later).  If you're on an earlier Drupal 8 version, we strongly encourage you to upgrade to at least 8.8 before proceeding.
{{< /note >}}

## Tools

{{< guides/tools >}}

## Sign up for Platform.sh and initialize your project

{{< guides/signup name="Drupal 9" template="drupal9" >}}

Then initialize or clone your Git repository with existing code, or create a new Composer-based project from scratch.  The commands below will create a brand new Drupal project using Composer, which you can then modify according to the rest of this guide.

```bash
$ composer create-project drupal/core-recommended <PROJECT_NAME>
$ cd <PROJECT_NAME>
$ git init
$ git add . && git commit -m "Init Drupal from upstream."
```

{{< /guides/signup >}}

{{< guide-buttons next="Configure repository" type="first" >}}
