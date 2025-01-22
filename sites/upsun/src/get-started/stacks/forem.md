---
title: Deploy Forem on {{% vendor/name %}}
sidebarTitle: Forem
sectionBefore: Ruby
layout: single
weight: -70
description: |
    Complete the last required steps to successfully deploy Forem on {{% vendor/name %}}.
---

{{< note title="Note" theme="info" >}}

Before you start, check out the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project)
and the main [Getting started guide](/get-started/here/_index.md).
They provide all the core concepts and common commands you need to know before using the following materials.

{{< /note >}}

{{% guides/requirements name="Forem" %}}

## Assumptions
* You have cloned the [Forem repository](https://github.com/forem/forem) during the Get Started guide
* You created a new Upsun project and associated it with your clone of the Forem repository during the Getting Started guide
* You named your application `myapp` during the Getting Started guide

For Forem to successfully deploy and operate, **after completing the [Getting started guide](/get-started/here/_index.md)**,
you still need to make a few changes to your {{% vendor/name %}} configuration.

## 1. Ruby version
At the time of this writing, Forem pinned the Ruby version to 3.3.0. However,
[new ruby images in Upsun are released on a regular basis to apply security patches](https://docs.upsun.com/languages/ruby.html#other-tips).
To avoid issues when such updates are performed, update the `.ruby-version` file in the root of the repository to use
ruby `~>3.3`. Please note that if/when you update your clone of Forem from the upstream, if they have updated the
`.ruby-version file`, you will need to resolve the merge conflict.

## 2. App Container Resources
[Ruby images by default are assigned](https://docs.upsun.com/manage-resources/adjust-resources.html#default-container-profiles)
a `container_profile` of `HIGH_CPU`; new projects are assigned a
[resource size of 0.5 by default](https://docs.upsun.com/manage-resources/resource-init.html#default-resources) which
gives us a mere 224 MB of memory for our Forem app. This is not nearly enough for Forem to start up and function
correctly. For now, adjust the container profile to `BALANCED` to give
[Forem 1088 MB of memory while keeping the 0.5CPU](https://docs.upsun.com/manage-resources/adjust-resources.html#advanced-container-profiles).
In the ` .upsun/config.yaml` file scroll down to the key `container_profile:` key which will be commented out. Remove
the comment indicator (`#`) and update the key to `container_profile: BALANCED`.

```yaml
applications:
  myapp:
    source:
      root: "/"
    type: "ruby:3.3"
    container_profile: BALANCED
```
{{< note theme="warning" title="YAML indentations" >}}
When uncommenting a section, make sure you remove both the comment marker `#` as well as the extra space. If you don't
remove the extra space, you will end up with an `Invalid block mapping key indent` error when the configuration file is
validated.
{{</ note >}}

## 3. Writable locations
By default, the file system in app containers in Upsun is read-only, but Forem requires the ability to write to a
collection of known locations. To address this, you will need to add a series of
[writable mounts](https://docs.upsun.com/create-apps/app-reference/single-runtime-image.html#mounts) into the
application container. In the `.upsun/config.yaml` file scroll down to the `mounts:` key (currently commented out),
uncomment it, and add the following mounts:

```yaml
applications:
  myapp:
    source:
      root: "/"
    <snip>
    mounts:
      /tmp:
        source: tmp
        source_path: tmp
      /public/uploads:
        source: storage
        source_path: uploads
      /public/images:
        source: storage
        source_path: images
      /public/podcasts:
        source: storage
        source_path: podcasts
      /public/packs:
        source: storage
        source_path: packs
```

## 4. Serving Forem
Next you need to instruct Upsun on how you want to serve the Forem application.
[Forem uses Puma as the web server](https://developers.forem.com/technical-overview/stack#-key-app-techservices), so
inside of `.upsun/config.yaml` scroll down to the sub key `web:commands:start`. Replace the current contents of
`start:` with:

```yaml
applications:
  myapp:
    source:
      root: "/"
    <snip>
    web:
      commands:
        start: "bundle exec puma -e production"
```

We don't need to alter the `upstream` or `upstream:socket_family` keys
[from their defaults](https://docs.upsun.com/create-apps/app-reference/single-runtime-image.html#upstream), so scroll
down and either remove those keys or comment them out.

Next, update the [`locations`](https://docs.upsun.com/create-apps/app-reference/single-runtime-image.html#locations)
key (also a sub-key of `web`) to the correct `root`. Since you just added several mounts that will contain uploaded
files you'll want to be able to access later, go ahead and add a couple of extra properties to this location: `allow`
(to serve files that don't match a specific rule), and `expires` (how long to cache static assets). Update
`locations` to:

```yaml
applications:
  myapp:
    source:
      root: "/"
    <snip>
    web:
      commands:
      <snip>
      locations:
        "/":
          root: public
          passthru: true
          allow: true
          expires: 5m
```
{{< note theme="info" title="Serving Assets" >}}
If you know exactly which assets you want to serve, you can change `allow` to `false` and then add matching rules for
the assets you want to serve. See [https://docs.upsun.com/create-apps/app-reference/single-runtime-image.html\#rules](https://docs.upsun.com/create-apps/app-reference/single-runtime-image.html#rules)
{{</ note >}}

## 5. Building the application

You're now ready to define how you want the application container to be built out. The build hook will require several
steps. Still in the `.upsun/config.yaml` file, scroll down to the key `hooks:build` and update it to the following:

```yaml
applications:
  myapp:
    source:
      root: "/"
    <snip>
    hooks:
      build: |
        set -eux
        n auto && hash -r
        export BUNDLER_VERSION="$(grep -A 1 "BUNDLED WITH" Gemfile.lock | tail -n 1)"
        gem install --no-document bundler -v $BUNDLER_VERSION
        [ -d "$PLATFORM_CACHE_DIR/bundle" ] && \
          rsync -az --delete "$PLATFORM_CACHE_DIR/bundle/" vendor/bundle/ || \
          mkdir -p "$PLATFORM_CACHE_DIR/bundle"
        bundle lock --add-platform x86_64-linux
        bundle install --jobs=4
        rsync -az --delete vendor/bundle/ "$PLATFORM_CACHE_DIR/bundle/"
        yarn add ahoy.js
        mkdir -p public/assets
        bundle exec rails assets:precompile
```

{{< note theme="info" title="Bash script" >}}
You can also move the entirety of the build hook into a bash script if you prefer. However, make sure you pass the
script file to `bash`, and not try to execute directly (ie `bash build.sh` vs `./build.sh` )
{{</ note >}}

See "Build steps explained" for a deeper understanding of what each command is doing.

## 6. Deploy
Next you will need to define the steps required during the deployment of the application. Scroll down until you find the
`deploy:` key. Remove the commented line, and replace it with:

```yaml
applications:
  myapp:
    source:
      root: "/"
    <snip>
    hooks:
      <snip>
      deploy: |
        set -eux
        if [ ! -d 'tmp/pids' ]; then
          mkdir tmp/pids
        fi
        #bundle exec rake db:migrate
```
{{< note theme="info" title="rake db:migrate" >}}
Normally during the deploy stage, you'll want to apply any database changes that need to happen. However, you probably
noticed that this is commented out. As of right now you haven't set up your database, so if you were to commit and push
this code to Upsun, the migrations would fail. You will uncomment this command in a later step.
{{</ note >}}

## 7. Workers
Finally, you need to define your worker. Scroll up from the `deploy`: key. Right before you get back to the `locations`
key, you should see a commented key for `workers`. Uncomment it, and update it to:

```yaml
applications:
  myapp:
    source:
      root: "/"
    <snip>
    workers:
    sidekiq:
      commands:
        start: bundle exec sidekiq -timeout 25
```

## 8. Leverage environment variables
One of the files generated during the `upsun project:init` step of the Getting Started guide was `.environment`. You
will need to add several of the items as defined in [.env\_sample](https://github.com/forem/forem/blob/main/.env_sample)
into the `.environment` file. Open the `.environment` file and scroll down to the space between the database-related
environment variables and the redis-related variables.

`upsun project:init` generated the bulk of what we need for the database, minus two. Just after the line for
`export DATABASE_URL`, add the following:

```bash
export DATABASE_NAME="${DB_PATH}"
export DATABASE_POOL_SIZE=5
```

Move to just below the redis-related values and add:

```bash
export REDIS_URL="${CACHE_URL}"
```
In both cases, you're just remapping existing values to environment variable names that Forem is expecting, with
`DATABASE_POOL_SIZE` coming straight from the `.env_sample` file.

For the remaining additions, feel free to add them at any location in the file. As this file will be committed to your
repository, for any that contain values that you are not comfortable storing in the repository (e.g. `DEFAULT_EMAIL`),
you can instead create them as
[project variables](https://docs.upsun.com/development/variables/set-variables.html#create-project-variables), either in
the CLI or in the [Upsun console](https://console.upsun.com/).

You need to define the domain where your instance of Forem is running via the `APP_DOMAIN` environment variable. When
you create a preview environment, not only will Upsun clone the data from your production environment, it will also
generate an ephemeral URL for you to use. In order for Forem to operate in this preview environment, the value in
`APP_DOMAIN` will need to point to this new domain. Upsun provides a
[series of environment variables](https://docs.upsun.com/development/variables/use-variables.html#use-provided-variables)
to inform your app about its runtime configuration, including the new domain(s). In your `.environment` file, add the
following:

```bash
PRIMARY_URL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.primary == true) | .key')
export APP_DOMAIN=$(echo "${PRIMARY_URL}" | awk -F '[/:]' '{print $4}')
export APP_PROTOCOL="https://"
```

The next set of environment variables that need to set deals with secrets. These values need to be random and secure.
Once again, Upsun provides you with something you can use for this very purpose: `PLATFORM_PROJECT_ENTROPY`.  In your
`.environment` file, add the following:

```bash
export FOREM_OWNER_SECRET=$PLATFORM_PROJECT_ENTROPY
```

Next, you need to let both Rails and Node know which environment type they're running in so they can load the
appropriate configuration files (e.g. from `config/environments`). In Upsun, the current environment type is exposed via
the `PLATFORM_ENVIRONMENT_TYPE` environment variable.

In your `.environment` file, add the following:

```bash
export RAILS_ENV="${PLATFORM_ENVIRONMENT_TYPE}"
export NODE_ENV="${PLATFORM_ENVIRONMENT_TYPE}"
```

{{< note theme="info" title="Environment configurations" >}}
If you do not want your preview environments to load a different configuration other than `production`, you can
statically set these values to `"production"`.
{{</ note >}}

The next two values will be specific to your Forem instance: Community name, and default email address:

```bash
export COMMUNITY_NAME="Up(sun) and Running with Forem"
export DEFAULT_EMAIL="upsun.user@upsun.com"
```
{{< note theme="info" title="Sensitive information" >}}
Remember, if you do not want to commit these values to your repository, you can instead create them as
[project variables](https://docs.upsun.com/development/variables/set-variables.html#create-project-variables).
{{</ note >}}

The remaining values (with one exception) come directly from the `.env_sample` file:

```bash
export RAILS_MAX_THREADS=5
export WEB_CONCURRENCY=2
export RACK_TIMEOUT_WAIT_TIMEOUT=100_000
export RACK_TIMEOUT_SERVICE_TIMEOUT=100_000
export SESSION_KEY="_Dev_Community_Session"
# two weeks in seconds
export SESSION_EXPIRY_SECONDS=1209600
export HONEYBADGER_API_KEY="testing"
export HONEYBADGER_JS_API_KEY="testing"
export HONEYBADGER_REPORT_DATA=false
```

The one value that is not originally from `.env_sample` is `HONEYBADGER_REPORT_DATA`. Honeybadger is an application
monitoring service that Forem uses for reporting application errors. If you do not have a Honeybadger API key, or do not
want to report data back to Honeybadger, leave it set to `false`. If you decide to use this service, you will need to
change/remove this value and fill in the remaining `HONEYBADGER_*` sections with your data.

### Build steps explained
`set -eux`

Using the `set` builtin, exit (`e`) immediately if a pipeline, simple/compound command, or list returns a non-exit code;
treat unset (`u`) variables as an error when performing parameter expansions; print a trace of simple commands, `for`
commands, `case` commands, `select` commands, and arithmetic `for` commands and their arguments or associated word lists
after they are expanded (`x`) and before they are executed.



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
