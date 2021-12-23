---
title: Set variables
description: See how to set variables that you can later use to take control over your app's environment.
---

To set variables, determine which type of variable to use.
They all can be strings or base64-encoded JSON-serialized values.

| Type                                               | Definer     | Scope       | Precedence | Build | Runtime  | Uses |
| -------------------------------------------------- | ----------- | ----------- | ---------- | ----- | -------- |----- |
| [Application](#use-application-provided-variables) | Application | Application | 4          | Yes   | Yes      | Non-secret values that are the same across all environments |
| [Project](#create-project-variables)               | User        | Project     | 3          | Yes   | Yes      | Secret values that are the same across all environments, such as database credentials |
| [Environment](#create-environment-variables)       | User        | Environment | 2          | Some  | Yes      | Values that vary by environment, such as which database to connect to or which payment API keys to use |
| [Platform.sh](./use-variables.md#use-platformsh-provided-variables)  | Pre-defined | Environment | 1          | Some  | Yes      | For information about your Platform.sh project |

If there are conflicts between variables with the same name, variables [take precedence](./_index.md#overrides) from 1 down.
So Platform.sh-provided values override environment variables, which override project variables, which override application-provided variables.

## Set variables in your app

Set variables [in code](../../configuration/app/app-reference.md#variables) using the `.platform.app.yaml` file.
These values are the same across all environments and present in the Git repository,
which makes them a poor fit for API keys and other such secrets.

They're better fits for uses such as configuration for consistent builds across every environment,
including setting [PHP configuration values](./_index.md#php-specific-variables).

Application variables are available at both build time and runtime.

## Create project variables

Add secrets for all environments in project variables using [the management console](/administration/web/configure-project.html#variables) or the CLI.

For example, to create the project variable `foo` with the value `bar`, run:

```bash
platform variable:create --level project --name foo --value bar
```

When naming variables, be sure to take [variable prefixes](./_index.md#variable-prefixes) into account.

### Variable options

Variables have several Boolean options you can set in the console or the CLI:

| Option    | CLI flag            | Default | Description |
| --------- | ------------------- | ------- | ----------- |
| JSON      | `--json`            | `false` | Whether the variable is a JSON-serialized value (`true`) or a string (`false`). |
| Sensitive | `--sensitive`       | `false` | If set to `true`, the variable's value is hidden in the console and in CLI responses for added security. It's still readable within the app container. |
| Runtime   | `--visible-runtime` | `true`  | Whether the variable is available at runtime. |
| Build     | `--visible-build`   | `true`  | Whether the variable is available at build time. |

So if you want the `foo` variable to be visible at build time but hidden during runtime, you can set it like this:

```bash
platform variable:create --level project --name foo --value bar --visible-build true --visible-runtime false
```

You can also change the variable options after you create them (except for sensitive values, which can't be set to non-sensitive). For example, to make the `foo` variable visible at runtime and hidden during the build, run this command:

```bash
platform variable:update foo --visible-build false --visible-runtime true
```

Note that any changes to project variables require you to deploy your environments to have effect.

## Create environment variables

Set variables for specific environments using [the management console](../../administration/web/configure-environment.md#variables) or the CLI.

For example, to create the environment variable `foo` with the value `bar` on the current environment, run:

```bash
platform variable:create --level environment --name foo --value bar  --visible-build true --visible-runtime false
```

To specify the environment for the variable, use the `-e` flag to specify its name.

When naming variables, be sure to take [variable prefixes](./_index.md#variable-prefixes) into account.

### Environment variable options

Environment variables share all of the [options available for project variables](./_index.md#variable-options), with the exception that visibility in the build and runtime can be set only with the CLI (not in the console). Environment variables have one additional option:

| Option      | CLI flag        | Default | Description |
| ----------- | --------------- | ------- | ----------- |
| Inheritable | `--inheritable` | `true`  | Whether the variable is inherited by child environments. |

This option is useful for  setting production-only values such as credentials. For example, to set a PayPal secret value for only the `main` branch and have it not be readable elsewhere, run:

```bash
platform variable:create -e main --name paypal_id --inheritable false --sensitive true
```

Other environments don't inherit it and get either a project variable of the same name if it exists or no value at all.

Note that changing an environment variable causes that environment to be redeployed so the new value is available.
However, child environments are *not* redeployed.
To make the new value accessible to those environments, redeploy them manually.

### Example environment variable

Environment variables are a good place to store values that apply only on Platform.sh and not on your local development environment. This includes API credentials for third-party services, mode settings, and which server (development vs. production) to use.

One example would be to define a Node.js application's build on a production branch (`NODE_ENV=production`),
but use development mode (`NODE_ENV=development`) for each of your development environments.
Assuming you have a `main` environment for production and then a `staging` environment with more child environments for development,
run the following commands:

```bash
platform variable:create -l environment -e main --prefix env: --name NODE_ENV --value production --visible-build true --inheritable false
platform variable:create -l environment -e staging --prefix env: --name NODE_ENV --value development --visible-build true --inheritable true
```

Now `NODE_ENV` is `production` on the default branch but `development` on `staging` and each of its child environments.
Note that build visible environment variables change the application's build configuration ID:
value updates trigger a rebuild of the application in the same way that a commit would.
