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
it's important to keep in mind what mount behavior is desired.
Unless the `mounts` block is defined within the `web` and `workers` sections separately,
a top level `mounts` block apply to both instances.
However, `local` mounts are a separate storage area for each instance
while `service` mounts refer to the same file system.
For example:

```yaml
name: app

type: php:7.2

disk: 1024

mounts:
    'network_dir':
        source: service
        service: files
        source_path: our_stuff

    'local_dir':
        source: local
        source_path: my_stuff

web:
    locations:
        "/":
            root: "public"
            passthru: "/index.php"

workers:
    queue:
        commands:
            start: |
                php worker.php
```

In this case, both the web instance and the `queue` worker have two mount points: `network_dir` and `local_dir`.

* The `local_dir` mount on each is independent and not connected to each other at all
  and they *each* take 1024 MB of space.
* The `network_dir` mount on each points to the same network storage space on the `files` service.
  They can both read and write to it simultaneously.
  The amount of space it has available depends on the `disk` key specified in `services.yaml`.

## How do I give my workers access to my main application's files?

The most common use case for `network-storage` is to allow a CMS-driven site to use a worker that has access to the same file mounts as the web-serving application.
For that case, all that is needed is to set the necessary file mounts as `service` mounts.

For example, the following `.platform.app.yaml` file (fragment) will keep Drupal files directories shared between web and worker instances while keeping the Drush backup directory web-only (as it has no need to be shared).  (This assumes a service named `files` has already been defined in `services.yaml`.)


```yaml
name: 'app'
type: 'php:7.2'

relationships:
    database: 'db:mysql'

hooks:
  # ...

web:
    locations:
        '/':
            # ...

disk: 1024

mounts:
    # The public and private files directories are
    # network mounts shared by web and workers.
    'web/sites/default/files':
        source: service
        service: files
        source_path: files
    'private':
        source: service
        service: files
        source_path: private
    # The backup, temp, and cache directories for
    # Drupal's CLI tools don't need to be shared.
    # It wouldn't hurt anything to make them network
    # shares, however.
    '/.drush':
        source: local
        source_path: drush
    'tmp':
        source: local
        source_path: tmp
    'drush-backups':
        source: local
        source_path: drush-backups
    '/.console':
        source: local
        source_path: console

# Crons run on the web container, so they have the
# same mounts as the web container.
crons:
    drupal:
        spec: '*/20 * * * *'
        cmd: 'cd web ; drush core-cron'

# The worker defined here will also have the same 6 mounts;
# 2 of them will be shared with the web container,
# the other 4 will be local to the worker.
workers:
    queue:
        commands:
            start: |
                cd web && drush queue-run myqueue
```

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
