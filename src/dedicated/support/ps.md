# Differences from Platform.sh Professional

When using Platform.sh Enterprise, a few configuration options and tools function differently from Platform.sh Professional, aka the Development Environment.

## PHP

Platform.sh Enterprise comes with `pdo`, `apcu`, `curl`, `gd`, `imagick`, `ldap`, `mcrypt`, `mysqli`, `redis`, `soap`, and `opcache` extensions enabled by default.

In addition, we can enable `enchant`, `gearman`, `geoip`, `gmp`, `http`, `pgsql`, `pinba`, `pspell`, `recode`, `tidy`, `xdebug`, `oci8` (PHP5.6 only), or any extension with a pre-existing package in the Debian Apt repository if desired.  Please request such extensions via a ticket.

Custom php.ini files are not supported on Platform.sh Enterprise. However, all php options that can be changed at runtime are still available. For example the memory limit can be changed using `ini_set('memory_limit','1024M');`

PHP options that can we can change via support ticket include: `max_execution_time`, `max_input_time`, `max_input_vars`, `memory_limit`, `post_max_size`, `request_order`, `upload_max_filesize`.

### XDebug

Platform.sh runs a second PHP-FPM process on all Enterprise clusters that has [Xdebug](https://xdebug.org/) enabled, but is only used if a request includes the appropriate Xdebug header.  That means it's safe to have XDebug "always on", as it will be ignored on most requests.

To obtain the key you will need to file a ticket to have our support team provide it for you.  Staging and Production have separate keys.  Set that key in the Xdebug helper for your browser, and then whenever you have Xdebug enabled the request will use the alternate development PHP-FPM process with Xdebug.

## Cron tasks may be interrupted by deploys

On Platform.sh Professional a running cron task will block a deployment until it is complete.  On Platform.sh Enterprise, however, a deploy will terminate a running cron task.

Specifically, when a deploy to either Production or Staging begins any active cron tasks are send a SIGTERM message so that they can terminate gracefully if needed.  If they are still running 2 seconds later a SIGKILL message will be sent to forceably terminate the process.

For that reason, it's best to ensure your cron tasks can receive a SIGTERM message and terminate gracefully.

## Configuration & change management

Some configuration parameters for Enterprise clusters cannot be managed via the YAML configuration files, and for those parameters you will need to open a support ticket to have the change applied.  Further, the `.platform/routes.yaml` and `.platform/services.yaml` files do not automatically apply.  Those will apply on the development environments but not on the staging and production instances.  Any existing service upgrades or new service additions to staging and production will require a support ticket.

It is possible to run different configurations for some (but not all) options between staging and production, such as cron tasks.  By default we will make configuration changes to both instances unless you request otherwise.

Specifically:

* Cron commands
* Worker instances
* Service versions and configuration (everything in `.platform/services.yaml`)
* Route, domain, and redirect configuration (everything in `.platform/routes.yaml`)
* Application container version
* Additional PHP extensions
* Web server configuration (the web.locations section of `.platform.app.yaml`)

### Cron

Cron tasks may run up to once per minute.  (They are limited to once every 5 minutes on Platform.sh Professional.)

Cron tasks are always interpreted in UTC time.

## Logs

Logs are available on the Enterprise Cluster at a different path than on Platform.sh Professional.  Specifically, the can be found in:

```
/var/log/platform/<application-name>/
```

This folder contains the application, cron, error and deployment logs.

