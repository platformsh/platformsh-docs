---
title: "Using Composer with WordPress: the how and why"
weight: -100
layout: single
sidebarTitle: "Why use Composer?"
description: |
    Everything you need to get started with WordPress on Platform.sh. 
---


Using Composer is not traditionally the norm for WordPress development, but it is strongly recommended when deploying on Platform.sh. This guide is intended to provide an overview of why using Composer - including adding modules and themes locally as packages, as well as updating WordPress itself - is recommended. 

## Why use Composer

Like any other application, your WordPress site is most secure when you can ensure repeatable builds and commitable updates for both your code and its dependencies. On Platform.sh, your infrastructure is committed through a set of configuration files which specifiy which version of PHP and MariaDB you want to use, because that's the best way to ensure that infrastructure remains consistent when developing new features.

WordPress core, as well as its themes in plugins, should ideally work the same way, but very often this is not the case. WordPress's adminintration panel provides one-click buttons to update all of these components when they are out of date, or otherwise expects write access to the file system to make configuration changes at runtime. Developing this has has it's consequences, however. 

First off, you are not always going to have write access to the file system at runtime (which is the case for Platform.sh), so depending on this mechanism for updates and configuration changes is entirely restricted for many hosting solutions. On the other hand, if you *do* have write access at runtime where you're hosting currently, allowing a module or theme is a security risk if the source is unknown. 

But, taking it back to the previous paragraphs, updating WordPress core or its modules at runtime decouples the state of your site from the code in your repository. A colleague working on a new feature on their local clone of the project could very well be a full major version behind the live site, introducing bugs with unknown (and more importantly, untested) consequences completely as a result of this workflow. 

## Advantages of using Composer

Given the points raised above, managing your WordPress site with Composer has clear advantages. First, it allows you to explicitly define your dependencies in a committed file (`composer.lock`). This lock file is generated from a more descriptive list of dependency constraints (`composer.json`) when your dependencies are installed, and it becomes a part of your project's commit history. From then on, any new branch will work from the identical collection of dependencies, down to the exact minor version. It does not matter at that point who contributes to the project or even where it is deployed, it's the same code for everyone everywhere.

Composer also removes the need to commit large numbers of external code in your repository. In the case of WordPress, *not* using Composer will often require you to commit all of the code for a theme, and even for WordPress core itself, in your own project. Besides making the repository unnecessarily large and slow to clone, updating these copies becomes version control management that nobody needs to deal with.  

---


and it also provides the best way to make sure that your versions of WordPress core and your plugins are tied to your commit history in the same way. 

Additionally, Platform.sh's build and deploy pipeline prevents write access to the file system at runtime, and it's here where plugins that cannot be downloaded via Composer fail since many require write acccess to their own file system as part of their setup process. 

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
