# Build and deploy

The `.platform.app.yaml` file provides a number of ways to control how an application gets turned from a directory in Git into a running application.  There are three blocks that control different parts of the process: the build flavor, dependencies, and hooks.  The build process will run the build flavor, then install dependencies, then run the user-provided build hook.  The deploy process will run the deploy hook.

## Build

The `build` defines what happens when building the application.  It has two properties, `flavor`, which specifies a default set of build tasks to run, and `caches`, which allows fine-grained control of the build cache.

The available flavors are language specific:

### PHP (`composer` by default)

`composer` will run `composer --no-ansi --no-interaction install --no-progress --prefer-dist --optimize-autoloader` if a `composer.json` file is detected.

`drupal` will run `drush make` automatically in one of a few different ways.  See the [Drupal 7](/frameworks/drupal7.md) documentation for more details. We recommend only using this build mode for Drupal 7.

### Node.js (`default` by default)

`default` will run `npm prune --userconfig .npmrc && npm install --userconfig .npmrc` if a `package.json` file is detected. Note that this also allows you to provide a custom `.npmrc` file in the root of your application (as a sibling of the `.platform.app.yaml` file.)

In all languages you can also specify a flavor of `none` (which is the default for any language other than PHP and Node.js); as the name suggests it will take no action at all. That is useful when you want complete control over your build steps, such as to run a custom Composer command or use an alternate Node.js package manager.

```yaml
build:
    flavor: composer
```

## Build cache

The build cache is an opt-in feature that lets you cache certain portions of the built output to speed up the build process.  Frequently, some portion of the build process is highly stable between builds and so it's wasteful to recompile it every time.  That includes downloading 3rd party dependencies as well as some other compilation tasks, like Sass or Less compilation.

The build cache is specified in the `build` block under the `caches` heading.  It has one required property, `watch`, and a few optional parameters.  There is no limit on the number of cache items that can be defined.

A basic PHP build cache block would look like this:

```yaml
build:
    caches:
        vendor:
            watch: composer.*
```

The key of the cache definition (`vendor` in this case) is the identifier of the cache, and also the name of the directory to be cached.  `watch` specifies what file or files will trigger a new cache item should they change.  That is, the example above would reuse the `vendor` directory, and trigger a new build of it every time the `composer.json` or `composer.lock` files change.

### `watch`

The `watch` property specifies the file or files that control a given cacheable directory.  It may either be a single string or multiple strings in glob format.  That is, the following are all legal:

```yaml
watch: composer.*
```

```yaml
watch: 
    - composer.json
    - composer.lock
```

```yaml
watch:
    - "assets/**/*.sass"
    - "assets/**/*.svg"
```

The hash of all matching files form the cache key for the cache entry.

### `directory`

The `directory` property specifies the directory, relative to the application root, that should be cached.  While it can be any directory, it should ideally be set to a directory that does not exist in the Git repository and is created in the build process.  (Setting it to a directory that is in Git and doesn't change in build won't break anything, but is rather pointless.)

If not specified, the cache key is the directory name.  That is, the following are equivalent:

```yaml
build:
    cache:
        build/assets:
            watch: "assets/**/*.sass"
```

```yaml
build:
    cache:
        my_asset_cache:
            directory: "build/assets"
            watch: "assets/**/*.sass"
```

### `allow_stale`

Defaults to `false`.  If set to `true`, then on a cache miss the directory will be populated by the most recently created cache version, even if it's out of date.  That allows build processes capable of incremental builds to start from a mostly-complete state and just recompute part of the build, saving time.  Not all build processes are capable of that, however, so it defaults to false.

### `share_between_apps`

Defaults to `false`.  If set to `true`, then in a [multi-application project](/configuration/app/multi-app.md) the same cache is used by all application instances.  If not, each application cache is independent of each other.  This flag may be useful in cases where the same code base or nearly the same code base is running in two different applications and thus 3rd party dependencies for both are nearly the same.  In that case, using an already-built cache (likely with the `allow_stale` flag) from another application instance may speed up the build process.  Note, however, that if the applications differ significantly in their dependencies or build output then this flag may cause increased cache thrashing and reduce the effectiveness of the build cache.

### Recommended configurations

The build cache can be configured for any build task or script your application uses.  However, the most common case is caching 3rd party dependency installation as those tend to be stable over time and thus easy to cache.  Recommended build cache settings for different dependency managers are shown below.  If your application uses multiple dependency managers (such as Composer for the application but NPM for some of the build tooling or Ruby for Sass compilation) then you can include multiple directives to cover all of them.


{% codetabs name="PHP", type="yaml" -%}
build:
    caches:
        vendor:
            watch: composer.*
            allow_stale: true
{%- language name="Node/NPM", type="yaml" -%}
build:
    caches:
        node_modules:
            watch: package-lock.json
{%- language name="Python", type="yaml" -%}
build:
    caches:
        what_dir_is_this:
            watch:
                - Pipfile
                - Pipfile.lock
{%- language name="Ruby", type="yaml" -%}
build:
    caches:
        what_dir_is_this:
            watch:
                - Gemfile
                - Gemfile.lock
{%- language name="Go", type="yaml" -%}
build:
    caches:
        vendor:
            watch:
                - go.mod
                - go.sum
            allow_stale: true
{%- endcodetabs %}

## Build dependencies

It is also possible to install additional system-level dependencies as part of the build process.  These can be installed before the `build` hook runs using the native package manager for several web-focused languages.

Platform.sh supports pulling any dependencies for the following languages:

* PHP (via [Composer](https://getcomposer.org/))
* Python 2 and 3 (via [Pip](https://packaging.python.org/installing/))
* Ruby (via [Bundler](https://bundler.io/))
* Node.js (via [NPM](https://www.npmjs.com/))
* Java (via [Maven](https://maven.apache.org/), with Ant support)

### Python dependencies

Applications can have both Python 2 and Python 3 dependencies, using the version of each that is packaged with the most recent Debian distribution. The format of Python dependencies complies with [PEP 394](https://www.python.org/dev/peps/pep-0394/). That is, specifying a dependency in a `python` or `python2` block will use `pip2` and Python 2, while specifying a dependency in a `python3` block will use `pip3` and Python 3.

We suggest that you specify your dependencies with the specific version of Python you wish to use (i.e. either `python2` or `python3`), rather than with the generic `python` declaration, to ensure your application will function normally in the future if Debian's default version of Python changes.

### Specifying dependencies

Build dependencies are independent of the eventual dependencies of your application and are available in the `PATH` during the build process and in the runtime environment of your application.  Note that in many cases a given package can be installed either as a global dependency or as part of your application's own dependencies.  In such cases it's up to you which one to use.

You can specify those dependencies as shown below:

```yaml
dependencies:
  php: # Specify one Composer package per line.
    drush/drush: '8.0.0'
  python: # Specify one Python 2 package per line.
    behave: '*'
  python2: # Specify one Python 2 package per line.
    requests: '*'
  python3: # Specify one Python 3 package per line.
    numpy: '*'
  ruby: # Specify one Bundler package per line.
    sass: '3.4.7'
  nodejs: # Specify one NPM package per line.
    grunt-cli: '~0.1.13'
```

Note that the package name format for each language is defined by the package manager used; similarly, the version constraint string will be interpreted by the package manager.  Consult the appropriate package manager's documentation for the supported formats.

## Hooks

Platform.sh supports three "hooks", or points in the deployment of a new version of an application that you can inject a custom script into.  Each runs at a different stage of the process.

Each hook is executed as a single script, so they will be considered failed only if the final command in them fails. To cause them to fail on the first failed command, add `set -e` to the beginning of the hook.  If a build hook fails for any reason then the build is aborted and the deploy will not happen.

The "home" directory for each hook is the application root. If your scripts need to be run from the doc root of your application, you will need to `cd` to it first; e.g.: `cd web`.

```yaml
hooks:
    build: |
        set -e
        cd web
        cp some_file.php some_other_file.php
    deploy: |
        update_schema.sh
    post_deploy: |
        set -e
        import_new_content.sh
        clear_cache.sh
```

The `|` character tells YAML that the lines that follow should be interpreted literally as a newline-containing string rather than as multiple lines of YAML properties.

Hooks are executed using the dash shell, not the bash shell used by normal SSH logins. In most cases that makes no difference but may impact some more involved scripts.

### Build hook

The `build` hook is run after the build flavor (if any).  The file system is fully writable, but no services are available (such as a database) nor any persistent file mounts, as the application has not yet been deployed.

### Deploy hook

The `deploy` hook is run after the application container has been started, but before it has started accepting requests.  You can access other services at this stage (MySQL, Solr, Redis, etc.). The disk where the application lives is read-only at this point.  Note that the deploy hook will only run on a [`web`](/configuration/app/web.md) instance, not on a [`worker`](/configuration/app/workers.md) instance.

Be aware: The deploy hook blocks the site accepting new requests.  If your deploy hook is only a few seconds then incoming requests in that time are paused and will continue when the hook completes, effectively appearing as the site just took a few extra seconds to respond.  If it takes too long, however, requests cannot be held and will appear as dropped connections.  Only run tasks in your deploy hook that have to be run exclusively, such as database schema updates or some types of cache clear.  A post-deploy task that can safely run concurrently with new incoming requests should be run as a `post_deploy` hook instead.

After a Git push, you can see the results of the `deploy` hook in the `/var/log/deploy.log` file when logged in to the environment via SSH. It contains the log of the execution of the deployment hook. For example:

```bash
[2014-07-03 10:03:51.100476] Launching hook 'cd public ; drush -y updatedb'.

My_custom_profile  7001  Update 7001: Enable the Platform module.
Do you wish to run all pending updates? (y/n): y
Performed update: my_custom_profile_update_7001
'all' cache was cleared.
Finished performing updates.
```

### Post-Deploy hook

The `post_deploy` hook functions exactly the same as the `deploy` hook, but after the container is accepting connections.  That is, it will run concurrently with normal incoming traffic.  That makes it well suited to any updates that do not require exclusive database access.

What is "safe" to run in a `post_deploy` hook vs. in a `deploy` hook will vary by the application.  Often times content imports, some types of cache warmups, and other such tasks are good candidates for a `post_deploy` hook.

The `post_deploy` hook logs to its own file, `/var/log/post-deploy.log`.

## How do I compile Sass files as part of a build?

As a good example of combining dependencies and hooks, you can compile your SASS files using Grunt.

Let's assume that your application has Sass source files (Sass being a Ruby tool) in the `web/styles` directory.  That directory also contains a `package.json` file for npm and `Gruntfile.js` for Grunt (a Node.js tool).

The following blocks will download a specific version of Sass and Grunt pre-build, then during the build step will use them to install any Grunt dependencies and then run the grunt command.  This assumes that your Grunt command includes the Sass compile command.

```yaml
dependencies:
  ruby:
    sass: '3.4.7'
  nodejs:
    grunt-cli: '~0.1.13'

hooks:
  build: |
    cd web/styles
    npm install
    grunt
```

## How can I run certain commands only on certain environments?

The `deploy` and `post_deploy` hooks have access to all of the same [environment variables](/development/variables.md) as the application does normally, which makes it possible to vary those hooks based on the environment.  A common example is to enable certain modules only in non-production environments.  Because the hook is simply a shell script we have full access to all shell scripting capabilities, such as `if/then` directives.

The following Drupal example checks the `$PLATFORM_BRANCH` variable to see if we're in a production environment (the `master` branch) or not.  If so, it forces the `devel` module to be disabled.  If not, it forces the `devel` module to be enabled, and also uses the `drush` Drupal command line tool to strip user-specific information from the database.

```yaml
hooks:
    deploy: |
        if [ "$PLATFORM_BRANCH" = master ]; then
            # Use Drush to disable the Devel module on the Master environment.
            drush dis devel -y
        else
            # Use Drush to enable the Devel module on other environments.
            drush en devel -y
            # Sanitize your database and get rid of sensitive information from Master environment.
            drush -y sql-sanitize --sanitize-email=user_%uid@example.com --sanitize-password=custompassword
        fi
        drush -y updatedb
```
