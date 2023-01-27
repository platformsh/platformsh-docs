---
title: Web servers
weight: -90
description: |
    Just like the `build` and `deploy` hooks, how you start your applications is completely customizable for ASGI and WSGI servers.
---

The Python ecosystem offers a number of web servers that can be used to deploy to Platform.sh.
The examples below assume the deployment of the Django project `myapp`, but the configuration can be applied to most other frameworks.
They assume a `myapp/wsgi.py` or `myapp/asgi.py` are present with the application callable `application` defined.

## Gunicorn

[Gunicorn](https://docs.gunicorn.org/) ‘Green Unicorn’ is a Python WSGI HTTP Server for UNIX. It’s a pre-fork worker model ported from Ruby’s Unicorn project. The Gunicorn server is broadly compatible with various web frameworks, simply implemented, light on server resource usage, and fairly speedy.

{{% guides/sockets server="Gunicorn" %}}

{{< codetabs >}}
+++
title=Pip (TCP)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Pip (Unix)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Pipenv (TCP)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Pipenv (Unix)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Poetry (TCP)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Poetry (Unix)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
{{< /codetabs >}}

The examples above define four worker processes with `-w 4`.
Consult the [Gunicorn documentation](https://docs.gunicorn.org/en/stable/faq.html#worker-processes) for more details on tuning this parameter.
Workers can also be defined with a custom [worker class](https://docs.gunicorn.org/en/latest/settings.html#worker-class) like [Uvicorn](https://www.uvicorn.org/#running-with-gunicorn), [Gevent](http://www.gevent.org/), or [Tornado](http://www.tornadoweb.org/) for production.

```yaml {location=".platform.app.yaml - Pip (Unix)"}
web:
    upstream:
        socket_family: unix
    commands:
        start: "gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b unix:$SOCKET myapp.wsgi:application"
```

Include the appropriate worker class for your application within this start command.

## Daphne

[Daphne](https://github.com/django/daphne) is a HTTP, HTTP2 and WebSocket protocol server for ASGI and ASGI-HTTP, developed to power Django Channels.

{{% guides/sockets server="Daphne" %}}

{{< codetabs >}}
+++
title=Pip (TCP)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Pip (Unix)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
web:
    commands:
        start: "daphne -u $SOCKET myapp.asgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
<--->
+++
title=Pipenv (TCP)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Pipenv (Unix)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
web:
    commands:
        start: "pipenv run daphne -u $SOCKET myapp.asgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
<--->
+++
title=Poetry (TCP)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Poetry (Unix)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
web:
    commands:
        start: "poetry run -u $SOCKET myapp.asgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true
{{< /codetabs >}}

## Uvicorn

[Uvicorn](https://www.uvicorn.org/) is an ASGI web server implementation for Python.

{{% guides/sockets server="Uvicorn" %}}

{{< codetabs >}}
+++
title=Pip (TCP)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Pip (Unix)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Pipenv (TCP)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Pipenv (Unix)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Poetry (TCP)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Poetry (Unix)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
{{< /codetabs >}}

The examples above define four worker processes with `-w 4`.
Consult the [Uvicorn documentation](https://www.uvicorn.org/settings/#timeouts) for more detailed production recommendations for tuning this and other flags. You can also export the `WEB_CONCURRENCY` variable in place of the `--workers` flag, which defaults to `1`. See [how to set variables](/development/variables/set-variables) for more information.

## Hypercorn

[Hypercorn](https://hypercorn.readthedocs.io/) is an ASGI and WSGI web server based on the sans-io hyper, h11, h2, and wsproto libraries and inspired by Gunicorn.

{{% guides/sockets server="Hypercorn" %}}

{{< codetabs >}}
+++
title=Pip (TCP)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Pip (Unix)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Pipenv (TCP)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Pipenv (Unix)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Poetry (TCP)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
<--->
+++
title=Poetry (Unix)
file=none
highlight=yaml
+++
# The configuration of the application when it is exposed to the web.
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
{{< /codetabs >}}

The examples above define four worker processes with `-w 4`.
Consult the [Hypercorn documentation](https://hypercorn.readthedocs.io/en/latest/how_to_guides/configuring.html) for more details on tuning this and other parameters.
Workers can also be defined with a custom [worker class](https://hypercorn.readthedocs.io/en/latest/how_to_guides/configuring.html#configuration-options) like Asyncio, Uvloop, and Trio for production.

```yaml {location=".platform.app.yaml - Pip (Unix)"}
web:
    upstream:
        socket_family: unix
    commands:
        start: "hypercorn myapp.asgi:application -b unix:$SOCKET -w 4 -k asyncio"
```

Include the appropriate worker class for your application within this start command.