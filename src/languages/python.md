# Python

Platform.sh supports deploying Python applications. Your application can use
WSGI-based (Gunicorn / uWSGI) application server, Tornado, Twisted, or Python 3.5+ asyncio server.

## Supported versions

* 2.7
* 3.5

## WSGI-based configuration

In this example, we use Gunicorn to run our WSGI application.
Configure the `.platform.app.yaml` file with a few key settings
as listed below, a complete example is included at the end of this section.

1. Specify the `type` as `python:2.7` (other versions you may use are listed above).
2. Build your application with the build hook.
   Assuming you have your pip dependencies stored in `requirements.txt` and
   a `setup.py` at the root of your application folder to execute build steps:

   ```yaml
   hooks:
     build: |
       pip install -r requirements.txt
       pip install -e .
       pip install gunicorn
   ```

   These are installed as global dependencies in your environment.

3. Configure the command you use to start serving your application (this must
   be a foreground-running process) under the `web` section, e.g.:

   ```yaml
   web:
     commands:
       start: "gunicorn -b $PORT project.wsgi:application"
   ```

   This assumes the WSGI file is `project/wsgi.py` and
   the WSGI application object is named `application` in the WSGI file.

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

   This configuration asks our web server to handle HTTP requests at "/static"
   to serve static files stored in `/app/static/` folder
   while everything else is forwarded to your application server.

5. Create any Read/Write mounts. The root file system is read only.
   You must explicitly describe writable mounts.

   ```yaml
   mounts:
     "/tmp": "shared:files/tmp"
     "/logs": "shared:files/logs"
   ```

   This setting allows your application writing files to `/app/tmp` and
   have logs stored in `/app/logs`.

Then, set up the routes to your application in `.platform/routes.yaml`.

   ```yaml
   "http://{default}/":
     type: upstream
     upstream: "app:http"

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
  "/tmp": "shared:files/tmp"
  "/logs": "shared:files/logs"

disk: 512
```

## Using the asyncio module

The above Gunicorn based WSGI example can be modified to
use the Python 3.5+ asyncio module.

1. Change the `type` to `python:3.5`.
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

## Connecting to services

You can [define services](configuration/services.md) in your environment.
And, link to the services using `.platform.app.yaml`:

```yaml
relationships:
    database: "mysqldb:mysql"
```

By using the following Python function calls, you can obtain the
database details.

```python
import base64
import json
import os

# Use str(base64.b64decode()) for py3k compatibility.
relationships = os.environ['PLATFORM_RELATIONSHIPS']
relationships = json.loads(str(base64.b64decode(relationships), 'utf-8'))

# Sample content of relationships['database']:
# [{
#   'scheme': 'mysql',
#   'host': 'database.internal',
#   'ip': '246.0.81.164'
#   'port': 3306,
#   'path': 'main',
#   'username': 'main',
#   'password': 'main',
#   'query': {'is_master': True},
# }]
```
