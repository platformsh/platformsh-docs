---
title: "[Beta] Source operations"
weight: 13
toc: false
sidebarTitle: "Source operations"
tier:
  - Elite
  - Enterprise
---

An application can define a number of operations that apply to its source code and that can be automated.

{{< note >}}

Source Operations are currently in Beta.
While the syntax is not expected to change, some behavior might in the future.

{{< /note >}}

A basic, common source operation could be to automatically update dependencies.
For instance, with composer:

```yaml
source:
    operations:
        update:
            command: |
                set -e
                composer update
                git add composer.lock
                git commit -m "Update Composer dependencies."
```

The `update` key is the name of the operation.
It is arbitrary, and multiple source operations can be defined.
(You may wish to include more robust error handling than this example.)

The environment resource gets a new `source-operation` action which can be triggered by the CLI:

```bash
platform source-operation:run update
```

The `source-operation:run` command takes the command name (i.e. `update`) to run.
Additional variables can be added to inject into the environment of the source operation.
They will be interpreted the same way as any other [variable](/development/variables.md) set through the management console or the CLI,
which means you need an `env:` prefix to expose them as a Unix environment variable.
They can then be referenced by the source operation like any other variable.

```bash
platform source-operation:run update --variable env:FOO=bar --variable env:BAZ=beep
```

When this operation is triggered:

* A clean Git checkout of the current environment HEAD commit is created;
  this checkout doesn't have any remotes or any of the tags defined in the project, but only has the current environment branch.
* Sequentially, for each application that has defined this operation,
  the operation command is launched in the container image of the application.
  The environment will have all of the variables available during the build phase,
  optionally overridden by the variables specified in the operation payload.
* At the end of the process, if any commits were created,
  the new commits are pushed to the repository and the normal build process of the environment is triggered.

Note that these operations run in an isolated container that is not part of the runtime cluster of the environment
and doesn't require the environment to be running.


Also, if multiple applications in a single project both result in a new commit,
that will appear as two distinct commits in the Git history but only a single new build/deploy cycle will occur.
If multiple applications define source operations with the same name, they will all be executed sequentially on each application.

## Source Operations usage examples

### Update a site from an upstream repository or template

The following Source Operation syncronizes your branch with an upstream Git repository.

1. Add a project-level variable named `env:UPSTREAM_REMOTE` with the Git URL of the upstream repository.
That will make that repository available as a Unix environment variable in all environments,
including in the Source Operations environment.

  - Variable name: `env:UPSTREAM:REMOTE`
  - Variable example value: `https://github.com/platformsh/platformsh-docs`

2. In your  `.platform.app.yaml` file, define a Source Operation to fetch from that upstream repository:

  ```yaml
  source:
      operations:
          upstream-update:
              command: |
                  set -e
                  git remote add upstream $UPSTREAM_REMOTE
                  git fetch --all
                  git merge upstream/main
  ```


3. Now every time you run `platform source-operation:run upstream-update` using the CLI on a given branch,
the branch fetches all changes from the upstream git repository
and then merges the latest changes from the default` branch in the upstream repository.
If there’s a conflict merging from the upstream repository, the source operation fails and not update from upstream.

Run the `upstream-update` operation on a Development environment rather than directly on Production.

### Revert to the last commit

The following Source Operation reverts the last commit pushed to the Git repository.
This can be useful if you did not properly test the changes of another operation, and you need to quickly revert to the previous state.

In your  `.platform.app.yaml` file, define a Source Operation to revert the last commit:

```yaml
source:
    operations:
        revert:
            command: |                
                git reset --hard HEAD~
```

Now every time you run `platform source-operation:run revert` using the CLI on a given branch,
the operation will revert the last commit pushed to that branch.

### Update Drupal Core

The following source operation will use Composer to update Drupal Core.

1. In your  `.platform.app.yaml` file, define a Source Operation to update Drupal Core:

```yaml
source:
    operations:
        update-drupal-core:
            command: |
                set -e
                composer update drupal/core --with-dependencies
                git add composer.lock
                git commit -m "Automated Drupal Core update."
```

The Composer command takes the following parameter:

- `--with-dependencies`: use this parameter to also update Drupal Core dependencies.
Read more on how to [update Drupal Core via Composer on Drupal.org](https://www.drupal.org/docs/updating-drupal/updating-drupal-core-via-composer).

Now every time you run `platform source-operation:run update-drupal-core` using the CLI on a given branch,
the operation will update Drupal Core.

### Download a Drupal extension

The following Source Operation will download a Drupal extension.
You can define the Drupal extension by setting an `$EXTENSION` variable
or overriding the `$EXTENSION` variable when running the Source Operation.

1. In your  `.platform.app.yaml` file, define a Source Operation to update Drupal Core:

```yaml
source:
    operations:
        download-drupal-extension:
            command: |
                set -e
                composer require $EXTENSION
                git add composer.json
                git commit -am "Automated install of: $EXTENSION via Composer."
```

The Composer command takes the following parameter:

- `--with-dependencies`: use this parameter to also update Drupal Core dependencies.
Read more on how to [update Drupal Core via Composer on Drupal.org](https://www.drupal.org/docs/updating-drupal/updating-drupal-core-via-composer).

Now every time you run `platform source-operation:run download-drupal-extension --variable env:EXTENSION=drupal/token`
using the CLI on a given branch,
the operation will download the `drupal/token` on that branch.

Note that the if its a new extension, after the Source Operation finishes,
you need to enable the new extension via the Drupal management interface or using Drush.

## External integrations

If your project is using an external Git integration,
any new commits resulting from updating your branch using a Source Operation will be first pushed to that external Git repository.
After that, the Git integration pushes those commits to Platform.sh, effectively redeploying the environment.


When using an external Git integration,
you can not run Source Operations on environments created from pull or merge requests created on the external repository. 

If you try running a Source Operation on a non-supported environment, the following error will be triggered:

  ```text
  [ApiFeatureMissingException] 
  This project does not support source operations.
  ```

## Automated Source Operations using cron

You can use cron to automatically run your source operations.

{{< note >}}

Automated source operations using cron requires to [get an API token and install the CLI in your application container](/development/cli/api-tokens.md).

{{< /note >}}

Once the CLI is installed in your application container and an API token has been configured,
you can add a cron task to run your source operations once a day.
We do not recommend triggering source operations on your production environment,
but rather on a dedicated environment which you can use for testing before deployment.

The example below synchronizes the `update-dependencies` environment with its parent before running the `update` source operation:

```yaml
crons:
    update:
        # Run the 'update' source operation every day at midnight.
        spec: '0 0 * * *'
        cmd: |
            set -e
            if [ "$PLATFORM_BRANCH" = update-dependencies ]; then
                platform environment:sync code data --no-wait --yes
                platform source-operation:run update --no-wait --yes
            fi
```
