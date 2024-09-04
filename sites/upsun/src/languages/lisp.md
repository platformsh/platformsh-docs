---
title: "Lisp"
description: "{{% vendor/name %}} supports building and deploying applications written in Lisp using Common Lisp (the SBCL version) with ASDF and Quick Lisp support. They're compiled during the Build phase, and support both committed dependencies and download-on-demand."
---

{{% composable/disclaimer %}}

{{% description %}}

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like.
When you deploy your app, you always get the latest available patches.

{{< image-versions image="ruby" status="supported" environment="grid" >}}

{{% language-specification type="lisp" display_name="Lisp" %}}

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  <APP_NAME>:
    type: 'lisp:<VERSION_NUMBER>'
```

For example:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'lisp:{{% latest "lisp" %}}'
```

## Assumptions

{{% vendor/name %}} is making assumptions about your application to provide a more streamlined experience. These assumptions are the following:

- Your `.asd` file is named like your system name. For example `example.asd` has `(defsystem example ...)`.

{{% vendor/name %}} will then run `(asdf:make :example)` on your system to build a binary.

If you don't want these assumptions, you can disable this behavior by specifying in your `{{< vendor/configfile "app" >}}`:

```yaml {configFile="app"}
applications:
  myapp:
    type: 'lisp:{{% latest "lisp" %}}'
    build:
      flavor: none
```

## Dependencies

The recommended way to handle Lisp dependencies on {{% vendor/name %}} is using ASDF. Commit a `.asd` file in your repository and the system will automatically download the dependencies using QuickLisp.

## QuickLisp options

If you wish to change the distributions that QuickLisp is using, you can specify those as follows, specifying a distribution name, its URL and, an optional version:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  <APP_NAME>:
    type: 'lisp:<VERSION_NUMBER>'
    runtime:
      quicklisp:
        {{< variable "DISTRIBUTION_NAME" >}}:
          url: "..."
          version: "..."
```

For example:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'lisp:{{% latest "lisp" %}}'
    runtime:
      quicklisp:
        quicklisp:
          url: 'http://beta.quicklisp.org/dist/quicklisp.txt'
          version: '2019-07-11'
```

## Built-in variables

{{% vendor/name %}} exposes relationships and other configuration as [environment variables](../development/variables/_index.md).
To get the `PORT` environment variable (the port on which your web application is supposed to listen):

```lisp
(parse-integer (uiop:getenv "PORT"))
```

## Building and running the application

Assuming `example.lisp` and `example.asd` are present in your repository, the app is automatically built on push.
You can then start it from the `web.commands.start` directive.
Note that the start command _must_ run in the foreground. Should the program terminate for any reason it's automatically restarted. In the example below the app sleeps for a very, very long time. You could also choose to join the thread of your web server, or use other methods to make sure the program doesn't terminate.

The following basic `{{< vendor/configfile "app" >}}` file is sufficient to run most Lisp applications.

```yaml {configFile="app"}
applications:
  myapp:
    type: 'lisp:{{% latest "lisp" %}}'
    web:
      commands:
        start: ./example
      locations:
        /:
          allow: false
          passthru: true
```

Note that a proxy server is still in front of your app.
If desired, certain paths may be served directly by the router without hitting your app (for static files, primarily) or you may route all requests to the Lisp application unconditionally, as in the example above.

## Accessing Services

The services configuration is available in the environment variable `PLATFORM_RELATIONSHIPS`.

To parse them, add the dependencies to your `.asd` file:

```lisp
:depends-on (:jsown :babel :s-base64)
```

The following is an example of accessing a PostgreSQL instance:

```lisp
(defun relationships ()
  (jsown:parse
   (babel:octets-to-string
    (with-input-from-string (in (uiop:getenv "PLATFORM_RELATIONSHIPS"))
      (s-base64:decode-base64-bytes in)))))
```

Given a relationship defined in `{{< vendor/configfile "app" >}}`:

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
applications:
  myapp:
    type: 'lisp:{{% latest "lisp" %}}'
    relationships:
      postgresql:
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  myapp:
    type: 'lisp:{{% latest "lisp" %}}'
    relationships:
      # Please note: Legacy definition of the relationship is still supported:
      # More information: https://docs.platform.sh/create-apps/app-reference/single-runtime-image.html#relationships
      postgresql:
        service: 'postgresql'
        endpoint: 'postgresql'
```

{{< /codetabs >}}


The following would access that relationship, and provide your Lisp program the credentials to connect to a PostgreSQL instance. Add this to your `.asd` file:

```lisp
:depends-on (:postmodern)
```

Then in your program you could access the PostgreSQL instance as follows:

```lisp
(defvar *pg-spec* nil)

(defun setup-postgresql ()
  (let* ((pg-relationship (first (jsown:val (relationships) "postgresql")))
         (database (jsown:val pg-relationship "path"))
         (username (jsown:val pg-relationship "username"))
         (password (jsown:val pg-relationship "password"))
         (host (jsown:val pg-relationship "host")))
    (setf *pg-spec*
      (list database username password host)))
  (postmodern:with-connection *pg-spec*
    (unless (member "example_table" (postmodern:list-tables t) :test #'string=)
      (postmodern:execute "create table example_table (
    a_field TEXT NOT NULL UNIQUE,
    another_field TEXT NOT NULL UNIQUE
"))))
```

## Example

The following is a basic example of a Hunchentoot-based web app
(you can find the corresponding `.asd` and {{% vendor/name %}} `.yaml` files in the example):

```lisp
(defpackage #:example
  (:use :hunchentoot :cl-who :cl)
  (:export main))

(in-package #:example)

(define-easy-handler (greet :uri "/hello") (name)
  (with-html-output-to-string (s) (htm (:body (:h1 "hello, " (str name))))))

(defun main ()
  (let ((acceptor (make-instance
                   'easy-acceptor
                   :port (parse-integer (uiop:getenv "PORT")))))
    (start acceptor)
    (sleep most-positive-fixnum)))
```

Notice how it gets the `PORT` from the environment and how it sleeps at the end,
as `(start acceptor)` immediately yields and {{% vendor/name %}} requires apps to run in the foreground.


{{< repolist lang="lisp" displayName="Lisp" >}}

