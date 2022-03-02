---
title: "Network Storage"
weight: 8
---

Platform.sh supports internal "storage as a service" to provide a file store that can be shared between different application containers.

The network storage service enables a new kind of [mount](../app/app-reference.md#mounts)
that refers to a shared service rather than to a local directory.
Your apps can use any combination of `local` and `service` mounts.

{{< note >}}

Writing to network mounts is slightly slower than to local mounts.
In most cases, you shouldn't notice it.
It's more significant when you employ high-volume sequential file creation
(create a large number of small files in rapid succession).
If your app does this regularly, a local mount is more effective.

{{< /note >}}

## Supported versions

| **Grid** | **Dedicated** | **Dedicated Generation 3** |
|----------------------------------|---------------|---------------|
|  {{< image-versions image="network-storage" status="supported" environment="grid" >}} | {{< image-versions image="network-storage" status="supported" environment="dedicated" >}} | {{< image-versions image="network-storage" status="supported" environment="dedicated-gen-3" >}} |

{{< image-versions-legacy "network-storage" >}}

This service is the Platform.sh network storage implementation, not to a version of a third-party application.
Version 2.0 isn't recommended for the Grid.
You should use version 1.0 unless you are a [Dedicated Generation 3](../../dedicated-gen-3/overview.md) user.
Dedicated Generation 3 users can use version 2.0 even on their Development environments.

{{< note theme="warning">}}

It isn't possible to upgrade or downgrade the network storage service version while keeping existing data in place.
Changing the service version requires that the service be reinitialized.
Any change to the service version results in existing data becoming inaccessible.

{{< /note >}}

## Supported regions

The Network storage service is available on all regions except the legacy regions:

* `eu.platform.sh`
* `us.platform.sh`

If you're on one of those and require the service,
you should [migrate your project](/guides/general/region-migration.md#region-migration) to a newer region.

## Usage example

{{% endpoint-description type="network-storage" noApp=true /%}}

## Multi-application usage

If your project contains [multiple apps](../app/multi-app.md), they can all use the same network mounts.
If the `source_path` is the same in both `.platform.app.yaml` files,
the files are shared between the two applications even if the mount location is different.

It's also possible to have one app mount a `source_path` that's a subdirectory of another application's mount.
For example:

`app1`:

```yaml
mounts:
    'web/uploads':
        source: service
        service: files
        source_path: uploads
```

`app2`:

```yaml
mounts:
    'process':
        source: service
        service: files
        source_path: uploads/incoming
    'done':
        source: service
        service: files
        source_path: uploads/done
```

In this example, `app1` has access to the entire `uploads` directory by writing to `web/uploads`.
`app2` has two mounts that it can write to: `process` and `done`.
The `process` mount refers to the same directory as the `web/uploads/incoming` directory does on `app1`,
and the `done` mount refers to the same directory as the `web/uploads/done` directory on `app1`.

## Worker instances

When defining a [worker](../app/app-reference.md#workers) instance,
keep in mind what mount behavior you want.
If you don't define `mounts` separately within the `web` and `workers` sections,
the top-level `mounts` block applies to both instances.

`local` mounts are a separate storage area for each instance,
while `service` mounts refer to the same file system.

For example, you can define a network storage service:

```yaml {location=".platform/services.yaml"}
files:
    type: network-storage:1.0
    disk: 2048
```

You can then use this service to  define a `network_dir` network mount and a `local_dir` local mount,
to be used by a web instance and a `queue` worker instance:

```yaml {location=".platform.app.yaml"}
mounts:
    # Define a network storage mount that's available to both instances together
    'network_dir':
        source: service
        service: files
        source_path: our_stuff

    # Define a local mount that's available to each instance separately
    'local_dir':
        source: local
        source_path: my_stuff

# Define how much space is available to local mounts
disk: 512

# Define a web instance
web:
    locations:
        "/":
            root: "public"
            passthru: true
            index: ['index.html']

# Define a worker instance from the same code but with a different start
workers:
    queue:
        commands:
            start: ./start.sh
```

Both the web instance and the `queue` worker have two mount points:

* They each have a separate `local_dir` mount.
  These mounts aren't connected and so writing to one doesn't affect the other.
  Each mount takes 512&nbsp;MB of space for a total of 1024&nbsp;MB.
* They share a `network_dir` mount.
  This is a single mount and both instances read and write to the same files.
  It has 2048&nbsp;MB of space, as defined in the service configuration.

## How can I migrate a local storage to a network storage?

There is no automated way of transferring data from one storage type to another.  However, the process is fundamentally "just" moving files around on disk, so it is reasonably straightforward.

Suppose you have this mount configuration:

```yaml
mounts:
    web/uploads:
        source: local
        source_path: uploads
```

And want to move that to a network storage mount.  The following approximate steps will do so with a minimum of service interruption.

1) Add a new `network-storage` service, named `files`, that has at least enough space for your existing files with some buffer.  You may need to increase your plan's disk size to accommodate it.

2) Add a new mount to the network storage service on a non-public directory:

    ```yaml
    mounts:
        new-uploads:
            source: service
            service: files
            source_path: uploads
    ```

    (Remember the `source_path` can be the same since they're on different storage services.)

3) Deploy these changes.  Then use `rsync` to copy all files from the local mount to the network mount.  (Be careful of the trailing `/`.)

    ```bash
    rsync -avz web/uploads/* new-uploads/
    ```

4) Reverse the mounts.  That is, point the `web/uploads` directory to the network mount instead:

    ```yaml
    mounts:
        web/uploads:
            source: service
            service: files
            source_path: uploads
        old-uploads:
            source: local
            source_path: uploads
    ```

    Commit and push that.  Test to make sure the network files are accessible.

5) Cleanup.  First, run another rsync just to make sure any files uploaded during the transition are not lost.  (Note the command is different here.)

    ```bash
    rsync -avz old-uploads/* web/uploads/
    ```

    Once you're confident all the files are accounted for, delete the entire contents of `old-uploads`.  If you do not, the files will remain on disk but inaccessible, just eating up disk space needlessly.

    Once that's done you can remove the `old-uploads` mount and push again to finish the process.  You are also free to reduce the `disk` size in the `.platform.app.yaml` file if desired, but make sure to leave enough for any remaining local mounts.

## Why do I get an `invalid service type` error with network storage?

The `network-storage` service is only available on our newer regions.  If you are running on the older `us` or `eu` regions and try to create a `network-storage` service you will receive this error.

To make use of `network-storage` you will need to migrate to the newer `us-2` or `eu-2` regions.  See our [tutorial on how to migrate regions](/guides/general/region-migration.md) for more information.
