---
title: Automated code updates
description: |
 Run automated code updates via source operations.
weight: 5
tier:
 - Elite
 - Enterprise
---

You can run automated code updates via a Platform.sh mechanism called source: operation.
A source operation is an operation defined in an app to apply and automate changes to its source code.

To use source operations, first define them in your [app configuration](./_index.md).
Then run them in the [Platform.sh CLI](../administration/cli/_index.md) or [Console](https://console.platform.sh).
You can also define [cron jobs](./app-reference.md#crons) to run your source operations and update your code automatically.

## 1. Define a source operation

A source operation requires two things:

- A name that must be unique within the app.
 The name is the key of the block defined under `source.operations` in your [app configuration](./app-reference.md#source).
- A `command` that defines what's run when the operation is triggered.

The syntax looks like the following:

```yaml {location=".platform.app.yaml"}
source:
   operations:
       {{< variable "NAME" >}}:
           command: {{< variable "COMMAND" >}}
```

For example, to update a file from a remote location, you could define an operation like this:

```yaml {location=".platform.app.yaml"}
source:
   operations:
       update-file:
           command: |
               set -e
               curl -O https://example.com/myfile.txt
               git add myfile.txt
               git commit -m "Update remote file"
```

The name in this case is `update-file`.

For more possibilities, see other [operation examples](#source-operation-examples).

## 2. Run a source operation

To run a source operation, you can use the CLI or Console.

{{< codetabs >}}
+++
title=In the Console
+++

1. Navigate to the environment where you want to run the operation.
2. Click {{< icon more >}} **More**.
3. Click **Run source operation**.
4. Select the operation you want to run.
5. Optional: Add the [variables](#use-variables-in-your-source-operations) required by your source operation.
6. Click **Run**.

<--->
+++
title=Using the CLI
+++

Run the following command:

```bash
platform source-operation:run {{< variable "OPERATION_NAME" >}}
```

Replace `{{< variable "OPERATION_NAME" >}}` with the name of your operation, such as `update-file`) in the [example above](#1-define-a-source-operation).

{{< /codetabs >}}

After running a source operation,
apply the changes to your local development environment by running `git pull`.

## How source operations work

When you trigger a source operation, the following happens in order:

1.  The current environment HEAD commit is checked out in Git.
    It doesn't have any remotes or tags defined in the project.
    It only has the current environment branch.

2.  Sequentially, for each app that has an operation with this name in its configuration,
    the operation command is run in the app container.
    The container isn't part of the environment's runtime cluster
    and doesn't require that the environment is running.

    The environment has all of the variables normally available during the build phase.
    These may be optionally overridden by the variables specified when the operation is run.

3.  If any new commits were created, they're pushed to the repository and the normal build process is triggered.

    If multiple apps in a single project both result in a new commit,
    there are two distinct commits in the Git history but only a single new build process.

## Use variables in your source operations

You can add variables to the environment of the source operation.

They're interpreted the same way as any other [variable](../development/variables/_index.md)
already set in your project.
That means you need an `env:` prefix to expose them as a Unix environment variable.

They can then be referenced by the source operation like any other variable.

Say you wanted to have a `FILE` variable available with the value `example.txt`.
Run the operation with the variable:

{{< codetabs >}}

+++
title=In the Console
+++

1.  Navigate to the environment where you want to run the operation.

2.  Click {{< icon more >}} **More**.

3.  Click **Run source operation**.

4.  Select the operation you want to run.

5.  Under **Add/override variables**, put `FILE` as the **Variable name** and `example.txt` as the **Value**.
    The variable is automatically prefixed with `env:`.

6.  Click **Run**.

<--->
+++
title=Using the CLI
+++

```bash
platform source-operation:run update --variable env:FILE="example.txt"
```

{{< /codetabs >}}

## Source integrations

If your project is using a [source integration](../integrations/source/_index.md),
any new commits resulting from a source operation are first pushed to your external Git repository.
Then the source integration pushes those commits to Platform.sh and redeploys the environment.

When using a source integration,
you can't run source operations on environments created from pull or merge requests created on the external repository.

If you try running a source operation on a non-supported environment, you see the following error:

```text
[ApiFeatureMissingException]
This project doesn't support source operations.
```

## Automated source operations using cron

You can use cron to automatically run your source operations.

Note that it’s best not to run source operations on your production environment,
but rather on a dedicated environment where you can test changes.

1.  Make sure you have the [Platform.sh CLI](../administration/cli/_index.md) installed
    and [an API token](../administration/cli/api-tokens.md#2-create-a-platformsh-api-token)
    so you can run a cron job in your app container.

2.  Set your API token as a top-level environment variable:

{{< codetabs >}}
+++
title=Using the CLI
+++

Run the following command:

```bash
platform variable:create --environment main --level environment --prefix 'env' --name PLATFORMSH_CLI_TOKEN --sensitive true --value 'YOUR_PLATFORMSH_CLI_TOKEN' --inheritable false --visible-build true --json false --enabled true --visible-runtime true
```

<--->
+++
title=In the Console
+++

1. Open the environment where you want to add the variable.
2. Click {{< icon settings >}} **Settings**.
3. Click **Variables**.
4. Click **+ Add variable**.
5. In the **Variable name** field, enter `env:PLATFORMSH_CLI_TOKEN`.
6. In the **Value** field, enter your API token.
7. Make sure the **Available at runtime** and **Sensitive variable** options are selected.
8. Click **Add variable**.

{{< /codetabs >}}

{{< note theme="warning" >}}

Once you add the API token as an environment variable, anyone with [SSH access](../development/ssh/_index.md) can read its value.
Make sure you carefully check your [user access on this project](../administration/users.md#manage-project-users).

{{< /note >}}

3.  Add a build hook to your app configuration to install the CLI as part of the build process:

    ```yaml {location=".platform.app.yaml"}
    hooks:
        build: |
            set -e
            echo "Installing Platform.sh CLI"
            curl -fsSL https://raw.githubusercontent.com/platformsh/cli/main/installer.sh | bash
      
            echo "Testing Platform.sh CLI"
            platform  
    ```

4.  Then, to configure a cron job to automatically update your dependencies once a day,
    use a configuration similar to the following:

    ```yaml {location=".platform.app.yaml"}
    crons:
       update:
           # Run the code below every day at midnight.
           spec: '0 0 * * *'
           commands:
               start: |
                   set -e
                       platform sync -e development code data --no-wait --yes
                       platform source-operation:run update --no-wait --yes
                   fi
    ```

The example above synchronizes the `development` environment with its parent
and then runs the `update` source operation defined [previously](#1-define-a-source-operation).

## Source operation examples

### Update dependencies

You can set up a source operation and a cron job [to automate your dependency updates](../create-apps/dependency-updates.md).

### Update a site from an upstream repository or template

The following source operation synchronizes your branch with an upstream Git repository:

1.  [Add a project-level variable](../development/variables/set-variables.md#create-project-variables)
    named `env:UPSTREAM_REMOTE` with the Git URL of the upstream repository.
    That makes that repository available as a Unix environment variable in all environments,
    including in the source operation's environment.

    - Variable name: `env:UPSTREAM_REMOTE`
    - Variable example value: `https://github.com/platformsh/platformsh-docs`

2.  In your app configuration, define a source operation to fetch from that upstream repository:

    ```yaml {location=".platform.app.yaml"}
    source:
        operations:
            upstream-update:
                command: |
                    set -e
                    git remote add upstream $UPSTREAM_REMOTE
                    git fetch --all
                    git merge upstream/main
    ``` 

3.  Now every time you run the `upstream-update` operation on a given branch,
    the branch fetches all changes from the upstream git repository
    and then merges the latest changes from the default branch in the upstream repository.
    If there’s a conflict merging from the upstream repository,
    the source operation fails and doesn't update from the upstream repository.

Run the `upstream-update` operation on a Development environment rather than directly on Production.

### Revert to the last commit

The following source operation reverts the last commit pushed to the Git repository.
This can be useful if you didn't properly test the changes of another operation
and you need to quickly revert to the previous state.

```yaml {location=".platform.app.yaml"}
source:
   operations:
       revert:
           command: |               
               git reset --hard HEAD~
```

Now every time you run the `revert` operation on a given branch,
the operation reverts to the last commit pushed to that branch.

### Update Drupal Core

The following source operation uses Composer to update Drupal Core:

```yaml {location=".platform.app.yaml"}
source:
   operations:
       update-drupal-core:
           command: |
               set -e
               composer update drupal/core --with-dependencies
               git add composer.lock
               git commit -m "Automated Drupal Core update."
```

`--with-dependencies` is used to also update Drupal Core dependencies.
Read more on how to [update Drupal Core via Composer on Drupal.org](https://www.drupal.org/docs/updating-drupal/updating-drupal-core-via-composer).

Now every time you run the `update-drupal-core` operation, it updates Drupal Core.

### Download a Drupal extension

The following source operation downloads a Drupal extension.
You can define the Drupal extension by setting an `EXTENSION` variable
or [overriding it](#use-variables-in-your-source-operations) when running the source operation.

```yaml {location=".platform.app.yaml"}
source:
   operations:
       download-drupal-extension:
           command: |
               set -e
               composer require $EXTENSION
               git add composer.json
               git commit -am "Automated install of: $EXTENSION via Composer."
```

Now every time you run the `download-drupal-extension` operation, it downloads the defined extension.

If it's a new extension, after the source operation finishes,
you need to enable the new extension via the Drupal management interface or using Drush.

### Update Git submodules

The following source operation updates all Git submodules recursively:

```yaml {location=".platform.app.yaml"}
source:
   operations:
       rebuild:
           command: |
             set -e
               git submodule update --init --recursive
               git submodule update --remote --checkout
               SHA=$(git submodule | awk -F' ' '{print $1}' | sed -s 's/+//g')
               echo -n "$SHA" > .sha
               git add .sha
               git commit --allow-empty -m "Updating submodule to commit '$SHA'"
```

Now every time you run the `rebuild` operation, it updates the Git submodules.