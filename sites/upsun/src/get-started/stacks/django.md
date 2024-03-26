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

Now that you have completed the [Getting started guide](/get-started/here/_index.md), there are **a few remaining changes**
that may be needed in order to have a successful deployment of Django on Upsun. 
Alternatively, you can read the blog post [_Up(sun) and running with Django_](https://upsun.com/blog/setting-up-django-on-upsun/) which walks through the steps required to run Django on Upsun.

## 1. Configure with environment variables

Your `settings.py` file may allow for environment variables to be set for common pieces of configuration. 
In this case, add and commit a `.environment` file that includes those details. 

```shell {location=".environment"}
export DJANGO_SETTINGS_MODULE=config.settings.production
export DJANGO_SECRET_KEY="$PLATFORM_PROJECT_ENTROPY"
export DJANGO_ALLOWED_HOSTS=".{{< vendor/urlraw "hostname" >}}"
```

Not all Django apps will allow for configuration in this way.
See the following sections to see how other common settings should be set on Upsun.

## 2. Configure `ALLOWED_HOSTS`

If your `settings.py` does not allow you to use an environment variable (like `DJANGO_ALLOWED_HOSTS` above) to configure allowed hosts, update `settings.py` to include `{{< vendor/urlraw "hostname" >}}`:

```py {location="settings.py"}
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '.{{< vendor/urlraw "hostname" >}}',
]
```

Appending `.{{< vendor/urlraw "hostname" >}}` to `ALLOWED_HOSTS` will allow for all URLs generated for Upsun preview environments.

## 3. Upsun-specific settings

Near the bottom of your `settings.py` file, define a block that detects when Django is running on an Upsun environment that will override previous settings. 
If your configuration is split into a `production.py` file for production settings, place it there instead. 

```py {location="settings.py"}
# Production/Upsun settings.
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

1. **Overwrites.** If the `PLATFORM_APPLICATION_NAME` Upsun built-in variable is found (that is, Django is running on an Upsun environment), override your previous settings.
No matter what environment type we run on Upsun, this file uses production settings for Upsun (i.e. `DEBUG = False`).
1. **Static.** `STATIC_ROOT`, and the `static` files path is updated relative to the application root on Upsun.
1. **Secret key.** All Upsun projects come with a unique hash environment variable `PLATFORM_PROJECT_ENTROPY` that can be used to update your `SECRET_KEY`.
1. **Databases.** When Django is running on an Upsun enviroment _at runtime_, it will have access to service containers like databases and caches. 
Every service container you configure in `.upsun/config.yaml` will have a unique relationship name (`applications:<APP_NAME>:relationships:<RELATIONSHIPNAME>`), which Upsun will automatically use to expose connection credentials through environment variables (for example, via `RELATIONSHIPNAME_HOST`). 
Update `settings.py` according to the example above (which configures a PostgreSQL service), where the relationship `database` results in environment variables that are leveraged to update the `DATABASES` setting for your application.
You can use the exact same logic to configure `CACHES` from the `rediscache` relationship using the exposed `REDISCACHE_` environment variables to setup `django_redis.cache.RedisCache`. 

## 4. Starting the application

Find the `web:commands:start` section. 
Change the following line from:

```yaml {location=".upsun/config.yaml"}
applications:
    myapp:
        ...
        web:
            commands:
                start: "echo 'Put your web server command in here!..."
            upstream:
                socket_family: unix
```

to

```yaml {location=".upsun/config.yaml"}
applications:
    myapp:
        ...
        web:
            commands:
                start: "gunicorn -b unix:$SOCKET config.wsgi"
            upstream:
                socket_family: unix
```

If your Django instance requires a different Web server, we also support [several other options](/languages/python/server.md).

## 5. Configure static assets

In order to access Django's static assets we need to add a second location to the `web:locations` block. 
In the `.upsun/config.yaml` file, locate the `web:locations` section. 
Expand what is currently there to include a location for `/static`:

```yaml {location=".upsun/config.yaml"}
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

Next we need to instruct Upsun to install our Python and Node (if neeeded) dependencies. 
Find the `hooks:build` section and change the following lines from:

```yaml {location=".upsun/config.yaml"}
applications:
    myapp:
        ...
        build: |
            set -eux

            # Add build steps here.
            # echo 'I am a build step'
```

to:

```yaml {location=".upsun/config.yaml"}
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

Remove the `npm` steps if not required for your application's assets.
If your project uses a different package manager, we also support [several other options](/languages/python/dependencies.md).

## 7. Configure the deploy phase

Find the `deploy` section and change the following lines from:

```yaml {location=".upsun/config.yaml"}
applications:
    myapp:
        ...
        deploy: |
            set -eux

            # echo 'Put your deploy command here'
```

to:

```yaml {location=".upsun/config.yaml"}
applications:
    myapp:
        ...
        deploy: |
            set -eux

            python manage.py collectstatic --noinput
            python manage.py migrate
```

## 8. Allow write access where needed

Since Django can require a writable locations at runtime, we'll need to attach writable mounts. 
Locate the `mounts` section (currently commented), and change the following lines from:

```yaml {location=".upsun/config.yaml"}
applications:
    myapp:
        ...
        # mounts:
        #     "/.cache":
        #         source: "local"
        #         source_path: "cache"
```

to locations that require write access:

```yaml {location=".upsun/config.yaml"}
applications:
    myapp:
        ...
        mounts:
            "/staticfiles":
                source: "local"
                source_path: "static_assets"
```

You can now commit all of the above changes and push to Upsun.

```bash
git add .
git commit -m "Add changes to complete my Upsun configuration"
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
