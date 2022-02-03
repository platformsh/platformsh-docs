---
title: "2016 Changelog"
sidebarTitle: "2016"
description: |
  Look here for all the most recent additions to Platform.sh.
---

## December
  * Support async PHP:
    Deploy applications like ReactPHP and Amp which allow PHP to run as a single-process asynchronous process.
    Read more on our [blog post](https://platform.sh/2016/12/php-71).
  * Pthreads: Multithreaded PHP:
    Our PHP 7.1 containers are running PHP 7.1 ZTS, and include the Pthreads extension.
    Read more on our [blog post](https://platform.sh/2016/12/php-71/).
  * PHP 7.1: Service is [documented here](/languages/php/_index.md).
  * Support .environment files:
    This file will get sourced as a bash script by the system when a container boots up, as well as on all SSH logins.
    Feature is [documented here](/development/variables.md#shell-variables).
  * Support web.commands.start for PHP:
    That option wasn't available for PHP as PHP only has one applicable application runner, PHP-FPM.
    It is now available for PHP.  Read more on our [blog post](https://platform.sh/2016/12/app-updates-php/).
---

## November
  * Customizable build flavor:
    Added a `none` build flavor which will not run any specific command during the build process. 
    Use it if your application requires a custom build process which can be defined in your build hook.
    Read more in our [blog post](https://platform.sh/2016/11/fully-customizable-build-flavors/).
---

## October
  * PostgreSQL 9.6: Service is [documented here](/configuration/services/postgresql.md).
  * PostgreSQL extensions: Read more in our [blog post](https://platform.sh/blog/the-new-and-newer-postgresql/).
  * Node.js 6.8: Language is [documented here](/languages/nodejs/_index.md).
---

## September
  * Python 2.7 & 3.5: Language is [documented here](/languages/python.md).
  * Ruby 2.3: Language is [documented here](/languages/ruby.md).
---

## August
  * Support GitFlow: Read more in our [blog post](https://platform.sh/2016/08/gitflow-is-now-supported/).
---

## July
  * Block Httpoxy security vulnerability: We bypass the [Httpoxy](https://httpoxy.org/) security vulnerability by blocking the Proxy header from incoming HTTP headers. Read more in our [blog post](https://platform.sh/2016/07/httpoxy/).
  * Remove default configuration files:
    We are removing the default configuration files that were previously used if your project didn't include one.
    You now need to include configuration files to deploy your applications on Platform.sh.
    Read more in our [blog post](https://platform.sh/2016/07/no-more-default-configuration-files/).
---

## June
  * June update is summarized in our [blog post](https://platform.sh/2016/06/new-features-june/).
  * New PLATFORM_PROJECT_ENTROPY variable: New variable which has a random value, stable throughout the project's life. It can be used for Drupal hash salt for example (in our [Drupal 8 example](https://github.com/platformsh-templates/drupal8)). It is [documented here](/development/variables.md#platformsh-variables)
  * Extend PLATFORM_RELATIONSHIPS variable: Expose the hostname and IP address of each service in the `PLATFORM_RELATIONSHIPS` environment variable.
  * Services updates: Update MongoDB client to 3.2.7, Node.js to 4.4.5, Blackfire plugin to 1.10.6, Nginx to 1.11.1.
---

## May
  * May update is summarized in our [blog post](https://platform.sh/2016/05/new-features-may/).
  * Pre-warms Composer cache before executing Composer: The `composer` build flavor now pre-warms the Composer cache before executing Composer.
  * New image processing packages (advancecomp, jpegoptim, libjpeg-turbo-progs, optipng, pngcrush): Various image processing packages were added: advancecomp, jpegoptim, libjpeg-turbo-progs, optipng, pngcrush.
  * Security updates: Including imagetragick, glibc issue, various Java, OpenSSL and OpenSSH issues, along with some Git CLI vulnerabilities.
---

## April
  * White label capabilities (Magento Enterprise Cloud Edition):
    Support for Platform.sh white label offering.
    First launch at [Magento Imagine 2016](http://imagine.magento.com/) in Las Vegas of [Magento Enterprise Cloud Edition](https://magento.com/products/enterprise-cloud-edition).
---

## March
  * CloudWatt deployment: Platform.sh is now available on Cloudwatt Orange Business Services hosted infrastructure.
    Read more in our [blog post](https://platform.sh/2016/03/platform-available-on-cloudwatt-by-orange/).
---

* **January 2016**
  * Redis 3.0: Service is [documented here](/configuration/services/redis.md).
---