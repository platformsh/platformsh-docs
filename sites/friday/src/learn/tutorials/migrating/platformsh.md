---
title: "Migrate your site from Platform.sh to {{% vendor/name %}}"
sidebarTitle: From Platform.sh
weight: -150
description: "{{% vendor/name %}} is built on Platform.sh, and only requires a few additional considerations to migrate."
---

Starting from an existing Platform.sh project, follow these steps to amend your project YAML configuration
and host your project on {{% vendor/name %}}.

## Before you begin

### Requirements

You need:

- A {{% vendor/name %}} account
- An existing Platform.sh project
- Recommended: The {{% vendor/name %}} CLI

### What you need to know

There are two major differences between {{% vendor/name %}} and Platform.sh relevant to migrating a site: container and resources configuration.

1. Application, service, and route configuration

    - All of the YAML configuration files (to configure your apps, services and routes)
      are now located in the `{{% vendor/configdir %}}` directory.

    - All the YAML files in the `{{% vendor/configdir %}}` directory are globbed into a singular configuration on push.
      You can configure [multiple apps](/create-apps/multi-app/) in a single YAML file or set up one YAML file per application.
      Just make sure you place all relevant files at the root of `{{% vendor/configdir %}}`.

    - The YAML structure now uses the following first-level keys:

      | First-level YAML key | Description |
      |---|---|
      | `applications` | Contains what was previously defined in your `.platform.app.yaml` file. |
      | `services` | Contains what was previously defined in your `.platform/services.yaml` file. |
      | `routes` | Contains what was previously defined in your `.platform/routes.yaml` file. |

    - To configure your apps, you need to use a hash map instead of an array.
      In the example below, all first-level keys are included in a single `{{% vendor/configdir %}}/config.yaml`.
      Notice that the [`name` property](/create-apps/app-reference#top-level-properties) of each application is now a YAML key at the next level, instead of being defined using `name` as was the case on Platform.sh:

        ```yaml {location="config.yaml" dir="true"}
        # A top level key containing all application containers.
        applications:
            frontend:
                # Location of the 'frontend' source code; "/" by default, as explained below.
                source:
                    root: "frontend"

                # Additional app configuration, not including size, disk, or resources previously on Platform.sh.

            backend:
                # Location of the 'frontend' source code; "/" by default, as explained below.
                source:
                    root: "backend"
                
                # Additional app configuration, not including size, disk, or resources previously on Platform.sh.
        
        # A top level key containing all managed services containers.
        services:
            db:
                type: "mariadb:{{% latest "mariadb" %}}"

            cache:
                type: "redis:{{% latest "redis" %}}"

        # A top level key containing all routes configuration.
        routes:
            "https://{default}/":
                type: upstream
                upstream: frontend:http
            "https://{default}/api":
                type: upstream
                upstream: backend:http
        ```

      This makes debugging long configuration files with multiple apps easier.
      The app name key is now part of the XPath, which helps you quickly spot any settings you need to modify.

    - As {{% vendor/name %}} allows you to [manage container resources](#4-define-your-app-and-service-resources) from its Console, CLI or API,
      the `size`, `disk` and `resources` keys have been deprecated.
      All the other YAML keys used to configure your apps on Platform.sh remain the same.

    - `applications.APP_NAME.source.root` is not required. However, if a value is not included in your configuration, {{% vendor/name %}} will assume the source code for `APP_NAME` is at the project root `"/"`.
      That is, by default, each app will have the below assumption unless specified otherwise by your configuration:

      ```yaml {location="config.yaml" dir="true"}
      # A top level key containing all application containers.
      applications:
          frontend:
              source:
                  root: "/"
      ```

    - The example shown above includes `applications`, `services`, and `routes` configuration in a single `{{% vendor/configdir %}}/config.yaml` file, with all containers under their proper top-level keys. 
      While it is possible to split configuration into separate files (into `{{% vendor/configdir %}}/applications.yaml`, `{{% vendor/configdir %}}/services.yaml`, and `{{% vendor/configdir %}}/routes.yaml` files, for example), those top-level keys are still required in _each_ file where configuration is added to that container "group".

      A better example that illustrates this is if you wanted to split configuration for the `frontend` and `backend` application containers into separate file, along with their specific `services` and `routes` configuration. 
      Both files shown below _must_ contain top-level keys within them.

      {{< codetabs >}}
+++
title= Frontend
+++

```yaml {location="frontend.yaml" dir="true"}
# A top level key containing all application containers.
applications:
    frontend:
        # Location of the 'frontend' source code; "/" by default, as explained below.
        source:
            root: "frontend"

        # Additional app configuration, not including size, disk, or resources previously on Platform.sh.

# A top level key containing all managed services containers.
services:
    cache:
        type: "redis:{{% latest "redis" %}}"

# A top level key containing all routes configuration.
routes:
    "https://{default}/":
        type: upstream
        upstream: frontend:http
```

      <--->
+++
title= Backend
+++

```yaml {location="backend.yaml" dir="true"}
# A top level key containing all application containers.
applications:
    backend:
        # Location of the 'frontend' source code; "/" by default, as explained below.
        source:
            root: "backend"
        
        # Additional app configuration, not including size, disk, or resources previously on Platform.sh.

# A top level key containing all managed services containers.
services:
    db:
        type: "mariadb:{{% latest "mariadb" %}}"

# A top level key containing all routes configuration.
routes:
    "https://{default}/api":
        type: upstream
        upstream: backend:http
```

      {{< /codetabs >}}

2. Resource configuration

    Resources on {{% vendor/name %}} aren't managed as a combination of "plan" and committed configuration such as `size`, `disk`, and `resources` like they were on Platform.sh.
    Instead, resources must be defined with a `PATCH` to your project configuration using the management console, CLI, or API.
    In the steps below be sure to remove `size`, `disk`, and `resources` keys from your configuration, as they do not have meaning on {{% vendor/name %}} and will result in an error.


## 1. Create a Git branch

To avoid mixing existing Platform.sh source code and your new {{% vendor/name %}} source code,
create a new Git branch.
From the root of your Platform.sh project, run the following command:

```bash
git checkout -b {{% vendor/cli %}}-main
```

## 2. Create a new project

To create a new {{% vendor/name %}} project, use the {{% vendor/name %}} CLI and run the following command:

```bash
{{% vendor/cli %}} project:create --default-branch={{% vendor/cli %}}-main
```

Follow the prompts.

Your new project is created and your local source code is now linked to your new {{% vendor/name %}} project.

## 3. Update YAML

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

```bash
{{% vendor/cli %}} ify
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

## 4. Define resources

Make sure you configure resources (CPU, RAM, disk) per environment for each of your applications and services.
For more information, see how to [manage resources](/manage-resources.md).

## 5. Deploy

Once you're ready to deploy your {{% vendor/name %}} project,
run the following command:

```bash
{{% vendor/cli %}} deploy
```

{{< note title="Warning" >}}

First deployment should fail if you yet didn't allocate resources to your application.

For more information on how you can do so, see how to [manage resources](/manage-resources.md).

{{< /note >}}

Your Platform.sh project has now been migrated to {{% vendor/name %}}.</br>
Congrats!
