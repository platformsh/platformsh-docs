---
title: Deploy Django on {{% vendor/name %}}
sidebarTitle: Django
sectionBefore: Python
layout: single
weight: -80
description: |
    Complete the last required steps to successfully deploy Django on {{% vendor/name %}}.
---

{{< note title="Note" theme="info" >}}

Before you start, check out the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project) and the main [Getting started guide](/get-started/here/_index.md).
They provide all of the core concepts and common commands you need to know before using the materials below.

{{< /note >}}

For Django to successfully deploy and operate, **after completing the [Getting started guide](/get-started/here/_index.md)**,
you still need to make a few changes to your {{% vendor/name %}} configuration.

{{% guides/requirements name="Django" %}}

## 1. Leverage environment variables

Your `settings.py` file may allow for environment variables to be set for common pieces of configuration.
In this case, add and commit a `.environment` file that includes those details.

```bash {location=".environment"}
export DJANGO_SETTINGS_MODULE=config.settings.production
export DJANGO_SECRET_KEY="$PLATFORM_PROJECT_ENTROPY"
export DJANGO_ALLOWED_HOSTS=".{{< vendor/urlraw "hostname" >}}"
```

{{< note theme="warning" title="Warning" >}}

Not all Django apps allow for configuration in this way.
See the following sections to see how other common settings should be set on {{% vendor/name %}}.

{{< /note >}}

## 2. Configure `ALLOWED_HOSTS`

By default, other than `localhost`, Django only allows hosts listed in `settings.ALLOWED_HOSTS` to be accessed. However, Django does not allow for wildcard hosts that span multiple levels by default. This becomes relevant in order to support our dynamic preview environments you will want to dynamically add to the list.

The simplest method is to add the following line to `.environment` :
```bash
export DJANGO_ALLOWED_HOSTS=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.primary == true) | .key' | sed 's:/*$::' | sed 's|https\?://||')
```
This will add the primary route of the current application to the `DJANGO_ALLOWED_HOSTS` environment variable. 

## 3. {{% vendor/name %}}-specific settings

Near the bottom of your `settings.py` file, define a block that:

- Detects when Django is running on an {{% vendor/name %}} environment
- Override previous settings

If your configuration is split into a `production.py` file for production settings, place it there instead.

```py {location="settings.py"}
# Production/{{% vendor/name %}} settings.
if (os.getenv('PLATFORM_APPLICATION_NAME') is not None):
    DEBUG = False

    # Static dir.
    if (os.getenv('PLATFORM_APP_DIR') is not None):
        STATIC_ROOT = os.path.join(os.getenv('PLATFORM_APP_DIR'), 'static')

    # Secret Key.
    if (os.getenv('PLATFORM_PROJECT_ENTROPY') is not None):
        SECRET_KEY = os.getenv('PLATFORM_PROJECT_ENTROPY')

    # Production database configuration.
    if (os.getenv('PLATFORM_ENVIRONMENT') is not None):
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': os.getenv('DATABASE_PATH'),
                'USER': os.getenv('DATABASE_USERNAME'),
                'PASSWORD': os.getenv('DATABASE_PASSWORD'),
                'HOST': os.getenv('DATABASE_HOST'),
                'PORT': os.getenv('DATABASE_PORT'),
            },
            'sqlite': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
            }
        }
```

This update includes a few important changes:

1. **Overwrites.** If the `PLATFORM_APPLICATION_NAME` {{% vendor/name %}} built-in variable is found (that is, Django is running on an {{% vendor/name %}} environment), override your previous settings.
No matter what environment type we run on {{% vendor/name %}}, this file uses production settings for {{% vendor/name %}} (i.e. `DEBUG = False`).
1. **Static.** `STATIC_ROOT`, and the `static` files path is updated relative to the application root on {{% vendor/name %}}.

1. **Secret key.** All {{% vendor/name %}} projects come with a unique hash environment variable `PLATFORM_PROJECT_ENTROPY` that can be used to update your `SECRET_KEY`.

1. **Databases.** When Django is running on an {{% vendor/name %}} enviroment _at runtime_, it has access to service containers like databases and caches.
Every service container you configure in `.upsun/config.yaml` has a unique relationship name (`applications:<APP_NAME>:relationships:<RELATIONSHIPNAME>`).
{{% vendor/name %}} automatically uses this relationship name to expose connection credentials through environment variables (for example, via `RELATIONSHIPNAME_HOST`).</br>
Update `settings.py` according to the example above (which configures a PostgreSQL service), where the relationship `database` results in environment variables that are leveraged to update the `DATABASES` setting for your application.</br>
You can use the exact same logic to configure `CACHES` from the `rediscache` relationship using the exposed `REDISCACHE_` environment variables to setup `django_redis.cache.RedisCache`.

## 4. Start the app

In your app configuration, locate the `web:commands:start` section and update it as follows:

```yaml {configFile="app"}
applications:
  myapp:
    ...
    web:
      commands:
        start: "gunicorn -b unix:$SOCKET config.wsgi"
      upstream:
        socket_family: unix
```

Note that if your Django instance requires a different web server,
{{% vendor/name %}} also supports [several other options](/languages/python/server.md).

## 5. Configure static assets

To access Django's static assets, you need to add a second location to the `web:locations` section of your app configuration.
Locate the `web:locations` section and add a location for `/static`:

```yaml {configFile="app"}
applications:
  myapp:
    ...
    web:
      locations:
        "/":
          "passthru": true
        "/static":
          "allow": true
          "expires": "1h"
          "root": "static"
```

## 6. Install dependencies and builds

Instruct {{% vendor/name %}} to install your Python and Node (if needed) dependencies.
Locate the `hooks:build` section and update it as follows:

```yaml {configFile="app"}
applications:
  myapp:
    ...
    build: |
      set -eux

      pip install --upgrade pip
      pip install -r requirements.txt
      npm install
      npm run build
```

Remove the `npm` steps if not required for your app's assets.
Note that if your project uses a different package manager,
{{% vendor/name %}} also supports [several other options](/languages/python/dependencies.md).

## 7. Configure the deploy phase

In your app configuration, locate the `deploy` section and update it as follows:

```yaml {configFile="app"}
applications:
  myapp:
    ...
    deploy: |
      set -eux

      python manage.py collectstatic --noinput
      python manage.py migrate
```

## 8. Allow write access where needed

Since Django can require a writable locations at runtime, you need to set up writable mounts.
To do so, locate the `mounts` section (currently commented), and update it as follows:

```yaml {configFile="app"}
applications:
  myapp:
    ...
    mounts:
      "/staticfiles":
        source: "local"
        source_path: "static_assets"
```

You can now commit all of the above changes and push to {{% vendor/name %}}.

```bash {location="Terminal"}
git add .
git commit -m "Add changes to complete my {{% vendor/name %}} configuration"
git push
```

## Further resources

### Documentation

- [Python documentation](/languages/python/)
- [Managing dependencies](/languages/python/dependencies)
- [Configuring web servers](/languages/python/server)

### Community content

- [Django topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=django)
- [Python topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=python)

### Blogs

- [_Up(sun) and running with Django_](https://upsun.com/blog/setting-up-django-on-upsun/)

<!-- ## Video -->
