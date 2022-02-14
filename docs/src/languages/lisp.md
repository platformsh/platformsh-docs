---
title: "Lisp"
description: Platform.sh supports building and deploying applications written in Lisp using Common Lisp (the SBCL version) with ASDF and Quick Lisp support.  They are compiled during the Build phase, and support both committed dependencies and download-on-demand.
---

{{< description >}}

## Supported versions

| **Grid** | **Dedicated** |
|----------------------------------|---------------|
|  {{< image-versions image="lisp" status="supported" environment="grid" >}} | {{< image-versions image="lisp" status="supported" environment="dedicated" >}} |

To specify a Lisp container, use the `type` property in your `.platform.app.yaml`.

{{< readFile file="src/registry/images/examples/full/lisp.app.yaml" highlight="yaml">}}

## Assumptions

Platform.sh is making assumptions about your application to provide a more streamlined experience. These assumptions are the following:

- Your `.asd` file is named like your system name. E.g. `example.asd` will have `(defsystem example ...)`.

Platform.sh will then run `(asdf:make :example)` on your system to build a binary.

If you don't want these assumptions, you can disable this behavior by specifying in your `.platform.app.yaml`:

```yaml
build:
    flavor: none
```

## Dependencies

The recommended way to handle Lisp dependencies on Platform.sh is using ASDF. Commit a `.asd` file in your repository and the system will automatically download the dependencies using QuickLisp.

## QuickLisp options

If you wish to change the distributions that QuickLisp is using, you can specify those as follows, specifying a distribution name, its URL and, an optional version:

```yaml
runtime:
    quicklisp:
        <distribution name>:
            url: "..."
            version: "..."
```

For example:

```yaml
runtime:
    quicklisp:
        quicklisp:
            url: 'http://beta.quicklisp.org/dist/quicklisp.txt'
            version: '2019-07-11'
```


## Platform.sh variables

Platform.sh exposes relationships and other configuration as [environment variables](../development/variables/_index.md).
Most notably, it allows a program to determine at runtime what HTTP port it should listen on
and what the credentials are to access [other services](../configuration/services/_index.md).

To get the `PORT` environment variable (the port on which your web application is supposed to listen) you would:

```lisp
(parse-integer (uiop:getenv "PORT"))
```


## Building and running the application

Assuming `example.lisp` and `example.asd` are present in your repository, the application will be automatically built on push.  You can then start it from the `web.commands.start` directive.  Note that the start command _must_ run in the foreground. Should the program terminate for any reason it will be automatically restarted. In the example below we sleep for a very, very long time. You could also choose to join the thread of your web server, or use other methods to make sure the program does not terminate.

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

Note that there will still be a proxy server in front of your application.  If desired, certain paths may be served directly by our router without hitting your application (for static files, primarily) or you may route all requests to the Lisp application unconditionally, as in the example above.

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

Given a relationship defined in `.platform.app.yaml`:

```yaml
relationships:
    pg: postgresql:postgresql
```

The following would access that relationship, and provide your Lisp program the credentials to connect to a PostgreSQL instance. Add this to your `.asd` file:

```lisp
:depends-on (:postmodern)
```

Then in your program you could access the PostgreSQL instance as follows:

```lisp
(defvar *pg-spec* nil)

(defun setup-postgresql ()
  (let* ((pg-relationship (first (jsown:val (relationships) "pg")))
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

## Project templates

Platform.sh offers a project template for Lisp applications using the structure described above.  It can be used as a starting point or reference for building your own website or web application.

The following is a simple example of a Hunchentoot based web application (you can find the corresponding `.asd` and Platform.sh `.yaml` files in the linked Github repository):

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
Notice how we get the `PORT` from the environment, and how we sleep at the end, as `(start acceptor)` will immediately yield and Platform.sh requires applications to run in the foreground.

{{< repolist lang="lisp" >}}
