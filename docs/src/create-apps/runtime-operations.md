---
title: Runtime operations
description: Set up runtime operations to run one-off commands on your project through the Platform.sh API.
---

Like crons, runtime operations allow you to trigger one-off commands or scripts on your project.
However, runtime operations don't run on a specific schedule. 
They can be triggered on your app through the Platform.sh API.

You can use runtime operations if you have Grid or {{% names/dedicated-gen-3 %}} environments.

For example, if you have a static website,
you may want to set up a runtime operation to occasionally fetch content from a backend system
without having to rebuild your whole app.

When you set up a runtime operation,
you can specify which users can trigger it according to their `role`: `viewer`, `contributor` or `admin`.
If you don't use the `role` option when configuring your runtime operation,
by default any users with the `contributor` role can trigger it. 

The following example is a runtime operation that can be triggered to clear the cache of a Drupal site:

```yaml {location=".platform.app.yaml"}
operations:
  clear-cache:
    role: admin
    commands:
      start: cd public && drush cc all
```

To trigger the cache clear, you'd need to be an admin and run the following command from the Platform.sh API:

```bash
$ platform p:curl -e <environment> deployments/current/operations -X POST -d '{"operation": "clear-cache", "service": "app"}'
```