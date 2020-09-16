---
title: "Customize TYPO3 for Platform.sh"
sidebarTitle: "Customize"
weight: -90
toc: false
description: |
    Add some helpful dependencies, and modify your TYPO3 site to read from a Platform.sh environment.
---

## Dependencies

## Configuration

{{< github repo="platformsh-templates/typo3" file="config/sites/main/config.yaml" lang="yaml" >}}

## Database configuration

{{< github repo="platformsh-templates/typo3" file="public/typo3conf/AdditionalConfiguration.php" lang="php" >}}

{{< github repo="platformsh-templates/typo3" file="public/typo3conf/PlatformshConfiguration.php" lang="php" >}}

{{< github repo="platformsh-templates/typo3" file="src/SetupConfiguration.yaml" lang="yaml" >}}

{{< github repo="platformsh-templates/typo3" file="src/SetupDatabase.yaml" lang="yaml" >}}


## Application configuration

Replicate steps from `template-builder` applied to the upstream and show in [README.md#customizations](https://github.com/platformsh-templates/drupal9/blob/master/README.md#customizations).

{{< guide-buttons next="Deploy Drupal 9" >}}