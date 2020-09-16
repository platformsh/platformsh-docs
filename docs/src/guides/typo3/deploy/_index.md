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

Deploying TYPO3 requires the addition of a few files specific to running TYPO3 on Platform.sh and some slight modifications to your existing site. By the end of this guide, you will have integrated your existing repository with Platform.sh, which will configure it to deploy an isolated environment for every future pull request opened on that repository. 

You will do so in the following steps:

{{< guides/contents >}}

{{< note >}}
The steps of this guide follow TYPO3 best practices as included in the maintained [TYPO3 template on GitHub](https://github.com/platformsh-templates/typo3). That template is based on a set of Platform.sh-specific customizations applied to an upstream [Composer-based TYPO3 CMS Base Distribution](https://github.com/TYPO3/TYPO3.CMS.BaseDistribution). That means if you don't already have a TYPO3 codebase to migrate, you'll have two options for going through this guide.

First, you can deploy the template itself straight to Platform.sh. You can visit the [template repository](https://github.com/platformsh-templates/typo3) and click the "Deploy on Platform.sh" button within the README, which will take you through to creating a Platform.sh account and actually deploying TYPO3 in just a few minutes. After which, you'll be able to follow along through this guide and understand why it's configured the way it is.

Second, since Platform.sh recommends Composer for TYPO3, you can also create a TYPO3 project from scratch very quickly with the below commands, making the recommended modifications as you go:

```bash
$ composer create-project typo3/cms-base-distribution <PROJECT_NAME> ^10


$ cd <PROJECT_NAME>
$ composer config extra.typo3/cms.web-dir public && composer update --no-scripts && composer require typo3/cms-introduction platformsh/config-reader pixelant/pxa-lpeh
```

Since this guide assumes you are migrating a TYPO3 repository exists hosted already on a third-party Git service, you will want to push your new local TYPO3 project to a repository on GitHub, GitLab, or Bitbucket before proceeding.

{{< /note >}}

## Sign up for Platform.sh

{{< guides/signup name="TYPO3" template="typo3" >}}

## Tools

{{< guides/tools >}}

{{< guide-buttons next="Configure repository" type="first" >}}