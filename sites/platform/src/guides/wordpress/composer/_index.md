---
title: "Why you should manage WordPress with Composer"
weight: -100
layout: single
sidebarTitle: "Why use Composer?"
description: |
    This guide will give you a greater understanding for why{{% vendor/name %}} recommends using Composer to manage WordPress. 
---


Using Composer isn't traditionally the norm for WordPress development, but it is strongly recommended when deploying on {{% vendor/name %}}. This guide is intended to provide an overview of why using Composer - including adding modules and themes locally as packages, as well as updating WordPress itself - is recommended. 

## Why use Composer

Like any other application, your WordPress site is most secure when you can ensure repeatable builds and committable updates for both your code and its dependencies. This is a priority at {{% vendor/name %}}, and that's why you can control your infrastructure in the same way. Your infrastructure is committed through a set of configuration files that specify which version of PHP and MariaDB you want to use, because that's the best way to ensure that your project remains reproducible when developing new features.

WordPress core, as well as its themes and plugins, should ideally work the same way, but very often this isn't the case. WordPress's administration panel provides one-click buttons to update all of these components when they're out of date, or otherwise expects write access to the file system to make configuration changes at runtime. Developing this way has its consequences, however. 

First off, you aren't always going to have write access to the file system at runtime (which is the case for {{% vendor/name %}}), so depending on this mechanism for updates and configuration changes is entirely restricted for many hosting solutions. On the other hand, if you *do* have write access at runtime where you're hosting currently, installing a new module or theme presents a nontrivial security risk when the source is unknown. 

But, perhaps most importantly, updating WordPress at runtime decouples the state of your site from the code in your repository. A colleague working on a new feature on their local clone of the project could very well be a full major version behind the live site, introducing bugs with unknown (and more importantly, untested) consequences completely as a result of this workflow. 

## Advantages of using Composer

Given the points raised above, managing your WordPress site with Composer has clear advantages. First, it allows you to explicitly define your dependencies in a committed file (`composer.lock`). This lock file is generated from a more descriptive list of dependency constraints (`composer.json`) when your dependencies are installed, and it becomes a part of your project's commit history. From then on, any new branch will work from the identical collection of dependencies, down to the exact commit hash. It doesn't matter at that point who contributes to the project or even where it is deployed - it's the same code for everyone everywhere.

Composer also removes the need to commit lots of external code to your repository. In the case of WordPress, *not* using Composer often requires you to commit all of the code for a theme, and even for WordPress core itself, to your own project. Besides making the repository unnecessarily large and slow to clone, updating these copies becomes a juggling act that nobody needs to deal with.

Through Composer you can add and update dependencies to your project, and then lock their exact versions so that each new branch gets that same update. Had the update been performed on the deployed site at runtime, you would have to remember to `git pull` first.

### Adding themes and modules with Composer

Through Composer, themes and modules are then treated the same as any other PHP dependency. You can, for example, add the [Neve](https://wordpress.org/themes/neve/) theme to your project by using `composer require`

```bash
composer require wpackagist-theme/neve
```

or add the [cache-control](https://wordpress.org/plugins/cache-control-by-cacholong/) plugin:

```bash
composer require wpackagist-plugin/cache-control
```

These commands will add the packages to your `composer.json` file, and then lock the exact version to `composer.lock`. Just push those updates to your project on {{% vendor/name %}}, and enable them through the administration panel as you would normally. 

{{< note >}}
Typically, Composer dependencies install to a `vendor` directory in the project root, but themes and plugins need to install to `wp-content` instead. There is an `installer-paths` attribute that is added to `composer.json` to accomplish this, which is explained in more detail in the [How to Deploy WordPress on {{% vendor/name %}}](/guides/wordpress/deploy/_index.md) guide (which uses Composer from the start), as well as the [How to update your WordPress site to use Composer](/guides/wordpress/composer/migrate.md) guide. 
{{< /note >}}

For more information, see the following {{% vendor/name %}} community post: [How to install custom/private WordPress plugins and themes with Composer](https://community.platform.sh/t/how-to-install-custom-private-wordpress-plugins-and-themes-with-composer/622).

### Installing WordPress core with Composer

In the same way, using Composer makes it unnecessary for you to commit all of WordPress to your repository, since you can add it as a dependency. There are several ways to do this (i.e. [Bedrock](https://github.com/platformsh-templates/wordpress-bedrock)) depending on how many assumptions you want to be made for your configuration and project structure. The simplest one uses the [John Bloch Composer fork](https://github.com/johnpbloch/wordpress) to add an installer to your builds for WordPress:

```bash
composer require johnpbloch/wordpress-core-installer
composer require johnpbloch/wordpress-core
```

### Updates

Now that WordPress core, your themes and your plugins have been added as dependencies with Composer, updates become easier. 

```bash
composer update
```

This command will update everything in your project locally, after which you can push to {{% vendor/name %}} on a new environment. After you are satisfied with the changes merge into your production site. 

## Resources

{{% vendor/name %}} has written several guides for WordPress alongside the Composer recommendation:

- [How to Deploy WordPress on {{% vendor/name %}}](/guides/wordpress/deploy/_index.md): From here, you can create a Composer-based version of WordPress from scratch and deploy to {{% vendor/name %}}.
- [How to update your WordPress site to use Composer](/guides/wordpress/composer/migrate.md): This guide will take you through the steps of updating your fully committed *vanilla* WordPress repository into one that uses Composer and deploy it to {{% vendor/name %}}.
- [Redis](/guides/wordpress/redis.md): This guide will show you how to add a Redis container to your configuration and add it to your deployed WordPress site.
- [How to Deploy WordPress without Composer on {{% vendor/name %}}](/guides/wordpress/vanilla/_index.md): If you do not want to switch to using Composer and you are willing to work around some of {{% vendor/name %}} runtime constraints, this guide will show you how to deploy a fully committed *vanilla* WordPress site to {{% vendor/name %}}
