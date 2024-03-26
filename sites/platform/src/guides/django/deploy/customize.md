---
title: "Customize Django for {{% vendor/name %}}"
sidebarTitle: "Customize"
weight: -90
description: |
    Add some helpful dependencies, and modify your Django site to read from a {{% vendor/name %}} environment.
---

Now that your code contains all of the configuration to deploy on {{% vendor/name %}},
it's time to make your Django site itself ready to run on a {{% vendor/name %}} environment.
A number of additional steps are either required or recommended, depending on how much you want to optimize your site.

## Optional: Set up the Config Reader

{{% guides/config-reader-info lang="python" %}}

In all of the following examples,
you can replace retrieving and decoding environment variables with this library.

## Django configuration

Most configuration for Django, such as service credentials, is done in a `settings.py` file.
You can see an example of a [complete settings file in the Django template](https://github.com/platformsh-templates/django4/blob/master/myapp/settings.py).

The example file configures app settings and credentials for connecting to a PostgreSQL database.
The environment variables defined there enable Django apps to remain independent of their environment.

The example file itself contains a lot of settings,
the most important of which are highlighted here to show where you could modify your code.

### Allowed hosts

[`ALLOWED_HOSTS`](https://docs.djangoproject.com/en/4.1/ref/settings/#allowed-hosts) defines the host names that your Django site can serve.
It's where you define `localhost` and also your site's primary domain.

On {{% vendor/name %}}, every branch or pull request you create can become an active environment:
a deployed site where you can test changes.
The environment is given a URL that ends with `.platform.site`.
To allow your site to serve these environment, add this suffix to `ALLOWED_HOSTS`.

```py {location="settings.py"}
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '.platformsh.site',
]
```

### Decoding variables

{{% vendor/name %}} environment variables, which contain information on deployed environments, are often obscured.
For example, `PLATFORM_RELATIONSHIPS`, which contains credentials to connect to services, is a base64-encoded JSON object.

The example Django configuration file has a `decode` helper function to help with these variables.
Alternatively, you can use the [{{% vendor/name %}} Config Reader](#optional-set-up-the-config-reader).

```py {location="settings.py"}
#################################################################################
# {{% vendor/name %}}-specific configuration

# Helper function for decoding base64-encoded JSON variables.
def decode(variable):
    """Decodes a {{% vendor/name %}} environment variable.
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

### Handling overrides

Once you have a [way to decode variables](#decoding-variables),
you can use them to override settings based on the environment.
The following example uses the `decode` function to set access to the one service defined in this example,
a PostgreSQL database.

```py {location="settings.py"}
# This variable must always match the primary database relationship name,
#   configured in {{< vendor/configfile "app" >}}.
PLATFORMSH_DB_RELATIONSHIP="database"

# Import some {{% vendor/name %}} settings from the environment.
# The following block is only applied within {{% vendor/name %}} environments
# That is, only when this {{% vendor/name %}} variable is defined
if (os.getenv('PLATFORM_APPLICATION_NAME') is not None):
    DEBUG = False

    # Redefine the static root based on the {{% vendor/name %}} directory
    # See https://docs.djangoproject.com/en/4.1/ref/settings/#static-root
    if (os.getenv('PLATFORM_APP_DIR') is not None):
        STATIC_ROOT = os.path.join(os.getenv('PLATFORM_APP_DIR'), 'static')

    # PLATFORM_PROJECT_ENTROPY is unique to your project
    # Use it to define define Django's SECRET_KEY
    # See https://docs.djangoproject.com/en/4.1/ref/settings/#secret-key
    if (os.getenv('PLATFORM_PROJECT_ENTROPY') is not None):
        SECRET_KEY = os.getenv('PLATFORM_PROJECT_ENTROPY')

    # Database service configuration, post-build only
    # As services aren't available during the build
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

As noted in comments in the example, services on {{% vendor/name %}} (like PostgreSQL) aren't yet available during the build.
This it enables the environment-independent builds that make the {{% vendor/name %}} inheritance model possible.

For this reason, when defining a service connection, you need to overwrite the settings during the deploy phase.
You can determine the deploy phase using the `PLATFORM_ENVIRONMENT` variable, which is only available at deploy time.

## `.environment` and Poetry

`source .environment` is run in the [app root](/create-apps/app-reference/single-runtime-image.md#root-directory)
when a project starts, before cron commands are run, and when you log into an environment over SSH.
So you can use the `.environment` file to make further changes to environment variables before the app runs,
including modifying the system `$PATH` and other shell level customizations.

Django projects like this example using Pip or Pipenv don't need a `.environment` file to run.
Using Poetry requires additional configuration to ensure that Poetry can be called during the deploy phase and SSH sessions.

```text {location=".environment"}
# Updates PATH when Poetry is used, making it available during deploys and SSH.
if [ -n "$POETRY_VERSION" ]; then
    export PATH="/app/.local/bin:$PATH"
fi
```

If you have other environment variables your app depends on that aren't sensitive and so can be committed to Git,
you can include them in the `.environment` file

{{< guide-buttons previous="Back" next="Deploy Django" >}}
