---
title: "How to deploy multisite WordPress to Platform.sh"
sidebarTitle: "Multisite"
toc: true
description: |
    Platform.sh supports running [multiple applications](/bestpractices/oneormany.md) in the same project, and these can be two or more WordPress sites.
weight: -80
---

It is possible to maintain a [WordPress Network](https://wordpress.org/support/article/create-a-network/), also known as a multisite installation, on Platform.sh. In this case, multiple WordPress sites share the same core files. They share the same database, and each have access to the same collection of themes and plugins, all managed from one administration panel. Each site is "virtual", in that they do not have distinct directories for any part of their installation except those for media uploads. Consult WordPress's [Before You Create a Network](https://wordpress.org/support/article/before-you-create-a-network/) guide about how your WordPress installation will be affected by these changes if you are still considering multisite.

In this guide you will learn how to set up the two variations of WordPress multisite on Platform.sh:

- [Path-based](#subdirectory-path-based-wordpress-networks): invidual WordPress sites are served from *subdirectories* of the main domain, like `https://my-wordpress-site/site1`.
- [Domain-based](#subdomain-domain-based-wordpress-networks): individual WordPress sites are served from *subdomains*, like `https://site1.my-wordpress-site`.

## Starting assumptions

This documentation contains a number of guides for setting up and maintaining WordPress on Platform.sh, [ideally through Composer](/guides/wordpress/composer/_index.md). This guide will not directly address deployment, and will only focus on modifying an existing site already configured for Platform.sh to support a WordPress Network. It also assumed that you have already deployed that site to a Platform.sh project. If you have not already gone through this setup, consult the guides and templates below before continuing:

- [How to Deploy WordPress on Platform.sh with Composer](/guides/wordpress/deploy/_index.md)
- [WordPress (Composer) template](https://github.com/platformsh-templates/wordpress-composer)
- [WordPress (Bedrock) template](https://github.com/platformsh-templates/wordpress-bedrock)
- [How to Deploy WordPress on Platform.sh without Composer](/guides/wordpress/vanilla/_index.md)

Additionally, each of the examples below have been applied to the [Bedrock](https://github.com/platformsh-templates/wordpress-bedrock) template, a particular Composer-managed WordPress distribution. It comes with a few starting constraints for the directory structure of your projects, but it makes configuration changes easier to illustrate. If you are using another [Composer-based](https://github.com/platformsh-templates/wordpress-composer) or [Vanilla](https://github.com/platformsh-templates/wordpress-vanilla) version of WordPress, replicate the steps in your own project. 

## Multisite options