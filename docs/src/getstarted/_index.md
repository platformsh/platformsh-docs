---
title: "Introduction"
weight: -110
layout: single
description: |
  The easiest way to get started working with Platform.sh is to try it out yourself. Start with the first **Let's Git Started** link, and proceed through the guide to deploy your first project.
---

Welcome to the Platform.sh Getting Started guides!

## What are these guides for?

Platform.sh is a flexible and highly customizable DevOps solution for deploying web applications.
That said, there are a few rules and some basic knowledge of configuration you will need to know to start using it. 

These guides are meant to take you through those basic concepts by deploying your first project. 
After that, additional topics are covered to provide a full scope of what Platform.sh is useful for, and to show what development looks like on a day-to-day basis. 

Some of the topics you will cover include:

- **Iterative development:** deploying your first project, making changes to it, and then merging into production.
- **Data:** Using built-in services, and exploring production data inheritance.
- **Multi-app:** Deploy single applications, or decoupled architectures from the same project.
- **Troubleshooting:** Learn how to interact with deployed projects, and investigate issues.
- **Fleets:** Translate the standards of single projects to a larger fleet of many projects. 
- **Activities:** Learn how Platform.sh surfaces events into activities that can be used to deliver important notifications. 

## Before starting out

Each of the guides in this section assume some prior understanding of conventional DevOps topics. 
They assume some working knowledge of Git, SSH, DevOps workflows, development environments, CI/CD, and infrastructure-as-code as a practice. 

Useful resources are provided for context throughout these guides, but it's best not to rely on them completely if this is your first time deploying applications to production, or using version control to create copies of those applications to review changes to them.
Before starting, review some of the links below if you are not yet familiar.

### Git

Platform.sh respects and is built upon [Git](https://git-scm.com/) as a version control system for all projects. 
That is to say, Platform.sh really is just Git under-the-hood.
You can go through all of the guides in this section with only some familiarity with DevOps concepts, but prior knowledge of Git ([as well as its installation on your machine](https://git-scm.com/)) is necessary beforehand. 

Below are a few resources that may help you with context before going forward. 

- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
- [What is version control?](https://www.atlassian.com/git/tutorials/what-is-version-control)
- [What is Git?](https://www.atlassian.com/git/tutorials/what-is-version-control)
- [Install Git](https://www.atlassian.com/git/tutorials/install-git)
- [Setting up a repository](https://www.atlassian.com/git/tutorials/setting-up-a-repository)
- [Inspecting a repository](https://www.atlassian.com/git/tutorials/inspecting-a-repository)
- [Using branches](https://www.atlassian.com/git/tutorials/using-branches)
- [GitOps](https://www.atlassian.com/git/tutorials/gitops)

Before getting started, make sure you [have Git installed on your computer](https://git-scm.com/).

### Required tools

Aside from experience with Git, each of these guides assume the same minimum starting point: an account created on Platform.sh, and the CLI installed on your machine. 

#### Create an account

Platform.sh provides a free one month trial, which will provide all of the resources you will need to go through these Getting Started guides. 

Before starting, be sure to [register for a trial Platform.sh account](https://auth.api.platform.sh/register) if you have not done so already.
You can use your email address to register, or you can sign up using an existing GitHub, Bitbucket, or Google account. 
If you choose this option, you will be able to set a password for your Platform.sh account later.

You will be given an option to create a project at this point (two options: **Use a template** and **Create from scratch**).
Click the **Cancel** button in the right-hand corner of the screen for now - you will create a project later in this guide. 

#### Install the CLI

In addition to a Platform.sh account, each of the following guides assume that you will use the Platform.sh CLI.
The CLI is the primary, and the most useful, tool for deploying applications and interacting with your projects.

Follow the steps below to install.

1. **Install**

    In your terminal, run the following command depending on your operating system:

    {{< codetabs >}}
---
title=Linux/macOS
file=none
highlight=bash
markdownify=false
---
curl -fsS https://platform.sh/cli/installer | php
<--->
---
title=Windows
file=none
highlight=bash
markdownify=false
---
curl -f https://platform.sh/cli/installer -o cli-installer.php
php cli-installer.php
    {{< /codetabs >}}

2. **Authenticate and verify**

   Once the installation has completed, run the CLI in your terminal with the command:

   ```bash
   platform
   ```

   Log in using a browser. Then take a moment to view some of the available commands with the command:

   ```bash
   platform list
   ```

   {{< asciinema src="videos/asciinema/verify-cli-extended.cast" >}}

## Get started

After that, you're ready to get started with Platform.sh, and deploy your first application. 

{{< guide-buttons next="Let's Git started!" type="first" >}}


