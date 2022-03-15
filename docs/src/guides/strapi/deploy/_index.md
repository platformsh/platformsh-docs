---
title: "How to Deploy Strapi on Platform.sh"
sidebarTitle: "Get started"
weight: -110
layout: single
toc: false
description: |
  Create a Platform.sh account, download a few tools, and prepare to deploy Strapi.
---

[Strapi](https://strapi.io) is an open-source headless CMS used for building fast and easily manageable APIs written in JavaScript.

For the steps below, one of the following starting points are assumed:

- You already have a Strapi instance you are trying to deploy. In this case, you will be able to go through each step to make the recommended changes to your repository to prepare it for Platform.sh.

- You have no code at this point. In this case, Platform.sh maintains a ready-made [Strapi](https://github.com/platformsh-templates/strapi4/) template that you will be able to deploy. The steps below will clarify why the modifications have been made to a base Strapi project.

## Tools

Next, you need a couple tools to interact with your Platform.sh project, one of which you likely already have.

- [Git](https://git-scm.com/).
  Git is the primary tool you use to manage everything your app needs to run.
  Every commit pushed results in a new deployment, and all of your configuration is driven almost entirely by a small number of YAML files in your Git repository (which we will get to in the steps below).
  Your infrastructure, described in these files, becomes part of your application itself - completely transparent and version-controlled.
  If you do not already have Git on your computer, you should [install it now](https://help.github.com/articles/set-up-git/).

- You’ll need [PHP](https://www.php.net/manual/en/install.php) installed on your machine.

- The [Platform.sh CLI](/development/cli/_index.md).
  This lets you interact with your Platform.sh project from the command line.
  You can also use your browser, but the CLI is the tool you use the most in this guide.
  Install it for your operating system:

  ```bash
  # Linux/macOS
  curl -sS https://platform.sh/cli/installer | php

  # Windows
  curl https://platform.sh/cli/installer -o cli-installer.php
  php cli-installer.php
  ```

  Once it's installed, run the CLI in your terminal:

  ```bash
  # Verify the installation
  platform
  ```

  On the first run, you need to log in using a browser.

  Take a moment to view some of the available commands, by running:

  ```bash
  # View the list of CLI commands
  platform list
  ```

## Sign up for Platform.sh and initialize your project

{{% guides/signup name="Strapi" template="strapi4" /%}}

{{< guide-buttons next="Configure Strapi" type="first" >}}
