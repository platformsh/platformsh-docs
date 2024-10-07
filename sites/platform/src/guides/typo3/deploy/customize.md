---
title: "Customize TYPO3 for {{% vendor/name %}}"
sidebarTitle: "Customize"
weight: -90
description: |
    Add some helpful dependencies, and modify your TYPO3 site to read from a {{% vendor/name %}} environment.
---

Now that your code contains all of the configuration to deploy on {{% vendor/name %}},
it’s time to make your TYPO3 site itself ready to run on a {{% vendor/name %}} environment.
There are a number of additional steps that are either required or recommended,
depending on how well you want to optimize your site.

## Install the Config Reader

{{% guides/config-reader-info lang="php" %}}

## Avoiding deadlock with the Local Page Error Handler

A default TYPO3 installation has a risk of deadlocks when run on low-worker PHP-FPM configurations.
Specifically, TYPO3 handles 403 and 404 error pages by issuing a full HTTP request back to itself with no timeout,
which can lead to process starvation.
There are two required steps to avoid this problem.

First, you need to install the [Local Page Error Handler](https://extensions.typo3.org/extension/pxa_lpeh/) extension for TYPO3 with the command:

```bash
composer require pixelant/pxa-lpeh
```

Second, you need to add a timeout that sets an HTTP timeout of at least 3 seconds instead of the default several minutes to a new `public/typo3conf/PlatformshConfiguration.php`.
You can see this line in context of the full file in the [configuration](#environment) section below.

```php
<?php
$GLOBALS['TYPO3_CONF_VARS']['HTTP']['timeout'] = 3;
```

{{< note >}}
The suggested timeout of three seconds above may end up being too short
if your TYPO3 instance performs external requests other than to itself as described here.
If the instance makes long requests,
such as when synchronizing data as a part of a TYPO3 Scheduler task with an external API,
it's best instead to place these operations in workers.
{{< /note >}}

You still need to enable the `pixelant/pxa-lpeh` extension,
which you can do by running the command:

```bash
php vendor/bin/typo3 extension:activate pxa_lpeh
```

## TYPO3 CMS's `web-dir`

{{% vendor/name %}} recommends serving TYPO3 from its default subdirectory `public`.
`public` can be seen already throughout your `{{< vendor/configfile "app" >}}` file in `web.locations.root`, `mounts`
and within your `build` and `deploy` hooks.
You need to assign `public` to the `cms.web-dir` attribute in your `composer.json` file,
and it's a good idea to `update` dependencies once you have done so:

```bash
composer config extra.typo3/cms.web-dir public && composer update --no-scripts
```

## Site

You have to locate the site configuration files (`config.yaml`) in your repository's `config/sites/<SITEID>` subdirectories.
For the purposes of this guide, you need to set the `base` attribute to an environment variable called `PLATFORM_ROUTES_MAIN`.
You can also add the definition to your existing `baseVariant` attribute for production if desired.

```yaml
# TYPO3 Site Handling configuration YAML.
# 
# See https://docs.typo3.org/m/typo3/reference-coreapi/9.5/en-us/ApiOverview/SiteHandling/Basics.html.
rootPageId: 1

# The base domain used to run the TYPO3 site. Here, the environment variable `PLATFORM_ROUTES_MAIN` set in 
# `public/typo3/conf/PlatformshConfiguration.php` is used. 
base: '%env(PLATFORM_ROUTES_MAIN)%'

# Site's available languages configuration.
# 
# See https://docs.typo3.org/m/typo3/reference-coreapi/9.5/en-us/ApiOverview/SiteHandling/AddLanguages.html#sitehandling-addinglanguages
languages:
    -
        languageId: '0'
        title: English
        navigationTitle: English
        base: '/'
        locale: en_US.UTF8
        iso-639-1: en
        hreflang: en-US
        direction: ltr
        typo3Language: default
        flag: us
        enabled: true
    -
        languageId: '2'
        title: German
        navigationTitle: Deutsch
        base: '/de/'
        locale: de_DE.UTF8
        iso-639-1: de
        hreflang: de-DE
        direction: ltr
        typo3Language: de
        flag: de
        fallbackType: fallback
        fallbacks: '0'
        enabled: true
    -
        languageId: '1'
        title: Dansk
        navigationTitle: Dansk
        base: '/da/'
        locale: da_DK.UTF-8
        iso-639-1: da
        hreflang: da-DK
        direction: ltr
        typo3Language: default
        flag: dk
        fallbackType: fallback
        fallbacks: '0'
        enabled: true

# Configuration for how to handle error codes for the TYPO3 site.
# 
# See https://docs.typo3.org/m/typo3/reference-coreapi/9.5/en-us/ApiOverview/SiteHandling/Basics.html.
errorHandling:
    -
        errorCode: '404'
        errorHandler: Page
        errorContentSource: 't3://page?uid=5'

# Environment-specific `base` configuration.
# 
# See https://docs.typo3.org/m/typo3/reference-coreapi/9.5/en-us/ApiOverview/SiteHandling/BaseVariants.html.
baseVariants: {  }

# Adding static routes for the TYPO3 site. 
# 
# See https://docs.typo3.org/m/typo3/reference-coreapi/9.5/en-us/ApiOverview/SiteHandling/StaticRoutes.html#sitehandling-staticroutes.
routes:
    -
        route: robots.txt
        type: staticText
        content: "User-agent: *\r\nDisallow: /typo3/"
```

You define this environment variable in the next section,
but its purpose is to retrieve the root domain
(since you haven't yet registered a domain name on the {{% vendor/name %}} project,
this is a hashed placeholder domain generated from the environment)
from the environment variable `PLATFORM_ROUTES`.

{{< note >}}

The above `base` configuration only includes the production case (running on {{% vendor/name %}})
or at least exporting a `PLATFORM_ROUTES_MAIN` environment variable to match during local development.
Alternatively, you can place the above definition within a `baseVariant` definition for the production environment
alongside another development environment `condition` for local.

```yaml
baseVariants:
  -
    base: '%env(VIRTUAL_HOST)%'
    condition: 'applicationContext == "Development/local"'
  -
    base: '%env(PLATFORM_ROUTES_MAIN)%'
    condition: 'applicationContext == "Production"'
```

{{< /note >}}

## Environment

Finally, you can start using the {{% vendor/name %}} Configuration Reader library
to starting reading from the environment from within your application.
In a `public/typo3conf/PlatformshConfiguration.php` file, you can use the library to:

- Verify the deployment is occurring on a {{% vendor/name %}} project (`if (!$platformConfig->isValidPlatform())`)
- Verify that it's not running during build,
  when services aren't yet available (`if ($platformConfig->inBuild())`)
- Set the `PLATFORM_ROUTES_MAIN` environment variable used in `config/sites/main/config.yaml`)
- Configure TYPO3's database (`TYPO3_CONF_VARS.DB.Connections.Default`) using credentials from the `database` relationship
  (`$databaseConfig = $platformConfig->credentials('database')`)
- Configure TYPO3's `cacheConfigurations` to use Redis via your `rediscache` relationship
- Configure the HTTP timeout to 3 seconds
  to avoid the PHP-FPM-related [deadlock described above](#avoiding-deadlock-with-the-local-page-error-handler).

```php
<?php

/**
 * Platform.sh-specific configuration for TYPO3.
 *
 * You may edit this file as desired, but connection configuration
 * should be based on Platform.sh environment variables.
 */

declare(strict_types=1);

use Platformsh\ConfigReader\Config;

// Leverages the Platform.sh Configuration Reader library for PHP.
// 
// See https://github.com/platformsh/config-reader-php.
$platformConfig = new Config();

// Ensures script does not run if not on Platform.sh.
if (!$platformConfig->isValidPlatform()) {
    return;
}

// Ensures script does not run during builds, when relationships
// are not available.
if ($platformConfig->inBuild()) {
    return;
}

// Workaround to set the proper env variable for the main route (found in config/sites/main/config.yaml)
// Relies on the `id: "main"` configuration set in `.platform/routes.yaml`.
putenv('PLATFORM_ROUTES_MAIN=' . $platformConfig->getRoute('main')['url']);

// Configure the database for `doctrine-dbal` for TYPO3 based on the Platform.sh relationships. 
// 
// See https://docs.typo3.org/m/typo3/reference-coreapi/9.5/en-us/ApiOverview/Database/Configuration/Index.html.
// 
// These lines depend on the database relationship being named `database`. If updating the name to 
// something else below, be sure to update `.platform.app.yaml` to match.
if ($platformConfig->hasRelationship('database')) {
    $databaseConfig = $platformConfig->credentials('database');
    $GLOBALS['TYPO3_CONF_VARS']['DB']['Connections']['Default']['driver'] = 'mysqli';
    $GLOBALS['TYPO3_CONF_VARS']['DB']['Connections']['Default']['host'] = $databaseConfig['host'];
    $GLOBALS['TYPO3_CONF_VARS']['DB']['Connections']['Default']['port'] = $databaseConfig['port'];
    $GLOBALS['TYPO3_CONF_VARS']['DB']['Connections']['Default']['dbname'] = $databaseConfig['path'];
    $GLOBALS['TYPO3_CONF_VARS']['DB']['Connections']['Default']['user'] = $databaseConfig['username'];
    $GLOBALS['TYPO3_CONF_VARS']['DB']['Connections']['Default']['password'] = $databaseConfig['password'];
}

// Configure Redis as the cache backend if available. These lines depend on the Redis relationship
// being named `rediscache`. If updating the name to something else below, be sure to update `.platform.app.yaml` to match.
if ($platformConfig->hasRelationship('rediscache')) {
    $redisConfig = $platformConfig->credentials('rediscache');
    $redisHost = $redisConfig['host'];
    $redisPort = $redisConfig['port'];
    $list = [
        'pages' => 3600 * 24 * 7,
        'pagesection' => 3600 * 24 * 7,
        'rootline' => 3600 * 24 * 7,
        'hash' => 3600 * 24 * 7,
        'extbase' => 3600 * 24 * 7,
    ];
    $counter = 1;
    foreach ($list as $key => $lifetime) {
        $GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations'][$key]['backend'] = \TYPO3\CMS\Core\Cache\Backend\RedisBackend::class;
        $GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations'][$key]['options'] = [
            'database' => $counter++,
            'hostname' => $redisHost,
            'port' => $redisPort,
            'defaultLifetime' => $lifetime
        ];
    }
}

// Ensure that HTTP requests have a timeout set, to avoid sites locking up due to slow
// outgoing HTTP requests.
$GLOBALS['TYPO3_CONF_VARS']['HTTP']['timeout'] = 3;

// Add additional Platform.sh-specific configuration here, such as a search backend.
```

Then include the `require_once()` function within your `public/typo3conf/AdditionalConfiguration.php` file to load the {{% vendor/name %}}-specific configuration into the site if present.

```php
<?php

/**
 * Additional configuration file.
 *
 * Place configuration here you want to be shared by {{% vendor/name %}} environments and local development.
 *
 * {{% vendor/name %}}-specific configuration should be added to PlatformshConfiguration.php.
 * Environment-specific configuration should be added to LocalConfiguration.php as normal.
 */

// Include the {{% vendor/name %}}-specific configuration.
// This file will no-op on its own if not on {{% vendor/name %}}.
$platformshFile = __DIR__ . '/PlatformshConfiguration.php';
if (file_exists($platformshFile)) {
    require_once($platformshFile);
}
```

{{< guide-buttons previous="Back" next="Deploy TYPO3" >}}
