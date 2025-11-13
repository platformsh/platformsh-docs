---
title: The application lifecycle
weight: 3
description: "Understand the {{% vendor/name %}} application lifecycle and learn how to use build, deploy, and runtime hooks to control app behavior"
---

Hooks let you run custom commands at specific points in your application’s lifecycle during [`build`, `deploy`](/learn/overview/build-deploy.html), or `runtime`. They’re essential for setting up your app, managing graceful shutdowns, or preparing instances to handle traffic in autoscaling environments.

Each web application on {{% vendor/name %}} can define web commands inside its `.upsun/config.yaml` file:

```yaml
applications:
  myapp:
    type: 'python:3.13'
    web:
      commands:
        pre_start: "./scripts/setup.sh"
        start: "uwsgi --ini conf/server.ini"
        post_start: "./scripts/warm-up.sh"
```
## Web commands

| Name | Type | Required | Description |
|------|------|-----------|--------------|
| **pre_start** | string | No | Runs just before `start`. Useful for short setup actions that must run per instance, such as moving cache files or setting permissions. |
| **start** | string | Yes | The main command that launches your app. If it terminates, {{% vendor/name %}} restarts it immediately. |
| **post_start** | string | No | Runs after the `start` command but before the container is added to the router. This lets you complete warm-up tasks before the app starts handling traffic. |

{{< note theme="info" title="Note" >}}

For more information about web commands, visit the [Single-runtime Image page](/create-apps/app-reference/single-runtime-image.html#web-commands).

{{< /note >}}

## Lifecycle overview

Every application instance follows the same start-up flow:

- Pre-start prepares each instance before launch.
- Post-start completes warm-up tasks before the instance is routed into live traffic.

![The steps in the start-up flow](/images/hook-cycle.png "0.50")

This structure ensures applications can start cleanly, scale horizontally, and serve requests reliably, especially in autoscaling environments.

## Use cases 

| Hook | When to use | Example task |
|------|--------------|----------------|
| **pre_start** | For configuration and prep that must complete before your app starts | Moving cache, updating file permissions |
| **post_start** | For initialization after your app starts but before it serves traffic | Cache warming, dependency loading |

### Autoscaling example

When autoscaling [adds new instances](/manage-resources/autoscaling.html#thresholds), each instance must start and warm up before serving live requests. Use `post-start` to complete initialization tasks such as:

- Cache priming or session loading
- Running lightweight readiness checks
- Loading config or dependencies into memory

This ensures new instances are ready to perform immediately when the router adds them.

{{< note theme="tip" title="Autoscaling" >}}

For more information about Autoscaling, visit the [Autoscaling docs page](/manage-resources/autoscaling.html).

{{< /note >}}

### Zero-downtime example

If your [application takes longer to become responsive](/learn/overview/build-deploy.html#application-is-slow-to-start), traffic might be switched back to your original application before it’s fully ready. This can cause temporary errors immediately after deployment.

If your framework needs time to initialize, `post_start` can help co-ordinate so the app receives traffic only when it’s ready. An example of a `post_start` command waiting for your application would be:

```
web:
  commands:
    post_start: |
	  date
	  curl -sS --retry 20 --retry-delay 1 --retry-connrefused localhost -o /dev/null
```
{{< note theme="info" title="Zero Downtime Deployment" >}}

For more information about Zero Downtime Deployment, visit the [build deploy documentation page](/learn/overview/build-deploy.html#zero-downtime-deployments).

{{< /note >}}

## Related content

- [Build and Deploy overview](/learn/overview/build-deploy.html)  
- [Autoscaling](/manage-resources/autoscaling.html)  
- [Single-runtime Image reference](/create-apps/app-reference/single-runtime-image.html#web-commands)  
- [Zero-downtime deployments](/learn/overview/build-deploy.html#zero-downtime-deployments)  



