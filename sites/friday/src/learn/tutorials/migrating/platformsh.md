---
title: "Migrate your site from Platform.sh to {{% vendor/name %}}"
sidebarTitle: From Platform.sh
weight: -150
description: "{{% vendor/name %}} is built on Platform.sh, and only requires a few additional considerations to migrate."
---

Starting from an existing Platform.sh project, follow these steps to amend your project YAML configuration
and host your project on {{% vendor/name %}}.

## Before you begin

You need:

- A {{% vendor/name %}} account
- An existing Platform.sh project
- Recommended: The {{% vendor/name %}} CLI

## 1. Create a Git branch

To avoid mixing existing Platform.sh source code and your new {{% vendor/name %}} source code,
create a new Git branch.
From the root of your Platform.sh project, run the following command:

```bash
git checkout -b {{% vendor/cli %}}-main
```

## 2. Create a new {{% vendor/name %}} project

To create a new {{% vendor/name %}} project, use the {{% vendor/name %}} CLI and run the following command:

```bash
{{% vendor/cli %}} project:create --default-branch={{% vendor/cli %}}-main
```

Follow the prompts.

Your new project is created and your local source code is now linked to your new {{% vendor/name %}} project.

## 3. Set up your {{% vendor/name %}} YAML configuration

### What you need to know

The {{% vendor/name %}} YAML configuration presents the following main differences from Platform.sh:

- All of the YAML configuration files (to configure your apps, services and routes)
  are now located in the `.platform/` directory.

- All the YAML files in the `.platform/` directory are taken into account during the build.</br>
  You can configure [multiple apps](/create-apps/multi-app/) in a single YAML file or set up one YAML file per application.
  Just make sure you place all relevant files at the root of `.platform/`.

- The YAML structure now uses the following first-level keys:

  | First-level YAML key | Description |
  |---|---|
  | `applications` | Contains what was previously defined in your `.platform.app.yaml` file. |
  | `services` | Contains what was previously defined in your `.platform/services.yaml` file. |
  | `routes` | Contains what was previously defined in your `.platform/routes.yaml` file. |

  To configure your apps, you need to use a hash map instead of an array.</br>
  The [`name` property](/create-apps/app-reference#top-level-properties) of your app is now a YAML key containing all the other keys:

    ```yaml
    applications:
      app1:
        # ...
      app2:
        # ...
    ```

  This makes debugging long configuration files with multiple apps easier.
  The app name key is now part of the XPath, which helps you quickly spot any settings you need to modify.

- As {{% vendor/name %}} allows you to [manage container resources](#4-define-your-app-and-service-resources) from its Console, CLI or API,
  the `size`, `disk` and `resources` keys have been deprecated.
  All the other YAML keys used to configure your apps on Platform.sh remain the same.

### Amend your existing YAML configuration

To set up your {{% vendor/name %}} YAML configuration, follow these steps.

{{< codetabs >}}

+++
title= Automated setup
+++

You can automatically adjust your Platform.sh source code
so it can be hosted on {{% vendor/name %}}.
To do so, use the {{% vendor/name %}} CLI and run the `{{% vendor/cli %}} ify` command.

{{% vendor/name %}} automatically detects your local stack
and generates the minimum YAML configuration file (`{{< vendor/configdir >}}/config.yaml`) required to deploy your project:

```
$ {{% vendor/cli %}} ify
You are reconfiguring the project at /dev/{{% vendor/cli %}}/nextjs.
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
│     - {{< vendor/configdir >}}/config.yaml                         │
│                                                   │
│   We're jumping for joy! ⍢                        │
└───────────────────────────────────────────────────┘
         │ /
         │/
         │
  (\ /)
  ( . .)
  o (_(")(")

You can now deploy your application to {{% vendor/name %}}!
To do so, commit your files and deploy your application using the
{{% vendor/name %}} CLI:
  $ git add .
  $ git commit -m 'Add {{% vendor/name %}} configuration files'
  $ {{% vendor/cli %}} project:set-remote
  $ {{% vendor/cli %}} push
```

{{< note >}}

This command generates the **minimum** configuration to install the detected stack.

Compare your old Platform.sh YAML configuration files to your new `{{< vendor/configdir >}}/config.yaml` file, and add any missing settings.
For example, you might need to add extra command lines in your `build`/`deploy` hooks section manually.

After you've amended your `{{< vendor/configdir >}}/config.yaml` file, commit and push your changes.

{{< /note >}}

<--->

+++
title=Manual setup
+++

1. Create a `{{< vendor/configdir >}}/` folder and add your configuration files to it.

  {{< note >}}
  
  You can add one YAML file per application, or a single file that contains all of your `applications`, `services`, and `routes` configuration.
  The present tutorial uses a single `{{< vendor/configdir >}}/config.yaml` file.

  {{< /note >}}

2. Configure your apps.</br></br>
   To do so, add the `applications:` first-level key to your configuration file.</br>
   Below the `applications:` key, add a unique name key for your app.

   ```yaml {location="{{< vendor/configdir >}}/config.yaml"}
   applications:
     app:
   ```
  
   Copy the content of your `.platform.app.yaml` (or `.platform/applications.yaml`) file,
   and paste it below your `app:` key.

  {{< note >}}
  
  Remove the following deprecated keys from your `app` configuration:
  - `name:`
  - `size`, `disk` and `resources` (as you can now [manage container resources](#4-define-your-app-and-service-resources) from the {{% vendor/name %}} Console, CLI or API)

  {{< /note >}}

3. Configure your services.</br></br>
   To do so, add the `services:` first-level key to your configuration file.</br>
   Copy the content of your `.platform/services.yaml` file and paste it below the `services:` first-level key.

   ```yaml {location="{{< vendor/configdir >}}/config.yaml"}
   applications:
     app:
       # ...

     services:
       # ...
   ```

  {{< note >}}
  
  Remove the deprecated `size`, `disk` and `resources` from your `services` configuration.
  You can now [manage container resources](#4-define-your-app-and-service-resources) from the {{% vendor/name %}} Console, CLI or API.

  {{< /note >}}

5. Configure your routes.</br></br>
   To do so, add the `routes:` first-level key.</br>
   Copy the content of your `.platform/routes.yaml` file and paste it below `routes:` first-level key.

   ```yaml {location="{{< vendor/configdir >}}/config.yaml"}
   applications:
     app:
       # ...
   
     services:
       # ...
  
     routes:
       # ...
   ```

6. Remove the three Platform.sh YAML configuration files (`.platform.app.yaml` or `.platform/applications.yaml`, `.platform/services.yaml` and `.platform/routes.yaml`) 
   from your source code.

7. Commit your files in Git.

8. To deploy your source code, run the `{{% vendor/cli %}} push` command.

Your resulting YAML configuration should be similar to the following example:

```yaml {location="{{< vendor/configdir >}}/config.yaml"}
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

{{< /codetabs >}}

## 4. Define your app and service resources

Now that the `size`, `disk` and `resources` keys are deprecated,
use the {{% vendor/name %}} Console, CLI or API to define your app and service resources.

{{< codetabs >}}

+++
title=Using the Console
+++

TODO

<--->

+++
title=Using the CLI
+++

TODO

<--->

+++
title=Using the API
+++

1. Define your app resources.</br>
   To do so, run a command similar to the following:

   ```bash
   $ {{% vendor/cli %}} e:curl /deployments/next -X PATCH -d \
     '{
       "webapps": {
       "app": {
         "resources": {"profile_size": "2"},
         "disk": "1024"
       }
     }
   }'
   ```

2. Define your database service resources. </br>
   To do so, run a command similar to the following:

   ```bash
   $ {{% vendor/cli %}} e:curl /deployments/next -X PATCH -d \
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

Make sure you remove the deprecated `size`, `disk` and `resources` keys from your {{% vendor/name %}} YAML configuration.

{{< /note >}}

[//]: # (TODO change it to doc page link)
List of profile_size can be found [here](https://docs.google.com/presentation/d/1PxDJm9c3OCjZxlI2keGy6V7BlAZJGfyueQ1D117YCns/edit?pli=1#slide=id.g20fc593a519_0_32)

{{< /codetabs >}}

## 5. Deploy your {{% vendor/name %}} project

Once you're ready to deploy your {{% vendor/name %}} project,
run the following command:

```bash
{{% vendor/cli %}} deploy
```

Your Platform.sh project has now been migrated to {{% vendor/name %}}.</br>
Congrats!