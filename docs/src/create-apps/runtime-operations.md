---
title: Runtime operations
description: Set up runtime operations to run one-off commands on your project through the Platform.sh API.
weight: 6
---

Runtime operations allow you to trigger one-off commands or scripts on your project.
Similar to [crons](../create-apps/app-reference.md#crons), they run in the app container but not on a specific schedule.
You can [define runtime operations](#define-a-runtime-operation) in your [app configuration](../create-apps/app-reference.md)
and [trigger them](#run-a-runtime-operation) at any time through the Platform.sh API using a cURL command.

For example, if you have a static website,
you may want to set up a runtime operation to occasionally fetch content from a backend system
without having to rebuild your whole app.

You can use runtime operations if you have Grid or {{% names/dedicated-gen-3 %}} environments.

## Define a runtime operation

To define a runtime operation, add a configuration similar to the following:

```yaml {location=".platform.app.yaml"}
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

```yaml {location=".platform.app.yaml"}
operations:
  clear-rebuild:
    role: admin
    commands:
      start: drush cache:rebuild
```

The name of the runtime operation in this case is `clear-rebuild`.

For more possibilities, see other [runtime operation examples](#runtime-operations-examples). 

## Run a runtime operation

Once you've [defined a runtime operation](#define-a-runtime-operation), 
you can trigger it through the Platform.sh API.
To do so, run a cURL command similar to the following:

```bash
platform p:curl /environments/{{< variable "ENVIRONMENT_ID" >}}/deployments/current/operations -X POST -d '{"operation": "{{< variable "RUNTIME_OPERATION_NAME" >}}", "service": "{{< variable "CONTAINER_NAME" >}}"}' -p {{< variable "PROJECT_ID" >}}
```

You can only trigger a runtime operation if you have permission to do so.
Permissions are granted through the `role` option specified in the [runtime operation configuration](#how-runtime-operations-work).

For example, to trigger the runtime operation [defined previously](#define-a-runtime-operation),
you could use the following command:

```bash
$ platform p:curl /environments/environment_abcd1234/deployments/current/operations -X POST -d '{"operation": "clear-rebuild", "service": "app"}' -p abcdefgh1234567
```

## Runtime operation examples

### Build your app when using a static site generator

During every Platform.sh deployment, a standard [`build` step](../overview/build-deploy.md#the-build) is run.
When you use a static site generator like [Gatsby](../guides/gatsby/_index.md)
or [Next.js](../guides/nextjs/_index.md) with [a headless backend](../guides/gatsby/headless/_index.md),
you need to run another `build` step to get your app ready for production.

This extra `build` step includes the generation of all the HTML pages your site can then serve in a static way.
You can use a runtime operation to trigger it after the initial deployment of your app or after a redeployment.
You can also trigger it when you need to fetch content from your backend system
but want to avoid going through the whole Platform.sh [build and deploy processes](../overview/build-deploy.md) again.

#### Run the Gatsby build step

To run the Gatsby build step, define a runtime operation similar to the following:

```yaml {location=".platform.app.yaml"}
operations:
  gatsby-build:
    role: viewer
    commands:
      start: gatsby build
      stop: null
```

To trigger your runtime operation, run a cURL command similar to the following:

```bash
$ platform p:curl /environments/{{< variable "ENVIRONMENT_ID" >}}/deployments/current/operations -X POST -d '{"operation": "gatsby-build", "service": "{{< variable "CONTAINER_NAME" >}}"}' -p {{< variable "PROJECT_ID" >}}
```

#### Run the Next.js build step

To run the Next.js build step, define a runtime operation similar to the following:

```yaml {location=".platform.app.yaml"}
operations:
    next-rebuild:
        role: admin
        commands:
            # All below are valid, depending on your setup
            start: npm run build
            # start: npx next build 
            # start: next build
            stop: null
```

To trigger your runtime operation, run a cURL command similar to the following:

```bash
$ platform p:curl /environments/{{< variable "ENVIRONMENT_ID" >}}/deployments/current/operations -X POST -d '{"operation": "next-rebuild", "service": "{{< variable "CONTAINER_NAME" >}}"}' -p {{< variable "PROJECT_ID" >}}
```

### Restart your Node.js app

To restart your Node.js app, define a runtime operation similar to the following:

```yaml {location=".platform.app.yaml"}
operations:
    pm2-ping|reload|restart:
        role: admin 
        commands: 
            start: |
                # Assuming pm2 start npm --no-daemon --watch --name $APP -- start -- -p $PORT
                APP=$(cat package.json | jq -r '.name')
                # pm2 ping $APP
                # pm2 reload $APP 
                pm2 restart $APP
``` 

To trigger your runtime operation, run a cURL command similar to the following:

```bash
$ platform p:curl /environments/{{< variable "ENVIRONMENT_ID" >}}/deployments/current/operations -X POST -d '{"operation": "pm2-ping|reload|restart", "service": "{{< variable "CONTAINER_NAME" >}}"}' -p {{< variable "PROJECT_ID" >}}
```

### Define management commands on a Django project

On a Django project, you can define management commands, for example to run a migration outside of the Django ORM.
To do so, define a runtime operation similar to the following:

```yaml {location=".platform.app.yaml"}
operations:
  manual-migration:
    role: admin
    commands:
      start: python manage.py manual_migration
```

To trigger your runtime operation, run a cURL command similar to the following:

```bash
$ platform p:curl /environments/{{< variable "ENVIRONMENT_ID" >}}/deployments/current/operations -X POST -d '{"operation": "manual-migration", "service": "{{< variable "CONTAINER_NAME" >}}"}' -p {{< variable "PROJECT_ID" >}}
```