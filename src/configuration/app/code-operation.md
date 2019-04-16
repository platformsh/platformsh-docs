---
search:
    keywords: ['.platform.app.yaml', 'automated', 'code', 'source', 'update', 'operation']
---

# Code operations

An application can define a number of operations that apply to its source code and that can be automated.

A basic, common code operation could look like this:

```yaml
source:
    operations:
        update:
            command: |
                composer update
                git add composer.lock
                git commit -m"Updated composer dependencies"
```

The `update` key is the name of the operation. It is arbitrary, and multiple code operations can be defined.

The environment resource gets a new `source-operation` action which can be triggered by the API:

```
platform p:curl environments/staging/source-operation \
    -X POST \
    -d '{
    "operation": "update",
    "variables": {}
    }'
```

The payload has two parameters:

* `operation` (string): the name of the operation
* `variables` (optional, object): additional variables (in the style of variables defined in the `.platform.app.yaml`) to inject in the environment of the code operation.

When this operation is triggered:

* A clean Git checkout of the current environment HEAD commit is created; this checkout doesn't have any remotes, has all the tags defined in the project, but only has the current environment branch.
* Sequentially (_the sequence is in lexicographic order of the path of the `.platform.app.yaml` file_), for each application that has defined this operation, the operation command is launched in container image of the application, with the same type of environment you will find in a build, with the addition of all the runtime environment variables of the current environment, optionally overridden by the variables specified in the operation payload.
* At the end of the process, if any commit was created, the environment branch is updated to this commit, and the normal build process of the environment is triggered.

Note that this operation runs in an isolated environment, it is not part of the runtime cluster of the environment, and doesn't require the environment to be running.
