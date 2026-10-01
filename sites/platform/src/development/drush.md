---
title: "Use Drush with {{% vendor/name %}}"
weight: 15
sidebarTitle: Drush
description: |
  Install Drush, make it available on your path, and run Drush commands against your Drupal site on {{% vendor/name %}} through the CLI, SSH, or hooks.
---

[Drush](https://www.drush.org/) is a command-line shell and scripting interface for Drupal.
On {{% vendor/name %}}, you have several ways to run it: through the `{{% vendor/cli %}}` CLI, over SSH, or from within your app's hooks.
This guide covers how to install Drush, make it available on your path, and choose the right way to run it for your use case.

## Before you begin

You need:

- A [Drupal site](/guides/drupal/_index.md) deployed on {{% vendor/name %}}.
- The [`{{% vendor/cli %}}` CLI](/administration/cli/_index.md) installed and authenticated.

## 1. Install Drush

Add Drush to your project as a Composer dependency:

```bash
composer require drush/drush
```

Drush needs a writable scratch space for its own caches and backups.
Define [mounts](/create-apps/image-properties/mounts.md) for both in your app configuration,
and set [`disk`](/create-apps/app-reference/single-runtime-image.md#top-level-properties) to allocate space for them:

```yaml {configFile="app"}
disk: 512
mounts:
  '/.drush':
    source: local
    source_path: drush
  '/drush-backups':
    source: local
    source_path: drush-backups
```

## 2. Make Drush available on your path

Composer installs Drush to your project's `vendor/bin` directory, which isn't on your path by default.
This is what makes running `drush` directly return `drush: command not found`.

Add the following to a [`.environment` file](/development/variables/set-variables.md#set-variables-via-script) at the root of your app so Drush (and any other Composer binary) is available whenever you connect.
The same file also sets `DRUSH_OPTIONS_URI` from your [routes](/define-routes/_index.md), which many Drush commands (such as `drush uli` for one-time login links) need to know your site's URL:

```text {location=".environment"}
# Allow executable app dependencies from Composer to be run from the path.
if [ -n "$PLATFORM_APP_DIR" -a -f "$PLATFORM_APP_DIR"/composer.json ] ; then
  bin=$(composer config bin-dir --working-dir="$PLATFORM_APP_DIR" --no-interaction 2>/dev/null)
  export PATH="${PLATFORM_APP_DIR}/${bin:-vendor/bin}:${PATH}"
fi

# Set the URI for Drush commands.
export PRIMARY_ROUTE_URL="$(echo "$PLATFORM_ROUTES" | base64 --decode | jq -r 'to_entries[] | select(.value.primary) | .key | rtrimstr("/")')"
export DRUSH_OPTIONS_URI="$PRIMARY_ROUTE_URL"
```

## Run Drush commands

There are three ways to run Drush commands against a deployed environment, depending on your use case.

### Using the CLI

The `{{% vendor/cli %}}` CLI has a built-in [`drush` alias](/administration/cli/reference.md#environmentdrush) that runs a command against a remote environment without opening a full SSH session:

```bash
{{% vendor/cli %}} drush -- <COMMAND>
```

For example, to rebuild the cache on your current environment:

```bash
{{% vendor/cli %}} drush -- cache-rebuild
```

This is the fastest option for one-off commands, and it works the same way whether or not Drush is on your local machine.

### Over SSH

To run Drush as part of a longer interactive session, [connect over SSH](/development/ssh/_index.md) and run Drush directly, or pass the command inline:

```bash
{{% vendor/cli %}} ssh -e feature -- drush -y cache-rebuild
```

Replace `feature` with the name of the environment you want to target.

#### Use Drush aliases

A Drush alias lets you run `drush @myproject.main <COMMAND>` from your local machine without connecting over SSH first.
The `{{% vendor/cli %}}` CLI generates these for you automatically when you clone a project with `{{% vendor/cli %}} get`.
See [how to view and recreate your aliases](/guides/drupal/deploy/next-steps.md#use-drush-aliases) and the [`local:drush-aliases` command reference](/administration/cli/reference.md#localdrush-aliases).

### In hooks

To run Drush automatically on every deployment, add it to a [`deploy` or `post_deploy` hook](/create-apps/hooks/hooks-comparison.md).
This assumes Drush is already [on your path](#2-make-drush-available-on-your-path). Without that, the hook fails with `drush: command not found`:

```yaml {configFile="app"}
hooks:
  deploy: |
    cd /app/web
    if [ -n "$(drush status --field=bootstrap)" ]; then
      drush -y cache-rebuild
      drush -y updatedb
      if [ -n "$(ls $(drush php:eval "echo realpath(Drupal\Core\Site\Settings::get('config_sync_directory'));")/*.yml 2>/dev/null)" ]; then
        drush -y config-import
      fi
    fi
```

The `drush status --field=bootstrap` check confirms Drupal is installed and bootstraps successfully before running further commands,
which avoids failed deployments on a fresh environment that hasn't been installed yet.

## Common commands

The following Drush commands are frequently useful in a {{% vendor/name %}} workflow:

| Command | Purpose |
| --- | --- |
| `drush cache-rebuild` (`drush cr`) | Rebuild all Drupal caches. |
| `drush updatedb` (`drush updb`) | Run pending database updates. |
| `drush config-import` (`drush cim`) | Import configuration from the sync directory. |
| `drush sql:sanitize` | Remove personally identifiable information from a database. See [sanitizing MariaDB with Drush](/development/sanitize-db/mariadb.md). |
| `drush uli` | Generate a one-time login link for an administrator. |
| `drush state:set` | Set a Drupal state value, useful for gating one-time deploy hook logic. |

## Troubleshooting

### `composer require drush/drush` fails

If Composer reports that it can't find `drush/drush`, or blocks the install over a security advisory, this is usually a version mismatch rather than a network issue:

- **Package not found**: Drush's minimum PHP requirement increases with each major version. If your app's PHP version is older than any available Drush release supports, Composer reports it as unable to find a matching package. Check your app's PHP version against [Drush's current requirements](https://www.drush.org/latest/install/), and pin to an older Drush major version if you can't upgrade PHP yet, for example `composer require drush/drush:^11`.
- **Security-advisory conflict**: If your `composer.json` includes a package like `roave/security-advisories`, it blocks installing versions with known vulnerabilities. Composer's error output names the exact conflicting package and version — upgrade Drush past that range to resolve it.

### `drush: command not found`

Confirm Drush is installed as a Composer dependency and that
[your path includes `vendor/bin`](#2-make-drush-available-on-your-path).

### A command returns the wrong domain

If a command that depends on the site URI (such as `drush uli`) returns the wrong domain or an error,
confirm [`DRUSH_OPTIONS_URI` is set](#2-make-drush-available-on-your-path) for the environment you're running against.

### Drush can't query the database on a multisite install

On a multisite Drupal install, running a bare `drush` command can fail with an error like the following:

```bash
Command config-get was not found. Drush was unable to query the database.
```

This happens because Drush can't determine which site to target when there are multiple sites under your site directory (for example, `web/sites`).
Specify the site with the `-l` (`--uri`) flag. Despite the flag's name, use the site's subdirectory name (for example, `site1`), not a full URL:

```bash
drush -l <SITE> <COMMAND>
```

To run the same command across every site, loop over each site directory:

```bash
cd web/sites
for site in site1 site2 site3; do
  drush -l $site <COMMAND>
done
```

## See also

- [Deploy Drupal on {{% vendor/name %}}](/guides/drupal/_index.md)
- [Sanitizing databases: MariaDB and Drupal](/development/sanitize-db/mariadb.md)
- [Connect securely with SSH](/development/ssh/_index.md)
- [`environment:drush` CLI reference](/administration/cli/reference.md#environmentdrush)
