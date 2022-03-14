---
title: Using Lando for local development
sidebarTitle: "Lando"
weight: 3
---

[Lando](https://github.com/lando/lando) is Platform.sh's recommended local development tool.  It is a third party tool developed by [Tandem](https://thinktandem.io), which now includes direct support for Platform.sh projects.  Lando can read your Platform.sh configuration files and produce an approximately equivalent configuration using Docker with minimal effort on the part of the developer.

At this time, Lando supports only PHP-based applications but works with any service supported by Platform.sh.  Support for other application languages is in progress.

See the [Lando documentation](https://docs.lando.dev/platformsh/) for installing and setting up Lando on your system.
A quick-start guide is included below, but the Lando documentation is the primary source of truth.

## Quick start

First, ensure that you have the Platform.sh CLI installed and that you have authenticated your account.  Then, [install Lando](https://docs.lando.dev/basics/installation.html) and Docker per Lando's installation instructions.

If you do not yet have your project checked out, run:

```bash
$ lando init --source platformsh
```

That will offer an interactive dialog to select the Platform.sh project to download, and then setup basic Lando configuration.

If you already have your project checked out locally, change into the project directory and run:

```bash
$ lando init --source cwd --recipe platformsh
```

That will use your existing git clone and add the appropriate Lando configuration.

Either way, start the local environment by running:

```bash
$ lando start
```

You can then download data from the environment for your current branch and load it into your local Lando environment by running:

```bash
lando pull -r database -m web/sites/default/files
```

Where the value after `-r` is the relationship name in the application for the service you want to download, and `-m` is the Platform.sh mount path you want to download.  You may specify as many relationships (multiple `-r` switches) and as many mounts (multiple `-m` switches) as you wish.
