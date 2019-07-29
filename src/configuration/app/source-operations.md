---
search:
    keywords: ['.platform.app.yaml', 'automated', 'code', 'source', 'update', 'operation', 'dependencies', 'auto']
---

# Source operations

> **note**
>
> Source Operations are currently in beta.  While the syntax is not expected to change, some behavior might in the future.

An application can define a number of operations that apply to its source code and that can be automated.

A basic, common source operation could be to automatically update Composer dependencies like this:

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

The `update` key is the name of the operation. It is arbitrary, and multiple source operations can be defined.

(You may wish to include more robust error handling than this example.)

The environment resource gets a new `source-operation` action which can be triggered by the CLI:

```bash
platform source-operation:run update
```

The `source-operation:run` command takes the command name to run. Additional variables can be added to inject into the environment of the source operation.  They will be interpreted the same way as any other [variable](/development/variables.md) set through the UI or CLI, which means you need an `env:` prefix to expose them as a Unix environment variable.  They can then be referenced by the source operation like any other variable.

```bash
platform source-operation:run update --variable env:FOO=bar --variable env:BAZ=beep
```

When this operation is triggered:

* A clean Git checkout of the current environment HEAD commit is created; this checkout doesn't have any remotes, has all the tags defined in the project, but only has the current environment branch.
* Sequentially, for each application that has defined this operation, the operation command is launched in the container image of the application.  The environment will have all of the variables available during the build phase, plus `PLATFORM_BRANCH` and `PLATFORM_ENVIRONMENT`, optionally overridden by the variables specified in the operation payload.
* At the end of the process, if any commits were created, the new commits are pushed to the repository and the normal build process of the environment is triggered.

Note that these operations run in an isolated container: it is not part of the runtime cluster of the environment, and doesn't require the environment to be running.  Also be aware that if multiple applications in a single project both result in a new commit, that will appear as two distinct commits in the Git history but only a single new build/deploy cycle will occur.

## Automated Source Operations using cron

You can use cron to automatically run your source operations.

> **note**
>
> Automated source operations using cron requires to [get an API token and install the CLI in your application container](/development/cli/api-tokens.md).

Once the CLI is installed in your application container and an API token has been configured, you can add a cron task to run your source operations once a day. We do not recommend triggering source operations on your `master` production environment, but rather on a dedicated environment which you can use for testing before deployment.

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
