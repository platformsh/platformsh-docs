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

Using Composer is not traditionally the norm for WordPress development, but it is strongly recommended when deploying on Platform.sh. Like any other application, your WordPress site is most secure when you can ensure repeatable builds and commitable updates to your dependencies. Your infrastructure is committed through a set of configuration files which specifiy which version of PHP and MariaDB you want to use, and Composer provides the best way to make sure that your versions of WordPress core and your plugins are tied to your commit history in the same way. 

Also, Platform.sh's build and deploy pipeline prevents write access to the file system post-build, and it's here where plugins that cannot be downloaded via Composer fail, since many require write acccess to their own file system as part of their setup process. There will be instructions in this guide for how to install plugins without using Composer, but it is still assumed that they stick to best practices and do not write to the file system at runtime and when enabling them. You can get around this issue by defining a [mount](/configuration/app/storage.md#basic-mounts) where a plugin requires write access, but you will have to remember that the contents at that mount location will be wiped when deployment begins, so you will need to copy and re-copy accordingly. 

If you have a WordPress site that is not using Composer, there are a [few guides](https://composer.rarst.net/) that [cover the topic](https://roots.io/using-composer-with-wordpress/) in more detail than this guide will address that you can consult before proceeding.

Going through the steps below you will have two options:

1. You already have a [Composer flavored WordPress](https://github.com/johnpbloch/wordpress) site your are trying to deploy. In this case, you will able to go through each step to make the recommended changes to your repository to prepare it for Platform.sh.
2. You have no code at this point. In this case, Platform.sh maintains a ready-made [WordPress template](https://github.com/platformsh-templates/wordpress-composer) that you will be able to deploy very quickly. The steps below will then hopefully help to clarify why the modifications have been made to a base WordPress project that is using Composer.

## Tools

{{< guides/tools >}}

## Sign up for Platform.sh and initialize your project

{{< guides/signup name="WordPress" template="wordpress-composer" >}}

```bash
$ git clone https://github.com/johnpbloch/wordpress && cd wordpress
```

{{< /guides/signup >}}

{{< guide-buttons next="Configure repository" type="first" >}}
