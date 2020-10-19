---
title: "How to Deploy TYPO3 on Platform.sh"
sidebarTitle: "Get started"
weight: -110
layout: single
toc: false
description: |
    Create a Platform.sh account, download a few tools, and prepare to deploy TYPO3.
---

TYPO3 is an Open Source Enterprise PHP-based CMS framework. The recommended way to deploy TYPO3 on Platform.sh is by using Composer, the PHP package management suite.

This guide assumes you are using the well-supported Composer flavor of TYPO3. Going through the steps below you will have two options:

1. You already have a [Composer flavored TYPO3](https://github.com/TYPO3/TYPO3.CMS.BaseDistribution) site your are trying to deploy. In this case, you will able to go through each step to make the recommended changes to your repository to prepare it for Platform.sh.
2. You have no code at this point. In this case, Platform.sh maintains a ready-made [TYPO3 template](https://github.com/platformsh-templates/typo3) that you will be able to deploy very quickly. The steps below will then hopefully help to clarify why the modifications have been made to a base TYPO3 project.

{{< note >}}
If you have a TYPO3 site that is not using Composer, there is a useful guide in the TYPO3 documentation for [Migrating a TYPO3 Project to Composer](https://docs.typo3.org/m/typo3/guide-installation/master/en-us/MigrateToComposer/Index.html) you can follow before proceeding.
{{< /note >}}

## Tools

{{< guides/tools >}}

