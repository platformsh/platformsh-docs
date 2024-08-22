---
title: Deploy Flask on {{% vendor/name %}}
sidebarTitle: Flask
weight: -75
description: |
    Complete the last required steps to successfully deploy Flask on {{% vendor/name %}}.
---

{{< note title="Note" theme="info" >}}

Before you start, check out the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project) and the main [Getting started guide](/get-started/here/_index.md).
They provide all of the core concepts and common commands you need to know before using the materials below.

{{< /note >}}

For Flask to successfully deploy and operate, **after completing the [Getting started guide](/get-started/here/_index.md)**,
you still need to make a few changes to your {{% vendor/name %}} configuration.

{{% guides/requirements name="Django" %}}

## 1. Leverage environment variables

The CLI generated a `.environment` file during the Getting started guide.
Notice it has already created some environmental variables for you to connect to your database service.

```bash {location=".environment"}
export RELATIONSHIPS_JSON="$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)"

# Set database environment variables
export DB_HOST="$(echo $RELATIONSHIPS_JSON | jq -r '.postgresql[0].host')"
export DB_PORT="$(echo $RELATIONSHIPS_JSON | jq -r '.postgresql[0].port')"
export DB_DATABASE="$(echo $RELATIONSHIPS_JSON | jq -r '.postgresql[0].path')"
export DB_USERNAME="$(echo $RELATIONSHIPS_JSON | jq -r '.postgresql[0].username')"
export DB_PASSWORD="$(echo $RELATIONSHIPS_JSON | jq -r '.postgresql[0].password')"
export DB_CONNECTION="$(echo $RELATIONSHIPS_JSON | jq -r '.postgresql[0].scheme')"
export DATABASE_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
```

To configure all the environment variables Flask needs to run smoothly, follow these steps.

1. Set the `FLASK_APP` environment variable to specify how to load the app.

   ```bash {location=".environment"}
   export FLASK_APP="autoapp.py"
   ```

   The above example uses the file `autoapp.py` as the main entry.
   Adjust according to your situation.


2. Set the `FLASK_ENV` environment variable to enable behaviors based on the environment type.

   {{% vendor/name %}} provides information about what type of environment the app is running in via the `PLATFORM_ENVIRONMENT_TYPE` environment variable.
   Its values can be ``production``, ``development``, or ``staging``.
   Use this information to set the value for `FLASK_ENV`.

   ```bash {location=".environment"}
   export FLASK_ENV="${PLATFORM_ENVIRONMENT_TYPE}"
   ```

   Several other environmental variables need to change based on the environment type.
   Leverage the information in `PLATFORM_ENVIRONMENT_TYPE` for these other variables too.

3. Set the `FLASK_DEBUG` environment variable to ``1`` (enabled) if you're not running in production.

   ```bash {location=".environment"}
   export FLASK_DEBUG=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 0 || echo 1)
   ```

4. Do the same for `LOG_LEVEL`.

   ```bash {location=".environment"}
   export LOG_LEVEL=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo "info" || echo "debug")
   ```

5. Set the `SEND_FILE_MAX_AGE_DEFAULT` to ``0`` (disabled) if you're not in production, but a higher value if you are.

   ```bash {location=".environment"}
   export SEND_FILE_MAX_AGE_DEFAULT=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 31556926 || echo 0)
   ```

6. Optional: You may also need to set a `SECRET_KEY` environment variable.
   It's used for securely signing the session cookie and can be used for any other security-related needs by extensions or your app.
   It usually is a long random string.

   Set the `SECRET_KEY` environment variable to leverage the [`PLATFORM_PROJECT_ENTROPY` variable](/development/variables/use-variables#use-provided-variables) provided by {{% vendor/name %}}:

   ```bash {location=".environment"}
   export SECRET_KEY="${PLATFORM_PROJECT_ENTROPY}"
   ```

   Your `.environment` file should now look similar to the following:

   ```bash {location=".environment"}
   # Set database environment variables
   export DB_HOST="$POSTGRESQL_HOST"
   export DB_PORT="$POSTGRESQL_PORT"
   export DB_PATH="$POSTGRESQL_PATH"
   export DB_USERNAME="$POSTGRESQL_USERNAME"
   export DB_PASSWORD="$POSTGRESQL_PASSWORD"
   export DB_SCHEME="postgresql"
   export DATABASE_URL="${DB_SCHEME}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_PATH}"

   export FLASK_ENV="${PLATFORM_ENVIRONMENT_TYPE}"
   export FLASK_DEBUG=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 0 || echo 1)
   export LOG_LEVEL=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo "info" || echo "debug")
   export SEND_FILE_MAX_AGE_DEFAULT=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 31556926 || echo 0)
   export SECRET_KEY="${PLATFORM_PROJECT_ENTROPY}"
   ```

## 2. Configure static assets

You need to add some writable disk space to hold the static assets that `flask-static-digest` generates and `npm` builds.

To do so, define the `./<APP_NAME>/static` directory as [a mount](/create-apps/app-reference/single-runtime-image#mounts).
In your app configuration, locate the section dedicated to mounts and update it as follows:

```yaml {configFile="app"}
applications:
  myapp:
    ...
    mounts:
      "<APP_NAME>/static":
        source: "storage"
        source_path: "static_assets"
```

Replace `<APP_NAME>` with the `app_name` you defined when creating your Flask project.

## 3. Install dependencies and builds

Instruct {{% vendor/name %}} to automatically run `npm install` in addition to installing your Python dependencies
when building the application container.

To do so, customize your [build hook](/create-apps/hooks/hooks-comparison.html#build-hook).
In your app configuration, locate the section dedicated to it and update it as follows:

```yaml {configFile="app"}
applications:
  myapp:
    ...
    # Hooks allow you to customize your code/environment as the project moves through the build and deploy stages
    # More information: https://docs.upsun.com/create-apps/app-reference.html#hooks
    hooks:
      # The build hook is run after any build flavor.
      # More information: https://docs.upsun.com/create-apps/hooks/hooks-comparison.html#build-hook
      build: |
        set -eux
        pip install -r requirements.txt
```

 The {{% vendor/name %}} CLI automatically added `pip install -r requirements.txt` to your build hook configuration when you
 [configured your {{% vendor/name %}} project](/get-started/here/configure/_index.md).

 If you want `pip` to be upgraded first to the latest version, add `pip install --upgrade pip` to the above line.
 Then, add `npm install`:

```yaml {configFile="app"}
applications:
  myapp:
    ...
    # Hooks allow you to customize your code/environment as the project moves through the build and deploy stages
    # More information: https://docs.upsun.com/create-apps/app-reference.html#hooks
    hooks:
      # The build hook is run after any build flavor.
      # More information: https://docs.upsun.com/create-apps/hooks/hooks-comparison.html#build-hook
      build: |
        set -eux
        pip install --upgrade pip
        pip install -r requirements.txt
        npm install
```

Note that if your project uses a different package manager, {{% vendor/name %}} also supports [several other options](/languages/python/dependencies.md).

## 4. Configure the deploy phase

Instruct {{% vendor/name %}} to automatically run `npm run build` when building the application container.
To do so, customize your [deploy hook](/create-apps/hooks/hooks-comparison.html#deploy-hook).
In your app configuration, locate the section dedicated to it:

```yaml {configFile="app"}
applications:
  myapp:
    ...
    # Hooks allow you to customize your code/environment as the project moves through the build and deploy stages
    # More information: https://docs.upsun.com/create-apps/app-reference.html#hooks
    hooks:
      ...
      # The deploy hook is run after the app container has been started, but before it has started accepting requests.
      # More information: https://docs.upsun.com/create-apps/hooks/hooks-comparison.html#deploy-hook
      deploy: |
        set -eux
        # echo 'Put your deploy command here'
```

Add `npm run build`:

```yaml {configFile="app"}
applications:
  myapp:
    ...
    # Hooks allow you to customize your code/environment as the project moves through the build and deploy stages
    # More information: https://docs.upsun.com/create-apps/app-reference.html#hooks
    hooks:
      ...
      # The deploy hook is run after the app container has been started, but before it has started accepting requests.
      # More information: https://docs.upsun.com/create-apps/hooks/hooks-comparison.html#deploy-hook
      deploy: |
        set -eux
        npm run build
```

## 5. Configure the web server

[Configure the web server](/create-apps/_index.md#configure-whats-served) running in front of your app to define how your app handles dynamic requests.
To do so, in your app configuration, locate the section dedicated to the web server:

```yaml {configFile="app"}
applications:
  myapp:
    ...
    # The web key configures the web server running in front of your app.
    # More information: https://docs.upsun.com/create-apps/app-reference.html#web
    web:
      # Commands are run once after deployment to start the application process.
      # More information: https://docs.upsun.com/create-apps/app-reference.html#web-commands
```

To add a basic Flask server, replace the default information added by the {{% vendor/name %}} CLI with `flask run -p $PORT`.
Also, change the `socket_family` value from `unix` to `tcp`:

```yaml {configFile="app"}
applications:
  myapp:
    ...
    # The web key configures the web server running in front of your app.
    # More information: https://docs.upsun.com/create-apps/app-reference.html#web
    web:
      # Commands are run once after deployment to start the application process.
      # More information: https://docs.upsun.com/create-apps/app-reference.html#web-commands
      commands:
        start: "flask run -p $PORT"
      upstream:
        socket_family: tcp
```

You can now commit all of the above changes and push to {{% vendor/name %}}.

```bash {location="Terminal"}
git add .
git commit -m "Add changes to complete my {{% vendor/name %}} configuration"
git push
```

Note that if your Flask project requires a different web server,
{{% vendor/name %}} also supports [several other options](/languages/python/server.md), including Gunicorn, Daphne,
Uvicorn, and Hypercorn.

If you use Pip, make sure you add your chosen web server to your `requirements.txt` file.

## 6. Handle database migrations

### Prepare database migrations

If you have a new Flask project that uses [Flask-migrate](https://flask-migrate.readthedocs.io/en/latest/),
or an existing app but need to set up the initial migrations, you can do so using the database service you created earlier.

To do so, follow these steps.

1. Set up a virtual environment where your project can run:

   ```bash {location="Terminal"}
   python3 -m venv env && source venv/bin/activate
   ```

2. Just like in your build hook, update pip and install the requirements:

   ```bash {location="Terminal"}
   pip install --upgrade pip && pip install -r requirements.txt
   ```

3. Set up a way for your local instance of Flask to communicate with your database service:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} tunnel:open -y
   ```

   This opens an SSH tunnel to all the services for the app.
   You can use this connection to allow your local instance to communicate with live services as if they too were local.</br>
   To do so, you need to configure more environment variables.

4. Reopen your `.environment` file.
   Note the use of the `$PLATFORM_RELATIONSHIPS` environment variable to retrieve information about services and their credentials.</br>
   The tunnel you created gives you access to that same data,
   allowing you to generate a local `PLATFORM_RELATIONSHIPS` environment variable containing the same information.

   Set the following environment variable:

   ```bash {location=".environment"}
   export PLATFORM_RELATIONSHIPS="$({{% vendor/cli %}} tunnel:info --encode)"
   ```

   Since you now have this environmental variable set locally, you can reuse your `.environment` file for {{% vendor/name %}} to recreate
   many of the other environmental variables you need to run locally.

5. Set the following environment variables as they aren't set via ``PLATFORM_RELATIONSHIPS``:

   ```bash {location=".environment"}
   export PLATFORM_ENVIRONMENT_TYPE=production
   export PORT=8888
   export PLATFORM_PROJECT_ENTROPY=$(openssl rand -base64 32)
   ```

6. Source your `.environment` file to finish setting up all the environmental variables in your current bash:

   ```bash {location="Terminal"}
   source ./.environment
   ```

   You now have everything you need for Flask-Migrate to be able to connect to the database and generate your migration files.

### Generate database migrations

1. Initiate the migrations directory and prepare for the ``migrate`` command:

   ```bash {location="Terminal"}
   flask db init
   ```

2. Generate your migrations:

   ```bash {location="Terminal"}
   flask db migrate
   ```

3. Commit your generated migrations:

   ```bash {location="Terminal"}
   git add migrations/* && git commit -m "Adds migrations"
   ```

4. Instruct {{% vendor/name %}} to run the Flask-migrate upgrade command when deploying
   so any migration changes are automatically applied.</br>
   To do so, re-open your `.upsun/config.yaml` file.
   Locate the `deploy` hook where you added `npm run build` previously and update it as follows:

   ```yaml {configFile="app"}
   applications:
     myapp:
       ...
       # Hooks allow you to customize your code/environment as the project moves through the build and deploy stages
       # More information: https://docs.upsun.com/create-apps/app-reference.html#hooks
       hooks:
         ...
         # The deploy hook is run after the app container has been started, but before it has started accepting requests.
         # More information: https://docs.upsun.com/create-apps/hooks/hooks-comparison.html#deploy-hook
         deploy: |
           set -eux
           npm run build
           flask db upgrade
   ```

5. Commit all your changes and push to {{% vendor/name %}}.

   ```bash {location="Terminal"}
   git add .
   git commit -m "Add changes to complete my {{% vendor/name %}} configuration"
   git push
   ```

## Further resources

### Documentation

- [Python documentation](/languages/python/)
- [Managing dependencies](/languages/python/dependencies)
- [Configuring web servers](/languages/python/server)

### Community content

- [Flask topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=flask)
- [Python topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=python)

### Blogs

- [Up(sun) and running with Django](https://upsun.com/blog/setting-up-django-on-upsun/)

<!-- ## Video -->
