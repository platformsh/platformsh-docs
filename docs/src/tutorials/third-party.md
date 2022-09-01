---
title: "Platform.sh Third-Party Resources"
sidebarTitle: "Third-party resources"
description: |
  This is a Big List of known third party resources for Platform.sh. These resources are not vetted by Platform.sh, but may be useful for people working with the platform.
---

{{% description %}}

<!-- vale off -->
## Blogs

* "[The future of the PHP PaaS is here: Our journey to Platform.sh](https://platform.sh/2016/06/future-php-paas/)", by Marcus Hausammann
* An [introduction to Platform.sh](https://www.sitepoint.com/first-look-platform-sh-development-deployment-saas/) from Chris Ward

## Guides

### Getting started & workflow

* [Set up your Mac for Platform.sh using MAMP](https://github.com/owntheweb/platform-quick-starter) by [@owntheweb](https://github.com/owntheweb)
* How Platform.sh can [simplify your contribution workflow on GitHub](https://medium.com/akeneo-labs/how-platform-sh-can-simplify-your-contribution-workflow-on-github-6e2a557a1bcc) by Mickaël Andrieu from Akeneo
* [A guide in French](http://thomas-asnar.github.io/platform-sh-orange-cloud/) on deploying to Platform.sh by Thomas Asnar [FR]
* Nacho Digital has a guide on [moving an existing site](http://www.nachodigital.com.ar/content/moving-existing-site-platformsh) to Platform.sh
* All the stuff you need for a [pro-dev-flow using platform.sh](https://github.com/thinktandem/platform-workflow-demo) as your deploy target  again by https://www.thinktandem.io

### Working with Platform.sh

* How to [connect to your MySQL database](https://www.thinktandem.io/blog/2017/03/03/connecting-to-a-remote-platform-sh-database) using Sequel Pro
* How to [set up XDebug](https://ghosty.co.uk/2015/09/debugging-on-platform-sh/)
* Official [Symfony documentation](https://symfony.com/doc/current/cloud/intro.html) on deploying to Platform.sh
* Official [Sylius](https://docs.sylius.com/en/latest/cookbook/deployment/platform-sh.html) documentation on deploying to Platform.sh
* How to install [Apache Tika on Platform.sh](https://thinktandem.io/blog/2017/11/10/apache-tika-on-platform-sh/)
* How to [store complete logs at AWS S3](https://gitlab.com/contextualcode/platformsh-store-logs-at-s3) by [Contextual Code](https://www.contextualcode.com/)
* [Automated SSL Certificates Export on Platform.sh](https://www.contextualcode.com/Blog/Automated-SSL-Certificates-Export-on-Platform.sh) by [Contextual Code](https://www.contextualcode.com/)
* A Platform.sh [region migration tool](https://gitlab.com/contextualcode/platformsh-migration) by [Contextual Code](https://www.contextualcode.com/)

### Drupal

* [Modifying distribution make files for Platform.sh](https://www.nickvahalik.com/blog/modifying-distribution-makefiles-within-your-own-project-makefile-platformsh)
* Platform.sh [Drupal 8 Development Workflow](https://github.com/JohnatasJMO/platformsh-development-workflow) by @JohnatasJMO
* Syslogging is not supported on Platform.sh, instead, you can [Log using Monolog](https://gist.github.com/janstoeckler/7f251bf10fedbfb7f752b61ee5d2ef5e) to keep log files out of the database (and/or use whatever processors & handlers you want)

### Sylius

* The [Sylius documentation](https://docs.sylius.com/en/1.12/cookbook/deployment/platform-sh.html) has a solid set of instructions for setting up Sylius with Platform.sh.

## Examples

Platform.sh lists maintained examples on its Github page, with some cross-referencing from http://docs.platform.sh. Examples listed below could work fine, or may be out-of-date or unmaintained. Use at your own risk.

### NodeJS

Framework  | Credit
-----------|-------
[MEAN stack](https://github.com/OriPekelman/platformsh-example-mean)|[@OriPekelman](https://github.com/OriPekelman)

### Python

Framework  | Credit
-----------|-------
Python [**Flask using gunicorn**](https://github.com/etoulas/platformsh-example-flask)|[@etoulas](https://github.com/etoulas)
[**Odoo**](https://github.com/OriPekelman/platformsh-example-odoo) Open Source ERP and CRM|[@OriPekelman](https://github.com/OriPekelman)

### PHP

Framework  | Credit
-----------|-------
[**Akeneo** example](https://github.com/maciejzgadzaj/akeneo-on-platformsh-example)|[@maciejzgadzaj](https://github.com/maciejzgadzaj)
[**API Platform** with a **ReactJS** client](https://github.com/GuGuss/platformsh-api-platform-admin) admin |[@GuGuss](https://github.com/GuGuss)
[**Backdrop** example](https://github.com/gmoigneu/platformsh-example-backdrop)|[@gmoigneu](https://github.com/gmoigneu)
[**Headless Drupal 8 with Angular**](https://github.com/GuGuss/headless-drupal8-platformsh)|[@GuGuss](https://github.com/GuGuss)
[**Headless Drupal 8 with React.js**](https://github.com/systemseed/drupal_reactjs_boilerplate)|[@systemseed](https://github.com/systemseed)
[**Joomla** example](https://github.com/gmoigneu/platformsh-example-joomla)|[@gmoigneu](https://github.com/gmoigneu)
[**Laravel** example](https://github.com/JGrubb/platformsh-laravel-example)|[@JGrubb](https://github.com/JGrubb)
[**Moodle** example](https://github.com/JGrubb/platform-sh-moodle-example)|[@JGrubb](https://github.com/JGrubb)
[**Mouf framework** example](https://github.com/xhuberty/RhMachine)|[The Coding Machine](https://github.com/xhuberty)
[**Flow Framework** support package](https://github.com/ttreeagency/FlowPlatformSh)|Dominique Feyer
[**Neos CMS** support package](https://github.com/ttreeagency/NeosPlatformSh)|Dominique Feyer
[**Silverstripe** example](https://github.com/gmoigneu/platformsh-example-silverstripe)|[@gmoigneu](https://github.com/gmoigneu)
[**Thunder** example](https://github.com/md-systems/platformsh-example-thunder)|[maintained by the MD Systems team](https://github.com/md-systems)
[**WooCommerce** example](https://github.com/liip/woocommerce-demo)|[@Liip](https://github.com/liip)

### Ruby

Framework  | Credit
-----------|-------
[**Jekyll** example](https://github.com/JGrubb/platformsh-jekyll)|[@JGrubb](https://github.com/JGrubb)

### Rust

Framework  | Credit
-----------|-------
[**Rust with Rocket and webasm**](https://github.com/royallthefourth/platformsh-rust-rocket)|[Royall Spence](https://github.com/royallthefourth)

## Integrations

* [Integrate GitLab with Platform.sh using Gitlab-CI](https://github.com/axelerant/pushtoplatformsh), by [@Axelerant](https://github.com/axelerant)
* [Running Behat tests from CircleCI to a Platform.sh environment](https://glamanate.com/blog/running-behat-tests-circleci-platformsh-environment), by [Matt Glaman](https://github.com/mglaman)
* Platform.sh's original (unsupported) scripts for **GitLab** https://gist.github.com/pjcdawkins/0b3f7a6da963c129030961f0947746c4. Platform.sh now supports Gitlab natively.
* An adapter from platform.sh webhook to **slack** incoming webhook that can be hosted on a platform.sh app https://github.com/hanoii/platformsh2slack
* How to [call the NewRelic API on deploy](https://github.com/platformsh/platformsh-docs/pull/536#issuecomment-295578188) (by @christopher-hopper)
* A helper utility for running browser based tests on CircleCI against a Platform.sh environment. https://github.com/xendk/dais

## Tools & development

* Create [**deploy commands you can run from composer**](https://github.com/dnunez24/platformsh-deploy-php), using Symfony
* A small tool from Hanoii https://github.com/hanoii/drocal
* Script to **sync a Drupal site** from Production to Local https://github.com/pjcdawkins/platformsh-sync
* Matt Pope's [Platform.sh automated mysql and files backup script](https://bitbucket.org/snippets/kaypro4/gnB4E)

### Development environments

* [**Beetbox**](http://beetbox.readthedocs.io/en/stable/), a pre-provisioned L*MP stack for Drupal and other frameworks, with Platform.sh CLI integration
* A **Docker** image with the Platform.sh CLI on it https://github.com/maxc0d3r/docker-platformshcli
* Some tips on using Platform.sh with **DrupalVM** https://github.com/geerlingguy/drupal-vm/issues/984
* [**Vagrant with Ansible**](https://github.com/mglaman/platformsh-vagrant)for Platform.sh, opinionated towards Drupal, by @mglaman.

### Ansible

* [Playbook for setting up Vagrant and VirtualBox](https://github.com/DurableDrupal/ansible-vm-platformsh) for use with a Platform.sh project
* PixelArt's [Platform.sh CLI role](https://galaxy.ansible.com/pixelart/platformsh-cli/)
