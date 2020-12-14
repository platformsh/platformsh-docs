---
title: "How to Deploy WordPress on Platform.sh"
sidebarTitle: "Get started"
weight: -110
layout: single
toc: false
description: |
    Create a Platform.sh account, download a few tools, and prepare to deploy WordPress.
---

WordPress is a popular Content Management System written in PHP. The recommended way to deploy WordPress on Platform.sh is by using Composer, the PHP package management suite. The most popular and supported way to do so is with the [John Bloch](https://github.com/johnpbloch/wordpress) Composer fork script. This guide assumes from the beginning that you're migrating a Composer-flavored WordPress repository. 

{{< note >}}
With some caveats, it is of course possible to deploy WordPress to Platform.sh without using Composer, [though not recommended](/guides/wordpress/composer/_index.md). You can consult the ["WordPress without Composer on Platform.sh"](/guides/wordpress/composer/vanilla.md) guide to set that up, but do consider [upgrading to use Composer](/guides/wordpress/composer/migrate.md).
{{< /note >}}

Going through the steps below you will have two options:

1. You already have a [Composer flavored WordPress](https://github.com/johnpbloch/wordpress) site your are trying to deploy. In this case, you will able to go through each step to make the recommended changes to your repository to prepare it for Platform.sh.
2. You have no code at this point. In this case, Platform.sh maintains a ready-made [WordPress template](https://github.com/platformsh-templates/wordpress-composer) that you will be able to deploy very quickly. The steps below will then hopefully help to clarify why the modifications have been made to a base WordPress project that is using Composer.

{{< note >}}
All of the examples in this deployment guide use the [`wordpress-composer`](https://github.com/platformsh-templates/wordpress-composer) template maintained by the Platform.sh team. That template is built using the [John Bloch Composer fork](https://github.com/johnpbloch/wordpress) of WordPress, which is meant to make managing WordPress with Composer a simple process, but the template comes with its own assumptions. The most obvious being that WordPress core is downloaded by default into a `wordpress` subdirectory when installed, but other teams would rather specify another subdirectory along with many more asssumptions. 

An alternative approach is shown in Platform.sh's [Bedrock template](https://github.com/platformsh-templates/wordpress-bedrock), which installs core into `web/wp`, exports environment customization to a separate `config/environments` directory, and largely depends on setting environment variables to configure the database. Your are free to follow that template as an example with this guide, though there will be slight differences. For its ease of use, the Bedrock approach will often be used as a substitute starting point in some of the other WordPress guides in this documentation.
{{< /note >}}

## Tools

{{< guides/tools >}}

## Sign up for Platform.sh and initialize your project

{{< guides/signup name="WordPress" template="wordpress-composer" >}}

Then initialize or clone your Git repository with existing code, or create a new Composer-based project from scratch. The commands below will create a brand new WordPress project using Composer, which you can then modify according to the rest of this guide.

```bash
$ git clone https://github.com/johnpbloch/wordpress && cd wordpress
```

{{< /guides/signup >}}

{{< guide-buttons next="Configure repository" type="first" >}}
