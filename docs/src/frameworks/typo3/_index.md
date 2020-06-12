---
title: "TYPO3 - Getting started"
weight: 8
sidebarTitle: "TYPO3"
layout: single
toc: false
---

The supported way to run TYPO3 on Platform.sh is through [Composer](https://getcomposer.org/download/).  If you do not already have it installed then you should do so before proceeding.

## Avoiding deadlock

A default TYPO3 installation has a risk of deadlocks when run on low-worker PHP-FPM configurations.  Specifically, TYPO3 handles 403 and 404 error pages by issuing a full HTTP request back to itself with no timeout, which can lead to process starvation.  There are two required steps to avoid this problem:

1. Add the line

    ```php
    $GLOBALS['TYPO3_CONF_VARS']['HTTP']['timeout'] = 3;
    ```

to your `typo3config/AdditionalConfiguration.php` file, which will set an HTTP timeout of 3 seconds instead of the default several minutes.  (You may select a different number, but keep it under 10 seconds.)

2. Install and enable the [Local Page Error Handler](https://extensions.typo3.org/extension/pxa_lpeh/) plugin for TYPO3.  The easiest way to do so is through composer:

    ```bash
    composer require pixelant/pxa-lpeh
    ```

that will provide a non-loopback way to handle error pages which avoids this race condition entirely.

Both of these steps are already set in the [Platform.sh TYPO3 template](https://github.com/platformsh-templates/typo3), although you will need to enable the plugin yourself post-install.

## Configure your app

The ideal `.platform.app.yaml` file will vary from project to project, and you are free to customize yours as needed.  A recommended baseline TYPO3 configuration is listed below, and can also be found in our [TYPO3 template project](https://github.com/platformsh-templates/typo3).

{{< readFile file="static/files/fetch/appyaml/typo3" highlight="yaml" >}}
