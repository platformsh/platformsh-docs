---
title: "How to Deploy WordPress without Composer on {{% vendor/name %}}"
weight: -90
layout: single
sidebarTitle: "Deploy without Composer"
description: |
    Migrate your existing vanilla WordPress site to {{% vendor/name %}}. 
---

WordPress is a popular Content Management System written in PHP. The recommended way to deploy WordPress on {{% vendor/name %}} is by using [Composer](/guides/wordpress/deploy/_index.md), the PHP package management suite. This guide will take you through the steps of setting up "vanilla" WordPress - that is, WordPress not managed through Composer, but rather by either fully committing WordPress, themes, and plugins or defining them with submodules - on {{% vendor/name %}}. It should be noted that this approach comes with certain limitations based on the way {{% vendor/name %}} works, and for this reason is [not recommended](/guides/wordpress/composer/_index.md). Instead, consider using the ["Upgrade to use Composer"](/guides/wordpress/composer/migrate.md) guide to modify your project into one that uses Composer. 

{{% guides/starting-point name="WordPress" templateRepo="wordpress-vanilla" initExample=true %}}

{{% guides/requirements %}}

## Initialize a project

{{< guides/initialize name="WordPress" template="wordpress-vanilla" >}}

If you don't have code, create a new WordPress project from scratch.
It's best to place WordPress core into a subdirectory rather than at the project root.
The following commands create a fresh Git repository with WordPress as a subdirectory:

```bash
mkdir wordpress-psh && cd wordpress-psh
git clone https://github.com/WordPress/WordPress.git wordpress && rm -rf wordpress/.git
git init
```

{{< /guides/initialize >}}

{{< guide-buttons next="Configure repository" type="first" >}}
