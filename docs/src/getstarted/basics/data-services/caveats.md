---
title: "Some caveats on data"
sidebarTitle: "Caveats"
weight: 4
description: |
  Learn a few key caveats to keep in mind when working with data on Platform.sh.
---

## Where'd my files go?

On the `new-feature` branch, remove `data` from your `.gitignore` file.
This change will allow `data` and its contents to be committed.

Add another file to `data`:

```bash
echo "Another committed file." > data/another_file.txt
```

Then push that change to the environment:

```bash
$ git add .
$ git commit -m "Commit a mount."
$ git push platform new-feature
```

At the end of the build phase, you will notice this message:

```bash
W: The mount '/data' has a path that overlaps with a non-empty folder.
The content of the non-empty folder either comes from:
- your git repository (you may have accidentally committed files).
- or from the build hook.
Please be aware that this content will not be accessible at runtime.
```

Because a mount was defined for `data` in `.platform.app.yaml`, `data` retains write access at runtime.
But, you have just committed a file whose path matches that definition.

So what happens?

SSH into the container and you'll see that while inherited data is still present in the mount, `data/another_file.txt` is not. 
When `data` was mounted during the **deploy phase**, it took the place of `data` in the repository making anything committed there inaccessible. 

This point is brought up because some frameworks require two things simultaneously:

1. A directory must retain write access at runtime.
1. Files within that directory are committed. 

This caveat can confusing as to where committed files have gone. 
One way to get around this is to anticipate it, and move committed data around accordingly.

Here is an example `hooks` section to illustrate:

```yaml
hooks:
    build: |
        # Place committed files in `data` into a temp directory.
        cp -R data data-tmp
    deploy: |
        # Copy committed files back into the mount at `data`.
        cp -R data-tmp/* data/
```

## When are services available?

Most of the "rules" of Platform.sh exist to keep build images reusable, and **environment-independent** at all times. 
This is why the file system is read-only after the build phase, and it is also why the behavior described above for mounts occurs during the deploy phase. 

It is also why _service containers (i.e. databases) are **not available** during the build phase_.

The builds you define exist in isolation, producing build images based on the state of _only_ your code. 
Nothing about this process involves data, and it's because of this that data can be inherited at all. 

Same goes for the environment variable `PLATFORM_RELATIONSHIPS`. 
If you were to include the line `echo $PLATFORM_RELATIONSHIPS` somewhere in your build hook (`hooks.build`), there will be no output. 
Only if you do the same later in the pipeline, say during the deploy hook (`hooks.deploy`) will you see a value printed in the logs.

While not specifically related to data, the same behavior will be the case for `echo $PLATFORM_ROUTES` as well. 
You will only be able to use routes _after_ the build phase has completed. 
Like data, the _location_ of a container - its URL - is not relevant in the making of an environment-independent build image.

Feel free to try these commands for yourself in `.platform.app.yaml`. 
There will be certain applications, especially in Node.js, that expect either service credentials or routes during their build tasks.
When they do, you will run into this caveat, and it will be necessary to take measures to get around it. 

{{< guide-buttons next="Wrapping up" >}}
