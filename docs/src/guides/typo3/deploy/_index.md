---
title: "How to Deploy TYPO3 on Platform.sh"
sidebarTitle: "Get started"
weight: -110
layout: single
toc: false
---

TYPO3 is an Open Source Enterprise and PHP-based CMS framework. 

The recommended way to deploy TYPO3 on Platform.sh is by using Composer, the PHP package management suite. 

In this guide, it is assumed that you are using the well-supported Composer flavor of TYPO3. Going through the steps below you will have two options:

1. You already have a [Composer flavored TYPO3](https://github.com/TYPO3/TYPO3.CMS.BaseDistribution) site your are trying to deploy. In this case, you will able to go through each step to make the recommended changes to your repository to prepare it for Platform.sh.  
2. You have no code at this point. In this case, Platform.sh maintains a ready-made [TYPO3 template](https://github.com/platformsh-templates/typo3) that you will be able to deploy very quickly. The steps below will then hopefully help to clarify why the modifications have been made to a base Drupal 9 project. 

## Sign up for Platform.sh

{{< guides/signup name="TYPO3" template="typo3" >}}

## Tools

{{< guides/tools >}}

{{< guide-buttons next="Configure repository" type="first" >}}