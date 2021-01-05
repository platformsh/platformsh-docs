---
title: "Custom sizing"
weight: 3
sidebarTitle: "Size"
---

By default, Platform.sh will automatically select appropriate resource sizes (CPU and memory) for a container when it's deployed, based on the plan size and the number of other containers in the cluster.  The more containers in a project the fewer resources each one gets, and vice versa, with similar containers getting similar resources.

{{< note >}}
These are advanced settings and should only be used by experienced Platform.sh users.  99.9% of the time our default container sizes are the correct choice for best performance.
{{< /note >}}

Usually that's fine, but sometimes it's undesirable.  You may, for instance, want to have a queue worker container that you know has low memory and CPU needs, so it's helpful to give that one fewer resources and another container more.  Or a given service may be very heavily used in your architecture so it needs all the resources it can take.  In those cases you can provide sizing hints to the system on a per-service basis.

Every application container as well as every service in `.platform/services.yaml` supports a `size` key, which instructs the system how many resources to allocate to it.  The exact CPU and memory allocated will depend on the application or service type, and we may adjust these values over time to better optimize resource usage.

Legal values for the `size` key are `AUTO` (the default), `S`, `M`, `L`, `XL`, `2XL`, `4XL`.

If the total resources requested by all apps and services is larger than what the plan size allows then a production deployment will fail with an error.

Note that in a development environment this value is ignored.  Service containers are always set to size `S` in development environments.  The application container is always set to the "Development Application Size" as configured on the plan.  That defaults to `S` but you can increase it on your plan settings page for a fee.

## How to modify my Platform.sh project plan and its resources

1. [Login to your account](https://accounts.platform.sh/user) to view the accessible projects.
For the projects that you are the Account Owner for, you will see three vertical dots. 
Click those dots to pull up a drop-down menu and select edit to modify that project’s configuration.

2. Update the plan's settings according to you needs

From there you'll be able to update several settings such as the:
- plan size
- number of environments
- Environments application size
- storage sizing
- number of Users

The pricing will be displayed and updated according to the changes.

If you did some changes that you wish to apply, click the Update Plan button on the bottom of the page.

{{< note >}}
Note: Production-sized Platform.sh subscriptions cannot be downgraded to a Development plan due to potential feature conflicts. If looking to downgrade a plan, [please file a support ticket.](https://accounts.platform.sh/platform/support)
{{< /note >}}

## How do I make a background processing container smaller to save resources?

Simply set the `size` key to `S` to ensure that the container gets fewer resources, leaving more to be allocated to other containers.

```yaml
name: processing

type: nodejs:14
size: S

...
```
