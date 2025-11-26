---
title: The application lifecycle
weight: 3
description: "Understand the {{% vendor/name %}} application lifecycle and learn how to use web commands and hooks to control app behavior"
---
<!-- vale off -->

Hooks and web commands let you automate and control different stages of your [application’s lifecycle](#lifecycle-overview).  

- Web commands (`pre_start`, `start`, `post_start`) run per instance, ensuring each container is correctly initialized before it receives traffic.  
- Hooks [(`build`, `deploy`, `post_deploy`)](/learn/overview/build-deploy.html) run at the application level and control environment-wide tasks during deployment, such as preparing images, running migrations, or performing background jobs.

Together, hooks and web commands help manage the application lifecycle, ensuring smooth start-up, reliable [autoscaling](/manage-resources/autoscaling.html), and safe deployments.

## Lifecycle overview

Every application instance follows this flow:

![The steps in the start-up flow](/images/lifecycle/app-lifecycle.png "0.50")

## Web commands

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

| Name          | Type   | Required | Blocks Traffic | Description |
|---------------|--------|----------|------------------|-------------|
| **pre_start** | string | No       | No               | Runs just before `start`. Useful for short per-instance setup actions, such as moving cache files or setting permissions. |
| **start**     | string | Yes      | Yes (until running) | The main command that launches your app. The instance cannot serve traffic until `start` is successfully running. If it terminates, {{% vendor/name %}} restarts it immediately. |
| **post_start**| string | No       | Yes (until completed) | Runs after the `start` command but *before* the container is added to the router. Instances will not receive traffic until this script completes successfully, making it ideal for warm-up tasks that must finish before the app begins handling requests. |

For more information about web commands, visit the [Single-runtime Image page](/create-apps/app-reference/single-runtime-image.html#web-commands).

{{< note theme="info" title="Blocking vs. non-blocking hooks" >}}

A hook is considered blocking if the instance cannot receive traffic until it finishes successfully.

- `start` blocks traffic until the application is running.  
- `post_start` blocks traffic until all warm-up tasks complete.  
- `pre_start` is non-blocking.

This principle applies both to instance-level and deployment-level hooks.

{{< /note >}}

## Web comannd use cases 

| Hook | When to use | Example task |
|------|--------------|----------------|
| **pre_start** | For configuration and prep that must complete before your app starts | Moving cache, updating file permissions |
| **post_start** | For initialization after your app starts but before it serves traffic | Cache warming, dependency loading |

## Deploy and post_deploy hooks

While [web commands](#web-commands) (`pre_start`, `start`, `post_start`) control per-instance startup behaviour, the `build`, `deploy`, and `post_deploy` hooks run at the application level during a deployment. Use these hooks to automate image preparation, environment-wide tasks, migrations, and background jobs that should run when the application is deployed.

Define hooks in `.upsun/config.yaml`:

```yaml
applications:
  myapp:
    type: "python:3.13"
    hooks:
      build: "pip install -r requirements.txt"
      deploy: "./scripts/migrate.sh"
      post_deploy: "./scripts/warm-cache.sh"
```

| Hook         | When it runs                                       | Blocks traffic |  Purpose                                                   |
|--------------|-----------------------------------------------------|------------------|-------------------------------------------------------------------|
| **build**    | During image build (before deployment)              | N/A              | Install dependencies, compile assets, prepare runtime image               |
| **deploy**   | After containers start, before they handle requests | Yes              | Critical, environment-wide tasks that must finish before traffic  |
| **post_deploy** | After deployment is live and serving traffic     | No               | Non-blocking background work safe to run while serving requests   |

### `deploy`

The `deploy` hook runs after new containers are created but before they are added to the router. Because it blocks traffic until it finishes, use it only for tasks that must complete before the new version goes live.

{{< note theme="note" title="Note" >}}

Keep `deploy` short. Long-running deploy hooks delay releases and may cause timeouts.

{{< /note >}}

### `post_deploy`

The `post_deploy` hook runs after the deployment is successful and the application is already serving traffic. It is intended for non-blocking, background-safe tasks.

{{< note theme="info" title="Note" >}}

`post_deploy` executes on every redeploy (even without code changes), so it’s ideal for tasks triggered by:

- configuration changes  
- new or updated environment variables  
- dependency or service updates

{{< /note >}}

## Deploy and post_deploy use cases

| Hook          | When to use                                        | Example task                             |
|---------------|---------------------------------------------------|-----------------------------------------|
| **deploy**    | Environment-wide tasks that must complete first   | Database migrations, cache clearing, updating indexes |
| **post_deploy** | Non-blocking background tasks safe to run while serving traffic | Cache warming, background imports, notifications |

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


<!-- vale on -->
