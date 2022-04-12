---
title: Deploy TYPO3 on Platform.sh
sidebarTitle: "Get started"
weight: -110
layout: single
description: |
    Create a Platform.sh account, download a few tools, and prepare to deploy TYPO3.
---

TYPO3 is an Open Source Enterprise PHP-based CMS framework. The recommended way to deploy TYPO3 on Platform.sh is by using Composer, the PHP package management suite. 

This guide assumes you are using the well-supported Composer flavor of TYPO3.

{{< note >}}

If you have a TYPO3 site that's not using Composer,
there's a useful guide in the TYPO3 documentation for [migrating a TYPO3 project to composer](https://docs.typo3.org/m/typo3/guide-installation/master/en-us/MigrateToComposer/Index.html).

{{< /note >}}

{{% guides/starting-point name="TYPO3" templateRepo="typo3" composerLink="https://github.com/TYPO3/TYPO3.CMS.BaseDistribution" %}}

## Tools

{{% guides/tools %}}

## Sign up for Platform.sh and initialize your project

{{% guides/signup name="TYPO3" template="typo3" %}}

3. Initialize your project:

   ```bash
   composer create-project typo3/cms-base-distribution <PROJECT_NAME> ^10
   cd <PROJECT_NAME>
   git init
   git add . && git commit -m "Init TYPO3 from upstream."
    ```

{{% /guides/signup %}}

{{< guide-buttons next="Configure repository" type="first" >}}
