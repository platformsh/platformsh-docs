---
title: Runtime operations
description: Set up runtime operations to run one-off commands on your project through the {{% vendor/name %}} CLI.
weight: 6
---

Runtime operations allow you to trigger one-off commands or scripts on your project.
Similar to [crons](/create-apps/app-reference/single-runtime-image.md#crons), they run in the app container but not on a specific schedule.
You can [define runtime operations](#define-a-runtime-operation) in your [app configuration](/create-apps/app-reference/single-runtime-image.md)
and [trigger them](#run-a-runtime-operation) at any time through the {{% vendor/name %}} CLI.

For example, if you have a static website,
you may want to set up a runtime operation to occasionally fetch content from a backend system
without having to rebuild your whole app.

You can use runtime operations if you have Grid or {{% names/dedicated-gen-3 %}} environments.

## Define a runtime operation

To define a runtime operation, add a configuration similar to the following:

```yaml {configFile="app"}
operations:
  {{< variable "RUNTIME_OPERATION_NAME" >}}:
    role: {{< variable "USER_ROLE" >}}
    commands:
      start: {{< variable "COMMAND" >}}
```

When you define a runtime operation,
you can specify which users can trigger it according to their user `role`:

- `viewer`
- `contributor`
- `admin`

If you don't set the `role` option when configuring your runtime operation,
by default all users with the `contributor` role can trigger it.

For example, to allow admin users to clear the cache of a Drupal site,
you could define an operation like the following:

```yaml {configFile="app"}
operations:
  clear-rebuild:
    role: admin
    commands:
      start: drush cache:rebuild
```
The name of the runtime operation in this case is `clear-rebuild`.

For more possibilities, see other [runtime operation examples](#runtime-operation-examples).

## Run a runtime operation 

{{< codetabs >}}
+++
title=In the Console
+++



First, make sure that you have [defined a runtime operation](#define-a-runtime-operation). Then:

1. Navigate to the environment where you want to run the operation.
2. Click {{< icon more >}} **More**.
3. Click **Run runtime operation**.
4. Select the operation you want to run.
5. Click **Run**.

<--->
+++
title=Using the CLI
+++


A runtime operation can be triggered through the {{% vendor/name %}} CLI once it has been [defined](#define-a-runtime-operation). 

Run the following command:

```bash
{{% vendor/cli %}} operation:run {{< variable "RUNTIME_OPERATION_NAME" >}} --project {{< variable "PROJECT_ID" >}} --environment {{< variable "ENVIRONMENT_NAME" >}}
```

You can only trigger a runtime operation if you have permission to do so.
Permissions are granted through the `role` option specified in the [runtime operation configuration](#define-a-runtime-operation). This can only be done if a [runtime operation has been defined](#define-a-runtime-operation).

For example, to trigger the runtime operation [defined previously](#define-a-runtime-operation),
you could run the following command:

```bash
{{% vendor/cli %}} operation:run clear-rebuild --project {{< variable "PROJECT_ID" >}} --environment {{< variable "ENVIRONMENT_NAME" >}}
```

{{< /codetabs >}}

## List your runtime operations

To list all the runtime operations available on an environment,
run the following command:

```bash
{{% vendor/cli %}} operation:list --project {{< variable "PROJECT_ID" >}} --environment {{< variable "ENVIRONMENT_NAME" >}}
```

## Runtime operation examples

### Build your app when using a static site generator

{{< version/specific >}}
During every {{% vendor/name %}} deployment, a standard [`build` step](/learn/overview/build-deploy.md#the-build) is run.
When you use a static site generator like [Gatsby](../guides/gatsby/_index.md)
or [Next.js](../guides/nextjs/_index.md) with [a headless backend](../guides/gatsby/headless/_index.md),
you need to run a second `build` step to get your app ready for production.

<--->

During every {{% vendor/name %}} deployment, a standard [`build` step](/learn/overview/build-deploy.md#the-build) is run.
When you use a static site generator like Gatsby
or Next.js with a headless backend
you need to run a second `build` step to get your app ready for production.

{{< /version/specific >}}

This is because, as its framework is being built,
your frontend needs to pull content-related data from your backend’s API
(to generate all the static HTML pages your site is to serve).
To accomplish this on {{% vendor/name %}}, where each app goes through a build-deploy pipeline in parallel,
your frontend’s build must be delayed _until after_ your backend has fully deployed.
It's often delayed up until the [`post_deploy` hook](../create-apps/hooks/hooks-comparison.md#post-deploy-hook) stage,
when the filesystem is read-only.

You can use a runtime operation to trigger the second `build` step
after the initial deployment of your app or after a redeployment.
You can also trigger it when you need to fetch content from your backend
but want to avoid going through the whole {{% vendor/name %}} [build and deploy processes](/learn/overview/build-deploy.md) again.

{{< note >}}

The following examples assume that the frontend and backend containers are included in the same environment.
This isn’t necessary for the commands to run successfully.<BR>
What _is_ necessary is that the build destination for your frontend **is  writable at runtime**
(meaning, you must [define a mount](/create-apps/app-reference/single-runtime-image.md#mounts) for it).
If you don’t want to include a build within a mount (especially if your data source **isn’t** on {{% vendor/name %}}),
you can use [source operations](../create-apps/source-operations.md) to achieve a similar effect,
but through generating a new commit.

{{< /note >}}

{{< codetabs >}}
+++
title=Gatsby
+++

To run the [Gatsby build](https://www.gatsbyjs.com/docs/conceptual/overview-of-the-gatsby-build-process/#understanding-gatsby-build-build-time) step,
define a runtime operation similar to the following:

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}

operations:
  gatsby-build:
    role: viewer
    commands:
      start: gatsby build
{{< /snippet >}}
```

To trigger your runtime operation, run a command similar to the following:

```bash
{{% vendor/cli %}} operation:run gatsby-build --project {{< variable "PROJECT_ID" >}} --environment {{< variable "ENVIRONMENT_NAME" >}}
```

<--->
+++
title=Next.js
+++

To run the [Next.js build](https://nextjs.org/docs/deployment#nextjs-build-api) step,
define a runtime operation similar to the following:

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}

operations:
  next-build:
    role: admin
    commands:
      # All below are valid, depending on your setup
      start: next build
      # start: npx next build
      # start: npm run build
{{< /snippet >}}
```

To trigger your runtime operation, run a command similar to the following:

```bash
{{% vendor/cli %}} operation:run next-build --project {{< variable "PROJECT_ID" >}} --environment {{< variable "ENVIRONMENT_NAME" >}}
```

{{< /codetabs >}}

### Execute actions on your Node.js app

You can define runtime operations for common [pm2](https://pm2.io/docs/runtime/overview/) process manager tasks.

{{< codetabs >}}
+++
title=Ping your app
+++

To ping your Node.js app, define a runtime operation similar to the following:

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}

operations:
  pm2-ping:
    role: admin
    commands:
      start: |
        # Assuming pm2 start npm --no-daemon --watch --name $APP -- start -- -p $PORT
        APP=$(cat package.json | jq -r '.name')
        pm2 ping $APP
{{< /snippet >}}
```

To trigger your runtime operation, run a command similar to the following:

```bash
{{% vendor/cli %}} operation:run pm2-ping --project {{< variable "PROJECT_ID" >}} --environment {{< variable "ENVIRONMENT_NAME" >}}
```

<--->
+++
title=Reload your app
+++

To reload your Node.js app, define a runtime operation similar to the following:

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}

operations:
  pm2-reload:
    role: admin
    commands:
      start: |
        # Assuming pm2 start npm --no-daemon --watch --name $APP -- start -- -p $PORT
        APP=$(cat package.json | jq -r '.name')
        pm2 reload $APP
{{< /snippet >}}
```
To trigger your runtime operation, run a command similar to the following:

```bash
{{% vendor/cli %}} operation:run pm2-reload --project {{< variable "PROJECT_ID" >}} --environment {{< variable "ENVIRONMENT_NAME" >}}
```

<--->
+++
title=Restart your app
+++

To restart your Node.js app, define a runtime operation similar to the following:

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}

operations:
  pm2-restart:
    role: admin
    commands:
      start: |
        # Assuming pm2 start npm --no-daemon --watch --name $APP -- start -- -p $PORT
        APP=$(cat package.json | jq -r '.name')
        pm2 restart $APP
{{< /snippet >}}
```

To trigger your runtime operation, run a command similar to the following:

```bash
{{% vendor/cli %}} operation:run pm2-restart --project {{< variable "PROJECT_ID" >}} --environment {{< variable "ENVIRONMENT_NAME" >}}
```

{{< /codetabs >}}

### Define management commands on your Django project

On a Django project, you can [define custom `django-admin` commands](https://docs.djangoproject.com/en/4.2/howto/custom-management-commands/), for example to run a one-off management command (`manual migration` in the example above) outside of the Django ORM migration framework.
To do so, define a runtime operation similar to the following:

```yaml {configFile="app"}
name: myapp

type: python:{{% latest "python" %}}

operations:
  manual-migration:
    role: admin
    commands:
      start: python manage.py manual_migration
```
To trigger your runtime operation, run a command similar to the following:

```bash
{{% vendor/cli %}} operation:run manual-migration --project {{< variable "PROJECT_ID" >}} --environment {{< variable "ENVIRONMENT_NAME" >}}
```
