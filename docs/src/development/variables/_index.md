---
title: "Variables overview"
weight: 5
description: |
  Variables give you control over your project's build process and its runtime environment. They are set independently of the project's code base but are available to your code at build or runtime.
---

{{< description >}}

In this way, your app has additional information, such as database credentials, the host or port it can use, and which server to connect to.

## Environment-specific configuration

Once an application has been deployed, it has access to more environment variables.
That includes Platform.sh variables such as `PLATFORM_RELATIONSHIPS` and `PLATFORM_ROUTES`
as well as any [variables](/development/variables/_index.md) you define.
There will also be additional features of your `.platform.app.yaml` file that will now be accessible in `PLATFORM_APPLICATION`.
These variables can and will vary between environments, and your application is welcome to make use of that as appropriate.
You can access them directly, or via the Platform.sh Configuration Reader libraries, which are available for a number of languages.

Many applications have some configuration that should vary between different environment types.
They generally break down into three categories.

1. Service configuration for the database and such, which should always be read from `PLATFORM_RELATIONSHIPS`.
2. Mode toggles, such as a "debug" mode, disabling certain caches, displaying more verbose errors, etc.
3. API keys for remote services, especially payment gateways.

Ideally, the application will already come designed to read those values from environment variables.
If not, there is usually a way to manually bridge them.
For example, an application that has a PHP or JavaScript configuration file
can have that file modified to read the values from the environment at runtime rather than being written statically into the file.

There are several ways to set an environment variable.
Which one is preferred depends on the specific use case.

### Universal environment variables

For environment variables that should be consistent across all environments,
the easiest place to set them is in the `.platform.app.yaml` file itself.
That way it can be versioned "just like code."

```yaml
variables:
    env:
        MY_ENV_VAR: "some value"
```

The `env:` prefix will expose `MY_ENV_VAR` as a Unix environment variable.
It will be accessible through your language's normal environment API.

### Development/production environment variables

For variables that should vary between production and "other" environments, such as API gateway credentials,
the most convenient approach is to set the "other" version as a [project-level variable](/development/variables/_index.md#project-variables)
(shared by all environments, and optionally accessible during build) and then override it just on the production branch.




## Overrides

If the names of variables at different levels match,
an environment variable overrides a variable with the same name in a parent environment
and both override a project variable.

For example, suppose you have the following inheritable variables defined for the `main` environment:

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
echo $PLATFORM_VARIABLES | base64 --decode | json_pp
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
navigate to that environment's variables settings.
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

By default, project and environment variables are only added to the `$PLATFORM_VARIABLES` environment variable. You can also expose a variable as its own environment variable by giving it the prefix `env:`.

For example, the variable `env:foo` creates an environment variable called `FOO`. (Note the automatic upper-casing.)

```bash
platform variable:create --name env:foo --value bar
```

You can then access that variable directly:

```bash
$ echo $FOO
bar
```

### PHP-specific variables

Any variable with the prefix `php:` is added to the `php.ini` configuration of all PHP-based application containers.

For example, an environment variable named `php:display_errors` with the value `On` is equivalent to placing the following in `php.ini`:

```ini
display_errors = On
```

This feature is primarily useful to override debug configuration on development environments, such as enabling errors or configuring the Xdebug extension.

To apply a setting to all environments or to vary them between different PHP containers in the same project, specify the variables in the `.platform.app.yaml` file for your application. See the [PHP configuration page](/languages/php/ini.md) for more information.

### Framework-specific variables

For specific frameworks, you can implement logic to override global configurations with environment-specific variables. For Drupal, for example, there is logic defined in a file in your Git repository, which you can change as you want. Logic similar to the following could be applied for other frameworks.

As a convention, our provided Drupal template code will automatically map variables to Drupal's configuration system. The logic varies slightly depending on the Drupal version.

On [Drupal 7](https://github.com/platformsh-templates/drupal7/blob/master/settings.platformsh.php), any variable that begins with `drupal:` will be mapped to the global `$conf` array, which overrides Drupal's `variable_get()` system. For instance, to force a site name from the Platform.sh variables, set the `drupal:site_name` variable.

On [Drupal 8](https://github.com/platformsh-templates/drupal8/blob/master/web/sites/default/settings.platformsh.php), any variable that begins with `drupal:` will be mapped to the global `$settings` array. That is intended for very low-level configuration.

Also on Drupal 8, any variable that begins with `d8config:` will be mapped to the global `$config` array, which is useful for overriding drupal's exportable configuration system. The variable name will need to contain two colons, one for `d8config:` and one for the name of the configuration object to override. For example, a variable named `d8config:system.site:name` will override the `name` property of the `system.site` configuration object.

## Shell variables

You can also provide a `.environment` file as part of your application, in your application root (as a sibling of your `.platform.app.yaml` file, or files in the case of a multi-app configuration). That file will be sourced as a bash script when the container starts and on all SSH logins. It can be used to set any environment variables directly, such as the PATH variable. For example, the following `.environment` file will allow any executable installed using Composer as part of a project to be run regardless of the current directory:

```bash
export PATH=/app/vendor/bin:$PATH
```

Note that the file is sourced after all other environment variables above are defined, so they will be available to the script. That also means the `.environment` script has the "last word" on environment variable values and can override anything it wants to.

## Variable mapping

If the application needs a different set of environment variable names than the variables set by Platform.sh
(which is common for database connections),
they can be mapped over from Platform.sh's variable names to those required by the application.
That can be done in the application with the help of the Config Reader libraries, if it offers a place to do so,
or via a shell script.

For example, the following `.environment` script, located in the application root,
runs automatically on every shell invocation (application startup or SSH login),
and variables it exports are visible to the application.
It uses the `jq` library, which is included in all application containers for this purpose.

```bash
# .environment

export APP_DATABASE_HOST=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].host")
export APP_DATABASE_PORT=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].port")
export APP_DATABASE_NAME=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].path")
export APP_DATABASE_USER=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].username")
export APP_DATABASE_PASSWORD=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].password")
```

## Using `.env` files

Many applications have adopted a convention of using a file named `.env` in the application root for configuration.
Specifically, `.env` provides a place for fallback configuration in case an environment variable is not set.
An application that uses `.env` files correctly looks, on startup, for a `.env` file
and map each value found there to an environment variable within the application,
if and only if that environment variable is not already defined.

`.env` files are very useful for environment-variable-configured applications in local development,
as they allow developers to avoid setting a global environment variable on their whole computer
just to configure the application to talk to a local test database or similar.
However, `.env` files should not be used in production.
In production, the application should read directly from real environment variables.
That also means *the `.env` file should never be committed to Git*.
It should be explicitly excluded in `.gitignore` to avoid confusion,
as its values will vary with every local developer's own computer.
A `.env` file should never be used on a Platform.sh environment.
