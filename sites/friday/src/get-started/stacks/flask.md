---
title: Deploying Flask on Upsun
sidebarTitle: Flask
weight: -75
description: |
    Welcome to the Upsun documentation specific to the Flask framework on Upsun.
    It includes common reference materials useful for deploying Flask, but also external community and blog resources that cover more advanced topics relevant for the framework.
---


{{< note theme="info" >}}

Before you proceed, be sure to checkout the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project) and the main [Getting started guide](/get-started/here/_index.md). These two resources provide all of the core concepts and common commands you'll need to know before using the materials below.

{{< /note >}}

Now that you have completed the [Getting started guide](/get-started/here/_index.md), there are **five remaining changes**
required in order to have a successful deployment of Flask on Upsun.

## Environment Variables
Open the `.environment` file that the cli tool generated earlier. Notice it has already created some environmental
variables for you to connect to your database service. However, since we later need to use a tunnel in order to generate
our migration files, we're going to replace what the Upsun CLI tool generated, and replace it with the following:

```shell
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
Flask requires an environment variable, `FLASK_APP` which is used to specify how to load the application.  Our example
application uses the file `autoapp.py` as the main entry. Adjust according to your situation.

Below the last line we added above in the `.environment` file add the following:
```shell
export FLASK_APP="autoapp.py"
```

There are a few other environment variables you may want to set up. Upsun provides us information about what type of
environment the application is running in via an environmental variable named `PLATFORM_ENVIRONMENT_TYPE` whose values
can be production, development, or staging. We can use this information to set the value for `FLASK_ENV`.  Inside the
`.environment file`, add the following line:

```shell
export FLASK_ENV="${PLATFORM_ENVIRONMENT_TYPE}"
```

Several other environmental variables will need to change based on whether we are on a production environment or not. We
can leverage the information in `PLATFORM_ENVIRONMENT_TYPE` to not only set `FLASK_ENV` but also these other variables.
For example, we only want `FLASK_DEBUG` enabled (`1`) if we're not running in production. Inside the `.environment`
file, add the following line:
```shell
export FLASK_DEBUG=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 0 || echo 1)
```

We can do something similar for LOG_LEVEL. Inside the .environment file, add the following line:

```shell
export LOG_LEVEL=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo "info" || echo "debug")
```

The last environmental variable that needs to be different based on environment type is `SEND_FILE_MAX_AGE_DEFAULT`
where we want it to be 0 if we're not in production, but a higher value if we are. Inside the `.environment` file, add
the following line:
```shell
export SEND_FILE_MAX_AGE_DEFAULT=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 31556926 || echo 0)
```

The next environmental variable you might need to set is `SECRET_KEY`. It is used for securely signing the session
cookie and can be used for any other security-related needs by extensions or your application. It should be a long
random string. Again, Upsun provides us with something to fill this need as an environmental variable:
`PLATFORM_PROJECT_ENTROPY`.  Inside the `.environment` file, add the following line:
```shell
export SECRET_KEY="${PLATFORM_PROJECT_ENTROPY}"
```

Your `.environment` file should now look similar to the following:

```shell
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


## `.upsun/config.yaml`
There are several additional changes we need to make to the Upsun configuration file so that Upsun knows how your Flask
application should behave. Open the `.upsun/config.yaml` file and make the changes below.

### Static assets
We need to add some writable disk space to hold the static assets that `flask-static-digest` generates and `npm` builds.</br>
To do so, define the `./<APP_NAME>/static` directory as [a mount](/create-apps/app-reference.md#mounts).
Locate the section dedicated to mounts:

   ```yaml
   # Mounts define directories that are writable after the build is complete.
   # More information: https://docs.upsun.com/create-apps/app-reference.html#mounts
   # mounts:
   #   "/.cache": # Represents the path in the app.
   #     source: "storage" # "local" sources are unique to the app, while "service" sources can be shared among apps.
   #     source_path: "cache" # The subdirectory within the mounted disk (the source) where the mount should point.
   ```

Uncomment the `# mounts:` line, and add an entry describing where you want to add a writable mount:

   ```yaml {configFile="app"}
   mounts:
       "<APP_NAME>/static":
           source: "storage"
           source_path: "static_assets"
   ```
Replacing `<APP_NAME>` above with the `app_name` you defined when creating the flask project.

### Installation during the Build Hook

Next we need to instruct Upsun to automatically run `npm install` in addition to installing our python dependencies when
building the application container. To do so, customize your [build hook](/create-apps/hooks/hooks-comparison.html#build-hook).
Locate the section dedicated to it:

 ```yaml
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
 [configured your upsun project](/get-started/here/configure/_index.md). If you want `pip` to be upgraded first, add
 `pip install --upgrade pip` to the above line. Then, add `npm install`:

 ```yaml {configFile="app"}
 hooks:
     build: |
         set -eux
         pip install --upgrade pip
         pip install -r requirements.txt
         npm install
```

If your project uses a different package manager, we also support [several other options](/languages/python/dependencies.md).

### Deploy Hook
Now we need to instruct Upsun to automatically run `npm run build` when building the application container. To do so,
customize your [deploy hook](/create-apps/hooks/hooks-comparison.html#deploy-hook). Locate the section dedicated to it:

 ```yaml
 # The deploy hook is run after the app container has been started, but before it has started accepting requests.
 # More information: https://docs.upsun.com/create-apps/hooks/hooks-comparison.html#deploy-hook
 deploy: |
      set -eux
      # echo 'Put your deploy command here'
 ```

Add `npm run build`:

 ```yaml
 deploy: |
      set -eux
      npm run build
 ```

### Web Server

[Configure the web server](/create-apps/_index.md#configure-whats-served) running in front of your app
to define how your app handles dynamic requests. To do so, locate the section dedicated to the web server:

 ```yaml
 # The web key configures the web server running in front of your app.
 # More information: https://docs.upsun.com/create-apps/app-reference.html#web
 web:
   # Commands are run once after deployment to start the application process.
   # More information: https://docs.upsun.com/create-apps/app-reference.html#web-commands
 ```

To add a basic Flask server, replace the default information added by the Upsun CLI with `flask run -p $PORT`. Also,
change the `socket_family` value from `unix` to `tcp`:

 ```yaml {configFile="app"}
 web:
   commands:
     start: "flask run -p $PORT"
   upstream:
     socket_family: tcp
 ```

## Commit and push
You can now commit the changes to `.environment` and `.upsun/config.yaml` and push to Upsun.

## Documentation

- [Python documentation](/languages/python/)
- [Managing dependencies](/languages/python/dependencies)
- [Configuring web servers](/languages/python/server)

## Community content

- [Flask topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=flask)
- [Python topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=python)

## Blogs

- [Up(sun) and running with Django](https://upsun.com/blog/setting-up-django-on-upsun/)

<!-- ## Video -->
