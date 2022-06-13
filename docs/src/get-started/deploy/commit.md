---
title: Git commit
weight: -9
description: Start getting your project into Platform.sh.
---

Once you have your project initialized, it's time to add the basics to get it deployed.

## Add app configuration

Add basic app configuration:

```bash
touch .platform.app.yaml
```

```yaml {location=".platform.app.yaml"}
name: app

```

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

<div class="build-needed">

## Add a build book

Add build hook

</div>

## Create route

Edit the route file:

```yaml {location=".platform/routes.yaml"}
"https://{default}/":
    type: upstream
    upstream: "app:http"
```

If named app otherwise, change the first part of the `upstream`.

Commit and push.

<div class="services-not-needed">

You can now see your built app at the returned URL.

</div>

<div class="services-needed">

Your app is built and served at the returned URL, but it doesn't yet have all the services it needs to work.

</div>
