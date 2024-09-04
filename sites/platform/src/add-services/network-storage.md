---
title: "Network Storage"
weight: -30
---

{{% vendor/name %}} supports internal "storage as a service" to provide a file store that can be shared between different application containers.

The network storage service enables a new kind of [mount](/create-apps/app-reference/single-runtime-image.md#mounts)
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

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like. When you deploy your app, you always get the latest available patches.

<table>
    <thead>
        <tr>
            <th>Grid</th>
            <th>Dedicated Gen 3</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="network-storage" status="supported" environment="grid" >}}</td>
            <td>{{< image-versions image="network-storage" status="supported" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="network-storage" status="supported" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

This service is the {{% vendor/name %}} network storage implementation, not the version of a third-party application.

{{< note theme="warning">}}

It isn't possible to upgrade or downgrade the network storage service version while keeping existing data in place.
Changing the service version requires that the service be reinitialized.
Any change to the service version results in existing data becoming inaccessible.

{{< /note >}}

### Deprecated versions

The following versions are [deprecated](/glossary.html#deprecated-versions).
They're available, but they aren't receiving security updates from upstream and aren't guaranteed to work.
They'll be removed in the future,
so migrate to one of the [supported versions](#supported-versions).

<table>
    <thead>
        <tr>
            <th>Grid</th>
            <th>Dedicated Gen 3</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="network-storage" status="deprecated" environment="grid" >}}</td>
            <td>{{< image-versions image="network-storage" status="deprecated" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="network-storage" status="deprecated" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

## Usage example

### 1. Configure the service

To define the service, use the `network-storage` type:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
  type: network-storage:<VERSION>
  disk: 256
```

`<SERVICE_NAME>` must be [RFC 1123](https://tools.ietf.org/html/rfc1123) compliant, and as such it must:

- Contain at most 63 characters
- Contain only lowercase alphanumeric characters or `-` (underscores `_` are not allowed)
- Start with an alphanumeric character
- End with an alphanumeric character

This is due to the fact that `<SERVICE_NAME>` is used as hostname for the network storage.

Note that changing the name of the service replaces it with a brand new service and all existing data is lost.
Back up your data before changing the service.

### 2. Add the mount

To define the mount accessible by your application, use the following configuration:

```yaml {configFile="app"}
name: myapp
mounts:
  <TARGET_PATH>:
    source: service
    service: <SERVICE_NAME>
    source_path: <SOURCE_PATH>
```

- `<TARGET_PATH>` is the path to your mount within the app container (relative to the app’s root).
- `<SERVICE_NAME>` is the name you [defined in step 1](#1-configure-the-service).
- `<SOURCE_PATH>` specifies where the mount points inside the service.</br>
  If the `source_path` is an empty string (`""`), your mount points to the entire service.</br>
  If you don’t define a `source_path`, {{% vendor/name %}} uses the `MOUNT_PATH` as default value, without leading or trailing slashes.
  For example, if your mount lives in the `/my/files/` directory within your app container, it will point to a `my/files` directory within the service.

### Example configuration

### [Service definition](/add-services.html)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
network-storage:
    type: network-storage:{{% latest "network-storage" %}}
    disk: 256
```

#### [App configuration](/create-apps/_index.md)

```yaml {configFile="app"}
name: myapp
mounts:
  'my/files':
    source: service
    service: network-storage
    source_path: files
```

## Multi-application usage

If your project contains [multiple apps](../create-apps/multi-app/_index.md), they can all use the same network mounts.
If the `source_path` is the same for both apps,
the files are shared between the two applications even if the mount location is different.

It's also possible to have one app mount a `source_path` that's a subdirectory of another application's mount.
For example:

```yaml {configFile="apps"}
# The name of the app container. Must be unique within a project.
app1:
  # The location of the application's code.
  source:
    root: "app1"

  [...]

  mounts:
    # The path to your mount within the app container (relative to the app's root).
    'web/uploads':
      # Specifies that the mount points to a network storage service that can be shared between apps.
      source: service
      # The name of the network storage service the mount points to.
      service: network-storage
      # Specifies where your mount points inside the external directory that is mounted to your app container.
      source_path: uploads

# The name of the app container. Must be unique within a project.
app2:
  # The location of the application's code.
  source:
    root: "app2"

  [...]

  mounts:
    # The path to your mount within the app container (relative to the app's root).
    'process':
      # Specifies that the mount points to a network storage service that can be shared between apps.
      source: service
      # The name of the network storage service the mount points to.
      service: network-storage
      # Specifies where your mount points inside the external directory that is mounted to your app container.
      # Since the target is the uploads directory app1's mount already points to,
      # the network storage service is effectively shared between app1 and app2.
      source_path: uploads/incoming

    # The path to your mount within the app container (relative to the app's root).
    'done':
      # Specifies that the mount points to a network storage service that can be shared between apps.
      source: service
      # The name of the network storage service the mount points to.
      service: network-storage
      # Specifies where your mount points inside the external directory that is mounted to your app container.
      # Since the target is the uploads directory app1's mount already points to,
      # the network storage service is effectively shared between app1 and app2.
      source_path: uploads/done
```

In this example, `app1` has access to the entire `uploads` directory by writing to `web/uploads`.
`app2` has two mounts that it can write to: `process` and `done`.
The `process` mount refers to the same directory as the `web/uploads/incoming` directory does on `app1`,
and the `done` mount refers to the same directory as the `web/uploads/done` directory on `app1`.

## Worker instances

When defining a [worker](/create-apps/app-reference/single-runtime-image.md#workers) instance,
keep in mind what mount behavior you want.

`local` mounts are a separate storage area for each instance,
while `service` mounts can be shared between instances.

For example, you can define a network storage service called `files`:

```yaml {configFile="services"}
# The name of the network storage service. Must be unique within a project.
files:
    type: network-storage:{{% latest "network-storage" %}}
    disk: 2048
```

You can then use this service to  define a `network_dir` network mount and a `local_dir` local mount,
to be used by a `web` instance and a `queue` worker instance:

```yaml {configFile="apps"}
myapp:
  # The type of the application to build.
  type: "nodejs:20"

  # Defines how much space is available to local mounts.
  disk: 512

  mounts:
    # Defines a network storage mount that can be shared by both worker instances.
    'network_dir':
      source: service
      service: files
      source_path: our_stuff

    # Defines a local mount that's available to each instance separately.
    'local_dir':
      source: local
      source_path: my_stuff

  # Defines a web instance.
  web:
    locations:
      "/":
        root: "public"
        passthru: true
        index: ['index.html']

  # Define a queue worker instance from the same code but with a different start.
  workers:
    queue:
      commands:
        start: ./start.sh
```

Both the web instance and the `queue` worker have two mount points:

- The `local_dir` mount on each is independent and not connected to each other at all
  and they *each* take 1024 MB of space.
- The `network_dir` mount on each points to the same network storage space on the `files` service.
  They can both read and write to it simultaneously.
  The amount of space it has available depends on the `disk` key specified for the service configuration (in this case, 2048 MB).

## How do I give my workers access to my main application's files?

The most common use case for `network-storage` is to allow a CMS-driven site to use a worker that has access to the same file mounts as the web-serving application.
For that case, all that's needed is to set the necessary file mounts as `service` mounts.

For example, the following `{{< vendor/configfile "app" >}}` file (fragment) keeps Drupal files directories shared between web and worker instances while keeping the Drush backup directory web-only (as it has no need to be shared).
(This assumes a Network Storage service named `files` has also been defined in `{{< vendor/configfile "services" >}}`.)

```yaml {configFile="apps"}
myapp:
  # The type of the application to build.
  type: "php:{{% latest "php" %}}"

  relationships:
    mariadb:

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
      commands:
        start: 'cd web ; drush core-cron'

  # The worker defined here also has the same 6 mounts;
  # 2 of them are shared with the web container,
  # the other 4 are local to the worker.
  workers:
    queue:
      commands:
        start: |
          cd web && drush queue-run myqueue
```

## How can I migrate a local storage to a network storage?

There is no automated way of transferring data from one storage type to another.
However, the process is fundamentally "just" moving files around on disk, so it's reasonably straightforward.

Suppose you have this mount configuration:

```yaml {configFile="app"}
name: myapp
mounts:
  web/uploads:
    source: local
    source_path: uploads
```

And want to move that to a network storage mount.
The following approximate steps do so with a minimum of service interruption.

1. Add a new `network-storage` service, named `files`,
   that has at least enough space for your existing files with some buffer.

   ```yaml {configFile="services"}
   # The name of the service container. Must be unique within a project.
   files:
       type: network-storage:{{% latest "network-storage" %}}
       disk: 1024
   ```

2. Add a new mount (`new-uploads`) to the network storage service on a non-public directory.
   (Remember the `source_path` can be the same since they're on different storage services.)

   ```yaml {configFile="app"}
   mounts:
     web/uploads:
       source: local
       source_path: uploads
     new-uploads:
       source: service
       service: files
       source_path: uploads
   ```

3. Deploy these changes.
   Then use `rsync` to copy all files from the local mount to the network mount.
   (Be careful of the trailing `/`.)

    ```bash
    rsync -avz web/uploads/* new-uploads/
    ```

4. Reverse the mounts.
   Point the `web/uploads` directory to the network mount instead.
   Commit and push the change, testing to make sure the network files are accessible.

   ```yaml {configFile="app"}
   mounts:
     old-uploads:
       source: local
       source_path: uploads
     web/uploads:
       source: service
       service: files
       source_path: uploads
   ```

5. Clean up.
   First, run another `rsync` just to make sure any files uploaded during the transition aren't lost.
   (Note the command is different here.)

   ```bash
   rsync -avz old-uploads/* web/uploads/
   ```

   Once you're confident all the files are accounted for, delete the entire contents of `old-uploads`.
   If you don't, the files remain on disk but inaccessible, just eating up disk space needlessly.

   Once that's done you can remove the `old-uploads` mount and push again to finish the process
   You are also free to reduce the `disk` size in the `{{< vendor/configfile "app" >}}` file if desired,
   but make sure to leave enough for any remaining local mounts.
