---
title: "Next Steps: Requirements for the CLI"
weight: 4
sidebarTitle: "Requirements for the CLI"
toc: false
aliases:
  - "/gettingstarted/template/cli-requirements.html"
---

With the [management console](/administration/web/_index.md), you can start new projects from templates just as you did in the previous steps, but deploying your own applications requires you to also use the [Platform.sh CLI](/development/cli/_index.md).

Before you install it, there are some requirements that must be met first.

You need to have:

* [PHP 5.5.9+](https://www.php.net/manual/en/install.php) with the following extensions installed: `curl`, `json`, `mbstring`, `pcre`, and `phar`.
* [Git](https://docs.github.com/en/get-started/quickstart/set-up-git). It's is the open source version control system used to manage any changes you make to your project. You can see all the Git commit messages of an environment in the `Environment Activity` feed of the [management console](/administration/web/_index.md) for each project you create.
* A Bash-like shell.

On Windows, to install PHP and Git you can use [chocolatey](https://docs.chocolatey.org/en-us/). The best way to get Bash is through [Windows Subsystem for Linux](https://msdn.microsoft.com/en-gb/commandline/wsl/about).

{{< guide-buttons next="I have met all the requirements" >}}
