---
title: "Frameworks"
weight: 2
---

Full Drush support and Composer-based builds make handling dependencies and builds for PHP frameworks as simple as committing your `composer.json` to your project.


## Drupal

[Drupal](https://www.drupal.org/) is an open-source content management framework written in PHP. Since Composer comes pre-installed on Platform.sh, Drupal can be installed and updated completely using Composer. The default [build flavor](/overview/build-deploy.md#building-the-application) for PHP application runs `composer install` during build, handling all of your dependencies automatically.

* [Drupal 7 Best Practices](/frameworks/drupal7/_index.md)
* [Drupal 8/9 Guide](/guides/drupal9/_index.md)

### Community Support

Drupal FAQs, how-to guides and other tutorials right on [Platform.sh Community](https://community.platform.sh/).

* [Drupal on Platform.sh Community](https://community.platform.sh/search?q=drupal&expanded=true)

### Templates

* [Drupal 7](https://github.com/platformsh-templates/drupal7)
* [Drupal 7 (Vanilla)](https://github.com/platformsh-templates/drupal7-vanilla)
* [Drupal 8](https://github.com/platformsh-templates/drupal8)
* [Drupal 9](https://github.com/platformsh-templates/drupal9)
* [Drupal 8 (Multisite variant)](https://github.com/platformsh-templates/drupal8-multisite)
* [Opigno](https://github.com/platformsh-templates/drupal8-opigno)
* [GovCMS8](https://github.com/platformsh-templates/drupal8-govcms8)

## eZ Platform

[eZ Platform](https://ezplatform.com/) is a CMS based on the Symfony full-stack framework. eZ Platform comes pre-configured for use with Platform.sh for versions 1.13 and later, all it takes is mapping a few environment variables to an existing project. Consult the caching, configuration, and local development best practices for eZ Platform and Fastly integration for more information.

* [Ibexa DXP Best Practices](/frameworks/ibexa/_index.md)

### Example Projects

{{< note >}}
Template projects (repositories in the [platformsh-templates](https://github.com/platformsh-templates) GitHub organization) are actively maintained by the Platform.sh team. Any other example projects come with less support, and remain in public repositories as proof-of-concepts.
{{< /note >}}

* [eZ Platform](https://github.com/ezsystems/ezplatform)

## Symfony

[Symfony](https://symfony.com/) is a web application framework written in PHP. Like Drupal, Symfony projects can utilize native Composer to build applications and manage dependencies.

* [Symfony Best Practices](/frameworks/symfony/_index.md)

### Community Support

Symfony FAQs, how-to guides and other tutorials right on [Platform.sh Community](https://community.platform.sh/).

* [Symfony on Platform.sh Community](https://community.platform.sh/search?expanded=true&q=symfony)

### Templates

* [Symfony 5](https://github.com/symfonycorp/platformsh-symfony-template/tree/5.4)
* [Symfony 6](https://github.com/symfonycorp/platformsh-symfony-template/tree/6.0)

## TYPO3

[TYPO3](https://typo3.org/) is an open-source CMS written in PHP. Utilized Platform.sh native Composer to handle builds and maintain dependencies.

* [TYPO3 Guide](/guides/typo3/deploy/_index.md)

### Templates

* [TYPO3](https://github.com/platformsh-templates/typo3)

## Wordpress

[Wordpress](https://wordpress.com/) is a PHP content management system. Platform.sh recommends using the composer-based installation method for Wordpress.

* [Wordpress Best Practices](/guides/wordpress/_index.md)

### Community Support

All your Wordpress FAQs, plus how-to guides and tutorials right on [Platform.sh Community](https://community.platform.sh/).

* [Wordpress on Platform.sh Community](https://community.platform.sh/search?expanded=true&q=wordpress)

### Templates

* [Wordpress](https://github.com/platformsh-templates/wordpress-composer)
