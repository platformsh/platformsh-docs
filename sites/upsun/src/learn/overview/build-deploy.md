---
title: Build and deploy
weight: 3
description: "See how applications get built and deployed with {{% vendor/name %}}."
---

Each time you push a change to your app through Git or activate an [environment](/environments/_index.md),
your app goes through a process to be built and deployed.
If your app is redeployed with no changes to its codebase, the output of the previous build and deploy process is reused.

The build process looks through the configuration files in your repository and assembles the necessary containers.
The deploy process makes those containers live, replacing any previous versions, with minimal interruption in service.

![The steps in the build and deploy process](/images/workflow/build-pipeline.svg "0.50")

Hooks are points in the build and deploy process where you can inject a custom script.

## The build

The outcome of the build process is designed to be repeatable and reusable.
Each app in a project is built separately.

Container configuration depends exclusively on your configuration files.
So each container is tied to a specific Git commit.
If there are no new changes for a given container, the existing container can be reused.
This saves you the time the build step would take.

This means the build is independent of the given environment and preview environments are perfect copies of production.
If you use environment variables to set up different build configuration options for different environments,
your build step isn't reused and your preview environments may differ from production.

You can't connect to services (like databases) during the build step.
Once the app has gone through all of the build steps, it can connect to services in the deploy process.

### Build steps

1. **Validate configuration**:
   The configuration is checked by validating the `{{< vendor/configdir >}}` directory and scanning the repository for any app configuration to validate.
2. **Pull container images**:
   Any container images that have been built before and that don't have any changes are pulled to be reused.
3. **Install dependencies**:
   If you have specified additional global dependencies, they're downloaded during this step.
   This is useful for commands you may need in the build hook.
4. **Run build flavor commands**:
   For some languages (NodeJS, PHP), a series of standard commands are run based on the build flavor.
   You can change the flavor or skip the commands by specifying it in your `{{< vendor/configfile "app" >}}` file.
5. **Run build hook**:
   The `build` hook comprises one or more shell commands that you write to finish creating your production code base: for example, compiling Sass files, running a bundler, rearranging files on disk, or compiling.
   The committed build hook runs in the build container.
   During this time, commands have write access to the file system, but there aren't connections to other containers (services and other apps).

   For automated builds, you can use the [`CI` environment variable](/development/variables/use-variables.md#use-provided-variables) in build scripts and tooling to modify build behavior (for example, to disable attempts to connect to other containers during the build phase, or to disable interactivity). These modifications can help to prevent build failures.<br>
   You can also manually [cancel deployments stuck on the build hook](/environments/cancel-activity.md).

6. **Freeze app container**:
   The file system is frozen and produces a read-only container image, which is the final build artifact.

## The deploy

The deploy process connects each container from the build process and any services.
The connections are defined in your app and services configuration.

So unlike the build process, you can now access other containers,
but the file system is read-only.

### Deploy steps

1. **Hold requests**:
   Incoming [idempotent requests](https://www.iana.org/assignments/http-methods/http-methods.xhtml) (like `GET`, `PUT`, `DELETE` but **not** `POST`, `PATCH` etc.) are held.
1. **Unmount current containers**:
   Any previous containers are disconnected from their file system mounts.
1. **Mount file systems**:
   The file system is connected to the new containers.
   New branches have file systems cloned from their parent.
1. **Expose services**:
   Networking connections are opened between any containers specified in your app and services configurations.
1. **Run (pre-) start commands**:
   The [commands](/create-apps/image-properties/web.md#web-commands) necessary to start your app are run.
   Often this stage will only include a start command, which is restarted if ever terminated going forward.
   You may also, however, define a `pre_start` command, when you need to run _per-instance_ actions.
   In this case, as you might expect, the `pre_start` command is run, then the `start` command.
1. **Run deploy hook**:
   The `deploy` hook is any number of shell commands you can run to finish your deployment.
   This can include clearing caches, running database migrations, and setting configuration that requires relationship information.
1. **Serve requests**:
  Incoming requests to your newly deployed application are allowed.

After the deploy process is over, any commands in your `post_deploy` hook are run.

## Deployment types

{{% vendor/name %}} supports two deployment types - automatic and manual. These types help to provide control over when changes are applied to development, staging and production environments.

### Automatic deployment (default)

This is the default behavior for all environments. With automatic deployment, changes like code pushes and variable updates are deployed immediately. This type of deployment is best suited for rapid iteration during development.

### Manual deployment

When enabled, manual deployment lets you control when deployments happen. This means that changes will be staged but not deployed until explicitly triggered by the user. This type of deployment is ideal for teams that want to bundle multiple changes and deploy them together in a controlled manner.

When manual deployment is enabled in an environment, the following actions are queued until deployment is triggered:

| Category             | Staged Activities |
|----------------------|------------------|
| **Code**             | `environment.push`, `environment.merge`, `environment.merge-pr` |
| **Variables**        | `environment.variable.create`, `update`, `delete` |
| **Resources**        | `environment.resources.update` |
| **Domains & Routes** | `environment.domain.*`, `environment.route.*` |
| **Subscription**     | `environment.subscription.update `|
| **Environment Settings** | `environment.update.http_access`, `smtp`, `restrict_robots` |


{{< note theme="info" >}}

Use **Redeploy** to restart your application without applying staged changes.

{{< /note >}}


### Change deployment type

You can adjust deployment behavior in your environment.

{{< codetabs >}}

+++
title=Using the CLI
+++

Use the following command in the CLI to view or change the deployment type:

```bash
upsun environment:deploy:type
```
The output should look similar to the example below:

```bash
Selected project: [my-project (ID)]
Selected environment: main (type: production)
Deployment type: manual
```
<--->
+++
title=Using the Console
+++

To switch to manual, navigate to the environment settings in the Console and select the manual deployments option.

{{< /codetabs >}}

### Trigger deployment manually

Once manual deployment is enabled, eligible changes are staged. You can deploy them in the following ways:

{{< codetabs >}}

+++
title=Using the CLI
+++

Deploy staged changes to your chosen environment using the following command:

```bash
upsun environment:deploy
```

The output should look similar to the example below:

```bash
Deploying staged changes:
+---------------+---------------------------+-----------------------------------------------------------+---------+
| ID            | Created                   | Description                                               | Result  |
+---------------+---------------------------+-----------------------------------------------------------+---------+
| 5uh3xwmkh5boq | 2024-11-22T14:01:10+00:00 | Patrick pushed to main                                    | failure |
| fno2qiodq7e3c | 2024-11-22T13:06:18+00:00 | Arseni updated resource allocation on main                | success |
| xzvcazrtoafeu | 2024-11-22T13:01:10+00:00 | Pilar added variable HELLO_WORLD to main                  | success |
| fq73u53ruwloq | 2024-11-22T12:06:17+00:00 | Pilar pushed to main                                      | success |
+---------------+---------------------------+-----------------------------------------------------------+---------+
```
<--->
+++
title=Using the Console
+++

In the Console, a deploy button will be visible in the environment whenever changes are staged. Click this button to deploy your staged changes.

<--->
+++
title=Using the API
+++

Trigger the deployment of staged changes with the following:

```bash
POST /projects/{projectId}/environments/{environmentId}/deploy
```

{{< /codetabs >}}

{{< note theme="tip" >}}

As soon as your deployment type is switched from manual to automatic, all currently staged changes are deployed immediately and the environment resumes its default automatic deployment behavior.

{{< /note >}}

## Zero Downtime Deployments
## What is Zero Downtime?

Zero Downtime Deployments (ZDD) let you update environments without interrupting live traffic. By default, [deployments](#manual-deployment) use stop-start (services stop, then restart with updates). With ZDD, you can switch to a [rolling strategy](#deployment-strategies) that keeps your app online during updates.

## How Zero Downtime works

Instead of stopping services before updating, a temporary copy of your application is created and prepared behind the scenes during the deployment process. Your services work with both the original application and the temporary copy during the whole deployment process, which means that any changes you make to your services during deployment will be applied to the original application. Here's the step-by-step process:

**A clone is made of your current application**

- {{% vendor/name %}} starts a temporary container running a cloned version of your app.
- The cloned app begins handling all live traffic during this time.
- Your services (for example Redis) will serve the cloned app as well as the original app.

![A duplicate is made of your current application](/images/ZDD/ZDD-1.jpg "0.4")

**Original application is updated**

- The original app is updated with the new code and configuration.
- The deploy hook is executed for the original app.

**Cloned apps are removed after deployment**

- When deployment is complete, the clone of your app is shut down and removed.
- All traffic and services are now solely applied to the original app alone.

![The duplicate of your original application is removed](/images/ZDD/ZDD-2.jpg "0.4")

{{< note theme="warning" >}}
During the Zero Downtime Deployment process, both the old and new containers run simultaneously for a short period.
You could be temporarily billed for extra resources while both versions are active.
- If your app uses fewer resources and has a short deployment time, additional costs will be minimal.
- If your app’s deployment takes longer to run and uses larger resources, expect proportionally higher temporary costs.
{{< /note >}}

### Deployment strategies
#### Stop-start (default)

- Services stop first then restart with the new version
- Deployment is fast but may cause temporary downtime or freezing depending on the application

#### Rolling (ZDD)

- Creates a temporary copy of your services
- Routes traffic to the temporary copy while updating the original services
- Removes the temporary copy once the deployment is complete
- No downtime for users
- Deployment may take longer and use slightly more resources temporarily

### Stop-start vs Rolling (ZDD)

| Feature | Stop-start (default) | Rolling (ZDD) |
|---------|--------------------|---------------|
| **User impact** | Services may be unavailable briefly | Users experience no downtime |
| **Deployment speed** | Fast | Slightly longer |
| **Resource usage** | Standard | Higher temporarily (due to parallel services) |
| **Process** | Stop services → deploy updates → start services | Deploy temporary services → switch traffic → update original services → remove temporary services |
| **Best for** | Small apps, quick updates | Apps requiring uninterrupted availability |
| **Limitations** | Causes downtime/freezetime | Longer deploy time, higher temporary resource use |

{{< note theme="warning" >}}

**Environment type:** Zero Downtime Deployments are only available on {{% vendor/name %}} Flex.

{{< /note >}}


### Use cases

| Use Case | Recommendation |
|----------|----------------|
| Code pushes | Suitable |
| Config or environment variable changes | Suitable |
| Stateful services (databases, caches) | Not suitable |
| DB schema migrations | Not suitable _(except if updates are backward and forward compatible)_ | |

{{< note theme="info" >}}

If the last deployment failed, you can only use the default stop-start strategy.

{{< /note >}}

## How to use Zero Downtime Deployments

{{< codetabs >}}

+++
title=Using the CLI
+++

**On code push**
```bash
upsun push --deploy-strategy rolling
```

**With Manual Deployments**
```bash
upsun environment:deploy --strategy rolling
```

<--->
+++
title=Using the Console
+++

In the Console, navigate to the environment settings and trigger a deployment from the deployment modal. Select Zero Downtime as a deployment strategy.

<--->
+++
title=Using the API
+++

```
POST /projects/{projectId}/environments/{environmentId}/deploy

{
"strategy": "rolling"
}
```

{{< /codetabs >}}


## Connection handling

During any deployment, long-lived connections like WebSockets or Server-Sent Events (SSE) are dropped.

With ZDD, you can plan for smooth reconnection:

- SSE supports automatic [retry logic](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#retry).

- WebSocket clients should implement reconnect logic.

## Zero Downtime Troubleshooting

This section covers two common scenarios and how to resolve them.

### Application is slow to start

If your application takes longer to become responsive, traffic might be [switched back to your original application](#how-zero-downtime-works) before it’s fully ready. This can cause temporary errors immediately after deployment.

{{< note theme="info" title="Use a post_start command">}}

You can use the `post_start` command to ensure your app is fully active before traffic is routed to it. This command can perform checks or wait until your application starts listening on the expected port.

For example, if your framework needs several seconds to initialize (e.g. building caches or database connections), `post_start` can help coordinate the handover so the app receives traffic only when it’s ready.

An example of a `post_start` command waiting for your application would be:

```
web:
  commands:
    post_start: |
	  date
	  curl -sS --retry 20 --retry-delay 1 --retry-connrefused localhost -o /dev/null
```

**For more information about the `post_start` command, visit [web commands](/create-apps/image-properties/web.md#post_start).**

{{< /note >}}

### Deployment fails midway

If deployment fails partway through, one of the applications (either the original or the clone) may remain active in the background while the other continues to serve traffic. This can lead to an increase in resource usage and costs.

Try redeploy or deploy using the stop-start strategy (if Manual Deployments enabled) to ensure no duplicates remain active. If you still experience issues, [contact support](/learn/overview/get-support.md).

## Deployment philosophy

{{% vendor/name %}} values consistency over availability, acknowledging that it's nearly impossible to have both.
During a deployment, the [deploy hook](/create-apps/hooks/hooks-comparison.md#deploy-hook) may make database changes
that are incompatible with the previous code version.
Having both old and new code running in parallel on different servers could therefore result in data loss.

{{% vendor/name %}} believes that a minute of planned downtime for authenticated users is preferable to a risk of race conditions
resulting in data corruption, especially with a CDN continuing to serve anonymous traffic uninterrupted.

That brief downtime applies only to the environment changes are being pushed to.
Deployments to a staging or development branch have no impact on the production environment and cause no downtime.

## What's next

* See how to [configure your app](/create-apps/_index.md) for the entire process.
* Learn more about [using build and deploy hooks](/create-apps/hooks/_index.md).
