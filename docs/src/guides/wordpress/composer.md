---
title: "Using Composer with WordPress: the how and why"
weight: 1
sidebarTitle: "Using Composer"
description: |
    Everything you need to get started with WordPress on Platform.sh. 
---

## Why use Composer

It's not at all uncommon for WordPress developers and users to fully commit their WordPress sites 

### Adding plugins & themes: Platform.sh limitations and commit histories

Platform.sh helps tie codebases to infrastructure, to leverage Git in your DevOps workflow, and to ensure repeatable builds and secure sites at runtime. For all of these reasons, the typical method of adding and installing plugins and themes from within the admin panel at runtime just doesn't fit. 

Specifically, Platform.sh provides a fully writable file system *only* during the build stages (the build hook) of your deployment. From the deploy stage (deploy hook) on, you're project is running on containers with read-only filesystems. It's a change to get used to, but a huge advantage in the long run. Installing modules at runtime detaches code that your site depends on from your actual codebase. Additionally, allowing code to run on your server with write access is a security risk, which is why we don't allow it by default and do not recommend configuring manually in these cases.

Instead, Platform.sh maintains the assumption that your site at runtime should run on a read-only filesystem. 

### Updating WordPress core, plugins, & themes

Aside from trying to install plugins and themes it can also be common practice to actually commit those packages to your codebase. This is better than the previous point, but not by much, mostly 

### Adding plugins & themes

Aside from trying to install plugins and themes 

### Updating WordPress core, plugins, & themes

## How to update your WordPress site to use Composer

Lorem ipsum