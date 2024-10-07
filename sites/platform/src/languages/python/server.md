---
title: Web servers
weight: -90
description: See how to start your apps as you wish with ASGI and WSGI servers.
---

{{% composable/disclaimer %}}

The Python ecosystem offers a number of web servers that can be used to deploy to {{% vendor/name %}}.
The following examples deploy a Django project named `myapp`.
They assume a `myapp/wsgi.py` or `myapp/asgi.py` file  with a callable `application`.
Adjust the examples to fit your framework and app.

## Gunicorn

[Gunicorn](https://docs.gunicorn.org/) is a Python WSGI HTTP Server for Unix
that operates on a pre-fork worker model.
The Gunicorn server is broadly compatible with various web frameworks, light on server resource usage, and fast.

{{% python-sockets server="Gunicorn" %}}

{{< codetabs >}}
+++
title=Pip (TCP)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
  commands:
    start: "gunicorn -w 4 -b localhost:$PORT myapp.wsgi:application"
  locations:
    "/":
      passthru: true
    "/static":
      root: "static"
      expires: 1h
      allow: true
{{< /snippet >}}
```
<--->
+++
title=Pip (Unix)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    upstream:
        socket_family: unix
    commands:
        start: "gunicorn -w 4 -b unix:$SOCKET myapp.wsgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Pipenv (TCP)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    commands:
        start: "pipenv run gunicorn -w 4 -b localhost:$PORT myapp.wsgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Pipenv (Unix)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    upstream:
        socket_family: unix
    commands:
        start: "pipenv run gunicorn -w 4 -b unix:$SOCKET myapp.wsgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Poetry (TCP)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    commands:
        start: "poetry run gunicorn -w 4 -b localhost:$PORT myapp.wsgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Poetry (Unix)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    upstream:
        socket_family: unix
    commands:
        start: "poetry run gunicorn -w 4 -b unix:$SOCKET myapp.wsgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
{{< /codetabs >}}

### Gunicorn workers

These examples define four worker processes with `-w 4`.
For more details on what you can configure, see the [Gunicorn documentation](https://docs.gunicorn.org/en/stable/faq.html#worker-processes).

Workers can also be defined with a custom [worker class](https://docs.gunicorn.org/en/latest/settings.html#worker-class),
such as [Uvicorn](https://www.uvicorn.org/#running-with-gunicorn), [gevent](https://www.gevent.org/),
or [Tornado](https://www.tornadoweb.org/).

For example, to add a Uvicorn worker class to the pip example for Unix,
adjust the start command to the following:

```yaml {configFile="app"}
web:
    upstream:
        socket_family: unix
    commands:
        start: "gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b unix:$SOCKET myapp.wsgi:application"
```
## Daphne

[Daphne](https://github.com/django/daphne) is a HTTP, HTTP2 ,and WebSocket protocol server for ASGI and ASGI-HTTP,
developed to power Django Channels.

{{% python-sockets server="Daphne" %}}

{{< codetabs >}}
+++
title=Pip (TCP)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    commands:
        start: "daphne -p $PORT myapp.asgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Pip (Unix)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    upstream:
        socket_family: unix
    commands:
        start: "daphne -u $SOCKET myapp.asgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Pipenv (TCP)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    commands:
        start: "pipenv run daphne -p $PORT myapp.asgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Pipenv (Unix)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    upstream:
        socket_family: unix
    commands:
        start: "pipenv run daphne -u $SOCKET myapp.asgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Poetry (TCP)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    commands:
        start: "poetry run daphne -p $PORT myapp.asgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Poetry (Unix)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    upstream:
        socket_family: unix
    commands:
        start: "poetry run -u $SOCKET myapp.asgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
{{< /codetabs >}}

## Uvicorn

[Uvicorn](https://www.uvicorn.org/) is an ASGI web server implementation for Python.

{{% python-sockets server="Uvicorn" %}}

{{< codetabs >}}
+++
title=Pip (TCP)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    commands:
        start: "uvicorn myapp.asgi:application --port $PORT --workers 4"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Pip (Unix)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    upstream:
        socket_family: unix
    commands:
        start: "uvicorn myapp.asgi:application --uds $SOCKET --workers 4"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Pipenv (TCP)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    commands:
        start: "pipenv run uvicorn myapp.asgi:application --port $PORT --workers 4"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Pipenv (Unix)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    upstream:
        socket_family: unix
    commands:
        start: "pipenv run uvicorn myapp.asgi:application --uds $SOCKET --workers 4"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Poetry (TCP)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    commands:
        start: "poetry run uvicorn myapp.asgi:application --port $PORT --workers 4"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Poetry (Unix)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    upstream:
        socket_family: unix
    commands:
        start: "poetry run uvicorn myapp.asgi:application --uds $SOCKET --workers 4"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
{{< /codetabs >}}

### Uvicorn workers

These examples define four worker processes with `-w 4`.
For more recommendations on this and other settings, see the [Uvicorn documentation](https://www.uvicorn.org/settings/#timeouts).

Instead of the `-w` flag, you can also use the `WEB_CONCURRENCY` variable.
See how to [set variables](../../development/variables/set-variables.md).

## Hypercorn

[Hypercorn](https://hypercorn.readthedocs.io/) is an ASGI and WSGI web server inspired by Gunicorn.

{{% python-sockets server="Hypercorn" %}}

{{< codetabs >}}
+++
title=Pip (TCP)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    commands:
        start: "hypercorn myapp.asgi:application -b localhost:$PORT -w 4"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Pip (Unix)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    upstream:
        socket_family: unix
    commands:
        start: "hypercorn myapp.asgi:application -b unix:$SOCKET -w 4"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Pipenv (TCP)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    commands:
        start: "pipenv run hypercorn myapp.asgi:application -b localhost:$PORT -w 4"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Pipenv (Unix)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    upstream:
        socket_family: unix
    commands:
        start: "pipenv run hypercorn myapp.asgi:application -b unix:$SOCKET -w 4"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Poetry (TCP)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    commands:
        start: "poetry run hypercorn myapp.asgi:application -b localhost:$PORT -w 4"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
<--->
+++
title=Poetry (Unix)
+++
```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'python:{{% latest "python" %}}'
web:
    upstream:
        socket_family: unix
    commands:
        start: "poetry run hypercorn myapp.asgi:application -b unix:$SOCKET -w 4"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /snippet >}}
```
{{< /codetabs >}}

### Hypercorn workers

These examples define four worker processes with `-w 4`.
For more details on what you can configure, see the [Hypercorn documentation](https://hypercorn.readthedocs.io/en/latest/how_to_guides/configuring.html).

Workers can also be defined with a custom [worker class](https://hypercorn.readthedocs.io/en/latest/how_to_guides/configuring.html#configuration-options),
such as Asyncio, Uvloop, or Trio.

For example, to add a Asyncio worker class to the pip example for Unix,
adjust the start command to the following:

```yaml {configFile="app"}
web:
    upstream:
        socket_family: unix
    commands:
        start: "hypercorn myapp.asgi:application -b unix:$SOCKET -w 4 -k asyncio"
```
