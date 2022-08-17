---
title: "Authenticating with API tokens"
sidebarTitle: "API tokens"
weight: 1
---

When setting up CI services and other automation tools,
you may want to allow them to use the Platform.sh CLI to carry out certain tasks.
Logging in via a browser is not an option in these cases.

To run the CLI from such a tool or on an app container, such as via a cron hook, set up an API token to authenticate.

## Create a machine user

For security reasons, we recommend creating a dedicated machine user to run automation tasks,
such as taking backups and triggering source operations.
We also strongly recommend creating a unique machine user for each project to be automated.

Like human users, every machine user account needs its own unique email address.

The machine user can be given a very restrictive set of [access permissions](../users.md) limited to just its needed tasks.
For example, backups require `Admin` access but no SSH key,
while checking out code from a CI server to run tests on it would require an SSH key but only `Viewer` access.

It will also show up in logs and activity streams as a separate entry from human users.

To add the user:

1. In a terminal, run `platform user:add email@example.com`, replacing the email with the one for your machine user.
1. (If not within a specific project) choose a project to add the user to.
1. Press `enter` to make the user a viewer of the entire project.
1. Assign the user the correct permissions for each environment type.
   (See the [users documentation](/administration/users.md) for more on access levels.)
1. Press `enter` to send the invitation.
1. In your email, click the link in the invitation to accept and then follow the steps to create an account.

## Get a token

Once you have a machine user in place, you want to assign an API token to it.

To get an API token:

1. As the machine user, open the Console.
2. Open the user menu (your name or profile picture).
3. Click **My profile**.
4. Go to the **API Tokens** tab.
5. Click **Create API Token**.
   ![The Create API Token button in the Console](/images/management-console/api-tokens-new.png "0.6")
6. Enter a name to identify your token in the future if you have multiple tokens.
   ![Creating an API token with the name 'CI tests'](/images/management-console/api-tokens-name.png "0.6")
7. Click **Copy** to copy the token to your clipboard.
   Make sure to store the key safely as you can't view the API token again.
   ![Viewing the API token after it's created](/images/management-console/api-tokens-view.png "0.6")

## Use the API token to authenticate the CLI

Once you have the API token copied, you can use it for your automation tools.

### In another CI system

Set the token in an environment variable named `PLATFORMSH_CLI_TOKEN` on the system where the CLI will run.
Consult the documentation for your CI system to see how to do that.

{{< note >}}

If running CLI commands from any automated system,
we urge you to use the `--no-wait` flag on any commands that may take more than a second or two to avoid blocking the process.

{{< /note >}}

### On a Platform.sh environment

To allow the Platform.sh CLI to be run on an app container, such as via a cron hook, use the API token.
The CLI is able to auto-detect the current project and environment.

Set the token as the [top-level](../../development/variables/_index.md#top-level-environment-variables) environment variable `env:PLATFORMSH_CLI_TOKEN`
either [through the Console](../web/configure-environment.md#variables) or via the CLI, like so:

```bash
platform variable:create -e <BRANCH_NAME> --level environment --name env:PLATFORMSH_CLI_TOKEN --sensitive true --value '<YOUR_API_TOKEN>'
```

{{< note >}}

It's important to include the `env:` so as to expose `$PLATFORMSH_CLI_TOKEN` on its own as a top level Unix environment variable,
rather than as a part of `$PLATFORM_VARIABLES` like normal environment variables.

{{< /note >}}

Second, add a build hook to your `.platform.app.yaml` file to download the CLI as part of the build process.

```yaml
hooks:
    build: |
        curl -fsS https://platform.sh/cli/installer | php
```

This will download the CLI to a known directory, `.platformsh/bin`,
which will be added to the PATH at runtime (via the .environment file).
Because the API token is available, the CLI will now be able to run authenticated commands,
acting as the user who created the token.

You can now call the CLI from within the shell on the app container or via a cron hook.

To run a cron only on the production environment, wrap it in an if-check on the `$PLATFORM_BRANCH` variable, like so:

```yaml
crons:
    backup:
        spec: '0 5 * * *'
        commands:
            start: |
                if [ "$PLATFORM_ENVIRONMENT_TYPE" = production ]; then
                   platform backup:create --yes --no-wait
                fi
```

{{< note >}}

If running CLI commands from any automated system, including a Platform.sh cron task,
we urge you to use the `--no-wait` flag on any commands that may take more than a second or two to avoid blocking the process.
Failure to do so may result in long deploy times and site downtime.

{{< /note >}}
