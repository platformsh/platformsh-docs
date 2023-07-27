---
title: Deploy Drupal 9 on Platform.sh
sidebarTitle: Get started
weight: -110
layout: single
description: |
    Create a Platform.sh account, download a few tools, and prepare to deploy Drupal.
banner:
    title: A note on version
    body: While this guide focuses on Drupal 9, you can also refer to it when using Drupal 10 as differences in settings are minimal. Note that a Platform.sh [Drupal 10 template](https://github.com/platformsh-templates/drupal10) is available.
---

Drupal is a flexible and extensible PHP-based CMS framework. To deploy Drupal 9 on Platform.sh, the recommended way is to use Composer, the PHP package management suite.

This guide assumes you are using the well-supported Composer flavor of Drupal 9.

{{% guides/starting-point name="Drupal 9" templateRepo="drupal9" composerLink="https://github.com/drupal/recommended-project/tree/9.0.x" initExample=true %}}

{{% guides/requirements %}}

## Initialize a project

{{< guides/initialize name="Drupal 9" template="drupal9" >}}

If you don't have code, create a new Drupal project from scratch.
The following commands create a brand new Drupal project using Composer.

```bash
composer create-project drupal/core-recommended <PROJECT_NAME>
cd <PROJECT_NAME>
git init
git add . && git commit -m "Init Drupal from upstream."
```

{{< /guides/initialize >}}

{{< guide-buttons next="Configure repository" type="first" >}}
