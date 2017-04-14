# Go


Platform.sh supports building and deploying applications written in Go.  They are compiled during the Build hook phase, and support both committed dependencies and download-on-demand.

## Supported versions

* 1.8

To specify a Go container, use the `type` property in your `.platform.app.yaml`.

```yaml
type: 'golang:1.8'
```

## GOPATH

Platform.sh recommends a modified version of the [CloudFlare Hellogpher](https://github.com/cloudflare/hellogopher) Makefile to manage compilation with the GOPATH.  When run on Platform.sh in the build step, the [Makefile](https://github.com/platformsh/platformsh-example-golang/blob/master/Makefile) will download any dependencies not already present in the `vendor` directory, set a fake GOPATH, and build the application.


## Platform.sh variables

Platform.sh exposes relationships and other configuration as [environment variables](/development/variables.md).  To make them easier to access you should use the provided [GoHelper library](https://github.com/platformsh/gohelper).  Most notably, it allows a program to determine at runtime what HTTP port it should listen on and what the credentials are to access [other services](/configuration/services.md).

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

## Running the application

Your compiled Go application will be placed in the bin directory by the Makefile's build command, and named according to the `IMPORT_PATH` specified in the file.  It should be executed by the `web.commands.start` directive in `.platform.app.yaml`.  Should the program terminate for any reason it will be automatically restarted.

```yaml
web:
    upstream:
        socket_family: tcp
        protocol: http

    commands:
        start: |
            ./bin/myapp
          
    locations:
        /:
            allow: false
            passthru: true
```

Note that there will still be an Nginx proxy server sitting in front of your application.  If desired, certain paths may be served directly by Nginx without hitting your application (for static files, primarily) or you may route all requests to the Go application unconditionally, as in the example above.
