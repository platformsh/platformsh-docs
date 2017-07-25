# Multiple Applications

Platform.sh supports building multiple applications per project (for example RESTful web services with a front-end, or a main website and a blog).  For resource allocation reasons, however, that is not supported on Standard plan.

## Introduction

### File structure

All of the applications share a common configuration through the files present
in the `.platform/` folder at the root of the Git repository. Then each
application provides its own configuration via the `.platform.app.yaml` file.

![Multi-app](/images/config_diagrams/multi-app.svg)

When you push via Git, Platform.sh will build each application separately. Only
the application(s) that have been modified will be rebuilt.

To create a multi-application setup put each application in its own directory
with a `.platform.app.yaml` file at its root.

For example, if you have a Drupal back end with an AngularJS front end:

```bash
$ ls -a
.git/
.platform/
drupal/
  .platform.app.yaml
  ...
angular/
  .platform.app.yaml
```

## Submodules
Platform.sh supports Git submodules, so each application can be in a separate
repository. This is a powerful feature which allows you to create a `Staging`
server with different versions of each application in a single commit.

However, there is currently a notable limitation: the `.platform.app.yaml`
files must be in the top-level repository. For now, you'll have to implement a
repository layout that looks like this:
```
.git/
.platform/
    routes.yaml
    services.yaml
app1/
    .platform.app.yaml
    app1-submodule/
        index.php
app2/
    .platform.app.yaml
    app2-submodule/
        index.php
```

This puts your applications' files at a different path relative to your
`.platform.app.yaml` files, so you'll also have to update your web
configuration to match. For example, your first application's
`.platform.app.yaml` file would include something like this:
```
web:
    locations:
        "/":
            root: "app1-submodule"
            # Or app1-submodule/path/to/webroot, if appropriate.
            passthru: "/index.php"
```


### Multi-app Routes

If you setup the AngularJS `.platform.app.yaml` with `name: angular`, and the
Drupal one `name: drupal`, you need to configure your `.platform/routes.yaml`
like the following (names need to match):

```yaml
"https://back-end.{default}/":
    type: upstream
    upstream: "drupal:http"
"https://{default}/":
    type: upstream
    upstream: "angular:http"
```

This will result (if we consider we are on the `http://example.com` domain):
* `http://back-end.example.com` being served by the Drupal instance
* `http://example.com/` and all the urls below it to be served by the AngularJS
one.

> **note**
> Subdomain routes in development environments will be accessible using three dashes (---) instead of a dot (.), e.g:
> http://back-end---BRANCH-MACHINE_NAME-PROJECTID-.REGION.platformsh.site

### SSH in each application

You can SSH in any application that is deployed.

If you are not sure how to construct the SSH URL, you can use the generic one
provided by the Platform.sh UI:

```bash
ssh 3bdcrrivykjsm-master@git.eu.platform.sh

The user name '3bdcrrivykjsm-master' resolves to multiple services, use one of
those more specific names:
 - 3bdcrrivykjsm-master--angular
 - 3bdcrrivykjsm-master--drupal
Received disconnect from 54.76.137.151: 14: No more auth methods available
Disconnected from 54.76.137.151
```

## Example of a micro-service multi-app

Here is a more detailed and complete example for a project that is designed with
a *micro-service* architecture.

### Setup

Imagine that our front end (*front*) application depends on two REST services
that both connect to the same PostgreSQL database:
* User API (*user*)
* Content API (*content*)

The *front* does not connect directly to the database but does everything
through these APIs, and it uses Redis as a Cache.

The directory structure may look something like this:

```bash
$ ls -a
.git/
.platform/
  routes.yaml
  services.yaml
user_api/
  .platform.app.yaml
  public/
    index.php
    [...]
content_api/
  .platform.app.yaml
  public/
    index.php
    [...]
front_end/
  .platform.app.yaml
  public/
    index.php
    assets/
    [...]
```

> **note**
> There is no relationship between the directory names and the application
> names, which are defined in the configuration files.

### Routes

In our use case the User API is accessible through a URL like
`https://api.example.com/v1/users`, and the Content API is accessible through
`https://api.example.com/v1/content`.

In this case we are not doing HTTP caching on the two APIs, but we are caching
on the *front* application.

The `.platform/routes.yaml` may look like:

````yaml
"https://api.{default}/v1/users":
    type: upstream
    upstream: "user:http"
    cache:
        enabled: false
"https://api.{default}/v1/content":
    type: upstream
    upstream: "content:http"
    cache:
        enabled: false
"https://{default}/":
    type: upstream
    upstream: "front:http"
    cache:
        enabled: true
```

For the later, we simply tell our router to connect, to a service called `front` and
route HTTP traffic to the application service running there.

> **note**
> The upstream virtually always ends in `':http`, since Platform.sh only supports
> HTTP-based applications exposed to the outside world. See the [Routing](/configuration/routes.md) section

### Services

The `.platform/services.yaml` may look like:

```yaml
commondb:
    type: postgresql:9.3
    disk: 4096
cache:
    type: redis:2.8
```

Here we define two services that could be available to any application in the
project. The keys `commondb` and `cache` are names (need to be alphanumeric with
no special characters) which describe the role theses services will have in the
project. We use these names in each application's `.platform.app.yaml` to link
the service to the application.

The User API `user_api/.platform.app.yaml` will look like the following (only
putting here the relevant parts `[...]` representing the stuff we cut out):

```yaml
name: user
[...]
relationships:
    "database": "commondb:postgresql"
```

The Content API `content_api/.platform.app.yaml` will, in this case, be very
similar:

```yaml
name: content
[...]
relationships:
    "database": "commondb:postgresql"
```

The `commondb` comes from the name we put in `services.yaml`.

The `:postgresql` suffix, which is required, is there because in the future
Platform.sh will support multiple endpoints per service (for services that
support multiple protocols).  See the [Services](/configuration/services.md) section.


> **note**
> The name `database` is freely chosen by us and will be exposed in the
> environment variable `PLATFORM_RELATIONSHIPS` of the application (it can be
different between the different application of the same project).

The *front* `front_end/.platform.app.yaml` will look like:

```yaml
name: front
[...]
relationships:
    "database": "cache:redis"
    "user_service": "user:http"
    "content_service": "content:http"
```

These relationships allow an application to connect to another, and will expose
in its environment variables everything that is needed for it to be used
dynamically in its configuration.

> **note**
> The names `database`, `user_service` and `content_service` are freely chosen
> by us. It's often better to stick to a simple naming scheme.
