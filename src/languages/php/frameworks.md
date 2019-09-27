# PHP Featured Frameworks

Platform.sh is the chosen cloud solution behind Symfony, Magento, eZ Systems, and Drupal Commerce. Full Drush support and Composer-based builds make handling dependencies and builds for PHP frameworks as simple as committing your `composer.json` to your project.

## Drupal

Drupal 8 is built around two technologies that make developer's lives easier: Composer and Symfony. Composer simplifies dependency management for PHP applications, and it comes pre-installed on Platform.sh. The default [build flavor](/overview/build-deploy.md#building-the-application) for PHP application runs `composer install` during build, handling all of your dependencies automatically. Platform.sh is also the magic behind Symfony Cloud and Magneto Commerce.

Whether Drupal 8 or legacy, Platform.sh has tried and tested best practices for Drupal deployments.

* [Drupal 7 Best Practices](/frameworks/drupal7.md)
* [Drupal 8 Best Practices](/frameworks/drupal8.md)

### Community Support

Drupal FAQs, how-to guides and other tutorials right on [Platform.sh Community](https://community.platform.sh/).

* [Drupal on Platform.sh Community](https://community.platform.sh/search?q=drupal&expanded=true)

### Example Projects

Check out the fully configured Drupal starter projects maintained by the Platform.sh team.

#### Templates

* [Drupal 7](https://github.com/platformsh-templates/drupal7)
* [Drupal 7 (Vanilla)](https://github.com/platformsh-templates/drupal7-vanilla)
* [Drupal 8](https://github.com/platformsh-templates/drupal8)
* [Drupal 8 (Multisite variant)](https://github.com/platformsh-templates/drupal8-multi)
* [Opigno](https://github.com/platformsh-templates/drupal8-opigno)
* [GovCMS8](https://github.com/platformsh-templates/drupal8-govcms8)

#### Examples

* [Drupal Commerce 7](https://github.com/platformsh/platformsh-example-drupalcommerce7)
* [Drupal 8 with Blackfire](https://github.com/platformsh/demo-drupal-blackfire)

## eZ Platform

eZ Platform comes pre-configured for use with Platform.sh for versions 1.13 and later, all it takes is mapping a few environment variables to an existing project.

Check out the caching, configuration, and local development best practices for eZ Platform and Fastly integration.

* [eZ Platform Best Practices](/frameworks/ez.md)

### Example Projects

Fully configured eZ Platform starter projects maintained by the Platform.sh team.

* [eZ Platform](https://github.com/platformsh/platformsh-example-ezplatform)

## Symfony

Since Platform.sh natively supports composer-based builds, Symfony dependency management and installation stays simple.

* [Symfony Best Practices](/frameworks/symfony.md)

### Community Support

Symfony FAQs, how-to guides and other tutorials right on [Platform.sh Community](https://community.platform.sh/).

* [Symfony on Platform.sh Community](https://community.platform.sh/search?expanded=true&q=symfony)

### Example Projects

#### Templates

* [Symfony 3](https://github.com/platformsh-templates/symfony3)
* [Symfony 4](https://github.com/platformsh-templates/symfony4)

#### Examples

* [Symfony 2](https://github.com/platformsh/platformsh-example-symfony2)

## TYPO3

Platform.sh provides an excellent solution for hosting TYPO3 CMS projects. Set up your, database, caching, and extensions - then deploy.

* [TYPO3 Best Practices](/frameworks/typo3.md)

### Example Projects

* [TYPO3](https://github.com/platformsh/platformsh-example-typo3)

## Wordpress

Platform.sh recommends using the composer-based installation method for Wordpress.

* [Wordpress Best Practices](/frameworks/wordpress.md)

### Community Support

All your Wordpress FAQs, plus how-to guides and tutorials right on [Platform.sh Community](https://community.platform.sh/).

* [Wordpress on Platform.sh Community](https://community.platform.sh/search?expanded=true&q=wordpress)

### Templates

* [Wordpress](https://github.com/platformsh-templates/wordpress)
