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
Flask requires an environment variable, `FLASK_APP` which is used to specify how to load the application.  You have two
options on where to set this variable: in the `.environment` file or in the `.upsun/config.yaml` file at `variables:env`.
You need to only do _one_ method; which one you choose is entirely personal preference. For sake of thoroughness, both
options are shown below. Our example application uses the file `autoapp.py` as the main entry. Adjust according to your
situation.

Open the `.environment` file, and add the following:
```shell
export FLASK_APP="autoapp.py"
```
**OR** open `.upsun/config.yaml` and locate the `variables:env` section, and change from:
```yaml
   # variables:
   #   env:
   #     # Add environment variables here that are static.
   #     PYTHONUNBUFFERED: "1"
```
to:
```yaml
   variables:
     env:
       FLASK_APP: autoapp.py
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

[Configure the web server](https://docs.platform.sh/create-apps.html#configure-whats-served) running in front of your app
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

- [Django topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=django)
- [Python topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=python)

## Blogs

- [Up(sun) and running with Django](https://upsun.com/blog/setting-up-django-on-upsun/)

<!-- ## Video -->
