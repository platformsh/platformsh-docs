---
title: Set variables
description: See how to set variables that you can later use to take control over your app's environment.
keywords:
  - .environment
---

To set variables, determine which [type of variable](./_index.md#variable-types) to use.
Remember to take into account the order of precedence.
All of the variables can also be [overridden via script](#set-variables-via-script).

## Set variables in your app

Set variables [in code](../../create-apps/app-reference.md#variables) using the `.platform.app.yaml` file.
These values are the same across all environments and present in the Git repository,
which makes them a poor fit for API keys and other such secrets.

They're better fits for uses such as configuration for consistent builds across every environment,
including setting [PHP configuration values](./_index.md#php-specific-variables).

Application variables are available at both build time and runtime.

## Create project variables

Add secrets for all environments in project variables
using [the Console](../../administration/web/configure-project.md#variables) or the CLI.

For example, to create the project variable `foo` with the value `bar`, run:

```bash
platform variable:create --level project --name foo --value bar
```

For example, you may need to set a variable to vary between production and other environments, such as API gateway credentials.
You can set the non-production version as a project variable
and then set a [variable specific to the production environment](#create-environment-specific-variables) to override it.

When naming variables, be sure to take [variable prefixes](./_index.md#variable-prefixes) into account.

### Variable options

Variables have several Boolean options you can set in the Console or the CLI:

| Option    | CLI flag            | Default | Description |
| --------- | ------------------- | ------- | ----------- |
| JSON      | `--json`            | `false` | Whether the variable is a JSON-serialized value (`true`) or a string (`false`). |
| Sensitive | `--sensitive`       | `false` | If set to `true`, the variable's value is hidden in the Console and in CLI responses for added security. It's still readable within the app container. |
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

Note that for changes to project variables to have effect,
you need to [redeploy](../troubleshoot.md#force-a-redeploy) your environments.

## Create environment-specific variables

Set variables for specific environments using [the Console](../../administration/web/configure-environment.md#variables) or the CLI.
Variables can be inherited or overridden from parent environments and project variables.
See [more on overriding values](./_index.md#overrides)

For example, to create the environment variable `foo` with the value `bar` on the current environment, run:

```bash
platform variable:create --level environment --name foo --value bar  --visible-build true --visible-runtime false
```

To specify the environment for the variable, use the `-e` flag to specify its name.

When naming variables, be sure to take [variable prefixes](./_index.md#variable-prefixes) into account.

### Environment variable options

Environment variables share all of the [options available for project variables](#variable-options),
with the exception that visibility in the build and runtime can be set only with the CLI (not in the Console).
Environment variables have one additional option:

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
To make the new value accessible to those environments, [trigger a redeploy](../troubleshoot.md#force-a-redeploy).

### Example environment variable

Environment variables are a good place to store values that apply only on Platform.sh and not on your local development environment. This includes API credentials for third-party services, mode settings, and which server (development vs. production) to use.

One example would be to define a Node.js application's build on a production branch (`NODE_ENV=production`),
but use development mode (`NODE_ENV=development`) for each of your development environments.
Assuming you have a `main` environment for production and a `staging` environment with more child environments for development,
run the following commands:

```bash
platform variable:create -l environment -e main --prefix env: --name NODE_ENV --value production --visible-build true --inheritable false
platform variable:create -l environment -e staging --prefix env: --name NODE_ENV --value development --visible-build true --inheritable true
```

Now `NODE_ENV` is `production` on the default branch but `development` on `staging` and each of its child environments.
Note that build visible environment variables change the application's build configuration ID:
value updates trigger a rebuild of the application in the same way that a commit would.

## Set variables via script

You can also provide a `.environment` file as in [your app root](../../create-apps/app-reference.md#root-directory).
This file runs as a script in dash when the container starts and on all SSH logins.
It can be used to set any environment variables directly, such as the PATH variable.

For example, the following `.environment` file allows any executable installed in the `vendor/bin` directory
(such as executables installed using Composer)
to be run regardless of the current directory:

```bash {location=".environment"}
export PATH=/app/vendor/bin:$PATH
```

You can also dynamically define environment variables based on the current environment.
For example, you might want to get the [defined route](../../define-routes/_index.md) with the id `api` for the current environment.
To define it as the `URL` environment variable, you might add something like:

```bash {location=".environment"}
URL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select (.value.id == "api") | .key')
```

Note that the file is sourced after all other environment variables above are defined and so they're available to the script.
This also means the `.environment` script has the last word on environment variable values and can override anything it wants to.

### Testing `.environment` scripts

You may find that a command that works during an SSH session provides a `bad substitution` error when placed in a `.environment` file.
Remember, `.environment` is sourced using dash, not bash.
When testing your `.environment` logic, be sure to first enter a `dash` session in your terminal or within the SSH session.

When testing, you might print to stdout (using an `echo` or `printf` command) to check what's happening.
The following example looks for a `deploy/environment.tracker.txt` file.
It displays a different message if it's found or not, which helps you track what variables are being set.

```bash {location=".environment"}
if [ -f "deploy/environment.tracker.txt" ]; then 
    echo "File found."
    export DEPLOY='Friday'
else
    echo "File not found."
    export DEPLOY='Never on a Friday'
```

While sanity checks like this are useful during troubleshooting, you shouldn't include such commands in your final code.
Because the `.environment` file is run at the start of an SSH session, the message is printed at the start of the session.

Even when your SSH command executes successfully, you might later attempt to download data from one of your mounts,
such as by using the CLI command `platform mount:download`.
When you do, you see this error:

```bash
protocol version mismatch -- is your shell clean?
(see the rsync man page for an explanation)
rsync error: protocol incompatibility (code 2) at .../rsync/compat.c(61) [receiver=2.6.9]

[ProcessFailedException]                                                                                                                      
The command failed with the exit code: 2      
```

This failure comes because `mount:download` and `rsync` don't expect output when the SSH connection is made.
To solve the issue, remove the printed output from your `.environment` file.

## Map variables

If your app needs different names for environment variable than those set by Platform.sh, which is common for database connections,
map the Platform.sh's variable names to those required by the application.
Do this in the app with the help of a [Config Reader library](https://github.com/platformsh?q=config-reader) or via a shell script.

For example, the following [`.environment` script](#set-variables-via-script) exports variables that are visible to the application.
It uses the `jq` library, which is included in all app containers for this purpose.

```bash {location=".environment"}
export APP_DATABASE_HOST=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].host")
export APP_DATABASE_USER=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].username")
```

This sets environment variables with names your app needs and the values from `$PLATFORM_RELATIONSHIPS`.

## Use `.env` files

Many applications use a `.env` file in the application root for configuration.
These are useful for local development to set variables without needing them to be global across the development computer.
Read more about [the use cases for `.env` files](https://platform.sh/blog/2021/we-need-to-talk-about-the-env/).

You shouldn't need to use a `.env` file in production.
Add it to your `.gitignore` file to avoid confusion as its values can vary for each local developer.
