---
title: Use DDEV for local development
sidebarTitle: DDEV
description: Use DDEV to set up local development environments.
weight: 1
---

[DDEV](https://ddev.readthedocs.io/en/stable/) is an open-source tool for local PHP and Node.js development environments.
It allows you use Docker in your workflows while maintaining a GitOps workflow.
You get fully containerized environments to run everything locally
without having to install tools (including the Platform.sh CLI, PHP, and Composer) on your machine.

This guide assumes you have a project already running with Platform.sh and you have the code on your computer.
If you're starting from scratch, first [create a project from a PHP template]({{% create-project-link template=true %}}).

## Before you begin

Make sure your computer meets the [system requirements for DDEV](https://ddev.readthedocs.io/en/stable/#system-requirements).

For the integration to run smoothly, you also need the following tools:

- `jq`
- `base64`
- `perl`

If you don't have these already installed, use your normal package manager.

## 1. Install DDEV

To install DDEV, follow the [DDEV documentation for your operating system](https://ddev.readthedocs.io/en/stable/users/install/ddev-installation/).

This installs the self-contained `ddev` command-line interface (CLI).
For more information on `ddev`, run `ddev help`.

## 2. Add DDEV configuration to your project

Get basic configuration set up for your project by running the following command:

```bash
ddev config
```

If you started with a Drupal template, your repository already had DDEV configuration files.
Otherwise, you have to answer a couple of questions about what your repository is
so the correct files are added.

## 3. Add an API token

To connect DDEV with your Platform.sh account, use a Platform.sh API token.

1.  [Create an API token](../../administration/cli/api-tokens.md#2-create-a-platformsh-api-token) in the Console.

2.  Add the token to your DDEV configuration.
    You can do so globally (easiest for most people):

    ```bash
    ddev config global --web-environment-add=PLATFORMSH_CLI_TOKEN={{< variable "API_TOKEN" >}}
    ```

    You can also add the token only to the project:

    ```bash
    ddev config --web-environment-add=PLATFORMSH_CLI_TOKEN={{< variable "API_TOKEN" >}}
    ```

Now you can run `ddev exec platform <command>` from your computer without needing to install the Platform.sh CLI.

## 4. Connect DDEV to your project

To connect DDEV to your project, you need to tell it which project to use.
Use environment variables to set your project ID and environment name:

```bash
ddev config --web-environment-add="PLATFORM_PROJECT={{< variable "PROJECT_ID" >}},PLATFORM_ENVIRONMENT={{< variable "ENVIRONMENT_NAME" >}}"
```

For example:

```bash
ddev config --web-environment-add="PLATFORM_PROJECT=abcdefgh1234567,PLATFORM_ENVIRONMENT=main"
```

The best way to connect your local DDEV to your Platform.sh project is through the [Platform.sh DDEV add-on](https://github.com/platformsh/ddev-platformsh).
Add it by running the following command:

```bash
ddev get platformsh/ddev-platformsh
```

## 5. Optional: Get your project data

To get your environment data (files, database), run the following command:

```bash
ddev pull platform
```

To skip pulling files, add `--skip-files` to the command.
To skip pulling a database, add `--skip-db` to the command.

## 6. Optional: Install dependencies

If your project has dependencies, you can install them with Composer.
Using the DDEV version of Composer means you don't need to install Composer on your machine.
You can also use different Composer versions in different projects based on their DDEV configurations.

Run the following command:

```bash
ddev composer install
```

If you have any other commands in your [build hook](../../create-apps/hooks/_index.md),
you need to run those explicitly.
You can also add them as [DDEV hooks in your configuration](https://ddev.readthedocs.io/en/stable/users/configuration/hooks/).

## 7. Run your project

Now your project is ready to run:

```bash
ddev start
```

The command returns the project URL `http://{{< variable "PROJECT_NAME" >}}.ddev.site/`
as well as a specific port on `http://127.0.0.1`.
Open one of the URLs to see your project running.

## What's next

You've got a project running on a local web server.
Now you can add customizations.
For more ideas and options, see the [DDEV documentation](https://ddev.readthedocs.io/en/stable/).

### Add environment variables

If your project requires environment variables for its hooks or runtime,
add them to the project's DDEV environment:

```yaml {location=".ddev/config.yaml"}
web_environment:
    - <VARIABLE_NAME>: <VALUE>
```

To apply your changes, run the following command:

```bash
ddev restart
```
