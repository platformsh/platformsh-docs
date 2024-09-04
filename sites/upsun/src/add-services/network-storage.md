---
title: "Network Storage"
weight: -30
---

The Network Storage service enables a new kind of [mount](../create-apps/app-reference/single-runtime-image.md#mounts)
that refers to a shared service rather than to a local directory.
This service allows you to store data and share it between different apps.

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like.
When you deploy your app, you always get the latest available patches.

{{< image-versions image="network-storage" status="supported" environment="grid" >}}

This service is the {{% vendor/name %}} network storage implementation, not the version of a third-party application.

{{< note theme="warning">}}

It isn't possible to upgrade or downgrade the network storage service version while keeping existing data in place.
Changing the service version requires that the service be reinitialized.
Any change to the service version results in existing data becoming inaccessible.

{{< /note >}}

{{% deprecated-versions %}}

{{< image-versions image="network-storage" status="deprecated" environment="grid" >}}

## Usage example

### 1. Configure the service

To define the service, use the ``network-storage`` type:

```yaml {configFile="app"}
services:
  # The name of the service container. Must be unique within a project.
  <SERVICE_NAME>:
    type: network-storage:<VERSION>
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
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    mounts:
      <TARGET_PATH>:
        source: service
        service: <SERVICE_NAME>
        source_path: <SOURCE_PATH>

services:
  # The name of the service container. Must be unique within a project.
  <SERVICE_NAME>:
    type: network-storage:<VERSION>
```

- `<TARGET_PATH>` is the path to your mount within the app container (relative to the app’s root).
- `<SERVICE_NAME>` is the name you [defined in step 1](#1-configure-the-service).
- `<SOURCE_PATH>` specifies where the mount points inside the service.</br>
  If the `source_path` is an empty string (`""`), your mount points to the entire service.</br>
  If you don’t define a `source_path`, {{% vendor/name %}} uses the `MOUNT_PATH` as default value, without leading or trailing slashes.
  For example, if your mount lives in the `/my/files/` directory within your app container, it will point to a `my/files` directory within the service.

### Example configuration

```yaml {configFile="services"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    mounts:
      'my/files':
        source: service
        service: network-storage
        source_path: files

services:
  # The name of the service container. Must be unique within a project.
  network-storage:
    type: network-storage:{{% latest "network-storage" %}}
```

## Multi-application usage

If your project contains [multiple apps](../create-apps/multi-app/_index.md),
they may [share `storage` mounts](/create-apps/app-reference/single-runtime-image#share-a-mount-between-several-apps).

Alternatively, they may use shared `service` mounts.
If the `source_path` is the same for both apps,
the files are shared between the two applications even if the mount location is different.

It's also possible to have one app mount a `source_path` that's a subdirectory of another application's mount.
For example:

```yaml {configFile="apps"}
applications:
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

## How do I give my workers access to my main application’s files?

If you need to use a worker with access to the same file mount as your web-serving app,
define all the necessary mounts as `service` mounts.

The following example assumes a Network Storage service named `files` has been defined in `{{< vendor/configfile "services" >}}`.
Drupal files directories are shared between the `web` and `worker` instances,
while the Drush backup directory is unique to the `web` instance.

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"

    type: "php:{{% latest "php" %}}"

    [...]

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
      # Drupal's CLI tools don't need to be shared between web and workers.
      # It wouldn't hurt anything to make them network
      # shares, however.
      '/.drush':
        source: storage
        source_path: drush
      'tmp':
        source: tmp
        source_path: tmp
      'drush-backups':
        source: storage
        source_path: drush-backups
      '/.console':
        source: storage
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

## How can I migrate data from a `storage` mount to a `service` mount?

Network Storage `service` mounts can be shared between different apps,
while `storage` mounts can only be shared between different _instances_ of the same app.
To move data from a `storage` mount to a `service` one, follow these instructions.

Assuming you have the following `storage` mount:

```yaml {configFile="app"}
applications:
  myapp:

    [...]

    mounts:
      web/uploads:
        source: storage
        source_path: uploads
```

1. Add a new `network-storage` service to your configuration:

   ```yaml {configFile="app"}
    applications:
      myapp:

        [...]

        mounts:
          web/uploads:
            source: storage
            source_path: uploads

    services:
      # The name of the service container. Must be unique within a project.
      network-storage:
        type: network-storage:{{% latest "network-storage" %}}
   ```

   {{< note >}}

   Make sure you [allocate enough disk space](/manage-resources/adjust-resources.md#vertical-scaling) to your `network-storage` service
   for your existing files with some buffer.

   {{< /note >}}

2. Add a new `service` mount, named `new-uploads`:

   ```yaml {configFile="services"}
    applications:
      myapp:

        [...]

        mounts:
          web/uploads:
            source: storage
            source_path: uploads
          new-uploads:
            source: service
            service: network-storage
            source_path: uploads

    services:
      # The name of the service container. Must be unique within a project.
      network-storage:
        type: network-storage:{{% latest "network-storage" %}}
   ```

   Note that each mount is on a different storage service, which is why they can have the same `source_path`.

3. Deploy your changes.

4. Copy all your files from the `storage` (`web/uploads`) mount to the `service` (`new-uploads`) mount using `rsync`:

   ```bash
   rsync -avz web/uploads/* new-uploads/
   ```

5. Reverse the mounts.
   To do so, rename the `storage` mount to `old-uploads`, and point the `web/uploads` directory to the `service` mount:

   ```yaml {configFile="services"}
    applications:
      myapp:

        [...]

        mounts:
          old-uploads:
            source: storage
            source_path: uploads
          web/uploads:
            source: service
            service: network-storage
            source_path: uploads

    services:
      # The name of the service container. Must be unique within a project.
      network-storage:
        type: network-storage:{{% latest "network-storage" %}}
   ```

6. Push your changes and check that the files are now accessible from the `service` mount (now named `web/uploads`).
   To check that no files were lost during the transfer, run the following command:

   ```bash
   rsync -avz old-uploads/* web/uploads/
   ```

7. Delete the contents of the `old-uploads` `storage` mount before removing it.

8. Push your changes again.
