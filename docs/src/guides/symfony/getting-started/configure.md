---
title: "Configure Symfony for Platform.sh"
sidebarTitle: "Configure"
weight: -80
description: |
    Review the basics of what makes up a Platform.sh project, including its three principle configuration files and how to define them for Symfony.
---

{{% guides/config-desc name="Symfony" %}}

{{% guides/config-app noExample=true /%}}

The examples vary based on whether you want to use a Symfony Demo or Symfony Base reference app.

{{< codetabs >}}
+++
title=Demo
highlight=yaml
file=/static/files/fetch/appyaml/symfony-demo/platformsh-symfony-template
+++
<--->
+++
title=Base
highlight=yaml
file=/static/files/fetch/appyaml/symfony-base/platformsh-symfony-template
+++
{{< /codetabs >}}

The Symfony Demo skeleton used in this guide uses SQLite database. The mount point `/data` allows the Symfony application to update `database.sqlite` file.

To see how to define directories that are writable at runtime, see the [mounts reference](../../../create-apps/app-reference#mounts).

In the build hook, the [configurator](https://symfony.com/doc/current/cloud/config.html#configurator) is a script specially crafted for Platform.sh. It ensures that projects are always using the most up-to-date version of some tools:

- [croncape](https://github.com/symfonycorp/croncape)
- [Symfony CLI](https://symfony.com/download)
- [Composer](https://getcomposer.org/download/)

Additionally, it creates some helpers:
[`symfony-build`](https://symfony.com/doc/current/cloud/config.html#symfony-build),
[`symfony-start`](https://symfony.com/doc/current/cloud/config.html#symfony-start),
[`symfony-deploy`](https://symfony.com/doc/current/cloud/config.html#symfony-deploy),
[`symfony-database-migrate`](https://symfony.com/doc/current/cloud/config.html#symfony-database-migrate),
[`php-ext-install`](https://symfony.com/doc/current/cloud/config.html#php-ext-install), and [`yarn-install`](https://symfony.com/doc/current/cloud/config.html#yarn-install).

{{< note >}}
Usage of the Symfony configurator is also a way to contribute to a Symfony project
as it triggers an event on Platform.sh side to give back a percentage of every plan to the Symfony organization.
{{< /note >}}

{{% guides/config-service name="Symfony" noService=1 %}}

{{% /guides/config-service %}}

{{% guides/config-routes template="platformsh-symfony-template" name="Symfony" %}}

{{< guide-buttons next="More Ressources" >}}
