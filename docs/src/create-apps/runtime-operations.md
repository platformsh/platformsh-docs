---
title: Runtime operations
description: Set up runtime operations to run one-off commands on your project through the Platform.sh API.
weight: 6
---

Runtime operations allow you to trigger one-off commands or scripts on your project.
They're similar to crons, except they don't run on a specific schedule. 
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
  {{< variable "NAME" >}}:
    role:
    commands:
      start: {{< variable "COMMAND" >}}
```

When you define a runtime operation,
you can specify which users can trigger it according to their `role`: `viewer`, `contributor` or `admin`.

If you don't use the `role` option when configuring your runtime operation,
by default any users with the `contributor` role can trigger it. 

For example, to allow admin users to clear the cache of a Drupal site,
you could define an operation like this:

```yaml {location=".platform.app.yaml"}
operations:
  clear-cache:
    role: admin
    commands:
      start: cd public && drush cc all
```

The name in this case is `clear-cache`.

For more possibilities, see other [runtime operations examples](#runtime-operations-examples). 

## Run a runtime operation

Once you've [defined a runtime operation](#define-a-runtime-operation), 
you can trigger it through the Platform.sh API.
To do so, run a cURL command similar to the following:

```bash
$ platform p:curl -e {{< variable "ENVIRONMENT" >}} {{< variable "API_ENDPOINT" >}} -X POST -d '{"operation": "{{< variable "RUNTIME_OPERATION_NAME" >}}", "service": "{{< variable "SERVICE_NAME" >}}"}'
```

Note that you can only trigger the runtime operation if you have permission to do so.
Permissions are granted through the `role` option specified in the [runtime operation configuration](#how-runtime-operations-work).

For example, to trigger the runtime operation [defined previously](#define-a-runtime-operation),
you could use the following command:

```bash
$ platform p:curl -e <environment> deployments/current/operations -X POST -d '{"operation": "clear-cache", "service": "app"}'
```

## Runtime operations examples

### Example 1

### Example 2

### Example 3