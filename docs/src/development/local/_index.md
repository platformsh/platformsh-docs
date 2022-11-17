---
title: "Set up your local development environment"
weight: 4
description: Set up a local development environment to edit your app's code.
sidebarTitle: "Local development"
layout: single
---

To make changes to your app's code and test them without affecting your production environment, 
you need to set up a development environment on your computer.

## Before you begin

Make sure that:

- You have signed up for a Platform.sh account. 
  As a new user, you can sign up for a [free trial account](https://auth.api.platform.sh/register). 
- You have started a [template project](../../development/templates.md) 
  or pushed your own code to Platform.sh.
- You have [installed Git](https://docs.github.com/en/get-started/quickstart/set-up-git).
- You have [installed the Platform.sh CLI](../../administration/cli/_index.md).

Note that to run your build locally, you need to set up your dependencies locally 
unless you use a third-party tool such as [DDEV](./ddev.md), [Docksal](./docksal.md) or [Lando](./lando.md).
These Docker-based tools are open-source and cross-platform.
They simplify how you can configure your local development environment 
regardless of how many different projects you have.

If you don't want to use a Docker-based local development environment tool, you can use:
  - [Tethered local development](./tethered.md). This lets you run your project locally
    by using a local web server but keeping all other services on Platform.sh 
    and connecting to them over an SSH tunnel.
  - [Untethered local development](./untethered.md) to run your entire site locally.

## 1. Download your app's code

### View a list of your projects and environments

If you have several projects on Platform.sh, 
you might want to view a list of them before downloading a copy of your code.

To do so, run the `platform` command.
You get output similar to the following:

```bash
Your projects are:

+-----------------+--------------+------------------+------------------+
| ID              | Title        | Region           | Organization     |
+-----------------+--------------+------------------+------------------+
| abcdefgh1234567 | project-name | eu.platform.sh   | organization-inc |
+-----------------+--------------+------------------+------------------+
```

In Platform.sh, each project can have several environments. 
Each new environment is a child of the environment which you created it from.
Child environments can sync code and/or data down from their parent environment. 
They can also merge code up to their parent, 
making them a good place for development, staging, and testing.

Before downloading a copy of your code,
you might want to view a list of all the environments in your project to pick one.

To do so, run the following command:

```bash
platform environments --project {{< variable "PROJECT_ID" >}}
```

You get output similar to the following:

```bash
Your environments are: 
+--------------------+------------------+--------+-------------+
| ID                 | Title            | Status | Type        |
+--------------------+------------------+--------+-------------+
| main               | Main             | Active | production  |
|   march-release    | march release    | Active | development |
|   march-tests      | march tests      | Active | development |
|   april-release    | april release    | Active | development |
|   april-tests      | april tests      | Active | development |
+--------------------+------------------+--------+-------------+
```

### Launch the download

If your app's code isn't already present locally on your computer,
you can download a copy of it.
To do so, move to the directory where you want to save a copy of your project 
and run this command:

```bash
platform get {{< variable "PROJECT_ID" >}}
```

When prompted, choose a name for the target project directory and press **Enter**.
You get output similar to the following:

```
Downloading [project-name](abcdefgh1234567)
  Cloning into '/Users/username/project-directory'...
  remote: counting objects: 3318, done.        
  Receiving objects: 100% (3318/3318), 20.23 MiB | 3.71 MiB/s, done.
  Resolving deltas: 100% (568/568), done.

The project [project-id](abcdefgh1234567) was successfully downloaded to: 'project-directory'
```

You can now access your app's code from the project directory created on your computer.
Note that inside the project directory, the `.platform/local` subdirectory is excluded from Git. 
It contains builds and any local metadata about your project the [Platform.sh CLI](../../administration/cli/_index.md) needs.

You can now make changes to your project without pushing to Platform.sh each time to test them. 
Instead, you can locally build your application using the Platform.sh CLI.

Note that if your app contains services, you need to open an SSH tunnel to connect to them.
For more information, see how to [connect services](../../add-services#2-connect-the-service).

## 2. Build your site locally

Before you build your site, 
check that any runtime or tools needed for the build process are available 
in your local environment.

If you want your local development environment to be enclosed 
so your main system remains unaffected by the build and its dependencies, 
you can use a local virtual machine.

To build your site locally:

1. Run the following command:

   ```bash
   platform build
   ```

2. When prompted, specify the source directory and the build destination.

  Your app is built locally.
  At the root of your local project directory, a `_www` subdirectory is created.
  It is a symbolic link pointing to the currently active build located in the `.platform/local/builds` directory.

3. To check that the build was successful:
   - If you are familiar with how to set up a local web server or already have one, 
     you can move to the `_www` directory to find your build
     and run your web server and services from there.
   - If you don’t want to set up everything manually, 
     you can switch to a Docker-based local development environment tool 
     such as [DDEV](./ddev.md), [Docksal](./docksal.md) or [Lando](./lando.md).
     
     Other options include [tethered local development](./tethered.md) and [untethered local development](./untethered.md).
