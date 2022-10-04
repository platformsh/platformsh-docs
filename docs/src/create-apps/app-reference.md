---
title: "App reference"
weight: 4
description: See all of the options for controlling your apps and how they're built and deployed on Platform.sh.
---

{{% description %}}

For single-app projects, the configuration is all done in a `.platform.app.yaml` file,
usually located at the root of your app folder in your Git repository.
[Multi-app projects](./multi-app.md) can be set up in various ways.

See a [comprehensive example](./_index.md#comprehensive-example) of a configuration in a `.platform.app.yaml` file.
For reference, see a [log of changes to app configuration](./upgrading.md).

## Top-level properties

The following table presents all properties available at the top level of the YAML for the app.
The column _Set in instance?_ defines whether the given property can be overridden within a `web` or `workers` instance.
To override any part of a property, you have to provide the entire property.

| Name               | Type                                                | Required | Set in instance? | Description |
| ------------------ | --------------------------------------------------- | -------- | ---------------- | ----------- |
| `name`             | `string`                                            | Yes      | No               | A unique name for the app. Must be lowercase alphanumeric characters. Changing the name destroys data associated with the app. |
| `type`             | A [type](#types)                                    | Yes      | No               | The base image to use with a specific app language. Format: `runtime:version`. |
| `size`             | A [size](#sizes)                                    |          | Yes              | How much resources to devote to the app. Defaults to `AUTO` in production environments. |
| `relationships`    | A dictionary of [relationships](#relationships)     |          | Yes              | Connections to other services and apps. |
| `disk`             | `integer` or `null`                                 |          | Yes              | The size of the disk space for the app in MB. Minimum value is `128`. Defaults to `null`, meaning no disk is available. See [note on available space](#available-disk-space) |
| `mounts`           | A dictionary of [mounts](#mounts)                   |          | Yes              | Directories that are writable even after the app is built. If set as a local source, `disk` is required. |
| `web`              | A [web instance](#web)                              |          | N/A              | How the web application is served. |
| `workers`          | A [worker instance](#workers)                       |          | N/A              | Alternate copies of the application to run as background processes. |
| `timezone`         | `string`                                            |          | No               | The timezone for crons to run. Format: a [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Defaults to `UTC`, which is the timezone used for all logs no matter the value here. See also [app runtime timezones](./timezone.md) |
| `access`           | An [access dictionary](#access)                     |          | Yes              | Access control for roles accessing app environments. |
| `variables`        | A [variables dictionary](#variables)                |          | Yes              | Variables to control the environment. |
| `firewall`         | A [firewall dictionary](#firewall)                  |          | Yes              | Outbound firewall rules for the application. |
| `build`            | A [build dictionary](#build)                        |          | No               | What happens when the app is built. |
| `dependencies`     | A [dependencies dictionary](#dependencies)          |          | No               | What global dependencies to install before the `build` hook is run. |
| `hooks`            | A [hooks dictionary](#hooks)                        |          | No               | What commands run at different stages in the build and deploy process. |
| `crons`            | A [cron dictionary](#crons)                         |          | No               | Scheduled tasks for the app. |
| `source`           | A [source dictionary](#source)                      |          | No               | Information on the app's source code and operations that can be run on it.  |
| `runtime`          | A [runtime dictionary](#runtime)                    |          | No               | Customizations to your PHP or Lisp runtime. |
| `additional_hosts` | An [additional hosts dictionary](#additional-hosts) |          | Yes              | Maps of hostnames to IP addresses. |

## Root directory

Some of the properties you can define are relative to your app's root directory.
The root defaults to the location of your `.platform.app.yaml` file.
To specify another directory, for example for a [multi-app project](./multi-app.md)),
use the [`source.root` property](#source).

## Types

The `type` defines the base container image used to run the application.
Available languages and their supported versions:

{{< readFile file="src/registry/images/tables/runtimes_supported.md" markdownify="true">}}

### Example configuration

These are used in the format `runtime:version`:

{{< readFile file="src/registry/images/examples/full/php.app.yaml" highlight="yaml" location=".platform.app.yaml" >}}

## Sizes

Resources are distributed across all containers in a project from the total available from your [plan size](../administration/pricing/_index.md).
So if you have more than just a single app, it doesn't get all of the resources available.

By default, resource sizes (CPU and memory) are chosen automatically for an app
based on the plan size and the number of other containers in the cluster.
Most of the time, this automatic sizing is enough.

You can set sizing suggestions for production environments when you know a given container has specific needs.
Such as a worker that doesn't need much and can free up resources for other apps.
To do so, set `size` to one of the following values:

* `S`
* `M`
* `L`
* `XL`
* `2XL`
* `4XL`

The total resources allocated across all apps and services can't exceed what's in your plan.

### Sizes in development environments

Containers in development environments don't follow the `size` specification.
Application containers are set based on the plan's setting for **Environments application size**.
The default is **{{< partial "plans/default-dev-env-size" >}}**, but you can increase it by editing your plan.
(Service containers in development environments are always set to {{< partial "plans/default-dev-env-size" >}} size.)

## Relationships

To access another container within your project, you need to define a relationship to it.

![Relationships Diagram](/images/management-console/relationships.png "0.5")

You can give each relationship any name you want.
This name is used in the `PLATFORM_RELATIONSHIPS` environment variable,
which gives you credentials for accessing the service.

The relationship is specified in the form `service_name:endpoint_name`.
The `service_name` is the name of the service given in the [services configuration](../add-services/_index.md)
or the name of another application in the same project specified as the `name` in that app's configration.

The `endpoint_name` is the exposed functionality of the service to use.
For most services, the endpoint is the same as the service type.
For some services (such as [MariaDB](../add-services/mysql/_index.md#multiple-databases) and [Solr](../add-services/solr.md#solr-6-and-later)),
you can define additional explicit endpoints for multiple databases and cores in the [service's configuration](../add-services/_index.md).

The following example shows a single MySQL service named `mysqldb` offering two databases,
a Redis cache service named `rediscache`, and an Elasticsearch service named `searchserver`.

```yaml {location=".platform.app.yaml"}
relationships:
    database: 'mysqldb:db1'
    database2: 'mysqldb:db2'
    cache: 'rediscache:redis'
    search: 'searchserver:elasticsearch'
```

## Available disk space

The maximum total space available to all applications and services is set by the storage in your plan settings.
When deploying your project, the sum of all `disk` keys defined in app and service configurations
must be *equal or less* than the plan storage size.

So if your _plan storage size_ is 5 GB, you can, for example, assign it in one of the following ways:

* 2 GB to your application, 3 GB to your database
* 1 GB to your application, 4 GB to your database
* 1 GB to your application, 1 GB to your database, 3 GB to your Elasticsearch service

If you exceed the total space available, you receive an error on pushing your code.
You need to either increase your plan's storage or decrease the `disk` values you've assigned.

### Downsize a disk

{{% disk-downsize type="app" %}}

## Mounts

Mounts define directories that are writable after the build is complete.
They aren't available during the build.

```yaml {location=".platform.app.yaml"}
mounts:
    '<DIRECTORY>':
        source: <SOURCE_LOCATION>
        source_path: <SOURCE_PATH_LOCATION>
```

The `<DIRECTORY>` is relative to the [app's root](#root-directory) and represents the path in the app.
If you already have a directory with that name, you get a warning that it isn't accessible after the build.
See how to [troubleshoot the warning](./troubleshoot-mounts.md#overlapping-folders).

| Name          | Type                 | Required | Description |
| ------------- | -------------------- | -------- | ----------- |
| `source`      | `local` or `service` | Yes      | Specifies where the mount is. `local` sources are unique to the app (requires `disk` to be set for the app), while `service` sources can be shared among apps (requires `service` to be set here). |
| `source_path` | `string`             | Yes      | The subdirectory within the mounted disk (the source) where the mount should point. If an empty string is passed, points to the entire directory. |
| `service`     | `string`             |          | The name of the [network storage service](../add-services/network-storage.md). |

Basic example:

```yaml {location=".platform.app.yaml"}
mounts:
    'web/uploads':
        source: local
        source_path: uploads
```

The accessibility to the web of a mounted directory depends on the [`web.locations` configuration](#web).
Files can be all public, all private, or with different rules for different paths and file types.

Note that mounted directories aren't deleted when they're removed from `.platform.app.yaml`.
The files still exist on disk until manually removed.

## Web

Use the `web` key to configure the web server running in front of your app.
Defaults may vary with a different [image `type`](#types).

| Name        | Type                                         | Required                      | Description |
| ----------- | -------------------------------------------- | ----------------------------- | ----------- |
| `commands`  | A [web commands dictionary](#web-commands)   | See [note](#required-command) | The command to launch your app. |
| `upstream`  | An [upstream dictionary](#upstream)          |                               | How the front server connects to your app. |
| `locations` | A [locations dictionary](#locations)         |                               | How the app container responds to incoming requests. |

See some [examples of how to configure what's served](./web/_index.md).

### Web commands

| Name    | Type     | Required                      | Description |
| ------- | -------- | ----------------------------- | ----------- |
| `start` | `string` | See [note](#required-command) | The command to launch your app. If it terminates, it's restarted immediately. |

Example:

```yaml {location=".platform.app.yaml"}
web:
    commands:
        start: 'uwsgi --ini conf/server.ini'
```

This command runs every time your app is restarted, regardless of whether or not new code is deployed.
So it can be useful for things like clearing ephemeral cache.

```yaml {location=".platform.app.yaml"}
web:
    commands:
        start: 'redis-cli -h redis.internal flushall; sleep infinity'
        # For a {{% names/dedicated-gen-2 %}} environment use:
        # start: 'redis-cli flushall ; sleep infinity'
```

{{< note >}}

Never "background" a start process using `&`.
That's interpreted as the command terminating and the supervisor process starts a second copy,
creating an infinite loop until the container crashes.
Just run it as normal and allow the Platform.sh supervisor to manage it.

{{< /note >}}

#### Required command

On all containers other than PHP, the value for `start` should be treated as required.

On PHP containers, it's optional and defaults to starting PHP-FPM
(`/usr/sbin/php-fpm7.0` on PHP7 and `/usr/sbin/php5-fpm` on PHP5).
It can also be set explicitly on a PHP container to run a dedicated process,
such as [React PHP](https://github.com/platformsh-examples/platformsh-example-reactphp)
or [Amp](https://github.com/platformsh-examples/platformsh-example-amphp).

### Upstream

| Name            | Type                | Required | Description |
| --------------- | ------------------- | -------- | ----------- |
| `socket_family` | `tcp` or `unix`     |          | Whether your app listens on a Unix or TCP socket. Defaults to `tcp`. |
| `protocol`      | `http` or `fastcgi` |          | Whether your app receives incoming requests over HTTP or FastCGI. Default varies based on [image `type`](#types). |

For PHP, the defaults are configured for PHP-FPM and shouldn't need adjustment.
For all other containers, the default for `protocol` is `http`.

The following example is the default on non-PHP containers:

```yaml {location=".platform.app.yaml"}
web:
    upstream:
        socket_family: tcp
        protocol: http
```

#### Where to listen

Where to listen depends on your setting for `web.upstream.socket_family` (defaults to `tcp`).

| `socket_family` | Where to listen |
| --------------- | --------------- |
| `tcp`           | The port specified by the [`PORT` environment variable](../development/variables/use-variables.md#use-platformsh-provided-variables) |
| `unix`          | The Unix socket file specified by the [`SOCKET` environment variable](../development/variables/use-variables.md#use-platformsh-provided-variables) |

If your application isn't listening at the same place that the runtime is sending requests,
you see `502 Bad Gateway` errors when you try to connect to your website.

### Locations

Each key in the `locations` dictionary is a path on your site with a leading `/`.
For `example.com`, a `/` matches `example.com/` and `/admin` matches `example.com/admin`.
When multiple keys match an incoming request, the most-specific applies.

The following table presents possible properties for each location:

| Name                | Type                                                 | Default   | Description |
| ------------------- | ---------------------------------------------------- | --------- | ----------- |
| `root`              | `string`                                             |           | The directory to serve static assets for this location relative to the [app's root directory](#root-directory). Must be an actual directory inside the root directory. |
| `passthru`          | `boolean` or  `string`                               | `false`   | Whether to forward disallowed and missing resources from this location to the app. A string is a path with a leading `/` to the controller, such as `/index.php`. |
| `index`             | Array of `string`s or `null`                         |           | Files to consider when serving a request for a directory. When set, requires access to the files through the `allow` or `rules` keys. |
| `expires`           | `string`                                             | `-1`      | How long static assets are cached. The default means no caching. Setting it to a value enables the `Cache-Control` and `Expires` headers. Times can be suffixed with `ms` = milliseconds, `s` = seconds, `m` = minutes, `h` = hours, `d` = days, `w` = weeks, `M` = months/30d, or `y` = years/365d. |
| `allow`             | `boolean`                                            | `true`    | Whether to allow serving files which don't match a rule. |
| `scripts`           | `boolean`                                            |           | Whether to allow scripts to run. Doesn't apply to paths specified in `passthru`. Meaningful only on PHP containers. |
| `headers`           | A headers dictionary                                 |           | Any additional headers to apply to static assets, mapping header names to values. Responses from the app aren't affected. |
| `request_buffering` | A [request buffering dictionary](#request-buffering) | See below | Handling for chunked requests. |
| `rules`             | A [rules dictionary](#rules)                         |           | Specific overrides for specific locations. |

#### Rules

The rules dictionary can override most other keys according to a regular expression.
The key of each item is a regular expression to match paths exactly.
If an incoming request matches the rule, it's handled by the properties under the rule,
overriding any conflicting rules from the rest of the `locations` dictionary.

Each key can set all of the other possible [`locations` properties](#locations).

In the following example, the `allow` key disallows requests for static files anywhere in the site.
This is overridden by a rule that explicitly allows common image file formats.

```yaml {location=".platform.app.yaml"}
web:
    locations:
        '/':
            # Handle dynamic requests
            root: 'public'
            passthru: '/index.php'
            # Disallow static files
            allow: false
            rules:
                # Allow common image files only.
                '\.(jpe?g|png|gif|svgz?|css|js|map|ico|bmp|eot|woff2?|otf|ttf)$':
                    allow: true
```

#### Request buffering

Request buffering is enabled by default to handle chunked requests as most app servers don't support them.
The following table shows the keys in the `request_buffering` dictionary:

| Name               | Type      | Required | Default | Description |
| ------------------ | --------- | -------- | ------- | ----------- |
| `enabled`          | `boolean` | Yes      | `true`  | Whether request buffering is enabled. |
| `max_request_size` | `string`  |          | `250m`  | The maximum size to allow in one request. |

The default configuration would look like this:

```yaml {location=".platform.app.yaml"}
web:
    locations:
        '/':
            passthru: true
            request_buffering:
                enabled: true
                max_request_size: 250m
```

## Workers

Workers are exact copies of the code and compilation output as a `web` instance after a [`build` hook](#hooks).
They use the same container image.

Workers can't accept public requests and so are suitable only for background tasks.
If they exit, they're automatically restarted.

The keys of the `workers` definition are the names of the workers.
You can then define how each worker differs from the `web` instance using the [top-level properties](#top-level-properties).

Each worker can differ from the `web` instance in all properties _except_ for:

* `build` and `dependencies` properties, which must be the same
* `crons` as cron jobs don't run on workers
* `hooks` as the `build` hook must be the same
  and the `deploy` and `post_deploy` hooks don't run on workers.

A worker named `queue` that was small and had a different start command could look like this:

```yaml {location=".platform.app.yaml"}
workers:
    queue:
        size: S
        commands:
            start: |
                ./worker.sh
```

For resource allocation, using workers in your project requires a [{{< partial "plans/multiapp-plan-name" >}} plan or larger](https://platform.sh/pricing/).

## Access

The `access` dictionary has one allowed key:

| Name  | Allowed values                      | Default       | Description |
| ----- | ----------------------------------- | ------------- | ----------- |
| `ssh` | `admin`, `contributor`, or `viewer` | `contributor` | Defines the minimum role required to access app environments via SSH. |

In the following example, only users with `admin` permissions for the given [environment type](../administration/users.md#environment-types)
can access the deployed environment via SSH:

```yaml {location=".platform.app.yaml"}
access:
    ssh: admin
```

## Variables

Platform.sh provides a number of ways to set [variables](../development/variables/_index.md).
Variables set in your app configuration have the lowest precedence,
meaning they're overridden by any conflicting values provided elsewhere.

All variables set in your app configuration must have a prefix.
Some [prefixes have specific meanings](../development/variables/_index.md#variable-prefixes).

Variables with the prefix `env` are available as a separate environment variable.
All other variables are available in the [`$PLATFORM_VARIABLES` environment variable](../development/variables/use-variables.md#use-platformsh-provided-variables).

The following example sets two variables:

* A variable named `env:AUTHOR` with the value `Juan` that's available in the environment as `$AUTHOR`
* A variable named `d8config:system.site:name` with the value `My site rocks`
  that's available in the `$PLATFORM_VARIABLES` environment variable

```yaml {location=".platform.app.yaml"}
variables:
    env:
        AUTHOR: 'Juan'
    d8config:
        "system.site:name": 'My site rocks'
```

You can also define and access more [complex values](../development/variables/use-variables.md#access-complex-values).

## Firewall

{{< premium-features/tiered "Elite and Enterprise" >}}

Set limits in outbound traffic from your app with no impact on inbound requests.

The `outbound` key is required and contains one or more rules.
The rules define what traffic is allowed; anything unspecified is blocked.

Each rule has the following properties where at least one is required and `ips` and `domains` can't be specified together:

| Name      | Type                | Default         | Description |
| --------- | ------------------- | --------------- | ----------- |
| `ips`     | Array of `string`s  | `["0.0.0.0/0"]` | IP addresses in [CIDR notation](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing). See a [CIDR format converter](https://www.ipaddressguide.com/cidr). |
| `domains` | Array of `string`s  |                 | [Fully qualified domain names](https://en.wikipedia.org/wiki/Fully_qualified_domain_name) to specify specific destinations by hostname. |
| `ports`   | Array of `integer`s |                 | Ports from 1 to 65535 that are allowed. If any ports are specified, all unspecified ports are blocked. If no ports are specified, all ports are allowed. Port `25`, the SMTP port for sending email, is always blocked. |

The default settings would look like this:

```yaml {location=".platform.app.yaml"}
firewall:
    outbound:
        - ips: ["0.0.0.0/0"]
```

{{% legacy-regions featureIntro="An outbound firewall" featureShort="a firewall" level=3 %}}

### Support for rules

Where outbound rules for firewalls are supported in all environments.
For {{% names/dedicated-gen-2 %}} projects, contact support for configuration.

### Multiple rules

Multiple firewall rules can be specified.
In such cases, a given outbound request is allowed if it matches _any_ of the defined rules.

So in the following example requests to any IP on port 80 are allowed
and requests to 1.2.3.4 on either port 80 or 443 are allowed:

```yaml {location=".platform.app.yaml"}
firewall:
    outbound:
        - ips: ["1.2.3.4/32"]
          ports: [443]
        - ports: [80]
```

### Outbound traffic to CDNs

Be aware that many services are behind a content delivery network (CDN).
For most CDNs, routing is done via domain name, not IP address,
so thousands of domain names may share the same public IP addresses at the CDN.
If you allow the IP address of a CDN, you are usually allowing many or all of the other customers hosted behind that CDN.

### Outbound traffic by domain

You can filter outbound traffic by domain.
Using domains in your rules rather than IP addresses is generally more specific and secure.
For example, if you use an IP address for a service with a CDN,
you have to allow the IP address for the CDN.
This means that you allow potentially hundreds or thousands of other servers also using the CDN.

An example rule filtering by domain:

```yaml {location=".platform.app.yaml"}
firewall:
  outbound:
    - protocol: tcp
      domains: ["api.stripe.com", "api.twilio.com"]
      ports: [80, 443]
    - protocol: tcp
      ips: ["1.2.3.4/29","2.3.4.5"]
      ports: [22]
```

#### Determine which domains to allow

To determine which domains to include in your filtering rules,
find the domains your site has requested the DNS to resolve.
Run the following command to parse your server’s `dns.log` file
and display all Fully Qualified Domain Names that have been requested:

```bash
awk '/query\[[^P]\]/ { print $6 | "sort -u" }' /var/log/dns.log
```

The output includes all DNS requests that were made, including those blocked by your filtering rules.
It doesn't include any requests made using an IP address.

Example output:

```bash
facebook.com
fastly.com
platform.sh
www.google.com
www.platform.sh
```

## Build

The only property of the `build` dictionary is `flavor`, which specifies a default set of build tasks to run.
Flavors are language-specific.

See what the build flavor is for your language:

* [Node.js](../languages/nodejs/_index.md#dependencies)
* [PHP](../languages/php/_index.md#build-flavor)

In all languages, you can also specify a flavor of `none` to take no action at all
(which is the default for any language other than PHP and Node.js).

```yaml {location=".platform.app.yaml"}
build:
    flavor: none
```

## Dependencies

Installs global dependencies as part of the build process.
They're independent of your app's dependencies
and are available in the `PATH` during the build process and in the runtime environment.
They're installed before the `build` hook runs using a package manager for the language.

| Language | Key name              | Package manager |
| -------- | --------------------- | --------------- |
| PHP      | `php`                 | [Composer](https://getcomposer.org/) |
| Python 2 | `python` or `python2` | [Pip 2](https://packaging.python.org/tutorials/installing-packages/) |
| Python 3 | `python3`             | [Pip 3](https://packaging.python.org/tutorials/installing-packages/) |
| Ruby     | `ruby`                | [Bundler](https://bundler.io/) |
| Node.js  | `nodejs`              | [npm](https://www.npmjs.com/) (see [how to use yarn](../languages/nodejs/_index.md#use-yarn-as-a-package-manager))|
| Java     | `java`                | [Apache Maven](https://maven.apache.org/), [Gradle](https://gradle.org/), or [Apache Ant](https://ant.apache.org/) |

The format for package names and version constraints are defined by the specific package manager.

An example of dependencies in multiple languages:

```yaml {location=".platform.app.yaml"}
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

## Hooks

There are three different hooks that run as part of the process of building and deploying your app.
These are places where you can run custom scripts.
They are: the `build` hook, the `deploy` hook, and the `post_deploy` hook.
Only the `build` hook is run for [worker instances](#workers), while [web instances](#web) run all three.

The process is ordered as:

1. Variables accessible at build time become available.
1. [Build flavor](#build) runs if applicable.
1. Any [dependencies](#dependencies) are installed.
1. The `build` hook is run.
1. The file system is changed to read only (except for any [mounts](#mounts)).
1. The app container starts. Variables accessible at runtime and services become available.
1. The `deploy` hook is run.
1. The app container begins accepting requests.
1. The `post_deploy` hook is run.

Note that if an environment changes by no code changes, only the last step is run.
If you want the entire process to run, see how to [manually trigger builds](../development/troubleshoot.md#manually-trigger-builds).

### Writable directories during build

During the `build` hook, there are three writeable directories:

* `$PLATFORM_APP_DIR`:
  Where your code is checked out and the working directory when the `build` hook starts.
  Becomes the app that gets deployed.
* `$PLATFORM_CACHE_DIR`:
  Persists between builds, but isn't deployed.
  Shared by all builds on all branches.
* `/tmp`:
  Isn't deployed and is wiped between each build.

### Hook failure

Each hook is executed as a single script, so they're considered to have failed only if the final command in them fails.
To cause them to fail on the first failed command, add `set -e` to the beginning of the hook.

If a `build` hook fails for any reason, the build is aborted and the deploy doesn't happen.
Note that this only works for `build` hooks --
if other hooks fail, the app is still deployed.

## Crons

The keys of the `crons` definition are the names of the cron jobs.
The names must be unique.

If an application defines both a `web` instance and `worker` instances, cron jobs run only on the `web` instance.

See how to [get cron logs](../increase-observability/logs/access-logs.md#container-logs).

The following table shows the properties for each job:

| Name               | Type                                         | Required | Description |
| ------------------ | -------------------------------------------- | -------- | ----------- |
| `spec`             | `string`                                     | Yes      | The [cron specification](https://en.wikipedia.org/wiki/Cron#CRON_expression). |
| `commands`         | A [cron commands dictionary](#cron-commands) | Yes      | A definition of what commands to run when starting and stopping the cron job. |
| `shutdown_timeout` | `integer`                                    | No       | When a cron is canceled, this represents the number of seconds after which a `SIGKILL` signal is sent to the process to force terminate it. The default is `10` seconds. |
| `timeout`          | `integer`                                    | No       | The maximum amount of time a cron can run before it's terminated. Defaults to the maximum allowed value of `86400` seconds (24 hours).

### Cron commands

| Name               | Type      | Required | Description |
| ------------------ | --------- | -------- | ----------- |
| `start`            | `string`  | Yes      | The command that's run. It's run in [Dash](https://en.wikipedia.org/wiki/Almquist_shell). |
| `stop`             | `string`  | No       | The command that's issued to give the cron command a chance to shutdown gracefully, such as to finish an active item in a list of tasks. Issued when a cron task is interrupted by a user through the CLI or Console. If not specified, a `SIGTERM` signal is sent to the process. |

```yaml {location=".platform.app.yaml"}
crons:
    mycommand:
        spec: '*/19 * * * *'
        commands:
            start: sleep 60 && echo sleep-60-finished && date
            stop: killall sleep
        shutdown_timeout: 18
```

### Example cron jobs

<!-- vale off -->
{{< codetabs >}}

---
title=Drupal
file=none
highlight=yaml
---

crons:
    # Run Drupal's cron tasks every 19 minutes.
    drupal:
        spec: '*/19 * * * *'
        commands:
            start: 'cd web ; drush core-cron'
    # But also run pending queue tasks every 7 minutes.
    # Use an odd number to avoid running at the same time as the `drupal` cron.
    drush-queue:
        spec: '*/7 * * * *'
        commands:
            start: 'cd web ; drush queue-run aggregator_feeds'

<--->

---
title=Ruby on Rails
file=none
highlight=yaml
---

crons:
    ruby:
        spec: '*/19 * * * *'
        commands:
            start: 'bundle exec rake some:task'

{{< /codetabs >}}
<!-- vale on -->

### Cron job timing

Minimum time between cron jobs being triggered:

| Plan                | Time      |
|-------------------- | --------- |
| Professional        | 5 minutes |
| Elite or Enterprise | 1 minute  |

For each app container, only one cron job can run at a time.
If a new job is triggered while another is running, the new job is paused until the other completes.

To minimize conflicts, a random offset is applied to all triggers.
The offset is a random number of seconds up to 20 minutes or the cron frequency, whichever is smaller.

Crons are also paused while activities such as [backups](../dedicated-gen-2/overview/backups.md) are running.
The crons are queued to run after the other activity finishes.

To run cron jobs in a timezone other than UTC, set the [timezone property](#top-level-properties).

### Paused crons

Development environments are often used for a limited time and then abandoned.
While it's useful for environments under active development to have scheduled tasks,
unused environments don't need to run cron jobs.
To minimize unnecessary resource use,
crons on environments with no deployments are paused.

This affects all environments that aren't live environments.
This means all environments on Development plans
and all non-Production environments on higher plans.

Such environments with deployments within 14 days have crons with the status `running`.
If there haven't been any deployments within 14 days, the status is `paused`.

You can see the status in the Console
or using the CLI by running `platform environment:info` and looking under `deployment_state`.

{{% legacy-regions featureIntro="Paused crons" featureShort="paused crons" plural=true level=4 %}}

#### Restarting paused crons

If the crons on your development environment are paused but you're still using them,
you can push changes to the environment or redeploy it.

To restart crons without changing anything:

{{< codetabs >}}

---
title=In the Console
file=none
highlight=false
---

1. In the Console, navigate to your project.
1. Open the environment where you'd like the crons to run.
1. Click `Redeploy` next to the cron status of `Paused`.

<--->

---
title=Using the CLI
file=none
highlight=false
---

Run the following command (replacing `<PROJECT_ID>` and `<ENVIRONMENT_NAME>` with the values for your project and environment):

```bash
platform redeploy -p <PROJECT_ID> -e <ENVIRONMENT_NAME>
```

{{< /codetabs >}}

## Runtime

The following table presents the various possible modifications to your PHP or Lisp runtime:

| Name                        | Type                                                       | Language | Description |
| --------------------------- | ---------------------------------------------------------- | -------- | ----------- |
| `extensions`                | List of `string`s OR [extensions definitions](#extensions) | PHP      | [PHP extensions](../languages/php/extensions.md) to enable. |
| `disabled_extensions`       | List of `string`s                                          | PHP      | [PHP extensions](../languages/php/extensions.md) to disable. |
| `request_terminate_timeout` | `integer`                                                  | PHP      | The timeout for serving a single request after which the PHP-FPM worker process is killed. |
| `sizing_hints`              | A [sizing hints definition](#sizing-hints)                 | PHP      | The assumptions for setting the number of workers in your PHP-FPM runtime. |
| `xdebug`                    | An Xdebug definition                                       | PHP      | The setting to turn on [Xdebug](../languages/php/xdebug.md). |
| `quicklisp`                 | Distribution definitions                                   | Lisp     | [Distributions for QuickLisp](../languages/lisp.md#quicklisp-options) to use. |

### Extensions

You can enable [PHP extensions](../languages/php/extensions.md) just with a list of extensions:

```yaml {location=".platform.app.yaml"}
runtime:
  extensions:
    - geoip
    - tidy
```

Alternatively, if you need to include configuration options, use a dictionary for that extension:

```yaml {location=".platform.app.yaml"}
runtime:
  extensions:
    - geoip
    - name: blackfire
      configuration:
          server_id: foo
          server_token: bar
```

In this case, the `name` property is required.

### Sizing hints

The following table shows the properties that can be set in `sizing_hints`:

| Name              | Type      | Default | Minimum | Description |
| ----------------- | --------- | ------- | ------- | ----------- |
| `request_memory`  | `integer` | 45      | 10      | The average memory consumed per request in MB. |
| `reserved_memory` | `integer` | 70      | 70      | The amount of memory reserved in MB. |

See more about [PHP-FPM workers and sizing](../languages/php/fpm.md).

## Source

The following table shows the properties that can be set in `source`:

| Name         | Type                     | Required | Description |
| ------------ | ------------------------ | -------- | ----------- |
| `operations` | An operations dictionary |          |  Operations that can be applied to the source code. See [source operations](./source-operations.md) |
| `root`       | `string`                 |          |  The path where the app code lives. Defaults to the directory of the `.platform.app.yaml` file. Useful for [multi-app setups](./multi-app.md). |

## Additional hosts

If you're using a private network with specific IP addresses you need to connect to,
you might want to map those addresses to hostnames to better remember and organize them.
In such cases, you can add a map of those IP addresses to whatever hostnames you like.
Then when your app tries to access the hostname, it's sent to the proper IP address.

So in the following example, if your app tries to access `api.example.com`, it's sent to `192.0.2.23`.

```yaml {location=".platform.app.yaml"}
additional_hosts:
    api.example.com: "192.0.2.23"
    web.example.com: "203.0.113.42"
```

This is equivalent to adding the mapping to the `/etc/hosts` file for the container.
