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

This guide assumes you have a [Composer flavored TYPO3](https://github.com/TYPO3/TYPO3.CMS.BaseDistribution) site your are trying to deploy. In this case, you will able to go through each step to make the recommended changes to your repository to prepare it for Platform.sh.

{{< note >}}
If you have a TYPO3 site that is not using Composer, there is a useful guide in the TYPO3 documentation for [Migrating a TYPO3 Project to Composer](https://docs.typo3.org/m/typo3/guide-installation/master/en-us/MigrateToComposer/Index.html) you can follow before proceeding.
{{< /note >}}

{{< note >}}
If you have no TYPO3 site to start from, Platform.sh maintains a ready-made [TYPO3 template](https://github.com/platformsh-templates/typo3) that you will be able to deploy very quickly. You won't need to follow this guide.
{{< /note >}}

## Tools

{{< guides/tools >}}

## Repository integration with Bitbucket, GitHub, or GitLab

Platform.sh allows you to [maintain your code base in a third party repository](/integrations/source/_index.md) such as Bitbucket, GitHub, or GitLab and link it to your Platform.sh project. The remote repository is the canonical, definitive copy of your application code and the Platform.sh project is just a read-only mirror.

Note that when a source integration is enabled, you should not push code directly to the Platform.sh repository. It will get overwritten the next time the integration is triggered.
