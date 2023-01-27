---
title: Managing Python dependencies
weight: -100
sidebarTitle: Manage dependencies
description: |
    `.platform.app.yaml` files are flexible enough to manage Python dependencies in a variety of ways.
---

{{< description >}}

<br/>

All of the guides in this section try to show how to configure builds and deploys for each of the major Python package management tools.
If those sections are not relevant to your deployments, this guide aims to cover the basics of how to configure these tools and manage dependencies generally for all use cases.

It's also possible to define dependencies purely using the `dependencies.python3` object in `.platform.app.yaml`, but not covered in this guide as a focus.
See [that documentation](/languages/python#package-management) for more details.

## Pip

[pip](https://pip.pypa.io/en/stable/) is the primary package installer for Python. You can use pip to install pacakges from the Python Package Index and any others.
Using pip involves using `pip` or `python -m` during the build phase, where a `requirements.txt` file has been committed to the repository containing a list of all dependencies required for the application.

There are a few things to keep in mind to ensure deterministic deployments on Platform.sh.

1. **`pip` version**

    pip comes preinstalled on all Platform.sh Python containers. 
    While updates are applied regularly, it's not guaranteed that the version of pip in a container will always be the lastest version, or the version that matches your local environment.
    It may be desirable to define a specific version of pip in your deployments to further enforce repeatable builds.

    You can modify `.platform.app.yaml` to account for both for every push:

    {{< codetabs >}}

+++
title=Latest
file=none
highlight=yaml
+++
name: 'app'
type: 'python:3.11'
hooks:
    build: |
        set -eu
        # Download the latest version of pip
        python3.11 -m pip install --upgrade pip
        # Install dependencies
        pip install -r requirements.txt
<--->

+++
title=Specific version
file=none
highlight=yaml
+++
name: 'app'
type: 'python:3.11'
variables:
    env:
        PIP_VERSION: '22.3.1'
hooks:
    build: |
        set -eu
        # Download a specific version of pip
        python3.11 -m pip install pip==$PIP_VERSION
        # Install dependencies
        pip install -r requirements.txt
    {{< /codetabs >}}

    {{< note >}}
Including `set -eu` ensures that a build fails should an error occur.
    {{< /note >}}

2. **`pip freeze`**

    `requirements.txt` is flexible. 
    In it dependencies can be defined with [requirement specifiers](https://pip.pypa.io/en/stable/reference/requirement-specifiers/) that cover the latest major, to the pinned patch version.
    It is always recommended that you `pip freeze` before committing a `requirements.txt` file to pin specific package versions.
    This way, repeatable builds on Platform.sh are always ensured.

## Pipenv

[Pipenv](https://pipenv.pypa.io/en/latest/) is a package manager for Python that also creates and manages a virtual env for Python projects. 
Dependencies are tracked and defined within a `Pipfile`, after which a `Pipfile.lock` is generated to produce deterministic builds.

Like pip above, you can specify whether the latest or a specific version of Pipenv is used in your builds and deploys.
Because Pipenv depends on pip, it may also be desireable to control its version as well.

{{< codetabs >}}

+++
title=Latest
file=none
highlight=yaml
+++
name: 'app'
type: 'python:3.11'
dependencies:
    python3:
        pipenv: '*'
hooks:
    build: |
        set -eu
        # Download the latest version of pip
        python3.11 -m pip install --upgrade pip
        # Install dependencies
        pipenv install --deploy
<--->

+++
title=Specific versions
file=none
highlight=yaml
+++
name: 'app'
type: 'python:3.11'
variables:
    env:
        PIP_VERSION: '22.3.1'
dependencies:
    python3:
        pipenv: '2022.12.19'
hooks:
    build: |
        set -eu
        # Download a specific version of pip
        python3.11 -m pip install pip==$PIP_VERSION
        # Install dependencies
        pipenv install --deploy
{{< /codetabs >}}

{{< note >}}
Inlcuding `--deploy` enforces that a `Pipfile.lock` is up to date, failing a build rather than generating a new one if that isn't the case.
Including `set -eu` ensures that a build fails should that error occur.
{{< /note >}}

## Poetry

[Poetry](https://python-poetry.org/docs/) is a tool for dependency management and packaging in Python. 
It allows you to declare the libraries your project depends on and it will manage (install/update) them for you. 
Poetry offers a lockfile to ensure repeatable installs, and can build your project for distribution.
It also creates and manages virtualenvs to keep project work isolated from the rest of your system.

It isn't difficult to use Poetry on Platform.sh, but it does require a few more pieces of configuration than pip and Pipenv.

1. **Virtual environment settings**

    In the `variables.env` block of `.platform.app.yaml`, there are two variables that should be set to configure Poetry.

    ```yaml {location=".environment"}
    variables:
        env:
            POETRY_VIRTUALENVS_IN_PROJECT: true
            POETRY_VIRTUALENVS_CREATE: false
    ```

    - [`POETRY_VIRTUALENVS_IN_PROJECT`](https://python-poetry.org/docs/configuration/#virtualenvsin-project): `true` places the virtualenv at the root of the application container: `/app/.venv`.  
    - [`POETRY_VIRTUALENVS_CREATE`](https://python-poetry.org/docs/configuration/#virtualenvscreate): Setting this value to `false` ensures that the same virtual environment created during the build hook is resused in subsequent steps. 

2. **Installing Poetry**

    Like pip and Pipenv, and depending on your use case, there is the option of either using the latest version of Poetry during builds and deploys, or a specific version.

    {{< codetabs >}}

+++
title=Latest
file=none
highlight=yaml
+++
name: 'app'
type: 'python:3.11'

variables:
    env:
        POETRY_VIRTUALENVS_IN_PROJECT: true
        POETRY_VIRTUALENVS_CREATE: false

hooks:
    build: |
        set -eu

        # Download the latest version of pip
        python3.11 -m pip install --upgrade pip

        # Install and configure Poetry
        export PIP_USER=false
        curl -sSL https://install.python-poetry.org | python3 -
        export PATH="/app/.local/bin:$PATH"
        export PIP_USER=true

        # Install dependencies
        poetry install
<--->

+++
title=Specific version
file=none
highlight=yaml
+++
name: 'app'
type: 'python:3.11'

variables:
    env:
        POETRY_VERSION: '1.3.2'
        POETRY_VIRTUALENVS_IN_PROJECT: true
        POETRY_VIRTUALENVS_CREATE: false

hooks:
    build: |
        set -eu

        # Download the latest version of pip
        python3.11 -m pip install --upgrade pip

        # Install and configure Poetry
        export PIP_USER=false
        curl -sSL https://install.python-poetry.org | python3 - --version $POETRY_VERSION
        export PATH="/app/.local/bin:$PATH"
        export PIP_USER=true

        # Install dependencies
        poetry install
    {{< /codetabs >}}

    - `PATH`: `PATH` is updated following installation to make the `poetry` command available to the build hook.
       On it's own, this update will not make `poetry` available at subsequent stages, but it must be exported again elsewhere (see next step "Updating `PATH`" below).
    - `PIP_USER`: `PIP_USER` is set twice during the build hook. 
       First, it is set to `false`, to ensure that Poetry installs globally.
       Second, it is set to `true` so that all dependency installs are restricted to the virtualenv.

3. **Updating `PATH`**

    `PATH` is updated in the build hook to make `poetry` available during the build hook.
    In order to use `poetry` in a start command, a deploy hook, or during SSH sessions, it's necessary to update once more in a `.environment` file sourced by Platform.sh automatically.

    ```text {location=".environment"}
    # Updates PATH when Poetry is used, making it available during deploys and SSH.
    if [ -n "$POETRY_VERSION" ]; then
        export PATH="/app/.local/bin:$PATH"
    fi
    ```

## Anaconda

Some frameworks and tools recommend the use of Anaconda or miniconda to manage packages in Python. 
Below are a few community resources that can help get you started with them:

- [Running and installing Anaconda/Miniconda on Platform.sh](https://community.platform.sh/t/how-to-run-an-anaconda-miniconda-python-stack-on-platform-sh/230)
- [Running R Shiny using Miniconda on Platform.sh](https://community.platform.sh/t/how-to-run-r-shiny-on-platform-sh/231)