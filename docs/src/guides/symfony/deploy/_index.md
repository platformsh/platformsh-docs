---
title: Deploy Symfony on Platform.sh
sidebarTitle: "Get started"
weight: -110
layout: single
description: |
    See how to get started deploying Symfony on Platform.sh.
---

Symfony is a web application framework written in PHP. Platform.sh is the official Symfony PaaS.

This guide provides instructions for deploying, and working with, Symfony on Platform.sh.
It includes examples for working with Symfony on all the major package managers: composer.

{{% guides/starting-point name="Symfony" template="symfony-6.2.template" initExample=true %}}

{{< note >}}

This guide is written for Symfony 6.2, but should apply almost exactly the same for other versions.

{{< /note >}}

{{% guides/requirements name="Symfony" %}}

{{< note >}}

Note:
All sample commands in this guide using Symfony CLI `symfony <command>` can be replaced by `platform <command>` as Symfony CLI is an official replicate of the [Platform.sh CLI](/administration/cli/_index.md).

{{< /note >}}

## Create your Symfony Demo application
If you don't have code, create a new Symfony project from scratch.
The following commands create a brand new [Symfony Demo](https://symfony.com/doc/current/setup.html#the-symfony-demo-application) project.

```bash
symfony new {{< variable "PROJECT_NAME" >}} --demo [--cloud]
cd {{< variable "PROJECT_NAME" >}}
symfony console doctrine:database:create
symfony console doctrine:fixture:load -n
symfony server:start -d
```
Then follow given link from your terminal to access your Symfony site.

{{< note >}}
`--demo` option create a Demo skeleton of Symfony.

`--cloud` option generate Platform.sh config files, as explain in the next topic [Configure repository](./configure.md)

{{< /note >}}

The community also provides a number of open-source starting points you can consult:

- [SymfonyCasts](https://symfonycasts.com/tracks/symfony) maintained by [@weaverryan](https://github.com/weaverryan)
- [Symfony blog - Introducing the Symfony Demo application](https://symfony.com/blog/introducing-the-symfony-demo-application) maintained by [@javier.eguiluz](https://connect.symfony.com/profile/javier.eguiluz)

## Initialize a Platform.sh project

{{< guides/initialize name="Symfony" template="symfony" />}}

{{< guide-buttons next="Configure repository" type="first" >}}
