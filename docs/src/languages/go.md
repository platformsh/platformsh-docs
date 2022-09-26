---
title: "Go"
description: Platform.sh supports building and deploying applications written in Go using Go modules. They're compiled during the Build hook phase, and support both committed dependencies and download-on-demand.
---

{{% description %}}

## Supported versions

| Grid and {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|----------------------------------------|------------------------------ |
|  {{< image-versions image="golang" status="supported" environment="grid" >}} | {{< image-versions image="golang" status="supported" environment="dedicated-gen-2" >}} |

{{% image-versions-legacy "golang" %}}

{{% language-specification type="golang" display_name="Go" %}}

{{% deprecated-versions %}}

{{< image-versions image="golang" status="deprecated" >}}

## Go modules

The recommended way to handle Go dependencies on Platform.sh is using Go module support in Go 1.11 and later. That allows the build process to use `go build` directly without any extra steps, and you can specify an output executable file of your choice. (See the examples below.)

## Building and running the application

Assuming your `go.mod` and `go.sum` files are present in your repository, your application can be built with the command `go build`, to produce a working executable. You can then start it from the `web.commands.start` directive. Note that the start command _must_ run in the foreground. If the program terminates for any reason it is automatically restarted.

The following basic `.platform.app.yaml` file is sufficient to run most Go applications.

```yaml
name: app

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
            # If you want some files served directly by the web server without hitting Go, see
            # https://docs.platform.../create-apps/app-reference.html
            allow: false
            passthru: true

disk: 1024
```

Note that there is still an Nginx proxy server sitting in front of your application. If desired, certain paths may be served directly by Nginx without hitting your application (for static files, primarily) or you may route all requests to the Go application unconditionally, as in the example above.

## Accessing services

To access various [services](../add-services/_index.md) with Go, see the following examples. The individual service pages have more information on configuring each service.

{{< codetabs >}}

---
title=Memcached
file=static/files/fetch/examples/golang/memcached
highlight=go
markdownify=false
---

<--->

---
title=MongoDB
file=static/files/fetch/examples/golang/mongodb
highlight=golang
markdownify=false
---

<--->

---
title=MySQL
file=static/files/fetch/examples/golang/mysql
highlight=golang
markdownify=false
---

<--->

---
title=PostgreSQL
file=static/files/fetch/examples/golang/postgresql
highlight=golang
markdownify=false
---

<--->

---
title=RabbitMQ
file=static/files/fetch/examples/golang/rabbitmq
highlight=golang
markdownify=false
---

<--->

---
title=Solr
file=static/files/fetch/examples/golang/solr
highlight=golang
markdownify=false
---

{{< /codetabs >}}


{{% config-reader %}}
[Config Reader library](https://github.com/platformsh/config-reader-go)
{{% /config-reader%}}

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
		panic("Not in a Platform.sh Environment.")
	}

	http.HandleFunc("/bar", func(w http.ResponseWriter, r *http.Request) {
		// ...
	})

	http.ListenAndServe(":"+p.Port, nil)
}
```

## Project templates

{{< repolist lang="golang" displayName="Go" >}}
