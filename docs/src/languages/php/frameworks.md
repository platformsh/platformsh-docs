---
title: "Frameworks"
weight: 2
---

Full Drush support and Composer-based builds
so you can handle dependencies and builds for PHP frameworks by committing `composer.json` to your project.

## Drupal

[Drupal](https://www.drupal.org/) is an open-source content management framework written in PHP.
Since Composer comes pre-installed on Platform.sh, Drupal can be installed and updated completely using Composer.
The default [build flavor](../../configuration/app/app-reference.md#build) for PHP application
runs `composer install` during build, handling all of your dependencies automatically.

* [Drupal 8/9 Guide](../../guides/drupal9/_index.md)

### Community Support

Drupal FAQs, how-to guides and other tutorials right on [Platform.sh Community](https://community.platform.sh/).

* [Drupal on Platform.sh Community](https://community.platform.sh/search?q=drupal)

### Templates

* [Drupal 8](https://github.com/platformsh-templates/drupal8)
* [Drupal 9](https://github.com/platformsh-templates/drupal9)
* [Drupal 8 (multisite variant)](https://github.com/platformsh-templates/drupal8-multisite)
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

[Symfony](https://symfony.com/) is a web application framework written in PHP. Symfony projects utilize native Composer to build applications and manage dependencies.

* [Symfony Integration with Platform.sh](https://symfony.com/cloud)

### Templates

* [Symfony 5](https://github.com/symfonycorp/platformsh-symfony-template/tree/5.4)
* [Symfony 6](https://github.com/symfonycorp/platformsh-symfony-template/tree/6.0)

## TYPO3

[TYPO3](https://typo3.org/) is an open-source CMS written in PHP. Utilized Platform.sh native Composer to handle builds and maintain dependencies.

* [TYPO3 Guide](/guides/typo3/deploy/_index.md)

### Templates

* [TYPO3](https://github.com/platformsh-templates/typo3)

## WordPress

[WordPress](https://wordpress.com/) is a PHP content management system. Platform.sh recommends using the composer-based installation method for WordPress.

* [WordPress best practices](/guides/wordpress/_index.md)

### Community Support

All your WordPress FAQs, plus how-to guides and tutorials right on [Platform.sh Community](https://community.platform.sh/).

* [WordPress on Platform.sh Community](https://community.platform.sh/search?q=wordpress)

### Templates

* [WordPress](https://github.com/platformsh-templates/wordpress-composer)
