# Architecture

The Environments in [Platform.sh](https://platform.sh) rely on services.
Services are deployed inside highly restricted containers on a grid of servers.
Monitoring and fail-over happen automatically, behind the scene.

Services are grouped together in *virtual clusters*, and dynamically keep track
of each other.

![image](/images/service-grid.png)

> **note** > Platform.sh currently supports the following services: PHP, MySQL
(MariaDB), Solr, Redis, Postgres, Elastic Search, MongoDB. Additional services 
will be available soon.

## Micro containers

Platform.sh uses LXC containers for applications. Each container provides a
secure space to run one application. Each environment is built from many
containers - one for the router, another for the PHP service, a third for the
database and so on. 

## Services
Each element of the project is run in its own container and they are managed
together by our orchestration layer. 

Some services are built-in : like the HTTP router (handling incoming requests, but also caching and redirects). Or the PHP
application server the GIT server itself or the SSH service.

Some services you can add to your project (it happens through a simple configuration file).

You can even have multiple applications running in the same project .. so if 
you want to build a micro-service oriented architecture, with Platform.sh its
as easy as managing a monolithic application.


