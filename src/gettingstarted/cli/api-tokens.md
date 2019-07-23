# API Tokens

## Obtaining a token

The Platform.sh CLI can also be used from CI services or other automation tools, and supports an API Token authentication option for that purpose.

An API token can be created through the management console. Go to the "User" page from your account drop-down, then select the "Account Settings" tab, then "API Tokens".

Click the "Create an API Token" link. 

![API Token screen](/images/management-console/account-api-tokens-new.png)

You may be asked to reverify your password, then enter a unique application name to identify the token.

![API Token screen](/images/management-console/account-api-tokens-edit.png)

After creating the token it will be displayed once at the top of the page in a green banner.  You may also view it later by clicking the "view" link next to the token name.  You will be asked to reverify your password as well when viewing the token.

Now set that token to an environment variable named `PLATFORMSH_CLI_TOKEN` on your system where the CLI will run.  Consult the documentation for your CI system to see how to do that.

> **note**
> If running CLI commands from any automated system, including a Platform.sh cron task, we urge you to use the `--no-wait` flag on any commands that may take more than a second or two to avoid blocking the process.

## Machine users

For security reasons we recommend to create a dedicated `machine user` to run automation tasks such as taking backups, renewing SSL certificates or triggering source operations. We also recommend to create a unique `machine user` for each project to be automated. 

Like human users, every `machine user` account needs its own unique email address.

The `machine user` can be given a very restrictive set of permissions limited to just its needed tasks. Backups, for instance, require `Admin` access but no SSH key, while checking out code from a CI server to run tests on it would require an SSH key but only `Reader` access.

It will also show up in logs and activity streams as a separate entry from human users.
 
Consult the [Users](/administration/users.md) documentation for more information about the differences between access levels.

## Install the CLI on a Platform.sh environment

A common use case for an API token is to allow the Platform.sh CLI to be run on an app container, often via a cron hook.  An API token is necessary for authentication, but the CLI will be able to auto-detect the current project and environment.

First, create a `machine user` (see above) that you invite to your project. Then, login as that `machine user` to obtain an API token. Set this token as the [top-level](https://docs.platform.sh/development/variables.html#top-level-environment-variables) environment variable `env:PLATFORMSH_CLI_TOKEN` either through the management console or via the CLI, like so:

```bash
platform variable:create -e master --level environment --name env:PLATFORMSH_CLI_TOKEN --sensitive true --value 'your API token'
```

> **note**
> It is important to include the `env:` so as to expose `$PLATFORMSH_CLI_TOKEN` on its own as a top level Unix environment variable, rather than as a part of `$PLATFORM_VARIABLES` like normal environment variables.

Second, add a build hook to your `.platform.app.yaml` file to download the CLI as part of the build process.

```yaml
hooks:
    build: |
        curl -sS https://platform.sh/cli/installer | php
```

This will download the CLI to a known directory, `.platformsh/bin`, which will be added to the PATH at runtime (via the .environment file). Because the API token is available, the CLI will now be able to run authenticated commands, acting as the user who created the token.

You can now call the CLI from within the shell on the app container, or via a cron hook.  Note that if you want a cron to run only on the production environment you will need to wrap it in an if-check on the `$PLATFORM_BRANCH` variable, like so:

```yaml
crons:
    snapshot:
        spec: '0 5 * * *'
        cmd: |
            if [ "$PLATFORM_BRANCH" = master ]; then
                platform snapshot:create --yes --no-wait
            fi
```

> **note**
> Seriously, please use `--no-wait` for all CLI commands placed in a cron hook. Failure to do so may result in long deploy times and site downtime.
