---
title: "Python"
description: Platform.sh supports deploying Python applications. Your application can use WSGI-based (Gunicorn / uWSGI) application server, Tornado, Twisted, or Python 3.5+ asyncio server.
---

{{< description >}}

## Supported

| **Grid** | **Dedicated** |
|----------------------------------|---------------|
|  {{< image-versions image="python" status="supported" environment="grid" >}} | {{< image-versions image="python" status="supported" environment="dedicated" >}} |

## Support libraries

While it is possible to read the environment directly from your application, it is generally easier and more robust to use the [`platformshconfig`](https://github.com/platformsh/config-reader-python) pip library which handles decoding of service credential information for you.

## WSGI-based configuration

In this example, we use Gunicorn to run our WSGI application.  Configure the `.platform.app.yaml` file with a few key settings as listed below, a complete example is included at the end of this section.

1. Specify the language of your application (available versions are listed above):

    {{< readFile file="/registry/images/examples/full/python.app.yaml" highlight="yaml" >}}

2. Build your application with the build hook. Assuming you have your pip dependencies stored in `requirements.txt` and a `setup.py` at the root of your application folder to execute build steps:

   ```yaml
   hooks:
     build: |
       pip install -r requirements.txt
       pip install -e .
       pip install gunicorn
   ```

   These are installed as global dependencies in your environment.

3. Configure the command you use to start serving your application (this must be a foreground-running process) under the `web` section, e.g.:

   ```yaml
   web:
     commands:
       start: "gunicorn -b 0.0.0.0:$PORT project.wsgi:application"
   ```

   This assumes the WSGI file is `project/wsgi.py` and the WSGI application object is named `application` in the WSGI file.

4. Define the web locations your application is using:

   ```yaml
   web:
     locations:
       "/":
         root: ""
         passthru: true
         allow: false
       "/static":
         root: "static/"
         allow: true
   ```

   This configuration asks our web server to handle HTTP requests at "/static" to serve static files stored in `/app/static/` folder while everything else is forwarded to your application server.

5. Create any Read/Write mounts. The root file system is read only.  You must explicitly describe writable mounts.

   ```yaml
   mounts:
       tmp:
           source: local
           source_path: tmp
       logs:
           source: local
           source_path: logs
   ```

   This setting allows your application writing files to `/app/tmp` and have logs stored in `/app/logs`.

Then, set up the routes to your application in `.platform/routes.yaml`.

   ```yaml
   "https://{default}/":
     type: upstream
     upstream: "app:http"
   ```

Here is the complete `.platform.app.yaml` file:

```yaml
name: app
type: python:2.7

web:
  commands:
    start: "gunicorn -b $PORT project.wsgi:application"
  locations:
    "/":
      root: ""
      passthru: true
      allow: false
    "/static":
      root: "static/"
      allow: true

hooks:
  build: |
    pip install -r requirements.txt
    pip install -e .
    pip install gunicorn

mounts:
   tmp:
       source: local
       source_path: tmp
   logs:
       source: local
       source_path: logs

disk: 512
```

## Using the asyncio module

The above Gunicorn based WSGI example can be modified to use the Python 3.5+ asyncio module.

1. Change the `type` to `python:3.6`.
2. Change the start command to use asyncio.

   ```yaml
   web:
     commands:
       start: "gunicorn -b $PORT -k gaiohttp project.wsgi:application"
   ```

3. Add `aiohttp` as pip dependency in your build hook.

   ```yaml
   hooks:
     build: |
       pip install -r requirements.txt
       pip install -e .
       pip install gunicorn aiohttp
   ```

## Accessing services

To access various [services](/configuration/services.html) with Python, see the following examples.  The individual service pages have more information on configuring each service.

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


## Project templates

A number of project templates for Python applications are available on GitHub.  Not all of them are proactively maintained but all can be used as a starting point or reference for building your own website or web application.

{{< repolist lang="python" >}}
