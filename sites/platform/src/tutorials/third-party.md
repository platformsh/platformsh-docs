---
title: "{{< vendor/name >}} Third-Party Resources"
sidebarTitle: "Third-party resources"
description: |
  This is a Big List of known third party resources for {{< vendor/name >}}. These resources aren't vetted by {{< vendor/name >}}, but may be useful for people working with the platform.
---

{{% description %}}

<!-- vale off -->
## Blogs

- "[The future of the PHP PaaS is here: Our journey to {{< vendor/name >}}](https://platform.sh/2016/06/future-php-paas/)", by Marcus Hausammann
- An [introduction to {{< vendor/name >}}](https://www.sitepoint.com/first-look-platform-sh-development-deployment-saas/) from Chris Ward

## Guides

### Getting started & workflow

- [Set up your Mac for {{< vendor/name >}} using MAMP](https://github.com/owntheweb/platform-quick-starter) by [@owntheweb](https://github.com/owntheweb)
- How {{< vendor/name >}} can [simplify your contribution workflow on GitHub](https://medium.com/akeneo-labs/how-platform-sh-can-simplify-your-contribution-workflow-on-github-6e2a557a1bcc) by Mickaël Andrieu from Akeneo
- All the stuff you need for a [pro-dev-flow using {{< vendor/name >}}](https://github.com/thinktandem/platform-workflow-demo) as your deploy target  again by https://www.thinktandem.io

### Development

- How to [connect to your MySQL database](https://www.thinktandem.io/blog/2017/03/03/connecting-to-a-remote-platform-sh-database) using Sequel Pro
- How to [set up XDebug](https://ghosty.co.uk/2015/09/debugging-on-platform-sh/)
- Official [Sylius](https://docs.sylius.com/en/latest/cookbook/deployment/platform-sh.html) documentation on deploying to {{< vendor/name >}}
- How to install [Apache Tika on {{< vendor/name >}}](https://thinktandem.io/blog/2017/11/10/apache-tika-on-platform-sh/)
- How to [store complete logs at AWS S3](https://gitlab.com/contextualcode/platformsh-store-logs-at-s3) by [Contextual Code](https://www.contextualcode.com/)
- [Automated SSL Certificates Export on {{< vendor/name >}}](https://www.contextualcode.com/Blog/Automated-SSL-Certificates-Export-on-Platform.sh) by [Contextual Code](https://www.contextualcode.com/)
- A {{< vendor/name >}} [region migration tool](https://gitlab.com/contextualcode/platformsh-migration) by [Contextual Code](https://www.contextualcode.com/)

### Drupal

- [Modifying distribution make files for {{< vendor/name >}}](https://www.nickvahalik.com/blog/modifying-distribution-makefiles-within-your-own-project-makefile-platformsh)
- Syslogging isn't supported on {{< vendor/name >}}, instead, you can [Log using Monolog](https://gist.github.com/janstoeckler/7f251bf10fedbfb7f752b61ee5d2ef5e) to keep log files out of the database (and/or use whatever processors & handlers you want)

### Sylius

- The [Sylius documentation](https://docs.sylius.com/en/1.12/cookbook/deployment/platform-sh.html) has a solid set of instructions for setting up Sylius with {{< vendor/name >}}.

## Examples

{{< vendor/name >}} lists maintained examples on its Github page, with some cross-referencing from https://docs.platform.sh. Examples listed below could work fine, or may be out-of-date or unmaintained. Use at your own risk.

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

- [Integrate GitLab with {{< vendor/name >}} using Gitlab-CI](https://github.com/axelerant/pushtoplatformsh), by [@Axelerant](https://github.com/axelerant)
- [Running Behat tests from CircleCI to a {{< vendor/name >}} environment](https://glamanate.com/blog/running-behat-tests-circleci-platformsh-environment), by [Matt Glaman](https://github.com/mglaman)
- {{< vendor/name >}}'s original (unsupported) scripts for **GitLab** https://gist.github.com/pjcdawkins/0b3f7a6da963c129030961f0947746c4. {{< vendor/name >}} now supports Gitlab natively.
- An adapter from {{< vendor/name >}} webhook to **slack** incoming webhook that can be hosted on a {{< vendor/name >}} app https://github.com/hanoii/platformsh2slack
- How to [call the NewRelic API on deploy](https://github.com/platformsh/platformsh-docs/pull/536#issuecomment-295578188) (by @christopher-hopper)
- A helper utility for running browser based tests on CircleCI against a {{< vendor/name >}} environment. https://github.com/xendk/dais

## Tools & development

- A small tool from Hanoii https://github.com/hanoii/drocal
- Script to **sync a Drupal site** from Production to Local https://github.com/pjcdawkins/platformsh-sync
- Matt Pope's [{{< vendor/name >}} automated mysql and files backup script](https://bitbucket.org/snippets/kaypro4/gnB4E)

### Development environments

- [**Beetbox**](https://beetbox.readthedocs.io/en/stable/), a pre-provisioned L*MP stack for Drupal and other frameworks, with {{< vendor/name >}} CLI integration
- A **Docker** image with the {{< vendor/name >}} CLI on it https://github.com/maxc0d3r/docker-platformshcli
- Some tips on using {{< vendor/name >}} with **DrupalVM** https://github.com/geerlingguy/drupal-vm/issues/984
- [**Vagrant with Ansible**](https://github.com/mglaman/platformsh-vagrant)for {{< vendor/name >}}, opinionated towards Drupal, by @mglaman.

### Ansible

- [Playbook for setting up Vagrant and VirtualBox](https://github.com/DurableDrupal/ansible-vm-platformsh) for use with a {{< vendor/name >}} project
- PixelArt's [{{< vendor/name >}} CLI role](https://galaxy.ansible.com/pixelart/platformsh-cli/)
