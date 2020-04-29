# Plan and application sizing

Platform.sh handles resource allocation in a reserve approach, rather than on-demand.  That is, your application and services are given a certain amount of resources and can use as much, or as little, of them as needed.

There are two levels of resource control.

## The Plan size

Your Plan size is the total CPU and RAM available to your entire production environment.  This is what you pay for, and can be selected on the "Edit Plan" screen.

The plan size can be one of:

* Small
* Standard
* Medium
* Large
* X-Large
* 2X-Large

Each comes with an increasing CPU and memory pool that gets shared by all of the containers in your production environment.  That means that, in practice, the memory available on an individual application is far less than the Plan's total memory; that memory is divided up between the application, database, caching server, etc, and those backend services are often more memory-intensive than the application.

Additionally, a "Development" plan has no production resourcing, and all environments are treated like development branches.

## Service sizes

Services (those defined in `services.yaml`) also come in one of a number of sizes: `S`, `M`, `L`, `XL`, `2XL`, `4XL`.

These sizes have a fixed amount of CPU and RAM associated with them.

Service sizes are set via the `size` property in `services.yaml`.  If not set, the default value is `AUTO`.

## Application sizes

Applications (those defined by the presence of a `.platform.app.yaml`) also come in one of a number of sizes: `XS`, `S`, `M`, `L`, `XL`, `2XL`, `4XL`.

These sizes have a fixed amount of CPU associated with them, and a partially configurable amount of RAM.

| Size | CPU  |
|------|------|
|  XS  | 0.25 |
|  S   | 0.5  |
|  M   | 1.0  |
|  L   | 2.0  |
|  XL  | 4.0  |
|  2XL | 8.0  |

The application size may be set via the `size` property in `.platform.app.yaml`.  If not set, the default value is `AUTO`.

Note: The `XS` container size is only available if you specify a `resource` block as described below.

## Application memory

Application containers have memory allocated to them based on their container size as well, but the ratio is configurable.  Specifically, there are two properties that can be adjusted.  Their default values are shown below.

```php
resources:
    base_memory: 64
    memory_ratio: 256
```

The `base_memory` is a fixed size (in megabytes) that the container will have, period.  The `memory_ratio` is a multiplier based on the CPU size.  That is, an `S` CPU size is 0.5 CPU slides, with the above configuration it would get 64 + 0.5 x 256 = 192 MB of RAM.  If the same application had its size increased to an XL, it would get 64 + 4 x 256 = 1088 MB of RAM.

Memory is expressed as two separate values to allow for different performance profiles between different applications.  For instance, PHP applications have a relatively low base memory need to just start up, but each parallel request consumes many megabytes of memory.  PHP applications therefore would benefit from a low `base_memory` and a high `memory_ratio`.  That way, as the container's CPU size is scaled up its memory allocation naturally scales to match.

Applications in languages that have a persistent runtime, such as Java or Go, have a high baseline memory need to just boot up but then each parallel request consumes relatively little memory.  They would benefit from a much higher `base_memory` value and a lower `memory_ratio`, so that any container size has sufficient memory to start the application.

The default values are appropriate for most reasonably sized scripted applications (PHP, Python, Node.js, Ruby) and so should rarely be changed.

## Production sizing

When deploying a production environment, Platform.sh tries to use as much of the configured Plan as possible.

First, all services and applications are allocated CPU and memory according to their explicit requests via `size` and `resources`.  If the total CPU and RAM requested is more than the plan offers, the deploy will be rejected with an error message.

Next, any services and applications that did not specify a size will be automatically allocated the largest container size available such that they all get a "fair" share of the remaining resources.  If the Plan does not have enough CPU and RAM to auto-allocate each container at least an `S` size, the deploy will be rejected with an error message.

The `XS` container size is only available if specified explicitly.  It generally should be used only for static or nearly-static containers, or for worker instances that are expected to be fairly low-traffic.  It a good fit for static sites, or headless applications where the front-end portion can be served as a static site with a separate normally-sized application for the backend.

## Development sizing

When deploying a development environment (everything except `master`, or a `master` environment on a Development plan), the `size` property is ignored and all services and applications are deployed as `S` containers.  The `resources` block of an application will be respected, however, so that memory-intensive applications can still run in development environments.

## Recommended usage

In the typical case, the default "fair" allocation will be the best option.  The overwhelming majority of applications should not set these values and allow the automatic allocation work.  That will result in the best overall outcome.

If a Plan size is increased, the auto-allocator will have more resources to give out.  If the containers are all set at fixed sizes, however, they will not get any bigger and the extra resources will go to waste.  If the `size` property is not set, the containers will increase in size as much as possible, getting more CPU and memory as available.

There are three general cases where setting these values manually is helpful:

* Setting a particular container to a fixed `S` or `XS` size, to indicate that it really doesn't need much CPU or RAM.  Static sites, background workers, and other low-need containers can be set that way to allow more resources to go to the applications and services that really need them.
* Shifting memory allocation from the `memory_ratio` to `base_memory` for applications with a high baseline need but low per-request need, such as Java or Go applications.  In general, use a `base_memory` a bit higher than your measured memory usage under no load and then adjust the `memory_ratio` as needed.  You will need to do your own profiling to determine optimal values.
* For especially memory intensive per-process applications, setting a higher `memory_ratio` will give those applications more head room to grow.  However, be aware that doing so may draw memory away from other applications or services that need it.  Try to optimize your application before throwing more resources at it.
