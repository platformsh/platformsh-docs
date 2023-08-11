---
title: "Platform.sh"
description: |
  Migrate your project from Platform.sh to Upsun has an easy path. Let's dig into it!
---

Starting from an existing Platform.sh project, adapting your project Yaml configuration to host it on Upsun is really easy to do.
This is the few steps to perform a successful migration.

## Create a Git branch
To avoid mixing existing Platform.sh source code and your new Upsun source code, we need to create a new Git branch.

From the root of your Platform.sh project, execute the following:

```shell
$ git checkout -b upsun-main
```

## Create a new Upsun project
To create a new Upsun project, use the CLI and follow the prompt:
```
$ upsun project:create --default-branch=upsun-main
```

At the end of this process, your new project is created and your local source code is now linked with your new Upsun project.

## General changes
The main technical difference between Platform.sh and Upsun remains in the Yaml configuration.
There are a lot of improvements in the Upsun Yaml config files.

This is the main rules (non-exhaustive list) that you have to keep in mind:
- All of the Yaml configuration files are now located in the `.platform/` folder only, no more `.platform.app.yaml` files at the root of your application source code
- All existing yaml files located at the root of the `.platform/` folder are taken into account, whether you define multiple applications in the same Yaml file or separate them in dedicated Yaml files.
- By default, first level Yaml keys always start by:
  - `applications`: contains what was previously defined in your .platform.app.yaml file.
  - `services`: contains what was previously defined in your .platform/services.yaml file.
  - `routes`: contains what was previously defined in your .platform/routes.yaml file.
    </br>We switch the app list from array to hash map.
    </br>This means that the name property of your app is now a Yaml key, containing all the other keys.
    ```yaml
    applications:
      app:
        # ...
      admin:
        # ...
    ```
    This will help debugging long config files having a lot of applications (multi-app) as the app name key will be part of the XPath, and so, it will ease developer journey finding where they are modifying settings:
- Yaml keys inside an app do not change, except a removal of keys to manage container resources: `size`, `disk` and `resources`
- As resource configuration is not possible anymore in the Yaml configuration., it needs to be done using Upsun API or using the Console.

## Change your Yaml structure
There are 2 ways to adapt your actual configuration from Platform.sh to Upsun:
- [Manually](#manually) : **13 steps**
- [Using upsun ify command](#using-upsun-ify-command): **1 step**

### Manually
To migrate an existing Yaml configuration to Upsun Yaml format, you need to:
1. Create a new `.upsun/` folder.
1. Create one Yaml file per application in your `.upsun/` folder, or one file that will contain all of your `applications`/`services`/`routes` configuration.
   </br>We will use a `.upsun/config.yaml` file here.
1. At the root of your new Yaml file, create an `applications:` first level Yaml key.
1. Name your application key below the `applications:` key, example:
   ```yaml
   # .platform/app.yaml
   applications:
     app:
   ```
1. Copy/paste content of your existing `app` configuration from the `.platform.app.yaml` (or `.platform/applications.yaml`) file below your `app:` key
1. Remove the `name:` setting from the pasted source code, as it is not needed anymore.
1. At the root of your `.upsun/config.yaml` file, create a `services:` first level Yaml key.
1. Copy the entire `.platform/services.yaml` file and paste it below `services:` first level key and indent the existing services definition below.
1. At the root of your `.upsun/config.yaml`  file, create a `routes:` first level Yaml key.
1. Copy the entire `.platform/routes.yaml` file and paste it below `routes:` first level key and indent the existing services definition below.
1. Remove the 3 Platform.sh Yaml configuration files (`.platform.app.yaml` or `.platform/applications.yaml`, `.platform/services.yaml` and `.platform/routes.yaml`) from your source code.
1. Commit your files in Git
1. Deploy your source code using command `upsun push`

You should end up with this `.upsun/config.yaml` file like:
```yaml
# .upsun/config.yaml
applications:
  # Complete list of all available properties: https://docs.platform.sh/create-apps/app-reference.html
  # A unique name for the app. Must be lowercase alphanumeric characters. Changing the name destroys data associated
  # with the app.
  app:
    # The runtime the application uses.
    # Complete list of available runtimes: https://docs.platform.sh/create-apps/app-reference.html#types
    type: nodejs:18
    # The relationships of the application with services or other applications.
    # The left-hand side is the name of the relationship as it will be exposed
    # to the application in the PLATFORM_RELATIONSHIPS variable. The right-hand
    # side is in the form `<service name>:<endpoint name>`.
    # More information: https://docs.platform.sh/create-apps/app-reference.html#relationships
    relationships:
      database:
        service: "db"
        endpoint: "mysql"
    # The size of the persistent disk of the application (in MB). Minimum value is 128.
    # disk: 512
    # The web key configures the web server running in front of your app.
    # More information: https://docs.platform.sh/create-apps/app-reference.html#web
    web:
      # Commands are run once after deployment to start the application process.
      # More information: https://docs.platform.sh/create-apps/app-reference.html#web-commands
      commands:
        # The command to launch your app. If it terminates, it's restarted immediately.
        start: "node index.js"

services:
  db:
    type: mariadb:10.4

routes:
  "https://{default}/":
    type: upstream
    upstream: "app:http"
  # A basic redirect definition
  # More information: https://docs.platform.sh/define-routes.html#basic-redirect-definition
  "https://www.{default}/":
    type: redirect
    to: "https://{default}/"
```

### Using upsun ify command
Our Uspun CLI comes with a useful command to adapt your source code to be easily hosted on Upsun: `upsun ify`

This command will automatically detect your local stack and generate the minimum Yaml configuration files required to deploy it on Upsun: `.upsun/config.yaml`.
```
$ upsun ify
You are reconfiguring the project at /dev/Upsun/nextjs.
Welcome to Platform.sh!
Let's get started with a few questions.

We need to know a bit more about your project. This will only take a minute!

✓ Detected stack: Next.js
✓ Detected runtime: JavaScript/Node.js
✓ Detected dependency managers: Yarn
Tell us your project name: [nextjs]

                       (\_/)
We're almost done...  =(^.^)=

Last but not least, unless you're creating a static website, your project uses services. Let's define them:

Which services are you using?
Use arrows to move, space to select, type to filter
  [x]  MariaDB
  [ ]  MySQL
  [ ]  PostgreSQL
> [x]  Redis
  [ ]  Redis Persistent
  [ ]  Memcached
  [ ]  OpenSearch

You have not selected any service, would you like to proceed anyway? [Yes]

┌───────────────────────────────────────────────────┐
│   CONGRATULATIONS!                                │
│                                                   │
│   We have created the following files for your:   │
│     - .environment                                │
│     - .upsun/config.yaml                          │
│                                                   │
│   We're jumping for joy! ⍢                        │
└───────────────────────────────────────────────────┘
         │ /
         │/
         │
  (\ /)
  ( . .)
  o (_(")(")

You can now deploy your application to Upsun!
To do so, commit your files and deploy your application using the
Upsun CLI:
  $ git add .
  $ git commit -m 'Add Upsun configuration files'
  $ upsun project:set-remote
  $ upsun push
```
{{< note >}}
as this command generate the minimum configuration to install the detected stack, you would probably need to compare your previous Yaml section from your `.platform.app.yaml` (or `.platform/applications.yaml`) file to your new `.upsun/config.yaml` file and report possible missing settings, like your additional command lines in your `build`/`deploy` hooks section.
</br>When it’s done, commit and push your changes.
{{< /note >}}

## Defined app and services resources
Within Platform.sh Yaml configuration files, it is possible to define resources of your app and services by using such settings.
Example for your applications:
```yaml
# .platform.app.yaml
name: app
type: nodejs:16
# How many resources to devote to the app. Defaults to AUTO in production environments.
# More information: https://docs.platform.sh/create-apps/app-reference.html#sizes
size: L
# Fine-tune allocated resources
# https://docs.platform.sh/create-apps/flexible-resources.html#performance-profiles
resources:
  base_memory: 1024
  memory_ratio: 1024
# The size of the persistent disk of the application (in MB). Minimum value is 128
disk: 1024
```

Example for your services:
```yaml
# .platform/services.yaml
database:
  type: postgresql:15
  disk: 1024
```

{{< note >}}
These settings, size, disk and resources are no longer available in the Upsun Yaml config files (or not taken in account anymore).
{{< /note >}}

### Using the API
#### Change app resources
To change your `app` application resources, use the following command line:
```
$ upsun e:curl /deployments/next -X PATCH -d \
  '{
    "webapps": {
    "app": {
      "resources": {"profile_size": "2"},
      "disk": "1024"
    }
  }
}'
```

{{< note >}}
Don’t forget to remove from your `.platform/config.yaml` file corresponding Yaml key that are not needed anymore: `size`, `disk` and `resources`
{{< /note >}}

#### Change database service resources
To change database service resources, use the following command line:
```shell
$ upsun e:curl /deployments/next -X PATCH -d \
  '{
    "services": {
    "database": {
      "disk": "1024",
      "resources": {"profile_size": "1"}
    }
  }
}'
```

{{< note >}}
Don’t forget to remove from your .platform/services.yaml file corresponding Yaml key that are not needed anymore: `disk`
{{< /note >}}

[//]: # (TODO change it to doc page link)
List of profile_size can be founded [here](https://docs.google.com/presentation/d/1PxDJm9c3OCjZxlI2keGy6V7BlAZJGfyueQ1D117YCns/edit?pli=1#slide=id.g20fc593a519_0_32)

### Using CLI (TODO)
TODO
### Using Console (TODO)
TODO

## Deploy your Upsun project
After adding to Git your changes, use the following command to deploy your Upsun project:
```shell
upsun deploy
```

Et voilà, you successfully migrate your Platform.sh project to Upsun.
Congrats!

