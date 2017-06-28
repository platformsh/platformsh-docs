# Custom sizing

By default, Platform.sh will automatically select an appropriate resources (CPU and memory) for a container when it's deployed based on the plan size and the number of other containers in the cluster.  The more containers in a project the fewer resources each one gets and vice versa, with similar containers getting similar resources.

Usually that's fine, but sometimes it's undesireable.  You may, for instance, want to have a queue worker container that you know has low memory and CPU needs, so it's helpful to give it fewer resources and another container more.  Or a given service may be very heavily used in your architecture so it needs all the resources it can take.  In those cases you can provide sizing hints to the system on a per-service basis.

Every application container as well as every service in `services.yaml` supports a `size` key, which instructs the system how many resources to allocate to it.  The exact CPU and memory allocated will depend on the application or service type.

Legal values for the `size` key are `AUTO` (the default), `S`, `M`, `L`, `XL`.

Note that in a development environment this value is ignored and always set to `S`.  It will only take effect in a production deployment.  If the total resources requested by all apps and services is smaller than what the plan size allows then a production deployment will fail with an error.

# How do I make a queue worker container smaller to save resources?

Simply set the `size` key to `S` to ensure that container gets fewer resources, leaving more to be allocated to other containers.

```yaml
name: worker

type: nodejs:6.10
size: S

...
```
