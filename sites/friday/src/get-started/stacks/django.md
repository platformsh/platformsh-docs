---
title: Deploying Django on Upsun
sidebarTitle: Django
sectionBefore: Python
layout: single
weight: -80
description: |
    Welcome to the Upsun documentation specific to the Django framework on Upsun.
    It includes common reference materials useful for deploying Django, but also external community and blog resources that cover more advanced topics relevant for the framework.
---

{{< note theme="info" >}}

Before you proceed, be sure to checkout the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project) and the main [Getting started guide](/get-started/here/_index.md). These two resources provide all of the core concepts and common commands you'll need to know before using the materials below.

{{< /note >}}

Now that you have completed the [Getting started guide](/get-started/here/_index.md), there are **six remaining changes**
required in order to have a successful deployment of Django on Upsun. Alternatively, you can read the blog post
[_Up(sun) and running with Django_](https://upsun.com/blog/setting-up-django-on-upsun/) which walks through the steps
required to run Django on Upsun.

## `.environment`
Django requires a few environment variables that have not been set. Open the `.environment` file and add the following:
```shell
export DJANGO_SETTINGS_MODULE=config.settings.production
export DJANGO_SECRET_KEY="$PLATFORM_PROJECT_ENTROPY"
export DJANGO_ALLOWED_HOSTS=".platformsh.site"
```
This section appends Django’s allowed hosts to include all URLs generated for Upsun preview environments, to update
Django’s secret key to match the unique project hash, and to leverage production settings (in this case) across all
Upsun environments.

## `.upsun/config.yaml`
Similarly, there are several changes we need to make to the Upsun configuration file so that Upsun knows how your Django
application should behave. Open the `.upsun/config.yaml` file and make the changes below.
### Start command
Find the `web:commands:start` section. Change the following line from:
```yaml
start: "echo 'Put your web server command in here! You need to listen to \"$UNIX\" unix socket. Read more about it here: https://docs.upsun.com/create-apps/app-reference.html#web-commands'; sleep 60"
```
to
```yaml
start: "gunicorn -b unix:$SOCKET config.wsgi"
```
If your Django instance requires a different Web server, we also support [several other options](/languages/python/server.md).

### Static assets
In order to access Django's static assets we need to add a second location to the `web:locations` block. In the
`.upsun/config.yaml` file, locate the `web:locations` section. Expand what is currently there to include a location for
`/static`:

```yaml
            locations:
              "/":
                "passthru": true
              "/static":
                "allow": true
                "expires": "1h"
                "root": "static"
```


### Installation during the Build Hook
Next we need to instruct Upsun to install our python and node dependencies. Scroll down a bit farther and find the
`hooks:build` section. Change the following lines from:
```yaml
    build: |
      set -eux

      # Add build steps here.
      # echo 'I am a build step'
```
to:
```yaml
    build: |
      set -eux
      pip install --upgrade pip
      pip install -r requirements.txt
      npm install
      npm run build
```
### Deploy Hook
Just below that, find the `deploy` section and change the following lines from:
```yaml
      deploy: |
        set -eux
        # echo 'Put your deploy command here'
```
to:
```yaml
            deploy: |
              set -eux
              python manage.py collectstatic --noinput
              python manage.py migrate
```

### Mounts
Since Django requires a writable location, we'll need to attach writable mount. Locate the `mounts` section (currently
commented). Change the following lines from:

```yaml
    # mounts:
    #   "/.cache": # Represents the path in the app.
    #     source: "local" # "local" sources are unique to the app, while "service" sources can be shared among apps.
    #     source_path: "cache" # The subdirectory within the mounted disk (the source) where the mount should point.
```
to

```yaml
        mounts:
          "/staticfiles":
            "source": "local"
            "source_path": "static_assets"
```
## Commit and push
You can now commit the changes to `.environment` and `.upsun/config.yaml` and push to Upsun.
## Further Documentation

- [Python documentation](/languages/python/)
- [Managing dependencies](/languages/python/dependencies)
- [Configuring web servers](/languages/python/server)

## Community content

- [Django topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=django)
- [Python topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=python)

<!-- ## Blogs -->



<!-- ## Video -->
