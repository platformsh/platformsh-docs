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
toolstack: "php:drupal"
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
    deploy: "cd public ; drush -y updatedb"
crons:
    drupal:
        spec: "*/20 * * * *"
        cmd: "cd public ; drush core-cron"
```

> **note**
> The `.platform.app.yaml` is specific to your application. If you have multiple applications inside your Git repository, you need one `.platform.app.yaml` at the root of each application [see here](/reference/platform-app-yaml-multi-app.md).  

------------------------------------------------------------------------

**Name**

The `name` is the unique identifier of the application. Platform.sh
supports multiple applications within a project, so each application
must have a **unique name** within a project. The name may only be 
composed of lower case alpha-numeric characters. (a-z0-9)

------------------------------------------------------------------------

**Toolstack**

The `toolstack` is used to build and run the project. It's in the form
`type[:subtype]`.

Possible values are:

-   php:drupal
-   php:symfony

> ** note ** this is a misnomer that will soon be correcter, for historical reasons, 
> you should use php:symfony for anything that is not drupal.

------------------------------------------------------------------------

**Access**

The `access` define the user roles who can log in via SSH to the
environments they have access to.

Possible values are:

-   ssh: admin
-   ssh: contributor
-   ssh: viewer

------------------------------------------------------------------------

**Relationships**

The `relationships` defines how services are mapped within your
application.

The left-hand side is the name of the relationship as it will be exposed
to the application in the *PLATFORM_RELATIONSHIPS* environment
variable. The right-hand side is in the form
`<service name>:<endpoint name>`.
 where "service name" comes from the `.platform/services.yaml` and  "endpoint name"
  should be the same as the "type" as declared in that same  file.
  **note** so here in the above example you could very well have something like
  `mycache: "redis_cache:redis"`  (if in `services.yaml` you named your redis service
  instead of `redis: "redis:redis"`
 
Example of valid options are:

-   database: "mysql:mysql"
-   my_other_database: "mysql2:mysql"
-   db: "my_redis_cache:redis"
-   search: "search_engine:solr"

>** note ** You should see the [`services.yaml` documentation](reference/services-yaml.md) 
> for a full list of currently supported service types and service endpoints.

------------------------------------------------------------------------

**Web**

The `web` defines how the application is exposed to the web (in HTTP).  Here we tell the web application how to serve content. We tell The front-controller script to non-static requests to an index.php file on the root. We support any directory structure so the can be in a sub directory, and the index.php file can be further down.

It has a few sub-keys which are:

-   **document_root**: The path relative to the root of the application
    that is exposed on the web. Typically `/public` or `/web`.
-   **passthru**: The URL that is used in case of a 404 (*which is the
    equivalent of the rewrite rules in Drupal*). Typically `/index.php`
    or `/app.php`.
-   **whitelist**: A list of files (as regular expressions) that may be
    served.
-   **expires**: The number of seconds whitelisted (static) content
    should be cached by the browswer. This enables the cache-control and
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

------------------------------------------------------------------------

**Disk**

The `disk` defines the size of the persistent disk size of the
application in MB.

> **note**
> The minimal recommended disk size is 256MB. If you see the error **UserError: Error building the project: Disk size may not be smaller than 128MB**, increase the size to 256MB.

------------------------------------------------------------------------

**Mounts**

The `mounts` is an object whose keys are paths relative to the root of
the application. It's in the form `volume_id[/subpath]`.

For example with Drupal, you'll want your `sites/default/files` to be
mounted under a shared resource which is writable.

The format is:

-   "/public/sites/default/files": "shared:files/files"

> **note**
> The `shared` means that the volume is shared between your applications inside an environment. The `disk` key defines the size available for that `shared` volume.

------------------------------------------------------------------------

**Build dependencies**

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
# .platform.app.yaml
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

------------------------------------------------------------------------

**Hooks**

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

After a Git push, you can see the results of the deployment hooks in the
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

------------------------------------------------------------------------

**Crons**

The `crons` is an object describing processes that are triggered on a
schedule.

It has a few sub-keys which are:

-   **spec**: The cron specification. For example: `*/20 * * * *`.
-   **cmd**: The command that is executed, for example
    cd public ; drush core-cron\`


