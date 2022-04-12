---
title: Deploy Drupal 9 on Platform.sh
sidebarTitle: Get started
weight: -110
layout: single
description: |
    Create a Platform.sh account, download a few tools, and prepare to deploy Drupal.
---

Drupal is a flexible and extensible PHP-based CMS framework. To deploy Drupal 9 on Platform.sh, the recommended way is to use Composer, the PHP package management suite.

This guide assumes you are using the well-supported Composer flavor of Drupal 9.

{{% guides/starting-point name="Drupal 9" templateRepo="drupal9" composerLink="https://github.com/drupal/recommended-project/tree/9.0.x" %}}

{{< note >}}

This guide is written for Drupal 9, but should apply almost exactly the same for later Drupal 8 releases (8.8 and later).
If you're on an earlier Drupal 8 version, you should upgrade to at least 8.8 before proceeding.

{{< /note >}}

## Tools

{{% guides/tools %}}

## Sign up for Platform.sh and initialize your project

{{% guides/signup name="Drupal 9" template="drupal9" %}}

3. Initialize or clone your Git repository with existing code or create a new Composer-based project from scratch.
   The commands below create a brand new Drupal project using Composer, which you can then modify according to the rest of this guide.

   ```bash
   composer create-project drupal/core-recommended <PROJECT_NAME>
   cd <PROJECT_NAME>
   git init
   git add . && git commit -m "Init Drupal from upstream."
   ```

{{% /guides/signup %}}

{{< guide-buttons next="Configure repository" type="first" >}}
