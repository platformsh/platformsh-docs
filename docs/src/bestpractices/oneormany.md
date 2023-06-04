---
title: "From monoliths through headless to micro-services"
weight: 2
description: |
  Platform.sh supports running multiple application containers in a single environment.
---

{{% description %}}
Platform.sh supports a great variety of setups and allows you to mix and match. You can grow your application from a simple monolith (with a single application server) to more involved topologies with multiple applications separating backend from front-end, run workers next to your main application or go for a full micro-services architecture. 

We make it easy to build any of those and to move from one setup to another, choosing the right approach depends very much on your use-case. And what is true for your application is also true for its backing services. You can run a single database. Multiple databases inside a single instance. Multiple databases in multiple versions. This is true for relational databases but also search engines, message-queues. Any supported service.

Platform.sh also supports multiple way in which you can compose your architecture. You can have a single Git repository that describes the whole thing (a mono-repo approach) or you can divide your project to multiple repositories.

When you are building more involved projects on Platform.sh you may ask yourself if it is better to create one big project will multiple applications in it or have each application in its own project. This page will try to help you figure this out.

## Discrete projects

If your apps are discrete systems that are only incidentally related (such as because you wrote both of them), making them separate projects is often preferred. 

The main question is data not code. Even if multiple projects share 100% of the same code, but also have 100% separation of data they should be separate. Platform.sh provides the automation to deploy multiple projects from the same code base, so it does not involve more management on your part.

By design, Platform.sh **does not allow** an application from one project's environment to access services in another project other through HTTP. So that is the most structuring point. 

Discrete projects are appropriate if:

* The applications are for different customers/clients.
* The applications do not need to directly connect to the same database.
* Different teams are working on different applications.
* You want to develop true-microservices, where each microservice is fully stand-alone process with its own data.

If you are uncertain how your needs map to projects, it probably means they should be separate, discrete projects.

## Clustered applications

A clustered application is one where your project requires multiple "app services", written by you, but are all part of the same conceptual project.

What we call "clustered applications" here can vary from the simple headless architecture where front and back end are separated to micro-services where you can have dozens of different applications possibly in multiple runtimes and frameworks that compose a coherent whole. That is, removing one of the app services would render the others broken.

Unlike other cloud deployment options you don't need to worry about service discovery or complex "ingress controllers". It is very easy to configure the access from one service to another - and it is very easy to configure the incoming routes. You can have services that are only exposed to another service and others that are exposed to the internet.

In a clustered application, you either have [multiple `.platform.app.yaml`](../create-apps/multi-app.md) files in different directories with separate code bases that deploy separately or you have a single application that spawns one or more [worker instances](../create-apps/app-reference.md#workers) that run background processes.
(See the link for details on how to set those up.)

A Clustered application requires at least a {{< partial "plans/multiapp-plan-name" >}} plan.

With a clustered application, you often don't need multiple service instances.
The [MySQL, MariaDB](../add-services/mysql/_index.md),
and [Solr](../add-services/solr.md) services support defining multiple databases on a single service,
which is significantly more efficient than defining multiple services.
[Redis](../add-services/redis.md), [Memcached](../add-services/memcached.md),
[Elasticsearch](../add-services/elasticsearch.md), and [RabbitMQ](../add-services/rabbitmq.md)
natively support multiple bins, or queues, or indexes (the terminology varies) defined by the client application
as part of the request so they need no additional configuration on Platform.sh,
although they may need application configuration.

Clustered applications are appropriate if:

* You want one user-facing application and an entirely separate admin-facing application that are both operating on the same data.
* You want to have a user-facing application and a separate worker process (either the same code or separate) that handles background tasks.
* You want a single conceptual application written in multiple programming languages

## A note on "Multi-site" applications

Some Content Management Systems or other applications support running multiple logical "sites" off of a single code base.
Those usually works on Platform.sh depending on the configuration details of the application but are generally not recommended.
Often their multi-site logic is dependant on the domain name of the incoming request, which on Platform.sh varies by branch.
They also often recommend running multiple databases, which while supported just fine on Platform.sh makes the setup process for each site more difficult.

Leveraging multi-site capabilities of an application are appropriate if, and only if:

* There is only a single team working on all of the "sites" involved.
* All "sites" should be updated simultaneously as a single unit.
* Each individual site is relatively low traffic, such that the aggregate traffic is appropriate for your plan size.
* All sites really do use the same codebase with no variation, just different data.

If any of those isn't the case, discrete projects are a better long term plan.
