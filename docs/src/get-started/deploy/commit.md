---
title: Git commit
weight: -9
description: Start getting your project into Platform.sh.
---

Once you have your project initialized, it's time to add the basics to get it deployed.

## Add app configuration

Create a file to hold your app configuration:

```bash
touch .platform.app.yaml
```

Add basic properties for your app, such as its name and language:

{{% get-started/basic-app %}}

{{% get-started/build-hook %}}

Add blank routes:

```bash
mkdir .platform
touch .platform/routes.yaml
```

Commit your changes:

```bash
git commit -m "Add Platform files"
```

Push your changes:

```bash
platform push
```

Or `git push`.

Nothing exposed.

## Create route

Edit the route file:

```yaml {location=".platform/routes.yaml"}
"https://{default}/":
    type: upstream
    upstream: "app:http"
```

If named app otherwise, change the first part of the `upstream`.

Commit and push.

{{< get-started/service-needed >}}
