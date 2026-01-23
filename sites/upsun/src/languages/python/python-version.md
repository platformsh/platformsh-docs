---
title: Manage Python versions in non-Python containers
sidebarTitle: Python in non-Python containers
weight: 0
description: See how to manage different Python versions in your {{% vendor/name %}} containers.
---

{{% composable/disclaimer %}}

You may need to use a specific version of Python that isn't available in an app container for a different language.
For example, a container might have a long-term support version, while you want the latest version.

In such cases, use [uv](https://docs.astral.sh/uv/) or [Pyenv](https://github.com/pyenv/pyenv) version manager to install the specific version you want to use.

## uv

1.  Add your target Python version as a [variable](../../development/variables/_index.md):

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'php:{{% latest "php" %}}'
    variables:
      env:
        # Update for your desired Python version.
        PYTHON_VERSION: "3.11"
```
2.  Add uv in a [`build` hook](../../create-apps/hooks/hooks-comparison.md#build-hook):

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'php:{{% latest "php" %}}'
    variables:
      env:
        # Update for your desired Python version.
        PYTHON_VERSION: "3.11"
    hooks:
      build: |
        # Exit the hook on any failure
        set -e

        # Install uv
        curl -LsSf https://astral.sh/uv/install.sh | sh

        # Install a specific Python version
        /app/.local/bin/uv python install $PYTHON_VERSION

        # Install a package using specific Python version
        /app/.local/bin/uv tool install --python $PYTHON_VERSION weasyprint
```
Now your build hook can use the specified version of Python.
You can verify this by running `python --version`.

If you want this Python version to be available in the runtime environment, follow these steps:

1.  Create an [`.environment` file](../../development/variables/set-variables.md#set-variables-via-script):

    ```bash
    touch .environment
    ```

2.  Alias python for the runtime environment:

    ```yaml {location=".environment"}
    alias python=/app/.local/bin/python3.11
    ```

Now the specified Python version is used in the runtime environment.

## Pyenv

1.  Add your target Python version as a [variable](../../development/variables/_index.md):

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'php:{{% latest "php" %}}'
    variables:
      env:
        # Update for your desired Python version.
        PYTHON_VERSION: "3.11.0"
```
2.  Add Pyenv in a [`build` hook](../../create-apps/hooks/hooks-comparison.md#build-hook):

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'php:{{% latest "php" %}}'
    variables:
      env:
        # Update for your desired Python version.
        PYTHON_VERSION: "3.11.0"
    hooks:
      build: |
        # Exit the hook on any failure
        set -e

        # Clone Pyenv to the build cache if not present
        if [ ! -d "$PLATFORM_CACHE_DIR/.pyenv" ]; then
            mkdir -p $PLATFORM_CACHE_DIR/.pyenv
            git clone https://github.com/pyenv/pyenv.git $PLATFORM_CACHE_DIR/.pyenv
        fi

        # Pyenv environment variables
        export PYENV_ROOT="$PLATFORM_CACHE_DIR/.pyenv"
        export PATH="$PYENV_ROOT/bin:$PATH"

        # Initialize Pyenv
        if command -v pyenv 1>/dev/null 2>&1; then
            eval "$(pyenv init --path)"
        fi

        # Install desired Python version
        mkdir -p $PLATFORM_CACHE_DIR/.pyenv/versions
        if [ ! -d "$PLATFORM_CACHE_DIR/.pyenv/versions/$PYTHON_VERSION" ]; then
            pyenv install $PYTHON_VERSION
        fi

        # Set global Python version
        pyenv global $PYTHON_VERSION
```
Now your build hook can use the specified version of Python.
You can verify this by running `python --version`.

If you want this Python version to be available in the runtime environment, follow these steps:

1.  Copy Pyenv to your runtime environment at the end of your build hook:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'php:{{% latest "php" %}}'
    hooks:
      build: |
        ...

        # Copy Pyenv directory to runtime directory
        cp -R $PLATFORM_CACHE_DIR/.pyenv $PLATFORM_APP_DIR

        # Rehash Pyenv for new (runtime) location
        PYENV_ROOT="$PLATFORM_APP_DIR/.pyenv" $PLATFORM_APP_DIR/.pyenv/bin/pyenv rehash
```
2.  Create an [`.environment` file](../../development/variables/set-variables.md#set-variables-via-script):

    ```bash
    touch .environment
    ```

3.  Update the PATH for the runtime environment:

    ```yaml {location=".environment"}
    export PATH=/app/.pyenv/bin:/app/.pyenv/shims:$PATH
    ```

Now the specified Python version is used in the runtime environment.
