---
title: "Build and deploy"
weight: 9
---

The `.platform.app.yaml` file provides a number of ways to control
how an application gets turned from a directory in Git into a running application.
There are three blocks that control different parts of the process: the build flavor, dependencies, and hooks.
The build process runs the build flavor, then install dependencies, then run the user-provided build hook.
The deploy process runs the deploy hook.

## Build

The `build` defines what happens when building the application.
Its only property is `flavor`, which specifies a default set of build tasks to run. Flavors are language-specific.

See what the build flavor is for your language:

- [Node.js](/languages/nodejs#build-flavor)
- [PHP](/languages/php#build-flavor)

In all languages, you can also specify a flavor of `none`
(which is the default for any language other than PHP and Node.js).
As the name suggests, this takes no action at all.
That's useful when you want complete control over your build steps,
such as to run a custom Composer command or use an alternate Node.js package manager.

```yaml
build:
    flavor: none
```

## Build dependencies

It's also possible to install additional system-level dependencies as part of the build process.
These can be installed before the `build` hook runs using the native package manager for several web-focused languages.

Platform.sh supports pulling any dependencies for the following languages:

* PHP (via [Composer](https://getcomposer.org/))
* Python 2 and 3 (via [Pip](https://packaging.python.org/tutorials/installing-packages/))
* Ruby (via [Bundler](https://bundler.io/))
* Node.js (via [npm](https://www.npmjs.com/))
* Java (via [Apache Maven](https://maven.apache.org/), [Gradle](https://gradle.org/), or [Apache Ant](https://ant.apache.org/))

### Python dependencies

Applications can have both Python 2 and Python 3 dependencies,
using the version of each that's packaged with the most recent Debian distribution.
The format of Python dependencies complies with [PEP 394](https://www.python.org/dev/peps/pep-0394/).
So specifying a dependency in a `python` or `python2` block uses `pip2` and Python 2,
while specifying a dependency in a `python3` block uses `pip3` and Python 3.

It's best to specify your dependencies with the specific version of Python you wish to use (either `python2` or `python3`),
rather than with the generic `python` declaration,
to ensure your application functions normally if Debian's default version of Python changes.

### Specifying dependencies

Build dependencies are independent of the eventual dependencies of your application
and are available in the `PATH` during the build process and in the runtime environment of your application.
Note that in many cases a given package can be installed either as a global dependency
or as part of your application's own dependencies.
In such cases it's up to you which one to use.

You can specify those dependencies as shown below:

```yaml
dependencies:
    php: # Specify one Composer package per line.
        drush/drush: '8.0.0'
        composer/composer: '^2'
    python: # Specify one Python 2 package per line.
        behave: '*'
    python2: # Specify one Python 2 package per line.
        requests: '*'
    python3: # Specify one Python 3 package per line.
        numpy: '*'
    ruby: # Specify one Bundler package per line.
        sass: '3.4.7'
    nodejs: # Specify one NPM package per line.
        pm2: '^4.5.0'
```

Note that the package name format for each language is defined by the package manager used;
similarly, the version constraint string is interpreted by the package manager.
Consult the appropriate package manager's documentation for the supported formats.

## Hooks

Platform.sh supports three "hooks", or points in the deployment of a new version of an application that you can inject a custom script into.
Each runs at a different stage of the process.

Each hook is executed as a single script, so they're considered to have failed only if the final command in them fails.
To cause them to fail on the first failed command, add `set -e` to the beginning of the hook.
If a `build` hook fails for any reason,
then the build is aborted and the deploy doesn't happen.
Note that this only works for `build` hooks --
if other hooks fail, the deploy still happens.

The "home" directory for each hook is the application root.
If your scripts need to be run from the doc root of your application,
you need to `cd` to it first; e.g.: `cd web`.

```yaml
hooks:
    build: |
        set -e
        cd web
        cp some_file.php some_other_file.php
    deploy: |
        update_schema.sh
    post_deploy: |
        import_new_content.sh
        clear_cache.sh
```

The `|` character tells YAML that the lines that follow should be interpreted literally as a newline-containing string
rather than as multiple lines of YAML properties.

Hooks are executed using the dash shell, not the bash shell used by normal SSH logins.
In most cases, that makes no difference, but it may impact some more involved scripts.

### Build hook

The `build` hook is run after the build flavor (if any).
At this point no services (such as a database) are available nor any persistent file mounts,
as the application hasn't yet been deployed.
Environment variables that exist only at runtime such as `PLATFORM_BRANCH` and `PLATFORM_DOCUMENT_ROOT` anre't available during this phase.
See the full list of provided [build time and runtime variables](/development/variables.md#platformsh-provided-variables).
There are three writeable directories at this time:

* `$PLATFORM_APP_DIR`:
  This is where your code is checked out and is the working directory when the build hook starts.
  The contents of this directory after the build hook is the application that gets deployed.
  (This directory is always `/app`, but it's better to use the variable or rely on the working directory than to hard code that.)
  Most of the time, this is the only directory you use.
* `$PLATFORM_CACHE_DIR`:
  This directory persists between builds, but is NOT deployed as part of your application.
  It's a good place for temporary build artifacts, such as downloaded `.tar.gz` or `.zip` files, that can be reused between builds.
  Note that it's shared by all builds on all branches,
  so if using the cache directory make sure your build code accounts for that.
* `/tmp`:
  The temp directory is also useful for writing files that aren't needed in the final application,
  but it's wiped between each build.

There are no constraints on what can be downloaded during your build hook except for the amount of disk available at that time.
Independent of the mounted disk size you have allocated for deployment,
build environments (the application plus the cache directory) and therefore application images are limited to 4 GB during the build phase.
If you exceed this limit, you receive a `No space left on device` error.
It's possible to increase this limit in certain situations,
but it's necessary to open a support ticket to do so.
Consult the [troubleshooting guide](/development/troubleshoot.md#no-space-left-on-device) for more information on this topic.

### Deploy hook

The `deploy` hook is run after the application container has been started, but before it has started accepting requests.
You can access other services at this stage (such as MySQL, Solr, Redis).
The disk where the application lives is read-only at this point.
Note that the deploy hook only runs on a [`web`](/configuration/app/web.md) instance,
not a [`worker`](/configuration/app/workers.md) instance.

This hook should be used when something needs to run once for all instances of an app when deploying new code.
It isn't run when a host is restarted (such as during region maintenance),
so anything that needs to run each time an app starts (regardless of whether there's new code)
should go in the `start` key in [your web configuration](/configuration/app/web.md#commands).

Be aware: The deploy hook blocks the site accepting new requests.
If your deploy hook is only a few seconds then incoming requests in that time are paused and continues when the hook completes,
effectively appearing as if the site just took a few extra seconds to respond.
If it takes too long, however, requests can't be held and appear as dropped connections.
Only run tasks in your deploy hook that have to be run exclusively,
such as database schema updates or some types of cache clear (those where the code must match what's on the disk).
A post-deploy task that can safely run concurrently with new incoming requests should be run as a `post_deploy` hook instead.

After a Git push, in addition to the log shown in the activity log,
you can see the results of the `deploy` hook in the `/var/log/deploy.log` file when logged in to the environment via SSH.
This file contains a log of the execution of the deployment hook.
For example:

```bash
[2014-07-03 10:03:51.100476] Launching hook 'cd public ; drush -y updatedb'.

My_custom_profile  7001  Update 7001: Enable the Platform module.
Do you wish to run all pending updates? (y/n): y
Performed update: my_custom_profile_update_7001
'all' cache was cleared.
Finished performing updates.
```

Your `deploy` hook is tied to commits in the same way as your builds.
Once a commit has been pushed and a new build image has been created,
the result of both the `build` and `deploy` hooks are reused until there is a new git commit. 

Redeploys trigger only the `post_deploy` hook to run again from the beginning,
and a committed change to the application is needed to rerun the `build` and `deploy` hooks. 

This means that adding variables, changing access permissions, or even running a `redeploy` using the CLI or management console
don't cause the `deploy` hook to run again for the current commit. 

### Post-Deploy hook

The `post_deploy` hook functions exactly the same as the `deploy` hook,
but after the container is accepting connections.
It runs concurrently with normal incoming traffic.
That makes it well suited to any updates that don't require exclusive database access.

What's "safe" to run in a `post_deploy` hook vs. in a `deploy` hook varies by the application.
Often times content imports, some types of cache warmups, and other such tasks are good candidates for a `post_deploy` hook.

The `post_deploy` hook logs to its own file in addition to the activity log, `/var/log/post-deploy.log`.

The `post_deploy` hook is the only hook provided that runs from the beginning during a redeploy. 

## Compile Sass files as part of a build

As a good example of combining dependencies and hooks, you can compile your Sass files.

Assume that your application has Sass source files in the `web/styles` directory.
That directory also contains a `package.json` file for npm.

The following blocks download a specific version of Sass,
then during the build step call a `build-css` npm script to proceed with compiling the Sass files.
This assumes that you have a `build-css` npm script set up to run `sass`,
either with a tool such as webpack or using the binary directly.

```yaml
dependencies:
    nodejs:
        sass: "^1"

hooks:
    build: |
        npm install
        npm run build-css
```

## Run certain commands only on certain environments

The `deploy` and `post_deploy` hooks have access to all of the same [environment variables](/development/variables.md) as the application does normally,
which makes it possible to vary those hooks based on the environment.
A common example is to enable certain modules only in non-production environments.
Because the hook is a shell script, you have full access to all shell scripting capabilities, such as `if/then` directives.

The following example checks the `$PLATFORM_ENVIRONMENT_TYPE` variable to see if it's in a production environment.

```yaml
hooks:
    deploy: |
        if [ "$PLATFORM_ENVIRONMENT_TYPE" = production ]; then
            # Run commands only when deploying to production
        else
            # Run commands only when deploying on development or staging environments
        fi
        # Commands to run regardless of the environment
```
