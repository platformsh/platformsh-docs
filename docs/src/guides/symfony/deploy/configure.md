---
title: "Configure Symfony for Platform.sh"
sidebarTitle: "Configure"
weight: -100
description: |
    Review the basics of what makes up a Platform.sh project, including its three principle configuration files and how to define them for Symfony.
---

{{% guides/symfony/config-desc name="Symfony" %}}

{{% guides/symfony/config-app noExample=true /%}}

The examples vary based on using Symfony Base or Symfony Demo skeleton.

{{< codetabs >}}
+++
title=Base
highlight=yaml
file=/static/files/fetch/appyaml/symfony/base
+++

<--->
+++
title=Demo
highlight=yaml
file=/static/files/fetch/appyaml/symfony/demo
+++

{{< /codetabs >}}

The Symfony Demo app used in this guide uses SQLite database. The mount point `/data` allows the Symfony application to update `database.sqlite` file.

To see how to define directories that are writable at runtime, see the [mounts reference](../../../create-apps/app-reference#mounts).


In the build hook, the [configurator](https://symfony.com/doc/current/cloud/config.html#configurator) is a script specially crafted for Platform.sh. It ensures that projects are always using the most up-to-date version of some tools:

- [croncape](https://github.com/symfonycorp/croncape)
- [Symfony CLI](https://symfony.com/download)
- [Composer](https://getcomposer.org/download/)

Additionally, it creates some helpers: [symfony-build](https://symfony.com/doc/current/cloud/config.html#symfony-build), [symfony-start](https://symfony.com/doc/current/cloud/config.html#symfony-start), [symfony-deploy](https://symfony.com/doc/current/cloud/config.html#symfony-deploy), [symfony-database-migrate](https://symfony.com/doc/current/cloud/config.html#symfony-database-migrate), [php-ext-install](https://symfony.com/doc/current/cloud/config.html#php-ext-install), and [yarn-install](https://symfony.com/doc/current/cloud/config.html#yarn-install).

{{< note >}}
Usage of the symfony configurator is also a way to contribute to Symfony project as it triggers an event on Platform.sh side to give back a percentage of every plan to the Symfony organization.
{{< /note >}}

{{% guides/config-service name="Symfony" noService=1 %}}

{{% /guides/config-service %}}

{{% guides/config-routes template="symfony" name="Symfony" %}}

## Tips and tricks

### Symfony CLI
{{% tips-and-tricks/symfony/cli %}}

{{< guide-buttons next="Deploy Symfony" >}}
