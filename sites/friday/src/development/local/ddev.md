---
title: Use DDEV for local development
sidebarTitle: DDEV
description: Use DDEV to set up local development environments.
weight: 1
sectionBefore: Integrated environments
keywords:
    - ddev 
---

{{% ddev/definition %}}

This guide assumes you have a project already running with {{< vendor/name >}} and you have the code on your computer.

If you're starting from scratch, first [create a project](/get-started/).

## Before you begin

{{% ddev/requirements %}}

## 1. Install DDEV

{{% ddev/install %}}

## 2. Add DDEV configuration to your project

Get basic configuration set up for your project by running the following command:

```bash
ddev config
```

Follow the prompts to add the correct DDEV configuration files to your repository.

## 3. Add an API token

{{% ddev/token %}}

## 4. Optional: Get your project data

To get your environment data (files, database), run the following command:

```bash
ddev pull {{% vendor/cli %}}
```

To skip pulling files, add `--skip-files` to the command.
To skip pulling a database, add `--skip-db` to the command.

## 5. Run your project

Now your project is ready to run:

```bash
ddev start
```

This runs all your hooks and builds your project like on {{% vendor/name %}}.

The command returns the project URL `http://{{< variable "PROJECT_NAME" >}}.ddev.site/`
as well as a specific port on `http://127.0.0.1`.
To see your project running, open one of these URLs.

## What's next

You've got a project running on a local web server.
Now you can add customizations.
For more ideas and options, see the [DDEV documentation](https://ddev.readthedocs.io/en/stable/).

### Add environment variables

If your project requires environment variables for its hooks or runtime,
add them to the project's DDEV environment:

```yaml {location=".ddev/config.yaml"}
web_environment:
    - {{< variable "VARIABLE_NAME" >}}: {{< variable "VALUE" >}}
```

To apply your changes, run the following command:

```bash
ddev restart
```
