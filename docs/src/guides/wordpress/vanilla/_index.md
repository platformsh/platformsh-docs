---
title: "How to Deploy WordPress without Composer on Platform.sh"
weight: -90
toc: false
layout: single
sidebarTitle: "Deploy without Composer"
description: |
    Migrate your existing vanilla WordPress site to Platform.sh. 
---

WordPress is a popular Content Management System written in PHP. The recommended way to deploy WordPress on Platform.sh is by using [Composer](/guides/wordpress/deploy/_index.md), the PHP package management suite. This guide will take you through the steps of setting up "vanilla" WordPress - that is, WordPress not managed through Composer, but rather by either fully committing WordPress, themes, and plugins or defining them with submodules - on Platform.sh. It should be noted that this approach comes with certain limitations based on the way Platform.sh works, and for this reason is [not recommended](/guides/wordpress/composer/_index.md). Instead, consider using the ["Upgrade to use Composer"](/guides/wordpress/composer/migrate.md) guide to modify your project into one that uses Composer. 

{{% guides/starting-point name="WordPress" templateRepo="wordpress-vanilla" %}}

## Tools

{{% guides/tools %}}

## Sign up for Platform.sh and initialize your project

{{% guides/signup name="WordPress" template="wordpress-vanilla" %}}

3. Initialize your project.
   In the next steps, you see that Platform.sh recommends placing WordPress core into a subdirectory rather than the project root.
   The following command sets that up for you with a fresh project level repository initialized:

   ```bash
   mkdir wordpress-psh && cd wordpress-psh
   git clone https://github.com/WordPress/WordPress.git wordpress && rm -rf wordpress/.git
   git init
   ```

{{% /guides/signup %}}

{{< guide-buttons next="Configure repository" type="first" >}}
