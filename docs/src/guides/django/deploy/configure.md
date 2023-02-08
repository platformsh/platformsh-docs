---
title: "Configure Django for Platform.sh"
sidebarTitle: "Configure"
weight: -100
toc: false
description: |
    Review the basics of what makes up a Platform.sh project, including its three principle configuration files and how to define them for Django.
---

{{% guides/config-desc name="Django" %}}

## Requests configuration: `routes.yaml`

{{% guides/config-routes template="django4" name="Django" %}}

## Service configuration: `services.yaml`

{{% guides/config-service name="Django" %}}

Below is an example configuration to make [PostgreSQL](/add-services/postgresql) available for your Django application.

{{% /guides/config-service %}}

{{< readFile file="static/files/fetch/servicesyaml/django4" highlight="yaml" >}}

## Application container: `.platform.app.yaml`

The `.platform.app.yaml file` is the heart of your configuration. It has an [extensive set of options](https://docs.platform.sh/create-apps/app-reference.html) that allow you to configure nearly any aspect of your app. Most of it's explained with comments inline. This file changes over time as you build out your site.

Below are three examples of `.platform.app.yaml` files for Django using Pip, Pipenv, or Poetry to manage dependencies.

{{< codetabs >}}
+++
title=Pip
highlight=yaml
file=/static/files/fetch/appyaml/pip/django4
+++

<--->
+++
title=Pipenv
highlight=yaml
file=/static/files/fetch/appyaml/pipenv/django4
+++

<--->
+++
title=Poetry
highlight=yaml
file=/static/files/fetch/appyaml/poetry/django4
+++

{{< /codetabs >}}

### `web.commands.start`

In each of the application configuration examples above, a start command (`web.commands.start`) is defined for an application using `gunicorn` WSGI (Web Server Gateway Interface) and Unix sockets.

{{< codetabs >}}

+++
title=Pip
highlight=yaml
markdownify=false
+++
##########################
# Web configuration

# The configuration of the application when it's exposed to the web.
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

##########################
<--->

+++
title=Pipenv
highlight=yaml
markdownify=false
+++
##########################
# Web configuration

# The configuration of the application when it's exposed to the web.
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

##########################
<--->

+++
title=Poetry
highlight=yaml
markdownify=false
+++
##########################
# Web configuration

# The configuration of the application when it's exposed to the web.
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

##########################
{{< /codetabs >}}


If you are using a different web server, update this line, and consult the [web server portion of this section](/languages/python/server) for examples of how to do so.

If following this example exactly, be sure to update the WSGI application Gunicorn calls, which in this case assumes a main `myapp/wsgi.py` present in the repository with a callable `application` defined.

{{< guide-buttons next="Customize Django" >}}
