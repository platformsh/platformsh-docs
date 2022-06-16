---
title: "Manage Python versions"
weight: 1
toc: false
description: See how to manage different Python versions in your Platform.sh containers.
aliases:
- "/languages/python/pyenv.html"
---

You may need to use a specific version of Python that isn't available in an app container for a different language.
For example, a container might have a long-term support version, while you want the latest version.

In such cases, use a version manager to install the specific version you want to use.

## Use `pyenv`

The [`pyenv` package](https://github.com/pyenv/pyenv) lets you easily switch between multiple versions of Python.

1. Add the `pyenv` package manager in a [`build` hook](../../create-apps/hooks/hooks-comparison.md#build-hook):

   ```yaml {location=".platform.app.yaml"}
   hooks:
       build: |
           # Exit the hook on any failure
           set -e

           # Pyenv environment variables
           export PYENV_VERSION=3.6.0
           export PYENV_ROOT="$PLATFORM_CACHE_DIR/.pyenv"
           export PATH="$PYENV_ROOT/bin:$PATH"

           # Clone Pyenv to the $PLATFORM_CACHE_DIR
           if [ ! -d "$PLATFORM_CACHE_DIR/.pyenv" ]; then
               mkdir -p $PLATFORM_CACHE_DIR/.pyenv
               git clone https://github.com/pyenv/pyenv.git $PLATFORM_CACHE_DIR/.pyenv
           fi

           # Pyenv initialization
           if command -v pyenv 1>/dev/null 2>&1; then
               eval "$(pyenv init --path)"
           fi

           # Install the desired python version
           mkdir -p $PLATFORM_CACHE_DIR/.pyenv/versions
           if [ ! -d "$PLATFORM_CACHE_DIR/.pyenv/versions/$PYENV_VERSION" ]; then
               pyenv install $PYENV_VERSION
           fi

           # Pyenv set global python version
           pyenv global $PYENV_VERSION

           # Copy the .pyenv directory to $PLATFORM_APP_DIR
           cp -R $PLATFORM_CACHE_DIR/.pyenv $PLATFORM_APP_DIR

           # Pyenv rehash shims
           PYENV_ROOT="$PLATFORM_APP_DIR/.pyenv" $PLATFORM_APP_DIR/.pyenv/bin/pyenv rehash
   ```

1. Update the `$PATH` variable in the ['.environment' file](../../development/variables/set-variables.md#set-variables-via-script):

    ```yaml {location=".environment"}
    export PATH=/app/.pyenv/bin:/app/.pyenv/shims:$PATH
    ```

Now your build hook should be able to use the specified version of Python.
You can verify this by running `python --version`.

The new version python will be reflected in the runtime environment as well.
