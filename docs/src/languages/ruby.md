---
title: "Ruby"
description: |
  Platform.sh supports deploying any Ruby application. Your application can use any Ruby application server such as Unicorn or Puma and deploying a Rails or a Sinatra app is very straight forward.
---

{{< description >}}

## Supported versions

### Ruby MRI

| **Grid** | **Dedicated** |
|----------------------------------|---------------|
|  {{< image-versions image="ruby" status="supported" environment="grid" >}} | {{< image-versions image="ruby" status="supported" environment="dedicated" >}} |

## Unicorn based Rails configuration

This example uses Unicorn to run a Ruby application.
You could use any Ruby application server such as Puma or Thin.

Configure the `.platform.app.yaml` file with a few key settings as listed below.
A complete example is included at the end of this section.

1. Specify the language of your application (available versions are listed above):

    {{< readFile file="/registry/images/examples/full/ruby.app.yaml" highlight="yaml" >}}

2. Setup environment variables.

    Rails runs by default on a development environment.
    You can change the Rails/Bundler via those environment variables,
    some of which will be defaults at some point on Platform.sh.

    ```yaml
    variables:
        env:
            BUNDLE_CACHE_ALL: '1' # will be default
            BUNDLE_CLEAN: '1' # /!\ if you are working with Ruby<2.7 this does not work well
            BUNDLE_DEPLOYMENT: '1' # will be default
            BUNDLE_ERROR_ON_STDERR: '1' # will be default
            BUNDLE_WITHOUT: 'development:test'
            DEFAULT_BUNDLER_VERSION: "2.2.26" # in case none is mentioned in Gemfile.lock
            EXECJS_RUNTIME: 'Node'
            NODE_ENV: 'production'
            NODE_VERSION: v14.17.6
            NVM_VERSION: v0.38.0
            RACK_ENV: 'production'
            RAILS_ENV: 'production'
            RAILS_LOG_TO_STDOUT: '1' # will be default (log to /var/log/app.log)
            RAILS_TMP: '/tmp' # will be default
    ```

3. Build your application with the build hook.

    Assuming you have your dependencies stored in the `Gemfile` at the root of your app folder to execute build steps:

    ```yaml
    hooks:
        build: |
            set -e

            echo "Installing NVM $NVM_VERSION"
            unset NPM_CONFIG_PREFIX
            export NVM_DIR="$PLATFORM_APP_DIR/.nvm"
            # install.sh automatically installs NodeJS based on the presence of $NODE_VERSION
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/$NVM_VERSION/install.sh | bash
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

            # we install the bundled bundler version and fallback to a default (in env vars above)
            export BUNDLER_VERSION="$(grep -A 1 "BUNDLED WITH" Gemfile.lock | tail -n 1)" || $DEFAULT_BUNDLER_VERSION
            echo "Install bundler $BUNDLER_VERSION"
            gem install --no-document bundler -v $BUNDLER_VERSION

            echo "Installing gems"
            # We copy the bundle directory to the Platform.sh cache directory for
            # safe keeping, then restore from there on the next build. That allows
            # bundler to skip downloading code it doesn't need to.
            [ -d "$PLATFORM_CACHE_DIR/bundle" ] && \
              rsync -az --delete "$PLATFORM_CACHE_DIR/bundle/" vendor/bundle/
            mkdir -p "$PLATFORM_CACHE_DIR/bundle"
            bundle install
            # synchronize updated cache for next build
            rsync -az --delete vendor/bundle/ "$PLATFORM_CACHE_DIR/bundle/"

            # precompile assets
            echo "Precompiling assets"
            # We copy the webpacker directory to the Platform.sh cache directory for
            # safe keeping, then restore from there on the next build. That allows
            # bundler to skip downloading code it doesn't need to.
            mkdir -p "$PLATFORM_CACHE_DIR/webpacker"
            mkdir -p "$RAILS_TMP/cache/webpacker"
            [ -d "$PLATFORM_CACHE_DIR/webpacker" ] && \
              rsync -az --delete "$PLATFORM_CACHE_DIR/webpacker/" $RAILS_TMP/cache/webpacker/
            # We dont need secret here https://github.com/rails/rails/issues/32947
            SECRET_KEY_BASE=1 bundle exec rails assets:precompile
            rsync -az --delete $RAILS_TMP/cache/webpacker/ "$PLATFORM_CACHE_DIR/webpacker/"
        deploy: bundle exec rake db:migrate
    ```

    These are installed as your project dependencies in your environment.
    You can also use the `dependencies` key to install global dependencies.
    These can be Ruby, Python, NodeJS, or PHP libraries.

    If you have assets, it's more likely that you need NodeJS/yarn.

    ```yaml
    dependencies:
        nodejs:
            yarn: "*"
    ```

4. Configure the command to start serving your application (this must be a foreground-running process) under the `web` section:

    ```yaml
    web:
        upstream:
            socket_family: unix
        commands:
            start: "bundle exec unicorn -l $SOCKET"
    ```

    This assumes you have Unicorn as a dependency in your Gemfile

     ```ruby
    # Use Unicorn as the app server
    gem "unicorn", "~> 6.0", :group => :production
    ```

5. Define the web locations your application is using:

    ```yaml
    web:
        locations:
            "/":
                root: "public"
                passthru: true
                expires: 1h
                allow: true
    ```

    This configuration sets the web server to handle HTTP requests at `/static`
    to serve static files stored in `/app/static/` folder.
    Everything else is forwarded to your application server.

6. Create any Read/Write mounts.
   The root file system is read only.
   You must explicitly describe writable mounts.

    ```yaml
    mounts:
        "/log":
            source: local
            source_path: log
        "/storage":
            source: local
            source_path: storage
        "/tmp":
            source: local
            source_path: tmp
    ```

    This setting allows your application writing temporary files to `/app/tmp`,
    logs stored in `/app/log`, and active storage in `/app/storage`.

    You can define other read/write mounts (your application code itself being deployed to a read-only file system).
    Note that the file system is persistent and when you backup your cluster these mounts are also backed up.

7. Then, setup the routes to your application in `.platform/routes.yaml`.

    ```yaml
    "https://{default}/":
        type: upstream
        # the first part should be your project name
        upstream: "app:http"
    ```

### Complete app configuration 

Here is a complete `.platform.app.yaml` file:

```yaml
name: 'app'
type: "ruby:3.0"

dependencies:
    nodejs:
        yarn: "*"

relationships:
    database: "database:mysql"

disk: 2048

variables:
    env:
        BUNDLE_CACHE_ALL: '1'
        BUNDLE_CLEAN: '1' # /!\ if you are working with Ruby<2.7 this does not work well
        BUNDLE_DEPLOYMENT: '1'
        BUNDLE_ERROR_ON_STDERR: '1'
        BUNDLE_WITHOUT: 'development:test'
        DEFAULT_BUNDLER_VERSION: "2.2.26" # in case none is mentioned in Gemfile.lock
        EXECJS_RUNTIME: 'Node'
        NODE_ENV: 'production'
        NODE_VERSION: v14.17.6
        NVM_VERSION: v0.38.0
        RACK_ENV: 'production'
        RAILS_ENV: 'production'
        RAILS_LOG_TO_STDOUT: '1'
        RAILS_TMP: '/tmp'

hooks:
    build: |
        set -e

        echo "Installing NVM $NVM_VERSION"
        unset NPM_CONFIG_PREFIX
        export NVM_DIR="$PLATFORM_APP_DIR/.nvm"
        # install.sh will automatically install NodeJS based on the presence of $NODE_VERSION
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/$NVM_VERSION/install.sh | bash
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

        # we install the bundled bundler version and fallback to a default (in env vars above)
        export BUNDLER_VERSION="$(grep -A 1 "BUNDLED WITH" Gemfile.lock | tail -n 1)" || $DEFAULT_BUNDLER_VERSION
        echo "Install bundler $BUNDLER_VERSION"
        gem install --no-document bundler -v $BUNDLER_VERSION

        echo "Installing gems"
        # We copy the bundle directory to the Platform.sh cache directory for
        # safe keeping, then restore from there on the next build. That allows
        # bundler to skip downloading code it doesn't need to.
        [ -d "$PLATFORM_CACHE_DIR/bundle" ] && \
            rsync -az --delete "$PLATFORM_CACHE_DIR/bundle/" vendor/bundle/
        mkdir -p "$PLATFORM_CACHE_DIR/bundle"
        bundle install
        # synchronize updated cache for next build
        rsync -az --delete vendor/bundle/ "$PLATFORM_CACHE_DIR/bundle/"

        # precompile assets
        echo "Precompiling assets"
        # We copy the webpacker directory to the Platform.sh cache directory for
        # safe keeping, then restore from there on the next build. That allows
        # bundler to skip downloading code it doesn't need to.
        mkdir -p "$PLATFORM_CACHE_DIR/webpacker"
        mkdir -p "$RAILS_TMP/cache/webpacker"
        [ -d "$PLATFORM_CACHE_DIR/webpacker" ] && \
            rsync -az --delete "$PLATFORM_CACHE_DIR/webpacker/" $RAILS_TMP/cache/webpacker/
        # We dont need secret here https://github.com/rails/rails/issues/32947
        SECRET_KEY_BASE=1 bundle exec rails assets:precompile
        rsync -az --delete $RAILS_TMP/cache/webpacker/ "$PLATFORM_CACHE_DIR/webpacker/"
    deploy: bundle exec rake db:migrate

mounts:
    "/log":
        source: local
        source_path: log
    "/storage":
        source: local
        source_path: storage
    "/tmp":
        source: local
        source_path: tmp

web:
    upstream:
        socket_family: unix
    commands:
        start: "bundle exec unicorn -l $SOCKET"

    locations:
        "/":
            root: "public"
            passthru: true
            expires: 1h
            allow: true

```

## Configuring services

8. This example assumes there is a MySQL instance.
To configure it, create a `.platform/services.yaml` such as the following:

    ```yaml
    database:
        type: mysql:10.4
        disk: 2048
    ```

## Connecting to services

You can [define services](/configuration/services/_index.md) in your environment.
And then link to the services using `.platform.app.yaml`:

```yaml
relationships:
    database: "database:mysql"
```

By using the following Ruby function calls, you can obtain the database details.

```ruby
require "base64"
require "json"
relationships= JSON.parse(Base64.decode64(ENV['PLATFORM_RELATIONSHIPS']))
```

Which should give you something like:

```json
{
   "database" : [
      {
         "path" : "main",
         "query" : {
            "is_master" : true
         },
         "port" : 3306,
         "username" : "user",
         "password" : "",
         "host" : "database.internal",
         "ip" : "246.0.241.50",
         "scheme" : "mysql"
      }
   ]
}
```

For Rails, you have two choices:

* Use the standard Rails `config/database.yml` with the values found with the snippet provided before
* Use the [platformsh-rails-helper gem](https://github.com/platformsh/platformsh-rails-helper)
  by adding it to your `Gemfile` and commenting the production block in `config/database.yml`.

## Other tips

* To speed up boot you can use the [Bootsnap gem](https://github.com/Shopify/bootsnap)
  and configure it with the local `/tmp`:

  ```
  Bootsnap.setup(cache_dir: "/tmp/cache")
  ```
* For garbage collection tuning, you can read [this article](https://shopify.engineering/17489064-tuning-rubys-global-method-cache)
  and look for [discourse configurations](https://github.com/discourse/discourse_docker/blob/b259c8d38e0f42288fd279c9f9efd3cefbc2c1cb/templates/web.template.yml#L8)

## Project templates

A number of project templates for Ruby applications and typical configurations are available on GitHub.
Not all of them are proactively maintained but all can be used as a starting point
or reference for building your own website or web application.

Platform.sh also provides a [helper library for Ruby applications](https://github.com/platformsh/platformsh-ruby-helper)
and one [for Rails applications](https://github.com/platformsh/platformsh-rails-helper)
that simplify presenting environment information to your application.
They aren't required to run Ruby applications on Platform.sh but are recommended.

{{< repolist lang="ruby" >}}
