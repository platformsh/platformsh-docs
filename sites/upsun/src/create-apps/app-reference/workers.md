---
title: "`workers`"
weight: 4
description: See all of the options for controlling your apps and how they're built and deployed on {{% vendor/name %}}.
---

Optional. 

{{< codetabs >}}

+++
title=Single-runtime image
+++

Workers are exact copies of the code and compilation output as a `web` instance after a [`build` hook](/create-apps/app-reference/hooks.md).
They use the same container image.

Workers can't accept public requests and so are suitable only for background tasks.
If they exit, they're automatically restarted.

The keys of the `workers` definition are the names of the workers.
You can then define how each worker differs from the `web` instance using
the [top-level properties](/create-apps/app-reference/single-runtime-image.md#primary-application-properties).

Each worker can differ from the `web` instance in all properties _except_ for:

- `build` and `dependencies` properties, which must be the same
- `crons` as cron jobs don't run on workers
- `hooks` as the `build` hook must be the same
  and the `deploy` and `post_deploy` hooks don't run on workers.

A worker named `queue` that was small and had a different start command could look like this:

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: 'python:{{% latest "python" %}}'
    workers:
      queue:
        commands:
          start: |
            ./worker.sh
```

Workers require resource definition using `{{% vendor/cli %}} resources:set`, same as application containers.
For more information, see how to [manage resources](/manage-resources.md).


<--->

+++
title=Composable image
+++

Workers are exact copies of the code and compilation output as a `web` instance after a [`build` hook](#hooks).
They use the same container image.

Workers can't accept public requests and so are suitable only for background tasks.
If they exit, they're automatically restarted.

The keys of the `workers` definition are the names of the workers.
You can then define how each worker differs from the `web` instance using
the [top-level properties](#primary-application-properties).

Each worker can differ from the `web` instance in all properties _except_ for:

- `crons` as cron jobs don't run on workers
- `hooks` as the `build` hook must be the same
  and the `deploy` and `post_deploy` hooks don't run on workers.

A worker named `queue` that was small and had a different start command could look like this:

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    stack: [ "python@{{% latest python %}}" ]
    workers:
      queue:
        commands:
          start: |
            ./worker.sh
```

Workers require resource definition using `{{% vendor/cli %}} resources:set`, same as application containers.
For more information, see how to [manage resources](/manage-resources.md).

{{< /codetabs >}}
