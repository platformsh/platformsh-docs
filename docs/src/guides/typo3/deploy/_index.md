---
title: "How to Deploy TYPO3 on Platform.sh"
sidebarTitle: "Get started"
weight: -110
layout: single
toc: false
description: |
    Create a Platform.sh account, download a few tools, and prepare to deploy TYPO3.
---

TYPO3 is an Open Source Enterprise PHP-based CMS framework. The recommended way to deploy TYPO3 on Platform.sh is by using Composer, the PHP package management suite. In this guide, it is assumed that you would like to migrate your pre-existing [Composer flavor TYPO3 repository](https://github.com/TYPO3/TYPO3.CMS.BaseDistribution) to Platform.sh, and that that codebase exists on some third-party Git service (GitHub, GitLab, or Bitbucket).

{{< note >}}
If you have a TYPO3 site that is not using Composer, there is a useful guide in the TYPO3 documentation for [Migrating a TYPO3 Project to Composer](https://docs.typo3.org/m/typo3/guide-installation/master/en-us/MigrateToComposer/Index.html) you can follow before proceeding.
{{< /note >}}

Deploying TYPO3 requires the addition of a few files specific to running TYPO3 on Platform.sh and some slight modifications to your existing site. By the end of this guide, you will have integrated your existing repository with Platform.sh, which will configure it to deploy an isolated environment for every future pull request opened on that repository.

## Tools

{{< guides/tools >}}

## Sign up for Platform.sh and initialize your project

{{< guides/signup name="TYPO3" template="typo3" >}}

{{< guide-buttons next="Configure repository" type="first" >}}
