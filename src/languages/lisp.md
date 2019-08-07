# Lisp

Platform.sh supports building and deploying applications written in Lisp using Common Lisp (the SBCL version) with ASDF and Quick Lisp support.  They are compiled during the Build hook phase, and support both committed dependencies and download-on-demand.

## Supported versions

* 1.5

To specify a Lisp container, use the `type` property in your `.platform.app.yaml`.

```yaml
type: 'lisp:1.5'
```

## ASDF dependencies

The recommended way to handle Lisp dependencies on Platform.sh is using ASDF. commit an `.asd` file in your repository and the system will:
{to be completed}

## Platform.sh variables

Platform.sh exposes relationships and other configuration as [environment variables](/development/variables.md). Most notably, it allows a program to determine at runtime what HTTP port it should listen on and what the credentials are to access [other services](/configuration/services.md).

To get the `PORT` environment variable you could:
```lisp
(uiop:getenv "PORT")
```


## Building and running the application

Assuming an `example.lisp` and an `example.asd` files are present in your repository, the application will be automatically built on push.  You can then start it from the `web.commands.start` directive.  Note that the start command _must_ run in the foreground. Should the program terminate for any reason it will be automatically restarted. In the example below we sleep for a very very long time. You could also for example choose to join the thread of your webserver.

The following basic `.platform.app.yaml` file is sufficient to run most Lisp applications.

```yaml
name: app
type: lisp:1.5
web:
    commands:
        start: ./example
    locations:
        /:
            allow: false
            passthru: true
disk: 512
```

Note that there will still be an Nginx proxy server sitting in front of your application.  If desired, certain paths may be served directly by Nginx without hitting your application (for static files, primarily) or you may route all requests to the Lisp application unconditionally, as in the example above.


## Project templates

Platform.sh offers a project templates for Lisp applications using the structure described above.  It can be used as a starting point or reference for building your own website or web application.

[Generic Lisp application](https://github.com/platformsh/template-lisp)
