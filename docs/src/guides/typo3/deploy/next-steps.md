---
title: "Additional resources"
sidebarTitle: "Next steps"
weight: -70
description: |
    Upgrading, adding modules, and further development of your site.
---

## Adding extensions

All TYPO3 extensions can be installed and managed using Composer. Install them locally to update and commit changes to your `composer-lock.json` file. The build process will download the correct version on the committed `composer.json` and `composer.lock` files, which should be committed to Git.

```bash
composer require friendsoftypo3/headless
```

## Updating TYPO3 and extensions

Since TYPO3 is fully managed via Composer, you can run `composer update` periodically to get new versions of both TYPO3 and any extensions you have installed via Composer.
Commit the resulting changes to your `composer.lock` file and push again.

The [Composer documentation](https://getcomposer.org/doc/) has more information on options to update individual modules or perform other tasks.

Note that updating modules or core through the TYPO3 backend isn't possible, as the file system is read-only.
All updates should be done through composer to update the lock file, and then pushed to Git.

## Why are there warnings in the install tool?

The TYPO3 install tool doesn't yet fully understand when you are working on a cloud environment and may warn you that some folders aren't writable.

Don't worry, your TYPO3 installation is fully functional.

{{< guide-buttons type="last" >}}