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

There are a few remaining steps required in order to have a successfully deploy Django on Upsun.

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
`@todo do we describe what this does or do we expect them to know?`

`@todo add the locations:/static piece`

### Installing during the Build Hook
Scroll down a bit farther and find the `hooks:build` section. Change the following lines from:
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

## Documentation

- [Python documentation](/languages/python/)
- [Managing dependencies](/languages/python/dependencies)
- [Configuring web servers](/languages/python/server)

## Community content

- [Django topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=django)
- [Python topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=python)

## Blogs

- [Up(sun) and running with Django](https://upsun.com/blog/setting-up-django-on-upsun/)

<!-- ## Video -->
