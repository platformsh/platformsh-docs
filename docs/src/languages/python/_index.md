---
title: "Python"
description: Get started creating Python apps on Platform.sh.
---

Python is a general purpose scripting language often used in web development.
You can deploy Python apps on Platform.sh using a server or a project such as [uWSGI](https://uwsgi-docs.readthedocs.io/en/latest/).

## Supported versions

| Grid and {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|----------------------------------------|------------------------------ |
|  {{< image-versions image="python" status="supported" environment="grid" >}} | {{< image-versions image="python" status="supported" environment="dedicated-gen-2" >}} |

{{% image-versions-legacy "python" %}}

{{% language-specification type="python" display_name="Python" %}}

## Usage example

### Run your own server

You can define any server to handle requests.
Once you have it configured, add the following configuration to get it running on Platform.sh:

1. Specify one of the [supported versions](#supported-versions):

    {{< readFile file="/registry/images/examples/full/python.app.yaml" highlight="yaml" location=".platform.app.yaml" >}}

2. Install the requirements for your app.
   {{% pipenv %}}

3. Define the command to start your web server:

   ```yaml {location=".platform.app.yaml"}
   web:
       # Start your app with the configuration you define
       # You can replace the file location with your location
       commands:
           start: python server.py
   ```

### Use uWSGI

You can also use [uWSGI](https://uwsgi-docs.readthedocs.io/en/latest/) to manage your server.
Follow these steps to get your server started.

1. Specify one of the [supported versions](#supported-versions):

    {{< readFile file="/registry/images/examples/full/python.app.yaml" highlight="yaml" location=".platform.app.yaml" >}}

2. Define the conditions for your web server:

   ```yaml {location=".platform.app.yaml"}
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

3. Create configuration for uWSGI such as the following:

   ```ini {location="config/uwsgi.ini"}
   [uwsgi]
    # UNIX socket to use to talk with the web server
    # Uses the variable defined in the configuration in step 2
    socket = $(SOCKET)
    protocol = http

    # the entry point to your app
    wsgi-file = app.py
   ```

   Replace `app.py` with whatever your file is.

4. Install the requirements for your app.
   {{% pipenv %}}

5. Define the entry point in your app:

   ```python
   # You can name the function differently and pass the new name as a flag
   # start: "uwsgi --ini conf/uwsgi.ini --callable <NAME>"
   def application(env, start_response):

       start_response('200 OK', [('Content-Type', 'text/html')])
       return [b"Hello world from Platform.sh"]
   ```

## Package management

Your app container comes with pip pre-installed.
To add global dependencies (packages available as commands),
add them to the `dependencies` in your [app configuration](../../create-apps/app-reference.md#dependencies):

```yaml {location=".platform.app.yaml"}
dependencies:
    python3:
        <PACKAGE_NAME>: <PACKAGE_VERSION>
```

{{% pipenv %}}

## Connect to services

The following examples show how to access various [services](../../add-services/_index.md) with Python.
For more information on configuring a given service, see the page for that service.

{{< codetabs >}}

---
title=Elasticsearch
file=static/files/fetch/examples/python/elasticsearch
highlight=python
markdownify=false
---

<--->

---
title=Kafka
file=static/files/fetch/examples/python/kafka
highlight=python
markdownify=false
---

<--->

---
title=Memcached
file=static/files/fetch/examples/python/memcached
highlight=python
markdownify=false
---

<--->

---
title=MongoDB
file=static/files/fetch/examples/python/mongodb
highlight=python
markdownify=false
---

<--->

---
title=MySQL
file=static/files/fetch/examples/python/mysql
highlight=python
markdownify=false
---

<--->

---
title=PostgreSQL
file=static/files/fetch/examples/python/postgresql
highlight=python
markdownify=false
---

<--->

---
title=RabbitMQ
file=static/files/fetch/examples/python/rabbitmq
highlight=python
markdownify=false
---

<--->

---
title=Redis
file=static/files/fetch/examples/python/redis
highlight=python
markdownify=false
---

<--->

---
title=Solr
file=static/files/fetch/examples/python/solr
highlight=python
markdownify=false
---

{{< /codetabs >}}


{{% config-reader %}}
[`platformshconfig` library](https://github.com/platformsh/config-reader-python)
{{% /config-reader%}}

## Project templates

{{< repolist lang="python" displayName="Python" >}}
