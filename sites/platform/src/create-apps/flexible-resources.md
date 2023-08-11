---
title: Use flexible resources
sidebarIgnore: true
---

If you have a high-memory plan, your project is allocated additional RAM resources.
If your containers aren't using all of your project's allocated CPU,
they're automatically upgraded to the next highest available container size.

If the CPU resources are already fully allocated,
your containers aren't upgraded because there isn't room for CPU upgrades.

{{< note title="Example" >}}

If you have a Standard plan, your project is allocated 1&nbsp;vCPU and 1&nbsp;GB RAM.
If you upgrade this to a high-memory Standard plan, the RAM limit rises to 2&nbsp;GB.

You might be running a project based on the [Django guide](../guides/django/_index.md)
or [Django template](https://github.com/platformsh-templates/django4).
With just the basics, you have a Django app container and a PostgreSQL database container.

By default, your Django app is allocated 0.4&nbsp;CPU and your database is allocated 0.25&nbsp;CPU.
This means you're using 0.65&nbsp;CPU of your total 1&nbsp;vCPU.
You have CPU resources to spare. 

If you upgrade to a high-memory Standard plan,
your database is automatically updated to the next highest size,
using 0.4&nbsp;CPU and more than doubling its available RAM.

{{< /note >}}

If your project is using the full allocation of CPU and so can't be allocated memory automatically,
you can set the resources to be more flexible.
This allows you to free up CPU from less-CPU-intensive containers
so that other containers can increase in size and use the available memory.

{{< note title="Example" >}}

If you have a Medium plan, your project is allocated 2&nbsp;vCPU and 3&nbsp;GB RAM.
If you upgrade this to a high-memory Medium plan, the RAM limit rises to 4&nbsp;GB.

If you have the same setup as the previous example,
your Django app is allocated 1.2&nbsp;CPU and your database is allocated 0.75&nbsp;CPU.
This means you're using 1.95&nbsp;CPU of your total 2&nbsp;vCPU.
You don't have CPU resources to spare. 

If you upgrade to a high-memory Medium plan, you don't see a change in container size.
The containers don't have room to grow to the next size.
Define `resources` for your Django app to free up resources for your database.

{{< /note >}}

## Use flexible resources

Sometimes you have apps that are more memory-intensive.
In such cases, you can adjust the amount of memory using the `resources` key in your [app configuration](./_index.md).
All memory must stay within the limits set by your plan.

{{< note >}}

If you don't understand how your resources are being allocated or are having issues configuring them,
[open a support ticket](https://console.platform.sh/-/users/~/tickets/open?category=high-mem-plans).
The Support team can look into the details of your project.

{{< /note >}}

The `resources` key has the following possible options:

| Name           | Type      | Minimum | Description                                                               |
| -------------- | --------- | ------- | ------------------------------------------------------------------------- |
| `base_memory`  | `integer` | 64      | The base amount of memory in MB to be given to the container. Up to 1024. |
| `memory_ratio` | `integer` | 128     | The amount of memory in MB that increases with CPU size. Up to 1024.      |

The memory allocated to the container is calculated as the base memory plus the memory ratio multiplied by the CPU:
`memory = base_memory + (memory_ratio * CPU)`.

When the `resources` key is set, the CPU sizes come from the following table:

| Size | CPU  |
| ---- | ---- |
| XS   | 0.25 |
| S    | 0.5  |
| M    | 1    |
| L    | 2    |
| XL   | 4    |
| 2XL  | 8    |

So you might have the `resources` set as follows:

```yaml {location=".platform.app.yaml"}
resources: 
    base_memory: 128
    memory_ratio: 180
```

If your app is set with a `size` of `S`, it gets 218&nbsp;MB of memory: `128 + (0.5 * 180) = 218`.
If you change the `size` to `L`, it gets 488&nbsp;MB of memory: `128 + (2 * 180) = 488`.

## Other containers and workers

Setting the `resources` key on one app doesn't affect other apps in your project.
So you can set it for one app and have your other apps be assigned resources automatically.

Workers based on apps with the `resources` key default to inheriting the set resources.
To free memory for your main app,
set the values within the `resources` key to be lower for your workers.

## Performance profiles

The two options for `resources` allow for different performance profiles.
Some apps, such as many PHP apps, don't require so much memory to start
but need a lot of memory for each parallel request.
Such apps benefit from a low `base_memory` and a high `memory_ratio`.

Other apps, such as those with a persistent runtime including many Java and Go apps,
require more memory to get started
but don't need much memory for each parallel request.
Such apps benefit from a high `base_memory` and a low `memory_ratio`.
