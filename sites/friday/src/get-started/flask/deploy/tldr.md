---
title: Fast-track guide to deploying a Flask app on {{% vendor/name %}}
sidebarTitle: Fast-track guide
sectionBefore: Bonus
description: The fast-track, step-by-step guide for deploying, and working with Flask on {{% vendor/name %}}.
---

Here are all the steps required to successfully generate a Flask app with Cookiecutter,
and deploy it on {{% vendor/name %}}.

`T:` Run the line in a terminal/command prompt

1. T: `pip3 install cookiecutter`
1. T: `cookiecutter https://github.com/cookiecutter-flask/cookiecutter-flask.git`
1. Follow the prompts to submit the following information:
   - Name
   - Email
   - GitHub username
   - Project name
   - App name
   - Description
   - Pipenv
   - Python version
   - Node version
   - Heroku
1. `cd` into project directory (`app_name` defined at step 3)
1. T: `git init .`
1. T: `git branch -m main`
1. T: `{{% vendor/cli %}} project:init`
1. Follow the prompts:
   - Select Python
   - Select your services
1. T: `git add .`
1. T: `git commit -m "Init commit"`
1. T: `{{% vendor/cli %}} p:create`
1. Follow the prompts:
    - Create or select your organization
    - Name your project
    - Choose a region
    - Enter the branch name defined at step 6
    - Set the project as the remote (for now)
    - Select `Y` to continue
1. Open `{{< vendor/configfile "app" >}}`
1. Find the section describing `variables`
1. Uncomment `# variables` and the `env:` line
1. Add the following configuration:

    ```yaml {configFile="app"}
    variables:
      env:
        FLASK_APP: autoapp.py
    ```
1. Find the section for `mounts`
1. Add the following configuration:

    ```yaml {configFile="app"}
    mounts:
      "app_name/static":
        source: "local"
        source_path: "static_assets"
    ```
1. Find the section for `hooks:build`
1. Add the following configuration:

    ```yaml {configFile="app"}
    hooks:
      build: |
        set -eux
        pip install --upgrade pip
        pip install -r requirements.txt
        npm install  
    ```
1. Find the section for `hooks:deploy`
1. Add the following configuration:
    ```yaml {configFile="app"}
       deploy:
         set -eux
         npm run build 
    ```
1. Find the section for `web:commands:start`
1. Add the following configuration:
    ```yaml {configFile="app"}
    web:
      commands:
        start: "flask run -p $PORT"
      upstream:
        socket_family: tcp
    ```
1. T: `git add {{< vendor/configfile "app" >}}`
1. T: `git commit -m "Adds FLASK_APP env var, adds mount for static builds, build commands, npm run build on deploy, web start command"`
1. Open your `.environment` file
1. Change `DATATABASE_URL` to: `your_service_type://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`
1. Add the following lines to `.environment`:
    ```bash {location=".environment"}
        export SECRET_KEY="${PLATFORM_PROJECT_ENTROPY}"
        export FLASK_DEBUG=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 0 || echo 1)
        export FLASK_ENV="${PLATFORM_ENVIRONMENT_TYPE}"
        export GUNICORN_WORKERS=1
        export LOG_LEVEL=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo "info" || echo "debug")
        # In production, set to a higher number, like 31556926
        export SEND_FILE_MAX_AGE_DEFAULT=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 31556926 || echo 0)
    ```
1. T: `git add .environment`
1. T: `git commit -m "Adds needed flask env vars"`
1. T: `{{% vendor/cli %}} environment:push`
1. Enter `Y`.<br/>
1. If [error](/manage-resources.md#default-resources), T: `upsun resources:set` and follow the prompts.
1. T: `python3 -m venv env`
1. T: `source venv/bin/activate`
1. T: `pip install --upgrade pip`
1. T: `pip install -r requirements.txt`
1. T: `{{% vendor/cli %}} tunnel:open -y`
1. Open `{{< vendor/configfile "app" >}}`
1. Add the following variables:
    ```yaml {configFile="app"}
    export PLATFORM_RELATIONSHIPS="$({{% vendor/cli %}} tunnel:info --encode)"
    export PORT=8888
    export PLATFORM_PROJECT_ENTROPY=$(openssl rand -base64 32)
    export PLATFORM_ENVIRONMENT_TYPE=production
    ```
1. T: `source ./.environment`
1. T: `flask db init`
1. T: `flask db migrate`
1. Open `{{< vendor/configfile "app" >}}`
1. Find the section for `hooks:deploy`
1. Add the following configuration:
    ```yaml {configFile="app"}
    deploy: |
    set -eux
    npm run build
    flask db upgrade   
    ```
1. T: `git add migrations/*`
1. T: `git commit -m "Adds migrations"`
1. T: `git add {{< vendor/configfile "app" >}}`
1. T: `git commit -m "Adds flask db upgrade to deploy hook"`
1. T: `{{% vendor/cli %}} environment:push`

The above steps do not include [setting up a local development environment](/get-started/flask/local-development/_index.md),
or [switching to Gunicorn as a web server](/get-started/flask/web-servers.md).
