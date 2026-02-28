---
title: "mounts"
weight: 4
description: Mounts are writable file system storage you can attach to your app container.  
---


Optional in [single-runtime](/create-apps/app-reference/single-runtime-image.md#primary-application-properties) and [composable](/create-apps/app-reference/composable-image.md#primary-application-properties) images.

On Upsun, because your app’s filesystem is read-only by default, you define mounts to link external writable storage to your container (like plugging in a hard drive) so your application can persist uploads, generated files, and other runtime data across deployments.


## Mounts - key points
In Upsun, mounts are: 
TODO: Add a few bullets about what mounts are.
- Not versioned in Git.
- Not shared across [environments](/environments/_index.md). A file uploaded in a preview environment is not visible in production.\ 
  - To copy data across environments, you must use [create an environment](/environments/_index.md#create-environments) or manually sync the data by using the CLI. TODO: Which command?\ 
  - When you [back up an environment](/environments/backup.md), data on mounts is included in the backup. TODO: All mount types? Or just storage, service, and instance?
- Not available during the build process. TODO: Explain this.
- Not suitable for databases.\ 
  - Databases must run as managed `services` (for example, PostgreSQL, MySQL, MariaDB). These services provide dedicated storage, proper data durability and backups, replication and failover, and correct file system tuning for database workloads. 



## Mount types {#mount-types}

Choosing the appropriate mount type ensures reliable data persistence, optimal performance, and predictable behavior.

Use the information below to choose which mount type to specify in the `.application.mounts.source` key in your `config.yaml` file when you [define a mount](#define-a-mount).

| Mount type     | Persistent?                     | Shared?                                | Description                                      |
|------------|----------------------------------|----------------------------------------|-----------------------------------------------|
| `storage`  | Yes (across app restarts and redeploys)                             | Yes (between instances, optionally between apps) | Best for user uploads, media, durable data.<br/>Default mount type; implicitly handles horizontal scaling (multiple instances of the _same_ app). You can also configure it to be [shared across different apps](#share-a-mount-between-several-apps). Automatically provisioned NSF volume; disk size is configurable via Console and [`upsun resources:set`](#administration/cli/reference.md#resourcesset) CLI command. Example: `upsun resources:set disk=2048`. <br/>Changing the disk size can affect billing.               |
| `service`  | Yes                              | Yes (between multiple apps)            | Best for data sharing across apps and workers in the same environment (example: a frontend app and worker accessing a shared media directory).<br/>You must [declare a Network Storage `service`](/add-services/network-storage.md) in the `.services` section of `config.yaml` to link your app container to the service that provides the storage.                        |
| `instance` | No (TO DO: Check this. PR says "Persistent across redeployments (per instance)")   | No                                     | Best for logs, instance-specific files. Fixed size (8 GB).<br/>Dedicated local storage per instance.                |
| `tmp`      | No                     | No (isolated per container instance)                                     | Best for caches, transient data (session files, build artifacts, search indexes that can be rebuilt).<br/>Local, writable, ephemeral SSD storage on the host machine running your application container. Fixed size (8 GB).<br/>Mounted at `/tmp` inside the container.<br/>Removing a `tmp` mount from `.upsun/config.yaml` doesn’t delete its directory—files remain until manually removed or the container is moved to another host during maintenance.  |

### Choosing between `storage` and `service` mounts

Both `storage` and `service` mounts provide persistent, network-backed file storage (NFS) and can support horizontal scaling. The difference is primarily **scope, control, and architectural intent**.

Use the following information to decide which mount type fits your use case.

#### `storage` mount

**Best for:**
- A single app that needs persistent writable storage  
- Horizontally scaled instances of the same app sharing files (built in support; no extra configuration required)
- Simple setups where storage does not need to be independently managed  

**What it provides:**
- Persistent storage automatically provisioned for the app  
- Shared access across all instances of that app  
- The ability to share data across apps (within the same project), if configured  

**When to choose it:**
- You just need persistent writable storage  
- Your use case is straightforward (such as user uploads, generated assets)  
- You don’t need centralized lifecycle control over the storage resource  
- You want the simplest configuration  

**Trade-offs:**
- Backed by NFS, so it has synchronization overhead  
- Not suitable for high-throughput, write-heavy, or temporary workloads  
- Less explicit architectural separation compared to a service-based approach  

#### `service` mount (Network Storage service)

**Best for:**
- Storage that must be shared across multiple apps and/or workers 
- Architectures where storage is a clearly defined shared project resource  
- Situations requiring more control over how storage is provisioned and referenced  

**What it provides:**
- A separately defined Network Storage service  
- Explicit configuration and centralized management  
- Data sharing across multiple apps and workers in the same environment  
- Supports horizontal scaling with the addition of a [Network Storage `service`](/add-services/network-storage.md); however, `storage` mounts are preferred for scaling multiple instances of the _same_ app

**When to choose it:**
- Multiple apps and workers need access to the same storage 
- You want storage defined independently from any single app  
- You need architectural clarity around shared infrastructure  
- You expect storage to outlive or be reused across app changes  

**Trade-offs:**
- Requires you to configure a [Network Storage `service`](/add-services/network-storage.md)  
- Slightly more complex than a default `storage` mount  
- Still NFS-backed, so subject to the same performance and synchronization limitations  

## Define a mount

| Name          | Type                 | Required | Description |
| ------------- | -------------------- | -------- | ----------- |
| `source`      | `string`             | Yes      | `storage`, `instance`, `tmp` (or `temporary`), or `service`. See the [Mount types](#mount-types) section of this topic. |
| `source_path` | `string`             | No       | Specifies where the mount points **inside the external directory (/mnt)**.<br/><br/> - If you explicitly set a `source_path`, your mount points to a specific subdirectory in the external directory. <br/><br/> - If the `source_path` is an empty string (`""`), your mount points to the entire external directory.<br/><br/> - If you don't define a `source_path`, {{% vendor/name %}} uses the {{< variable "MOUNT_PATH" >}} as default value, without leading or trailing slashes.</br>For example, if your mount lives in the `/web/uploads/` directory in your app container, it will point to a directory named `web/uploads` in the external directory.  </br></br> **WARNING:** Changing the name of your mount affects the `source_path` when it's undefined. See [how to ensure continuity](#change-name) and maintain access to your files. |
| `service`     | `string`             |         | In a multi-app setup, when sharing a `storage` mount or a `service` ([Network Storage service](/add-services/network-storage.md)) mount between apps, you must set `service` to the name of the owning app or Network Storage. |

Whether a mounted directory is publicly accessible depends on the [`web.locations` configuration](/create-apps/image-properties/web.md) configuration. You can make all its files public, all private, or apply different rules depending on the path or type.

### Example

To define a mount, use the following configuration:

{{< codetabs >}}

+++
title=Single-runtime image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: nodejs:{{% latest "nodejs" %}}
    source:
      root: "/"
    mounts:
      '{{< variable "MOUNT_PATH" >}}':
        source: {{< variable "MOUNT_TYPE" >}}
        source_path: {{< variable "SOURCE_PATH_LOCATION" >}}
```

<--->

+++
title=Composable image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: "composable:{{% latest composable %}}"
    source:
      root: "/"
    stack:
      runtimes: [ "nodejs@{{% latest nodejs %}}" ]
    mounts:
      '{{< variable "MOUNT_PATH" >}}':
        source: {{< variable "MOUNT_TYPE" >}}
        source_path: {{< variable "SOURCE_PATH_LOCATION" >}}
```

{{< /codetabs >}}


{{< variable "MOUNT_PATH" >}} is the path to your mount **within the app container** (relative to the app's root).
If you already have a directory with that name, you get a warning that it isn't accessible after the build.
See how to [troubleshoot the warning](../troubleshoot-mounts.md#overlapping-folders).

### Example configuration

{{< codetabs >}}

+++
title=Single-runtime image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: "nodejs@{{% latest nodejs %}}"
    source:
      root: "/"
    mounts:
      'web/uploads':
        source: storage
        source_path: uploads
      '/.tmp_platformsh':
        source: tmp
        source_path: files/.tmp_platformsh
      '/build':
        source: storage
        source_path: files/build
      '/.cache':
        source: tmp
        source_path: files/.cache
      '/node_modules/.cache':
        source: tmp
        source_path: files/node_modules/.cache
```

<--->

+++
title=Composable image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: "composable:{{% latest composable %}}"
    source:
      root: "/"
    stack:
      runtimes: [ "nodejs@{{% latest nodejs %}}" ]
    mounts:
      'web/uploads':
        source: storage
        source_path: uploads
      '/.tmp_platformsh':
        source: tmp
        source_path: files/.tmp_platformsh
      '/build':
        source: storage
        source_path: files/build
      '/.cache':
        source: tmp
        source_path: files/.cache
      '/node_modules/.cache':
        source: tmp
        source_path: files/node_modules/.cache
```

{{< /codetabs >}}

### Ensure continuity when changing the name of your mount {#change-name}

Changing the name of your mount affects the default `source_path`.

Suppose you have a `/my/cache/` mount with an undefined `source_path`:

{{< codetabs >}}

+++
title=Single-runtime image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: "nodejs@{{% latest nodejs %}}"
    mounts:
      '/my/cache/':
        source: tmp
```

<--->

+++
title=Composable image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: "composable:{{% latest composable %}}"
    mounts:
      '/my/cache/':
        source: tmp
```

{{< /codetabs >}}

If you rename the mount to `/cache/files/`, it will point to a new, empty `/cache/files/` directory.

To ensure continuity, you must explicitly define the `source_path` as the previous name of the mount, without leading
or trailing slashes:

{{< codetabs >}}

+++
title=Single-runtime image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: "nodejs@{{% latest nodejs %}}"
    mounts:
      '/cache/files/':
        source: tmp
        source_path: /my/cache
```

<--->

+++
title=Composable image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: "composable:{{% latest composable %}}"
    mounts:
      '/cache/files/':
        source: tmp
        source_path: /my/cache
```

{{< /codetabs >}}

The `/cache/files/` mount now points to the original `/my/cache/` directory, maintaining access to all your existing
files in that directory.

### Share a `storage` mount between several apps {#share-a-mount-between-several-apps}

By design, [`storage` mounts](#define-a-mount) are shared **between different instances of the same app**,
which enables [horizontal scaling](/manage-resources/_index.md).

In a [multi-application context](/create-apps/multi-app/_index.md),
you can even share a `storage` mount **between different applications** in the same project.

To do so, you need to define a `storage` mount in each of your app containers,
and point each of those mounts to the same shared external network directory.

Use the following configuration:

{{< codetabs >}}

+++
title=Single-runtime image
+++

  ```yaml {configFile="app"}
  applications:
    app1:
      type: "nodejs@{{% latest nodejs %}}"
      mounts:
        '{{< variable "MOUNT_PATH_1" >}}':
          source: storage
          source_path: {{< variable "SOURCE_PATH_LOCATION" >}}

    app2:
      type: "nodejs@{{% latest nodejs %}}"
      mounts:
        '{{< variable "MOUNT_PATH_2" >}}':
          source: storage
          service: app1
          source_path: {{< variable "SOURCE_PATH_LOCATION" >}}
  ```

<--->

+++
title=Composable image
+++

```yaml {configFile="app"}
applications:
  app1:
    type: "composable:{{% latest composable %}}"
    mounts:
      '{{< variable "MOUNT_PATH_1" >}}':
        source: storage
        source_path: {{< variable "SOURCE_PATH_LOCATION" >}}

  app2:
    type: "composable:{{% latest composable %}}"
    mounts:
      '{{< variable "MOUNT_PATH_2" >}}':
        source: storage
        service: app1
        source_path: {{< variable "SOURCE_PATH_LOCATION" >}}
```

{{< /codetabs >}}


- {{< variable "MOUNT_PATH_1" >}} and {{< variable "MOUNT_PATH_2" >}} are the paths to each mount **within their
  respective app container** (relative to the app's root).
- When configuring the first `storage` mount, you don't need to include the `service` key.
  The first mount implicitly points to an external network directory.
  The `service` key is required for subsequent mounts, to ensure they use the same external network directory as the
  first mount.
- The `source_path` allows you to point each mount to the same subdirectory **within the shared external network
  directory**.


#### Example

Suppose you have a `backend` app and a `frontend` app, and you want both apps to share data from the same mount.</br>
To achieve this, complete the following steps:

1. In your `backend` app configuration, define a `storage` mount:

{{< codetabs >}}

+++
title=Single-runtime image
+++

  ```yaml {configFile="app"}
  applications:
    backend:
    type: "nodejs@{{% latest nodejs %}}"
      mounts:
        var/uploads: #The path to your mount within the backend app container.
          source: storage
          source_path: backend/uploads #The path to the source of the mount within the external network directory.
  ```
<--->

+++
title=Composable image
+++

  ```yaml {configFile="app"}
  applications:
    backend:
      type: "composable:{{% latest composable %}}"
      mounts:
        var/uploads: #The path to your mount within the backend app container.
          source: storage
          source_path: backend/uploads #The path to the source of the mount within the external network directory.
  ```

{{< /codetabs >}}


  This creates a `storage` mount named `var/uploads` in the `backend` app container.
  The mount points to the `backend/uploads` directory within an external network directory.

2. In your `frontend` app configuration, define another `storage` mount:

{{< codetabs >}}

+++
title=Single-runtime image
+++

   ```yaml {configFile="app"}
   applications:
      backend:
        type: "nodejs@{{% latest nodejs %}}"
        mounts:
          var/uploads:
            source: storage
            source_path: backend/uploads

      frontend:
        type: "nodejs@{{% latest nodejs %}}"
        mounts:
          web/uploads: #The path to your mount within the frontend app container.
            source: storage
            service: backend #The name of the other app, so the mount can point to the same external network directory as that other app's mount.
            source_path: backend/uploads #The path to the source of the mount within the shared external network directory.
   ```

<--->

+++
title=Composable image
+++

   ```yaml {configFile="app"}
   applications:
     backend:
       type: "composable:{{% latest composable %}}"
       mounts:
         var/uploads:
           source: storage
           source_path: backend/uploads

     frontend:
       type: "composable:{{% latest composable %}}"
       mounts:
         web/uploads: #The path to your mount within the frontend app container.
           source: storage
           service: backend #The name of the other app, so the mount can point to the same external network directory as that other app's mount.
           source_path: backend/uploads #The path to the source of the mount within the shared external network directory.
   ```

{{< /codetabs >}}


   This creates another `storage` mount named `web/uploads` in the `frontend` app container.

   The `service` key allows you to specify that the `web/uploads` mount should use the same external network directory
   as the mount previously defined in the `backend` app container.

   The `source_path` key specifies which subdirectory within the external network directory both mounts should share (
   here, the `backend/uploads` directory).

Note that another way to share data between apps through a mount is by
explicitly [defining a Network Storage service](/add-services/network-storage.md).

### Composable image only: Local mounts

If you need a local mount (i.e. unique per container),
{{% vendor/name %}} allows you to mount a directory within the `/tmp` directory of your app.
However, the following limitations apply:

- Content from `tmp` mounts is removed when your app container is moved to another host during an infrastructure
  maintenance operation
- The `/tmp` directory has a [maximum allocation of 8 GB](/create-apps/troubleshoot-disks.md#no-space-left-on-device)

Therefore, `tmp` mounts are ideal to store non-critical data, such as your application cache which can be seamlessly
rebuilt,
but aren't suitable for storing files that are necessary for your app to run smoothly.

Note that {{% vendor/name %}} will provide new local mounts in the near future.

### Overlapping mounts

The locations of mounts as they are visible to application containers can overlap somewhat.
For example:

```yaml {configFile="app"}
applications:
  myapp:
    # ...
    mounts:
      'var/cache_a':
        source: storage
        source_path: cacheA
      'var/cache_b':
        source: tmp
        source_path: cacheB
      'var/cache_c':
        source: instance
        source_path: cacheC
```

In this case, it does not matter that each mount is of a different `source` type.
Each mount is restricted to a subfolder within `var`, and all is well.

The following, however, is not allowed and will result in a failure:

```yaml {configFile="app"}
applications:
  myapp:
    # ...
    mounts:
      'var/':
        source: storage
        source_path: cacheA
      'var/cache_b':
        source: tmp
        source_path: cacheB
      'var/cache_c':
        source: instance
        source_path: cacheC
```

The `storage` mount type specifically exists to share data between instances of the same application, whereas `tmp` and `instance` are meant to restrict data to build time and runtime of a single application instance, respectively.
These allowances are not compatible, and will result in an error if pushed.
