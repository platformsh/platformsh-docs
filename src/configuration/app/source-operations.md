---
search:
    keywords: ['.platform.app.yaml', 'automated', 'code', 'source', 'update', 'operation', 'dependencies', 'auto']
---

# Source operations

An application can define a number of operations that apply to its source code and that can be automated.

A basic, common source operation could be to automatically update Composer dependencies like this:

```yaml
source:
    operations:
        update:
            command: |
                composer update
                git add composer.lock
                git commit -m "Update Composer dependencies."
```

The `update` key is the name of the operation. It is arbitrary, and multiple source operations can be defined.

The environment resource gets a new `source-operation` action which can be triggered by the CLI:

```
platform source-operation:run update
```

The command has two parameters:

* `operation` (string): the name of the operation
* `variables` (optional, object): additional variables (in the style of variables defined in the `.platform.app.yaml`) to inject in the environment of the source operation

When this operation is triggered:

* A clean Git checkout of the current environment HEAD commit is created; this checkout doesn't have any remotes, has all the tags defined in the project, but only has the current environment branch.
* Sequentially (_the sequence is in lexicographic order of the path of the `.platform.app.yaml` file_), for each application that has defined this operation, the operation command is launched in the container image of the application, with the same type of environment you will find in a build, with the addition of all the runtime environment variables of the current environment, optionally overridden by the variables specified in the operation payload.
* At the end of the process, if any commit was created, the environment branch is updated to this commit, and the normal build process of the environment is triggered.

Note that this operation runs in an isolated environment, it is not part of the runtime cluster of the environment, and doesn't require the environment to be running.

## Automated Source Operations using cron

You can use cron to automatically run your source operations.

> **note**
>
> Automated source operations using cron requires to [get an API token and install the CLI in your application container](/gettingstarted/cli/api-tokens.md).

Once the CLI is installed in your application container and an API token configured you can add a cron task to run once a day and run your source operations. We recommend to not trigger those source operations in your `master` production environment, but on a dedicated environment which you can use for testing before deployment.

On the example below, we synchronize the `update-dependencies` environment with its parent before running the `update` source operation:
```yaml
crons:
    update:
        # Run the 'update' source operation every day.
        spec: '0 0 * * *'
        cmd: |
            if [ "$PLATFORM_BRANCH" = update-dependencies ]; then
                platform environment:sync code data --no-wait
                platform source-operation:run update
            fi
```
