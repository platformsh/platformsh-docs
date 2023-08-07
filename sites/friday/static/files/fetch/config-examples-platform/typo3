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
