---
title: Deploy Drupal on {{% vendor/name %}}
sidebarTitle: Get started
weight: -110
layout: single
description: |
    Create a {{% vendor/name %}} account, download a few tools, and prepare to deploy Drupal.
---

Drupal is a flexible and extensible PHP-based CMS framework. To deploy Drupal on {{% vendor/name %}}, the recommended way is to use Composer, the PHP package management suite.

This guide assumes you are using the well-supported Composer flavor of Drupal.

{{% guides/starting-point name="Drupal" templateRepo="drupal10" composerLink="https://github.com/drupal/recommended-project/" initExample=true %}}

{{% guides/requirements %}}

## Initialize a project

{{< guides/initialize name="Drupal" template="drupal" >}}

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
