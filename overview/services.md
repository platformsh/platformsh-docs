# Platform.sh services 

Each Platform.sh project or "platform" as we call it sometimes is composed of 
one or more applications (configured through `.platform.app.yaml`) and zero or 
more services. Those services are defined and configured in a configuration file
called [.platform/services.yaml](../../user_guide/reference/services-yaml.html)).

Services are common to the whole project but you can configure for each
application in its `.platform.app.yaml` how this service will be called, and
whether or not it should be available. Unlike other cloud hosting services
these are not external add-ons: they run on the same infrastructure. So a
cluster backup contains all the data from all the services. 

And when you clone a project you get everything in a consistent state.

We add new services, and new service versions all the time.


## Kafka (Message Queue service)
An ever higher throughput message queue!

# Internal Services

These are automatically deployed with your application.

## Router service

This is a default service that exists in all projects.

Based on nginx, the Router service processes HTTP requests, handles security,
dynamic page construction (ESI), URL rewriting and mapping. 

It supports caching, so you do not need Varnish or an extra cache in front of it.

The configuration of the router service happens through the special [.platform/routes.yaml](../../user_guide/reference/routes-yaml.html) file

## PHP/HHVM service

Platform.sh can run multiple applications in the same project. As such each
application is considered to be a service by itself (which you can route to
in the `.platform/routes.yaml`) and which you can reference as a relationship
from another application in its `.platform.app.yaml`. 

We currently support PHP 5.4, PHP 5.5, PHP 5.6, PHP 7.0, HHVM, the APC and ZO+ opcode caches, 
and all major PHP extensions, rewriting, and mapping. Also, you can have a 
custom PHP.INI file.

## File system

Accessible transparently from PHP and mappable to a URL space by the Router
component. The file system is base on a highly available distributed storage
grid.
