---
title: "Authenticating with API tokens"
sidebarTitle: "API tokens"
weight: 1
---

When setting up CI services and other automation tools,
you may want to allow them to use the Platform.sh CLI to carry out certain tasks.
Logging in via a browser isn't an option in these cases.

To run the CLI from such a tool or on an app container, such as via a cron hook, set up an API token to authenticate.

## Create a machine user

For security reasons, we recommend creating a dedicated machine user to run automation tasks,
such as taking backups and triggering source operations.
We also strongly recommend creating a unique machine user for each project to be automated.

Like human users, every machine user account needs its own unique email address.

The machine user can be given a very restrictive set of [access permissions](../users.md) limited to just its needed tasks.
For example, backups require `Admin` access but no SSH key,
while checking out code from a CI server to run tests on it would require an SSH key but only `Viewer` access.

It also shows up in logs and activity streams as a separate entry from human users.

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

Set the token in an environment variable named `PLATFORMSH_CLI_TOKEN` on the system where the CLI runs.
Consult the documentation for your CI system to see how to do that.

{{< note >}}

If running CLI commands from any automated system,
we urge you to use the `--no-wait` flag on any commands that may take more than a second or two to avoid blocking the process.

{{< /note >}}

### On a Platform.sh environment

To allow the Platform.sh CLI to be run on an app container, such as via a cron hook, use the API token.
The CLI can automatically detect the current project and environment.

Set the token as a [top-level environment variable](../../development/variables/_index.md#top-level-environment-variables)
either using the [CLI](../cli/_index.md) or in the [Console](../web/_index.md):

{{< codetabs >}}
---
title:Using the CLI
file=none
highlight=false
---

Run the following command:

```bash
platform variable:create -e {{< variable "ENVIRONMENT_NAME" >}} --level environment --prefix 'env:' --name PLATFORMSH_CLI_TOKEN --sensitive true --value '{{< variable "API_TOKEN" >}}' --json false --enabled true --inheritable false --visible-build true --visible-runtime true
```

<--->
---
title:In the Console
file=none
highlight=false
---

1. Open the environment where you want to add the variable.
2. Click {{< icon settings >}} **Settings**.
3. Click **Variables**.
4. Click **+ Add variable**.
5. In the **Variable name** field, enter `env:PLATFORMSH_CLI_TOKEN`.
6. In the **Value** field, enter your API token.
7. Make sure the **Available at runtime** and **Sensitive variable** options are selected.
8. Click **Add variable**.

{{< /codetabs >}}

Then add a build hook to your app configuration to install the CLI as part of the build process.

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        set -e
        echo "Downloading homebrew from repository"
        curl -SsL https://github.com/Homebrew/brew/tarball/master -o brew.tar.gz

        echo "Unpacking homebrew into .linuxbrew folder"
        mkdir -p $PLATFORM_APP_DIR/.linuxbrew
        tar xzf brew.tar.gz --strip-components 1 -C $PLATFORM_APP_DIR/.linuxbrew/
        rm brew.tar.gz

        echo "Initializing homebrew"
        eval $($PLATFORM_APP_DIR/.linuxbrew/bin/brew shellenv)
        brew analytics off

        echo "Installing Platform.sh CLI"
        brew install platformsh/tap/platformsh-cli

        echo "Sourcing CLI for runtime and SSH access"
        echo 'export PATH="'$PLATFORM_APP_DIR'/.linuxbrew/bin:'$PLATFORM_APP_DIR'/.linuxbrew/sbin${PATH+:$PATH}";' >> $PLATFORM_APP_DIR/.environment
```

This downloads the CLI to a known directory, `.platformsh/bin`,
which is added to the PATH at runtime (via the .environment file).
Because the API token is available, the CLI can now run authenticated commands,
acting as the user who created the token.

You can now call the CLI from within the shell on the app container or via a cron hook.

For caching and other advanced topics,
copy and use a [prepared script](https://github.com/matthiaz/platformsh-tools/blob/master/install_brew_packages.sh):

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        set -e
        bash install_brew_packages.sh platformsh/tap/platformsh-cli
```

To run a cron only on your production environment, check the environment type as in the following example:

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

If you're running CLI commands from any automated system, including a Platform.sh cron task,
it's best to use the `--no-wait` flag on any commands that may take more than a second or two to avoid blocking the process.
Failure to do so may result in long deploy times and site downtime.

{{< /note >}}
