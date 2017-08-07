---
search:
    keywords: ['.platform.app.yaml', 'disk', 'mounts']
---

# Storage

The built file system image that results from your build process is mounted read-only.  That means it cannot be edited in production, even by accident.

Many applications still require the ability to write and store files, however.  For that, applications can specify one or more mount points, that is, directories that will be mounted from a writeable network file system cluster.  They may be mounted anywhere within the file system of your application.  If the specified directory already exists the contents of it will be masked by the writeable mount and inaccessible at runtime.

## Disk

The `disk` key is required, and defines the size of the persistent disk of the application (in MB).  Its minimum value is 256 MB and a validation error will occur if you try to set it lower.

## Mounts

The `mounts` key is an object whose keys are paths relative to the root of the application (that is, where the `.platform.app.yaml` file lives). It's in the form `volume_id[/subpath]`. At this time, the only legal `volume_id` is `shared:files`.

This section is optional; if your application does not need writeable local file storage simply omit the `mounts` section and set `disk` to a value to the minimum of 256.

Note that whether a mounted directory is web-accessible or not depends on the configuration of the `web.locations` block in `.platform.app.yaml`.  It may be accessible, or not, and have different rules for different file types as desired.

> **Warning**
> The `subpath` portion of the mount is the unique identifier of the files area. If changed, files at the old location will be *permanently lost*.  Do not change this value once your site has data unless you really want to lose all existing data.

## Multi-instance disk mounts

If you have multiple application instances defined (using both `web` and `workers`), each instance will have its own disk mounts.  That's the case even if they are named the same, and even if there is only a single top-level mounts directive.  In that case, every instance will have an identical configuration, but separate, independent file spaces.  Shared file storage between different application instances is not supported at this time.

## How do I setup both public and private file uploads?

The following example sets up two file mounts.  One is mounted at `/private` within the application container, the other at `/web/uploads`.  The two file mounts together have a limit of 1024 MB of storage.

```yaml
disk: 1024

mounts:
    '/private': 'shared:files/private'
    '/web/uploads': 'shared:files/uploads'
```

Then in the `web.locations` block, you'd specify that the `/web/uploads` path is accessible.  For example, this fragment would specify the `/web` path as the docroot but provide a more locked-down access to the `/web/uploads` path.

```yaml
web:
    locations:
        '/':
            # The public directory of the application relative to its root.
            root: 'web'
            # The front-controller script which determines where to send
            # non-static requests.
            passthru: '/app.php'
        # Allow uploaded files to be served, but do not run scripts.
        '/web/uploads':
            root: 'web/uploads'
            expires: 300s
            scripts: false
            allow: true
```

See the [web locations](/configuration/app/web.md) documentation for more details.
