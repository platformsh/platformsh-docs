---
title: "{{% vendor/name %}} development environments"
weight: 2
sidebarTitle: "Dev environments"
description: "{{% names/dedicated-gen-2 %}} customers have a development environment for their project that consists of a {{% vendor/name %}} Grid project, typically provisioned by the {{% vendor/name %}} team to reflect the amount of storage in your contract. This environment provides you with all the DevOps, Continuous Integration, Continuous Deployment, and other workflow tooling of the professional product, but segregates the performance impacts from your production hardware."
---

## Architecture (Development Environments)

![{{% vendor/name %}} Professional architecture](/images/dedicated/PS-Arch-NoHA.svg "0.6")

## Default limits

The Development Environment for a {{% names/dedicated-gen-2 %}} project provides `production` and `staging` branches linked to the {{% names/dedicated-gen-2 %}} cluster
and 3 additional active environments for development.
This number can be increased if needed for an additional fee.

The default storage for {{% names/dedicated-gen-2 %}} contracts is 50GB per environment (production, staging, and each development environment).
This comprises total storage for your project and is inclusive of any databases, uploaded files,
writable application logging directories, search index cores, and so on.
The storage amount for your development environment reflects the amount in your Enterprise contract.

A project may have up to six (6) users associated with it at no additional charge.
Additional users may be added for an additional fee.
These users have access to both the Development environment and the {{% names/dedicated-gen-2 %}} cluster.

## Larger developments environments

By default, all containers in development environments are {{< partial "plans/default-dev-env-size" >}} sized, as they have limited traffic needs.
For more resource-intensive applications this size can be increased for an additional fee.
