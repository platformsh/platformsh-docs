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

Second, you will need to add a timeout which will set an HTTP timeout of at least 3 seconds instead of the default several minutes to a new `public/typo3conf/PlatformshConfiguration.php`. You can see this line in context of the full file in the [configuration](#environment) section below.

```php
$GLOBALS['TYPO3_CONF_VARS']['HTTP']['timeout'] = 3;
```

{{< note >}}
The suggested timeout of three seconds above may end up being too short if your TYPO3 instance performs external requests other than to itself as described here. If the instance makes long requests, such as when synchronizing data as a part of a TYPO3 Scheduler task with an external API, it is best instead to place these operations in workers. 
{{< /note >}}

You will still need to enable the `pixelant/pxa-lpeh` extension, which you can do by running the command:

```bash
$ php vendor/bin/typo3 extension:activate pxa_lpeh
```

## TYPO3 CMS's `web-dir`

Platform.sh recommends serving TYPO3 from it's default subdirectory `public`. `public` can be seen already throughout your `.platform.app.yaml` file in `web.locations.root`, `mounts`, and within your `build` and `deploy` hooks. You will need to assign `public` to the `cms.web-dir` attribute in your `composer.json` file, and it's a good idea to `update` dependencies once you have done so:

```bash
$ composer config extra.typo3/cms.web-dir public && composer update --no-scripts
```

## Site

You will have to locate the site configuration file(s), `config.yaml`, in your repository's `config/sites/<SITEID>` subdirectories. For the purposes of this guide, you will need to set the `base` attribute to an environment variable called `PLATFORM_ROUTES_MAIN`. You can also add the definition to your existing `baseVariant` attribute for production if desired. 

{{< github repo="platformsh-templates/typo3" file="config/sites/main/config.yaml" lang="yaml" >}}

You will define this environment variable in the next section, but it's purpose is to retrieve the root domain (since you have not yet registered a domain name on the Platform.sh project, this will be a hashed placeholder domain generated from the environment) from the environment varable `PLATFORM_ROUTES`.

{{< note >}}

The above `base` configuration only includes the production case - that is, running on Platform.sh - or at least exporting a `PLATFORM_ROUTES_MAIN` environment variable to match during local development. Alternatively, you can place the above definition within a `baseVariant` definition for the production environment alongside another development environment `condition` for local. 

```yaml
baseVariants:
  -
    base: '%env(VIRTUAL_HOST)%'
    condition: 'applicationContext == "Development/local"'
  -
    base: '%env(PLATFORM_ROUTES_MAIN)%'
    condition: 'applicationContext == "Production/local"'
```

{{< /note >}}

## Environment

Finally, you can start using the Platform.sh Configuration Reader library to starting reading from the environment from within your application. In a `public/typo3conf/PlatformshConfiguration.php` file, you can use the library to:

- verify the deployment is occuring on a Platform.sh project (`if (!$platformConfig->isValidPlatform())`)
- verify that it is not run during build, when services are not yet available (`if ($platformConfig->inBuild())`)
- set the `PLATFORM_ROUTES_MAIN` environment variable used in `config/sites/main/config.yaml`)
- configure TYPO3's database (`TYPO3_CONF_VARS.DB.Connections.Default`) using credentials from the `database` relationship (`$databaseConfig = $platformConfig->credentials('database')`)
- configure TYPO3's `cacheConfigurations` to use Redis via your `rediscache` relationship
- Configure the HTTP timeout to 3 seconds to avoid the PHP-FPM-related deadlock described above in [Avoiding deadlock with the Local Page Error Handler](#avoiding-deadlock-with-the-local-page-error-handler).

{{< github repo="platformsh-templates/typo3" file="public/typo3conf/PlatformshConfiguration.php" lang="php" >}}

Then include the `require_once()` function within your `public/typo3conf/AdditionalConfiguration.php` file to load the Platform.sh-specific configuration into the site if present.

{{< github repo="platformsh-templates/typo3" file="public/typo3conf/AdditionalConfiguration.php" lang="php" >}}

{{< guide-buttons next="Deploy TYPO3" >}}
