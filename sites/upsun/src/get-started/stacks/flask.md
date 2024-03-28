---
title: Deploying Flask on Upsun
sidebarTitle: Flask
weight: -75
description: |
    Welcome to the Upsun documentation specific to the Flask microframework on Upsun.
    It includes common reference materials useful for deploying Flask, but also external community and blog resources that cover more advanced topics relevant for the framework.
---

{{< note theme="info" >}}

Before you proceed, be sure to checkout the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project) and the main [Getting started guide](/get-started/here/_index.md). These two resources provide all of the core concepts and common commands you'll need to know before using the materials below.

{{< /note >}}

Now that you have completed the [Getting started guide](/get-started/here/_index.md), there are a few remaining changes
required in order to have a successful deployment of Flask on Upsun.

## 1. Leverage environment variables

The CLI generated a `.environment` file in the previous steps.
Notice it has already created some environmental variables for you to connect to your database service.

```shell {location=".environment"}
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

Flask requires an environment variable, `FLASK_APP` which is used to specify how to load the application.  
Our example application uses the file `autoapp.py` as the main entry. 
Adjust according to your situation.

Below the last line we added above in the `.environment` file add the following:

```shell {location=".environment"}
export FLASK_APP="autoapp.py"
```

There are a few other environment variables you may want to set up. 
Upsun provides us information about what type of environment the application is running in via an environmental variable named `PLATFORM_ENVIRONMENT_TYPE` whose values can be production, development, or staging. 
We can use this information to set the value for `FLASK_ENV`.
Inside the `.environment file`, add the following line:

```shell {location=".environment"}
export FLASK_ENV="${PLATFORM_ENVIRONMENT_TYPE}"
```

Several other environmental variables will need to change based on whether we are on a production environment or not. 
We can leverage the information in `PLATFORM_ENVIRONMENT_TYPE` to not only set `FLASK_ENV` but also these other variables.
For example, we only want `FLASK_DEBUG` enabled (`1`) if we're not running in production. Inside the `.environment` file, add the following line:

```shell {location=".environment"}
export FLASK_DEBUG=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 0 || echo 1)
```

We can do something similar for `LOG_LEVEL`. Inside the .environment file, add the following line:

```shell {location=".environment"}
export LOG_LEVEL=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo "info" || echo "debug")
```

The last environmental variable that needs to be different based on environment type is `SEND_FILE_MAX_AGE_DEFAULT` where we want it to be 0 if we're not in production, but a higher value if we are. Inside the `.environment` file, add the following line:

```shell {location=".environment"}
export SEND_FILE_MAX_AGE_DEFAULT=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 31556926 || echo 0)
```

The next environmental variable you might need to set is `SECRET_KEY`. 
It's used for securely signing the session cookie and can be used for any other security-related needs by extensions or your application.
It should be a long random string.
Again, Upsun provides us with something to fill this need as an environmental variable: `PLATFORM_PROJECT_ENTROPY`.
Inside the `.environment` file, add the following line:

```shell {location=".environment"}
export SECRET_KEY="${PLATFORM_PROJECT_ENTROPY}"
```

Your `.environment` file should now look similar to the following:

```shell {location=".environment"}
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

We need to add some writable disk space to hold the static assets that `flask-static-digest` generates and `npm` builds.
To do so, define the `./<APP_NAME>/static` directory as [a mount](/create-apps/app-reference.md#mounts).
Locate the section dedicated to mounts:

```yaml {location=".upsun/config.yaml"}
applications:
    myapp:
        ...
        # mounts:
        #     "/.cache":
        #         source: "local"
        #         source_path: "cache"
```

Uncomment the `mounts` block, and add an entry describing where you want to add a writable mount:

```yaml {location=".upsun/config.yaml"}
applications:
    myapp:
        ...
        mounts:
            "<APP_NAME>/static":
                source: "storage"
                source_path: "static_assets"
```

Replacing `<APP_NAME>` above with the `app_name` you defined when creating the Flask project.

## 3. Install dependencies and builds

Next we need to instruct Upsun to automatically run `npm install` in addition to installing our Python dependencies when
building the application container. 
To do so, customize your [build hook](/create-apps/hooks/hooks-comparison.html#build-hook).
Locate the section dedicated to it:

```yaml {location=".upsun/config.yaml"}
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

 The Upsun CLI automatically added `pip install -r requirements.txt` to your build hook configuration when you
 [configured your upsun project](/get-started/here/configure/_index.md). 
 If you want `pip` to be upgraded first to the latest version, add `pip install --upgrade pip` to the above line. 
 Then, add `npm install`:

```yaml {location=".upsun/config.yaml"}
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

If your project uses a different package manager, we also support [several other options](/languages/python/dependencies.md).

## 4. Configure the deploy phase

Now we need to instruct Upsun to automatically run `npm run build` when building the application container. 
To do so, customize your [deploy hook](/create-apps/hooks/hooks-comparison.html#deploy-hook). 
Locate the section dedicated to it:

```yaml {location=".upsun/config.yaml"}
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

```yaml {location=".upsun/config.yaml"}
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
To do so, locate the section dedicated to the web server:

```yaml {location=".upsun/config.yaml"}
applications:
    myapp:
        ...
        # The web key configures the web server running in front of your app.
        # More information: https://docs.upsun.com/create-apps/app-reference.html#web
        web:
            # Commands are run once after deployment to start the application process.
            # More information: https://docs.upsun.com/create-apps/app-reference.html#web-commands
```

To add a basic Flask server, replace the default information added by the Upsun CLI with `flask run -p $PORT`. 
Also, change the `socket_family` value from `unix` to `tcp`:

```yaml {location=".upsun/config.yaml"}
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

You can now commit all of the above changes and push to Upsun.

If your Flask proejcts requires a different Web server, we also support [several other options](/languages/python/server.md), including Gunicorn, Daphne,
Uvicorn, and Hypercorn.
Make sure you have added your chosen web server to your `requirements.txt` file if using Pip.

## 6. Prepare database migrations

If you have a new Flask project that uses [Flask-migrate](https://flask-migrate.readthedocs.io/en/latest/), or an existing application but need to set up the initial migrations, we can do so using the database service we created earlier.

Let's first set up a virtual environment to run our project inside of:

```shell
python3 -m venv env && source venv/bin/activate
```

Just like in our build hook, update pip and install the requirements:

```shell
pip install --upgrade pip && pip install -r requirements.txt
```

Next, we'll need to set up a way for our local instance of Flask to communicate with our database service. 
The Upsun CLI tool gives us a method to communicate to our application's services: [upsun tunnel](/development/ssh/_index.md#use-a-direct-tunnel). 
In your terminal, run the following:

```shell
upsun tunnel:open -y
```

This opens an SSH tunnel to all the services for the application.
We can use this connection to allow our local instance to communicate with live services as if they too were local. 

To do that, we'll need to configure some environment variables similarly to how we did previously. 
If you reopen the `.environment` file, you'll notice at the top that we make use of an environment variable named `$PLATFORM_RELATIONSHIPS` in order to retrieve information about services and their credentials. 
The tunnel we created gives us access to that same data, allowing us to generate a local `PLATFORM_RELATIONSHIPS` environment variable containing the same information.

```shell
export PLATFORM_RELATIONSHIPS="$(upsun tunnel:info --encode)"
```

Since we now have this environmental variable set locally, we can reuse our `.environment` file for Upsun to recreate
many of the other environmental variables we need to run locally.

However, we have a few that aren't set via `PLATFORM_RELATIONSHIPS` that we still need to set up.

```shell {location=".environment"}
export PLATFORM_ENVIRONMENT_TYPE=production
export PORT=8888
export PLATFORM_PROJECT_ENTROPY=$(openssl rand -base64 32)
```

And last, source our `.environment` file to finish setting up all the environmental variables in our current shell:
```shell
source ./.environment
```

We now have everything we need for Flask-Migrate to be able to connect to the database and generate our migration files.
First, initiate the migrations directory and prepare for the migrate command:

```shell
flask db init
```

Then generate our migrations:

```shell
flask db migrate
```

And now commit our generated migrations:

```shell
git add migrations/* && git commit -m "Adds migrations"
```

We now need to instruct Upsun to run the Flask-migrate upgrade command when deploying so we know any migration changes
are automatically applied. 
Re-open the `.upsun/config.yaml` file and find the `deploy` hook where we added `npm run build` previously.

On the next line, add `flask db upgrade`:

```yaml {location=".upsun/config.yaml"}
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

You can now commit all of the above changes and push to Upsun.

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
