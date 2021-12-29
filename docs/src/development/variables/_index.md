---
title: Variables overview
weight: 5
description: |
  Variables give you control over your project's build process and runtime environment. You can set them in your code to make changes across your project or independent of the code for environment-specific settings.
---

{{< description >}}

In this way, your app has additional information, such as database credentials, the host or port it can use, and which server to connect to.

## Environment-specific configuration

Many applications have some configurations that should vary between different environment types.
These configurations are generally in one of these categories:

* Service configuration for databases and such, which can be read from `PLATFORM_RELATIONSHIPS`.
* Mode toggles such as enabling `debug` mode, disabling certain caches, and displaying more verbose errors.
* API keys for remote services, especially payment gateways.

Ideally, your app can already read those values from environment variables.
If not, there is usually a way to manually bridge them.
For example, an application that has a PHP or JavaScript configuration file
can have that file modified to read the values from the environment at runtime rather than being written statically into the file.

You can set environment variables at several levels depending on what you want to do.
See how to [set variables](./set-variables.md).

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
navigate in the management console to that environment's variables settings.
This example shows how it looks within the `feature-x` environment:

<!-- vale Vale.Spelling = NO -->
<!-- spelling turned off because of the "api_key" -->
![The console showing the variables split into environment and project ones, with the environment variables `api_key` and `system_version` labeled as overridden and `debug_mode` as inherited the project variable `system_version` labeled as inactive.](/images/management-console/variables-overridden.png "0.5")
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

Any variable with the prefix `php:` is added to the `php.ini` configuration for all PHP-based application containers in the project.

For example, an environment variable named `php:display_errors` with the value `On` is equivalent to placing the following in `php.ini`:

```ini
display_errors = On
```

This feature is primarily useful to override debug configuration on development environments,
such as enabling errors and configuring the Xdebug extension.

To apply a setting to all environments or have a setting differ among multiple PHP containers in one project,
specify the variables in the `.platform.app.yaml` file for your application.
See the [PHP configuration page](../../languages/php/ini.md) for more information.

### Framework-specific variables

For specific frameworks, you can implement logic to override global configurations with environment-specific variables.

The Drupal templates show examples of logic mapping variables to Drupal's configuration system.
You can apply similar logic for other frameworks.

For [Drupal 7](https://github.com/platformsh-templates/drupal7/blob/master/settings.platformsh.php),
any variable that begins with `drupal:` is mapped to the global `$conf` array,
which overrides Drupal's `variable_get()` system.
For instance, a `drupal:site_name` variable forces a site name.

For [Drupal 8](https://github.com/platformsh-templates/drupal8/blob/master/web/sites/default/settings.platformsh.php),
any variable that begins with `drupal:` or `d8settings:` is mapped to the global `$settings` array, for low-level configuration.
Any variable that begins with `d8config:` is mapped to the global `$config` array,
which is useful for overriding drupal's exportable configuration system.
In this case, the variable name needs two colons, one for `d8config:` and one for the name of the configuration object to override.
For example, a variable named `d8config:system.site:name` overrides the `name` property of the `system.site` configuration object.
