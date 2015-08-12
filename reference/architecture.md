# Architecture

The Environments in [Platform.sh](https://platform.sh) rely on services.
Services are deployed inside highly restricted containers on a grid of servers.
Monitoring and fail-over happen automatically, behind the scene.

Services are grouped together in *virtual clusters*, and dynamically keep track
of each other.

![image](/images/service-grid.png)

> **note** > Platform.sh currently supports the following services: PHP, MySQL
(MariaDB), Solr, Redis, Postgres, MongoDB. Additional services will be
available soon.

## Micro containers

Platform.sh uses LXC containers for applications. Each container provides a
secure space to run one application. Each environment is built from many
containers - one for the router, another for the PHP service, a third for the
database and so on. 

## Services


## Network Overlay

## Multiple Applications
