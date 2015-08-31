# `.platform.app.yaml`

## Configure your Application

Platform.sh supports  multiple applications per project(for example a RESTful web service
and a front-end, or a main web site and a blog). But more often than not projects are composed
of a single application. In which case you can simply put a `.platform.app.yaml` at the root
of your repository. 

This file controls the application and the way it will be built and deployed on Platform.sh.

Here is an example of a `.platform.app.yaml` file:

```yaml
name: front
type: php:5.5
build:
    flavor: drupal
relationships:
    database: "mysql:mysql"
    solr: "solr:solr"
    redis: "redis:redis"
web:
    document_root: "/"
    passthru: "/index.php"
disk: 2048
mounts:
    "/public/sites/default/files": "shared:files/files"
    "/tmp": "shared:files/tmp"
    "/private": "shared:files/private"
hooks:
    # We run deploy hook after your application has been deployed and started.
    deploy: |
        cd public
        drush -y updatedb
crons:
    drupal:
        spec: "*/20 * * * *"
        cmd: "cd public ; drush core-cron"
```

> **note**
> The `.platform.app.yaml` is specific to your application. If you have multiple
> applications inside your Git repository, you need one `.platform.app.yaml` at 
>the root of each application [see here](/platform-app-yaml-multi-app.html).  

### Name

The `name` is the unique identifier of the application. Platform.sh
supports multiple applications within a project, so each application
must have a **unique name** within a project. The name may only be 
composed of lower case alpha-numeric characters. (a-z0-9). This name
is used in the `.platform/routes.yaml` to define the HTTP upstream
(by default `php:php`) if you called your application `app` you will
need to use `app:php` in the upstream field. You can also use this
name in multi-application relationships. 

> **note* 
> If you change the name you should think about updating your other
> configuration files (routes.yaml or the different .platform.app.yaml
> you will have in a multi-application project.
> Changing the name has no effect on your different services (databases
> etc) you data will still be there.
 

### Type and Build

The `type`  and `build` are used to build and run the project. The only supported `type` currently is PHP.

Supported versions:

    type: php:5.4 (default)
    type: php:5.5
    type: php:5.6

The `build` concernes what will happen by default when building the project it has a sub property `flavor` for which the possible values are:

-   drupal
-   symfony
-   composer

Example:

    type: php:5.4
    build:
        flavor: symfony

### Access

The `access` define the user roles who can log in via SSH to the
environments they have access to.

Possible values are:

-   ssh: admin
-   ssh: contributor
-   ssh: viewer


### Relationships

The `relationships` defines how services are mapped within your
application.

The left-hand side is the name of the relationship as it will be exposed
to the application in the *PLATFORM_RELATIONSHIPS* environment
variable. The right-hand side is in the form
`<service name>:<endpoint name>`. where "service name" comes from the 
 `.platform/services.yaml` and  "endpoint name" should be the same as the 
 value of "type"  declared in that same file.

>**note** so here in the first  example above you could very well have something
>like `mycache: "arediscache:redis"` instead of `redis: "redis:redis"` (if in 
> `services.yaml` you named your a service of type `redis` with `arediscache`.
> more often than not in our example we simply call a redis service "redis" a 
> mysql one "mysql" etc..

Example of valid options are:

-   database: "mysql:mysql"
-   database2: "mysql2:mysql"
-   cache: "arediscache:redis"
-   search: "searchengine:solr"

>** note ** You should see the [`services.yaml` documentation](reference/services-yaml.md) 
> for a full list of currently supported service types and service endpoints.


### Web

The `web` defines how the application is exposed to the web (in HTTP). Here we tell the web application how to serve content. From the front-controller script to a non-static requests to an index.php file on the root. We support any directory structure so the static file can be in a sub directory, and the index.php file can be further down.

It has a few sub-keys which are:

-   **document_root**: The path relative to the root of the application
    that is exposed on the web. Typically `/public` or `/web`.
-   **passthru**: The URL that is used in case of a file could not be found (either static or php). This would typically be your applications front controller, often `/index.php` or `/app.php`.
-   **index_files**: If you want to use a static file (`index.html`) to serve your application.
-   **blacklist**: A list of files which should never be executed. Has no effect on static files.
-   **whitelist**: A list of static files (as regular expressions) that may be served. Dynamic files (eg: PHP files) will be treated as static files and have their source code served, but they will not be executed.
-   **expires**: The number of seconds whitelisted (static) content
    should be cached by the browser. This enables the cache-control and
    expires headers for static content. The `expires` directive and
    resulting headers are left out entirely if this isn't set.

Contrary to standard `.htaccess` approaches, which accept a
**blacklist** and allow everything to be accessed except a specific
list, we accept a **whitelist** which means that anything not matched
will trigger a 404 error and will be passed through to your `passthru`
URL.

To extend the whitelist, you should copy the [default
whitelist](https://github.com/platformsh/platformsh-examples/blob/symfony/todo-mvc-full/.platform.app.yaml#L23),
and only keep the extensions you need.


### Disk

The `disk` defines the size of the persistent disk size of the
application in MB.

> **note**
> The minimal recommended disk size is 256MB. If you see the error **UserError: Error building the project: Disk size may not be smaller than 128MB**, increase the size to 256MB.


### Mounts

The `mounts` is an object whose keys are paths relative to the root of
the application. It's in the form `volume_id[/subpath]`.

For example with Drupal, you'll want your `sites/default/files` to be
mounted under a shared resource which is writable.

The format is:

-   "/public/sites/default/files": "shared:files/files"

> **note**
> The `shared` means that the volume is shared between your applications inside an environment. The `disk` key defines the size available for that `shared` volume.


### Build dependencies

The `dependencies` allow you to specify dependencies that your
application might need during the build process.

Platform.sh supports pulling any dependencies for the following
languages:

-   PHP
-   Python
-   Ruby
-   NodeJS

Those dependencies are independent of the eventual dependencies of your
application, and are available in the `PATH`, during the build process
and in the runtime environment of your application.

You can specify those dependencies like this:

```yaml
dependencies:
  php:
    drush/drush: "6.4.0"
  python:
    behave: "*"
  ruby:
    sass: "3.4.7"
  nodejs:
    grunt-cli: "~0.1.13"
```


### Hooks

The `hooks` (also called: deployment hooks) let you define shell
commands to run during the deployment process.

They can be executed at various points in the lifecycle of the
application (build/deploy).

Possible hooks are:

-   **build**: We run build hooks before your application has been
    packaged. No other services are accessible at this time since the
    application has not been deployed yet.
-   **deploy**: We run deploy hooks after your application has been
    deployed and started. You can access other services at this stage
    (MySQL, Solr, Redis...).

Note that the "home" directory is /app while your application will be
mounted in /app/public (by default, you can define this yourself in you
.app.platform.yaml file) so you might want to cd /app/public before
running those.

After a Git push, you can see the results of the `deploy` hook in the
`/var/log/deploy.log` file when logging to the environment via SSH. It
contains the log of the execution of the deployment hook. For example:

```bash
[2014-07-03 10:03:51.100476] Launching hook 'cd public ; drush -y updatedb'.

My_custom_profile  7001  Update 7001: Enable the Platform module.
Do you wish to run all pending updates? (y/n): y
Performed update: my_custom_profile_update_7001
'all' cache was cleared.
Finished performing updates.
```

#### [Example] Compile SASS files using Grunt

As a good example combining dependencies and hooks, you can compile your
SASS files using Grunt.

In your `.platform.app.yaml` file:

```yaml
dependencies:
  ruby:
    sass: "3.4.7"
  nodejs:
    grunt-cli: "~0.1.13"

hooks:
  build: |
    cd public/profiles/project_name/themes/custom/theme_name
    npm install
    grunt
```

This requires the `package.json` and `Gruntfile.js` files to be
correctly setup in the theme folder.

#### [Example] Trigger deploy hook on a specific environment

To trigger a deploy hook only on a specific environment, use the following 
environment variable: `$PLATFORM_ENVIRONMENT` that you put in a `if/then` statement.

In your `.platform.app.yaml` file:

```
hooks:
  deploy: |
    if [ $PLATFORM_ENVIRONMENT = "master" ]; then
      # Use Drush to disable the Devel module on the Master environment.
      drush dis devel -y
    else
      # Use Drush to enable the Devel module on other environments.
      drush en devel -y
    fi
```

### Crons

The `crons` is an object describing processes that are triggered on a
schedule.

It has a few sub-keys which are:

-   **spec**: The cron specification. For example: `*/20 * * * *`.
-   **cmd**: The command that is executed, for example
    cd public ; drush core-cron\`


## Default configuration file

if you do not have a `.platform.app.yaml` file the following one that assumes you are deploying a Drupal instance will be applied:

```yaml
name: php
type: php:5.4
build:
    flavor: drupal
access:
    ssh: contributor
relationships:
    database: "mysql:mysql"
    solr: "solr:solr"
    redis: "redis:redis"
web:
    document_root: "/"
    passthru: "/index.php"
disk: 2048
mounts:
    "/public/sites/default/files": "shared:files/files"
    "/tmp": "shared:files/tmp"
    "/private": "shared:files/private"
crons:
    drupal:
        spec: "*/20 * * * *"
        cmd: "cd public ; drush core-cron"
```

* [Past Changes of the configuration format can be found here](reference/upgrade/)
