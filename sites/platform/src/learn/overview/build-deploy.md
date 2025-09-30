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
   The configuration is checked by validating the `{{< vendor/configdir >}}` directory and scanning the repository for any app configurations to validate individually.
2. **Pull container images**:
   Any container images that have been built before and that don't have any changes are pulled to be reused.
3. **Install dependencies**:
   If you have specified additional global dependencies, they're downloaded during this step.
   This is useful for commands you may need in the build hook.
4. **Run build flavor commands**:
   For some languages (NodeJS, PHP), a series of standard commands are run based on the build flavor.
   You can change the flavor or skip the commands by specifying it in your `{{< vendor/configfile "app" >}}` file.
5. **Run build hook**:
   The `build` hook comprises one or more shell commands that you write to finish creating your production code base.
   It could be compiling Sass files, running a bundler, rearranging files on disk, or compiling.
   The committed build hook runs in the build container.
   During this time, commands have write access to the file system, but there aren't connections to other containers (services and other apps).
   Note that you can [cancel deployments stuck on the build hook](/environments/cancel-activity.md).
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
   The [commands](/create-apps/app-reference/single-runtime-image.md#web-commands) necessary to start your app are run.
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

{{% vendor/name %}} supports two deployment types - automatic and manual. These types help to provide control over when changes are applied to staging and production environments.

### Automatic deployment (default)

This is the default behavior for all environments. With automatic deployment, changes like code pushes and variable updates are deployed immediately.

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

Manual deployment is available for **development**, **staging** and **production** environments. 

{{< /note >}}


### Change deployment type

You can adjust deployment behavior in your environment (staging or production only). 

{{< codetabs >}}

+++
title=Using the CLI
+++

Use the following command in the CLI to view or change the deployment type:

```bash
platform environment:deploy:type
```
The output should look similar to the example below:

```bash
Selected project: [my-project (ID)]
Selected environment: main (type: production)
Deployment type: manual
```

For more information about how this command works, use:

```bash
platform environment:deploy:type --help
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
platform environment:deploy
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
