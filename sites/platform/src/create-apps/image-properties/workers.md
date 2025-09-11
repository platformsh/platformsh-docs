---
title: "`workers`"
weight: 4
description: Defines the list of worker names, which are alternate copies of the application to run as background processes.
---

{{% description %}}

Optional in [single-runtime](/create-apps/app-reference/single-runtime-image.md#top-level-properties) and [composable](/create-apps/app-reference/composable-image.md#top-level-properties) images. 

Workers are exact copies of the code and compilation output as a `web` instance after a [`build` hook](/create-apps/image-properties/hooks.md).
They use the same container image.

Workers can't accept public requests and so are suitable only for background tasks.
If they exit, they're automatically restarted.

The keys of the `workers` definition are the names of the workers.
You can then define how each worker differs from the `web` instance using
the top-level properties (see details for [single-runtime image](/create-apps/app-reference/single-runtime-image.md#top-level-properties) or [composable image](/create-apps/app-reference/composable-image.md#top-level-properties) top-level properties).

Each worker can differ from the `web` instance in all properties _except_ for:

- `build` and `dependencies` properties, which must be the same
- `crons` as cron jobs don't run on workers
- `hooks` as the `build` hook must be the same
  and the `deploy` and `post_deploy` hooks don't run on workers.

A worker named `queue` that was small and had a different start command could look like this:

```yaml {configFile="app"}
workers:
  queue:
    size: S
  commands:
    start: |
      ./worker.sh
```

For resource allocation, using workers in your project requires a [{{< partial "plans/multiapp-plan-name" >}} plan or larger](https://platform.sh/pricing/).
