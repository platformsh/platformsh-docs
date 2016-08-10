# Internal Services

These are automatically deployed with your application.

## Router

This is a default service that exists in all projects.

Based on nginx, the Router service processes HTTP requests, handles security,
dynamic page construction (SSI), URL rewriting and mapping.

It supports caching, so you do not need Varnish or an extra cache in front of it.

The configuration of the router service happens through the special
[.platform/routes.yaml](../../reference/routes-yaml.html) file

## File system

Accessible transparently from PHP and mappable to a URL space by the Router
component. The file system is base on a highly available distributed storage
grid.

## Stack service

Platform.sh can run multiple applications in the same project. As such each
application is considered to be a service by itself (which you can route to
in the [.platform/routes.yaml](../../reference/routes-yaml.html))
and which you can reference as a relationship from another application in its
`.platform.app.yaml`.

We currently support the following stacks:

* PHP
* HHVM
* Node.js
