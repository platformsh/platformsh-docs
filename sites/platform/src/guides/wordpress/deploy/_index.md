---
title: Deploy WordPress on {{% vendor/name %}}
sidebarTitle: Get started
weight: -110
layout: single
description: |
    Create a {{% vendor/name %}} account, download a few tools, and prepare to deploy WordPress using Composer.
---

WordPress is a popular Content Management System written in PHP. The recommended way to deploy WordPress on {{% vendor/name %}} is by using Composer, the PHP package management suite. The most popular and supported way to do so is with the [John Bloch](https://github.com/johnpbloch/wordpress) Composer fork script. This guide assumes from the beginning that you're migrating a Composer-flavored WordPress repository. 

{{< note >}}
With some caveats, it's possible to deploy WordPress to {{% vendor/name %}} without using Composer, [though not recommended](/guides/wordpress/composer/_index.md). You can consult the ["WordPress without Composer on {{% vendor/name %}}"](/guides/wordpress/vanilla/_index.md) guide to set that up, but do consider [upgrading to use Composer](/guides/wordpress/composer/migrate.md).
{{< /note >}}

{{% guides/starting-point name="WordPress" templateRepo="wordpress-composer" composerLink="https://github.com/johnpbloch/wordpress" initExample=true %}}

{{< note >}}
All of the examples in this deployment guide use the [`wordpress-composer`](https://github.com/platformsh-templates/wordpress-composer) template maintained by the {{% vendor/name %}} team. That template is built using the [John Bloch Composer fork](https://github.com/johnpbloch/wordpress) of WordPress, which is meant to facilitate managing WordPress with Composer, but the template comes with its own assumptions. One is that WordPress core is downloaded by default into a `wordpress` subdirectory when installed, but other teams would rather specify another subdirectory along with many more assumptions. 

An alternative approach is shown in {{% vendor/name %}}'s [Bedrock template](https://github.com/platformsh-templates/wordpress-bedrock), which installs core into `web/wp`, exports environment customization to a separate `config/environments` directory, and largely depends on setting environment variables to configure the database. Your are free to follow that template as an example with this guide, though there are slight differences. For its ease of use, the Bedrock approach is often used as a substitute starting point in some of the other WordPress guides in this documentation.
{{< /note >}}

{{% guides/requirements %}}

## Initialize a project

{{< guides/initialize name="WordPress" template="wordpress-composer" >}}

If you don't have code, create a new WordPress project from scratch.
The following command creates a brand new WordPress project.

```bash
git clone https://github.com/johnpbloch/wordpress && cd wordpress
```

{{< /guides/initialize >}}

{{< guide-buttons next="Configure repository" type="first" >}}
