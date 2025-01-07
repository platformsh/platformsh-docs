---
title: PHP
weight: 15
description: All you need to know about configuring a new PHP project with {{% vendor/name %}}
---

When dealing with PHP stacks, the information below may help customize your configuration.
These sections provide PHP-specific configuration details, but you can also refer to the common {{% vendor/name %}} documentation:

- [Configuring applications](/create-apps)
- [Setting up managed services](/add-services)
- [Handling requests](/define-routes)

## Build flavors

By default, {{% vendor/name %}} makes assumptions about how you want to build your application. 
Namely, that you are managing your dependencies with Composer, and that the very first thing you'd like to run is a particular and common production flavor of `composer install`.

This is called a build `flavor`, but its assumption may prove inappropriate for your application and cause your builds to fail.
Therefore, you can [disable this feature](/languages/php#dependencies).

## Authenticated Composer

Packagist is the primary Composer repository for public PHP packages. But you can also have Composer download PHP packages from a private, third-party Composer repository. To make sure Composer has the necessary credentials to do so, follow the instructions on the [Authenticated Composer documentation](/languages/php/composer-auth).

## PHP settings

{{% vendor/name %}} provides additional configuration possibilities to control:

- [PHP-FPM runtime configuration](/create-apps/app-reference/single-runtime-image#runtime)
- [PHP settings](/languages/php#php-settings)

## Enabling/disabling extensions

PHP has a number of extensions developed by members of the community.
Some of these extensions need to be enabled, while others are enabled by default and must be disabled if desirable. 

See which [PHP extensions](/languages/php/extensions) are available for your version of PHP.

## Web servers

While PHP-FPM is the default behavior, {{% vendor/name %}} provides some support for different web servers by modifying the `web.commands.start` property:

- [Alternate start commands](/languages/php#alternate-start-commands)
- [Swoole](/languages/php/swoole)

## Frameworks

The {{% vendor/name %}} documentation includes a wide array of community resources to help with framework-specific configuration:

- [Laravel](/get-started/stacks/laravel)
- [Symfony](/get-started/stacks/symfony)

## Get support

While there are virtually no restrictions to you deploying any kind of application on {{% vendor/name %}}, configuration may still be unclear at this point.

Not to worry! The {{% vendor/name %}} community is here to help. 
Come and say hello, share your work, ask for help, and peek in on what others are working on.

Welcome to the {{% vendor/name %}} community!

{{% community-buttons %}}
