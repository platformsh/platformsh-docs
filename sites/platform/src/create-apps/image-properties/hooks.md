---
title: "`hooks`"
weight: 4
description: A hooks dictionary that defines which commands run at different stages in the build and deploy process.
keywords:
  - hooks
  - hooks
---

Optional in [single-runtime](/create-apps/app-reference/single-runtime-image.md#top-level-properties) and [composable](/create-apps/app-reference/composable-image.md#top-level-properties) images. 

{{% description %}}

There are three different hooks that run as part of the process of building and deploying your app.
These are places where you can run custom scripts.
They are: the `build` hook, the `deploy` hook, and the `post_deploy` hook.
Only the `build` hook is run for [worker instances](/create-apps/image-properties/workers.md), while [web instances](/create-apps/image-properties/web.md) run all three.

The process is ordered as:

{{< codetabs >}}

+++
title=Single-runtime image
+++

1. Variables accessible at build time become available.
1. [Build flavor](/create-apps/app-reference/single-runtime-image.md#build) runs if applicable.
1. Any [dependencies](/create-apps/app-reference/single-runtime-image.md#dependencies) are installed.
1. The `build` hook is run.
1. The file system is changed to read only, except for any [mounts](/create-apps/image-properties/mounts.md). 
1. The app container starts. Variables accessible at runtime and services become available.
1. The `deploy` hook is run.
1. The app container begins accepting requests.
1. The `post_deploy` hook is run.

<--->

+++
title=Composable image
+++

1. Variables accessible at build time become available.
1. The `build` hook is run.
1. The file system is changed to read only, except for any [mounts](/create-apps/image-properties/mounts.md). 
1. The app container starts. Variables accessible at runtime and services become available.
1. The `deploy` hook is run.
1. The app container begins accepting requests.
1. The `post_deploy` hook is run.

{{< /codetabs >}}

Note that if an environment changes by no code changes, only the last step is run.
If you want the entire process to run, see how
to [manually trigger builds](/development/troubleshoot.md#manually-trigger-builds).

### Writable directories during build

During the `build` hook, there are three writeable directories:

- `PLATFORM_APP_DIR`:
  Where your code is checked out and the working directory when the `build` hook starts.
  Becomes the app that gets deployed.
- `PLATFORM_CACHE_DIR`:
  Persists between builds, but isn't deployed.
  Shared by all builds on all branches.
- `/tmp`:
  Isn't deployed and is wiped between each build.
  Note that `PLATFORM_CACHE_DIR` is mapped to `/tmp`
  and together they offer about 8GB of free space.

### Hook failure

Each hook is executed as a single script, so they're considered to have failed only if the final command in them fails.
To cause them to fail on the first failed command, add `set -e` to the beginning of the hook.

If a `build` hook fails for any reason, the build is aborted and the deploy doesn't happen.
Note that this only works for `build` hooks --
if other hooks fail, the app is still deployed.

#### Automated testing

It’s preferable that you set up and run automated tests in a dedicated CI/CD tool.
Relying on {{% vendor/name %}} hooks for such tasks can prove difficult.

During the `build` hook, you can halt the deployment on a test failure but the following limitations apply:

- Access to services such as databases, Redis, Vault KMS, and even writable mounts is disabled.
  So any testing that relies on it is sure to fail.
- If you haven’t made changes to your app, an existing build image is reused and the build hook isn’t run.
- Test results are written into your app container, so they might get exposed to a third party.

During the `deploy` hook, you can access services but **you can’t halt the deployment based on a test failure**.
Note that there are other downsides:

- Your app container is read-only during the deploy hook,
  so if your tests need to write reports and other information, you need to create a file mount for them.
- Your app can only be deployed once the deploy hook has been completed.
  Therefore, running automated testing via the deploy hook generates slower deployments.
- Your environment isn’t available externally during the deploy hook.
  Unit and integration testing might work without the environment being available,
  but you can’t typically perform end-to-end testing until after the environment is up and available.

