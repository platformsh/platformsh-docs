---
title: "Customize TYPO3 for Platform.sh"
sidebarTitle: "Customize"
weight: -90
toc: false
description: |
    Add some helpful dependencies, and modify your TYPO3 site to read from a Platform.sh environment.
---

Now that your code contains all of the configuration to deploy on Platform.sh, it’s time to make your TYPO3 site itself ready to run on a Platform.sh environment. There are a number of additional steps that are either required or recommended, depending on how well you want to optimize your site.

## Install the Config Reader

{{< guides/config-reader-php >}}

## Avoiding deadlock with the Local Page Error Handler

A default TYPO3 installation has a risk of deadlocks when run on low-worker PHP-FPM configurations. Specifically, TYPO3 handles 403 and 404 error pages by issuing a full HTTP request back to itself with no timeout, which can lead to process starvation. There are two required steps to avoid this problem.

First, you will need to install the [Local Page Error Handler](https://extensions.typo3.org/extension/pxa_lpeh/) extension for TYPO with the command:

```bash
$ composer require pixelant/pxa-lpeh
```

Second, you will need to add a timeout which will set an HTTP timeout of 3 seconds instead of the default several minutes to a new `public/typo3conf/PlatformshConfiguration.php`. You can see this line in context of the full file in the [configuration](#environment) section below.

```php
$GLOBALS['TYPO3_CONF_VARS']['HTTP']['timeout'] = 3;
```

You will still need to enable the `pixelant/pxa-lpeh` extension, which you will be able to do in the [post-install](/guides/typo3/deploy/deploy.md#post-install) steps later in this guide.

## TYPO3 CMS's `web-dir`

Platform.sh recommends serving TYPO3 from it's default subdirectory `public`. `public` can be seen already throughout your `.platform.app.yaml` file in `web.locations.root`, `mounts`, and within your `build` and `deploy` hooks. You will need to assign `public` to the `cms.web-dir` attribute in your `composer.json` file, and it's a good idea to `update` dependencies once you have done so:

```bash
$ composer config extra.typo3/cms.web-dir public && composer update --no-scripts
```

## (Optional) Introductory examples

The TYPO3 template for Platform.sh loads a number of example content pages provided by TYPO3 into the site when dependencies are installed pre-build. Their inclusion is completely optional, but a helpful choice if you are creating a new TYPO3 site from scratch using Composer.

```bash
$ composer require typo3/cms-introduction
```

## Setup

It's likely that you have a setup configuration file (`src/SetupConfiguration.yaml`) already present in your repository which manages your installation during build when running the `typo3 install:setup` command. On Platform.sh, it is recommended that that file  include at least the following commands.

{{< github repo="platformsh-templates/typo3" file="src/SetupConfiguration.yaml" lang="yaml" >}}

## Site

Similarly, you likely have a `config.yaml` file in your repo, althout it may not be in the `config/sites/main` subdirectory as shown above. This file contains settings for the error handling of your site, the languages it will support, and a few others. For the purposes of this guide, you will need to set the `base` attribute to an environment variable called `PLATFORM_ROUTES_MAIN`. 

{{< github repo="platformsh-templates/typo3" file="config/sites/main/config.yaml" lang="yaml" >}}

You will define this environment variable in the next sections, but it's purpose is to retrieve the root domain (since you have not yet registered a domain name on the Platform.sh project, this will be a hashed placeholder domain generated from the environment) from the environment varable `PLATFORM_ROUTES`.

## Database

Next you will need a `src/SetupDatabase.yaml` file, which is used on the first installation of TYPO3 in the  dedploy hook to set up the database and the initial `admin` user.

{{< github repo="platformsh-templates/typo3" file="src/SetupDatabase.yaml" lang="yaml" >}}

## Environment

Finally, you can start using the Platform.sh Configuration Reader library to starting reading from the environment from within your application. In a `public/typo3confg/PlatformshConfiguration.php` file, you can use the library to:

- verify the deployment is occuring on a Platform.sh project (`if (!$platformConfig->isValidPlatform())`)
- verify that it is not run during build, when services are not yet available (`if ($platformConfig->inBuild())`)
- set the `PLATFORM_ROUTES_MAIN` environment variable used in `config/sites/main/config.yaml`)
- configure TYPO3's database (`TYPO3_CONF_VARS.DB.Connections.Default`) using credentials from the `database` relationship (`$databaseConfig = $platformConfig->credentials('database')`)
- configure TYPO3's `cacheConfigurations` to use Redis via your `rediscache` relationship
- Configure the HTTP timeout to 3 seconds to avoid the PHP-FPM-related deadlock described above in [Avoiding deadlock with the Local Page Error Handler](#avoiding-deadlock-with-the-local-page-error-handler).

{{< github repo="platformsh-templates/typo3" file="public/typo3conf/PlatformshConfiguration.php" lang="php" >}}

Then include the `require_once()` function within your `public/typo3conf/AdditionalConfiguration.php` file to load the Platform.sh-specific configuration into the site.

{{< github repo="platformsh-templates/typo3" file="public/typo3conf/AdditionalConfiguration.php" lang="php" >}}

{{< guide-buttons next="Deploy TYPO3" >}}
