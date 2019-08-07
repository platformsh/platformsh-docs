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

# Accessing Services

The services configuration is available in the environment variable `PLATFORM_RELATIONSHIPS`. 

Add to your `.asd` file the dependency

```lisp
:depends-on (:jsown :babel :s-base64)
````

The following is an example of accessing a postgresql instance:

```lisp
(defun relationships ()
  (jsown:parse
   (babel:octets-to-string
    (with-input-from-string (in (uiop:getenv "PLATFORM_RELATIONSHIPS"))
      (s-base64:decode-base64-bytes in)))))
```

If you were to define a Postgresql service and would have in you `.platform.app.yaml`

```yaml
relationships:
  pg: postgresql:postgresql
```

The following would be an example of accessing a postgresql instance, first add to you `.asd` file:

```lisp
:depends-on (:postmodern)
````

Then in your program you could access the postgresql instance as such:

```lisp
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

Platform.sh offers a project templates for Lisp applications using the structure described above.  It can be used as a starting point or reference for building your own website or web application.

The following is a simple example of a Hunchentoot based web application (you can find the corresponding `.asd` and Platform.sh `.yaml` files in the linked Github respository):

```lisp
(defpackage #:example
  (:use :hunchentoot :cl-who :cl)
  (:export main))

(in-package #:example)

(define-easy-handler (greet :uri "/hello") (name)
  (with-html-output-to-string (s) (htm (:body (:h1 "hello, " (str name))))))

(export 'main)
(defun main ()
  (let ((acceptor (make-instance
                   'easy-acceptor
                   :port (parse-integer (uiop:getenv "PORT")))))
    (start acceptor)
    (sleep most-positive-fixnum)))
```

The main two things to notice is how we get the `PORT` from the environment, and how we sleep at the end as `(start acceptor)` will immediatly yield and Platform.sh requires applications to run in the foreground.

[Hunchentoot Lisp application](https://github.com/platformsh/template-lisp)
