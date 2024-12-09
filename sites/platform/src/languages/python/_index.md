---
title: "Python"
description: Get started creating Python apps on {{% vendor/name %}}.
layout: single
---

{{% composable/disclaimer %}}

Python is a general purpose scripting language often used in web development.
You can deploy Python apps on {{% vendor/name %}} using a server or a project such as [uWSGI](https://uwsgi-docs.readthedocs.io/en/latest/).

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like. When you deploy your app, you always get the latest available patches.

<table>
    <thead>
        <tr>
            <th>Grid and {{% names/dedicated-gen-3 %}}</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="python" status="supported" environment="grid" >}}</td>
            <td>{{< image-versions image="python" status="supported" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

{{% language-specification type="python" display_name="Python" %}}

```yaml {configFile="app"}
type: 'python:<VERSION_NUMBER>'
```

For example:

```yaml {configFile="app"}
type: 'python:{{% latest "python" %}}'
```

{{% deprecated-versions %}}

{{< image-versions image="python" status="deprecated" >}}

\* This version doesn't receive any updates at all.
You are strongly recommended to upgrade to a supported version.

## Usage example

### Run your own server

You can define any server to handle requests.
Once you have it configured, add the following configuration to get it running on {{% vendor/name %}}:

1.  Specify one of the [supported versions](#supported-versions):
```yaml {configFile="app"}
type: 'python:{{% latest "python" %}}'
```
2.  Install the requirements for your app.
```yaml {configFile="app"}
dependencies:
  python3:
    pipenv: "2022.12.19"

hooks:
  build: |
    set -eu
    pipenv install --system --deploy
```
3.  Define the command to start your web server:

```yaml {configFile="app"}
web:
  # Start your app with the configuration you define
  # You can replace the file location with your location
  commands:
    start: python server.py
```

You can choose from many web servers such as Daphne, Gunicorn, Hypercorn, and Uvicorn.
See more about [running Python web servers](./server.md).

### Use uWSGI

You can also use [uWSGI](https://uwsgi-docs.readthedocs.io/en/latest/) to manage your server.
Follow these steps to get your server started.

1.  Specify one of the [supported versions](#supported-versions):
```yaml {configFile="app"}
type: 'python:{{% latest "python" %}}'
```
2.  Define the conditions for your web server:

```yaml {configFile="app"}
web:
  upstream:
    # Send requests to the app server through a unix socket
    # Its location is defined in the SOCKET environment variable
    socket_family: "unix"

  # Start your app with the configuration you define
  # You can replace the file location with your location
  commands:
    start: "uwsgi --ini conf/uwsgi.ini"

  locations:
    # The folder from which to serve static assets
    "/":
      root: "public"
      passthru: true
      expires: 1h
```
3.  Create configuration for uWSGI such as the following:

    ```ini {location="config/uwsgi.ini"}
    [uwsgi]
    # Unix socket to use to talk with the web server
    # Uses the variable defined in the configuration in step 2
    socket = $(SOCKET)
    protocol = http

    # the entry point to your app
    wsgi-file = app.py
    ```

    Replace `app.py` with whatever your file is.

4.  Install the requirements for your app.
```yaml {configFile="app"}
dependencies:
    python3:
        pipenv: "2022.12.19"

hooks:
    build: |
        set -eu
        pipenv install --system --deploy
```
5.  Define the entry point in your app:

    ```python
    # You can name the function differently and pass the new name as a flag
    # start: "uwsgi --ini conf/uwsgi.ini --callable <NAME>"
    def application(env, start_response):

        start_response('200 OK', [('Content-Type', 'text/html')])
        return [b"Hello world from {{% vendor/name %}}"]
    ```

## Package management

Your app container comes with pip pre-installed.
For more about managing packages with pip, Pipenv, and Poetry,
see how to [manage dependencies](./dependencies.md).

To add global dependencies (packages available as commands),
add them to the `dependencies` in your [app configuration](/create-apps/app-reference/single-runtime-image.md#dependencies):

```yaml {configFile="app"}
dependencies:
    python3:
        {{< variable "PACKAGE_NAME" >}}: {{< variable "PACKAGE_VERSION" >}}
```
For example, to use `pipenv` to manage requirements and a virtual environment, add the following:

```yaml {configFile="app"}
dependencies:
    python3:
        pipenv: "2022.12.19"

hooks:
    build: |
        set -eu
        pipenv install --system --deploy
```
## Connect to services

The following examples show how to access various [services](../../add-services/_index.md) with Python.
For more information on configuring a given service, see the page for that service.

{{< codetabs v2hide="true" >}}

+++
title=Elasticsearch
file=static/files/fetch/examples/python/elasticsearch
highlight=python
markdownify=false
+++

<--->

+++
title=Kafka
file=static/files/fetch/examples/python/kafka
highlight=python
markdownify=false
+++

<--->

+++
title=Memcached
file=static/files/fetch/examples/python/memcached
highlight=python
markdownify=false
+++

<--->

+++
title=MongoDB
file=static/files/fetch/examples/python/mongodb
highlight=python
markdownify=false
+++

<--->

+++
title=MySQL
file=static/files/fetch/examples/python/mysql
highlight=python
markdownify=false
+++

<--->

+++
title=PostgreSQL
file=static/files/fetch/examples/python/postgresql
highlight=python
markdownify=false
+++

<--->

+++
title=RabbitMQ
file=static/files/fetch/examples/python/rabbitmq
highlight=python
markdownify=false
+++

<--->

+++
title=Redis
file=static/files/fetch/examples/python/redis
highlight=python
markdownify=false
+++

<--->

+++
title=Solr
file=static/files/fetch/examples/python/solr
highlight=python
markdownify=false
+++

{{< /codetabs >}}

{{% config-reader %}}
[`platformshconfig` library](https://github.com/platformsh/config-reader-python)
{{% /config-reader%}}

## Sanitizing data

By default, data is inherited automatically by each child environment from its parent.
If you need to sanitize data in preview environments for compliance,
see how to [sanitize databases](../../development/sanitize-db/_index.md).

## Frameworks

All major Python web frameworks can be deployed on {{% vendor/name %}}.
See dedicated guides for deploying and working with them:

- [Django](../../guides/django/_index.md)

## Project templates

{{< repolist lang="python" displayName="Python" >}}
