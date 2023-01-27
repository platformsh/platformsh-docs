---
title: "Customize Django for Platform.sh"
sidebarTitle: "Customize"
weight: -90
# toc: false
description: |
    Add some helpful dependencies, and modify your Django site to read from a Platform.sh environment.
---

Now that your code contains all of the configuration to deploy on Platform.sh,
it's time to make your Django site itself ready to run on a Platform.sh environment.
There are a number of additional steps that are either required or recommended, depending on how well you want to optimize your site.

## (Optional) Config Reader

{{% guides/config-reader-info lang="python" %}}

Any of the examples below that retrieve and decode environment variables directly can be replaced with this library.

## `settings.py`

`settings.py` is the main Django configuration file.
It contains the service credentials, and various other settings.

In the Django template, the [`settings.py`](https://github.com/platformsh-templates/django4/blob/master/myapp/settings.py) file sets up configuration for application settings and credentials for connecting to a PostgreSQL database. 
Through the use of these environment variables, Django applications remain environment-independent when branching.

The file itself is a bit long, but a few important snippets are included below to highlight where this configuration should be modified in your code. 
Consult the [`settings.py`](https://github.com/platformsh-templates/django4/blob/master/myapp/settings.py) file in the template for more information.

### `ALLOWED_HOSTS`

```py {location="settings.py"}
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '.platformsh.site',
]
```

[`ALLOWED_HOSTS`](https://docs.djangoproject.com/en/4.1/ref/settings/#allowed-hosts) defines the host names that your Django site can serve, and it is here where you would define not only `locahost`, but also the primary domain of the application.

On Platform.sh, every branch or pull request you create can become an active environment - a staging server where you can test revisions. 
When the environment is created a URL will be generated with the format `ENVIRONMENT_NAME-ENVIRONMENT_HASH.REGION.platform.site`, and you will need to add this suffix to `ALLOWED_HOSTS` to accomadate this pattern.

### Decoding variables

```py {location="settings.py"}
#################################################################################
# Platform.sh-specific configuration

# Helper function for decoding base64-encoded JSON variables.
def decode(variable):
    """Decodes a Platform.sh environment variable.
    Args:
        variable (string):
            Base64-encoded JSON (the content of an environment variable).
    Returns:
        An dict (if representing a JSON object), or a scalar type.
    Raises:
        JSON decoding error.
    """
    try:
        if sys.version_info[1] > 5:
            return json.loads(base64.b64decode(variable))
        else:
            return json.loads(base64.b64decode(variable).decode('utf-8'))
    except json.decoder.JSONDecodeError:
        print('Error decoding JSON, code %d', json.decoder.JSONDecodeError)
```

Environment variables on Platform.sh, which you will use to retrieve credentials to connect to services within an environment, are often obscured. 
`PLATFORM_RELATIONSHIPS` for example, which contains those service examples, is a base64-encoded JSON object.

Within `settings.py`, the Django template starts a block of Platform.sh-specific configuration meant to override options configured above it. 
Starting that section is the helper function `decode`, which will be helpful in subsequent settings.

{{< note >}}
Decoding these types of variables comes built into the [Platform.sh Config Reader](#optional-config-reader).
{{< /note >}}

### Platform.sh overrides 

```py {location="settings.py"}
# This variable should always match the primary database relationship name,
#   configured in .platform.app.yaml.
PLATFORMSH_DB_RELATIONSHIP="database"

# Import some Platform.sh settings from the environment.
if (os.getenv('PLATFORM_APPLICATION_NAME') is not None):
    DEBUG = False
    if (os.getenv('PLATFORM_APP_DIR') is not None):
        STATIC_ROOT = os.path.join(os.getenv('PLATFORM_APP_DIR'), 'static')
    if (os.getenv('PLATFORM_PROJECT_ENTROPY') is not None):
        SECRET_KEY = os.getenv('PLATFORM_PROJECT_ENTROPY')
    # Database service configuration, post-build only.
    if (os.getenv('PLATFORM_ENVIRONMENT') is not None):
        platformRelationships = decode(os.getenv('PLATFORM_RELATIONSHIPS'))
        db_settings = platformRelationships[PLATFORMSH_DB_RELATIONSHIP][0]
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': db_settings['path'],
                'USER': db_settings['username'],
                'PASSWORD': db_settings['password'],
                'HOST': db_settings['host'],
                'PORT': db_settings['port'],
            },
            'sqlite': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
            }
        }
```

The large block above leverages `decode` to override settings that may have been set previously in `settings.py` when in the context of a Platform.sh environment. 
Remember, when configuring the application itself in `.platform.app.yaml`, no matter which package manager chosen, access was defined to one service - a PostgreSQL database.

- `PLATFORMSH_DB_RELATIONSHIP="database"` is included to start the block, which matches the name of the relationship the Django application can access PostgreSQL from. 

  ```yaml {location=".platform.app.yaml"}
  relationships:
      database: "db:postgresql"
  ```
- The next block ensures that the settings provided are only applied when run on Platform.sh - using the built-in variable `PLATFORM_APPLICATION_NAME` as a catch.
  In this scenario, `DEBUG = False`, because every environment is treated as identical to production.
  ```py {location="settings.py"}
  if (os.getenv('PLATFORM_APPLICATION_NAME') is not None):
      DEBUG = False
  ```
- The Platform.sh built in variable `PLATFORM_APP_DIR` is used to redefine [`STATIC_ROOT`](https://docs.djangoproject.com/en/4.1/ref/settings/#static-root).
  ```py {location="settings.py"}
  if (os.getenv('PLATFORM_APP_DIR') is not None):
      STATIC_ROOT = os.path.join(os.getenv('PLATFORM_APP_DIR'), 'static')
  ```
- Platform.sh provides a hash variable `PLATFORM_PROJECT_ENTROPY`, unique to the project, which is reused to define Django's [`SECRET_KEY`]()
  ```py {location="settings.py"}
  if (os.getenv('PLATFORM_PROJECT_ENTROPY') is not None):
      SECRET_KEY = os.getenv('PLATFORM_PROJECT_ENTROPY')
  ```
- During the build phase, servies on Platform.sh (like PostgreSQL) are not yet available.
  This is an important restriction, as it enables environment-independent builds that makes the Platform.sh inheritance model possible. 
  Because of this, when defining `DATABASES` to connect to a service, it's necessary to include a catch that confirms settings are only overwritten during the deploy phase, which can be determined using the `PLATFORM_ENVIRONMENT` variable only available at deploy time. 
  ```py {location="settings.py"}
  if (os.getenv('PLATFORM_ENVIRONMENT') is not None):
      platformRelationships = decode(os.getenv('PLATFORM_RELATIONSHIPS'))
      db_settings = platformRelationships[PLATFORMSH_DB_RELATIONSHIP][0]
  ```
  The credential data is decoded using `decode`, and then settings for the PostgreSQL service are retrieved using the `PLATFORMSH_DB_RELATIONSHIP` relationship name defined previously.
- Finally, `DATABASES` itself is redefined using the credentials now available in `db_settings`
  ```py {location="settings.py"}
  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.postgresql',
          'NAME': db_settings['path'],
          'USER': db_settings['username'],
          'PASSWORD': db_settings['password'],
          'HOST': db_settings['host'],
          'PORT': db_settings['port'],
      },
      'sqlite': {
          'ENGINE': 'django.db.backends.sqlite3',
          'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
      }
  }
  ```

## `.environment` and Poetry

Platform.sh runs `source .environment` in the [app root](../../../create-apps/app-reference.md#root-directory)
when a project starts, before cron commands are run, and when you log into an environment over SSH.
That gives you a place to do extra environment variable setup before the app runs,
including modifying the system `$PATH` and other shell level customizations.

On its own, simple Django projects like the one shown here using Pip or Pipenv do not need to commit a `.environment` file to run. 
Poetry, on the other hand, requires an additional piece of configuration to ensure that it can be called during the deploy phase and SSH sessions.

```text {location=".environment"}
# Updates PATH when Poetry is used, making it available during deploys and SSH.
if [ -n "$POETRY_VERSION" ]; then
    export PATH="/app/.local/bin:$PATH"
fi
```

Feel free to include any other environment variables your application depends on in this file that you don't them mind being committed.

{{< guide-buttons next="Deploy Django" >}}
