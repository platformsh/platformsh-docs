---
title: Variables overview
weight: 5
description: |
  Variables give you control over your project's build process and runtime environment. You can set them in your code to make changes across your project or independent of the code for environment-specific settings.
keywords:
  - environment variables
---

{{% description %}}

In this way, your app has additional information, such as database credentials, the host or port it can use, and which server to connect to.

## Variable types

You can set variables at different levels.
All variables can be strings or base64-encoded JSON-serialized values.

The following table defines what types of variables are available to you:

| Type                                               | Definer     | Scope       | Precedence | Build | Runtime  | Uses |
| -------------------------------------------------- | ----------- | ----------- | ---------- | ----- | -------- |----- |
| [Application](./set-variables.md#set-variables-in-your-app) | Application | Application | 4          | Yes   | Yes      | Non-secret values that are the same across all environments |
| [Project](./set-variables.md#create-project-variables)               | User        | Project     | 3          | Yes   | Yes      | Secret values that are the same across all environments, such as database credentials |
| [Environment](./set-variables.md#create-environment-specific-variables)       | User        | Environment | 2          | Some  | Yes      | Values that vary by environment, such as which database to connect to or which payment API keys to use |
| [Platform.sh](./use-variables.md#use-platformsh-provided-variables)  | Pre-defined | Environment | 1          | Some  | Yes      | For information about your Platform.sh project |

If there are conflicts between variables with the same name, variables [take precedence](#overrides) from 1 down.
So Platform.sh-provided values (1) override environment variables (2), which override project variables (3),
which override application-provided variables (4).

All of the variables can also be [overridden via script](./set-variables.md#set-variables-via-script).

### Choosing a variable type

Choose how to set the variable based on what you are trying to do.

Some environment variables should be the same for all environments.
For example:

- Build tool versions.
  If you have scripts that use specific versions of build tools (such as a [specific Node.js version](../../languages/nodejs/node-version.md)),
  You want the tools to be versioned along with your code so you can track the impact of changes.
  Set those variables [in the application](./set-variables.md#set-variables-in-your-app).
- Credentials for common services.
  If you have credentials for services shared across your environments,
  you don't want to commit these secrets to code.
  Set them as sensitive [project variables](./set-variables.md#create-project-variables).

Other configurations should vary between environment types.
For example:

- Service configuration for databases and such.
  This information be read from the Platform.sh-provided [`PLATFORM_RELATIONSHIPS` variable](./use-variables.md#use-platformsh-provided-variables).
  It varies by environment automatically.
- Mode toggles such as enabling `debug` mode, disabling certain caches, and displaying more verbose errors.
  This information might vary by environment type and should be set on the [environment level](./set-variables.md#create-environment-specific-variables).
- API keys for remote services, especially payment gateways.
  If you have a different payment gateway for production and for testing,
  set its keys on the [environment level](./set-variables.md#create-environment-specific-variables).

## Overrides

If the names of variables at different levels match,
an environment variable overrides a variable with the same name in a parent environment
and both override a project variable.
All variables can also be [overridden via script](./set-variables.md#set-variables-via-script).

For an example of how the different levels work,
suppose you have the following inheritable variables defined for the `main` environment:

```sh
$ platform var -e main
Variables on the project Example (abcdef123456), environment main:
+----------------+-------------+--------+---------+
| Name           | Level       | Value  | Enabled |
+----------------+-------------+--------+---------+
| system_name    | project     | Spiffy |         |
| system_version | project     | 1.5    |         |
| api_key        | environment | abc123 | true    |
| debug_mode     | environment | 1      | true    |
+----------------+-------------+--------+---------+
```

And the following variables defined for the `feature-x` environment, a child environment of `main`:

```sh
$ platform var -e feature-x
Variables on the project Example (abcdef123456), environment feature-x:
+----------------+-------------+--------+---------+
| Name           | Level       | Value  | Enabled |
+----------------+-------------+--------+---------+
| system_name    | project     | Spiffy |         |
| system_version | project     | 1.5    |         |
| api_key        | environment | def456 | true    |
| system_version | environment | 1.7    | true    |
+----------------+-------------+--------+---------+
```

In the `main` environment, you can access `$PLATFORM_VARIABLES`:

```bash
echo $PLATFORM_VARIABLES | base64 --decode | jq
```

The output looks like this:

```json
{
    "system_name": "Spiffy",
    "system_version": "1.5",
    "api_key": "abc123",
    "debug_mode": "1"
}
```

While in the `feature-x` environment, it looks like this:

```json
{
    "system_name": "Spiffy",
    "system_version": "1.7",
    "api_key": "def456",
    "debug_mode": "1"
}
```

To get a visual overview of which variables are overridden in an environment,
navigate in the Console to that environment's variables settings.
This example shows how it looks within the `feature-x` environment:

<!-- vale Vale.Spelling = NO -->
<!-- spelling turned off because of the "api_key" -->
![The Console showing the variables split into environment and project ones, with the environment variables `api_key` and `system_version` labeled as overridden and `debug_mode` as inherited the project variable `system_version` labeled as inactive.](/images/management-console/variables-overridden.png "0.5")
<!-- vale Vale.Spelling = YES -->

Project variables that conflict with environment variables are labeled as **Inactive**.
Environment variables are labeled as **Inherited** when they get their value from a parent environment
and as **Overridden** when there is a conflict and the parent environment's value doesn't apply.

## Variable prefixes

Certain variable name prefixes have special meanings.
Some are defined by Platform.sh and apply automatically.
Others are just available as a convention for your application code to follow.

### Top-level environment variables

By default, project and environment variables are only added to the `$PLATFORM_VARIABLES` environment variable.
You can also expose a variable as its own environment variable by giving it the prefix `env:`.

For example, the variable `env:foo` creates an environment variable called `FOO`.
(Note the automatic upper-casing.)

```bash
platform variable:create --name env:foo --value bar
```

You can then access that variable directly in your app container:

```bash
$ echo $FOO
bar
```

### PHP-specific variables

Any variable with the prefix `php:` is added to the PHP configuration for all PHP-based application containers in the project.

To apply a setting to all environments or have a setting differ among multiple PHP containers in one project,
specify the variables in the `.platform.app.yaml` file for your application.
For more information, see how to [customize PHP settings](../../languages/php/_index.md#customize-php-settings).

### Framework-specific variables

For specific frameworks, you can implement logic to override global configurations with [environment-specific variables](./set-variables.md#create-environment-specific-variables).
So you can use the same codebase and settings for all your environments,
but still adapt the behavior to each environment.

The Drupal templates show examples of overriding variables from Drupal's configuration system.
You can apply similar logic for other frameworks.

In the Drupal 9 template, the variable override takes place by creating a new variable composed of three distinct parts each separated by colons:

- The prefix,
- The configuration object to override,
- The property you want to set.

For example, to override the site name, set a variable named `drupalsettings:system.site:name`
and give it the value you want.

To set that value with the [CLI](../../administration/cli/_index.md):

``` bash
platform variable:create --name "drupalsettings:system.site:name" --value "{{<variable "SITE_NAME" >}}"
```

Setting that variable overrides the `name` property of the `system.site` configuration object
located in the global `$settings` array.

The same logic applies for other configuration options,
such as the global `$config` array, which uses the variable prefix `drupalconfig`.

To get inspired for other frameworks, see the [Drupal 9 implementation](https://github.com/platformsh-templates/drupal9/blob/8d5d23cdcb91ffa3f96727adf9d3dba74dfc01db/web/sites/default/settings.platformsh.php#L125-L162).
Please note that the naming of the Platform.sh variables is relative to the ones used in your `settings.platformsh.php` file.
Make sure that the Platform.sh variables start with a string present in your `switch` statement.
