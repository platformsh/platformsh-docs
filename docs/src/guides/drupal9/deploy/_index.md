---
title: "How to Deploy Drupal 9 on Platform.sh"
sidebarTitle: "Get started"
weight: -110
layout: single
toc: false
---

Drupal is a flexible and extensible PHP-based CMS framework. To deploy Drupal 9 on Platform.sh, the recommended way is to use Composer, the PHP package management suite. 

In this guide, it is assumed that you are using the well-supported Composer flavor of Drupal 9. Going through the steps below you will have two options:

1. You already have a [Composer flavored Drupal 9](https://github.com/drupal/recommended-project/tree/9.0.x) site your are trying to deploy. In this case, you will able to go through each step to make the recommended changes to your repository to prepare it for Platform.sh.  
2. You have no code at this point. In this case, Platform.sh maintains a ready-made [Drupal 9 template](https://github.com/platformsh-templates/drupal9) that you will be able to deploy very quickly. The steps below will then hopefully help to clarify why the modifications have been made to a base Drupal 9 project. 

## Sign up for Platform.sh

{{< guides/signup name="Drupal 9" template="drupal9" >}}

## Tools

{{< guides/tools >}}

{{< guide-buttons next="Configure repository" type="first" >}}