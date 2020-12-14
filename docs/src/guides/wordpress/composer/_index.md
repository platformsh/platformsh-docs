---
title: "Using Composer with WordPress: the how and why"
weight: -100
layout: single
sidebarTitle: "Why use Composer?"
description: |
    Everything you need to get started with WordPress on Platform.sh. 
---


Using Composer is not traditionally the norm for WordPress development, but it is strongly recommended when deploying on Platform.sh. Like any other application, your WordPress site is most secure when you can ensure repeatable builds and commitable updates to your dependencies. Your infrastructure is committed through a set of configuration files which specifiy which version of PHP and MariaDB you want to use, and Composer provides the best way to make sure that your versions of WordPress core and your plugins are tied to your commit history in the same way. 

Also, Platform.sh's build and deploy pipeline prevents write access to the file system post-build, and it's here where plugins that cannot be downloaded via Composer fail, since many require write acccess to their own file system as part of their setup process. 

## Why use Composer

It's not at all uncommon for WordPress developers to fully commit their WordPress sites, or to expect that they will be able to install modules and themes from within the admin panel at runtime. Platform.sh recommends neither of these, but instead that your WordPress sites should be managed with Composer on a read-only file system at runtime. There are specific reasons for these assumptions, mostly due to the restrictions Platform.sh makes about your running application, but they are good reasons addressed in detail below. 

Ultimately, it is best that your Wordpress site managed with Composer

- Downloads WordPress core on the fly, rather than committing it. 
- Downloads WordPress themes and plugins during the build process, allowing you to *enable* them at runtime but not install new ones without additional commits. 

## Advantages of using Composer

- explicitly declared dependencies
- Composer takes care of both installation and updates
- Project is never locked into specific versions
- No third-party code needs to be included in your repository (without this, you either have to commit everything or use Git submodules)

### Adding plugins & themes: Platform.sh limitations and commit histories

Platform.sh helps tie codebases to infrastructure, to leverage Git in your DevOps workflow, and to ensure repeatable builds and secure sites at runtime. For all of these reasons, the typical method of adding and installing plugins and themes from within the admin panel at runtime just doesn't fit. 

Specifically, Platform.sh provides a fully writable file system *only* during the build stages (the build hook) of your deployment. From the deploy stage (deploy hook) on, you're project is running on containers with read-only filesystems. It's a change to get used to, but a huge advantage in the long run. Installing modules at runtime detaches code that your site depends on from your actual codebase. Additionally, allowing code to run on your server with write access is a security risk, which is why we don't allow it by default and do not recommend configuring manually in these cases.

Instead, Platform.sh maintains the assumption that your site at runtime should run on a read-only filesystem. 

### Updating WordPress core, plugins, & themes

Aside from trying to install plugins and themes it can also be common practice to actually commit those packages to your codebase. This is better than the previous point, but not by much, mostly 

### Adding plugins & themes

Aside from trying to install plugins and themes 

### Updating WordPress core, plugins, & themes
