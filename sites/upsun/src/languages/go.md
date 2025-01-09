---
title: "Go"
description: "{{% vendor/name %}} supports building and deploying applications written in Go using Go modules. They're compiled during the Build hook phase, and support both committed dependencies and download-on-demand."
---

{{% composable/disclaimer %}}

{{% description %}}

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like.
When you deploy your app, you always get the latest available patches.

{{< image-versions image="golang" status="supported" environment="grid" >}}

{{% language-specification type="golang" display_name="Go" %}}

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  <APP_NAME>:
    type: 'golang:<VERSION_NUMBER>'
```

For example:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'golang:{{% latest "golang" %}}'
```

{{% deprecated-versions %}}

{{< image-versions image="golang" status="deprecated" >}}

## Go toolchain auto download

Even though you select a specific version of Go, starting in Go 1.21, the `go` command will automatically download and use a different toolchain version as requested by the `toolchain` directive in `go.mod`, or the `GOTOOLCHAIN` environmental variable (see [Go Toolchains](https://go.dev/doc/toolchain)).

{{< note >}}

Still, it is important to keep your chosen version of Go updated in your yaml configuration file. This will ensure that you are using the most up to date software for your projects.

{{< /note >}}


## Go modules

The recommended way to handle Go dependencies on {{% vendor/name %}} is using Go module support in Go 1.11 and later. That allows the build process to use `go build` directly without any extra steps, and you can specify an output executable file of your choice. (See the examples below.)

## Building and running the application

Assuming your `go.mod` and `go.sum` files are present in your repository, your application can be built with the command `go build`, to produce a working executable. You can then start it from the `web.commands.start` directive. Note that the start command _must_ run in the foreground. If the program terminates for any reason it is automatically restarted.

The following basic `{{< vendor/configfile "app" >}}` file is sufficient to run most Go applications.

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'golang:{{% latest "golang" %}}'

    hooks:
      build: |
        # Modify this line if you want to build differently or
        # use an alternate name for your executable.
        go build -o bin/app

    web:
      upstream:
        socket_family: tcp
        protocol: http

      commands:
        # If you change the build output in the build hook above, update this line as well.
        start: ./bin/app

      locations:
        /:
          # Route all requests to the Go app, unconditionally.
          allow: false
          passthru: true
```

Note that there is still an Nginx proxy server sitting in front of your application.
If desired, certain paths may be served directly by Nginx without hitting your application (for static files, primarily)
or you may route all requests to the Go application unconditionally, as in the example above.

## Accessing services

To access various [services](../add-services/_index.md) with Go, see the following examples. The individual service pages have more information on configuring each service.

{{< codetabs v2hide="true" >}}

+++
title=Memcached
file=static/files/fetch/examples/golang/memcached
highlight=go
markdownify=false
+++

<--->

+++
title=MongoDB
file=static/files/fetch/examples/golang/mongodb
highlight=golang
markdownify=false
+++

<--->

+++
title=MySQL
file=static/files/fetch/examples/golang/mysql
highlight=golang
markdownify=false
+++

<--->

+++
title=PostgreSQL
file=static/files/fetch/examples/golang/postgresql
highlight=golang
markdownify=false
+++

<--->

+++
title=RabbitMQ
file=static/files/fetch/examples/golang/rabbitmq
highlight=golang
markdownify=false
+++

<--->

+++
title=Solr
file=static/files/fetch/examples/golang/solr
highlight=golang
markdownify=false
+++

{{< /codetabs >}}

{{% access-services version="2" %}}

{{% repolist lang="golang" displayName="Go" %}}
