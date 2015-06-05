# Configuration

## Configure your Application

The configuration files are stored in Git and allow you to easily
interact with Platform.sh. You can define and configure the services you
want to deploy and use, the specific routes you need to serve your
application...

You can find some examples for those configuration files on
[Github](https://github.com/platformsh/platformsh-examples).

Platform.sh exposes a `.platform.app.yaml` file which defines your
application and the way it will be built and deployed on Platform.sh.

```yaml
# .platform.app.yaml
# This file describes an application. You can have multiple applications
# in the same project.

# The name of this app. Must be unique within a project.
name: php

# The toolstack used to build the application.
toolstack: "php:drupal"

# The relationships of the application with services or other applications.
# The left-hand side is the name of the relationship as it will be exposed
# to the application in the PLATFORM_RELATIONSHIPS variable. The right-hand
# side is in the form `<service name>:<endpoint name>`.
relationships:
    database: "mysql:mysql"
    solr: "solr:solr"
    redis: "redis:redis"

# The configuration of app when it is exposed to the web.
web:
    # The public directory of the app, relative to its root.
    document_root: "/"
    # The front-controller script to send non-static requests to.
    passthru: "/index.php"

# The size of the persistent disk of the application (in MB).
disk: 2048

# The mounts that will be performed when the package is deployed.
mounts:
    "/public/sites/default/files": "shared:files/files"
    "/tmp": "shared:files/tmp"
    "/private": "shared:files/private"

# The hooks executed at various points in the lifecycle of the application.
hooks:
    # We run deploy hook after your application has been deployed and started.
    deploy: "cd public ; drush -y updatedb"

# The configuration of scheduled execution.
crons:
    drupal:
        spec: "*/20 * * * *"
        cmd: "cd public ; drush core-cron"
```

> **note**
> The `.platform.app.yaml` is specific to your application. If you have multiple applications inside your Git repository, you need one `.platform.app.yaml` at the root of each application.

------------------------------------------------------------------------

**Name**

The `name` is the unique identifier of the application. Platform.sh
supports multiple applications within a project, so each application
must have a **unique name** within a project.

------------------------------------------------------------------------

**Toolstack**

The `toolstack` is used to build and run the project. It's in the form
`type[:subtype]`.

Possible values are:

-   php:drupal
-   php:symfony

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
to the application in the *PLATFORM\_RELATIONSHIPS* environment
variable. The right-hand side is in the form
`<service name>:<endpoint name>`.

Possible variables are:

-   database: "mysql:mysql"
-   solr: "solr:solr"
-   redis: "redis:redis"

------------------------------------------------------------------------

**Web**

The `web` defines how the application is exposed to the web (in HTTP).

It has a few sub-keys which are:

-   **document\_root**: The path relative to the root of the application
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

## Configure Services

Platform.sh allows you to completely define and configure the topology
and services you want to use on your project.

The topology is stored into a `services.yaml` file which should be added
inside the `.platform` folder at the root of your Git repository.

If you don't have a `.platform` folder, you need to create one:

```bash
$ mkdir .platform
```

Here is an example of a `services.yaml` file:

```yaml
# .platform/services.yaml
mysql:
  type: mysql
  disk: 2048

solr:
  type: solr
  disk: 1024
```

**Available services**

-   mysql
-   solr
-   redis

> **note**
> Platform.sh uses Solr 3.6 by default, but Solr 4.10 is also supported. You can request it by specifying the service type as ``solr:4.10``.

## Configure Routes

Platform.sh allows you to define the routes that will serve your
environments.

A route describes how an incoming URL is going to be processed by
Platform.sh. The routes are stored into a `routes.yaml` file which
should be added inside the `.platform` folder at the root of your Git
repository.

If you don't have a `.platform` folder, you need to create one:

```bash
$ mkdir .platform
```

Here is an example of a `routes.yaml` file:

```yaml
# .platform/routes.yaml
"http://{default}/":
  type: upstream
  upstream: "php:php"
"http://www.{default}/":
  type: redirect
  to: "http://{default}/"
```

## Sending emails

By default only the master enviroment can send emails and there is no
need to additionally configure your web application to enable that. For
the non-master environment this feature can be enabled by using the
Platform CLI.

For example, in case you want to enable sending emails for your
non-master environment use this command:

```bash
platform environment:metadata enable_smtp true
```

Emails from Platform.sh are sent via a Mandrill-based SMTP proxy. Each
Platform.sh project is provisioned as a Mandrill sub-account.

> **note**
> Mandrill subaccounts are capped at 12k emails per month.

> -   Configure outgoing emails via the web UI \<ui\_environment\_settings\>
