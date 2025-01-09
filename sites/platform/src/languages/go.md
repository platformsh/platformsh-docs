---
title: "Go"
description: "{{% vendor/name %}} supports building and deploying applications written in Go using Go modules. They're compiled during the Build hook phase, and support both committed dependencies and download-on-demand."
---

{{% composable/disclaimer %}}

{{% description %}}

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like. When you deploy your app, you always get the latest available patches.

<table>
    <thead>
        <tr>
            <th>Grid</th>
            <th>Dedicated Gen 3</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="golang" status="supported" environment="grid" >}}</td>
            <td>{{< image-versions image="golang" status="supported" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="golang" status="supported" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

{{% language-specification type="golang" display_name="Go" %}}

```yaml {configFile="app"}
type: 'golang:<VERSION_NUMBER>'
```

For example:

```yaml {configFile="app"}
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
name: myapp

type: golang:1.14

hooks:
  build: |
    # Modify this line if you want to build differently or use an alternate name for your executable.
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

disk: 1024
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

{{% guides/config-reader-info lang="go" %}}

You can also use the library to read other environment variables.

```go
package main

import (
	_ "github.com/go-sql-driver/mysql"
	psh "github.com/platformsh/gohelper"
	"net/http"
)

func main() {

	p, err := psh.NewPlatformInfo()

	if err != nil {
		panic("Not in a {{% vendor/name %}} Environment.")
	}

	http.HandleFunc("/bar", func(w http.ResponseWriter, r *http.Request) {
		// ...
	})

	http.ListenAndServe(":"+p.Port, nil)
}
```

{{% config-reader %}} [Go configuration reader library](https://github.com/platformsh/config-reader-go/){{% /config-reader %}}

## Project templates

{{% repolist lang="golang" displayName="Go" %}}
