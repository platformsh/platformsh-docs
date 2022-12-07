---
title: "Authenticate the CLI using an API token"
sidebarTitle: "API tokens"
weight: 1
---

You need to set up an API token to authenticate the Platform.sh CLI for any of the following tasks:
- Running automated tasks on a CI system
- Running automated tasks directly on app container, for example in a cron job

## Before you begin

You might need the [Platform.sh CLI](../cli/_index.md) to perform certain tasks.
For example, you need the CLI to do the following:
- [Check the validity of an API token](#optional-check-the-validity-of-your-api-token) 
- [Run non-CLI commands](#use-the-cli-ssh-certificate-for-other-commands) 
  after you authenticate the CLI using a `PLATFORMSH_CLI_TOKEN` environment variable

## 1. Create a machine user

To safely run automated tasks, first create machine users.
Each machine user has its own Platform.sh account associated with a unique email address.
You can grant them restrictive [access permissions](../users.md) to handle specific automated tasks.
For security purposes, create a machine user for each type of task you want to automate.

To create a machine user, follow these steps:

1. Run the following command using your machine user's email address.
   ```bash
   platform user:add {{< variable "EMAIL_ADDRESS" >}} --project {{< variable "PROJECT_ID" >}} --role viewer
   ```
2. For each [environment type](../users.md#environment-types), assign a role to your machine user depending on your needs.
3. To send an invitation to the email address provided in step 1, press **Enter**. 
4. In the email invitation, click **Create account**.
5. To create a Platform.sh account for the machine user, click **Sign up** and follow the instructions.

## 2. Create a Platform.sh API token

1. Log in to the Console as your machine user.
2. Open the user menu (your name or profile picture).
3. Click **My profile**.
4. Go to the **API tokens** tab and click **Create API token**.
5. Enter a name for your API token and click **Create API token**.
6. To copy the API token to your clipboard, click **{{< icon copy >}} Copy**.
   ![Copying the API token after it's created](/images/management-console/copy-api-token.png "0.6")
   Note that after you close the **API tokens** tab, you can't display the API token again.
7. Store the API token somewhere secure on your computer.

### Optional: check the validity of your API token

To check that your API token is valid, run the following command:

```bash
$ platform auth:api-token-login
```

When prompted, enter your API token.
You get output similar to this:

```bash
The API token is valid.
You are logged in.
```

For security reasons, rotate your API tokens regularly.
When an API token is compromised, revoke it immediately.

## 3. Authenticate the Platform.sh CLI using your API token

After you create your API token, you can use it to do the following:

-  Allow a CI system to run automated tasks using the Platform.sh CLI.
-  Run automated tasks on an app container using the Platform.sh CLI, 
   for example in a cron job. 

Note that when running CLI commands in these cases,
some operations might take time to complete. 
To avoid waiting for an operation to complete before moving on to the next one, 
use the `--no-wait` flag.

### Authenticate in a CI system

You can allow your CI system to run automated tasks using the Platform.sh CLI.
To do so, create an environment variable named `PLATFORMSH_CLI_TOKEN` with your API token as its value. 
For more information, see your CI system's official documentation.

To run SSH-based commands that aren't specific to the Platform.sh CLI,
see how to [load the proper SSH certificate](#use-the-cli-ssh-certificate-for-other-commands).

### Authenticate in a Platform.sh environment

You can run automated tasks on an app container using the Platform.sh CLI.
To do so, set your API token as a [top-level environment variable](../../development/variables/_index.md#top-level-environment-variables).

{{< codetabs >}}
---
title=Using the CLI
file=none
highlight=false
---

Run the following command:

```bash
platform variable:create -e {{< variable "ENVIRONMENT_NAME" >}} --level environment --prefix 'env' --name PLATFORMSH_CLI_TOKEN --sensitive true --value '{{< variable "API_TOKEN" >}}' --inheritable false --visible-build true --no-interaction
```

<--->
---
title=In the Console
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

You can now call the CLI from within the shell on the app container or in a cron job.

To run SSH-based commands that aren't specific to the Platform.sh CLI,
see how to [load the proper SSH certificate](#use-the-cli-ssh-certificate-for-other-commands).

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
    sendemails:
        spec: '*/7 * * * *'
        commands:
            start: |
                if [ "$PLATFORM_ENVIRONMENT_TYPE" = production ]; then
                   cd public && send-pending-emails.sh
                fi
```

## Use the CLI SSH certificate for other commands

After you authenticate the CLI using a `PLATFORMSH_CLI_TOKEN` environment variable,
you might want to run commands that aren't CLI commands.
For example, you might want to run `ssh`, `git`, `rsync`, or `scp` commands.

To do so, load the CLI SSH certificate first by running the following command:

```bash
$ platform ssh-cert:load --no-interaction
```

