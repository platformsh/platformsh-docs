# `.platform.app.yaml`

## Configure your Application

You control your application and the way it will be built and deployed on Platform.sh
via a single configuration file `.platform.app.yaml` located at the root of your application 
folder inside your Git repository.

Here is an example of a `.platform.app.yaml` file for Drupal:

    # The unique identifier of the application.
    name: front
    # The language that will run your application.
    type: php:5.6
    # The way to build your application.
    build:
        flavor: drupal
    # The way services are mapped within your application.
    relationships:
        database: "mysql:mysql"
        solr: "solr:solr"
        redis: "redis:redis"
    # The way your application is exposed to the web.
    web:
        locations:
            "/":
                root: "public"
                expires: -1
                passthru: "/index.php"
                index: 
                    - index.php
                allow: true
    # The size of the persistent disk size of your application in MB.
    disk: 2048
    # The volumes that are mounted under a writable shared resource.
    mounts:
        "/public/sites/default/files": "shared:files/files"
        "/tmp": "shared:files/tmp"
        "/private": "shared:files/private"
    # The shell commands to run during the build or deployment process.
    hooks:
        # We run deploy hook after your application has been deployed and started.
        deploy: |
            cd public
            drush -y updatedb
    # The processes that are triggered on a schedule.
    crons:
        drupal:
            spec: "*/20 * * * *"
            cmd: "cd public ; drush core-cron"

> **Note**
> This configuration file is specific to one application. If you have multiple
> applications inside your Git repository (i.e. a RESTful
> web service and a front-end, or a main web site and a blog), you need 
> one `.platform.app.yaml` at the root of each application 
> [see here](/platform-app-yaml-multi-app.html).  

### Name

The `name` is the unique identifier of the application. Platform.sh
supports multiple applications within a project, so each application
must have a **unique name** within a project. The name may only be
composed of lower case alpha-numeric characters. (a-z0-9).  *Be advised
that changing the `name` of your app after it's been deployed will
destroy all storage volumes, and thus is typically a Very Bad Thing to do.*
It could be useful under certain circumstances in the early stages
of development but you almost certainly don't want to change it on 
a live project.

This name is used in the `.platform/routes.yaml` file to define the HTTP upstream
(by default `php:http` - if you called your application `app` you will
need to use `app:http` in the upstream field).

You can also use this name in multi-application relationships.

> **Note**
> Changing the name of an app is the same as deleting it and replacing
> it: your app data (static files) will be deleted.
>
> If you change the name you should think about updating your other
> configuration files: `.platform/routes.yaml` and any other
> `.platform.app.yaml` files you have in a multi-application project.

### Type

The `type` defines what language will run your application.

The `type` can be:

* `php`
* `nodejs`
* `hhvm`

**Example**

    type: php:5.6

### Build

The `build` defines what will happen by default when building the application. 

It has a sub property `flavor` for which the possible values are:

* `drupal` means that `drush make` will automatically run if you provide `.make` files.
* `composer` means that `composer install` will automatically run if you provide a `composer.json` or `composer.lock` file.
* `symfony` is an alisas for `composer`.

**Example**

    build:
        flavor: composer

### Access

The `access` define the user roles who can log in via SSH to the
environments they have access to.

Possible values are:

* ssh: admin
* ssh: contributor
* ssh: viewer

### Relationships

The `relationships` defines how services are mapped within your
application.

The left-hand side is the name of the relationship as it will be exposed
to the application in the *PLATFORM_RELATIONSHIPS* environment
variable. The right-hand side is in the form
`<service name>:<endpoint name>`. where "service name" comes from the
 `.platform/services.yaml` and  "endpoint name" should be the same as the
 value of "type"  declared in that same file.

> **Note**
> In the first  example above you could very well have something
> like `mycache: "arediscache:redis"` instead of `redis: "redis:redis"` (if in
> `services.yaml` you named your a service of type `redis` with `arediscache`.
> more often than not in our example we simply call a redis service "redis" a
> mysql one "mysql" etc..

*Example*

    relationships:
        database: "mysql:mysql"
        database2: "mysql2:mysql"
        cache: "arediscache:redis"
        search: "searchengine:solr"

> **Note**
> Read the [`services.yaml` documentation](reference/services-yaml.html)
> for a full list of currently supported service types and service endpoints.

### Web

The `web` key defines how the application is exposed to the web (in HTTP). Here we tell the web application how to serve content, including static files, front-controller scripts, index files, index scripts, and so on. We support any directory structure, so the static files can be in a subdirectory, and the `index.php` file can be further down.

> **Note**
> Gzip compression is enabled only for serving precompressed static files with the ".gz" filename extension.
> However, dynamic content is not automatically compressed due to a [well known security issue](https://en.wikipedia.org/wiki/BREACH_%28security_exploit%29).

It has the following subkeys:

#### Commands

The `commands` key defines the command to launch the application.

It has a few subkeys which are:

* `start`: The command line to use to launch the application. Can be a string, or *null* if the application is only made of static files. It's filled out during the build process for PHP.

*Example*

    web:
        commands:
            start: "uwsgi --ini conf/server.ini"

#### Locations

The `locations` key allows you to provide specific parameters for different URL prefixes. Each entry's key is an absolute URI path (with leading `/`), and its value is configuration directives for that path.  That is, if your domain is `example.com` then `"/"` means "requests for `example.com/`", while `"/admin"` means "requests for `example.com/admin`".

*Example*

    web:
        locations:
            "/":
                ...
            "/sites/default/files":
                ...

It has a few subkeys, which are:

* `root`: (Required) The folder from which to serve static assets for this location, relative to the application root. The application root is the directory in which the `.platform.app.yaml` file is located.  Typical values for this property include `public` or `web`.  Setting it to `""` is not recommended, and its behavior may vary depending on the type of application.  Absolute paths are not supported.
* `passthru`: Whether to forward disallowed and missing resources from this location to the application. Can be true, false or an absolute URI path (with leading `/`), the default value is false. For non-PHP applications it will generally be just true or false.  In a PHP application, this will typically be the front controller such as `/index.php` or `/app.php`.  This entry works similar to `mod_rewrite` under Apache.  Note: if the value of `passthru` does not begin with the same value as the location key it is under the passthru may evaluate to another entry. That may be useful when you want different cache settings for different paths, for instance, but want missing files in all of them to map back to the same front controller.  See the example block below.
* `index`: The file or files to consider when serving a request for a directory. Can be file name, an array of file names, or *null*. Typically `index.html`. Note that in order for this to work, access to the static file(s) named must be allowed (by the `allow` or `rules` keys for this location).
* `expires`: How long to allow static assets from this location to be cached (this enables the `Cache-Control` and `Expires` headers). Can be a time or *-1* for no caching. Times can be suffixed with "ms" (milliseconds), "s" (seconds), "m" (minutes), "h" (hours), "d" (days), "w" (weeks), "M" (months, 30d) or "y" (years, 365d). The `expires` directive and resulting headers are left out entirely if this isn't set.
* `scripts`: Whether to allow loading scripts in that location (*true* or *false*).
* `allow`: Whether to allow serving files which don't match a rule (*true* or *false*, default: *true*).
* `rules`: Specific overrides for a specific location. The key is a PCRE regular expression that is matched against the full request path. Here is a list of example regular expressions that you could provide rules for: *\\.css$,\\.js$,\\.gif$,\\.jpe?g$,\\.png$,\\.tiff?$,\\.wbmp$,\\.ico$,\\.jng$,\\.bmp$,\\.svgz?$,\\.midi?$,\\.mpe?ga$,\\.mp2$,\\.mp3$,\\.m4a$,\\.ra$,\\.weba$,\\.3gpp?$,\\.mp4$,\\.mpe?g$,\\.mpe$,\\.ogv$,\\.mov$,\\.webm$,\\.flv$,\\.mng$,\\.asx$,\\.asf$,\\.wmv$,\\.avi$,\\.ogx$,\\.swf$,\\.jar$,\\.ttf$,\\.eot$,\\.woff$,\\.otf$,/robots\\.txt$*.

*Example*

    web:
        locations:
            "/":
                root: "public"
                passthru: "/index.php"
                index: 
                    - index.php
                expires: -1
                scripts: true
                allow: true
                rules:
                    \.mp4$:
                        allow: false
                        expires: -1
            # Set a 5 min expiration time for static files here; a missing URL
            # will passthru to the "/" location above, and hit the application
            # front-controller.
            "/sites/default/files":
                expires: 300
                passthru: true
                allow: true

### Disk

The `disk` defines the size of the persistent disk of the
application in MB.

> **Note**
> The minimum recommended disk size is 256MB. If you see the error `UserError: Error building the project: Disk size may not be smaller than 128MB`, increase the size to 256MB.


### Mounts

The `mounts` is an object whose keys are paths relative to the root of
the application (That is, where the `.platform.app.yaml` file lives). It's in the form `volume_id[/subpath]`.
At this time, the only legal `volume_id` is `shared:files`.

For example with Drupal, you'll want your `sites/default/files` to be
mounted under a shared resource which is writable.

The format is:

* `"/web/sites/default/files": "shared:files/files"`

> **Note**
> The `shared` means that the volume is shared between your applications inside an environment. The `disk` key defines the size available for that `shared` volume.


### Build dependencies

The `dependencies` allow you to specify dependencies that your
application might need during the build process.

Platform.sh supports pulling any dependencies for the following
languages:

* PHP
* Python
* Ruby
* Node.js
* Java (with integrated Maven and Ant support)

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

-   **build**: We run a build hook before your application has been
    packaged. No other services are accessible at this time since the
    application has not been deployed yet.
-   **deploy**: We run a deploy hook after your application has been
    deployed and started. You can access other services at this stage
    (MySQL, Solr, Redis...). However, the disk where the application lives is read-only at this point.

Each hook is executed as a single script, so they will be considered failed
only if the final command in them fails. To cause them to fail on the first
failed command, add `set -e` to the beginning of the hook.

The `home` directory for each hook is the application root. If your scripts
need to be run from the doc root of your application you will need to `cd` to it
first; e.g.: `cd web`.

After a Git push, you can see the results of the `deploy` hook in the
`/var/log/deploy.log` file when logged in to the environment via SSH. It
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
SASS files using Grunt.  (The `|` character tells YAML that the following lines
should be read as a single string, which allows us to run multiple commands or
even use bash syntax for conditionals, as in the second example.)

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
      # Sanitize your database and get rid of sensitive information from Master environment.
      drush -y sql-sanitize --sanitize-email=user_%uid@example.com --sanitize-password=custompassword
    fi
    drush -y updatedb
```

### Crons / Cronjobs

The `crons` is an object describing processes that are triggered on a
schedule.

It has a few subkeys which are:

-   **spec**: The cron specification. For example: `*/20 * * * *`.
-   **cmd**: The command that is executed, for example
    cd public ; drush core-cron\`

The minimum interval between cron runs is 5 minutes, even if specified as less.

## Top level document roots

Platform.sh requires that the document root not be at the root of the project.  It is important for security that
private file mounts not be web-accessible.

* [Past Changes of the configuration format can be found here](reference/upgrade/)
