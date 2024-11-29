---
title: "Troubleshoot mounts"
---

For more general information, see how to [troubleshoot development](/development/troubleshoot).

## Overlapping folders

If you have a mount with the same name as a directory you've committed to Git or you create such a directory during the build,
you get a message like the following:

```bash
W: The mount '/example' has a path that overlaps with a non-empty folder.
The content of the non-empty folder either comes from:
- your git repository (you may have accidentally committed files).
- or from the build hook.
Please be aware that this content isn't accessible at runtime.
```

This shows that the files in Git or from your build aren't available after the build.
The only files that are available are those in your mount.

To make the files available in the mount, move them away and then copy them into the mount:

1. In the `build` hook, use `mv` to move the files to another location.

   ```bash
   mv example tmp/example
   ```

2. In the `deploy` hook, use `cp` to copy the files into the mount.

   ```bash
   cp -r tmp/example example
   ```

To see the files without copying them, temporarily remove the mount from your app configuration.
Then SSH into your app and view the files.
You can then put the mount back in place.

## Mounted files not publicly accessible

If you've set up mounts to handle files like user uploads, you want to make sure the files are accessible.
Do so by managing their [location](/create-apps/app-reference/single-runtime-image.md#locations).

This example defines two mounts, one named `private` and one `upload`:

```yaml {configFile="app"}
applications:
  myapp:
    mounts:
      'private':
        source: storage
        source_path: private
      'uploads':
        source: storage
        source_path: uploads
```

With only this definition, their behavior is the same.
To make `uploads` accessible, define a location with different rules as in the following example:

```yaml {configFile="app"}
applications:
  myapp:
    web:
      locations:
        '/':
          # Handle dynamic requests
          root: 'public'
          passthru: '/app.php'
        # Allow uploaded files to be served, but don't run scripts.
        '/uploads':
          root: 'uploads'
          expires: 300s
          scripts: false
          allow: true
```
## Mounts starting with a dot ignored

{{% vendor/name %}} ignores YAML keys that start with a dot.
This causes a mount like `.myhiddenfolder` to be ignored.
To mount a directory starting with a dot, put a `/` at the start of its definition:

```yaml {configFile="app"}
applications:
  myapp:
    web:
      mounts:
        '/.myhiddenfolder':
          source: storage
          source_path: 'myhiddenfolder'
```
## Disk space issues

If you are worried about how much disk your mounts are using, check the size with the following command:

<!-- @todo: does the previous command still work for some per-directory breakdown? -->
```bash
{{% vendor/cli %}} resources:get
```
