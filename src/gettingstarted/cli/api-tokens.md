# API Tokens

## Obtaining a token

The Platform.sh CLI can also be used from CI services or other automation tools, and supports an API Token authentication option for that purpose.

An API token can be created through the UI.  Go to the "User" page from your accounts drop-down, then select the "Account Settings" tab, then the "API Tokens".

Click the "Create an API Token" link.  You may be asked to reverify your password, then enter a unique application name to identify the token.

![API Token screen](/images/api-token-list.png)

After creating the token it will be displayed once at the top of the page in a green banner.  You may also view it later by clicking the "view" link next to the token name.  You will be asked to reverify your password as well when viewing the token.

Now set that token to an environment variable named `PLATFORMSH_CLI_TOKEN` on your system where the CLI will run.  Consult the documentation for your CI system to see how to do that.

> **note**
>
> If running CLI commands from any automated system, including a Platform.sh cron task, we urge you to use the `--no-wait` flag on any commands that may take more than a second or two to avoid blocking the process.

## Automation users

For projects with more than one user it is often a good idea to create a dedicated "automation user" to run automation tasks such as backups.  That way, that user can be given a very restrictive set of permissions limited to just its needed tasks.  It will also show up in logs and activity streams as a separate entry from human users.

Every user account needs its own unique email address.  This account may not need an SSH key, however, depending on the task to be run.  The permissions it needs on a given project will depend on what automation tasks it will be running.  Backups, for instance, require `admin` access but no SSH key, while checking out code from a CI server to run tests on it would require an SSH key but only `reader` access.

We recommend having a separate automation user for each project to be automated.

## Automating the CLI on a Platform.sh environment

A common use case for an API token is to allow the Platform.sh CLI to be run on an app container, often via a cron hook.  An API token is necessary for authentication, but the CLI will be able to auto-detect the current project and environment.

First, obtain an API token as above.  Set it as an environment variable either through the UI or via the CLI, like so:

```bash
platform variable:create -e master --level environment --name env:PLATFORMSH_CLI_TOKEN --sensitive true --value 'your API token'
```

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
>
> Seriously, please use `--no-wait` for all CLI commands placed in a cron hook. Failure to do so may result in long deploy times and site downtime.
