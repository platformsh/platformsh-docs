---
title: "Set up your local development environment"
weight: 4
description: |
  While Platform.sh is great as a tool for hosting an application during both development and production, it's naturally not the ideal place to edit code.  You can't, in fact, as the file system is read-only (as it should be). The proper place to edit your code is on your computer.
sidebarTitle: "Local development"
layout: single
---

{{< description >}}

You need to have both [Git](/development/tools.md#git) and the [Platform.sh CLI](/development/cli/_index.md) installed before continuing.

## Download the code

If you don't already have a local copy of your project's code, run `platform get` to download one. You can also run `platform projects` to list all of the projects in your account.

```bash
~/htdocs $ platform projects
Your projects are:
+---------------+----------------------------+------------------------------------------------+
| ID            | Name                       | URL                                            |
+---------------+----------------------------+------------------------------------------------+
| [project-id]  | New Platform Project       | https://eu.platform.sh/#/projects/[project-id] |
+---------------+----------------------------+------------------------------------------------+

Get a project by running platform get [id].
List a project's environments by running platform environments.
```

Now you can download the code using `platform get [project-id] [folder-name]`:

```bash
~/htdocs $ platform get [project-id] my-project
Cloning into 'my-project/repository'...
remote: counting objects: 11, done.
Receiving objects: 100% (11/11), 1.36 KiB | 0 bytes/s, done.
Checking connectivity... done.
```

You should now have a repository folder, based on what you used for *[folder-name]* in the `platform get` command above.

You will also notice a new directory in your project, `.platform/local`, which is excluded from Git.  This directory contains builds and any local metadata about your project needed by the CLI.

## Building the site locally

Run the `platform build` command to run through the same build process as would be run on Platform.sh.  That will produce a `_www` directory in your project root that is a symlink to the currently active build in the `.platform/local/builds` folder. It should be used as the document root for your local web server.

```bash
~/htdocs/my-project $ platform build
Building application myapp (runtime type: php)
  Beginning to build ~/htdocs/my-project/project.make.
  drupal-7.38 downloaded.
  drupal patched with install-redirect-on-empty-database-728702-36.patch.
  Generated PATCHES.txt file for drupal
  platform-7.x-1.3 downloaded.
Running post-build hooks
Symlinking files from the 'shared' directory to sites/default

Build complete for application myapp
Web root: ~/htdocs/my-project/_www
~/htdocs/my-project $
```

Because the `platform build` command will run locally, any runtime or tools used in your build process need to be available in your local environment, or the build will fail.  It may also result in side effects, such as the installation on your local computer of packages referenced in your `dependencies` block.

If that is undesirable, a local virtual machine will let you create an enclosed local development environment that won't affect your main system.

## Running the code

Platform.sh supports whatever local development environment you wish to use.  There is no dependency on any particular tool so if you already have a local development workflow you're comfortable with you can keep using it without changes.  That's the "[untethered](/development/local/untethered.md)" option.

For quick changes, you can also run your code locally but use the services hosted on Platform.sh.  That is, your site is "[tethered](/development/local/tethered.md)" to Platform.sh.  While this approach requires installing less on your system it can be quite slow as all communication with the database or cache server will need to travel from your computer to Platform.sh's servers.

Specific documentation is also available for the local development tools [Lando](/development/local/lando.md) and [Docksal](/development/local/docksal.md), which support most applications that Platform.sh supports.
