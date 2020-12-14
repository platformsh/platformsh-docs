---
title: "How to Deploy WordPress without Composer on Platform.sh"
weight: -90
toc: false
layout: single
sidebarTitle: "Deploy without Composer"
description: |
    Everything you need to get started with WordPress on Platform.sh. 
---

WordPress is a popular Content Management System written in PHP. The recommended way to deploy WordPress on Platform.sh is by using [Composer](/guides/wordpress/deploy/_index.md), the PHP package management suite. This guide will take you through the steps of setting up "vanilla" WordPress - that is, WordPress not managed through Composer, but rather by either fully committing Wordpress, themes, and plugins or defining them with submodules - on Platform.sh. It should be noted that this approach comes with certain limitations based on the way Platform.sh works, and for this reason is [not recommended](/guides/wordpress/composer/_index.md). Instead, consider using the ["Upgrade to use Composer"](/guides/wordpress/composer/migrate.md) guide to modify your project into one that uses Composer. 

Going through the steps below you will have two options:

1. You already have a WordPress site your are trying to deploy. In this case, you will able to go through each step to make the recommended changes to your repository to prepare it for Platform.sh.
2. You have no code at this point. In this case, Platform.sh maintains a ready-made [WordPress template](https://github.com/platformsh-templates/wordpress-vanilla) that you will be able to deploy very quickly. The steps below will then hopefully help to clarify why the modifications have been made to a base WordPress project.

## Tools

{{< guides/tools >}}

## Sign up for Platform.sh and initialize your project

{{< guides/signup name="WordPress" template="wordpress-vanilla" >}}

In the next pages, you will see that Platform.sh recommends placing WordPress core into a subdirectory, rather than the project root. The following command will set that up for you with a fresh project level repository initialized:

```bash
$ mkdir wordpress-psh && cd wordpress-psh
$ git clone https://github.com/WordPress/WordPress.git wordpress && rm -rf wordpress/.git
$ git init
```

{{< /guides/signup >}}

{{< guide-buttons next="Configure repository" type="first" >}}
